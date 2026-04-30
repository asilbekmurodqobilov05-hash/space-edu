import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Atom, ArrowRight } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';

const topics = [
  { id: 1,  title: 'Kinematika',                         titleEn: 'Kinematics',                    emoji: '🚀', lessonsCount: 12 },
  { id: 2,  title: 'Dinamika',                            titleEn: 'Dynamics',                      emoji: '⚡', lessonsCount: 10 },
  { id: 3,  title: 'Statika',                             titleEn: 'Statics',                       emoji: '⚖️', lessonsCount: 8 },
  { id: 4,  title: 'Suyuqlik va gazlar mexanikasi',       titleEn: 'Mechanics of Fluids and Gases', emoji: '💧', lessonsCount: 9 },
  { id: 5,  title: 'Tebranishlar va to\'lqinlar',         titleEn: 'Oscillations and Waves',        emoji: '🌊', lessonsCount: 11 },
  { id: 6,  title: 'Molekulyar fizika',                   titleEn: 'Molecular Physics',             emoji: '🔬', lessonsCount: 10 },
  { id: 7,  title: 'Termodinamika',                       titleEn: 'Thermodynamics',                emoji: '🌡️', lessonsCount: 8 },
  { id: 8,  title: 'Elektrostatika',                      titleEn: 'Electrostatics',                emoji: '⚡', lessonsCount: 9 },
  { id: 9,  title: 'O\'zgarmas tok qonunlari',            titleEn: 'Laws of Direct Current',        emoji: '🔋', lessonsCount: 10 },
  { id: 10, title: 'Turli muhitlarda elektr qonunlari',   titleEn: 'Electrical Laws in Different Media', emoji: '🧲', lessonsCount: 7 },
  { id: 11, title: 'Elektromagnit hodisalar',              titleEn: 'Electromagnetic Phenomena',     emoji: '🧭', lessonsCount: 8 },
  { id: 12, title: 'Elektromagnit tebranishlar va to\'lqinlar', titleEn: 'Electromagnetic Oscillations and Waves', emoji: '📡', lessonsCount: 9 },
  { id: 13, title: 'Optika',                              titleEn: 'Optics',                        emoji: '🔭', lessonsCount: 10 },
  { id: 14, title: 'Atom va yadro fizikasi',              titleEn: 'Atomic and Nuclear Physics',    emoji: '⚛️', lessonsCount: 12 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TopicCard({ topic, index, color, colorLight, colorBorder }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/learn/physics/${topic.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderRadius: '18px',
        border: `1px solid ${hovered ? colorBorder : 'rgba(255,255,255,0.07)'}`,
        background: hovered
          ? `linear-gradient(135deg, ${colorLight}, rgba(255,255,255,0.03))`
          : 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${color}15` : '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: colorLight,
            border: `1px solid ${colorBorder}`,
            fontSize: '14px', fontWeight: 800, color,
            flexShrink: 0,
          }}
        >
          {String(topic.id).padStart(2, '0')}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#fff' }}>{topic.title}</h3>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{topic.titleEn}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ color, fontWeight: 700 }}>{topic.lessonsCount}</span> dars
        </span>
        <div
          style={{
            width: '34px', height: '34px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? color : colorLight,
            transition: 'all 0.25s ease',
          }}
        >
          <ArrowRight style={{
            width: '16px', height: '16px',
            color: hovered ? '#04080f' : color,
            transform: hovered ? 'translateX(2px)' : 'none',
            transition: 'all 0.25s ease',
          }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function PhysicsView() {
  const color = '#a78bfa';
  const colorLight = 'rgba(167,139,250,0.10)';
  const colorBorder = 'rgba(167,139,250,0.20)';

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title="Fizika — Physics" color={color} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Section intro */}
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
            <Atom style={{ width: '36px', height: '36px', color }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Fizika bo'yicha barcha mavzularni o'rganing — kinematikadan yadro fizikasigacha
          </p>
        </motion.div>

        {/* Topics list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} color={color} colorLight={colorLight} colorBorder={colorBorder} />
          ))}
        </div>
      </div>
    </div>
  );
}
