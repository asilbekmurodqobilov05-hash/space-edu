import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Palette, ArrowRight } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { useTranslation } from '@/hooks/useTranslation';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TopicCard({ topic, index, color, colorLight, colorBorder }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/learn/creativity/${topic.id}`)}
      style={{
        padding: '32px',
        borderRadius: '22px',
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
        width: '160px', height: '160px', borderRadius: '50%',
        background: colorLight, filter: 'blur(50px)',
        opacity: hovered ? 0.7 : 0.2, transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px', height: '64px', borderRadius: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: colorLight, border: `1px solid ${colorBorder}`,
              fontSize: '32px', flexShrink: 0,
            }}
          >
            {topic.id === 1 ? '🪐' : '🚀'}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#fff' }}>{i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}</h3>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{i18n.language === 'en' ? topic.title : topic.titleEn}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            {t('learnViews', 'lessonCount').split('{count}')[0]}
            <span style={{ color, fontWeight: 700 }}>{topic.lessons.length}</span>
            {t('learnViews', 'lessonCount').split('{count}')[1]}
          </span>
          <div
            style={{
              width: '42px', height: '42px', borderRadius: '12px',
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

export default function CreativityView() {
  const color = '#f472b6';
  const colorLight = 'rgba(244,114,182,0.10)';
  const colorBorder = 'rgba(244,114,182,0.25)';
  const topics = Object.values(creativityTopicsData);
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={t('learnViews', 'creativityTitle')} color={color} />

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
            <Palette style={{ width: '36px', height: '36px', color }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            {t('learnViews', 'creativityDesc')}
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
