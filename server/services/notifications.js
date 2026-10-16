import Day from '../models/Day.js';
import StudyPlan from '../models/StudyPlan.js';
import PushSubscription from '../models/PushSubscription.js';
import { getStudySchedule } from '../utils/studySchedule.js';
import { studyAlert } from './emailService.js';

const vapidReady = () => Boolean(
  process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_SUBJECT
);

let webPushClient;
async function webPush() {
  if (!vapidReady()) return null;
  if (!webPushClient) {
    const mod = await import('web-push');
    webPushClient = mod.default || mod;
    webPushClient.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
  return webPushClient;
}

export function notificationSettings() {
  return {
    pushConfigured: vapidReady(),
    publicKey: vapidReady() ? process.env.VAPID_PUBLIC_KEY : null,
    emailConfigured: Boolean(
      process.env.STUDY_EMAIL && process.env.EMAIL_USER && process.env.EMAIL_PASS
    ),
    reminderTime: '21:00',
    timezone: 'Asia/Kolkata'
  };
}

export async function saveSubscription(subscription) {
  const endpoint = subscription?.endpoint;
  const keys = subscription?.keys;
  if (
    typeof endpoint !== 'string' || endpoint.length > 2048 ||
    !endpoint.startsWith('https://') ||
    typeof keys?.auth !== 'string' || typeof keys?.p256dh !== 'string'
  ) throw new Error('Invalid browser push subscription');
  return PushSubscription.updateOne(
    { endpoint },
    { $set: { subscription } },
    { upsert: true }
  );
}

export async function sendDailyReminders(now = new Date()) {
  const scheduleDoc = await StudyPlan.findOne({ key: 'default' }).lean();
  const schedule = getStudySchedule(scheduleDoc?.startDate, scheduleDoc?.pausedDates || [], now);
  if (!schedule.started || schedule.status !== 'active') return { skipped: schedule.status };
  const today = schedule.today;
  const day = await Day.findOne({ daySubmitted: false }).sort({ day: 1 }).lean();
  if (!day) return { skipped: 'finished' };
  if (day.day > (schedule.todaysDay || 0)) return { skipped: 'not-due' };

  // Email remains a separate fallback for users without browser push.
  await studyAlert(day).catch(error => console.error('Reminder email failed:', error.message));
  const push = await webPush();
  if (!push) return { emailOnly: true };
  const subscribers = await PushSubscription.find({
    lastNotifiedDate: { $ne: today }
  }).lean();
  const payload = JSON.stringify({
    title: 'AI SkillForge · Time to study',
    body: 'Day ' + day.day + ': ' + day.topic + '. Your 9 PM study plan is ready.',
    url: '/'
  });
  let delivered = 0;
  for (const subscriber of subscribers) {
    try {
      await push.sendNotification(subscriber.subscription, payload, { TTL: 3600 });
      await PushSubscription.updateOne(
        { _id: subscriber._id }, { $set: { lastNotifiedDate: today } }
      );
      delivered += 1;
    } catch (error) {
      if ([404, 410].includes(error.statusCode)) {
        await PushSubscription.deleteOne({ _id: subscriber._id });
      } else {
        console.error('Push send failed:', error.message);
      }
    }
  }
  return { delivered };
}

export function startReminderScheduler() {
  let checking = false;
  const tick = async () => {
    if (checking) return;
    // Compare India-local parts rather than server timezone.
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', hourCycle: 'h23', hour: '2-digit', minute: '2-digit'
    }).formatToParts(new Date());
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    if (hour !== '21' || minute !== '00') return;
    checking = true;
    try { await sendDailyReminders(); }
    catch (error) { console.error('Study reminder failed:', error.message); }
    finally { checking = false; }
  };
  const timer = setInterval(tick, 30_000);
  timer.unref?.();
  tick();
}
