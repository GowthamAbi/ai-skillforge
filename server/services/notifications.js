import Day from '../models/Day.js';
import StudyPlan from '../models/StudyPlan.js';
import PushSubscription from '../models/PushSubscription.js';
import { getStudySchedule } from '../utils/studySchedule.js';
import { studyAlert } from './emailService.js';
import EngineerJourney from '../models/EngineerJourney.js';
import { PATH_DAYS } from '../data/pathCurriculum.js';

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

export async function saveSubscription(subscription, mode = 'old') {
  const endpoint = subscription?.endpoint;
  const keys = subscription?.keys;
  if (
    typeof endpoint !== 'string' || endpoint.length > 2048 ||
    !endpoint.startsWith('https://') ||
    typeof keys?.auth !== 'string' || typeof keys?.p256dh !== 'string'
  ) throw new Error('Invalid browser push subscription');
  return PushSubscription.updateOne(
    { endpoint },
    { $set: { subscription, mode } },
    { upsert: true }
  );
}

export async function sendDailyReminders(now = new Date()) {
  const scheduleDoc = await StudyPlan.findOne({ key: 'default' }).lean();
  const schedule = getStudySchedule(scheduleDoc?.startDate, scheduleDoc?.pausedDates || [], now);
  const today = schedule.today;
  const oldDay = schedule.started && schedule.status === 'active'
    ? await Day.findOne({ daySubmitted: false }).sort({ day: 1 }).lean() : null;
  const oldActive = Boolean(oldDay && oldDay.day <= (schedule.todaysDay || 0));
  const path = await EngineerJourney.findOne({ key: 'single-learner' }).lean();
  const pathDay = path && today >= path.startDate
    ? PATH_DAYS.find(day => !path.days?.find(entry => entry.day === day.day && entry.completedAt)) : null;
  if (!oldActive && !pathDay) return { skipped: 'no-active-plan' };

  // Preserve existing Old SkillForge reminder behavior and email fallback.
  if (oldActive) await studyAlert(oldDay).catch(error => console.error('Reminder email failed:', error.message));
  const push = await webPush();
  if (!push) return { emailOnly: true };
  const subscribers = await PushSubscription.find({
    lastNotifiedDate: { $ne: today }
  }).lean();
  let delivered = 0;
  for (const subscriber of subscribers) {
    const isPath = subscriber.mode === 'path';
    if ((isPath && !pathDay) || (!isPath && !oldActive)) continue;
    const payload = JSON.stringify(isPath ? {
      title: 'AI Engineer Path · Your 4-hour session',
      body: `Day ${pathDay.day}: ${pathDay.topic}. Open your videos and free quizzes anytime tonight.`,
      url: '/#/path'
    } : {
      title: 'AI SkillForge · Time to study',
      body: 'Day ' + oldDay.day + ': ' + oldDay.topic + '. Your 9 PM study plan is ready.',
      url: '/#/old'
    });
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
