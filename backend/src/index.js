import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import quizRoutes from './routes/quiz.js';
import { initLeaderboard } from './socket/leaderboard.js';
import './jobs/sync.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

initLeaderboard(io);

server.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});