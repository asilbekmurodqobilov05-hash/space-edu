import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { useProblemsStore } from '@/store/useProblemsStore';
import { useTranslation } from '@/hooks/useTranslation';

const TOTAL_PROBLEMS = 145;
const PER_ROW = 10;

export default function ProblemsView() {
  const solvedProblems = useProblemsStore((state) => state.solvedProblems);
  const color = '#4ade80';
  const colorLight = 'rgba(74,222,128,0.10)';
  const colorBorder = 'rgba(74,222,128,0.25)';

  const rows = [];
  for (let i = 1; i <= TOTAL_PROBLEMS; i += PER_ROW) {
    rows.push(Array.from({ length: Math.min(PER_ROW, TOTAL_PROBLEMS - i + 1) }, (_, k) => i + k));
  }

  const { t, i18n } = useTranslation();

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={t('learnViews', 'problemsTitle')} color={color} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colorLight, border: `1px solid ${colorBorder}`,
              margin: '0 auto 20px',
            }}
          >
            <HelpCircle style={{ width: '36px', height: '36px', color }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            {t('learnViews', 'problemsDesc').replace('{count}', TOTAL_PROBLEMS)}
          </p>
        </motion.div>

        {/* Grid of numbered squares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
              {row.map((num) => (
                <ProblemSquare 
                  key={num} 
                  num={num} 
                  color={color} 
                  colorLight={colorLight} 
                  colorBorder={colorBorder} 
                  status={solvedProblems[num]}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ProblemSquare({ num, color, colorLight, colorBorder, status }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Determine dynamic colors based on status
  let bgColor = 'rgba(255,255,255,0.035)';
  let borderColor = 'rgba(255,255,255,0.07)';
  let textColor = 'rgba(255,255,255,0.55)';
  let glowColor = color;

  if (status === 'correct') {
    bgColor = 'rgba(74,222,128,0.15)';
    borderColor = 'rgba(74,222,128,0.4)';
    textColor = '#4ade80';
    glowColor = '#4ade80';
  } else if (status === 'wrong') {
    bgColor = 'rgba(239,68,68,0.15)';
    borderColor = 'rgba(239,68,68,0.4)';
    textColor = '#ef4444';
    glowColor = '#ef4444';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: num * 0.004, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/learn/problems/${num}`)}
      style={{
        width: '62px',
        height: '62px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        border: `1px solid ${hovered ? (status === 'wrong' ? '#ef4444' : colorBorder) : borderColor}`,
        background: hovered
          ? `linear-gradient(145deg, ${status === 'wrong' ? 'rgba(239,68,68,0.2)' : colorLight}, rgba(255,255,255,0.06))`
          : bgColor,
        color: hovered ? (status === 'wrong' ? '#ef4444' : color) : textColor,
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        boxShadow: hovered ? `0 0 20px ${glowColor}30, 0 8px 24px rgba(0,0,0,0.3)` : 'none',
        zIndex: hovered ? 10 : 1,
        position: 'relative',
      }}
    >
      {num}
    </motion.div>
  );
}
