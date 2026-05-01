/**
 * useSpaceRunGame.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Isolated game-logic hook — completely decoupled from Three.js rendering.
 *
 * Responsibilities:
 *   • Owns ALL mutable game state (via refs — no React re-renders in hot path)
 *   • Provides `tick(dt)` called from useFrame
 *   • Exposes `triggerGameOver(reason)` for external termination
 *   • Fires `onGameOver(result)` callback with full session data
 *   • Manages special items tracking for API payload
 *
 * This hook does NOT touch the DOM, Canvas, or any Three.js objects.
 * Scene components read from the refs this hook exposes.
 */

import { useRef, useCallback } from "react";
import { useSpaceRunHud } from "./spaceRunHudStore";
import { useSpaceArcadeStore } from "./spaceArcadeStore";
import { playCoinSound, playExplosionSound } from "./spaceRunSounds";
import * as THREE from "three";

// ── Obstacle object pool helpers ─────────────────────────────────────────────
function makeObstacle() {
  return {
    id: 0, type: "meteor", power: null, special: false,
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    rx: 0, ry: 0, rz: 0, rs: 0,
    scale: 0, damage: 0,
    waveX: 0, waveY: 0, waveF: 0, phase: 0,
  };
}

function resetObstacle(o) {
  o.id = 0; o.type = "meteor"; o.power = null; o.special = false;
  o.x = 0; o.y = 0; o.z = 0;
  o.vx = 0; o.vy = 0; o.vz = 0;
  o.rx = 0; o.ry = 0; o.rz = 0; o.rs = 0;
  o.scale = 0; o.damage = 0;
  o.waveX = 0; o.waveY = 0; o.waveF = 0; o.phase = 0;
  return o;
}

function rng(a, b) { return a + Math.random() * (b - a); }
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function finiteDt(d) { return Math.max(0, Math.min(d, 0.1)); }

// ── Public hook ──────────────────────────────────────────────────────────────
/**
 * @param {object} opts
 * @param {import('./spaceRunConfig').GameConfig} opts.config  — resolved game config
 * @param {React.MutableRefObject}                opts.inputRef — { left, right, up, down, boost }
 * @param {React.MutableRefObject}                opts.runningRef — boolean flag
 * @param {(result: GameResult) => void}          opts.onGameOver — callback
 */
export function useSpaceRunGame({ config, inputRef, runningRef, onGameOver }) {
  // ── Ship state ─────────────────────────────────────────────────────────────
  const shipX   = useRef(0);
  const shipY   = useRef(0);
  const shipVx  = useRef(0);
  const shipVy  = useRef(0);

  // ── World state ────────────────────────────────────────────────────────────
  const speedRef    = useRef(16);
  const boostRef    = useRef(100);
  const healthRef   = useRef(100);
  const shieldRef   = useRef(0);
  const distanceRef = useRef(0);
  const shakeRef    = useRef(0);
  const elapsed     = useRef(0);
  const coinScore   = useRef(0);
  const flush       = useRef(0);
  const slowT       = useRef(0);
  const magnetT     = useRef(0);
  const boostingRef = useRef(false);

  // ── Session tracking (for API payload) ────────────────────────────────────
  const sessionRef = useRef({
    startedAt: Date.now(),
    coinsCollected:  0,
    specialCollected: 0,
    powerUpsUsed:    0,
    peakSpeed:       16,
    milestonesHit:   [],
    specialItems:    [],  // [{type, pickedAt}] — extensible
    gameOverReason:  "collision",
  });

  // ── Gravity wells & milestones ─────────────────────────────────────────────
  const gravWellPos     = useRef(null);
  const gravWellTimer   = useRef(0);
  const lastMilestone   = useRef(0);
  const milestoneFlash  = useRef(0);

  // ── Object pool ────────────────────────────────────────────────────────────
  const obstacles   = useRef([]);
  const pool        = useRef([]);
  const nextId      = useRef(1);
  const spawnM      = useRef(0);
  const spawnC      = useRef(0);

  const acquire = useCallback(() => {
    return pool.current.length > 0 ? pool.current.pop() : makeObstacle();
  }, []);
  const release = useCallback((o) => {
    pool.current.push(resetObstacle(o));
  }, []);

  // ── Game-over firewall (called at most once per session) ───────────────────
  const gameOverFiredRef = useRef(false);
  const fireGameOver = useCallback((reason = "collision") => {
    if (gameOverFiredRef.current) return;
    gameOverFiredRef.current = true;
    runningRef.current = false;

    const sess = sessionRef.current;
    sess.gameOverReason = reason;

    /** @type {GameResult} */
    const result = {
      // Core scores
      score:            Math.floor(elapsed.current * 2) + coinScore.current,
      survivalSec:      elapsed.current,
      distance:         distanceRef.current,
      difficulty:       1 + Math.min(config.maxDifficultyMul, elapsed.current * config.difficultyRampRate),
      // Collectibles
      coinsCollected:   sess.coinsCollected,
      specialCollected: sess.specialCollected,
      powerUpsUsed:     sess.powerUpsUsed,
      // Items (for backend inventory / API)
      specialItems:     [...sess.specialItems],
      // Performance
      peakSpeed:        sess.peakSpeed,
      milestonesHit:    [...sess.milestonesHit],
      // Meta
      gameOverReason:   reason,
      durationMs:       Date.now() - sess.startedAt,
      // External props echoed back
      userLevel:        config._userLevel,
      theme:            config.theme,
    };

    // 1. Update Zustand HUD store
    useSpaceRunHud.getState().setHud({
      gameOver: true,
      activePower: null,
      health: 0,
      shield: shieldRef.current,
      boost:  boostRef.current,
      score:  result.score,
      survivalSec: result.survivalSec,
      distance: result.distance,
      difficulty: result.difficulty,
    });

    // 2. Fire user callback (API stub) — non-blocking
    try { onGameOver?.(result); } catch { /* never crash the game loop */ }
  }, [config, onGameOver, runningRef]);

  // ── Main tick — called from useFrame ──────────────────────────────────────
  const tick = useCallback((delta) => {
    const hud = useSpaceRunHud.getState();
    if (!runningRef.current || hud.gameOver || hud.paused) return;
    const dt = finiteDt(delta);

    // ── Ship movement ──────────────────────────────────────────────────────
    const inp = inputRef.current;
    const boostHeld = !!inp.boost;
    const canBoost  = boostRef.current > 1.5;
    const boosting  = boostHeld && canBoost;
    boostingRef.current = boosting;

    const ax = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const ay = (inp.up    ? 1 : 0) - (inp.down ? 1 : 0);

    shipVx.current += ax * config.shipAccel * dt;
    shipVy.current += ay * config.shipAccel * dt;

    // Gravity
    shipVy.current += config.gravity * dt;

    // Gravity well
    if (gravWellPos.current) {
      const gwx = gravWellPos.current.x - shipX.current;
      const gwy = gravWellPos.current.y - shipY.current;
      const gwDist = Math.hypot(gwx, gwy);
      if (gwDist < config.gravityWellRadius && gwDist > 0.05) {
        const pull = config.gravityWellStrength * (1 - gwDist / config.gravityWellRadius) * dt;
        shipVx.current += (gwx / gwDist) * pull;
        shipVy.current += (gwy / gwDist) * pull;
      }
    }

    const drag = Math.exp(-config.shipDrag * dt);
    shipVx.current *= drag;
    shipVy.current *= drag;

    const vmag = Math.hypot(shipVx.current, shipVy.current);
    if (vmag > config.shipMaxSpeed) {
      const k = config.shipMaxSpeed / vmag;
      shipVx.current *= k;
      shipVy.current *= k;
    }

    const SHIP_BOUNDS = { x: 3.35 * 1.8, y: 2.4 * 1.8 };
    shipX.current = THREE.MathUtils.clamp(shipX.current + shipVx.current * dt, -SHIP_BOUNDS.x, SHIP_BOUNDS.x);
    shipY.current = THREE.MathUtils.clamp(shipY.current + shipVy.current * dt, -SHIP_BOUNDS.y, SHIP_BOUNDS.y);

    // ── Timers ─────────────────────────────────────────────────────────────
    if (slowT.current > 0)   slowT.current -= dt;
    if (magnetT.current > 0) magnetT.current -= dt;

    boostRef.current = boosting
      ? Math.max(0,   boostRef.current - config.boostDrain * dt)
      : Math.min(100, boostRef.current + config.boostRecharge * dt);

    elapsed.current += dt;
    const e = elapsed.current;

    // ── Speed ──────────────────────────────────────────────────────────────
    const diff = 1 + Math.min(config.maxDifficultyMul, e * config.difficultyRampRate);
    const slowMul  = slowT.current > 0 ? config.slowMul : 1;
    const boostMul = boosting ? config.boostSpeedMul : 1;
    const baseV    = 13 + Math.min(26, e * 0.5);
    const vz       = baseV * diff * slowMul * boostMul;
    speedRef.current = vz;
    distanceRef.current += vz * dt * 0.85;

    // Track peak speed for result
    if (vz > sessionRef.current.peakSpeed) sessionRef.current.peakSpeed = vz;

    // ── Gravity well lifecycle ─────────────────────────────────────────────
    gravWellTimer.current += dt;
    if (!gravWellPos.current && gravWellTimer.current >= config.gravityWellInterval && e > 10) {
      gravWellTimer.current = 0;
      gravWellPos.current = {
        x: rng(-SHIP_BOUNDS.x * 0.6, SHIP_BOUNDS.x * 0.6),
        y: rng(-SHIP_BOUNDS.y * 0.4, SHIP_BOUNDS.y * 0.4),
        life: 6 + Math.random() * 4,
      };
    }
    if (gravWellPos.current) {
      gravWellPos.current.life -= dt;
      if (gravWellPos.current.life <= 0) gravWellPos.current = null;
    }

    // ── Milestones ─────────────────────────────────────────────────────────
    if (milestoneFlash.current > 0) milestoneFlash.current -= dt;
    for (const m of config.milestones) {
      if (distanceRef.current >= m && lastMilestone.current < m) {
        lastMilestone.current = m;
        milestoneFlash.current = 2.0;
        coinScore.current += config.milestoneScoreBonus(m);
        healthRef.current = Math.min(100, healthRef.current + config.milestoneHealthBonus);
        shakeRef.current  = Math.max(shakeRef.current, 0.4);
        sessionRef.current.milestonesHit.push(m);
        break;
      }
    }

    // ── Spawning ───────────────────────────────────────────────────────────
    const arr = obstacles.current;
    spawnM.current += dt;
    spawnC.current += dt;

    const SPAWN = {
      MX: 3.15 * 1.8, MY: 2.05 * 1.8,
      PX: 2.75 * 1.8, PY: 1.75 * 1.8,
      CX: 2.95 * 1.8, CY: 1.95 * 1.8,
    };

    if (arr.length < config.maxObstacles) {
      const meteorEvery = Math.max(0.2, config.meteorBaseInterval - e * 0.032);
      const coinEvery   = Math.max(0.42, config.coinBaseInterval  - e * 0.017);

      if (spawnM.current >= meteorEvery) {
        spawnM.current = 0;
        const clusterChance = THREE.MathUtils.clamp((e - 12) / 48, 0, 0.58);
        const n = Math.random() < clusterChance ? 2 + (Math.random() < 0.26 ? 1 : 0) : 1;
        for (let i = 0; i < n && arr.length < config.maxObstacles; i++) {
          const o = acquire();
          o.id = nextId.current++;
          o.type = "meteor"; o.power = null; o.special = false;
          o.x = rng(-SPAWN.MX, SPAWN.MX); o.y = rng(-SPAWN.MY, SPAWN.MY);
          o.z = -46 - Math.random() * 8;
          o.vx = rng(-0.28, 0.28); o.vy = rng(-0.22, 0.22);
          o.vz = vz * rng(0.9, 1.1);
          o.rx = Math.random() * Math.PI * 2; o.ry = Math.random() * Math.PI * 2;
          o.rz = Math.random() * Math.PI * 2; o.rs = rng(1.1, 2.5);
          o.scale = rng(0.28, 0.72);
          o.damage = rng(11, 23);
          o.waveX = rng(0.12, 0.9); o.waveY = rng(0.08, 0.62);
          o.waveF = rng(0.75, 1.85); o.phase = Math.random() * Math.PI * 2;
          arr.push(o);
        }
      }

      if (spawnC.current >= coinEvery) {
        spawnC.current = 0;
        const roll = Math.random();
        const specialChance = config.specialCoinChance ?? 0.13;
        if (roll < 0.055 && magnetT.current <= 0 && slowT.current <= 0 && arr.length < config.maxObstacles) {
          const kinds = ["shield", "slow", "magnet"];
          const power = kinds[Math.floor(Math.random() * kinds.length)];
          const o = acquire();
          o.id = nextId.current++; o.type = "power"; o.power = power; o.special = false;
          o.x = rng(-SPAWN.PX, SPAWN.PX); o.y = rng(-SPAWN.PY, SPAWN.PY);
          o.z = -40 - Math.random() * 6;
          o.vx = 0; o.vy = 0; o.vz = vz * 0.94;
          o.rx = 0; o.ry = 0; o.rz = 0; o.rs = 2.4; o.scale = 0.36;
          arr.push(o);
        } else if (arr.length < config.maxObstacles) {
          const special = Math.random() < specialChance;
          const o = acquire();
          o.id = nextId.current++; o.type = "coin"; o.special = special; o.power = null;
          o.x = rng(-SPAWN.CX, SPAWN.CX); o.y = rng(-SPAWN.CY, SPAWN.CY);
          o.z = -38 - Math.random() * 10;
          o.vx = 0; o.vy = 0; o.vz = vz * 0.87;
          o.rx = 0; o.ry = 0; o.rz = 0; o.rs = 3.6;
          o.scale = special ? 0.54 : 0.42;
          o.phase = Math.random() * Math.PI * 2;
          arr.push(o);
        }
      }
    }

    // ── Object update + collision ──────────────────────────────────────────
    const sx = shipX.current, sy = shipY.current;
    const magnet = magnetT.current > 0;
    const magnetPull = 6.2 * dt;
    const SHIP_RADIUS = 0.36 * 1.3;
    const SHIP_Z_HALF = 0.52 * 1.3;
    const POWER_PICKUP_XY = 0.62 * 1.8;
    const Z_KILL = 7, Z_NEAR = 2.35;

    let write = 0;
    const readEnd = arr.length;
    for (let read = 0; read < readEnd; read++) {
      const o = arr[read];
      const waveT = e * (o.waveF ?? 0);

      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (o.type === "meteor") {
        o.x += Math.sin(waveT + (o.phase ?? 0)) * (o.waveX ?? 0) * dt;
        o.y += Math.cos(waveT * 1.2 + (o.phase ?? 0)) * (o.waveY ?? 0) * dt;
      } else if (o.type === "coin") {
        o.y += Math.sin(e * 2.55 + (o.phase ?? 0)) * dt * 0.3;
      }
      o.z += o.vz * dt;
      o.rx += o.rs * dt * 0.68; o.ry += o.rs * dt * 0.52; o.rz += o.rs * dt * 0.38;

      if (magnet && o.type === "coin") {
        const dx = sx - o.x, dy = sy - o.y;
        const pull = clamp01(magnetPull * (0.65 + Math.hypot(dx, dy) * 0.08));
        o.x += dx * pull; o.y += dy * pull;
      }

      let keep = true;

      if (o.z > Z_KILL) {
        keep = false;
      } else {
        const zDepth = Math.abs(o.z);
        if (healthRef.current > 0 && zDepth <= Z_NEAR) {
          const dx = o.x - sx, dy = o.y - sy;
          const d2 = dx * dx + dy * dy;

          if (o.type === "meteor") {
            const xyR = o.scale * 0.95 + SHIP_RADIUS;
            const zHalf = SHIP_Z_HALF + o.scale * 0.42;
            if (zDepth < zHalf && d2 < xyR * xyR) {
              shakeRef.current = Math.max(shakeRef.current, 1);
              playExplosionSound();
              const incoming = Math.min(40, Math.max(4, o.damage ?? 14));
              let hpLoss = incoming;
              if (shieldRef.current > 0) {
                const absorb = Math.min(shieldRef.current, incoming * 0.72);
                shieldRef.current = Math.max(0, shieldRef.current - absorb);
                hpLoss = Math.max(0, hpLoss - absorb * 0.62);
              }
              healthRef.current = Math.max(0, healthRef.current - hpLoss);
              if (healthRef.current <= 0) {
                healthRef.current = 0;
                fireGameOver("collision");
              }
              keep = false;
            }
          } else if (o.type === "coin") {
            const xyR = o.scale * 0.92 + SHIP_RADIUS * 0.95;
            const zHalf = SHIP_Z_HALF + o.scale * 0.28;
            if (zDepth < zHalf && d2 < xyR * xyR) {
              const pts = o.special ? config.specialCoinPoints : config.coinPoints;
              coinScore.current += pts;
              playCoinSound();
              healthRef.current = Math.min(100, healthRef.current + (o.special ? 8 : 3));
              boostRef.current  = Math.min(100, boostRef.current  + (o.special ? 16 : 8));
              useSpaceArcadeStore.getState().addWallet(o.special ? 10 : 4);
              sessionRef.current.coinsCollected++;
              if (o.special) {
                sessionRef.current.specialCollected++;
                sessionRef.current.specialItems.push({ type: "special_coin", pickedAt: e });
              }
              useSpaceRunHud.getState().setHud({
                coinsCollected: useSpaceRunHud.getState().coinsCollected + 1,
              });
              keep = false;
            }
          } else if (o.type === "power") {
            const xyR = POWER_PICKUP_XY + SHIP_RADIUS * 0.5;
            const zHalf = SHIP_Z_HALF + 0.25;
            if (zDepth < zHalf && d2 < xyR * xyR) {
              playCoinSound();
              if (o.power === "shield")  shieldRef.current  = Math.min(100, shieldRef.current + 40);
              if (o.power === "slow")    slowT.current   = Math.max(slowT.current, 5);
              if (o.power === "magnet")  magnetT.current = Math.max(magnetT.current, 6);
              sessionRef.current.powerUpsUsed++;
              sessionRef.current.specialItems.push({ type: `powerup_${o.power}`, pickedAt: e });
              useSpaceRunHud.getState().setHud({ activePower: o.power ?? null });
              keep = false;
            }
          }
        }
      }

      if (!keep) { release(o); continue; }
      arr[write++] = o;
    }
    arr.length = write;

    // ── Periodic HUD sync (every N frames) ────────────────────────────────
    flush.current++;
    if (flush.current % 5 === 0) {
      let cometsNearby = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === "meteor" && arr[i].z < -32 && arr[i].z > -42) cometsNearby++;
      }
      const survivalScore = Math.floor(e * 2);
      useSpaceRunHud.getState().setHud({
        score:            survivalScore + coinScore.current,
        survivalSec:      e,
        distance:         distanceRef.current,
        difficulty:       diff,
        health:           THREE.MathUtils.clamp(healthRef.current, 0, 100),
        shield:           THREE.MathUtils.clamp(shieldRef.current, 0, 100),
        boost:            THREE.MathUtils.clamp(boostRef.current,  0, 100),
        activePower:
          shieldRef.current > 0 ? `shield ${Math.round(shieldRef.current)}%`
          : slowT.current  > 0  ? "slow-mo"
          : magnetT.current > 0 ? "magnet"
          : null,
        milestone:         lastMilestone.current,
        milestoneFlash:    milestoneFlash.current > 0,
        gravityWellActive: !!gravWellPos.current,
        cometsNearby,
      });
    }

    // ── Shake decay ────────────────────────────────────────────────────────
    if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 4.2);

  }, [config, inputRef, runningRef, acquire, release, fireGameOver]);

  // ── Public interface ───────────────────────────────────────────────────────
  return {
    // Refs the scene reads for rendering
    shipX, shipY, shipVx, shipVy,
    speedRef, boostingRef, shakeRef, healthRef,
    obstacles,

    // Called from useFrame
    tick,

    // External reset
    reset: useCallback(() => {
      shipX.current = 0; shipY.current = 0;
      shipVx.current = 0; shipVy.current = 0;
      speedRef.current = 16; boostRef.current = 100;
      healthRef.current = 100; shieldRef.current = 0;
      distanceRef.current = 0; shakeRef.current = 0;
      elapsed.current = 0; coinScore.current = 0;
      flush.current = 0; slowT.current = 0; magnetT.current = 0;
      boostingRef.current = false;
      gravWellPos.current = null; gravWellTimer.current = 0;
      lastMilestone.current = 0; milestoneFlash.current = 0;
      obstacles.current = []; pool.current = [];
      nextId.current = 1; spawnM.current = 0; spawnC.current = 0;
      gameOverFiredRef.current = false;
      sessionRef.current = {
        startedAt: Date.now(),
        coinsCollected: 0, specialCollected: 0, powerUpsUsed: 0,
        peakSpeed: 16, milestonesHit: [], specialItems: [],
        gameOverReason: "collision",
      };
    }, []),
  };
}
