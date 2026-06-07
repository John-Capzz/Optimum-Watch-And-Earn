import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user?._id) {
      axios.get(`${API}/api/quiz/history/${user._id}`, { withCredentials: true })
        .then(res => setHistory(res.data))
        .catch(console.error);
    }
  }, [user]);

  const weeks = Array.from({ length: 10 }, (_, i) => `W${i + 1}`);

  return (
    <div style={{ padding: '16px 18px' }}>
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(245,197,24,0.15)', borderRadius: '11px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff', border: '3px solid #F5C518', overflow: 'hidden', flexShrink: 0 }}>
          {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%' }} /> : user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{user?.username}</div>
          <div style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>Discord verified</div>
          <div style={{ fontSize: '11px', color: '#F5C518', fontWeight: 600, marginTop: '4px' }}>{user?.region}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { val: user?.totalPoints?.toLocaleString() || 0, lbl: 'Total points' },
          { val: user?.streak || 0, lbl: 'Week streak' },
          { val: history.length, lbl: 'Videos watched' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '11px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'serif', fontSize: '22px', color: '#F5C518', letterSpacing: '1px' }}>{s.val}</div>
            <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#777', letterSpacing: '1px', marginBottom: '10px' }}>ATTENDANCE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: '4px' }}>
          {weeks.map((w, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 600,
              background: i < (user?.streak || 0) ? 'rgba(245,197,24,0.18)' : 'rgba(255,255,255,0.04)',
              color: i < (user?.streak || 0) ? '#F5C518' : '#555',
              border: i < (user?.streak || 0) ? '1px solid rgba(245,197,24,0.15)' : '1px solid rgba(255,255,255,0.06)'
            }}>{w}</div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '11px', fontWeight: 600, color: '#777', letterSpacing: '1px', marginBottom: '8px' }}>QUIZ HISTORY</div>
      <div style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
        {history.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#555' }}>No quiz history yet — watch a video and take the quiz!</div>
        ) : history.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 500 }}>{s.videoId?.title?.slice(0, 40)}...</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F5C518', textAlign: 'center' }}>{s.total}</div>
            <div style={{ fontSize: '11px', color: '#777', textAlign: 'right' }}>{s.accuracy}</div>
          </div>
        ))}
      </div>
    </div>
  );
}