import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceRunHud } from "./spaceRunHudStore";
import { useSpaceArcadeStore } from "./spaceArcadeStore";
import { playCoinSound, playExplosionSound } from "./spaceRunSounds";



const SKIN_COLORS = {
  default: "#38bdf8",
  ruby: "#fb7185",
  lime: "#a3e635",
  solar: "#fbbf24",
};

function randomRange(a, b) {
  return a + Math.random() * (b - a);
}

function shallowCopyObs(src) {
  return src.map((o) => ({ ...o }));
}

function CameraRig({ shipX, shipY, shake, speedRef }) {
  const { camera } = useThree();
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const speedLag = THREE.MathUtils.clamp((speedRef.current - 16) * 0.055, 0, 1.8);
    camTarget.set(shipX.current * 0.38, shipY.current * 0.48 + 2.35, 11.8 - speedLag);
    camera.position.lerp(camTarget, 0.07);
    if (shake.current > 0) {
      shake.current = Math.max(0, shake.current - delta * 4);
      const amp = shake.current * 0.22;
      camera.position.x += (Math.random() - 0.5) * amp;
      camera.position.y += (Math.random() - 0.5) * amp;
      camera.position.z += (Math.random() - 0.5) * amp * 0.5;
    }
    lookTarget.set(shipX.current * 0.16, shipY.current * 0.18, -6 - speedLag * 0.35);
    camera.lookAt(lookTarget);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 52 + speedLag * 4, 0.08);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

export function SpaceRunScene({ inputRef, runningRef }) {
  const shipX = useRef(0);
  const shipY = useRef(0);
  const shipVx = useRef(0);
  const shipVy = useRef(0);
  const speedRef = useRef(16);
  const boostRef = useRef(100);
  const healthRef = useRef(100);
  const shieldRef = useRef(0);
  const distanceRef = useRef(0);
  const shakeRef = useRef(0);
  const obstacles = useRef([]);
  const nextId = useRef(1);
  const spawnM = useRef(0);
  const spawnC = useRef(0);
  const elapsed = useRef(0);
  const slowT = useRef(0);
  const magnetT = useRef(0);
  const coinScore = useRef(0);
  const flush = useRef(0);
  const frameN = useRef(0);
  const groupRef = useRef(null);
  const [renderObs, setRenderObs] = useState([]);
  const meteorGeom = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const coinGeom = useMemo(() => new THREE.OctahedronGeometry(0.5, 0), []);

  const skin = useSpaceArcadeStore((s) => s.equippedSkin);
  const hullColor = SKIN_COLORS[skin];

  useEffect(() => {
    return () => {
      obstacles.current = [];
    };
  }, []);

  useFrame((_, delta) => {
    const hud = useSpaceRunHud.getState();
    if (!runningRef.current) return;
    if (hud.gameOver || hud.paused) return;

    const inp = inputRef.current;
    const boosting = inp.boost && boostRef.current > 2;
    const ax = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const ay = (inp.up ? 1 : 0) - (inp.down ? 1 : 0);
    shipVx.current += ax * delta * 14;
    shipVy.current += ay * delta * 14;
    shipVx.current *= 0.88;
    shipVy.current *= 0.88;
    shipX.current = THREE.MathUtils.clamp(shipX.current + shipVx.current * delta * 2.8, -3.35, 3.35);
    shipY.current = THREE.MathUtils.clamp(shipY.current + shipVy.current * delta * 2.8, -2.4, 2.4);

    if (slowT.current > 0) slowT.current -= delta;
    if (magnetT.current > 0) magnetT.current -= delta;
    boostRef.current = boosting
      ? Math.max(0, boostRef.current - delta * 32)
      : Math.min(100, boostRef.current + delta * 12);
    const slowMul = slowT.current > 0 ? 0.52 : 1;
    const boostMul = boosting ? 1.45 : 1;

    elapsed.current += delta;
    const e = elapsed.current;
    const diff = 1 + Math.min(2.2, e * 0.07);
    const baseV = 13 + Math.min(26, e * 0.5);
    const vz = baseV * diff * slowMul * boostMul;
    speedRef.current = vz;
    distanceRef.current += vz * delta * 0.85;

    spawnM.current += delta;
    spawnC.current += delta;
    const meteorEvery = Math.max(0.22, 1.02 - e * 0.034);
    const coinEvery = Math.max(0.45, 0.85 - e * 0.018);

    if (spawnM.current >= meteorEvery) {
      spawnM.current = 0;
      const clusterChance = THREE.MathUtils.clamp((e - 12) / 45, 0, 0.6);
      const n = Math.random() < clusterChance ? 2 + (Math.random() < 0.28 ? 1 : 0) : 1;
      for (let i = 0; i < n; i++) {
        obstacles.current.push({
          id: nextId.current++,
          type: "meteor",
          x: randomRange(-3.2, 3.2),
          y: randomRange(-2.1, 2.1),
          z: -46 - Math.random() * 8,
          vx: randomRange(-0.15, 0.15),
          vy: randomRange(-0.12, 0.12),
          vz: vz * randomRange(0.92, 1.08),
          rx: Math.random() * Math.PI * 2,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI * 2,
          rs: randomRange(1.2, 2.4),
          scale: randomRange(0.3, 0.7),
          damage: randomRange(10, 24),
          waveX: randomRange(0.15, 0.95),
          waveY: randomRange(0.1, 0.65),
          waveF: randomRange(0.8, 1.9),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    if (spawnC.current >= coinEvery) {
      spawnC.current = 0;
      const roll = Math.random();
      if (roll < 0.06 && magnetT.current <= 0 && slowT.current <= 0) {
        const kinds = ["shield", "slow", "magnet"];
        const power = kinds[Math.floor(Math.random() * kinds.length)];
        obstacles.current.push({
          id: nextId.current++,
          type: "power",
          power,
          x: randomRange(-2.8, 2.8),
          y: randomRange(-1.8, 1.8),
          z: -40 - Math.random() * 6,
          vx: 0,
          vy: 0,
          vz: vz * 0.95,
          rx: 0,
          ry: 0,
          rz: 0,
          rs: 2.5,
          scale: 0.38,
        });
      } else {
        const special = Math.random() < 0.14;
        obstacles.current.push({
          id: nextId.current++,
          type: "coin",
          special,
          x: randomRange(-3, 3),
          y: randomRange(-2, 2),
          z: -38 - Math.random() * 10,
          vx: 0,
          vy: 0,
          vz: vz * 0.88,
          rx: 0,
          ry: 0,
          rz: 0,
          rs: 4,
          scale: special ? 0.56 : 0.44,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const sx = shipX.current;
    const sy = shipY.current;
    const magnet = magnetT.current > 0;

    obstacles.current = obstacles.current.filter((o) => {
      const waveT = e * (o.waveF ?? 0);
      o.x += o.vx * delta;
      o.y += o.vy * delta;
      if (o.type === "meteor") {
        o.x += Math.sin(waveT + (o.phase ?? 0)) * (o.waveX ?? 0) * delta;
        o.y += Math.cos(waveT * 1.2 + (o.phase ?? 0)) * (o.waveY ?? 0) * delta;
      } else if (o.type === "coin") {
        o.y += Math.sin(e * 2.6 + (o.phase ?? 0)) * delta * 0.32;
      }
      o.z += o.vz * delta;
      o.rx += o.rs * delta * 0.7;
      o.ry += o.rs * delta * 0.55;
      o.rz += o.rs * delta * 0.4;

      if (magnet && o.type === "coin") {
        const dx = sx - o.x;
        const dy = sy - o.y;
        const pull = 5 * delta;
        o.x += dx * pull;
        o.y += dy * pull;
      }

      if (o.z > 7) return false;

      const dz = Math.abs(o.z);
      if (dz > 2.2) return true;

      const dx = o.x - sx;
      const dy = o.y - sy;
      const d2 = dx * dx + dy * dy;

      if (o.type === "meteor") {
        const hitR = o.scale * 1.05 + 0.42;
        if (d2 < hitR * hitR) {
          shakeRef.current = Math.max(shakeRef.current, 1);
          playExplosionSound();
          const incoming = o.damage ?? 14;
          let hpLoss = incoming;
          if (shieldRef.current > 0) {
            const absorb = Math.min(shieldRef.current, incoming * 0.82);
            shieldRef.current -= absorb;
            hpLoss -= absorb * 0.35;
          }
          healthRef.current = Math.max(0, healthRef.current - hpLoss);
          if (healthRef.current <= 0) {
            useSpaceRunHud.getState().setHud({ gameOver: true, activePower: null, health: 0 });
          }
          return false;
        }
      } else if (o.type === "coin") {
        const hitR = o.scale * 0.95 + 0.38;
        if (d2 < hitR * hitR) {
          const pts = o.special ? 35 : 12;
          coinScore.current += pts;
          playCoinSound();
          healthRef.current = Math.min(100, healthRef.current + (o.special ? 8 : 3));
          boostRef.current = Math.min(100, boostRef.current + (o.special ? 16 : 8));
          useSpaceArcadeStore.getState().addWallet(o.special ? 10 : 4);
          useSpaceRunHud.getState().setHud({ coinsCollected: useSpaceRunHud.getState().coinsCollected + 1 });
          return false;
        }
      } else if (o.type === "power") {
        if (d2 < 0.55) {
          playCoinSound();
          if (o.power === "shield") shieldRef.current = Math.min(100, shieldRef.current + 40);
          if (o.power === "slow") slowT.current = Math.max(slowT.current, 5);
          if (o.power === "magnet") magnetT.current = Math.max(magnetT.current, 6);
          useSpaceRunHud.getState().setHud({
            activePower: o.power ?? null,
          });
          return false;
        }
      }

      return true;
    });

    const survivalScore = Math.floor(e * 2);
    const total = survivalScore + coinScore.current;
    flush.current += 1;
    if (flush.current % 6 === 0) {
      useSpaceRunHud.getState().setHud({
        score: total,
        survivalSec: e,
        distance: distanceRef.current,
        difficulty: diff,
        health: healthRef.current,
        shield: shieldRef.current,
        boost: boostRef.current,
        activePower:
          shieldRef.current > 0
            ? `shield ${Math.round(shieldRef.current)}%`
            : slowT.current > 0
              ? "slow-mo"
              : magnetT.current > 0
                ? "magnet"
                : null,
      });
    }

    if (groupRef.current) {
      groupRef.current.position.set(sx, sy, 0);
    }

    frameN.current += 1;
    if (frameN.current % 4 === 0) {
      setRenderObs(shallowCopyObs(obstacles.current));
    }
  });

  return (
    <>
      <CameraRig shipX={shipX} shipY={shipY} shake={shakeRef} speedRef={speedRef} />
      <color attach="background" args={["#0a0630"]} />
      <fog attach="fog" args={["#1a0a4a", 18, 95]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 10, 6]} intensity={1.1} color="#ffe0ff" />
      <directionalLight position={[-6, 2, -4]} intensity={0.5} color="#88ccff" />
      <pointLight position={[0, 2, 10]} intensity={0.4} color="#7dd3fc" />
      <Stars radius={120} depth={60} count={5000} factor={3.2} saturation={0.65} fade speed={0.4} />
      <Stars radius={145} depth={90} count={2300} factor={5.6} saturation={0.8} fade speed={0.75} />

      <mesh position={[-18, 6, -32]} scale={4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#f6a05c" roughness={0.85} emissive="#c45a1a" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[22, -4, -38]} scale={2.8}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#6ec5ff" roughness={0.7} emissive="#1e6bff" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[8, 8, -48]} scale={1.6}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#b4f7c0" roughness={0.9} emissive="#2a8c4a" emissiveIntensity={0.12} />
      </mesh>

      <mesh position={[0, 0, -28]} rotation={[0.2, 0.4, 0]}>
        <planeGeometry args={[80, 45]} />
        <meshBasicMaterial color="#6b21a8" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 2, -35]} rotation={[-0.15, -0.3, 0]}>
        <planeGeometry args={[90, 50]} />
        <meshBasicMaterial color="#0e7490" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-6, 6, -55]} rotation={[0.16, -0.28, 0]}>
        <planeGeometry args={[85, 40]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.09} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <group ref={groupRef}>
        <group rotation={[0, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
            <coneGeometry args={[0.38, 1.1, 10]} />
            <meshStandardMaterial color={hullColor} roughness={0.35} metalness={0.25} emissive={hullColor} emissiveIntensity={0.08} />
          </mesh>
          <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.22, 0.35, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.32, 0, -0.05]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.45, 0.08, 0.12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[-0.32, 0, -0.05]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.45, 0.08, 0.12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0, -0.78]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.11, 0.6, 10]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      <group>
        {renderObs.map((o) => {
          if (o.type === "meteor") {
            return (
              <mesh key={o.id} position={[o.x, o.y, o.z]} scale={o.scale} rotation={[o.rx, o.ry, o.rz]} geometry={meteorGeom}>
                <meshStandardMaterial color="#a67c52" roughness={0.92} metalness={0.04} />
              </mesh>
            );
          }
          if (o.type === "coin") {
            const col = o.special ? "#a78bfa" : "#5eead4";
            const em = o.special ? "#7c3aed" : "#0f766e";
            return (
              <group key={o.id} position={[o.x, o.y, o.z]} scale={o.scale} rotation={[o.rx, o.ry, o.rz]}>
                <mesh geometry={coinGeom}>
                  <meshStandardMaterial color={col} emissive={em} emissiveIntensity={1.35} metalness={0.42} roughness={0.18} />
                </mesh>
                <mesh scale={1.9}>
                  <sphereGeometry args={[0.5, 12, 12]} />
                  <meshBasicMaterial color={col} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
                </mesh>
              </group>
            );
          }
          const col = o.power === "shield" ? "#60a5fa" : o.power === "slow" ? "#a78bfa" : "#4ade80";
          return (
            <mesh key={o.id} position={[o.x, o.y, o.z]} scale={o.scale} rotation={[o.rx, o.ry, o.rz]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.95} metalness={0.2} roughness={0.35} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}




