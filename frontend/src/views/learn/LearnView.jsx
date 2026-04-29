import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Award, PlayCircle, CheckCircle2, Lock, ArrowRight, Video, Shield, Rocket, Wrench, AlertTriangle, Atom, Mic, Palette, Telescope, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { learningData } from '@/data/learningData';
import { useLearningStore } from '@/store/useLearningStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';

/* ───────── section definitions ───────── */
const sections = {
  left: [
    {
      id: 'physics',
      title: 'Fizika',
      titleEn: 'Physics',
      link: '/learn/physics',
      icon: Atom,
      color: '#00e5ff',
      colorLight: 'rgba(0,229,255,0.12)',
      colorBorder: 'rgba(0,229,255,0.25)',
      glow: 'rgba(0,229,255,0.35)',
      description: "Kosmik mexanika, gravitatsiya va energiya asoslari",
      topics: ['Nyuton qonunlari', 'Gravitatsiya', 'Termodinamika', 'Kvant fizikasi'],
      lessonsCount: 24,
      progress: 0,
    },
    {
      id: 'interviews',
      title: 'Intervyular',
      titleEn: 'Interviews',
      link: '/learn/interviews',
      icon: Mic,
      color: '#a78bfa',
      colorLight: 'rgba(167,139,250,0.12)',
      colorBorder: 'rgba(167,139,250,0.25)',
      glow: 'rgba(167,139,250,0.35)',
      description: "Olimlar va astronavtlar bilan suhbatlar",
      topics: ['NASA tadqiqotchilari', "O'zbek olimlari", 'Astronavtlar', 'Muhandislar'],
      lessonsCount: 12,
      progress: 0,
    },
    {
      id: 'creativity',
      title: 'Ijodkorlik',
      titleEn: 'Creativity',
      link: '/learn/creativity',
      icon: Palette,
      color: '#f472b6',
      colorLight: 'rgba(244,114,182,0.12)',
      colorBorder: 'rgba(244,114,182,0.25)',
      glow: 'rgba(244,114,182,0.35)',
      description: "Kosmik san'at, yozish va dizayn loyihalari",
      topics: ['Kosmik san\'at', 'Ilmiy fantastika', '3D modellash', 'Infografika'],
      lessonsCount: 16,
      progress: 0,
    },
  ],
  right: [
    {
      id: 'astronomy',
      title: 'Astronomiya',
      titleEn: 'Astronomy',
      link: '/learn/astronomy',
      icon: Telescope,
      color: '#fbbf24',
      colorLight: 'rgba(251,191,36,0.12)',
      colorBorder: 'rgba(251,191,36,0.25)',
      glow: 'rgba(251,191,36,0.35)',
      description: "Yulduzlar, galaktikalar va koinot tuzilishi",
      topics: ['Quyosh tizimi', 'Yulduzlar evolyutsiyasi', 'Galaktikalar', 'Qora tuynuklar'],
      lessonsCount: 32,
      progress: 0,
    },
    {
      id: 'problems',
      title: 'Masalalar',
      titleEn: 'Problems',
      link: '/learn/problems',
      icon: HelpCircle,
      color: '#4ade80',
      colorLight: 'rgba(74,222,128,0.12)',
      colorBorder: 'rgba(74,222,128,0.25)',
      glow: 'rgba(74,222,128,0.35)',
      description: "Amaliy masalalar va olimpiada savollari",
      topics: ['Hisoblash masalalari', 'Olimpiada', 'Laboratoriya', 'Real loyihalar'],
      lessonsCount: 40,
      progress: 0,
    },
  ],
};

/* ───────── card animation variants ───────── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ───────── SectionCard component ───────── */
function SectionCard({ section, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const Icon = section.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(section.link)}
      style={{
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? section.colorBorder : 'rgba(255,255,255,0.08)'}`,
        background: hovered
          ? `linear-gradient(145deg, ${section.colorLight}, rgba(255,255,255,0.03))`
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${section.glow}`
          : '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Background glow blob */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: section.colorLight,
          filter: 'blur(60px)',
          opacity: hovered ? 0.8 : 0.3,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{ padding: '32px', position: 'relative', zIndex: 1 }}>
        {/* Icon + Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: section.colorLight,
              border: `1px solid ${section.colorBorder}`,
              boxShadow: hovered ? `0 0 24px ${section.glow}` : 'none',
              transition: 'box-shadow 0.35s ease',
            }}
          >
            <Icon style={{ width: '28px', height: '28px', color: section.color }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {section.title}
            </h3>
            <span
              style={{
                fontSize: '13px',
                color: section.color,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {section.titleEn}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          {section.description}
        </p>

        {/* Topics */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {section.topics.map((topic) => (
            <span
              key={topic}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                color: section.color,
                background: section.colorLight,
                border: `1px solid ${section.colorBorder}`,
              }}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Footer: lesson count + arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500 }}>
            <span style={{ color: section.color, fontWeight: 700 }}>{section.lessonsCount}</span> darslar
          </span>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: hovered ? section.color : section.colorLight,
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowRight
              style={{
                width: '20px',
                height: '20px',
                color: hovered ? '#04080f' : section.color,
                transform: hovered ? 'translateX(2px)' : 'translateX(0)',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── main LearnView ───────── */
export default function LearnView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enrolledUnits, enrollUnit, isLessonUnlocked, getUnitProgress, completedLessons, currentLessonId, currentUnitId } = useLearningStore();
  const { xp, level } = useGamificationStore();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ─── Decorative background glows ─── */}
      <div
        style={{
          position: 'fixed',
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ─── Title: Koinot Akademiyasi ─── */}
      <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 16px 0',
            }}
          >
            <span style={{ color: '#fff' }}>Koinot </span>
            <span
              style={{
                color: '#00e5ff',
                textShadow: '0 0 40px rgba(0,229,255,0.5), 0 0 80px rgba(0,229,255,0.2)',
              }}
            >
              Akademiyasi
            </span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Koinot ilmlarini o'rganing — fizikadan astronomiyagacha, ijodkorlikdan amaliy masalalargacha
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '2px',
            maxWidth: '200px',
            margin: '32px auto 0',
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)',
          }}
        />
      </div>

      {/* ─── Two-column grid ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          position: 'relative',
          zIndex: 1,
        }}
        className="learn-grid"
      >
        {/* Left Column: Physics, Interviews, Creativity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.35)',
              margin: '0 0 4px 4px',
            }}
          >
            Asosiy fanlar
          </motion.h2>
          {sections.left.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* Right Column: Astronomy, Problems */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.35)',
              margin: '0 0 4px 4px',
            }}
          >
            Amaliy yo'nalishlar
          </motion.h2>
          {sections.right.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i + 3} />
          ))}
        </div>
      </div>

      {/* ─── Responsive CSS for mobile ─── */}
      <style>{`
        @media (max-width: 768px) {
          .learn-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
