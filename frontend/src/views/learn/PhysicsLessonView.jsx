import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { physicsTopicsData } from '@/data/physicsTopicsData';
import { PlayCircle } from 'lucide-react';
import { useState } from 'react';

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

function LessonPartBlock({ partNumber, lessonName, color, index, onClick }) {
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
        flexDirection: 'row',
        gap: '24px',
        padding: '20px',
        borderRadius: '20px',
        border: `1px solid ${hovered ? colorBorder : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.2), 0 0 20px ${colorLight}` : 'none',
        alignItems: 'stretch',
        cursor: 'pointer',
      }}
    >
      {/* Video Placeholder (Left Side) */}
      <div
        style={{
          width: '340px',
          minHeight: '220px',
          flexShrink: 0,
          borderRadius: '14px',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle at center, ${colorLight} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }} />
        <PlayCircle 
          style={{ 
            width: '48px', height: '48px', 
            color: hovered ? color : 'rgba(255,255,255,0.6)',
            transition: 'all 0.3s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            zIndex: 1,
          }} 
        />
        <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>
          Video
        </span>
      </div>

      {/* Info Section (Right Side) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ 
            padding: '4px 10px', borderRadius: '8px', 
            background: colorLight, color: color, 
            fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
          }}>
            Qism {partNumber}
          </span>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>
            {lessonName} - {partNumber}-qism
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)' }}>
          {
            [
              `Bu qismda siz ${lessonName.toLowerCase()} mavzusining asosiy tushunchalari, qonuniyatlari va muhim formulalari bilan batafsil tanishasiz. Videodarsni ko'rib chiqing va bilimlaringizni mustahkamlang.`,
              `${lessonName} bo'yicha amaliy masalalar yechish namunalari. Ushbu videoda asosiy qoidalarni amaliyotda qanday qo'llash kerakligini ko'rib chiqamiz va turli murakkablikdagi masalalarni tahlil qilamiz.`,
              `Mavzuga oid chuqurlashtirilgan nazariy bilimlar. Tajribalar va vizual animatsiyalar yordamida ${lessonName.toLowerCase()} hodisalarini kuzatamiz. Bu sizga qoidalarni chuqurroq tushunishga yordam beradi.`,
              `Murakkab masalalar va test savollari tahlili. ${lessonName} bo'yicha eng ko'p uchraydigan xatolar va ularni oldini olish usullarini o'rganamiz. Imtihonlarga tayyorgarlik ko'rish uchun maxsus tavsiyalar.`,
              `${lessonName} mavzusini mustahkamlash uchun yakuniy qism. Oldingi qismlarda o'tilgan barcha bilimlarni umumlashtiramiz va haqiqiy hayotdagi tatbiqlarini ko'rib chiqamiz.`
            ][index % 5]
          }
        </p>
      </div>
    </motion.div>
  );
}

export default function PhysicsLessonView() {
  const { topicId, lessonIdx } = useParams();
  const navigate = useNavigate();
  
  const topic = physicsTopicsData[topicId];
  if (!topic) {
    return <Navigate to="/learn/physics" replace />;
  }

  const lessonIndex = parseInt(lessonIdx, 10);
  const lessonName = topic.lessons[lessonIndex];

  if (!lessonName) {
    return <Navigate to={`/learn/physics/${topicId}`} replace />;
  }

  // 5 blocks as requested
  const parts = [1, 2, 3, 4, 5];

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader 
        title={lessonName} 
        color={topic.color} 
        backPath={`/learn/physics/${topicId}`} 
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {parts.map((partNum, index) => (
            <LessonPartBlock 
              key={partNum} 
              partNumber={partNum} 
              lessonName={lessonName} 
              color={topic.color}
              index={index}
              onClick={() => navigate(`/learn/physics/${topicId}/lesson/${lessonIdx}/part/${index}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
