import { useEffect, useRef, useState } from "react";
import { Rocket, ArrowRight, BookOpen, Target, Award, Zap, Globe, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    interface Star { x: number; y: number; r: number; speed: number; phase: number; color: string }
    let stars: Star[] = [];

    const init = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      stars = Array.from({ length: 380 }, () => {
        const rand = Math.random();
        return {
          x: Math.random() * w, y: Math.random() * h,
          r: 0.2 + Math.random() * 1.5,
          speed: 0.004 + Math.random() * 0.012,
          phase: Math.random() * Math.PI * 2,
          color: rand > 0.97 ? "#e6e6fa" : rand > 0.91 ? "#a0d8ff" : "#ffffff",
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        const alpha = 0.4 + 0.6 * Math.sin(t * s.speed + s.phase);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      });
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

const AnimatedCounter = ({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = end / (1800 / 16);
      const timer = setInterval(() => {
        start = Math.min(start + step, end);
        setCount(Math.floor(start));
        if (start >= end) clearInterval(timer);
      }, 16);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-4xl md:text-5xl font-[800] text-neon-blue font-display tabular-nums">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-white/40 text-xs tracking-[0.15em] uppercase font-display">{label}</span>
    </div>
  );
};

const PlanetViz = () => (
  <div className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[420px] md:h-[420px] select-none">
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        .orbit-1 { animation: spin-cw 18s linear infinite; }
        .orbit-2 { animation: spin-ccw 28s linear infinite; }
        .orbit-3 { animation: spin-cw 42s linear infinite; }
        .planet-glow { animation: planet-pulse 4s ease-in-out infinite alternate; }
        .dot-1::after { animation: dot-orbit-1 18s linear infinite; }
        .dot-2::after { animation: dot-orbit-2 28s linear infinite; }
        .dot-3::after { animation: dot-orbit-3 42s linear infinite; }
      }
      @keyframes spin-cw  { to { transform: rotate(360deg); } }
      @keyframes spin-ccw { to { transform: rotate(-360deg); } }
      @keyframes planet-pulse {
        from { box-shadow: 0 0 60px 20px rgba(0,229,255,0.18), 0 0 120px 40px rgba(181,55,242,0.10); }
        to   { box-shadow: 0 0 80px 30px rgba(0,229,255,0.28), 0 0 160px 60px rgba(181,55,242,0.16); }
      }
      @keyframes dot-orbit-1 {
        from { transform: rotate(0deg)   translateX(118px) rotate(0deg);   }
        to   { transform: rotate(360deg) translateX(118px) rotate(-360deg); }
      }
      @keyframes dot-orbit-2 {
        from { transform: rotate(90deg)  translateX(160px) rotate(-90deg);  }
        to   { transform: rotate(450deg) translateX(160px) rotate(-450deg); }
      }
      @keyframes dot-orbit-3 {
        from { transform: rotate(200deg) translateX(198px) rotate(-200deg); }
        to   { transform: rotate(560deg) translateX(198px) rotate(-560deg); }
      }
      .dot-1::after, .dot-2::after, .dot-3::after {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        margin: -5px 0 0 -5px;
        border-radius: 50%;
      }
      .dot-1::after { width: 10px; height: 10px; background: #00e5ff; box-shadow: 0 0 12px 4px rgba(0,229,255,0.8); }
      .dot-2::after { width:  8px; height:  8px; background: #b537f2; box-shadow: 0 0 10px 3px rgba(181,55,242,0.8); }
      .dot-3::after { width:  6px; height:  6px; background: #ffffff; box-shadow: 0 0  8px 2px rgba(255,255,255,0.6); }
    `}</style>

    {/* Orbit rings */}
    <div className="orbit-1 absolute w-[236px] h-[236px] rounded-full border border-cyan-400/20" style={{ transform: 'rotateX(72deg)' }} />
    <div className="orbit-2 absolute w-[320px] h-[320px] rounded-full border border-purple-400/15" style={{ transform: 'rotateX(60deg) rotateZ(35deg)' }} />
    <div className="orbit-3 absolute w-[396px] h-[396px] rounded-full border border-white/8" style={{ transform: 'rotateX(80deg) rotateZ(-20deg)' }} />

    {/* Orbit dots */}
    <div className="dot-1 absolute inset-0" />
    <div className="dot-2 absolute inset-0" />
    <div className="dot-3 absolute inset-0" />

    {/* Planet */}
    <div
      className="planet-glow relative z-10 w-[120px] h-[120px] md:w-[144px] md:h-[144px] rounded-full overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 38% 32%, #1a7abf 0%, #0d4a8c 28%, #061e42 58%, #020b1a 100%)',
      }}
    >
      {/* continent-like patches */}
      <div className="absolute top-[20%] left-[18%] w-[30%] h-[18%] rounded-full bg-[#1e9e4a]/50 blur-[2px]" />
      <div className="absolute top-[45%] left-[50%] w-[20%] h-[15%] rounded-full bg-[#1e9e4a]/40 blur-[2px]" />
      <div className="absolute top-[30%] right-[15%] w-[16%] h-[10%] rounded-full bg-[#1e9e4a]/35 blur-[2px]" />
      {/* atmosphere glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 25%, rgba(0,229,255,0.22) 0%, transparent 55%)' }} />
      {/* specular highlight */}
      <div className="absolute top-[10%] left-[14%] w-[28%] h-[20%] rounded-full bg-white/12 blur-[3px]" />
    </div>

    {/* Ring around planet */}
    <div
      className="absolute z-[9] w-[196px] h-[196px] md:w-[228px] md:h-[228px] rounded-full border-[2px] border-cyan-300/20"
      style={{ transform: 'rotateX(76deg)', pointerEvents: 'none' }}
    />
  </div>
);

const FeatureCard = ({
  icon, title, desc, accent, delay,
}: { icon: React.ReactNode; title: string; desc: string; accent: string; delay: number }) => (
  <div
    className="group relative p-8 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div
      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at 20% 20%, ${accent}18 0%, transparent 60%)` }}
    />
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
      style={{ background: `${accent}22` }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-[700] text-white mb-3">{title}</h3>
    <p className="text-white/50 leading-relaxed text-[15px]">{desc}</p>
    <div
      className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
    />
  </div>
);

export default function HomeView() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#04080f] relative overflow-x-hidden">
      <Starfield />

      {/* Ambient nebula */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #00e5ff 0%, #b537f2 45%, transparent 70%)', filter: 'blur(1px)' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #b537f2 0%, transparent 70%)' }} />
      </div>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative z-10 min-h-[100svh] flex items-center px-4 pt-20 pb-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">

          {/* Left — text */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 text-neon-blue text-[13px] font-[700] tracking-wide mb-8">
              <Rocket className="w-3.5 h-3.5" />
              {t("home", "platformBadge")}
            </div>

            <h1 className="text-[clamp(36px,5.5vw,68px)] font-[900] tracking-[-0.03em] leading-[1.06] mb-6">
              <span className="text-white">{t("home", "title").split(" ").slice(0, 2).join(" ")} </span>
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #00e5ff 0%, #b537f2 60%, #00e5ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 4s ease infinite',
                }}
              >
                {t("home", "title").split(" ").slice(2).join(" ")}
              </span>
            </h1>

            <p className="text-[16px] md:text-[18px] text-white/50 leading-[1.7] mb-10 max-w-lg">
              {t("home", "subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/learn"
                className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-[50px] font-[700] text-[#04080f] bg-neon-blue transition-all hover:scale-[1.04]"
                style={{ boxShadow: '0 0 32px rgba(0,229,255,0.45), 0 4px 20px rgba(0,0,0,0.4)' }}
              >
                {t("home", "startMission")}
                <BookOpen className="w-5 h-5 group-hover:rotate-6 transition-transform" />
              </Link>

              <Link
                to="/3d-solar-system"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-[50px] font-[700] text-white border border-white/15 bg-white/[0.05] backdrop-blur-md transition-all hover:scale-[1.03] hover:bg-white/10 hover:border-white/30"
              >
                {t("home", "exploreSpace")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Micro-stats */}
            <div className="mt-12 flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-white/40">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                <span>Platform online</span>
              </div>
              <div className="text-white/40">12k+ learners</div>
              <div className="text-white/40">3 languages</div>
            </div>
          </div>

          {/* Right — planet */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <PlanetViz />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>

      {/* ─── FEATURES ─────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-neon-blue text-[13px] font-[700] tracking-[0.2em] uppercase mb-4">
            {t("home", "academyTitle")}
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-[800] tracking-[-0.02em] text-white mb-5">
            {t("home", "academyHighlight")}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-[16px] leading-relaxed">
            {t("home", "academySubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            delay={0}
            accent="#00e5ff"
            icon={<BookOpen className="w-7 h-7 text-neon-blue" />}
            title={t("home", "curriculumTitle")}
            desc={t("home", "curriculumDesc")}
          />
          <FeatureCard
            delay={80}
            accent="#b537f2"
            icon={<Target className="w-7 h-7 text-neon-purple" />}
            title={t("home", "missionsTitle")}
            desc={t("home", "missionsDesc")}
          />
          <FeatureCard
            delay={160}
            accent="#4ade80"
            icon={<Award className="w-7 h-7 text-green-400" />}
            title={t("home", "certTitle")}
            desc={t("home", "certDesc")}
          />
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-[700] text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all"
          >
            {t("home", "enterAcademy")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── PLATFORM HIGHLIGHTS ──────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link to="/3d-solar-system"
            className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-8 hover:border-cyan-400/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <Globe className="w-8 h-8 text-neon-blue mb-4" />
            <h3 className="text-lg font-[700] text-white mb-2">3D Solar System</h3>
            <p className="text-white/40 text-sm">Explore planets in realtime 3D</p>
            <ArrowRight className="w-4 h-4 text-neon-blue mt-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/daily"
            className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-8 hover:border-purple-400/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, rgba(181,55,242,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <Zap className="w-8 h-8 text-neon-purple mb-4" />
            <h3 className="text-lg font-[700] text-white mb-2">Daily Challenge</h3>
            <p className="text-white/40 text-sm">Quiz every day, earn XP & streak</p>
            <ArrowRight className="w-4 h-4 text-neon-purple mt-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/leaderboard"
            className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-8 hover:border-amber-400/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <Star className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-lg font-[700] text-white mb-2">Leaderboard</h3>
            <p className="text-white/40 text-sm">Compete with explorers worldwide</p>
            <ArrowRight className="w-4 h-4 text-amber-400 mt-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-28">
        <div
          className="rounded-3xl p-12 border border-white/8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(181,55,242,0.04) 100%)' }}
        >
          <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
            <AnimatedCounter end={12000} suffix="+" label={t("home", "statsStudents")} />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <AnimatedCounter end={340} suffix="+" label={t("home", "statsLessons")} />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <AnimatedCounter end={48} label={t("home", "statsMissions")} />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <AnimatedCounter end={19} label={t("home", "statsCountries")} />
          </div>
        </div>
      </section>
    </div>
  );
}
