import express from 'express';
import Score from '../models/Score.js';
import Video from '../models/Video.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { videoId, answers, timings } = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const existing = await Score.findOne({ userId: req.user._id, videoId, isFirstAttempt: true });

    let basePoints = 0, speedBonus = 0, correct = 0;
    video.questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
        basePoints += q.points;
        const timeLeft = timings?.[i] ?? 0;
        speedBonus += Math.max(0, Math.round((timeLeft / 20) * q.points * 0.8));
      }
    });

    const user = await User.findById(req.user._id);
    const streakBonus = user.streak >= 3 ? 200 : user.streak >= 2 ? 100 : 0;
    const total = basePoints + speedBonus + streakBonus;
    const now = new Date();

    if (!existing) {
      await Score.create({
        userId: req.user._id,
        videoId,
        basePoints,
        speedBonus,
        streakBonus,
        total,
        accuracy: `${correct}/${video.questions.length}`,
        isFirstAttempt: true,
        week: getWeek(now),
        year: now.getFullYear(),
      });
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalPoints: total },
        lastWatched: now,
      });
    }

    res.json({ basePoints, speedBonus, streakBonus, total, correct, isFirstAttempt: !existing });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const now = new Date();
    const week = getWeek(now);
    const year = now.getFullYear();

    const scores = await Score.aggregate([
      { $match: { week, year, isFirstAttempt: true } },
      { $group: { _id: '$userId', weeklyTotal: { $sum: '$total' } } },
      { $sort: { weeklyTotal: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { weeklyTotal: 1, 'user.username': 1, 'user.avatar': 1, 'user.region': 1, 'user.streak': 1 } }
    ]);

    const regions = await Score.aggregate([
      { $match: { week, year, isFirstAttempt: true } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $group: { _id: '$user.region', totalPoints: { $sum: '$total' }, members: { $addToSet: '$userId' } } },
      { $project: { totalPoints: 1, memberCount: { $size: '$members' } } },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json({ scores, regions });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.userId, isFirstAttempt: true })
      .populate('videoId', 'title youtubeId')
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

function getWeek(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
}

export default router;