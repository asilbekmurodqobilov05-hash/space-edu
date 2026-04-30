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
    navigate('/learn/problems');
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
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: '#1a1f2e',
                borderRadius: '32px',
                padding: '40px',
                width: '400px',
                textAlign: 'center',
                border: `1px solid ${status === 'correct' ? color : '#ef4444'}40`,
                boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 30px ${status === 'correct' ? color : '#ef4444'}20`,
              }}
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: `${status === 'correct' ? color : '#ef4444'}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                color: status === 'correct' ? color : '#ef4444'
              }}>
                {status === 'correct' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
              </div>
              
              <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                {status === 'correct' ? 'Correct' : 'Wrong'}
              </h3>
              
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '16px' }}>
                {status === 'correct' 
                  ? "Tabriklaymiz! Siz masalani to'g'ri hal qildingiz." 
                  : "Afsuski, javobingiz noto'g'ri. Yana bir bor urinib ko'ring."}
              </p>

              <button
                onClick={handleCloseAlert}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: status === 'correct' ? color : '#ef4444',
                  border: 'none',
                  color: '#000',
                  fontSize: '18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
