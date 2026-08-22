import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { physicsTopicsData } from '@/data/physicsTopicsData';
import { BookOpen, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const blockVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.045, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Reusable FUI pill button */
function FuiButton({ icon: Icon, label, accentColor, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '9px 18px',
        borderRadius: '9999px',
        background: hov ? accentColor : 'transparent',
        border: `1.5px solid ${accentColor}`,
        color: hov ? '#0a0a14' : accentColor,
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: hov ? `0 0 14px ${accentColor}55` : `0 0 6px ${accentColor}15`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon style={{ width: '13px', height: '13px', flexShrink: 0 }} />
      {label}
    </button>
  );
}

/* ─── Lesson row card ─── */
function LessonBlock({ lesson, index, color, topicColor, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  const tealColor  = '#2dd4bf'; // teal for Test
  const blueColor  = '#60a5fa'; // blue for Lab
  const badgeColor = tealColor;

  return (
    <motion.div
      custom={index}
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '14px',
        background: hovered ? 'rgba(45,212,191,0.04)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(45,212,191,0.25)' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 10px 28px rgba(0,0,0,0.5), 0 0 14px rgba(45,212,191,0.12)`
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Left: badge + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        {/* Teal circle badge */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: `rgba(45,212,191,0.12)`,
          border: `1.5px solid ${badgeColor}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '13px',
          fontWeight: 900,
          color: badgeColor,
          flexShrink: 0,
          boxShadow: `0 0 8px ${badgeColor}20`,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Lesson title */}
        <h3 style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 700,
          color: hovered ? '#fff' : 'rgba(255,255,255,0.88)',
          letterSpacing: '0.01em',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'color 0.2s ease',
        }}>
          {lesson}
        </h3>
      </div>

      {/* Right: buttons */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <FuiButton
          icon={BookOpen}
          label={t('learnViews', 'testButton') || 'Test'}
          accentColor={tealColor}
          onClick={onClick}
        />
        <FuiButton
          icon={FlaskConical}
          label={t('learnViews', 'labButton') || 'Lab'}
          accentColor={blueColor}
          onClick={onClick}
        />
      </div>
    </motion.div>
  );
}

/* ─── Main view ─── */
export default function PhysicsTopicView() {
  const { i18n } = useTranslation();
  const { topicId } = useParams();
  const topic = physicsTopicsData[topicId];
  const navigate = useNavigate();

  if (!topic) {
    return <Navigate to="/learn/physics" replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader
        title={
          i18n.language === 'en' ? (topic.titleEn || topic.title)
          : i18n.language === 'ru' ? (topic.titleRu || topic.title)
          : topic.title
        }
        color={topic.color}
        backPath="/learn/physics"
      />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topic.lessons.map((lesson, i) => (
            <LessonBlock
              key={i}
              lesson={lesson}
              index={i}
              color={topic.color}
              onClick={() => navigate(`/learn/physics/${topicId}/lesson/${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
