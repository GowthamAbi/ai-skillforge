import { Router } from 'express';
import StudyPlan from '../models/StudyPlan.js';
import { getStudySchedule, isValidISODate } from '../utils/studySchedule.js';

const router = Router();
const key = 'default'; // Single-learner app; authentication is not yet implemented.
const scheduleOf = doc => getStudySchedule(doc?.startDate, doc?.pausedDates || []);

router.get('/', async (req, res) => {
  try {
    res.json(scheduleOf(await StudyPlan.findOne({ key }).lean()));
  } catch (error) {
    res.status(500).json({ error: 'Could not load study plan' });
  }
});

router.post('/start', async (req, res) => {
  try {
    const { startDate } = req.body || {};
    if (!isValidISODate(startDate)) return res.status(400).json({ error: 'Use a real start date in YYYY-MM-DD format' });
    const plan = await StudyPlan.findOne({ key });
    if (plan?.startDate) return res.status(409).json({ error: 'Plan already started. Original progress is preserved.' });
    // Atomic start prevents simultaneous requests from overwriting a chosen start date.
    const created = await StudyPlan.findOneAndUpdate(
      { key, startDate: null },
      { $setOnInsert: { key }, $set: { startDate, pausedDates: [] } },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json({ message: 'Study plan started', schedule: scheduleOf(created) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: 'Plan already started' });
    res.status(500).json({ error: 'Could not start study plan' });
  }
});

router.post('/pause', async (req, res) => {
  try {
    const { date } = req.body || {};
    const plan = await StudyPlan.findOne({ key });
    if (!plan?.startDate) return res.status(409).json({ error: 'Start your plan first' });
    if (!isValidISODate(date) || date < plan.startDate) {
      return res.status(400).json({ error: 'Select a valid date on or after the start date' });
    }
    const saved = await StudyPlan.findOneAndUpdate(
      { key }, { $addToSet: { pausedDates: date } }, { new: true }
    );
    res.json({ message: date + ' paused. Remaining study dates are shifted.', schedule: scheduleOf(saved) });
  } catch (error) {
    res.status(500).json({ error: 'Could not pause study date' });
  }
});

router.post('/resume', async (req, res) => {
  try {
    const { date } = req.body || {};
    const plan = await StudyPlan.findOne({ key });
    if (!plan?.startDate) return res.status(409).json({ error: 'Start your plan first' });
    if (!isValidISODate(date)) return res.status(400).json({ error: 'Select a valid date' });
    const saved = await StudyPlan.findOneAndUpdate(
      { key }, { $pull: { pausedDates: date } }, { new: true }
    );
    res.json({ message: date + ' resumed. Study dates recalculated.', schedule: scheduleOf(saved) });
  } catch (error) {
    res.status(500).json({ error: 'Could not resume study date' });
  }
});

export default router;
