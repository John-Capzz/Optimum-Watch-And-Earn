# Optimum Watch & Earn 🎯

A community engagement platform that rewards the Optimum community for watching YouTube videos, completing quizzes, and competing on a live regional leaderboard.

## 🌍 Live Demo
**[optimum-watch-and-earn.vercel.app](https://optimum-watch-and-earn.vercel.app)**

---

## 🎮 How It Works

1. **Sign in** with your Discord account
2. **Subscribe** to the Optimum YouTube channel — earn +500 bonus points
3. **Pick your region** — West Africa, East Africa, UK & Europe, North America, or Diaspora
4. **Watch** this week's Optimum video — quiz unlocks after 2 minutes
5. **Take the quiz** — 5 questions, 20 seconds each, speed bonuses for fast answers
6. **Earn points** — base points + speed bonus + streak bonus
7. **Compete** on the live regional leaderboard

---

## ✨ Features

- **Discord OAuth2** — login with Discord, profile picture and name pulled automatically
- **YouTube Watch Gate** — quiz stays locked until minimum watch time is reached
- **AI Quiz Generation** — auto-generate quiz questions from video transcripts using Groq (LLaMA 3)
- **Speed Bonuses** — faster answers earn more points
- **Streak System** — consecutive weeks earn bonus multipliers
- **Regional Leaderboard** — live Socket.io powered standings across 5 regions
- **Netflix-style Hub** — browse this week's live quiz and previous video archive
- **Admin Panel** — pin active video, add/edit quiz questions, view platform stats
- **Weekly Reset** — leaderboard resets every Sunday, new video = new quiz event

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | Discord OAuth2 + JWT |
| Real-time | Socket.io |
| Video | YouTube IFrame API + YouTube Data API v3 |
| AI | Groq API (LLaMA 3.3 70B) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Discord Developer App
- YouTube Data API key
- Groq API key

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=4001
CLIENT_URL=http://localhost:5174
MONGO_URI=your_mongodb_connection_string
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:4001/auth/discord/callback
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:4001
VITE_CLIENT_URL=http://localhost:5174
```

```bash
npm run dev
```

Open `http://localhost:5174`

---

## 📁 Project Structure

```
optimum-watch-earn/
├── backend/
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── models/        # User, Video, Score schemas
│       ├── routes/        # Auth, Videos, Quiz API routes
│       ├── socket/        # Socket.io leaderboard events
│       ├── jobs/          # YouTube sync + weekly reset cron
│       └── index.js       # Express app entry point
│
└── frontend/
    └── src/
        ├── components/    # Topbar, VideoGrid, VideoModal, QuizEngine, Leaderboard, Profile
        ├── pages/         # Login, RegionSelect, Hub, Admin, AuthCallback
        ├── context/       # AuthContext with JWT management
        └── App.jsx        # Routes
```



---

## 🔐 Environment Variables

### Backend (Railway)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (4001) |
| `CLIENT_URL` | Frontend URL |
| `MONGO_URI` | MongoDB Atlas connection string |
| `DISCORD_CLIENT_ID` | Discord OAuth2 client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret |
| `DISCORD_CALLBACK_URL` | Discord OAuth2 callback URL |
| `SESSION_SECRET` | Express session secret |
| `JWT_SECRET` | JWT signing secret |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `YOUTUBE_CHANNEL_ID` | Optimum YouTube channel ID |
| `GROQ_API_KEY` | Groq API key for quiz generation |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend Railway URL |
| `VITE_CLIENT_URL` | Frontend Vercel URL |

---

## 👨‍💻 Built By

Built by **Capzz** for the Optimum community.

---

## 📄 License

MIT
