import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  discordId:   { type: String, required: true, unique: true },
  username:    { type: String, required: true },
  avatar:      { type: String },
  region:      { type: String, default: null },
  subscribed:  { type: Boolean, default: false },
  totalPoints: { type: Number, default: 0 },
  streak:      { type: Number, default: 0 },
  lastWatched: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);