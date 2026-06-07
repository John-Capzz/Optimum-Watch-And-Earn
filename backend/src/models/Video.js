import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String }],
  answer:   { type: Number, required: true },
  points:   { type: Number, default: 100 },
});

const videoSchema = new mongoose.Schema({
  youtubeId:    { type: String, required: true, unique: true },
  title:        { type: String, required: true },
  thumbnail:    { type: String },
  publishedAt:  { type: Date },
  isActive:     { type: Boolean, default: false },
  watchGate:    { type: Number, default: 120 },
  questions:    [questionSchema],
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);