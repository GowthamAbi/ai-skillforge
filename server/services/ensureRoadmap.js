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
  return { configured: roadmap.length, added: missing.length, total: await Day.countDocuments() };
}
