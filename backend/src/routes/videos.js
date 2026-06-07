import express from 'express';
import Video from '../models/Video.js';
import Groq from 'groq-sdk';
import { YoutubeTranscript } from 'youtube-transcript';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ publishedAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const video = await Video.findOne({ isActive: true });
    if (!video) return res.status(404).json({ error: 'No active video' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/pin', async (req, res) => {
  try {
    await Video.updateMany({}, { isActive: false });
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { returnDocument: 'after' }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/questions', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { questions: req.body.questions },
      { returnDocument: 'after' }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/generate-questions', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    let transcript = '';
    try {
      const transcriptArr = await YoutubeTranscript.fetchTranscript(video.youtubeId);
      transcript = transcriptArr.map(t => t.text).join(' ').slice(0, 6000);
    } catch (err) {
      return res.status(400).json({ error: 'Could not fetch transcript. This video may not have captions enabled.' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `You are creating a quiz for a YouTube video. Based on this transcript, generate exactly 5 multiple choice questions that can ONLY be answered by someone who watched this video. Return ONLY a valid JSON array, no markdown, no explanation, no extra text whatsoever.

Format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": 0,
    "points": 100
  }
]

The "answer" field is the index (0-3) of the correct option.
Use points: 100 for straightforward questions, 150 for harder ones.
Make questions specific to facts, numbers, names, or decisions mentioned in the video.

Transcript:
${transcript}`
      }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(raw);
    res.json({ questions });
  } catch (err) {
    console.error('Generate questions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;