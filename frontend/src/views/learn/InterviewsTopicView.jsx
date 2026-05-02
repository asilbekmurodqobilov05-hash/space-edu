import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { interviewsTopicsData } from '@/data/interviewsTopicsData';
import { BookOpen, Beaker, Satellite, Rocket } from 'lucide-react';
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
          {typeof lesson === 'object' ? lesson.name : lesson}
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

export default function InterviewsTopicView() {
  const { i18n } = useTranslation();
  const { topicId } = useParams();
  const topic = interviewsTopicsData[topicId];
  const navigate = useNavigate();

  if (!topic) {
    return <Navigate to="/learn/interviews" replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title} color={topic.color} backPath="/learn/interviews" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {topic.sections ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {topic.sections.map((section, sIdx) => (
              <div key={sIdx}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '20px', paddingLeft: '8px', borderLeft: `4px solid ${topic.color}` }}>
                  {section.name}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.lessons.map((lesson, i) => {
                    // Calculate flat index for grouped lessons
                    const flatIdx = topic.sections.slice(0, sIdx).reduce((acc, s) => acc + s.lessons.length, 0) + i;
                    return (
                      <LessonBlock 
                        key={i} 
                        lesson={lesson} 
                        index={i} 
                        color={topic.color} 
                        onClick={() => navigate(`/learn/interviews/${topicId}/sub/${flatIdx}`)} 
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topic.lessons.map((lesson, i) => (
              <LessonBlock 
                key={i} 
                lesson={lesson} 
                index={i} 
                color={topic.color} 
                onClick={() => navigate(`/learn/interviews/${topicId}/sub/${i}`)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
