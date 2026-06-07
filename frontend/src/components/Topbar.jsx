import { useAuth } from '../context/AuthContext';

export default function Topbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#161616', borderBottom: '1px solid rgba(245,197,24,0.15)',
        padding: '10px 18px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontFamily: 'serif', fontSize: '20px', letterSpacing: '2px', color: '#F5C518' }}>
          OPTIMUM <span style={{ color: '#f0f0f0' }}>W&E</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.15)',
            borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#F5C518', fontWeight: 600
          }}>
            🔥 {user?.streak || 0} wks
          </div>
          <div style={{
            background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.15)',
            borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#999'
          }}>
            {user?.region}
          </div>
          <div style={{
            background: '#F5C518', color: '#000', borderRadius: '20px',
            padding: '3px 10px', fontSize: '11px', fontWeight: 700
          }}>
            {user?.totalPoints?.toLocaleString() || 0} pts
          </div>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', background: '#5865F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff',
            border: '2px solid #F5C518', overflow: 'hidden', cursor: 'pointer'
          }} onClick={() => setActiveTab('profile')}>
            {user?.avatar
              ? <img src={user.avatar} alt="av" style={{ width: '100%', height: '100%' }} />
              : user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <span
            onClick={() => setActiveTab('profile')}
            style={{ fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
          >
            {user?.username}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', background: '#161616',
        borderBottom: '1px solid rgba(245,197,24,0.15)', padding: '0 18px'
      }}>
        {['hub', 'leaderboard', 'profile'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '9px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            color: activeTab === tab ? '#F5C518' : '#777',
            borderBottom: activeTab === tab ? '2px solid #F5C518' : '2px solid transparent',
            background: 'none', border: 'none',
            borderBottom: activeTab === tab ? '2px solid #F5C518' : '2px solid transparent',
            fontFamily: 'inherit'
          }}>
            {tab === 'hub' ? 'Watch & Earn' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button onClick={logout} style={{
          marginLeft: 'auto', padding: '9px 16px', fontSize: '12px',
          color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}