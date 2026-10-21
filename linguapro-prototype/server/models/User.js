import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254, index: true },
  passwordHash: { type: String, required: true, select: false },
  learningLanguage: { type: String, enum: ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu"], default: "English" },
  explanationLanguage: { type: String, enum: ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu"], default: "Tamil" },
  level: { type: String, enum: ["Basic", "Intermediate", "Advanced"], default: "Basic" },
  dailyGoalMinutes: { type: Number, enum: [10, 20, 30, 45], default: 20 },
  plan: { type: String, enum: ["free", "premium"], default: "free" },
  progress: {
    streakDays: { type: Number, default: 0, min: 0 },
    completedTasks: { type: Number, default: 0, min: 0 },
    speakingMinutes: { type: Number, default: 0, min: 0 },
    wordsLearned: { type: Number, default: 0, min: 0 }
  }
}, { timestamps: true, strict: "throw" });

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("LinguaProUser", userSchema);
