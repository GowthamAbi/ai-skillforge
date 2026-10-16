import mongoose from 'mongoose';

const pushSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  subscription: { type: mongoose.Schema.Types.Mixed, required: true },
  lastNotifiedDate: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('PushSubscription', pushSchema);
