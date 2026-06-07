import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function QuizEngine({ video, watchSecs, gate, onComplete }) {
  const { updateUser } = useAuth();
  const [phase, setPhase] = useState('waiting');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState([]);
  const [timings, setTimings] = useState([]);
  const [result, setResult] = useState(null);
  const quizTimer = useRef(null);

  const questions = video.questions || [];

  useEffect(() => {
    return () => clearInterval(quizTimer.current);
  }, []);

  useEffect(() => {
    if (watchSecs >= gate && phase === 'waiting') {
      setPhase('unlocked');
    }
  }, [watchSecs, gate, phase]);

  const startQuiz = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(20);
    startQuizTimer();
  };

  const startQuizTimer = () => {
    clearInterval(quizTimer.current);
    setTimeLeft(20);
    quizTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(quizTimer.current);
          setAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pickAnswer = (i) => {
    if (answered) return;
    clearInterval(quizTimer.current);
    setSelected(i);
    setAnswered(true);
    setAnswers(prev => [...prev, i]);
    setTimings(prev => [...prev, timeLeft]);
  };

  const nextQuestion = async () => {
    if (currentQ + 1 >= questions.length) {
      const finalAnswers = [...answers, selected ?? -1];
      const finalTimings = [...timings, timeLeft];
      try {
        const res = await axios.post(`${API}/api/quiz/submit`, {
          videoId: video._id,
          answers: finalAnswers,
          timings: finalTimings,
        }, { withCredentials: true });
        setResult(res.data);
        setPhase('result');
        if (res.data.isFirstAttempt) {
          updateUser(prev => ({ ...prev, totalPoints: (prev?.totalPoints || 0) + res.data.total }));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
      startQuizTimer();
    }
  };

  // Result screen
  if (phase === 'result' && result) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'serif', fontSize: '48px', color: '#F5C518', letterSpacing: '2px' }}>
          {(result.total || 0).toLocaleString()}
        </div>
        <div style={{ fontSize: '12px', color: '#777', marginBottom: '16px' }}>points earned</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: '8px', padding: '12px', marginBottom: '14px', textAlign: 'left' }}>
          {[
            ['Correct answers', `+${result.basePoints} pts`],
            ['Speed bonus', `+${result.speedBonus} pts`],
            ['Streak bonus', `+${result.streakBonus} pts`],
            ['Total', `+${result.total} pts`],
          ].map(([label, val], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '12px',
              borderTop: i === 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              marginTop: i === 3 ? '6px' : 0, paddingTop: i === 3 ? '8px' : '3px'
            }}>
              <span style={{ color: '#777' }}>{label}</span>
              <span style={{ fontWeight: i === 3 ? 700 : 400, color: i === 3 ? '#F5C518' : '#f0f0f0' }}>{val}</span>
            </div>
          ))}
        </div>
        {!result.isFirstAttempt && (
          <div style={{ fontSize: '11px', color: '#F5C518', marginBottom: '10px' }}>
            ℹ️ Replay — no points awarded for repeat attempts
          </div>
        )}
        <button onClick={onComplete} style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f0',
          borderRadius: '8px', padding: '10px', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'inherit'
        }}>
          ← Back to hub
        </button>
      </div>
    );
  }

  // Quiz screen
  if (phase === 'quiz') {
    const q = questions[currentQ];
    return (
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: 'serif', fontSize: '15px', letterSpacing: '1px', color: '#F5C518' }}>
            Question {currentQ + 1}/{questions.length}
          </div>
          <div style={{
            borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 700,
            background: timeLeft <= 7 ? 'rgba(239,68,68,0.1)' : 'rgba(245,197,24,0.1)',
            border: timeLeft <= 7 ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(245,197,24,0.25)',
            color: timeLeft <= 7 ? '#ef4444' : '#F5C518'
          }}>
            {answered
              ? (selected === q.answer ? `+${q.points + Math.round(timeLeft / 20 * q.points * 0.8)}pts!` : 'Wrong!')
              : `${timeLeft}s`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i < currentQ ? '#22c55e' : i === currentQ ? '#F5C518' : 'rgba(255,255,255,0.08)'
            }} />
          ))}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px', lineHeight: 1.5 }}>
          {q.question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {q.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.03)';
            let border = 'rgba(255,255,255,0.07)';
            if (answered) {
              if (i === q.answer) { bg = 'rgba(34,197,94,0.1)'; border = '#22c55e'; }
              else if (i === selected) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; }
            }
            return (
              <button key={i} onClick={() => pickAnswer(i)} style={{
                background: bg, border: `1px solid ${border}`, borderRadius: '8px',
                padding: '8px 12px', fontSize: '12px',
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'left', color: '#f0f0f0', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '7px'
              }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 600, flexShrink: 0
                }}>
                  {'ABCD'[i]}
                </div>
                {opt}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ fontSize: '10px', color: '#666' }}>
            +{q.points} pts · speed bonus up to +{Math.round(q.points * 0.8)} pts
          </div>
          <button onClick={nextQuestion} disabled={!answered} style={{
            background: answered ? '#F5C518' : 'rgba(245,197,24,0.3)',
            color: '#000', border: 'none', borderRadius: '6px', padding: '6px 14px',
            fontSize: '11px', fontWeight: 700,
            cursor: answered ? 'pointer' : 'not-allowed', fontFamily: 'inherit'
          }}>
            {currentQ + 1 === questions.length ? 'Finish →' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  // Waiting / unlocked state
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 14px', textAlign: 'center', gap: '8px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(245,197,24,0.07)', border: '1px solid rgba(245,197,24,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
      }}>
        {phase === 'unlocked' ? '✅' : '🔒'}
      </div>
      <div style={{ fontFamily: 'serif', fontSize: '16px', letterSpacing: '1px' }}>
        {phase === 'unlocked' ? 'Quiz Unlocked!' : 'Quiz Locked'}
      </div>
      <div style={{ fontSize: '11px', color: '#777', lineHeight: 1.6, maxWidth: '280px' }}>
        {phase === 'unlocked'
          ? 'You can keep watching or start the quiz now. 20 seconds per question.'
          : `Watch at least ${Math.floor(gate / 60)} minutes to unlock the quiz. Keep watching after — start when ready.`}
      </div>
      {phase === 'unlocked' && (
        <button onClick={startQuiz} style={{
          background: '#F5C518', color: '#000', border: 'none', borderRadius: '8px',
          padding: '10px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          width: '100%', marginTop: '4px', fontFamily: 'inherit'
        }}>
          ▶ Start Quiz — earn up to {questions.reduce((a, q) => a + q.points, 0)} pts
        </button>
      )}
    </div>
  );
}