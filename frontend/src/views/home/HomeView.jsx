import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Rocket, ArrowRight, BookOpen, Target, Award, Globe, Star, ChevronDown, Telescope, FlaskConical, Play, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import Earth3D from "@/components/3d/Earth3D";


// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
const AnimatedCounter = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let cur = 0;
      const step = end / (1600 / 16);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        setCount(Math.floor(cur));
        if (cur >= end) clearInterval(timer);
      }, 16);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-4xl md:text-5xl font-[800] tabular-nums"
        style={{ color: '#a78bfa' }}>
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-white/40 text-xs tracking-[0.18em] uppercase">{label}</span>
    </div>
  );
};

// ── GLASS CARD ────────────────────────────────────────────────────────────────
const GlassCard = ({ icon, title, desc, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="group relative p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1"
    style={{
      background: 'rgba(255,255,255,0.025)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 28px rgba(0,0,0,0.35)',
    }}
  >
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at 25% 25%, ${accent}28 0%, transparent 62%)` }} />
    <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}90, transparent)` }} />
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ border: `1px solid ${accent}30` }} />

    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `${accent}18`, border: `1px solid ${accent}35`, boxShadow: `0 0 22px ${accent}22` }}>
        {icon}
      </div>
      <h3 className="text-xl font-[700] text-white mb-3">{title}</h3>
      <p className="text-white/40 leading-relaxed text-[15px]">{desc}</p>
    </div>
  </motion.div>
);

// ── HOME VIEW ─────────────────────────────────────────────────────────────────
export default function HomeView() {
  const { t, i18n } = useTranslation();
  const nebulaRef = useRef(null);
  const nebulaWrapRef = useRef(null);
  const [scanActive, setScanActive] = useState(false);

  // Mouse parallax — direct DOM, no re-renders
  const onMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (nebulaWrapRef.current) {
      nebulaWrapRef.current.style.transform = `translate(${x * 18}px, ${y * 13}px)`;
    }
    if (nebulaRef.current) {
      nebulaRef.current.style.transform = `translate(${x * -10}px, ${y * -7}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  // Radar scan sweep every 12s
  useEffect(() => {
    const id = setInterval(() => {
      setScanActive(true);
      setTimeout(() => setScanActive(false), 2500);
    }, 12000);
    return () => clearInterval(id);
  }, []);

  const titleWords = t("home", "title").split(" ");

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Nebula ambient layers — parallax reactive */}
      <div ref={nebulaRef} className="pointer-events-none fixed inset-0 z-[1]"
        style={{ transition: 'transform 1s cubic-bezier(0.23,1,0.32,1)' }}>
        <div className="absolute" style={{
          top: '-10%', right: '-5%',
          width: 700, height: 600,
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.08) 0%, rgba(76,29,149,0.04) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div className="absolute" style={{
          top: '35%', left: '-12%',
          width: 550, height: 500,
          background: 'radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        <div className="absolute" style={{
          bottom: '0%', right: '15%',
          width: 400, height: 350,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-[100svh] flex items-center px-4 pt-20 pb-16 overflow-hidden">

        {/* Radar scan sweep */}
        {scanActive && (
          <motion.div
            className="absolute left-0 right-0 h-px z-30 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.65) 40%, rgba(167,139,250,0.65) 60%, transparent 100%)' }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, ease: 'linear' }}
          />
        )}

        {/* Subtle grid — holographic HUD feel */}
        <div className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
            backgroundSize: '65px 65px',
            opacity: 0.014,
          }} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center">

          {/* Text column */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">

            {/* Title — word-by-word reveal with blur */}
            <h1 className="text-[clamp(38px,5.8vw,72px)] font-[900] tracking-[-0.035em] leading-[1.05] mb-7 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1">
              {titleWords.map((word, i) => {
                const isHighlight = i >= titleWords.length - 2;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.1 + i * 0.13, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                    style={isHighlight ? {
                      background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #8b5cf6 80%, #c4b5fd 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      backgroundSize: '200% 200%',
                      animation: 'vgrad 6s ease infinite',
                    } : { color: '#ffffff' }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-[16px] md:text-[18px] leading-[1.75] mb-10 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {t("home", "subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                to="/learn"
                className="group flex items-center justify-center gap-2.5 px-9 py-4 rounded-[50px] font-[700] transition-all hover:scale-[1.05] active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                  color: '#ffffff',
                  boxShadow: '0 0 40px rgba(139,92,246,0.55), 0 4px 24px rgba(0,0,0,0.45)',
                }}
              >
                {t("home", "startMission")}
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>

              <Link
                to="/3d-solar-system"
                className="flex items-center justify-center gap-2.5 px-9 py-4 rounded-[50px] font-[700] transition-all hover:scale-[1.03]"
                style={{
                  color: '#e9d5ff',
                  border: '1px solid rgba(167,139,250,0.2)',
                  background: 'rgba(139,92,246,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                }}
              >
                {t("home", "exploreSpace")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* 3D Earth column */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div ref={nebulaWrapRef} style={{ transition: 'transform 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ cursor: 'grab' }}
              >
                <Earth3D size={520} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-[10px] tracking-[0.28em] uppercase font-[600]">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[12px] font-[700] tracking-[0.28em] uppercase mb-4" style={{ color: '#a78bfa' }}>
            {t("home", "academyTitle")}
          </p>
          <h2 className="text-[clamp(28px,4vw,50px)] font-[800] tracking-[-0.025em] text-white mb-5">
            {t("home", "academyHighlight")}
          </h2>
          <p className="max-w-xl mx-auto text-[16px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {t("home", "academySubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlassCard delay={0} accent="#8b5cf6" icon={<BookOpen className="w-7 h-7" style={{ color: '#a78bfa' }} />} title={t("home", "curriculumTitle")} desc={t("home", "curriculumDesc")} />
          <GlassCard delay={0.1} accent="#6366f1" icon={<Target className="w-7 h-7" style={{ color: '#818cf8' }} />} title={t("home", "missionsTitle")} desc={t("home", "missionsDesc")} />
          <GlassCard delay={0.2} accent="#7c3aed" icon={<Award className="w-7 h-7" style={{ color: '#c4b5fd' }} />} title={t("home", "certTitle")} desc={t("home", "certDesc")} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-[700] transition-all"
            style={{
              color: '#e9d5ff',
              border: '1px solid rgba(167,139,250,0.22)',
              background: 'rgba(139,92,246,0.07)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.07)'}
          >
            {t("home", "enterAcademy")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS ───────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { to: '/3d-solar-system', Icon: Globe, color: '#818cf8', label: t("home", "highlightSolarSystemTitle"), desc: t("home", "highlightSolarSystemDesc") },
            { to: '/leaderboard', Icon: Star, color: '#c4b5fd', label: t("home", "highlightLeaderboardTitle"), desc: t("home", "highlightLeaderboardDesc") },
            { to: '/star-finder', Icon: Telescope, color: '#a78bfa', label: t("home", "highlightStarFinderTitle"), desc: t("home", "highlightStarFinderDesc") },
            { to: '/lab', Icon: FlaskConical, color: '#6366f1', label: t("home", "highlightLabTitle"), desc: t("home", "highlightLabDesc") },
            { to: '/live', Icon: Play, color: '#8b5cf6', label: t("home", "highlightLiveTitle"), desc: t("home", "highlightLiveDesc") },
            { to: '/space-game', Icon: Gamepad2, color: '#7c3aed', label: t("home", "highlightSpaceRunTitle"), desc: t("home", "highlightSpaceRunDesc") },
          ].map(({ to, Icon, color, label, desc }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={to}
                className="group relative overflow-hidden flex flex-col p-8 rounded-3xl transition-all duration-400 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.022)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}40`;
                  e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.35), 0 0 30px ${color}10`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.28)';
                }}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}14 0%, transparent 60%)` }} />
                <Icon className="w-8 h-8 mb-4 relative z-10" style={{ color }} />
                <h3 className="text-lg font-[700] text-white mb-2 relative z-10">{label}</h3>
                <p className="text-sm relative z-10" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</p>
                <ArrowRight className="w-4 h-4 mt-6 relative z-10 transition-transform group-hover:translate-x-1" style={{ color }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
