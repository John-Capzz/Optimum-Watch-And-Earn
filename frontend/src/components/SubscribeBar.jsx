import { useState } from 'react';
import axios from 'axios';
import { useAuth, authHeaders } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function SubscribeBar() {
  const { user, updateUser } = useAuth();
  const [done, setDone] = useState(false);

  if (user?.subscribed || done) {
    return (
      <div style={{
        background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.18)',
        padding: '8px 18px', fontSize: '11px', color: '#22c55e',
        display: 'flex', alignItems: 'center', gap: '7px'
      }}>
        ✅ Subscribed to Optimum — +500 pts added to your score
      </div>
    );
  }

  const handleSubscribe = async () => {
    window.open('https://youtube.com/@OptimumYT', '_blank');
    try {
      const res = await axios.post(`${API}/auth/subscribe`, {}, authHeaders());
      updateUser(res.data.user);
      setDone(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      background: 'rgba(88,101,242,0.1)', borderBottom: '1px solid rgba(88,101,242,0.22)',
      padding: '9px 18px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px'
    }}>
      <div style={{ fontSize: '11px', color: '#a5aaef' }}>
        <strong style={{ color: '#fff' }}>First step:</strong> Subscribe to the Optimum YouTube channel and earn{' '}
        <strong style={{ color: '#F5C518' }}>+500 bonus points</strong>
      </div>
      <button onClick={handleSubscribe} style={{
        background: '#FF0000', color: '#fff', border: 'none', borderRadius: '6px',
        padding: '6px 14px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', whiteSpace: 'nowrap'
      }}>
        ▶ Subscribe on YouTube
      </button>
    </div>
  );
}