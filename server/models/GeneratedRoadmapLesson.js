import mongoose from 'mongoose';

const codeExample = new mongoose.Schema({
  language: { type: String, enum: ['python', 'javascript', 'java'], required: true },
  code: { type: String, required: true },
  expectedOutput: { type: String, default: '' },
  explanation: { type: String, default: '' }
}, { _id: false });

const task = new mongoose.Schema({
  level: { type: String, enum: ['Easy', 'Medium', 'Practical'], required: true },
  prompt: { type: String, required: true },
  hint: { type: String, default: '' },
  starterCode: { type: String, default: '' },
  testCases: { type: [{ input: String, expectedOutput: String }], default: [] }
}, { _id: false });

const quizQuestion = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
  explanation: String
}, { _id: false });

const generatedRoadmapLessonSchema = new mongoose.Schema({
  topicId: { type: String, unique: true, required: true, index: true },
  title: { type: String, required: true },
  phaseTitle: String,
  groupTitle: String,
  sectionTitle: String,
  outcomes: [String],
  theory: [{ heading: String, body: String, example: String }],
  flow: [String],
  codeExamples: { type: [codeExample], default: [] },
  tasks: { type: [task], default: [] },
  quiz: { type: [quizQuestion], default: [] },
  revisionSummary: String,
  generatedAt: { type: Date, default: Date.now },
  model: String
}, { timestamps: true });

export default mongoose.models.GeneratedRoadmapLesson || mongoose.model('GeneratedRoadmapLesson', generatedRoadmapLessonSchema);
