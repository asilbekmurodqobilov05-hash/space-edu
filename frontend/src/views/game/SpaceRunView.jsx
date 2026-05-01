import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  Volume2,
  VolumeX,
  Trophy,
  Coins,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { SpaceRunScene } from "@/game/spaceRun/SpaceRunScene";
import { useSpaceRunHud } from "@/game/spaceRun/spaceRunHudStore";
import { useSpaceArcadeStore, SHIP_SKINS, skinPrice } from "@/game/spaceRun/spaceArcadeStore";
import { resumeAudio, startEngineHum, startSpaceMusic, stopEngineHum, stopSpaceMusic } from "@/game/spaceRun/spaceRunSounds";
import MiniSolarSystem from "@/components/layout/MiniSolarSystem";
import { useTranslation } from "@/hooks/useTranslation";

export default function SpaceRunView() {
  const { t, language } = useTranslation();
  const [gameKey, setGameKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const runningRef = useRef(false);
  const inputRef = useRef({ left: false, right: false, up: false, down: false, boost: false });
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const bonusGiven = useRef(false);
  const starCanvasRef = useRef(null);

  // Animated starfield canvas
  useEffect(() => {
    if (started) return;
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? 200 + Math.random() * 60 : 0,
      sat: Math.random() > 0.7 ? 60 : 0,
    }));
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = (t) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const alpha = 0.35 + 0.65 * ((Math.sin(t * 0.001 * s.speed + s.phase) + 1) / 2);
        if (s.hue) {
          ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 85%, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [started]);

  const { score, survivalSec, distance, coinsCollected, health, shield, boost, gameOver, paused, difficulty, activePower, setHud, reset } =
    useSpaceRunHud();
  const wallet = useSpaceArcadeStore((s) => s.wallet);
  const tryBuySkin = useSpaceArcadeStore((s) => s.tryBuySkin);
  const equipSkin = useSpaceArcadeStore((s) => s.equipSkin);
  const equippedSkin = useSpaceArcadeStore((s) => s.equippedSkin);
  const unlocked = useSpaceArcadeStore((s) => s.unlocked);

  useEffect(() => {
    if (!gameOver) {
      bonusGiven.current = false;
      return;
    }
    if (bonusGiven.current) return;
    bonusGiven.current = true;
    const bonus = Math.floor(survivalSec * 0.6) + coinsCollected * 2;
    useSpaceArcadeStore.getState().addWallet(Math.max(0, bonus));
  }, [gameOver, survivalSec, coinsCollected]);

  useEffect(() => {
    if (muted || paused || !started || gameOver) {
      stopSpaceMusic();
      stopEngineHum();
      return;
    }
    void resumeAudio().then(() => {
      startSpaceMusic();
      startEngineHum();
    });
  }, [muted, paused, started, gameOver]);

  useEffect(() => {
    return () => {
      stopSpaceMusic();
      stopEngineHum();
    };
  }, []);

  useEffect(() => {
    if (gameOver) runningRef.current = false;
    else if (started && !paused) runningRef.current = true;
    else if (paused) runningRef.current = false;
  }, [gameOver, started, paused]);

  const bindKeys = useCallback(() => {
    const down = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) inputRef.current.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) inputRef.current.right = true;
      if (["ArrowUp", "w", "W"].includes(e.key)) inputRef.current.up = true;
      if (["ArrowDown", "s", "S"].includes(e.key)) inputRef.current.down = true;
      if (["Shift", " "].includes(e.key)) inputRef.current.boost = true;
      if (e.key === "Escape") setHud({ paused: true });
    };
    const up = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) inputRef.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) inputRef.current.right = false;
      if (["ArrowUp", "w", "W"].includes(e.key)) inputRef.current.up = false;
      if (["ArrowDown", "s", "S"].includes(e.key)) inputRef.current.down = false;
      if (["Shift", " "].includes(e.key)) inputRef.current.boost = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [setHud]);

  useEffect(() => {
    if (!started) return bindKeys();
    return bindKeys();
  }, [started, bindKeys]);

  const handleStart = async () => {
    reset();
    bonusGiven.current = false;
    setGameKey((k) => k + 1);
    setStarted(true);
    runningRef.current = true;
    setHud({ paused: false, gameOver: false });
    await resumeAudio();
  };

  const handleRestart = () => {
    stopSpaceMusic();
    stopEngineHum();
    reset();
    bonusGiven.current = false;
    setStarted(false);
    runningRef.current = false;
    setGameKey((k) => k + 1);
  };

  const togglePause = () => {
    if (!started || gameOver) return;
    setHud({ paused: !paused });
  };

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
  };

  const onTouchMove = (e) => {
    if (!touchRef.current.active || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const th = 6; // reduced from 14 for better sensitivity
    
    if (Math.abs(dx) > th) {
      inputRef.current.left = dx < 0;
      inputRef.current.right = dx > 0;
      touchRef.current.x = t.clientX;
    } else {
      inputRef.current.left = false;
      inputRef.current.right = false;
    }

    if (Math.abs(dy) > th) {
      inputRef.current.up = dy < 0;
      inputRef.current.down = dy > 0;
      touchRef.current.y = t.clientY;
    } else {
      inputRef.current.up = false;
      inputRef.current.down = false;
    }
  };

  const onTouchEnd = () => {
    touchRef.current.active = false;
    inputRef.current.left = inputRef.current.right = inputRef.current.up = inputRef.current.down = false;
    inputRef.current.boost = false;
  };

  const scoreDisplay = started ? Math.floor(score).toLocaleString() : "—";
  const timeDisplay = started && !gameOver ? survivalSec.toFixed(0) + "s" : null;

  return (
    <div className="fixed inset-0 z-[42] bg-[#040712] flex flex-col">
      <header
        className="shrink-0 relative border-b border-cyan-500/15 bg-[linear-gradient(180deg,rgba(12,8,40,0.92)_0%,rgba(5,2,20,0.88)_100%)] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
        style={{ paddingTop: "max(0.65rem, env(safe-area-inset-top))" }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-6 top-full h-8 bg-gradient-to-b from-cyan-500/6 to-transparent blur-xl rounded-full" aria-hidden />

        <div className="relative flex flex-col gap-3 px-3 sm:px-5 pb-3 sm:pb-3.5 pt-1 sm:pt-1.5">
          {/* Row 1: brand + exit | spacer | tools */}
          <div className="flex items-center justify-between gap-3 min-h-[2.75rem]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Link
                to="/"
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2.5 sm:px-3 py-2 text-sm font-semibold text-white/90 transition-all hover:border-cyan-400/35 hover:bg-white/[0.1] hover:text-white active:scale-[0.98] shrink-0"
                onClick={() => {
                  runningRef.current = false;
                  stopSpaceMusic();
                  stopEngineHum();
                }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20 group-hover:bg-cyan-500/25">
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <span className="hidden min-[380px]:inline">Home</span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 min-w-0 ml-2 border-l border-white/10 pl-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/30 to-cyan-500/25 ring-1 ring-white/10">
                  <Gamepad2 className="w-4 h-4 text-cyan-200" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300/90 truncate">
                    {t('game', 'title')}
                  </p>
                  <p className="text-[10px] text-white/45 truncate">{t('game', 'subtitle')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <div className="hidden sm:block h-8 w-px bg-white/10 mr-0.5" aria-hidden />
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                title={muted ? "Unmute" : "Mute"}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                  muted
                    ? "border-white/10 bg-white/[0.04] text-white/45 hover:text-white/70"
                    : "border-cyan-500/25 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400/45 hover:bg-cyan-500/15"
                }`}
                aria-label={muted ? "Unmute sound" : "Mute sound"}
              >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setShopOpen(true)}
                title="Ship skins shop"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 transition-all hover:border-amber-400/50 hover:bg-amber-500/18 active:scale-95"
                aria-label="Open shop"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={togglePause}
                disabled={!started || gameOver}
                title={!started ? "Start a run first" : paused ? "Resume" : "Pause"}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white transition-all enabled:hover:border-fuchsia-400/35 enabled:hover:bg-fuchsia-500/10 disabled:cursor-not-allowed disabled:opacity-35 active:scale-95 enabled:active:scale-95"
                aria-label={paused ? "Resume game" : "Pause game"}
              >
                {paused ? <Play className="w-5 h-5 ml-0.5" /> : <Pause className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Row 2: stat chips — full width for balance */}
          <div className="flex flex-wrap items-stretch justify-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex flex-1 min-w-0 justify-center sm:justify-start flex-wrap gap-2">
              <div
                className={`inline-flex min-h-[2.75rem] flex-1 min-w-[5.5rem] max-w-[11rem] sm:max-w-none sm:flex-initial items-center gap-2.5 rounded-2xl border px-3 py-2 sm:px-3.5 ${
                  started && !gameOver
                    ? "border-cyan-500/25 bg-cyan-500/[0.08] shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/25">
                  <Trophy className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">{t('game', 'score')}</p>
                  <p className="font-display text-lg sm:text-xl font-extrabold tabular-nums text-cyan-100 leading-none truncate">
                    {scoreDisplay}
                  </p>
                </div>
              </div>

              <div className="inline-flex min-h-[2.75rem] flex-1 min-w-[5.5rem] max-w-[11rem] sm:max-w-none sm:flex-initial items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:px-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20">
                  <Coins className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">{t('game', 'energy')}</p>
                  <p className="font-display text-lg sm:text-xl font-extrabold tabular-nums text-amber-100 leading-none">
                    {coinsCollected}
                  </p>
                </div>
              </div>

              <div className="inline-flex min-h-[2.75rem] flex-1 min-w-[5.5rem] max-w-[11rem] sm:max-w-none sm:flex-initial items-center gap-2.5 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/[0.07] px-3 py-2 sm:px-3.5 shadow-[0_0_18px_rgba(217,70,239,0.06)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-100 ring-1 ring-fuchsia-400/25">
                  <Sparkles className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">{t('game', 'stars')}</p>
                  <p className="font-display text-lg sm:text-xl font-extrabold tabular-nums text-fuchsia-100 leading-none">
                    {wallet}
                  </p>
                </div>
              </div>
            </div>

            {timeDisplay !== null && (
              <>
                <div className="flex md:hidden w-full justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">{t('game', 'time')}</span>
                    <span className="font-display text-sm font-extrabold tabular-nums text-white">{timeDisplay}</span>
                    <span className="text-[10px] text-white/40">·</span>
                    <span className="text-[10px] text-cyan-200/80">×{difficulty.toFixed(2)}</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 min-w-[5.5rem]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">{t('game', 'time')}</p>
                  <p className="font-display text-xl font-extrabold tabular-nums text-white/90">{timeDisplay}</p>
                  <p className="text-[10px] text-white/35">×{difficulty.toFixed(2)} {t('game', 'speed').toLowerCase()}</p>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Health HUD Bar */}
            <div className="sr-hud-bar" style={{ borderColor: 'rgba(251,113,133,0.35)', boxShadow: '0 0 18px rgba(251,113,133,0.08), inset 0 0 12px rgba(251,113,133,0.04)' }}>
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold mb-2">
                <span className="text-rose-200" style={{ textShadow: '0 0 8px rgba(251,113,133,0.6)' }}>Health</span>
                <span className="text-rose-300 tabular-nums" style={{ textShadow: '0 0 6px rgba(251,113,133,0.5)' }}>{Math.round(health)}%</span>
              </div>
              <div className="h-[6px] rounded-[3px] bg-black/40 overflow-hidden" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                <div className="sr-hud-bar-fill h-full" style={{ width: `${health}%`, background: 'linear-gradient(90deg, #fb7185, #f43f5e, #e11d48)', boxShadow: '0 0 10px rgba(251,113,133,0.6), 0 0 20px rgba(251,113,133,0.25)' }} />
              </div>
            </div>
            {/* Shield HUD Bar */}
            <div className="sr-hud-bar" style={{ borderColor: 'rgba(34,211,238,0.35)', boxShadow: '0 0 18px rgba(34,211,238,0.08), inset 0 0 12px rgba(34,211,238,0.04)' }}>
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold mb-2">
                <span className="text-cyan-200" style={{ textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>Shield</span>
                <span className="text-cyan-300 tabular-nums" style={{ textShadow: '0 0 6px rgba(34,211,238,0.5)' }}>{Math.round(shield)}%</span>
              </div>
              <div className="h-[6px] rounded-[3px] bg-black/40 overflow-hidden" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                <div className="sr-hud-bar-fill h-full" style={{ width: `${Math.min(100, shield)}%`, background: 'linear-gradient(90deg, #22d3ee, #06b6d4, #0891b2)', boxShadow: '0 0 10px rgba(34,211,238,0.6), 0 0 20px rgba(34,211,238,0.25)' }} />
              </div>
            </div>
            {/* Boost HUD Bar */}
            <div className="sr-hud-bar" style={{ borderColor: 'rgba(217,70,239,0.35)', boxShadow: '0 0 18px rgba(217,70,239,0.08), inset 0 0 12px rgba(217,70,239,0.04)' }}>
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold mb-2">
                <span className="text-fuchsia-200" style={{ textShadow: '0 0 8px rgba(217,70,239,0.6)' }}>Boost</span>
                <span className="text-fuchsia-300 tabular-nums" style={{ textShadow: '0 0 6px rgba(217,70,239,0.5)' }}>{Math.round(boost)}%</span>
              </div>
              <div className="h-[6px] rounded-[3px] bg-black/40 overflow-hidden" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                <div className="sr-hud-bar-fill h-full" style={{ width: `${boost}%`, background: 'linear-gradient(90deg, #e879f9, #d946ef, #a21caf)', boxShadow: '0 0 10px rgba(217,70,239,0.6), 0 0 20px rgba(217,70,239,0.25)' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className="flex-1 relative min-h-0 touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          className="absolute left-0 top-0 h-full w-[42vw] min-w-[300px] max-w-[600px] z-[10] pointer-events-none opacity-[0.52] blur-[0.2px]"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 48%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 48%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_40%,rgba(59,130,246,0.14)_0%,rgba(79,70,229,0.1)_20%,rgba(17,24,39,0.45)_52%,rgba(2,6,23,0)_100%)]" />
          <MiniSolarSystem frozen={false} />
        </div>

        <Canvas
          key={gameKey}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ position: [0, 2.9, 12.8], fov: 60, near: 0.1, far: 360 }}
        >
          <SpaceRunScene inputRef={inputRef} runningRef={runningRef} />
        </Canvas>

        {!started && (
          <div className="absolute inset-0 z-[15] overflow-hidden" style={{ animation: 'entry-fade-in 0.8s ease-out both' }}>
            {/* === DEEP SPACE BACKGROUND === */}
            {/* Base dark overlay */}
            <div className="absolute inset-0 bg-[#020010]" />

            {/* Starfield canvas */}
            <canvas
              ref={starCanvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ opacity: 0.9 }}
            />

            {/* Nebula layer 1 — blue, upper-left */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-10%', left: '-15%',
                width: '70%', height: '75%',
                background: 'radial-gradient(ellipse at 40% 35%, rgba(14, 165, 233, 0.18) 0%, rgba(59, 130, 246, 0.08) 35%, transparent 70%)',
                animation: 'nebula-drift 25s ease-in-out infinite',
                filter: 'blur(40px)',
              }}
            />
            {/* Nebula layer 2 — purple, center-right */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '10%', right: '-10%',
                width: '65%', height: '70%',
                background: 'radial-gradient(ellipse at 60% 50%, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.08) 40%, transparent 70%)',
                animation: 'nebula-drift 30s ease-in-out infinite reverse',
                filter: 'blur(50px)',
              }}
            />
            {/* Nebula layer 3 — deep blue stardust, bottom */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '-5%', left: '20%',
                width: '60%', height: '50%',
                background: 'radial-gradient(ellipse at 50% 80%, rgba(30, 64, 175, 0.15) 0%, rgba(37, 99, 235, 0.06) 40%, transparent 65%)',
                animation: 'nebula-drift 35s ease-in-out infinite',
                filter: 'blur(35px)',
              }}
            />

            {/* Jupiter planet — lower right */}
            <div
              className="sr-planet-jupiter"
              style={{ bottom: '5%', right: '-4%' }}
            />

            {/* Faint secondary planet — upper left, tiny */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: '12%', left: '8%',
                width: '45px', height: '45px',
                background: 'radial-gradient(circle at 40% 35%, #6e7b91 0%, #3b4252 60%, #1e2333 100%)',
                boxShadow: 'inset -6px -3px 10px rgba(0,0,0,0.5), 0 0 15px 3px rgba(100,120,180,0.06)',
                opacity: 0.5,
              }}
            />

            {/* Vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,0,16,0.7) 100%)',
              }}
            />

            {/* === CONTENT LAYER === */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">

              {/* Portal ring container */}
              <div className="relative flex items-center justify-center mb-8" style={{ width: '310px', height: '310px' }}>
                {/* Outer diffused halo */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '340px', height: '340px',
                    background: 'radial-gradient(circle, rgba(0,229,255,0.06) 40%, rgba(139,92,246,0.04) 60%, transparent 75%)',
                    filter: 'blur(15px)',
                  }}
                />

                {/* Rotating conic-gradient ring */}
                <div className="sr-portal-ring" />

                {/* Glow halo with breathing animation */}
                <div className="sr-portal-glow" />

                {/* Orbiting particles */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      top: '50%', left: '50%',
                      width: '4px', height: '4px',
                      marginTop: '-2px', marginLeft: '-2px',
                      animation: `orbit-particle ${3 + i * 0.7}s linear infinite`,
                      animationDelay: `${i * -0.6}s`,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: i % 2 === 0 ? '#00e5ff' : '#a78bfa',
                        boxShadow: `0 0 6px 2px ${i % 2 === 0 ? 'rgba(0,229,255,0.7)' : 'rgba(167,139,250,0.7)'}`,
                      }}
                    />
                  </div>
                ))}

                {/* Title inside portal */}
                <div className="relative z-10 flex flex-col items-center">
                  <h1 className="sr-neon-title font-display leading-none">
                    Space Run
                  </h1>
                  <p className="text-cyan-200/60 text-xs tracking-[0.3em] uppercase mt-2 font-semibold">
                    Arcade · Dodge · Collect
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-white/60 max-w-md mb-8 text-sm sm:text-base leading-relaxed"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                Survive the asteroid field, collect glowing energy cores, and push distance.
                <span className="hidden sm:inline"> Arrows or WASD to steer. Hold Shift or Space for boost.</span>
              </p>

              {/* Play button */}
              <button
                type="button"
                onClick={() => void handleStart()}
                className="sr-play-btn"
                id="space-run-play-button"
              >
                <Play className="w-6 h-6" strokeWidth={2.5} />
                Play
              </button>

              {/* Game controller icon — psychological trigger */}
              <div className="mt-5 flex flex-col items-center gap-1.5 sr-controller-icon">
                <Gamepad2 className="w-9 h-9 text-cyan-300" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/50 font-bold">Press to Play</span>
              </div>
            </div>
          </div>
        )}

        {started && paused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <p className="text-2xl font-black text-white mb-4">{t('game', 'paused')}</p>
            <button
              type="button"
              onClick={() => setHud({ paused: false })}
              className="px-6 py-2 rounded-xl bg-cyan-500 text-space-900 font-bold"
            >
              {t('game', 'resume')}
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md px-6">
            <p className="text-4xl font-black text-rose-400 mb-2">{t('game', 'gameOver')}</p>
            <p className="text-white/80 mb-1">{t('game', 'score')}: {Math.floor(score)}</p>
            <p className="text-white/60 text-sm mb-6">
              {t('game', 'time')} {survivalSec.toFixed(1)}s · {t('game', 'distance')} {Math.floor(distance)}m · {t('game', 'energy')} {coinsCollected} · {t('game', 'speed')} ×{difficulty.toFixed(2)}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  void handleStart();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-space-900 font-bold"
              >
                <RotateCcw className="w-5 h-5" />
                {t('game', 'playAgain')}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10"
              >
                {t('game', 'menu')}
              </button>
            </div>
          </div>
        )}

        {shopOpen && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
            role="dialog"
          >
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-space-900/95 p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-white">{t('game', 'shipSkins')}</h2>
                <button type="button" className="text-white/60 hover:text-white text-sm" onClick={() => setShopOpen(false)}>
                  {t('game', 'shopClose')}
                </button>
              </div>
              <p className="text-white/55 text-sm mb-4">{t('game', 'shopDesc', { skin: equippedSkin })}</p>
              <ul className="space-y-3">
                {SHIP_SKINS.map((skin) => {
                  const price = skinPrice(skin.id);
                  const own = unlocked.includes(skin.id);
                  return (
                    <li
                      key={skin.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2 bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full border-2 border-white/20" style={{ background: skin.color }} />
                        <div>
                          <p className="font-bold text-white">{skin.label}</p>
                          <p className="text-xs text-white/50">{own ? t('game', 'owned') : `${price} ★`}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={!own && wallet < price}
                        onClick={() => {
                          if (own) equipSkin(skin.id);
                          else tryBuySkin(skin.id);
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-500/90 text-space-900 disabled:opacity-40"
                      >
                        {own ? (equippedSkin === skin.id ? t('game', 'equipped') : t('game', 'equip')) : t('game', 'buy')}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {started && !gameOver && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-between text-xs sm:text-sm font-semibold text-white/85 [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)] bg-black/45 rounded-lg px-3 py-2 backdrop-blur-[1px]">
            <span>{activePower ? `${t('game', 'power')}: ${activePower}` : t('game', 'controlsDesc')}</span>
            <span className="hidden sm:inline">{t('game', 'escPause')}</span>
          </div>
        )}

        {started && !gameOver && (
          <button
            type="button"
            onPointerDown={() => {
              inputRef.current.boost = true;
            }}
            onPointerUp={() => {
              inputRef.current.boost = false;
            }}
            onPointerLeave={() => {
              inputRef.current.boost = false;
            }}
            className="sm:hidden absolute bottom-14 right-3 z-20 rounded-full px-4 py-2.5 border border-fuchsia-300/35 bg-fuchsia-500/20 text-fuchsia-100 text-xs font-bold tracking-wide active:scale-95"
          >
            {t('game', 'boostBtn')}
          </button>
        )}
      </div>
    </div>
  );
}
