import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, authHeaders } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/quiz/leaderboard`, authHeaders())
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div style={{ padding: '20px', color: '#777' }}>Loading leaderboard...</div>;

  const maxPts = data.regions?.[0]?.totalPoints || 1;

  return (
    <div style={{ padding: '16px 18px' }}>
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(245,197,24,0.15)', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'serif', fontSize: '16px', letterSpacing: '1px', color: '#F5C518' }}>REGIONAL STANDINGS</div>
          <div style={{ fontSize: '11px', color: '#777', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            Live · resets Sunday
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '16px' }}>
        {data.regions?.map((r, i) => (
          <div key={r._id} style={{
            background: '#1e1e1e',
            border: r._id === user?.region ? '1px solid #F5C518' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '9px', padding: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{r._id}</div>
              <div style={{ fontFamily: 'serif', fontSize: '18px', color: '#F5C518' }}>#{i + 1}</div>
            </div>
            <div style={{ fontFamily: 'serif', fontSize: '22px', letterSpacing: '1px' }}>{r.totalPoints?.toLocaleString()}</div>
            <div style={{ fontSize: '9px', color: '#777', marginTop: '2px' }}>pts this week</div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round(r.totalPoints / maxPts * 100)}%`, background: i === 0 ? '#F5C518' : i === 1 ? '#aaa' : '#cd7f32', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '5px' }}>{r.memberCount} members</div>
            {r._id === user?.region && <div style={{ fontSize: '9px', color: '#F5C518', fontWeight: 600, marginTop: '3px' }}>Your region</div>}
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'serif', fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>TOP PLAYERS THIS WEEK</div>
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 60px', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', color: '#666', fontWeight: 600 }}>
          <div>#</div><div>Player</div><div style={{ textAlign: 'right' }}>Points</div><div style={{ textAlign: 'right' }}>Streak</div>
        </div>
        {data.scores?.map((s, i) => (
          <div key={s._id} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 80px 60px',
            padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)',
            alignItems: 'center',
            background: s.user?.discordId === user?.discordId ? 'rgba(245,197,24,0.05)' : 'transparent'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: i < 3 ? '#F5C518' : '#666' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
                {s.user?.avatar ? <img src={s.user.avatar} style={{ width: '100%', height: '100%' }} alt="av" /> : s.user?.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 500 }}>{s.user?.username}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>{s.user?.region}</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F5C518', textAlign: 'right' }}>{s.weeklyTotal?.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#666', textAlign: 'right' }}>🔥 {s.user?.streak}w</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}