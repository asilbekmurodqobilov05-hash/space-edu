import { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, ArrowRight } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';

const topics = [
  { id: 1, title: 'Professorlar',      titleEn: 'Professors',    emoji: '👨‍🏫', lessonsCount: 6 },
  { id: 2, title: 'Kosmonavtlar',      titleEn: 'Cosmonauts',    emoji: '🧑‍🚀', lessonsCount: 5 },
  { id: 3, title: 'Boshqa xodimlar',   titleEn: 'Other Workers', emoji: '👷', lessonsCount: 4 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TopicCard({ topic, index, color, colorLight, colorBorder }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px',
        borderRadius: '20px',
        border: `1px solid ${hovered ? colorBorder : 'rgba(255,255,255,0.07)'}`,
        background: hovered
          ? `linear-gradient(145deg, ${colorLight}, rgba(255,255,255,0.03))`
          : 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.35), 0 0 30px ${color}18` : '0 2px 12px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '150px', height: '150px', borderRadius: '50%',
        background: colorLight, filter: 'blur(50px)',
        opacity: hovered ? 0.7 : 0.2, transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '60px', height: '60px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colorLight, border: `1px solid ${colorBorder}`,
              fontSize: '30px', flexShrink: 0,
            }}
          >
            {topic.emoji}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#fff' }}>{topic.title}</h3>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{topic.titleEn}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ color, fontWeight: 700 }}>{topic.lessonsCount}</span> intervyu
          </span>
          <div
            style={{
              width: '38px', height: '38px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hovered ? color : colorLight,
              transition: 'all 0.25s ease',
            }}
          >
            <ArrowRight style={{
              width: '18px', height: '18px',
              color: hovered ? '#04080f' : color,
              transform: hovered ? 'translateX(2px)' : 'none',
              transition: 'all 0.25s ease',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function InterviewsView() {
  const color = '#a78bfa';
  const colorLight = 'rgba(167,139,250,0.10)';
  const colorBorder = 'rgba(167,139,250,0.25)';

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title="Intervyular — Interviews" color={color} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
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
            <Mic style={{ width: '36px', height: '36px', color }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Olimlar, kosmonavtlar va mutaxassislar bilan eksklyuziv suhbatlar
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} color={color} colorLight={colorLight} colorBorder={colorBorder} />
          ))}
        </div>
      </div>
    </div>
  );
}
