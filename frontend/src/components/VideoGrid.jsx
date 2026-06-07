const BG_COLORS = ['#0f2027','#1a0a2e','#0a1f0a','#1f0a0a','#0a1624','#1a1400'];

export default function VideoGrid({ videos, onSelect }) {
  const live = videos.filter(v => v.isActive);
  const archive = videos.filter(v => !v.isActive);

  return (
    <div>
      <div style={{ padding: '14px 18px 8px', fontSize: '15px', fontWeight: 700, letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
        THIS WEEK
        <span style={{ background: '#F5C518', color: '#000', fontSize: '9px', fontWeight: 700, borderRadius: '4px', padding: '2px 6px' }}>LIVE</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#666', background: '#1e1e1e', borderRadius: '20px', padding: '2px 10px', fontWeight: 400 }}>
          Resets Sunday 00:00
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', padding: '0 18px 16px' }}>
        {live.map((v, i) => <VideoCard key={v._id} video={v} index={i} onSelect={onSelect} isLive />)}
      </div>

      <div style={{ padding: '4px 18px 8px', fontSize: '15px', fontWeight: 700, letterSpacing: '1.5px' }}>
        PREVIOUS VIDEOS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', padding: '0 18px 24px' }}>
        {archive.map((v, i) => <VideoCard key={v._id} video={v} index={i + 1} onSelect={onSelect} />)}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

function VideoCard({ video, index, onSelect, isLive }) {
  const bg = BG_COLORS[index % BG_COLORS.length];

  return (
    <div onClick={() => onSelect(video)} style={{
      background: '#1e1e1e',
      border: isLive ? '1px solid #F5C518' : '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
      transition: 'transform 0.15s, border-color 0.15s'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {video.thumbnail
          ? <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          : null}
        {isLive && (
          <div style={{ position: 'absolute', top: '7px', right: '7px', background: '#F5C518', color: '#000', fontSize: '9px', fontWeight: 700, borderRadius: '3px', padding: '2px 6px' }}>
            LIVE QUIZ
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 2, width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(245,197,24,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '11px solid #000', marginLeft: '2px' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '7px', left: '8px', right: '8px', zIndex: 2 }}>
          <div style={{ fontSize: '9px', color: '#F5C518', fontWeight: 600, letterSpacing: '1px' }}>
            {new Date(video.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div style={{ fontFamily: 'serif', fontSize: '12px', color: '#fff', lineHeight: 1.2, marginTop: '2px' }}>
            {video.title?.slice(0, 50)}{video.title?.length > 50 ? '...' : ''}
          </div>
        </div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ fontSize: '10px', color: '#F5C518', fontWeight: 600 }}>
          {isLive ? `Up to +${video.questions?.reduce((a, q) => a + q.points, 0) || 0} pts` : 'Archive — replay available'}
        </div>
      </div>
    </div>
  );
}