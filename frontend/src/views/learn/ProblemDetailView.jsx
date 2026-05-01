import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowLeft, Send } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { problemsData } from '@/data/problemsData';
import { useProblemsStore } from '@/store/useProblemsStore';

export default function ProblemDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = problemsData[id];
  const setProblemStatus = useProblemsStore((state) => state.setProblemStatus);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState(null); // 'correct', 'wrong', or null

  if (!problem) {
    return <Navigate to="/learn/problems" replace />;
  }

  const color = '#4ade80';
  const colorLight = 'rgba(74,222,128,0.10)';
  const colorBorder = 'rgba(74,222,128,0.25)';

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = userAnswer.trim() === problem.answer ? 'correct' : 'wrong';
    setStatus(result);
    setProblemStatus(id, result);
  };

  const handleCloseAlert = () => {
    setStatus(null);
  };

  const handleRetry = () => {
    setUserAnswer('');
    setStatus(null);
  };

  const handleNext = () => {
    const nextId = parseInt(id) + 1;
    if (problemsData[nextId]) {
      navigate(`/learn/problems/${nextId}`);
      setUserAnswer('');
      setStatus(null);
    } else {
      navigate('/learn/problems');
    }
  };

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={`Masala #${id}`} color={color} backPath="/learn/problems" />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '48px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ marginBottom: '40px' }}>
             <span style={{ 
               fontSize: '12px', 
               textTransform: 'uppercase', 
               color, 
               fontWeight: 800, 
               letterSpacing: '0.1em',
               display: 'block',
               marginBottom: '12px'
             }}>
               SHART (QUESTION)
             </span>
             <h2 style={{ fontSize: '24px', color: '#fff', lineHeight: 1.6, fontWeight: 500 }}>
               {problem.question}
             </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Javobingizni kiriting..."
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '18px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = color}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <button
              type="submit"
              style={{
                padding: '18px',
                borderRadius: '16px',
                background: color,
                border: 'none',
                color: '#000',
                fontSize: '18px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Send style={{ width: '20px', height: '20px' }} />
              Javobni yuborish
            </button>
          </form>
        </motion.div>
      </div>

      {/* Custom Alert Overlay */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: '#151921',
                borderRadius: '32px',
                padding: '48px 40px',
                width: '100%',
                maxWidth: '480px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 40px ${status === 'correct' ? color : '#ef4444'}15`,
                position: 'relative',
              }}
            >
              {/* Icon Section */}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 32px' }}>
                <motion.div
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: status === 'correct' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: status === 'correct' ? color : '#ef4444',
                    border: `1px solid ${status === 'correct' ? color : '#ef4444'}30`,
                  }}
                >
                  {status === 'correct' ? <CheckCircle2 size={56} /> : <XCircle size={56} />}
                </motion.div>
                {/* Decorative particles for wrong answer as seen in image */}
                {status === 'wrong' && (
                  <>
                    <div style={{ position: 'absolute', top: -10, right: -10, color: '#ff8a8a', opacity: 0.6 }}>✦</div>
                    <div style={{ position: 'absolute', bottom: 10, left: -20, color: '#ff8a8a', opacity: 0.4 }}>•</div>
                    <div style={{ position: 'absolute', top: 20, left: -10, color: '#ff8a8a', opacity: 0.5 }}>✦</div>
                  </>
                )}
              </div>
              
              <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                {status === 'correct' ? 'Barakalla!' : 'Siz xato qildingiz'}
              </h3>
              
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: status === 'correct' ? '40px' : '24px', fontSize: '17px', lineHeight: 1.6 }}>
                {status === 'correct' 
                  ? "Tabriklaymiz! Siz ushbu masalani muvaffaqiyatli hal qildingiz." 
                  : "Xavotir olmang, harakat davomida bilim ortadi."}
              </p>

              {status === 'wrong' && (
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                    To'g'ri javob bu bo'ladi:
                  </p>
                  <div style={{
                    background: 'rgba(74,222,128,0.1)',
                    border: '1.5px solid rgba(74,222,128,0.2)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: color,
                  }}>
                    <CheckCircle2 size={24} />
                    <span style={{ fontSize: '18px', fontWeight: 700 }}>{problem.answer}</span>
                  </div>
                </div>
              )}

              {status === 'wrong' && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ color: '#ff4d4d' }}>❤</span> Davom eting, siz zo'r natijalarga erishasiz!
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                {status === 'wrong' ? (
                  <>
                    <button
                      onClick={handleRetry}
                      style={{
                        flex: 1,
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                      Qayta urinish
                    </button>
                    <button
                      onClick={handleNext}
                      style={{
                        flex: 1.2,
                        padding: '18px',
                        borderRadius: '16px',
                        background: '#22c55e',
                        border: 'none',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 8px 20px rgba(34,197,94,0.3)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Keyingi savol
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: '16px',
                      background: color,
                      border: 'none',
                      color: '#000',
                      fontSize: '18px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Davom etish
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
