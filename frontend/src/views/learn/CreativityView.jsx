import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Palette, ArrowRight } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { useLearnTopics } from '@/hooks/useLearnTopics';
import { useTranslation } from '@/hooks/useTranslation';

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TopicCard({ topic, index, color }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const mainTitle =
    i18n.language === 'en' ? (topic.titleEn || topic.title)
    : i18n.language === 'ru' ? (topic.titleRu || topic.title)
    : topic.title;
  const subTitle = i18n.language === 'en' ? topic.title : topic.titleEn;

  const lessonCount = topic.sections
    ? topic.sections.reduce((acc, s) => acc + s.lessons.length, 0)
    : topic.lessons?.length ?? 0;

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '18px 20px 18px 0',
        borderRadius: '14px',
        background: hovered ? `${color}08` : 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `4px solid ${hovered ? color : `${color}50`}`,
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.5), 0 0 18px ${color}22`
          : '0 2px 10px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '20px', flex: 1 }}>
        <div style={{
          position: 'relative',
          width: '42px',
          height: '42px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderTopColor: color,
            borderRightColor: color,
            animation: 'spin-ring 5s linear infinite',
            opacity: 0.7,
          }} />
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}35 0%, ${color}18 100%)`,
            border: `1px solid ${color}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '13px',
            fontWeight: 900,
            color: '#fff',
            boxShadow: `0 0 12px ${color}30`,
          }}>
            {String(topic.id).padStart(2, '0')}
          </div>
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Orbitron', sans-serif",
            margin: '0 0 3px 0',
            fontSize: '15px',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}>
            {mainTitle}
          </h3>
          <span style={{ fontSize: '12px', color: `${color}99`, fontWeight: 500 }}>
            {subTitle}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingRight: '20px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '18px',
            fontWeight: 900,
            color: hovered ? color : '#fff',
            display: 'block',
            lineHeight: 1,
            transition: 'color 0.2s ease',
          }}>
            {lessonCount}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('learn', 'lessons') || 'dars'}
          </span>
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: `1.5px solid ${hovered ? color : `${color}50`}`,
          background: hovered ? color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
          flexShrink: 0,
        }}>
          <ArrowRight style={{
            width: '15px',
            height: '15px',
            color: hovered ? '#0a0a14' : color,
            transform: hovered ? 'translateX(1px)' : 'none',
            transition: 'all 0.25s ease',
          }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function CreativityView() {
  const color = '#f472b6';
  const colorLight = 'rgba(244,114,182,0.10)';
  const colorBorder = 'rgba(244,114,182,0.22)';
  const topics = Object.values(useLearnTopics('creativity').topics);
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={t('learnViews', 'creativityTitle')} color={color} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{
            position: 'relative',
            width: '96px',
            height: '96px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: color,
              borderRightColor: `${color}60`,
              animation: 'spin-ring 4s linear infinite',
            }} />
            <div style={{
              position: 'absolute',
              inset: '-7px',
              borderRadius: '50%',
              border: `1px dashed ${color}35`,
              animation: 'spin-ring 9s linear infinite reverse',
            }} />
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${colorLight} 0%, rgba(0,0,0,0.1) 100%)`,
              border: `2px solid ${colorBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 40px ${color}25, 0 0 80px ${color}10`,
            }}>
              <Palette style={{ width: '44px', height: '44px', color }} />
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            margin: '0 0 12px 0',
            textShadow: `0 0 20px ${color}50`,
          }}>
            {t('learnViews', 'creativityTitle') || 'Creativity'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            {t('learnViews', 'creativityDesc')}
          </p>
          <div style={{
            width: '60px', height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            margin: '24px auto 0', borderRadius: '2px',
          }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}
