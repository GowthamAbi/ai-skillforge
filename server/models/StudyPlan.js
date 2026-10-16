import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true, immutable: true },
  startDate: { type: String, default: null },
  pausedDates: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);
