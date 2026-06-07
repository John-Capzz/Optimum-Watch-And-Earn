import express from 'express';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ discordId: profile.id });
    if (!user) {
      user = await User.create({
        discordId: profile.id,
        username: profile.username,
        avatar: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : null,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

router.post('/region', authMiddleware, async (req, res) => {
  const { region } = req.body;
  const allowed = ['West Africa', 'East Africa', 'UK & Europe', 'North America', 'Diaspora'];
  if (!allowed.includes(region)) return res.status(400).json({ error: 'Invalid region' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { region },
      { returnDocument: 'after' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    if (req.user.subscribed) return res.json({ message: 'Already subscribed', user: req.user });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscribed: true, $inc: { totalPoints: 500 } },
      { returnDocument: 'after' }
    );
    res.json({ message: 'Subscribed! +500 pts', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});

export { authMiddleware };
export default router;