import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Rocket, ArrowRight, BookOpen, Target, Award, Zap, Globe, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

// ── MILKY WAY STARFIELD ───────────────────────────────────────────────────────
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0, h = 0, stars = [];

    const COLORS = ['#ffffff', '#ffe8d6', '#e8e0ff', '#d4e8ff', '#fff4e0'];

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const r = Math.random;

      // Background stars — scattered uniformly
      const bg = Array.from({ length: 380 }, () => ({
        x: r() * w, y: r() * h,
        sz: 0.15 + r() * 0.55,
        spd: 0.003 + r() * 0.008,
        ph: r() * Math.PI * 2,
        col: '#ffffff',
        base: 0.25 + r() * 0.45,
        sparkle: false,
        mw: false,
      }));

      // Milky Way band — diagonal, bottom-left to top-right (~35°)
      const mw = Array.from({ length: 750 }, () => {
        const t = r();
        const perp = (r() - 0.5) * 0.28;
        const cos35 = Math.cos(0.61);
        const sin35 = Math.sin(0.61);
        const bx = (t + perp * cos35 - 0.1) * w;
        const by = h - (t * 0.9 + perp * sin35) * h * 1.1;
        return {
          x: bx, y: by,
          sz: 0.08 + r() * 0.42,
          spd: 0.004 + r() * 0.013,
          ph: r() * Math.PI * 2,
          col: COLORS[Math.floor(r() * COLORS.length)],
          base: 0.18 + r() * 0.55,
          sparkle: false,
          mw: true,
        };
      });

      // Bright foreground sparkle stars
      const bright = Array.from({ length: 22 }, () => ({
        x: r() * w, y: r() * h,
        sz: 1.1 + r() * 1.9,
        spd: 0.009 + r() * 0.02,
        ph: r() * Math.PI * 2,
        col: r() > 0.5 ? '#ffffff' : r() > 0.25 ? '#c4b5fd' : '#ffe4b5',
        base: 0.65 + r() * 0.3,
        sparkle: true,
        mw: false,
      }));

      stars = [...bg, ...mw, ...bright];
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);

      // Milky Way soft purple glow band
      const grd = ctx.createLinearGradient(0, h * 0.85, w * 0.85, 0);
      grd.addColorStop(0,    'rgba(55, 15, 95, 0)');
      grd.addColorStop(0.2,  'rgba(75, 25, 120, 0.016)');
      grd.addColorStop(0.45, 'rgba(95, 45, 145, 0.028)');
      grd.addColorStop(0.6,  'rgba(75, 25, 120, 0.016)');
      grd.addColorStop(1,    'rgba(55, 15, 95, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.spd + s.ph);
        ctx.globalAlpha = s.base * (0.45 + 0.55 * tw);

        if (s.sparkle) {
          ctx.strokeStyle = s.col;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const ang = (i / 4) * Math.PI * 2;
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + Math.cos(ang) * s.sz * 3.5, s.y + Math.sin(ang) * s.sz * 3.5);
          }
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz, 0, Math.PI * 2);
        ctx.fillStyle = s.col;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", init); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// ── NEBULA VISUAL ─────────────────────────────────────────────────────────────
// Fixed star positions inside the nebula (avoids Math.random in render)
const NEBULA_STARS = [
  { x: 42, y: 38, r: 3, col: '#e9d5ff', sz: 10, dur: '2.4s', del: '0s' },
  { x: 55, y: 50, r: 2, col: '#ffffff', sz: 7,  dur: '3.6s', del: '1.2s' },
  { x: 35, y: 55, r: 2, col: '#c4b5fd', sz: 8,  dur: '4.1s', del: '0.5s' },
  { x: 62, y: 40, r: 2, col: '#ffffff', sz: 6,  dur: '2.8s', del: '1.8s' },
  { x: 48, y: 65, r: 3, col: '#ffe4b5', sz: 9,  dur: '3.2s', del: '0.3s' },
  { x: 38, y: 44, r: 2, col: '#c4b5fd', sz: 7,  dur: '5.0s', del: '2.1s' },
  { x: 58, y: 62, r: 2, col: '#ffffff', sz: 6,  dur: '3.8s', del: '0.9s' },
  { x: 44, y: 30, r: 2, col: '#e9d5ff', sz: 8,  dur: '4.5s', del: '1.5s' },
  { x: 52, y: 48, r: 4, col: '#ffffff', sz: 12, dur: '2.0s', del: '0s' },
  { x: 67, y: 52, r: 2, col: '#c4b5fd', sz: 7,  dur: '3.4s', del: '0.7s' },
];

const Nebula = () => (
  <div className="relative w-[520px] h-[520px] select-none pointer-events-none flex items-center justify-center">
    <style>{`
      @keyframes nb-d1 { 0%,100%{transform:translate(0,0) scale(1)}   50%{transform:translate(14px,-10px) scale(1.05)} }
      @keyframes nb-d2 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-11px,8px) rotate(4deg)} }
      @keyframes nb-d3 { 0%,100%{transform:translate(0,0)}  33%{transform:translate(8px,11px)} 66%{transform:translate(-6px,-7px)} }
      @keyframes nb-pulse { 0%,100%{opacity:.78;transform:scale(1)} 50%{opacity:1;transform:scale(1.09)} }
      @keyframes nb-core  { 0%,100%{opacity:.82} 50%{opacity:1} }
    `}</style>

    {/* Faint outer halo */}
    <div className="absolute rounded-full" style={{
      width: 480, height: 380,
      background: 'radial-gradient(ellipse, rgba(109,40,217,0.10) 0%, rgba(76,29,149,0.05) 45%, transparent 70%)',
      filter: 'blur(45px)',
      animation: 'nb-d1 20s ease-in-out infinite',
    }} />

    {/* Blue-indigo cloud — right lobe */}
    <div className="absolute" style={{
      width: 300, height: 260,
      left: '52%', top: '28%',
      background: 'radial-gradient(ellipse at 35% 45%, rgba(79,70,229,0.28) 0%, rgba(99,102,241,0.16) 40%, transparent 65%)',
      filter: 'blur(26px)',
      animation: 'nb-d2 26s ease-in-out infinite',
    }} />

    {/* Deep violet main cloud */}
    <div className="absolute rounded-full" style={{
      width: 340, height: 290,
      background: 'radial-gradient(ellipse at 48% 52%, rgba(139,92,246,0.58) 0%, rgba(109,40,217,0.35) 30%, rgba(76,29,149,0.14) 55%, transparent 70%)',
      filter: 'blur(20px)',
      animation: 'nb-d3 22s ease-in-out infinite',
    }} />

    {/* Pink-violet wisp — upper left */}
    <div className="absolute" style={{
      width: 220, height: 170,
      top: '6%', left: '16%',
      background: 'radial-gradient(ellipse, rgba(192,72,192,0.28) 0%, rgba(168,85,247,0.16) 45%, transparent 68%)',
      filter: 'blur(22px)',
      animation: 'nb-d1 17s ease-in-out infinite reverse',
    }} />

    {/* Warm violet — lower right wisp */}
    <div className="absolute" style={{
      width: 200, height: 160,
      bottom: '10%', right: '12%',
      background: 'radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, rgba(91,33,182,0.12) 50%, transparent 70%)',
      filter: 'blur(28px)',
      animation: 'nb-d2 30s ease-in-out infinite reverse',
    }} />

    {/* Filament streaks */}
    <div className="absolute" style={{
      width: 220, height: 3,
      top: '41%', left: '8%',
      background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.45), rgba(139,92,246,0.22), transparent)',
      filter: 'blur(3px)',
      transform: 'rotate(-18deg)',
      animation: 'nb-d3 24s ease-in-out infinite',
    }} />
    <div className="absolute" style={{
      width: 160, height: 2,
      top: '64%', left: '28%',
      background: 'linear-gradient(90deg, transparent, rgba(192,72,192,0.35), transparent)',
      filter: 'blur(2px)',
      transform: 'rotate(10deg)',
      animation: 'nb-d1 21s ease-in-out infinite reverse',
    }} />

    {/* Bright core region */}
    <div className="absolute rounded-full" style={{
      width: 150, height: 130,
      background: 'radial-gradient(circle, rgba(220,200,255,0.92) 0%, rgba(167,139,250,0.62) 35%, rgba(139,92,246,0.28) 60%, transparent 80%)',
      filter: 'blur(9px)',
      animation: 'nb-pulse 7s ease-in-out infinite',
    }} />

    {/* Hottest center point */}
    <div className="absolute rounded-full" style={{
      width: 44, height: 44,
      background: 'radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(220,200,255,0.78) 45%, transparent 75%)',
      filter: 'blur(4px)',
      animation: 'nb-core 4.5s ease-in-out infinite',
    }} />

    {/* Embedded star cluster */}
    {NEBULA_STARS.map((s, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: s.r, height: s.r,
        left: `${s.x}%`, top: `${s.y}%`,
        background: s.col,
        boxShadow: `0 0 ${s.sz}px ${s.col}`,
        animation: `nb-core ${s.dur} ease-in-out infinite`,
        animationDelay: s.del,
      }} />
    ))}
  </div>
);

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
  const { t } = useTranslation();
  const nebulaRef = useRef(null);
  const nebulaWrapRef = useRef(null);
  const [scanActive, setScanActive] = useState(false);

  // Mouse parallax — direct DOM, no re-renders
  const onMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 2;
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
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#030208' }}>
      <Starfield />

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

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-[12px] font-[700] tracking-[0.2em] uppercase"
              style={{
                border: '1px solid rgba(167,139,250,0.3)',
                background: 'rgba(139,92,246,0.1)',
                color: '#c4b5fd',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"
                style={{ boxShadow: '0 0 6px rgba(167,139,250,1)' }} />
              {t("home", "platformBadge")}
            </motion.div>

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

            <style>{`
              @keyframes vgrad {
                0%,100% { background-position: 0% 50%; }
                50%      { background-position: 100% 50%; }
              }
            `}</style>

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

            {/* Micro status row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35, duration: 0.7 }}
              className="mt-12 flex items-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.9)' }} />
                Platform online
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)' }}>3 languages</div>
              <div style={{ color: 'rgba(255,255,255,0.3)' }}>UZB · ENG · RUS</div>
            </motion.div>
          </div>

          {/* Nebula column */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div ref={nebulaWrapRef} style={{ transition: 'transform 0.8s cubic-bezier(0.23,1,0.32,1)' }}>
              <Nebula />
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
          <GlassCard delay={0}   accent="#8b5cf6" icon={<BookOpen className="w-7 h-7" style={{ color: '#a78bfa' }} />} title={t("home", "curriculumTitle")} desc={t("home", "curriculumDesc")} />
          <GlassCard delay={0.1} accent="#6366f1" icon={<Target   className="w-7 h-7" style={{ color: '#818cf8' }} />} title={t("home", "missionsTitle")}   desc={t("home", "missionsDesc")} />
          <GlassCard delay={0.2} accent="#7c3aed" icon={<Award    className="w-7 h-7" style={{ color: '#c4b5fd' }} />} title={t("home", "certTitle")}       desc={t("home", "certDesc")} />
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
            { to: '/3d-solar-system', Icon: Globe,  color: '#818cf8', label: '3D Solar System',  desc: 'Explore planets in realtime 3D' },
            { to: '/daily',           Icon: Zap,    color: '#a78bfa', label: 'Daily Challenge',   desc: 'Quiz every day, earn XP & streak' },
            { to: '/leaderboard',     Icon: Star,   color: '#c4b5fd', label: 'Leaderboard',       desc: 'Compete with explorers worldwide' },
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

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(109,40,217,0.05) 0%, rgba(76,29,149,0.03) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)' }} />
          <div className="absolute top-0 left-16 right-16 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), rgba(139,92,246,0.4), transparent)' }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
            <AnimatedCounter end={12000} suffix="+" label={t("home", "statsStudents")} />
            <div className="hidden md:block w-px h-14" style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), transparent)' }} />
            <AnimatedCounter end={340}   suffix="+" label={t("home", "statsLessons")} />
            <div className="hidden md:block w-px h-14" style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), transparent)' }} />
            <AnimatedCounter end={48}    label={t("home", "statsMissions")} />
            <div className="hidden md:block w-px h-14" style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), transparent)' }} />
            <AnimatedCounter end={19}    label={t("home", "statsCountries")} />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
