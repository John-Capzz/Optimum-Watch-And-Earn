import express from 'express';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
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

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/region`);
  }
);

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user);
});

router.post('/region', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
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

router.post('/subscribe', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
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
  req.logout(() => res.redirect(process.env.CLIENT_URL));
});

export default router;