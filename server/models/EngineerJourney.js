import mongoose from 'mongoose';

const quizAttempt = new mongoose.Schema({ score: Number, total: Number, submittedAt: { type: Date, default: Date.now } }, { _id: false });
const lesson = new mongoose.Schema({
  lessonId: { type: String, required: true },
  deepLink: String,
  watchedAt: Date,
  quizAttempts: { type: [quizAttempt], default: [] }
}, { _id: false });
const project = new mongoose.Schema({
  moduleId: String, filename: String, code: String, githubUrl: String,
  confirmations: { type: [Boolean], default: [] },
  submittedAt: Date,
  status: { type: String, default: 'not-started' }
}, { _id: false });
const day = new mongoose.Schema({
  day: Number, studyMinutes: { type: Number, default: 0 }, completedAt: Date
}, { _id: false });

const schema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'single-learner' },
  startDate: { type: String, default: '2026-10-19' },
  lessons: { type: [lesson], default: [] },
  moduleTests: { type: [{ moduleId: String, attempts: { type: [quizAttempt], default: [] } }], default: [] },
  projects: { type: [project], default: [] },
  days: { type: [day], default: [] }
}, { timestamps: true });

export default mongoose.model('EngineerJourney', schema);
