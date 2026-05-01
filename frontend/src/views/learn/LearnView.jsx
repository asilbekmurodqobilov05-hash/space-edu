import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Atom, Mic, Palette, Telescope, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─────────── section definitions (ordered) ─────────── */
const sections = [
  {
    id: 'physics',
    title: 'Fizika',
    titleEn: 'Physics',
    link: '/learn/physics',
    icon: Atom,
    color: '#a78bfa',
    colorLight: 'rgba(167,139,250,0.10)',
    colorBorder: 'rgba(167,139,250,0.22)',
    glow: 'rgba(167,139,250,0.4)',
    description: 'Kosmik mexanika, gravitatsiya va energiya asoslari',
    topics: ['Nyuton qonunlari', 'Gravitatsiya', 'Termodinamika', 'Kvant fizikasi'],
    lessonsCount: 24,
    // bento: wide top-left
    gridArea: 'fizika',
  },
  {
    id: 'astronomy',
    title: 'Astronomiya',
    titleEn: 'Astronomy',
    link: '/learn/astronomy',
    icon: Telescope,
    color: '#fbbf24',
    colorLight: 'rgba(251,191,36,0.10)',
    colorBorder: 'rgba(251,191,36,0.22)',
    glow: 'rgba(251,191,36,0.4)',
    description: 'Yulduzlar, galaktikalar va koinot tuzilishi',
    topics: ['Quyosh tizimi', 'Yulduzlar evolyutsiyasi', 'Galaktikalar', 'Qora tuynuklar'],
    lessonsCount: 32,
    // bento: tall right column
    gridArea: 'astro',
  },
  {
    id: 'problems',
    title: 'Masalalar',
    titleEn: 'Problems',
    link: '/learn/problems',
    icon: HelpCircle,
    color: '#4ade80',
    colorLight: 'rgba(74,222,128,0.10)',
    colorBorder: 'rgba(74,222,128,0.22)',
    glow: 'rgba(74,222,128,0.4)',
    description: 'Amaliy masalalar va olimpiada savollari',
    topics: ['Hisoblash', 'Olimpiada', 'Laboratoriya', 'Real loyihalar'],
    lessonsCount: 145,
    gridArea: 'masala',
  },
  {
    id: 'creativity',
    title: 'Ijodkorlik',
    titleEn: 'Creativity',
    link: '/learn/creativity',
    icon: Palette,
    color: '#f472b6',
    colorLight: 'rgba(244,114,182,0.10)',
    colorBorder: 'rgba(244,114,182,0.22)',
    glow: 'rgba(244,114,182,0.4)',
    description: "Kosmik san'at, yozish va dizayn loyihalari",
    topics: ["Kosmik san'at", 'Ilmiy fantastika', '3D modellash', 'Infografika'],
    lessonsCount: 16,
    gridArea: 'ijod',
  },
  {
    id: 'interviews',
    title: 'Intervyular',
    titleEn: 'Interviews',
    link: '/learn/interviews',
    icon: Mic,
    color: '#a78bfa',
    colorLight: 'rgba(167,139,250,0.10)',
    colorBorder: 'rgba(167,139,250,0.22)',
    glow: 'rgba(167,139,250,0.35)',
    description: 'Olimlar, astronavtlar va muhandislar bilan suhbatlar',
    topics: ['NASA tadqiqotchilari', "O'zbek olimlari", 'Astronavtlar', 'Muhandislar'],
    lessonsCount: 12,
    gridArea: 'interv',
  },
];

/* ─────────── BentoCard ─────────── */
function BentoCard({ section, index, wide, tall }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(section.link)}
      style={{
        gridArea: section.gridArea,
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${hovered ? section.colorBorder : 'rgba(255,255,255,0.07)'}`,
        background: hovered
          ? `linear-gradient(140deg, ${section.colorLight} 0%, rgba(255,255,255,0.025) 100%)`
          : 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.38s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateY(-5px) scale(1.005)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 24px 64px rgba(0,0,0,0.4), 0 0 48px ${section.glow}`
          : '0 4px 20px rgba(0,0,0,0.18)',
      }}
    >
      {/* Ambient glow blob */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: section.colorLight,
          filter: 'blur(70px)',
          opacity: hovered ? 1 : 0.35,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle number watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: '20px',
          fontSize: '120px',
          fontWeight: 900,
          color: section.colorLight,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          filter: 'blur(1px)',
          opacity: 0.6,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div
        style={{
          padding: wide || tall ? '36px 40px' : '28px 32px',
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: tall ? 'column' : wide ? 'row' : 'column',
          gap: wide ? '32px' : '0',
          alignItems: wide ? 'center' : 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        {/* Top section */}
        <div style={{ flex: wide ? 1 : 'unset' }}>
          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div
              style={{
                width: tall ? '64px' : '52px',
                height: tall ? '64px' : '52px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: section.colorLight,
                border: `1px solid ${section.colorBorder}`,
                boxShadow: hovered ? `0 0 28px ${section.glow}` : 'none',
                transition: 'box-shadow 0.35s ease',
                flexShrink: 0,
              }}
            >
              <Icon style={{ width: tall ? '30px' : '24px', height: tall ? '30px' : '24px', color: section.color }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: tall ? '26px' : wide ? '28px' : '20px',
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {section.title}
              </h3>
              <span
                style={{
                  fontSize: '12px',
                  color: section.color,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {section.titleEn}
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: wide ? '16px' : '14px',
              lineHeight: 1.65,
              marginBottom: wide ? '0' : '16px',
              maxWidth: wide ? '400px' : '100%',
            }}
          >
            {section.description}
          </p>
        </div>

        {/* Topics + footer */}
        <div
          style={{
            flex: wide ? 1 : 'unset',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: wide ? 'center' : 'flex-end',
            gap: '16px',
          }}
        >
          {/* Topics chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {section.topics.map((topic) => (
              <span
                key={topic}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: section.color,
                  background: section.colorLight,
                  border: `1px solid ${section.colorBorder}`,
                  letterSpacing: '0.02em',
                }}
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Footer: count + arrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: section.color,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {section.lessonsCount}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 500 }}>
                darslar
              </span>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: hovered ? section.color : `${section.color}20`,
                border: `1px solid ${hovered ? section.color : section.colorBorder}`,
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowRight
                style={{
                  width: '18px',
                  height: '18px',
                  color: hovered ? '#04080f' : section.color,
                  transform: hovered ? 'translateX(2px)' : 'translateX(0)',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────── main LearnView ─────────── */
export default function LearnView() {
  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '96px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: 'fixed', top: '-200px', left: '-200px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: '-200px', right: '-200px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              margin: '0 0 16px 0',
            }}
          >
            <span style={{ color: '#fff' }}>Koinot </span>
            <span
              style={{
                color: '#c084fc',
                textShadow: '0 0 40px rgba(192,132,252,0.55), 0 0 90px rgba(192,132,252,0.2)',
              }}
            >
              Akademiyasi
            </span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '18px',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Fizikadan astronomiyagacha — koinot sirlarini o'rganing
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '2px',
            maxWidth: '180px',
            margin: '28px auto 0',
            background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.6), transparent)',
          }}
        />
      </div>

      {/*
        ──────── BENTO GRID ────────
        3 columns × 3 rows
        "fizika"  "fizika"  "astro"
        "masala"  "ijod"    "astro"
        "interv"  "interv"  "interv"
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '280px 280px 200px',
          gridTemplateAreas: `
            "fizika  fizika  astro"
            "masala  ijod    astro"
            "interv  interv  interv"
          `,
          gap: '18px',
          position: 'relative',
          zIndex: 1,
        }}
        className="bento-grid"
      >
        {/* Fizika — wide top-left */}
        <BentoCard section={sections[0]} index={0} wide />

        {/* Astronomiya — tall right */}
        <BentoCard section={sections[1]} index={1} tall />

        {/* Masalalar — mid-left */}
        <BentoCard section={sections[2]} index={2} />

        {/* Ijodkorlik — mid-center */}
        <BentoCard section={sections[3]} index={3} />

        {/* Intervyular — full-width bottom */}
        <BentoCard section={sections[4]} index={4} wide />
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            grid-template-areas:
              "fizika"
              "astro"
              "masala"
              "ijod"
              "interv" !important;
          }
        }
        @media (max-width: 1100px) and (min-width: 901px) {
          .bento-grid {
            grid-template-rows: 300px 300px 220px !important;
          }
        }
      `}</style>
    </div>
  );
}
