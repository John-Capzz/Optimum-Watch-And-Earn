import Score from '../models/Score.js';

function getWeek(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
}

export const initLeaderboard = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_leaderboard', () => {
      socket.join('leaderboard');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  setInterval(async () => {
    try {
      const now = new Date();
      const week = getWeek(now);
      const year = now.getFullYear();

      const regions = await Score.aggregate([
        { $match: { week, year, isFirstAttempt: true } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $group: { _id: '$user.region', totalPoints: { $sum: '$total' }, members: { $addToSet: '$userId' } } },
        { $project: { totalPoints: 1, memberCount: { $size: '$members' } } },
        { $sort: { totalPoints: -1 } }
      ]);

      io.to('leaderboard').emit('leaderboard_update', { regions });
    } catch (err) {
      console.error('Leaderboard emit error:', err);
    }
  }, 30000);
};