import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { Play } from 'lucide-react';
import { useState } from 'react';

const blockVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CreativityLessonCard({ lesson, index, color, onClick }) {
  const [hovered, setHovered] = useState(false);
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
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        padding: '24px',
        borderRadius: '24px',
        border: `1px solid ${hovered ? colorBorder : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${colorLight}` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Left: Video */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '16/9',
        background: '#000',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none', // Allow card click to work
      }}>
        <iframe
          width="100%"
          height="100%"
          src={lesson.videoUrl}
          title={lesson.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0 }}
        ></iframe>
      </div>

      {/* Right: Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10px 0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colorLight,
            border: `1px solid ${colorBorder}`,
            color: color,
            fontSize: '14px',
            fontWeight: 800,
          }}>
            {index + 1}
          </div>
          <span style={{ 
            color, 
            fontSize: '12px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em' 
          }}>
            CREATIVITY MODULE
          </span>
        </div>

        <h3 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: 800, 
          color: '#fff',
          marginBottom: '16px',
          lineHeight: 1.2
        }}>
          {lesson.name}
        </h3>

        <p style={{ 
          margin: 0, 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '24px'
        }}>
          Explore the engineering and design principles behind {lesson.name}. 
          Watch the video to understand its role in space exploration and development.
        </p>

        <button
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: color,
            border: 'none',
            color: '#000',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 20px ${color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Play style={{ width: '18px', height: '18px', fill: 'currentColor' }} />
          Full Screen Video
        </button>
      </div>
    </motion.div>
  );
}

export default function CreativityTopicView() {
  const { topicId } = useParams();
  const topic = creativityTopicsData[topicId];
  const navigate = useNavigate();

  if (!topic) {
    return <Navigate to="/learn/creativity" replace />;
  }

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={topic.titleEn} color={topic.color} backPath="/learn/creativity" />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {topic.lessons.map((lesson, i) => (
            <CreativityLessonCard 
              key={i} 
              lesson={lesson} 
              index={i} 
              color={topic.color} 
              onClick={() => navigate(`/learn/creativity/${topicId}/sub/${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
