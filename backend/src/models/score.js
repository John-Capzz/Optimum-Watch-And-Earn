import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  basePoints:  { type: Number, default: 0 },
  speedBonus:  { type: Number, default: 0 },
  streakBonus: { type: Number, default: 0 },
  total:       { type: Number, default: 0 },
  accuracy:    { type: String },
  rank:        { type: Number, default: null },
  isFirstAttempt: { type: Boolean, default: true },
  week:        { type: Number },
  year:        { type: Number },
}, { timestamps: true });

scoreSchema.index({ userId: 1, videoId: 1 });

export default mongoose.model('Score', scoreSchema);