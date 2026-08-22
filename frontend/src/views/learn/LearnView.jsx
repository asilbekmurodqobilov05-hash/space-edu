import { ArrowRight, Atom, Mic, Palette, Telescope, HelpCircle, Calculator, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

/* ─────────── section definitions ─────────── */
const sections = [
  {
    id: 'physics',
    title: 'Fizika',
    titleEn: 'Physics',
    link: '/learn/physics',
    icon: Atom,
    color: '#7c3aed',
    colorLight: '#a78bfa',
    badge: 'TOP',
    gridClass: 'physics-card',
    description: 'Kosmik mexanika, gravitatsiya va energiya asoslari',
    topics: ['Nyuton qonunlari', 'Gravitatsiya', 'Termodinamika', 'Kvant fizikasi'],
    lessonsCount: 24,
  },
  {
    id: 'problems',
    title: 'Masalalar',
    titleEn: 'Problems',
    link: '/learn/problems',
    icon: Calculator,
    color: '#10b981',
    colorLight: '#34d399',
    gridClass: 'problems-card',
    description: 'Amaliy masalalar va olimpiada savollari',
    topics: ['Hisoblash', 'Olimpiada', 'Laboratoriya', 'Real loyihalar'],
    lessonsCount: 145,
  },
  {
    id: 'creativity',
    title: 'Ijodkorlik',
    titleEn: 'Creativity',
    link: '/learn/creativity',
    icon: Palette,
    color: '#ec4899',
    colorLight: '#f472b6',
    badge: 'NEW',
    gridClass: 'creativity-card',
    description: "Kosmik san'at, yozish va dizayn loyihalari",
    topics: ["Kosmik san'at", 'Ilmiy fantastika', '3D modellash', 'Infografika'],
    lessonsCount: 16,
  },
  {
    id: 'astronomy',
    title: 'Astronomiya',
    titleEn: 'Astronomy',
    link: '/learn/astronomy',
    icon: Globe,
    color: '#fbbf24',
    colorLight: '#fbbf24',
    gridClass: 'astronomy-card',
    description: 'Yulduzlar, galaktikalar va koinot tuzilishi',
    topics: ['Quyosh tizimi', 'Yulduzlar evolyutsiyasi', 'Galaktikalar', 'Qora tuynuklar'],
    lessonsCount: 32,
  },
  {
    id: 'interviews',
    title: 'Intervyular',
    titleEn: 'Interviews',
    link: '/learn/interviews',
    icon: Mic,
    color: '#38bdf8',
    colorLight: '#38bdf8',
    gridClass: 'interviews-card',
    description: 'Olimlar, astronavtlar va muhandislar bilan suhbatlar',
    topics: ["O'zbek tadqiqotchilari", "O'zbek olimlari", 'Astronavtlar', 'Muhandislar'],
    lessonsCount: 12,
  },
];

/* ─────────── BentoCard — Styled course card component ─────────── */
function BentoCard({ section, index }) {
  const navigate = useNavigate();
  const Icon = section.icon;
  const { t } = useTranslation();

  const isHorizontal = section.id === 'interviews';

  return (
    <div
      onClick={() => navigate(section.link)}
      className={`course-card ${section.gridClass}`}
      style={{
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#07080f',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderLeft: `4px solid ${section.color}`,
        padding: isHorizontal ? '32px' : '28px',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: isHorizontal ? 'center' : 'stretch',
        justifyContent: 'space-between',
        gap: '24px',
        animationDelay: `${(index + 1) * 0.1}s`,
        '--accent-color': section.color,
      }}
    >
      {/* Ambient glow inside card */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${section.color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Course number watermark in background */}
      {!isHorizontal && (
        <span style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '18px',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.04)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      {/* Main content layout */}
      {isHorizontal ? (
        // Horizontal Layout for Interviews
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, width: '100%', flexWrap: 'wrap' }}>
          {/* Planet Icon with Orbit Ring */}
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div className="orbit-ring" style={{ '--ring-color': section.colorLight }} />
            <div className="planet-icon" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#0d0e1b',
              border: `1px solid ${section.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${section.color}15`,
            }}>
              <Icon style={{ width: '18px', height: '18px', color: section.colorLight }} />
            </div>
          </div>

          {/* Info Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '22px',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                {section.titleEn}
              </h3>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: section.colorLight,
                letterSpacing: '0.03em',
              }}>
                {section.title}
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {section.description}
            </p>

            {/* Tag Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {section.topics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: section.colorLight,
                    background: `${section.color}12`,
                    border: `1px solid ${section.color}25`,
                    padding: '3px 10px',
                    borderRadius: '12px',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Lesson Count + Arrow on Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            paddingLeft: '24px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '32px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
              }}>
                {section.lessonsCount}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '4px',
              }}>
                {t('learn', 'lessons') || 'darslar'}
              </span>
            </div>

            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `1px solid ${section.color}33`,
              background: `${section.color}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: section.colorLight,
              transition: 'all 0.25s ease',
            }}
            className="card-arrow-btn"
            >
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </div>
          </div>
        </div>
      ) : (
        // Vertical Layout for Others (Physics, Problems, Creativity, Astronomy)
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Row: Planet Icon and Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div className="orbit-ring" style={{ '--ring-color': section.colorLight }} />
                <div className="planet-icon" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#0d0e1b',
                  border: `1px solid ${section.color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 15px ${section.color}15`,
                }}>
                  <Icon style={{ width: '18px', height: '18px', color: section.colorLight }} />
                </div>
              </div>

              {section.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: '#fff',
                  background: section.color,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.05em',
                  fontFamily: "'Orbitron', sans-serif",
                  boxShadow: `0 0 10px ${section.color}40`,
                }}>
                  {section.badge}
                </span>
              )}
            </div>

            {/* Title and Subtitle */}
            <div>
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '20px',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                {section.titleEn}
              </h3>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: section.colorLight,
                letterSpacing: '0.03em',
              }}>
                {section.title}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {section.description}
            </p>

            {/* Tag Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {section.topics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: section.colorLight,
                    background: `${section.color}12`,
                    border: `1px solid ${section.color}25`,
                    padding: '3px 10px',
                    borderRadius: '12px',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1,
                }}>
                  {section.lessonsCount}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: 500,
                }}>
                  {t('learn', 'lessons') || 'darslar'}
                </span>
              </div>

              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `1px solid ${section.color}33`,
                background: `${section.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: section.colorLight,
                transition: 'all 0.25s ease',
              }}
              className="card-arrow-btn"
              >
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* ─────────── main LearnView ─────────── */
export default function LearnView() {
  const { t, i18n } = useTranslation();

  // Connected bordered stats config
  const stats = [
    { number: '229', label: i18n.language === 'en' ? 'Lessons' : i18n.language === 'ru' ? 'Уроков' : 'Darslar' },
    { number: '6', label: i18n.language === 'en' ? 'Courses' : i18n.language === 'ru' ? 'Курсов' : 'Kurslar' },
    { number: '3', label: i18n.language === 'en' ? 'Languages' : i18n.language === 'ru' ? 'Языка' : 'Tillar' },
    { number: '∞', label: i18n.language === 'en' ? 'Universe' : i18n.language === 'ru' ? 'Вселенная' : 'Koinot' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '96px', paddingBottom: '80px',
      paddingLeft: '24px', paddingRight: '24px',
      maxWidth: '1280px', margin: '0 auto',
      position: 'relative',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header / Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
        {/* Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #7c3aed',
          borderRadius: '9999px',
          padding: '6px 16px',
          background: 'rgba(124, 58, 237, 0.08)',
          marginBottom: '20px',
          boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
        }}>
          <Telescope style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#a78bfa',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            UZ COSMOS ACADEMY
          </span>
        </div>

        {/* H1 Title */}
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(36px, 5.5vw, 68px)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          margin: '0 0 16px 0',
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>KOINOTNI </span>
          <span style={{ color: '#a78bfa', textShadow: '0 0 30px rgba(167, 139, 250, 0.4)' }}>O'RGAN</span>
        </h1>

        {/* Subtitle text */}
        <p style={{
          color: 'rgba(255, 255, 255, 0.55)', fontSize: '17px',
          maxWidth: '560px', margin: '0 auto', lineHeight: 1.6,
        }}>
          {t('learn', 'pageSubtitle')}
        </p>

        {/* Connected stats row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          background: '#07080f',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '680px',
          margin: '36px auto 0',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(167, 139, 250, 0.05)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 12px',
              flex: '1 1 120px',
              borderRight: idx < 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
            }}
            className="stats-item"
            >
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '28px',
                fontWeight: 900,
                color: '#a78bfa',
                lineHeight: 1.2
              }}>
                {stat.number}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                marginTop: '4px'
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="learn-bento-grid">
        {sections.map((section, index) => (
          <BentoCard key={section.id} section={section} index={index} />
        ))}
      </div>
    </div>
  );
}
