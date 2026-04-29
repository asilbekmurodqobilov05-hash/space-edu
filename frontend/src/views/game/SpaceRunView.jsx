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

export default function SpaceRunView() {
  const [gameKey, setGameKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const runningRef = useRef(false);
  const inputRef = useRef({ left: false, right: false, up: false, down: false, boost: false });
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const bonusGiven = useRef(false);

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
    touchRef.current.x = t.clientX;
    touchRef.current.y = t.clientY;
    const th = 14;
    inputRef.current.left = dx < -th;
    inputRef.current.right = dx > th;
    inputRef.current.up = dy < -th;
    inputRef.current.down = dy > th;
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
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                </span>
                <span className="hidden min-[380px]:inline">Home</span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 min-w-0 ml-2 border-l border-white/10 pl-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/30 to-cyan-500/25 ring-1 ring-white/10">
                  <Gamepad2 className="w-4 h-4 text-cyan-200" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300/90 truncate">
                    Space Run
                  </p>
                  <p className="text-[10px] text-white/45 truncate">Arcade · dodge and collect</p>
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Score</p>
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Energy</p>
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Stars</p>
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Time</span>
                    <span className="font-display text-sm font-extrabold tabular-nums text-white">{timeDisplay}</span>
                    <span className="text-[10px] text-white/40">·</span>
                    <span className="text-[10px] text-cyan-200/80">×{difficulty.toFixed(2)}</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 min-w-[5.5rem]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Time</p>
                  <p className="font-display text-xl font-extrabold tabular-nums text-white/90">{timeDisplay}</p>
                  <p className="text-[10px] text-white/35">×{difficulty.toFixed(2)} speed</p>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2">
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-rose-100/80 font-bold"><span>Health</span><span>{Math.round(health)}%</span></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/25 overflow-hidden"><div className="h-full bg-rose-400 transition-[width]" style={{ width: `${health}%` }} /></div>
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2">
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-cyan-100/80 font-bold"><span>Shield</span><span>{Math.round(shield)}%</span></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/25 overflow-hidden"><div className="h-full bg-cyan-300 transition-[width]" style={{ width: `${Math.min(100, shield)}%` }} /></div>
            </div>
            <div className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2">
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-fuchsia-100/80 font-bold"><span>Boost</span><span>{Math.round(boost)}%</span></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/25 overflow-hidden"><div className="h-full bg-fuchsia-300 transition-[width]" style={{ width: `${boost}%` }} /></div>
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
          className="absolute left-0 top-0 h-full w-[48vw] min-w-[340px] max-w-[680px] z-[12] pointer-events-none opacity-[0.72]"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.28) 76%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.28) 76%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,rgba(56,189,248,0.14)_0%,rgba(59,130,246,0.08)_22%,rgba(15,23,42,0.42)_54%,rgba(2,6,23,0)_100%)]" />
          <MiniSolarSystem frozen={false} />
        </div>

        <Canvas
          key={gameKey}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ position: [0, 2.55, 11.4], fov: 49, near: 0.1, far: 220 }}
        >
          <SpaceRunScene inputRef={inputRef} runningRef={runningRef} />
        </Canvas>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm px-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 mb-3">
              Space Run
            </h1>
            <p className="text-white/75 max-w-md mb-6 text-sm sm:text-base leading-relaxed">
              Survive the asteroid field, collect glowing energy cores, and push distance. Arrows or WASD steer, hold Shift
              or Space for boost. Cores restore health/boost, and power-ups grant shield, slow-mo, or magnet.
            </p>
            <button
              type="button"
              onClick={() => void handleStart()}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Play
            </button>
          </div>
        )}

        {started && paused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <p className="text-2xl font-black text-white mb-4">Paused</p>
            <button
              type="button"
              onClick={() => setHud({ paused: false })}
              className="px-6 py-2 rounded-xl bg-cyan-500 text-space-900 font-bold"
            >
              Resume
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md px-6">
            <p className="text-4xl font-black text-rose-400 mb-2">Game Over</p>
            <p className="text-white/80 mb-1">Score: {Math.floor(score)}</p>
            <p className="text-white/60 text-sm mb-6">
              Time {survivalSec.toFixed(1)}s · Distance {Math.floor(distance)}m · Energy {coinsCollected} · Speed ×{difficulty.toFixed(2)}
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
                Play again
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10"
              >
                Menu
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
                <h2 className="text-xl font-black text-white">Ship skins</h2>
                <button type="button" className="text-white/60 hover:text-white text-sm" onClick={() => setShopOpen(false)}>
                  Close
                </button>
              </div>
              <p className="text-white/55 text-sm mb-4">Spend arcade stars ★ (earned from coins &amp; survival). Equipped: {equippedSkin}</p>
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
                          <p className="text-xs text-white/50">{own ? "Owned" : `${price} ★`}</p>
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
                        {own ? (equippedSkin === skin.id ? "Equipped" : "Equip") : "Buy"}
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
            <span>{activePower ? `Power: ${activePower}` : "Hold Shift/Space to boost · blue shield · purple slow · green magnet"}</span>
            <span className="hidden sm:inline">Esc pause</span>
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
            BOOST
          </button>
        )}
      </div>
    </div>
  );
}
