import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { useLearnTopics } from '@/hooks/useLearnTopics';
import { SUBJECTS } from '@/lib/learnContent';
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

/* Reusable pill button */
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

function LessonBlock({ lesson, index, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  const tealColor = '#2dd4bf';
  const blueColor = '#60a5fa';
  const badgeColor = tealColor;

  const lessonName = typeof lesson === 'object' ? lesson.name : lesson;

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
      {/* Badge + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(45,212,191,0.12)',
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
          {lessonName}
        </h3>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <FuiButton
          icon={BookOpen}
          label={t('learnViews', 'readButton') || 'Read'}
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

export default function SubTopicView() {
  const { subject, topicId, subIdx } = useParams();
  const navigate = useNavigate();

  const { topics } = useLearnTopics(subject);
  const backPath = SUBJECTS.includes(subject) ? `/learn/${subject}/${topicId}` : '/learn';

  const topic = topics[topicId] ?? null;

  let subTopic = null;
  if (topic) {
    const items = topic.sections
      ? topic.sections.flatMap((section) => section.lessons)
      : (topic.lessons ?? []);
    subTopic = items[parseInt(subIdx)];
  }

  // A lesson with no parts has nothing for this screen to list.
  if (!subTopic?.subLessons) {
    return <Navigate to={backPath} replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={subTopic.name} color={topic.color} backPath={backPath} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subTopic.subLessons.map((lesson, i) => (
            <LessonBlock
              key={i}
              lesson={lesson}
              index={i}
              color={topic.color}
              onClick={() => navigate(`/learn/${subject}/${topicId}/sub/${subIdx}/lesson/${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
