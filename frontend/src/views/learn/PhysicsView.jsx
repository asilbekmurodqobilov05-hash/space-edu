import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Atom, ArrowRight } from 'lucide-react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { useTranslation } from '@/hooks/useTranslation';

const topics = [
  { id: 1,  title: 'Kinematika',                         titleEn: 'Kinematics',                           titleRu: 'Кинематика',                                         lessonsCount: 12 },
  { id: 2,  title: 'Dinamika',                            titleEn: 'Dynamics',                             titleRu: 'Динамика',                                           lessonsCount: 10 },
  { id: 3,  title: 'Statika',                             titleEn: 'Statics',                              titleRu: 'Статика',                                            lessonsCount: 8  },
  { id: 4,  title: 'Suyuqlik va gazlar mexanikasi',       titleEn: 'Mechanics of Fluids and Gases',         titleRu: 'Механика жидкостей и газов',                         lessonsCount: 9  },
  { id: 5,  title: "Tebranishlar va to'lqinlar",          titleEn: 'Oscillations and Waves',               titleRu: 'Колебания и волны',                                  lessonsCount: 11 },
  { id: 6,  title: 'Molekulyar fizika',                   titleEn: 'Molecular Physics',                    titleRu: 'Молекулярная физика',                                lessonsCount: 10 },
  { id: 7,  title: 'Termodinamika',                       titleEn: 'Thermodynamics',                       titleRu: 'Термодинамика',                                      lessonsCount: 8  },
  { id: 8,  title: 'Elektrostatika',                      titleEn: 'Electrostatics',                       titleRu: 'Электростатика',                                     lessonsCount: 9  },
  { id: 9,  title: "O'zgarmas tok qonunlari",             titleEn: 'Laws of Direct Current',               titleRu: 'Законы постоянного тока',                            lessonsCount: 10 },
  { id: 10, title: 'Turli muhitlarda elektr qonunlari',   titleEn: 'Electrical Laws in Different Media',   titleRu: 'Законы электрического тока в различных средах',      lessonsCount: 7  },
  { id: 11, title: 'Elektromagnit hodisalar',             titleEn: 'Electromagnetic Phenomena',            titleRu: 'Электромагнитные явления',                           lessonsCount: 8  },
  { id: 12, title: "Elektromagnit tebranishlar va to'lqinlar", titleEn: 'Electromagnetic Oscillations and Waves', titleRu: 'Электромагнитные колебания и волны',          lessonsCount: 9  },
  { id: 13, title: 'Optika',                              titleEn: 'Optics',                               titleRu: 'Оптика',                                             lessonsCount: 10 },
  { id: 14, title: 'Atom va yadro fizikasi',              titleEn: 'Atomic and Nuclear Physics',           titleRu: 'Атомная и ядерная физика',                           lessonsCount: 12 },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Topic row card ─── */
function TopicCard({ topic, index, color }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const mainTitle =
    i18n.language === 'en' ? (topic.titleEn || topic.title)
    : i18n.language === 'ru' ? (topic.titleRu || topic.title)
    : topic.title;
  const subTitle =
    i18n.language === 'en' ? topic.title
    : topic.titleEn;

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
        gap: '16px',
        padding: '18px 20px 18px 0',
        borderRadius: '14px',
        background: hovered ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `4px solid ${hovered ? color : 'rgba(139,92,246,0.35)'}`,
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.5), 0 0 18px ${color}22`
          : '0 2px 10px rgba(0,0,0,0.25)',
      }}
    >
      {/* Left: Badge + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '20px', flex: 1 }}>
        {/* Orbitron numbered badge */}
        <div style={{
          position: 'relative',
          width: '42px',
          height: '42px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Spinning orbit ring */}
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
          {/* Badge circle */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(109,40,217,0.2) 100%)',
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

        {/* Title block */}
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
          <span style={{
            fontSize: '12px',
            color: 'rgba(167,139,250,0.7)',
            fontWeight: 500,
          }}>
            {subTitle}
          </span>
        </div>
      </div>

      {/* Right: lesson count + arrow */}
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
            {topic.lessonsCount}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {t('learn', 'lessons') || 'dars'}
          </span>
        </div>

        {/* Arrow circle button */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: `1.5px solid ${hovered ? color : 'rgba(139,92,246,0.4)'}`,
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

/* ─── Main view ─── */
export default function PhysicsView() {
  const color = '#a78bfa';
  const colorLight = 'rgba(167,139,250,0.12)';
  const colorBorder = 'rgba(167,139,250,0.22)';
  const { t, i18n } = useTranslation();

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={t('learnViews', 'physicsTitle')} color={color} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ── Large Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          {/* Sphere icon with spinning orbit ring */}
          <div style={{
            position: 'relative',
            width: '96px',
            height: '96px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Outer spinning ring */}
            <div style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: color,
              borderRightColor: `${color}60`,
              animation: 'spin-ring 4s linear infinite',
            }} />
            {/* Inner counter-spin dashed ring */}
            <div style={{
              position: 'absolute',
              inset: '-7px',
              borderRadius: '50%',
              border: '1px dashed rgba(167,139,250,0.3)',
              animation: 'spin-ring 9s linear infinite reverse',
            }} />
            {/* Icon container */}
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(167,139,250,0.25) 0%, rgba(109,40,217,0.1) 100%)`,
              border: `2px solid ${colorBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 40px ${color}25, 0 0 80px ${color}10`,
            }}>
              <Atom style={{ width: '44px', height: '44px', color }} />
            </div>
          </div>

          {/* Title in Orbitron */}
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
            {t('learnViews', 'physicsTitle') || 'Physics'}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '15px',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            {t('learnViews', 'physicsDesc')}
          </p>

          {/* Divider */}
          <div style={{
            width: '60px',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            margin: '24px auto 0',
            borderRadius: '2px',
          }} />
        </motion.div>

        {/* ── Topics list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}
