import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 197, 24, ${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 197, 24, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e0e0e 0%, #111108 50%, #0e0e0e 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(245,197,24,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,197,24,0.03) 0%, transparent 50%)',
      }} />

      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #F5C518, #c9a010)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 900, color: '#000',
            boxShadow: '0 0 20px rgba(245,197,24,0.3)',
          }}>O</div>
          <div>
            <div style={{
              fontSize: '16px', fontWeight: 800, letterSpacing: '3px',
              color: '#F5C518', lineHeight: 1,
            }}>OPTIMUM</div>
            <div style={{
              fontSize: '9px', letterSpacing: '2px', color: '#555',
              fontWeight: 500, marginTop: '1px',
            }}>WATCH & EARN</div>
          </div>
        </div>

        <button
          onClick={login}
          className="discord-btn"
          style={{
            background: '#5865F2',
            color: '#fff', border: 'none', borderRadius: '8px',
            padding: '10px 20px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '8px', transition: 'all 0.2s ease', fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F5C518';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,197,24,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#5865F2';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Sign in with Discord
        </button>
      </nav>

      <div style={{
        position: 'relative', zIndex: 10, flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 40px', maxWidth: '700px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.2)',
          borderRadius: '20px', padding: '5px 14px', marginBottom: '28px',
          width: 'fit-content',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '11px', color: '#F5C518', fontWeight: 600, letterSpacing: '1px' }}>
            SEASON 1 · LIVE NOW
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 80px)',
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-1px', marginBottom: '10px',
          color: '#f0f0f0',
        }}>
          Watch.{' '}
          <span style={{
            color: '#F5C518',
            textShadow: '0 0 40px rgba(245,197,24,0.4)',
          }}>
            Quiz.
          </span>
          {' '}Earn.
        </h1>

        <h2 style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          fontWeight: 400, color: '#555',
          marginBottom: '16px', lineHeight: 1.5,
          letterSpacing: '0.2px',
        }}>
          Watch Optimum videos, answer quizzes, earn points.
          <br />
          <span style={{ color: '#777' }}>Compete for your region every week.</span>
        </h2>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[
            { icon: '▶', label: 'Watch videos', sub: 'Real YouTube content' },
            { icon: '⚡', label: 'Speed bonuses', sub: '20s per question' },
            { icon: '🌍', label: 'Regional war', sub: 'Earn your region a voice' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f0f0' }}>{f.label}</div>
                <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={login}
            style={{
              background: '#5865F2', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '14px 28px', fontSize: '14px',
              fontWeight: 700, cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '10px', transition: 'all 0.2s ease',
              fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(88,101,242,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F5C518';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,197,24,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#5865F2';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(88,101,242,0.3)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continue with Discord
          </button>
          <div style={{ fontSize: '11px', color: '#444', lineHeight: 1.6 }}>
            Free to join · No credit card needed
          </div>
        </div>
      </div>

      <div style={{
        position: 'relative', zIndex: 10,
        padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ fontSize: '11px', color: '#333' }}>
          © 2025 Optimum · All rights reserved
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['West Africa', 'East Africa', 'UK & Europe', 'North America', 'Diaspora'].map((r, i) => (
            <div key={i} style={{ fontSize: '10px', color: '#333' }}>{r}</div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}