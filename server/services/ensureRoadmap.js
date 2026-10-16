import Day from '../models/Day.js';
import { roadmap } from '../data/roadmap.js';

// Create missing days only. Never overwrite existing progress, quizzes or scores.
export async function ensureRoadmap() {
  const existing = await Day.distinct('day');
  const missing = roadmap.filter(item => !existing.includes(item.day));
  if (missing.length) {
    await Day.bulkWrite(missing.map(item => ({
      updateOne: {
        filter: { day: item.day },
        update: { $setOnInsert: item },
        upsert: true
      }
    })), { ordered: false });
  }
  // Existing records predate the capstone task fix. Repair only uncompleted
  // video placeholder tasks on video-free capstone days; preserve identifiers,
  // completion, recorded minutes, project submissions and quiz attempts.
  let repaired = 0;
  const capstoneDays = await Day.find({
    day: { $in: [48, 49, 50] },
    daySubmitted: { $ne: true },
    'tasks.type': 'video'
  });
  for (const day of capstoneDays) {
    if (day.videos.length) continue;
    const source = roadmap.find(entry => entry.day === day.day);
    const replacement = source?.tasks.find(task => task.type === 'practice');
    if (!replacement) continue;
    const legacy = day.tasks.find(task =>
      task.type === 'video' && task.label === 'Course Videos' && !task.completed
    );
    if (!legacy) continue;
    legacy.type = replacement.type;
    legacy.label = replacement.label;
    legacy.title = replacement.title;
    await day.save();
    repaired++;
  }
  return { configured: roadmap.length, added: missing.length, repaired,
    total: await Day.countDocuments() };
}
