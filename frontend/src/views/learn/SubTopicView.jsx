import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { astronomyTopicsData } from '@/data/astronomyTopicsData';
import { interviewsTopicsData } from '@/data/interviewsTopicsData';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { BookOpen, Beaker } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

function LessonBlock({ lesson, index, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { t, i18n } = useTranslation();
  const colorLight = `${color}1A`; 
  const colorBorder = `${color}40`;

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
        padding: '20px 24px',
        borderRadius: '16px',
        border: `1px solid ${hovered ? colorBorder : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: hovered ? `0 4px 20px rgba(0,0,0,0.2), 0 0 15px ${colorLight}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: colorLight, border: `1px solid ${colorBorder}`,
          color: color, fontSize: '13px', fontWeight: 800
        }}>
          {index + 1}
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: hovered ? '#fff' : 'rgba(255,255,255,0.85)', transition: 'color 0.2s ease' }}>
          {lesson.name}
        </h3>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = color;
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
          }}
        >
          <BookOpen style={{ width: '16px', height: '16px' }} />
          {t('learnViews', 'readButton')}
        </button>
      </div>
    </motion.div>
  );
}

export default function SubTopicView() {
  const { subject, topicId, subIdx } = useParams();
  const navigate = useNavigate();

  let dataSource = null;
  let backPath = "/learn";

  if (subject === 'astronomy') { dataSource = astronomyTopicsData; backPath = `/learn/astronomy/${topicId}`; }
  else if (subject === 'interviews') { dataSource = interviewsTopicsData; backPath = `/learn/interviews/${topicId}`; }
  else if (subject === 'creativity') { dataSource = creativityTopicsData; backPath = `/learn/creativity/${topicId}`; }

  const topic = dataSource ? dataSource[topicId] : null;
  
  let subTopic = null;
  if (topic) {
    if (topic.sections) {
      const allLessons = topic.sections.flatMap(s => s.lessons);
      subTopic = allLessons[parseInt(subIdx)];
    } else {
      subTopic = topic.lessons[parseInt(subIdx)];
    }
  }

  if (!subTopic) {
    return <Navigate to={backPath} replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={subTopic.name} color={topic.color} backPath={backPath} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
