import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/videos`, { withCredentials: true })
      .then(res => setVideos(res.data))
      .catch(console.error);
  }, []);

  const emptyQ = () => ({
    question: '',
    options: ['', '', '', ''],
    answer: 0,
    points: 100,
  });

  const selectVideo = (v) => {
    setSelected(v);
    setMsg('');
    setQuestions(
      v.questions?.length > 0
        ? v.questions.map(q => ({ ...q }))
        : [emptyQ()]
    );
    setTimeout(() => {
      document.getElementById('quiz-editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const addQ = () => setQuestions(prev => [...prev, emptyQ()]);
  const removeQ = (i) => setQuestions(prev => prev.filter((_, idx) => idx !== i));

  const updateQ = (i, field, val) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  };

  const updateOption = (qi, oi, val) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options];
      opts[oi] = val;
      return { ...q, options: opts };
    }));
  };

  const pinVideo = async (id) => {
    try {
      await axios.post(`${API}/api/videos/${id}/pin`, {}, { withCredentials: true });
      const res = await axios.get(`${API}/api/videos`, { withCredentials: true });
      setVideos(res.data);
      setMsg('✅ Video set as active quiz');
    } catch (err) {
      console.error(err);
    }
  };

  const saveQuestions = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await axios.post(
        `${API}/api/videos/${selected._id}/questions`,
        { questions },
        { withCredentials: true }
      );
      setMsg('✅ Questions saved successfully');
      const res = await axios.get(`${API}/api/videos`, { withCredentials: true });
      setVideos(res.data);
      setSelected(prev => ({ ...prev, questions }));
    } catch (err) {
      console.error(err);
      setMsg('❌ Error saving questions');
    } finally {
      setSaving(false);
    }
  };

  const generateQuestions = async () => {
    if (!selected) return;
    setGenerating(true);
    setMsg('');
    try {
      const res = await axios.post(
        `${API}/api/videos/${selected._id}/generate-questions`,
        {},
        { withCredentials: true }
      );
      setQuestions(res.data.questions);
      setMsg('✅ Questions generated — review and edit before saving');
    } catch (err) {
      console.error(err);
      setMsg('❌ Could not generate questions: ' + (err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ background: '#0e0e0e', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'serif', fontSize: '22px', letterSpacing: '2px', color: '#F5C518', marginBottom: '4px' }}>
          OPTIMUM <span style={{ color: '#f0f0f0' }}>ADMIN</span>
        </div>
        <div style={{ fontSize: '11px', color: '#555', marginBottom: '20px' }}>
          Manage active video and quiz questions
        </div>

        {msg && (
          <div style={{
            background: msg.includes('❌') ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
            border: msg.includes('❌') ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)',
            borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
            color: msg.includes('❌') ? '#ef4444' : '#22c55e', marginBottom: '16px'
          }}>
            {msg}
          </div>
        )}

        <div style={{ fontFamily: 'serif', fontSize: '14px', letterSpacing: '1px', marginBottom: '10px' }}>
          VIDEO MANAGEMENT
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '24px' }}>
          {videos.map(v => (
            <div key={v._id} style={{
              background: selected?._id === v._id ? '#252525' : '#1e1e1e',
              border: v.isActive ? '1px solid #F5C518' : selected?._id === v._id ? '1px solid rgba(245,197,24,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '11px 14px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>{v.title}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                  {new Date(v.publishedAt).toLocaleDateString()} ·{' '}
                  <span style={{ color: v.questions?.length > 0 ? '#22c55e' : '#ef4444' }}>
                    {v.questions?.length || 0} questions
                  </span>
                </div>
              </div>
              {v.isActive && (
                <div style={{ background: '#F5C518', color: '#000', fontSize: '9px', fontWeight: 700, borderRadius: '3px', padding: '2px 7px', flexShrink: 0 }}>
                  ACTIVE
                </div>
              )}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {!v.isActive && (
                  <button onClick={() => pinVideo(v._id)} style={{
                    background: '#F5C518', color: '#000', border: 'none',
                    borderRadius: '6px', padding: '5px 10px', fontSize: '10px',
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                  }}>
                    Set active
                  </button>
                )}
                <button onClick={() => selectVideo(v)} style={{
                  background: selected?._id === v._id ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.07)',
                  border: selected?._id === v._id ? '1px solid rgba(245,197,24,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: selected?._id === v._id ? '#F5C518' : '#f0f0f0',
                  borderRadius: '6px', padding: '5px 10px', fontSize: '10px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                }}>
                  {selected?._id === v._id ? '✏️ Editing' : 'Edit quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div id="quiz-editor" style={{
            background: '#161616', border: '1px solid rgba(245,197,24,0.15)',
            borderRadius: '12px', padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontFamily: 'serif', fontSize: '14px', letterSpacing: '1px' }}>
                QUIZ QUESTIONS
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: 'none', border: 'none', color: '#555',
                fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit'
              }}>
                ✕ Close
              </button>
            </div>

            <div style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>
              Editing: <span style={{ color: '#F5C518' }}>{selected.title}</span>
            </div>

            <button onClick={generateQuestions} disabled={generating} style={{
              width: '100%',
              background: generating ? 'rgba(88,101,242,0.1)' : 'rgba(88,101,242,0.15)',
              border: '1px solid rgba(88,101,242,0.3)',
              color: generating ? '#666' : '#a5aaef',
              borderRadius: '8px', padding: '11px', fontSize: '12px',
              fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', marginBottom: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px'
            }}>
              {generating ? '⏳ Generating questions with AI...' : '✨ Auto-generate questions with AI'}
            </button>

            {questions.map((q, qi) => (
              <div key={qi} style={{
                background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '14px', marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#F5C518' }}>
                    Question {qi + 1}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ fontSize: '10px', color: '#666' }}>Points:</label>
                    <input
                      type="number"
                      value={q.points}
                      onChange={e => updateQ(qi, 'points', parseInt(e.target.value) || 100)}
                      style={{
                        width: '60px', background: '#252525',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '5px', padding: '3px 7px',
                        fontSize: '11px', color: '#f0f0f0'
                      }}
                    />
                    <button onClick={() => removeQ(qi)} style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', borderRadius: '5px', padding: '3px 8px',
                      fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit'
                    }}>
                      Remove
                    </button>
                  </div>
                </div>

                <textarea
                  placeholder="Type your question here..."
                  value={q.question}
                  onChange={e => updateQ(qi, 'question', e.target.value)}
                  style={{
                    width: '100%', background: '#252525',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '7px', padding: '9px 12px',
                    fontSize: '12px', color: '#f0f0f0',
                    resize: 'vertical', minHeight: '60px',
                    fontFamily: 'inherit', marginBottom: '10px'
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.answer === oi}
                        onChange={() => updateQ(qi, 'answer', oi)}
                        style={{ accentColor: '#F5C518', flexShrink: 0 }}
                      />
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: q.answer === oi ? '#F5C518' : 'rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: 700,
                        color: q.answer === oi ? '#000' : '#666', flexShrink: 0
                      }}>
                        {'ABCD'[oi]}
                      </div>
                      <input
                        type="text"
                        placeholder={`Option ${'ABCD'[oi]}...`}
                        value={opt}
                        onChange={e => updateOption(qi, oi, e.target.value)}
                        style={{
                          flex: 1, background: '#252525',
                          border: q.answer === oi
                            ? '1px solid rgba(245,197,24,0.4)'
                            : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px', padding: '7px 10px',
                          fontSize: '11px', color: '#f0f0f0', fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '7px' }}>
                  🔘 Click the radio button on the left to mark the correct answer
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={addQ} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0f0f0', borderRadius: '8px', padding: '10px 18px',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
              }}>
                + Add question
              </button>
              <button onClick={saveQuestions} disabled={saving} style={{
                background: saving ? 'rgba(245,197,24,0.3)' : '#F5C518',
                color: '#000', border: 'none', borderRadius: '8px',
                padding: '10px 24px', fontSize: '12px', fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', flex: 1
              }}>
                {saving ? 'Saving...' : '💾 Save questions'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}