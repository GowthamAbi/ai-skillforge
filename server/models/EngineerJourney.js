import mongoose from 'mongoose';

const quizAttempt = new mongoose.Schema({ score: Number, total: Number, submittedAt: { type: Date, default: Date.now } }, { _id: false });
const lesson = new mongoose.Schema({ lessonId: { type: String, required: true }, deepLink: String, watchedAt: Date, quizAttempts: { type: [quizAttempt], default: [] } }, { _id: false });
const project = new mongoose.Schema({ moduleId: String, filename: String, code: String, githubUrl: String, confirmations: { type: [Boolean], default: [] }, submittedAt: Date, status: { type: String, default: 'not-started' } }, { _id: false });
const day = new mongoose.Schema({ day: Number, studyMinutes: { type: Number, default: 0 }, completedAt: Date }, { _id: false });
const customCourse = new mongoose.Schema({ id: { type: String, required: true }, title: { type: String, required: true }, instructor: String, url: String, account: Number, priority: { type: String, enum: ['core', 'supporting', 'optional'], default: 'supporting' }, category: String, archivedAt: Date, createdAt: { type: Date, default: Date.now } }, { _id: false });
const customLesson = new mongoose.Schema({ id: { type: String, required: true }, courseId: { type: String, required: true }, title: { type: String, required: true }, videoUrl: String, durationMinutes: { type: Number, required: true }, category: String, practiceTask: String, assignedDay: Number, skippedAt: Date, archivedAt: Date, createdAt: { type: Date, default: Date.now } }, { _id: false });
const roadmapTopicProgress = new mongoose.Schema({ topicId: { type: String, required: true }, completedStages: { type: [String], default: [] }, completed: { type: Boolean, default: false }, completedAt: Date, updatedAt: { type: Date, default: Date.now } }, { _id: false });

const schema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'single-learner' },
  startDate: { type: String, default: '2026-10-19' },
  lessons: { type: [lesson], default: [] },
  customCourses: { type: [customCourse], default: [] },
  customLessons: { type: [customLesson], default: [] },
  aiRoadmapProgress: { type: [roadmapTopicProgress], default: [] },
  moduleTests: { type: [{ moduleId: String, attempts: { type: [quizAttempt], default: [] } }], default: [] },
  projects: { type: [project], default: [] },
  days: { type: [day], default: [] }
}, { timestamps: true });

export default mongoose.model('EngineerJourney', schema);
