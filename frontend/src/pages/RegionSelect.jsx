import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;
const REGIONS = [
  { name: 'West Africa', flag: '🌍' },
  { name: 'East Africa', flag: '🌏' },
  { name: 'UK & Europe', flag: '🇬🇧' },
  { name: 'North America', flag: '🌎' },
  { name: 'Diaspora', flag: '🌐' },
];

export default function RegionSelect() {
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const confirm = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/region`, { region: selected }, { withCredentials: true });
      updateUser(res.data);
      navigate('/hub');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0e0e0e', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#161616', border: '1px solid rgba(245,197,24,0.15)',
        borderRadius: '14px', width: '300px', padding: '24px', textAlign: 'center'
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%', background: '#5865F2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 auto 10px',
          border: '3px solid #F5C518', overflow: 'hidden'
        }}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            : user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{user?.username}</div>
        <div style={{ fontSize: '11px', color: '#777', marginBottom: '18px' }}>Discord verified</div>
        <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>PICK YOUR REGION</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '16px' }}>
          {REGIONS.map(r => (
            <button key={r.name} onClick={() => setSelected(r.name)} style={{
              background: selected === r.name ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.04)',
              border: selected === r.name ? '1px solid #F5C518' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer',
              textAlign: 'left', color: '#f0f0f0', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>{r.flag}</span> {r.name}
            </button>
          ))}
        </div>
        <button onClick={confirm} disabled={!selected || loading} style={{
          background: selected ? '#F5C518' : 'rgba(245,197,24,0.3)',
          color: '#000', border: 'none', borderRadius: '8px', padding: '11px',
          fontSize: '13px', fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed',
          width: '100%'
        }}>
          {loading ? 'Joining...' : 'Join the competition →'}
        </button>
      </div>
    </div>
  );
}