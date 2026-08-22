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
  const solvedCount = Object.values(solvedProblems).filter((status) => status === 'correct').length;

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={t('learnViews', 'problemsTitle')} color={color} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Large Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          {/* HelpCircle icon with spinning orbit ring */}
          <div style={{
            position: 'relative',
            width: '96px',
            height: '96px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Outer spinning ring */}
            <div style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: color,
              borderRightColor: `${color}60`,
              animation: 'spin-ring 4s linear infinite',
            }} />
            {/* Inner counter-spin dashed ring */}
            <div style={{
              position: 'absolute',
              inset: '-7px',
              borderRadius: '50%',
              border: '1px dashed rgba(74, 222, 128, 0.3)',
              animation: 'spin-ring 9s linear infinite reverse',
            }} />
            {/* Icon container */}
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(74, 222, 128, 0.25) 0%, rgba(22, 101, 52, 0.1) 100%)`,
              border: `2px solid ${colorBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 40px ${color}25, 0 0 80px ${color}10`,
            }}>
              <HelpCircle style={{ width: '44px', height: '44px', color }} />
            </div>
          </div>

          {/* Title in Orbitron */}
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            margin: '0 0 12px 0',
            textShadow: `0 0 20px rgba(74, 222, 128, 0.50)`,
          }}>
            PROBLEMS
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(74, 222, 128, 0.7)',
            fontSize: '15px',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            Masalalar
          </p>

          {/* Divider */}
          <div style={{
            width: '60px',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            margin: '24px auto 0',
            borderRadius: '2px',
          }} />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(74, 222, 128, 0.05)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(74, 222, 128, 0.05)',
            }}
          >
            {/* Blinking green status indicator dot */}
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: color,
                letterSpacing: '0.05em',
              }}
            >
              {solvedCount} / {TOTAL_PROBLEMS} solved
            </span>
          </div>
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
            background: 'radial-gradient(ellipse at 50% 40%, rgba(74,222,128,0.06) 0%, transparent 70%)',
            padding: '24px',
            borderRadius: '20px',
            width: '100%',
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
