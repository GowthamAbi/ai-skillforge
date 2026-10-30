import mongoose from 'mongoose';

const codeAttemptSchema = new mongoose.Schema({
  language: { type: String, enum: ['python', 'javascript', 'java'], required: true },
  code: { type: String, required: true, maxlength: 30000 },
  stdin: { type: String, default: '', maxlength: 10000 },
  stdout: { type: String, default: '' },
  stderr: { type: String, default: '' },
  exitCode: { type: Number, default: null },
  status: { type: String, enum: ['success', 'runtime-error', 'compile-error', 'timeout', 'runner-error'], required: true },
  durationMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const roadmapCodeWorkspaceSchema = new mongoose.Schema({
  topicId: { type: String, unique: true, required: true, index: true },
  language: { type: String, enum: ['python', 'javascript', 'java'], default: 'python' },
  codeDrafts: {
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  attempts: { type: [codeAttemptSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.RoadmapCodeWorkspace || mongoose.model('RoadmapCodeWorkspace', roadmapCodeWorkspaceSchema);
