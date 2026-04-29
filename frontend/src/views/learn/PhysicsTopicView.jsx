import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { physicsTopicsData } from '@/data/physicsTopicsData';
import { BookOpen, Beaker } from 'lucide-react';
import { useState } from 'react';

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

function LessonBlock({ lesson, index, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  const colorLight = `${color}1A`; // 10% opacity
  const colorBorder = `${color}40`; // 25% opacity

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
          {lesson}
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
          Test
        </button>
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
            e.currentTarget.style.background = '#f472b6'; // pinkish for lab
            e.currentTarget.style.borderColor = '#f472b6';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
          }}
        >
          <Beaker style={{ width: '16px', height: '16px' }} />
          Lab
        </button>
      </div>
    </motion.div>
  );
}

export default function PhysicsTopicView() {
  const { topicId } = useParams();
  const topic = physicsTopicsData[topicId];
  const navigate = useNavigate(); // ADDED: import useNavigate from react-router-dom above if not present

  if (!topic) {
    return <Navigate to="/learn/physics" replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: '#030208' }}>
      <SectionPageHeader title={topic.title} color={topic.color} backPath="/learn/physics" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
