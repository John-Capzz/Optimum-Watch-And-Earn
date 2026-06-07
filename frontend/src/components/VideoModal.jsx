import { useAuth } from '../context/AuthContext';
import QuizEngine from './QuizEngine';
import { useState, useEffect, useRef } from 'react';

export default function VideoModal({ video, onClose, index = 0 }) {
  const { user } = useAuth();
  const [playerReady, setPlayerReady] = useState(false);
  const [watchSecs, setWatchSecs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const gate = video?.watchGate || 120;

  useEffect(() => {
    if (!video || !user?.subscribed) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: video.youtubeId,
        playerVars: { autoplay: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              intervalRef.current = setInterval(() => {
                setWatchSecs(prev => prev + 1);
              }, 1000);
            } else {
              setPlaying(false);
              clearInterval(intervalRef.current);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      clearInterval(intervalRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [video, user?.subscribed]);

  if (!video) return null;

  // Subscribe gate — show subscribe prompt if not subscribed
  if (!user?.subscribed) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px'
      }}>
        <div style={{
          background: '#161616', border: '1px solid rgba(245,197,24,0.15)',
          borderRadius: '14px', width: '100%', maxWidth: '380px',
          padding: '28px 24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
          <div style={{ fontFamily: 'serif', fontSize: '20px', letterSpacing: '1px', color: '#F5C518', marginBottom: '8px' }}>
            SUBSCRIBE FIRST
          </div>
          <div style={{ fontSize: '12px', color: '#777', lineHeight: 1.7, marginBottom: '20px' }}>
            Subscribe to the Optimum YouTube channel to unlock videos, quizzes, and earn your first{' '}
            <strong style={{ color: '#F5C518' }}>+500 bonus points</strong>.
          </div>
          <SubscribeGateButton onClose={onClose} />
          <button onClick={onClose} style={{
            width: '100%', marginTop: '10px', background: 'none',
            border: '1px solid rgba(255,255,255,0.08)', color: '#555',
            borderRadius: '8px', padding: '9px', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit'
          }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '20px 12px', zIndex: 1000, overflowY: 'auto'
    }}>
      <div style={{
        background: '#161616', border: '1px solid rgba(245,197,24,0.15)',
        borderRadius: '14px', width: '100%', maxWidth: '620px'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 15px', borderBottom: '1px solid rgba(245,197,24,0.15)'
        }}>
          <div style={{ fontFamily: 'serif', fontSize: '14px', letterSpacing: '1px', color: '#F5C518' }}>
            {video.isActive ? 'THIS WEEK' : 'ARCHIVE'} · {new Date(video.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0f0f0', borderRadius: '6px', padding: '4px 10px',
            fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit'
          }}>
            ✕ Close
          </button>
        </div>

        {/* YouTube Player */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
          <div id="yt-player" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Watch progress bar */}
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid rgba(245,197,24,0.15)',
          background: '#0e0e0e'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ fontSize: '10px', color: '#777', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Watch progress · quiz unlocks at {Math.floor(gate / 60)} min
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#F5C518' }}>
              {Math.floor(watchSecs / 60)}:{String(watchSecs % 60).padStart(2, '0')} / {Math.floor(gate / 60)}:00
            </div>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round((watchSecs / gate) * 100))}%`,
              background: '#F5C518', borderRadius: '2px', transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
            {watchSecs >= gate
              ? '✅ Quiz unlocked — start when ready'
              : playing
                ? `⏳ ${Math.floor((gate - watchSecs) / 60)}:${String((gate - watchSecs) % 60).padStart(2, '0')} until quiz unlocks`
                : '▶ Press play on the video above to start watching'}
          </div>
        </div>

        {/* Quiz zone */}
        <QuizEngine
          video={video}
          watchSecs={watchSecs}
          gate={gate}
          onComplete={onClose}
        />
      </div>
    </div>
  );
}

function SubscribeGateButton({ onClose }) {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubscribe = async () => {
    window.open('https://www.youtube.com/@OptimumTechYT', '_blank');
    setLoading(true);
    try {
      const axios = (await import('axios')).default;
      const res = await axios.post(`${API}/auth/subscribe`, {}, { withCredentials: true });
      updateUser(res.data.user);
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#22c55e' }}>
        ✅ Subscribed! +500 pts added. You can now watch and earn.
      </div>
    );
  }

  return (
    <button onClick={handleSubscribe} disabled={loading} style={{
      width: '100%', background: '#FF0000', color: '#fff', border: 'none',
      borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      {loading ? 'Opening YouTube...' : '▶ Subscribe on YouTube — Unlock +500 pts'}
    </button>
  );
}