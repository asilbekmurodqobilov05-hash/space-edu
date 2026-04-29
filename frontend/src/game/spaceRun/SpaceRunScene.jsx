import { useRef, useMemo, useEffect, useLayoutEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { useSpaceRunHud } from "./spaceRunHudStore";
import { useSpaceArcadeStore } from "./spaceArcadeStore";
import { playCoinSound, playExplosionSound } from "./spaceRunSounds";

const SKIN_COLORS = {
  default: "#38bdf8",
  ruby: "#fb7185",
  lime: "#a3e635",
  solar: "#fbbf24",
};

const MAX_METEOR_INSTANCES = 200;
const MAX_COIN_INSTANCES = 140;
const MAX_SPEC_INSTANCES = 140;
const MAX_SHIELD_INST = 14;
const MAX_SLOW_INST = 12;
const MAX_MAGNET_INST = 12;
const MAX_OBSTACLES = 260;
const Z_KILL = 7;
const Z_NEAR = 2.35;
/** Widen horizontal lane + obstacle/coin spread (moving field feels bigger). */
const PLAYFIELD_XY_SCALE = 1.8;
const SHIP_BOUNDS = { x: 3.35 * PLAYFIELD_XY_SCALE, y: 2.4 * PLAYFIELD_XY_SCALE };
const SPAWN_METEOR_X = 3.15 * PLAYFIELD_XY_SCALE;
const SPAWN_METEOR_Y = 2.05 * PLAYFIELD_XY_SCALE;
const SPAWN_POWER_X = 2.75 * PLAYFIELD_XY_SCALE;
const SPAWN_POWER_Y = 1.75 * PLAYFIELD_XY_SCALE;
const SPAWN_COIN_X = 2.95 * PLAYFIELD_XY_SCALE;
const SPAWN_COIN_Y = 1.95 * PLAYFIELD_XY_SCALE;
const POWER_PICKUP_XY = 0.62 * PLAYFIELD_XY_SCALE;
/** Backdrop: ~1 scene XY unit at −60Z ≈ this many km (motion scale only). */
const BACKDROP_KM_PER_SCENE_UNIT = 48;
/** Requested orbital drift speed for major planets / moons (km/s). */
const PLANET_ORBITAL_KM_S = 1.5;
/** World units per second along epicycles (= km/s ÷ km/unit). */
const PLANET_DRIFT_U_S = PLANET_ORBITAL_KM_S / BACKDROP_KM_PER_SCENE_UNIT;
/** Ship is visually larger, keep collision radius roughly matched. */
const SHIP_RADIUS = 0.36 * 1.3;
const SHIP_Z_HALF = 0.52 * 1.3;
const SHIP_ACCEL = 58;
const SHIP_MAX_SPEED = 12.4;
const SHIP_DRAG = 6.2;
const BOOST_DRAIN = 34;
const BOOST_RECHARGE = 11;
const BOOST_SPEED_MUL = 1.38;
const SLOW_MUL = 0.52;
const HUD_EVERY = 5;

const _m = new THREE.Matrix4();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();
const _camQ = new THREE.Quaternion();
const _powerCol = new THREE.Color();

function clamp01(x) {
  return THREE.MathUtils.clamp(x, 0, 1);
}

function randomRange(a, b) {
  return a + Math.random() * (b - a);
}

function finiteDelta(d) {
  const v = Number.isFinite(d) ? d : 0;
  return THREE.MathUtils.clamp(v, 0, 0.1);
}

/** Displaced icosahedron → irregular rocky asteroid (shared geometry, scaled per instance). */
function createRockAsteroidGeometry() {
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.length();
    if (n < 1e-6) continue;
    const jitter = 0.72 + Math.random() * 0.38;
    const bump = 0.88 + Math.sin(i * 2.17) * 0.12 + Math.cos(i * 1.73) * 0.1;
    v.multiplyScalar((jitter * bump) / n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function createCraterCanvasTexture(seed = 0) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  const grd = g.createLinearGradient(0, 0, 512, 256);
  grd.addColorStop(0, "#6b2f18");
  grd.addColorStop(0.35, "#c45a2e");
  grd.addColorStop(0.7, "#9a3412");
  grd.addColorStop(1, "#431407");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 180; i++) {
    const x = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 512;
    const y = ((Math.cos(i * 78.233 + seed) * 12345.678) % 1) * 256;
    const r = 2 + (i % 9);
    g.fillStyle = `rgba(20,10,6,${0.12 + (i % 5) * 0.04})`;
    g.beginPath();
    g.arc(((x + 512) % 512 + 512) % 512, ((y + 256) % 256 + 256) % 256, r, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createMoonCanvasTexture() {
  const c = document.createElement("canvas");
  c.width = 384;
  c.height = 192;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  g.fillStyle = "#b8c0c8";
  g.fillRect(0, 0, 384, 192);
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 384;
    const y = Math.random() * 192;
    const br = 180 + Math.random() * 60;
    g.fillStyle = `rgba(${br},${br},${br + 8},${0.04 + Math.random() * 0.08})`;
    g.fillRect(x, y, 1.2, 1.2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createEarthCanvasTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  const ocean = g.createLinearGradient(0, 0, 512, 256);
  ocean.addColorStop(0, "#0c4a6e");
  ocean.addColorStop(0.5, "#0369a1");
  ocean.addColorStop(1, "#075985");
  g.fillStyle = ocean;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const rw = 30 + Math.random() * 80;
    const rh = 18 + Math.random() * 40;
    g.fillStyle = `rgba(34, 120, 55, ${0.35 + Math.random() * 0.25})`;
    g.beginPath();
    g.ellipse(cx, cy, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.35)";
  for (let i = 0; i < 120; i++) {
    g.beginPath();
    g.arc(Math.random() * 512, Math.random() * 256, 4 + Math.random() * 24, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createGasGiantGreenTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  const base = g.createRadialGradient(256, 128, 20, 256, 128, 260);
  base.addColorStop(0, "#5a9d6a");
  base.addColorStop(0.35, "#3d7a52");
  base.addColorStop(0.65, "#2d5a3d");
  base.addColorStop(1, "#1a3d28");
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 55; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const rw = 40 + Math.random() * 100;
    const rh = 12 + Math.random() * 36;
    g.fillStyle = `rgba(${80 + (i % 40)}, ${140 + (i % 60)}, ${90 + (i % 35)}, ${0.25 + Math.random() * 0.2})`;
    g.beginPath();
    g.ellipse(cx, cy, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 30; i++) {
    g.strokeStyle = `rgba(200, 230, 200, ${0.06 + Math.random() * 0.08})`;
    g.lineWidth = 1 + Math.random() * 2;
    g.beginPath();
    g.moveTo(0, Math.random() * 256);
    g.bezierCurveTo(170, Math.random() * 256, 340, Math.random() * 256, 512, Math.random() * 256);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createCloudCanvasTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return new THREE.CanvasTexture(c);
  g.clearRect(0, 0, 512, 256);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.2})`;
    g.beginPath();
    g.ellipse(Math.random() * 512, Math.random() * 256, 20 + Math.random() * 50, 8 + Math.random() * 16, Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function meshToAppliedGeometry(mesh) {
  mesh.updateMatrix();
  const g = mesh.geometry.clone();
  g.applyMatrix4(mesh.matrix);
  return g;
}

/** Horseshoe magnet + green-tip poles (single merged buffer). */
function createMagnetMergeGeometry() {
  const arcMesh = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 10, 32, Math.PI * 1.08));
  arcMesh.rotation.z = Math.PI * 0.5;
  arcMesh.position.y = 0.06;
  const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.14));
  tipL.position.set(-0.4, -0.44, 0);
  const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.14));
  tipR.position.set(0.4, -0.44, 0);
  try {
    const merged = mergeGeometries(
      [meshToAppliedGeometry(arcMesh), meshToAppliedGeometry(tipL), meshToAppliedGeometry(tipR)],
      false
    );
    if (merged) return merged;
  } catch {
    /* ignore */
  }
  return new THREE.TorusGeometry(0.4, 0.1, 10, 32, Math.PI * 1.08);
}

/** Purple crystal “flower”: octahedron core + radial tetra petals. */
function createCrystalFlowerGeometry() {
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0));
  const parts = [meshToAppliedGeometry(core)];
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(new THREE.TetrahedronGeometry(0.26, 0));
    const a = (i / 5) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0.06);
    p.rotation.set(0.35, a, 0.2);
    parts.push(meshToAppliedGeometry(p));
  }
  try {
    const merged = mergeGeometries(parts, false);
    if (merged) return merged;
  } catch {
    /* ignore */
  }
  return new THREE.OctahedronGeometry(0.62, 0);
}

function createMagnetTipTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createLinearGradient(0, 0, 128, 128);
  grd.addColorStop(0, "#cbd5e1");
  grd.addColorStop(0.55, "#64748b");
  grd.addColorStop(1, "#475569");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#22c55e";
  g.fillRect(0, 100, 56, 28);
  g.fillRect(72, 100, 56, 28);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Circular alpha sprite to avoid square particles if texture is missing. */
function createEngineParticleSpriteTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(220,245,255,0.95)");
  grd.addColorStop(0.6, "rgba(140,210,255,0.55)");
  grd.addColorStop(1, "rgba(120,200,255,0)");
  g.clearRect(0, 0, 128, 128);
  g.fillStyle = grd;
  g.beginPath();
  g.arc(64, 64, 64, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

const nebulaSkyVertexShader = `
varying vec2 vUv;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const nebulaSkyFragmentShader = `
precision highp float;
uniform float uTime;
uniform float uV;
varying vec2 vUv;
varying vec3 vWorldPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash3(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.08;
    a *= 0.52;
  }
  return v;
}

/* Stable stars locked to sky direction — no per-frame UV crawl. */
float starField(vec3 dir) {
  vec2 sph = vec2(atan(dir.z, dir.x), asin(clamp(dir.y, -1.0, 1.0)));
  vec2 g1 = sph * 95.0;
  vec2 g2 = sph * 168.0 + vec2(17.3, 9.1);
  vec2 g3 = sph * 260.0 + vec2(-31.0, 22.7);

  vec2 f1 = fract(g1) - 0.5;
  vec2 f2 = fract(g2) - 0.5;
  vec2 f3 = fract(g3) - 0.5;
  vec2 i1 = floor(g1);
  vec2 i2 = floor(g2);
  vec2 i3 = floor(g3);

  float b1 = hash(i1);
  float b2 = hash(i2);
  float b3 = hash(i3);

  float d1 = length(f1);
  float d2 = length(f2);
  float d3 = length(f3);

  float s1 = smoothstep(0.12, 0.0, d1) * step(0.985, b1);
  float s2 = smoothstep(0.09, 0.0, d2) * step(0.992, b2) * 0.65;
  float s3 = smoothstep(0.06, 0.0, d3) * step(0.996, b3) * 0.4;

  return (s1 + s2 + s3) * 0.95;
}

void main() {
  vec2 uv = vUv;
  vec3 dir = normalize(vWorldPos + vec3(1e-4));
  float h = dir.y * 0.5 + 0.5;

  // uV comes from gameplay speed to create "stars flight".
  vec2 flow = vec2(uV * 0.00008 + uTime * 0.0018, uV * 0.00006 + uTime * 0.0012);
  vec2 p = dir.xz * 2.4 + dir.y * 0.35 + flow;
  float n1 = fbm(p + vec2(0.0, uTime * 0.0035));
  float n2 = fbm(p * 1.28 + vec2(3.7, -uTime * 0.0028));

  vec3 deep = vec3(0.018, 0.012, 0.06);
  vec3 blueCorner = vec3(0.06, 0.12, 0.38);
  vec3 purplePink = vec3(0.32, 0.08, 0.3);
  vec3 violetWash = vec3(0.14, 0.05, 0.24);

  float rightUp = smoothstep(0.15, 0.92, (dir.x * 0.52 + 0.5) * (h + 0.12));
  float leftMagenta = smoothstep(0.12, 0.88, (0.5 - dir.x * 0.58) * (1.08 - h * 0.32));
  vec3 base = mix(deep, blueCorner, rightUp * 0.68);
  base = mix(base, purplePink, leftMagenta * (0.5 + 0.32 * n1));
  base = mix(base, violetWash, smoothstep(0.22, 0.86, n2) * 0.5);
  base += vec3(0.08, 0.035, 0.11) * fbm(dir.xz * 4.2 + dir.y + uTime * 0.0015) * 0.28;

  float stars = starField(dir) * 0.55;
  vec3 col = base + vec3(stars);

  float vign = 1.0 - length(uv - 0.5) * 0.72;
  col *= 0.52 + 0.38 * vign;

  float dith = hash3(vec3(floor(gl_FragCoord.xy), 0.0)) * 0.01 - 0.005;
  col += dith;
  col = pow(col, vec3(1.05));

  gl_FragColor = vec4(col, 1.0);
}
`;

function CosmicSkyDome({ speedRef }) {
  const meshRef = useRef(null);
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uV: { value: 0 } },
      vertexShader: nebulaSkyVertexShader,
      fragmentShader: nebulaSkyFragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
  }, []);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
    }
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uV.value = speedRef?.current ?? 0;
  });
  return (
    <mesh ref={meshRef} renderOrder={-500} frustumCulled={false}>
      <sphereGeometry args={[180, 64, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function CinematicLensFlares() {
  const g = useRef(null);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.children.forEach((ch, i) => {
      ch.lookAt(state.camera.position);
      const slow = t * 0.12 + i * 0.4;
      ch.scale.setScalar(2.15 + Math.sin(slow) * 0.08 + i * 0.75);
      if (ch.material) {
        const base = 0.05 + (i % 3) * 0.028;
        ch.material.opacity = base + Math.sin(slow * 0.7 + i) * 0.012;
      }
    });
  });
  const mkRing = (color, scale, opacity) => (
    <mesh key={color + scale} scale={scale} rotation={[0.3, 0.2, 0]}>
      <ringGeometry args={[0.35, 0.55, 48]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
  return (
    <group ref={g} position={[-28, 18, -55]}>
      {mkRing("#fffbeb", 14, 0.07)}
      {mkRing("#7dd3fc", 22, 0.05)}
      {mkRing("#f0abfc", 32, 0.045)}
      <mesh scale={6}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="#fffef5" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function DistantGalaxyPlanes() {
  return (
    <group visible={false}>
      <mesh position={[-35, -8, -75]} rotation={[0.2, 0.5, 0.1]} scale={[18, 10, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.045} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[40, 12, -82]} rotation={[-0.15, -0.4, 0]} scale={[22, 12, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.04} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** Distant eye-candy: satellites, sail craft, comet, jump gate — far Z, cheap materials. */
function DeepSpaceHighlights() {
  const comet = useRef(null);
  const gate = useRef(null);
  const sail = useRef(null);
  const sats = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const v = PLANET_DRIFT_U_S;

    if (sats.current) {
      sats.current.rotation.y = t * 0.018;
      sats.current.position.x = Math.sin(t * v * 0.35) * 2.2;
      sats.current.position.y = Math.cos(t * v * 0.28) * 1.1;
    }
    if (sail.current) {
      sail.current.rotation.y = t * 0.06;
      sail.current.rotation.z = Math.sin(t * 0.04) * 0.08;
      sail.current.position.set(18 + Math.sin(t * v * 0.22 + 2) * 5, -2 + Math.cos(t * v * 0.19) * 2.8, -86);
    }
    if (comet.current) {
      const u = (t * v * 2.4) % 140;
      comet.current.position.set(-55 + u * 0.85, 10 + Math.sin(u * 0.09) * 4, -96);
      comet.current.rotation.z = t * 0.12;
    }
    if (gate.current) {
      gate.current.rotation.z = t * 0.11;
      gate.current.rotation.y = t * 0.05;
      gate.current.position.set(-12 + Math.sin(t * v * 0.18 + 0.7) * 4, 3 + Math.cos(t * v * 0.16) * 2.2, -78);
    }
  });

  return (
    <group>
      <group ref={sats} position={[-22, 10, -90]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          const r = 3.2 + (i % 2) * 0.6;
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 0.9) * 0.8, Math.sin(a) * 0.5]} rotation={[0.2, a, 0.1]}>
              <boxGeometry args={[0.35, 0.06, 0.9]} />
              <meshStandardMaterial
                color="#e2e8f0"
                emissive={i % 2 === 0 ? "#38bdf8" : "#a78bfa"}
                emissiveIntensity={0.5}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      <group ref={sail}>
        <mesh rotation={[0, 0, 0.25]}>
          <planeGeometry args={[2.8, 4.2]} />
          <meshStandardMaterial
            color="#fde68a"
            emissive="#fbbf24"
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.25}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh rotation={[0, 0, -0.25]}>
          <planeGeometry args={[2.8, 4.2]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fcd34d"
            emissiveIntensity={0.22}
            metalness={0.5}
            roughness={0.3}
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.25, 0.25, 0.45]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.28} emissive="#64748b" emissiveIntensity={0.08} />
        </mesh>
      </group>

      <group ref={comet}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.4} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.35, 1.8, 12, 1, true]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={gate} scale={1.15}>
        <mesh rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[2.4, 0.06, 8, 48]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.1} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]} scale={0.72}>
          <torusGeometry args={[2.4, 0.04, 8, 40]} />
          <meshBasicMaterial color="#f0abfc" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]}>
          <ringGeometry args={[1.15, 1.35, 32]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[32, -8, -94]} rotation={[0.3, -0.5, 0.1]}>
        <torusGeometry args={[4.5, 0.02, 4, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CinematicPlanets() {
  const marsMap = useMemo(() => createCraterCanvasTexture(1), []);
  const moonMap = useMemo(() => createMoonCanvasTexture(), []);
  const earthMap = useMemo(() => createEarthCanvasTexture(), []);
  const gasGreenMap = useMemo(() => createGasGiantGreenTexture(), []);
  const cloudMap = useMemo(() => createCloudCanvasTexture(), []);
  const earthRef = useRef(null);
  const cloudRef = useRef(null);
  const gasRef = useRef(null);
  const moonMeshRef = useRef(null);
  const marsG = useRef(null);
  const ringG = useRef(null);
  const gasG = useRef(null);
  const moonG = useRef(null);
  const earthG = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const v = PLANET_DRIFT_U_S;

    if (earthRef.current) earthRef.current.rotation.y = t * 0.04;
    if (gasRef.current) gasRef.current.rotation.y = t * 0.028;
    if (moonMeshRef.current) moonMeshRef.current.rotation.y = t * 0.022;
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.055;
      if (cloudRef.current.material.map) {
        cloudRef.current.material.map.offset.x = t * 0.012;
      }
    }

    const wM = v / 9;
    const wG = v / 6.5;
    const wE = v / 4.5;
    const wMoon = v / 5;
    const wRing = v / 5;

    if (marsG.current) {
      marsG.current.position.set(
        -26 + Math.sin(t * wM + 0.3) * 9,
        8 + Math.cos(t * wM * 0.82 + 1.1) * 3.5,
        -58 + Math.cos(t * wM * 0.55) * 4.5
      );
      marsG.current.rotation.y = t * 0.012;
    }
    if (ringG.current) {
      ringG.current.position.set(
        -32 + Math.sin(t * wRing + 2.2) * 5,
        14 + Math.cos(t * wRing * 0.76) * 2.8,
        -78 + Math.sin(t * wRing * 0.4) * 3
      );
      ringG.current.rotation.z = 0.55 + Math.sin(t * wRing * 0.5) * 0.06;
    }
    if (gasG.current) {
      gasG.current.position.set(
        28 + Math.sin(t * wG + 4.1) * 6.5,
        2 + Math.cos(t * wG * 0.88 + 0.4) * 4,
        -54 + Math.cos(t * wG * 0.48) * 3.5
      );
    }
    if (moonG.current) {
      moonG.current.position.set(
        -8 + Math.sin(t * wMoon + 5.5) * 5,
        -4 + Math.cos(t * wMoon * 0.9) * 3,
        -62 + Math.sin(t * wMoon * 0.42) * 2.8
      );
      moonG.current.rotation.y = t * 0.008;
    }
    if (earthG.current) {
      earthG.current.position.set(
        12 + Math.sin(t * wE + 1.7) * 4.5,
        -6 + Math.cos(t * wE * 0.85 + 3.3) * 3.2,
        -56 + Math.cos(t * wE * 0.5) * 3.8
      );
      earthG.current.rotation.y = t * 0.006;
    }
  });

  const cloudMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
      emissive: "#ffffff",
      emissiveIntensity: 0.08,
      blending: THREE.NormalBlending,
    });
    return m;
  }, [cloudMap]);

  return (
    <group>
      <group ref={marsG} scale={6.2}>
        <mesh>
          <sphereGeometry args={[1, 64, 48]} />
          <meshStandardMaterial map={marsMap} roughness={0.9} metalness={0.05} emissive="#d4622a" emissiveIntensity={0.12} />
        </mesh>
        <mesh scale={1.03}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshBasicMaterial color="#ff8a5c" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      </group>

      <group ref={ringG} rotation={[0.55, 0.2, -0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.35, 64]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.14} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={gasG} scale={4.1}>
        <mesh ref={gasRef}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshStandardMaterial map={gasGreenMap} roughness={0.78} metalness={0.04} emissive="#1e4d2e" emissiveIntensity={0.06} />
        </mesh>
        <mesh scale={1.025}>
          <sphereGeometry args={[1, 40, 32]} />
          <meshBasicMaterial color="#86efac" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      </group>

      <group ref={moonG} scale={1.15}>
        <mesh ref={moonMeshRef}>
          <sphereGeometry args={[1, 48, 40]} />
          <meshStandardMaterial map={moonMap} color="#c8d0d8" roughness={0.94} metalness={0.02} emissive="#7a8a9e" emissiveIntensity={0.05} />
        </mesh>
      </group>

      <group ref={earthG} scale={2.6}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshStandardMaterial map={earthMap} roughness={0.65} metalness={0.08} emissive="#1e3a5f" emissiveIntensity={0.06} />
        </mesh>
        <mesh ref={cloudRef} scale={1.018}>
          <sphereGeometry args={[1, 48, 40]} />
          <primitive object={cloudMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

function EnemyScoutShip({ speedRef }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const sp = speedRef?.current ?? 18;
    ref.current.position.x = Math.sin(t * 0.35) * (1.2 * PLAYFIELD_XY_SCALE) - 0.85 * PLAYFIELD_XY_SCALE;
    ref.current.position.y = Math.cos(t * 0.28) * (0.35 * PLAYFIELD_XY_SCALE) + 0.22;
    ref.current.position.z = -26 - (t * sp * 0.08) % 18;
    ref.current.rotation.z = Math.sin(t * 1.2) * 0.12;
    ref.current.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.08;
  });
  return (
    <group ref={ref} scale={0.85}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <coneGeometry args={[0.22, 1.4, 4, 1]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.15]} scale={[1, 0.35, 0.65]}>
        <boxGeometry args={[0.5, 1.5, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.08, -0.55]}>
        <boxGeometry args={[0.85, 0.04, 0.35]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.9} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.08, -0.55]}>
        <boxGeometry args={[0.85, 0.04, 0.35]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.75} metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Shuttle stack: orbiter + rust ET + twin SRBs. Y-flipped so bow faces −Z (ahead into the lane). */
function PlayerShipDetailed({ hullColor, boostingRef, shipVxRef, shipVyRef, healthRef }) {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const thrL = useRef(null);
  const thrR = useRef(null);
  const thrC = useRef(null);
  useFrame((state, delta) => {
    const dt = finiteDelta(delta);
    const b = boostingRef?.current ? 1.45 : 1;
    const pulse = 0.82 + Math.sin(performance.now() * 0.014) * 0.18 * b;
    const op = THREE.MathUtils.clamp(0.5 * pulse * b, 0.32, 0.92);
    for (const ref of [thrL, thrR, thrC]) {
      const m = ref.current?.material;
      if (m) m.opacity = op;
    }

    const vx = shipVxRef?.current ?? 0;
    const vy = shipVyRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    const idle = Math.sin(t * 1.15) * 0.018;
    const targetRoll = THREE.MathUtils.clamp(vx * 0.05 + idle, -0.58, 0.58);
    const targetPitch = THREE.MathUtils.clamp(vy * 0.042, -0.48, 0.48);
    const targetYaw = THREE.MathUtils.clamp(-vx * 0.016, -0.14, 0.14);
    const r = rootRef.current;
    if (r) {
      r.rotation.z = THREE.MathUtils.damp(r.rotation.z, targetRoll, 10, dt);
      r.rotation.x = THREE.MathUtils.damp(r.rotation.x, targetPitch, 10, dt);
      r.rotation.y = THREE.MathUtils.damp(r.rotation.y, targetYaw, 7.5, dt);
    }

    const g = glowRef.current;
    if (g && g.material) {
      const h = THREE.MathUtils.clamp((healthRef?.current ?? 100) / 100, 0, 1);
      const boosting = !!boostingRef?.current;
      const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 6.5) * 0.15;

      let color = "#22c55e";
      let baseOpacity = 0.26;
      let baseScale = 1.0;

      if (h > 0.6) {
        color = "#22c55e";
        baseOpacity = 0.32;
        baseScale = 1.02;
      } else if (h > 0.3) {
        color = "#f59e0b";
        baseOpacity = 0.38;
        baseScale = 1.03;
      } else {
        color = "#ef4444";
        baseOpacity = 0.52;
        baseScale = 1.07;
      }

      const dangerBoost = h <= 0.3 ? pulse : 1;
      const mult = boosting ? 1.5 : 1;

      // MeshBasicMaterial supports color/opacity
      _powerCol.set(color);
      g.material.color.copy(_powerCol);
      g.material.opacity = baseOpacity * dangerBoost * mult;
      g.scale.setScalar(baseScale * (boosting ? 1.15 : 1));
    }
  });

  const accent = hullColor;
  const orbiterWhite = "#f1f5f9";
  const tileBlack = "#1e293b";
  const etFoam = "#b45309";
  const etRust = "#c2410c";
  const srbWhite = "#e2e8f0";
  const srbRing = "#0f172a";

  return (
    <group ref={rootRef} scale={1.2}>
      <group rotation={[0, Math.PI, 0]}>
      {/* External tank — central rust column */}
      <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.95, 20]} />
        <meshStandardMaterial color={etRust} roughness={0.72} metalness={0.12} emissive={etFoam} emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.22, 12, 1]} />
        <meshStandardMaterial color={etRust} roughness={0.68} metalness={0.1} />
      </mesh>

      {/* SRBs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.26, 0, -0.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.88, 14]} />
            <meshStandardMaterial color={srbWhite} roughness={0.38} metalness={0.55} />
          </mesh>
          {[0.32, 0.02, -0.28].map((z, i) => (
            <mesh key={i} position={[0, 0, z]}>
              <torusGeometry args={[0.066, 0.012, 6, 20]} />
              <meshStandardMaterial color={srbRing} roughness={0.55} metalness={0.35} />
            </mesh>
          ))}
          <mesh position={[0, 0, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.065, 0.12, 10, 1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Orbiter — delta wing, white / black tiles */}
      <group position={[0, 0, 0.38]}>
        <mesh>
          <boxGeometry args={[0.36, 0.12, 0.52]} />
          <meshStandardMaterial color={orbiterWhite} roughness={0.35} metalness={0.65} />
        </mesh>
        <mesh position={[0, -0.055, 0]}>
          <boxGeometry args={[0.34, 0.04, 0.48]} />
          <meshStandardMaterial color={tileBlack} roughness={0.75} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.04, 0.12]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.22, 0.06, 0.2]} />
          <meshStandardMaterial color={tileBlack} roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0.42, 0, -0.02]} rotation={[0, 0, -0.42]}>
          <boxGeometry args={[0.38, 0.04, 0.28]} />
          <meshStandardMaterial color={orbiterWhite} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-0.42, 0, -0.02]} rotation={[0, 0, 0.42]}>
          <boxGeometry args={[0.38, 0.04, 0.28]} />
          <meshStandardMaterial color={orbiterWhite} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.06, 0.26]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.25} metalness={0.5} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.32]}>
          <boxGeometry args={[0.14, 0.1, 0.08]} />
          <meshStandardMaterial color={orbiterWhite} roughness={0.32} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0.34]}>
          <boxGeometry args={[0.12, 0.04, 0.06]} />
          <meshStandardMaterial color="#020617" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {/* Health glow ring */}
      <mesh ref={glowRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.66, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Main engine plumes (SRB + SSME) */}
      <mesh ref={thrL} position={[-0.26, 0, -0.68]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.55, 14, 1, true]} />
        <meshBasicMaterial color="#fef9c3" transparent opacity={0.68} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={thrR} position={[0.26, 0, -0.68]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.55, 14, 1, true]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.68} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={thrC} position={[0, 0, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.62, 16, 1, true]} />
        <meshBasicMaterial color="#fffbeb" transparent opacity={0.72} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      </group>
    </group>
  );
}

function CameraRig({ shipX, shipY, shake, speedRef }) {
  const { camera } = useThree();
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    const dt = finiteDelta(delta);
    const speedLag = THREE.MathUtils.clamp((speedRef.current - 16) * 0.05, 0, 1.85);
    camTarget.set(shipX.current * 0.42, shipY.current * 0.42 + 2.52, 10.35 - speedLag);
    camera.position.lerp(camTarget, 1 - Math.exp(-5.5 * dt));
    if (shake.current > 0) {
      shake.current = Math.max(0, shake.current - dt * 4.2);
      const amp = shake.current * 0.2;
      camera.position.x += (Math.random() - 0.5) * amp;
      camera.position.y += (Math.random() - 0.5) * amp;
      camera.position.z += (Math.random() - 0.5) * amp * 0.45;
    }
    lookTarget.set(shipX.current * 0.18, shipY.current * 0.18, -8.25 - speedLag * 0.38);
    camera.lookAt(lookTarget);
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = 49 + speedLag * 3.8;
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

function RendererSetup() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.98;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = false;
  }, [gl]);
  return null;
}

function EngineParticles({ shipX, shipY, boostingRef, runningRef }) {
  const ref = useRef(null);
  const matRef = useRef(null);
  const N = 72;
  const ages = useMemo(() => new Float32Array(N), []);
  const positions = useMemo(() => new Float32Array(N * 3), []);
  const velocities = useMemo(() => new Float32Array(N * 3), []);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  const spriteTex = useMemo(() => createEngineParticleSpriteTexture(), []);

  useEffect(() => {
    for (let i = 0; i < N; i++) ages[i] = 999;
  }, [ages]);
  useEffect(() => {
    return () => {
      spriteTex?.dispose?.();
    };
  }, [spriteTex]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (!runningRef.current) return;
    const hud = useSpaceRunHud.getState();
    if (hud.gameOver || hud.paused) return;

    const dt = finiteDelta(delta);
    const sx = shipX.current;
    const sy = shipY.current;
    const b = boostingRef.current ? 1 : 0;

    if (matRef.current) {
      matRef.current.opacity = b ? 0.82 : 0.62;
      matRef.current.size = b ? 0.11 : 0.095;
    }
    const emit = 18 + b * 28;

    let spawn = Math.floor(emit * dt);
    if (spawn < 1 && Math.random() < emit * dt) spawn = 1;

    for (let s = 0; s < spawn; s++) {
      let slot = -1;
      let best = -1;
      for (let i = 0; i < N; i++) {
        if (ages[i] > best) {
          best = ages[i];
          slot = i;
        }
      }
      if (slot < 0) continue;
      ages[slot] = 0;
      const i3 = slot * 3;
      const nozzle = slot % 3;
      const ox = nozzle === 0 ? -0.24 : nozzle === 1 ? 0.24 : 0;
      positions[i3] = sx + ox + randomRange(-0.04, 0.04);
      positions[i3 + 1] = sy + randomRange(-0.06, 0.06);
      const zMin = b ? 0.34 : 0.42;
      const zMax = b ? 0.72 : 0.62;
      positions[i3 + 2] = randomRange(zMin, zMax);
      velocities[i3] = randomRange(-0.12, 0.12);
      velocities[i3 + 1] = randomRange(-0.1, 0.1);
      const vzMin = b ? 4.0 : 3.2;
      const vzMax = b ? 6.3 : 5.2;
      velocities[i3 + 2] = randomRange(vzMin, vzMax) + b * 4.5;
    }

    const att = mesh.geometry.getAttribute("position");
    for (let i = 0; i < N; i++) {
      if (ages[i] > 900) continue;
      ages[i] += dt;
      const i3 = i * 3;
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;
      velocities[i3 + 2] -= dt * (b ? 1.65 : 2.1);
      if (ages[i] > (b ? 0.62 : 0.52)) ages[i] = 999;
      att.setXYZ(i, positions[i3], positions[i3 + 1], positions[i3 + 2]);
    }
    att.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        ref={matRef}
        map={spriteTex ?? undefined}
        alphaMap={spriteTex ?? undefined}
        color="#e0f2fe"
        size={0.095}
        transparent
        opacity={0.62}
        alphaTest={0.06}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
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
  const boostingRef = useRef(false);
  const groupRef = useRef(null);
  const meteorIM = useRef(null);
  const coinIM = useRef(null);
  const specIM = useRef(null);
  const shieldIM = useRef(null);
  const slowIM = useRef(null);
  const magnetIM = useRef(null);

  const meteorGeom = useMemo(() => createRockAsteroidGeometry(), []);
  const starGeom = useMemo(() => new THREE.OctahedronGeometry(0.55, 0), []);
  const crystalGeom = useMemo(() => createCrystalFlowerGeometry(), []);
  const slowStarGeom = useMemo(() => new THREE.IcosahedronGeometry(0.48, 0), []);
  const magnetGeom = useMemo(() => createMagnetMergeGeometry(), []);

  const shieldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4b5fd",
        emissive: "#7c3aed",
        emissiveIntensity: 0.85,
        metalness: 0.35,
        roughness: 0.22,
      }),
    []
  );
  const slowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        emissive: "#94a3b8",
        emissiveIntensity: 0.35,
        metalness: 0.88,
        roughness: 0.18,
      }),
    []
  );
  const magnetMat = useMemo(() => {
    const map = createMagnetTipTexture();
    return new THREE.MeshStandardMaterial({
      color: "#e2e8f0",
      map: map ?? undefined,
      metalness: 0.78,
      roughness: 0.28,
      emissive: "#16a34a",
      emissiveIntensity: 0.22,
    });
  }, []);

  const meteorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7c5c3e",
        roughness: 0.92,
        metalness: 0.05,
        emissive: "#3d2918",
        emissiveIntensity: 0.04,
      }),
    []
  );

  const coinMatGold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        emissive: "#fbbf24",
        emissiveIntensity: 0.35,
        metalness: 0.92,
        roughness: 0.18,
      }),
    []
  );
  const coinMatSilver = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        emissive: "#e2e8f0",
        emissiveIntensity: 0.28,
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

  const syncHud = useCallback(() => {
    const e = elapsed.current;
    const survivalScore = Math.floor(e * 2);
    const total = survivalScore + coinScore.current;
    const diff = 1 + Math.min(2.2, e * 0.07);
    useSpaceRunHud.getState().setHud({
      score: total,
      survivalSec: e,
      distance: distanceRef.current,
      difficulty: diff,
      health: THREE.MathUtils.clamp(healthRef.current, 0, 100),
      shield: THREE.MathUtils.clamp(shieldRef.current, 0, 100),
      boost: THREE.MathUtils.clamp(boostRef.current, 0, 100),
      activePower:
        shieldRef.current > 0
          ? `shield ${Math.round(shieldRef.current)}%`
          : slowT.current > 0
            ? "slow-mo"
            : magnetT.current > 0
              ? "magnet"
              : null,
    });
  }, []);

  const skin = useSpaceArcadeStore((s) => s.equippedSkin);
  const hullColor = SKIN_COLORS[skin];

  useEffect(() => {
    return () => {
      obstacles.current = [];
    };
  }, []);

  useFrame((state, delta) => {
    const hud = useSpaceRunHud.getState();
    if (!runningRef.current) return;
    if (hud.gameOver || hud.paused) return;

    const dt = finiteDelta(delta);
    const camera = state.camera;
    camera.getWorldQuaternion(_camQ);

    const inp = inputRef.current;
    const boostHeld = !!inp.boost;
    const canBoost = boostRef.current > 1.5;
    const boosting = boostHeld && canBoost;
    boostingRef.current = boosting;

    const ax = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const ay = (inp.up ? 1 : 0) - (inp.down ? 1 : 0);
    const accel = SHIP_ACCEL * (boosting ? 1.08 : 1);
    shipVx.current += ax * accel * dt;
    shipVy.current += ay * accel * dt;

    const drag = Math.exp(-SHIP_DRAG * dt);
    shipVx.current *= drag;
    shipVy.current *= drag;

    const vmag = Math.hypot(shipVx.current, shipVy.current);
    if (vmag > SHIP_MAX_SPEED) {
      const k = SHIP_MAX_SPEED / vmag;
      shipVx.current *= k;
      shipVy.current *= k;
    }

    shipX.current = THREE.MathUtils.clamp(shipX.current + shipVx.current * dt, -SHIP_BOUNDS.x, SHIP_BOUNDS.x);
    shipY.current = THREE.MathUtils.clamp(shipY.current + shipVy.current * dt, -SHIP_BOUNDS.y, SHIP_BOUNDS.y);

    if (slowT.current > 0) slowT.current -= dt;
    if (magnetT.current > 0) magnetT.current -= dt;

    if (boosting) {
      boostRef.current = Math.max(0, boostRef.current - BOOST_DRAIN * dt);
    } else {
      boostRef.current = Math.min(100, boostRef.current + BOOST_RECHARGE * dt);
    }

    const slowMul = slowT.current > 0 ? SLOW_MUL : 1;
    const boostMul = boosting ? BOOST_SPEED_MUL : 1;

    elapsed.current += dt;
    const e = elapsed.current;
    const diff = 1 + Math.min(2.2, e * 0.07);
    const baseV = 13 + Math.min(26, e * 0.5);
    const vz = baseV * diff * slowMul * boostMul;
    speedRef.current = vz;
    distanceRef.current += vz * dt * 0.85;

    const arr = obstacles.current;
    spawnM.current += dt;
    spawnC.current += dt;

    if (arr.length < MAX_OBSTACLES) {
      const meteorEvery = Math.max(0.2, 1.0 - e * 0.032);
      const coinEvery = Math.max(0.42, 0.82 - e * 0.017);

      if (spawnM.current >= meteorEvery) {
        spawnM.current = 0;
        const clusterChance = THREE.MathUtils.clamp((e - 12) / 48, 0, 0.58);
        const n = Math.random() < clusterChance ? 2 + (Math.random() < 0.26 ? 1 : 0) : 1;
        for (let i = 0; i < n && arr.length < MAX_OBSTACLES; i++) {
          arr.push({
            id: nextId.current++,
            type: "meteor",
            x: randomRange(-SPAWN_METEOR_X, SPAWN_METEOR_X),
            y: randomRange(-SPAWN_METEOR_Y, SPAWN_METEOR_Y),
            z: -46 - Math.random() * 8,
            vx: randomRange(-0.28, 0.28),
            vy: randomRange(-0.22, 0.22),
            vz: vz * randomRange(0.9, 1.1),
            rx: Math.random() * Math.PI * 2,
            ry: Math.random() * Math.PI * 2,
            rz: Math.random() * Math.PI * 2,
            rs: randomRange(1.1, 2.5),
            scale: randomRange(0.28, 0.72),
            damage: randomRange(11, 23),
            waveX: randomRange(0.12, 0.9),
            waveY: randomRange(0.08, 0.62),
            waveF: randomRange(0.75, 1.85),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      if (spawnC.current >= coinEvery) {
        spawnC.current = 0;
        const roll = Math.random();
        if (roll < 0.055 && magnetT.current <= 0 && slowT.current <= 0 && arr.length < MAX_OBSTACLES) {
          const kinds = ["shield", "slow", "magnet"];
          const power = kinds[Math.floor(Math.random() * kinds.length)];
          arr.push({
            id: nextId.current++,
            type: "power",
            power,
            x: randomRange(-SPAWN_POWER_X, SPAWN_POWER_X),
            y: randomRange(-SPAWN_POWER_Y, SPAWN_POWER_Y),
            z: -40 - Math.random() * 6,
            vx: 0,
            vy: 0,
            vz: vz * 0.94,
            rx: 0,
            ry: 0,
            rz: 0,
            rs: 2.4,
            scale: 0.36,
          });
        } else if (arr.length < MAX_OBSTACLES) {
          const special = Math.random() < 0.13;
          arr.push({
            id: nextId.current++,
            type: "coin",
            special,
            x: randomRange(-SPAWN_COIN_X, SPAWN_COIN_X),
            y: randomRange(-SPAWN_COIN_Y, SPAWN_COIN_Y),
            z: -38 - Math.random() * 10,
            vx: 0,
            vy: 0,
            vz: vz * 0.87,
            rx: 0,
            ry: 0,
            rz: 0,
            rs: 3.6,
            scale: special ? 0.54 : 0.42,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    const sx = shipX.current;
    const sy = shipY.current;
    const magnet = magnetT.current > 0;
    const magnetPull = 6.2 * dt;

    let mi = 0;
    let ci = 0;
    let si = 0;
    let shi = 0;
    let slo = 0;
    let mag = 0;

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
      o.rx += o.rs * dt * 0.68;
      o.ry += o.rs * dt * 0.52;
      o.rz += o.rs * dt * 0.38;

      if (magnet && o.type === "coin") {
        const dx = sx - o.x;
        const dy = sy - o.y;
        const pull = clamp01(magnetPull * (0.65 + Math.hypot(dx, dy) * 0.08));
        o.x += dx * pull;
        o.y += dy * pull;
      }

      let keep = true;

      if (o.z > Z_KILL) {
        keep = false;
      } else {
        const zDepth = Math.abs(o.z);
        if (healthRef.current > 0 && zDepth <= Z_NEAR) {
          const dx = o.x - sx;
          const dy = o.y - sy;
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
                const absorbCap = incoming * 0.72;
                const absorb = Math.min(shieldRef.current, absorbCap);
                shieldRef.current = Math.max(0, shieldRef.current - absorb);
                hpLoss = Math.max(0, hpLoss - absorb * 0.62);
              }
              healthRef.current = Math.max(0, healthRef.current - hpLoss);
              if (healthRef.current <= 0) {
                healthRef.current = 0;
                useSpaceRunHud.getState().setHud({
                  gameOver: true,
                  activePower: null,
                  health: 0,
                  shield: shieldRef.current,
                  boost: boostRef.current,
                  score: Math.floor(e * 2) + coinScore.current,
                  survivalSec: e,
                  distance: distanceRef.current,
                  difficulty: diff,
                });
              }
              keep = false;
            }
          } else if (o.type === "coin") {
            const xyR = o.scale * 0.92 + SHIP_RADIUS * 0.95;
            const zHalf = SHIP_Z_HALF + o.scale * 0.28;
            if (zDepth < zHalf && d2 < xyR * xyR) {
              const pts = o.special ? 35 : 12;
              coinScore.current += pts;
              playCoinSound();
              healthRef.current = Math.min(100, healthRef.current + (o.special ? 8 : 3));
              boostRef.current = Math.min(100, boostRef.current + (o.special ? 16 : 8));
              useSpaceArcadeStore.getState().addWallet(o.special ? 10 : 4);
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
              if (o.power === "shield") shieldRef.current = Math.min(100, shieldRef.current + 40);
              if (o.power === "slow") slowT.current = Math.max(slowT.current, 5);
              if (o.power === "magnet") magnetT.current = Math.max(magnetT.current, 6);
              useSpaceRunHud.getState().setHud({
                activePower: o.power ?? null,
              });
              keep = false;
            }
          }
        }
      }

      if (!keep) continue;

      arr[write++] = o;

      if (o.type === "meteor" && mi < MAX_METEOR_INSTANCES) {
        _p.set(o.x, o.y, o.z);
        _e.set(o.rx, o.ry, o.rz);
        _q.setFromEuler(_e);
        _s.setScalar(o.scale);
        _m.compose(_p, _q, _s);
        meteorIM.current?.setMatrixAt(mi++, _m);
      } else if (o.type === "coin" && !o.special && ci < MAX_COIN_INSTANCES) {
        _p.set(o.x, o.y, o.z);
        _q.copy(_camQ);
        _e.set(o.rx * 0.3, o.ry * 0.3, o.rz * 0.3);
        const spin = new THREE.Quaternion().setFromEuler(_e);
        _q.multiply(spin);
        _s.setScalar(o.scale);
        _m.compose(_p, _q, _s);
        coinIM.current?.setMatrixAt(ci++, _m);
      } else if (o.type === "coin" && o.special && si < MAX_SPEC_INSTANCES) {
        _p.set(o.x, o.y, o.z);
        _q.copy(_camQ);
        _e.set(o.rx * 0.3, o.ry * 0.3, o.rz * 0.3);
        const spin = new THREE.Quaternion().setFromEuler(_e);
        _q.multiply(spin);
        _s.setScalar(o.scale);
        _m.compose(_p, _q, _s);
        specIM.current?.setMatrixAt(si++, _m);
      } else if (o.type === "power" && o.power === "shield" && shi < MAX_SHIELD_INST) {
        _p.set(o.x, o.y, o.z);
        _e.set(o.rx, o.ry, o.rz);
        _q.setFromEuler(_e);
        _s.setScalar(o.scale * 1.05);
        _m.compose(_p, _q, _s);
        const im = shieldIM.current;
        if (im) {
          const idx = shi++;
          im.setMatrixAt(idx, _m);
        }
      } else if (o.type === "power" && o.power === "slow" && slo < MAX_SLOW_INST) {
        _p.set(o.x, o.y, o.z);
        _e.set(o.rx, o.ry, o.rz);
        _q.setFromEuler(_e);
        _s.setScalar(o.scale * 1.1);
        _m.compose(_p, _q, _s);
        const im = slowIM.current;
        if (im) {
          const idx = slo++;
          im.setMatrixAt(idx, _m);
        }
      } else if (o.type === "power" && o.power === "magnet" && mag < MAX_MAGNET_INST) {
        _p.set(o.x, o.y, o.z);
        _e.set(o.rx, o.ry, o.rz + e * 0.8);
        _q.setFromEuler(_e);
        _s.setScalar(o.scale);
        _m.compose(_p, _q, _s);
        const im = magnetIM.current;
        if (im) {
          const idx = mag++;
          im.setMatrixAt(idx, _m);
        }
      }
    }
    arr.length = write;

    if (meteorIM.current) {
      meteorIM.current.count = mi;
      meteorIM.current.instanceMatrix.needsUpdate = true;
    }
    if (coinIM.current) {
      coinIM.current.count = ci;
      coinIM.current.instanceMatrix.needsUpdate = true;
    }
    if (specIM.current) {
      specIM.current.count = si;
      specIM.current.instanceMatrix.needsUpdate = true;
    }
    if (shieldIM.current) {
      shieldIM.current.count = shi;
      shieldIM.current.instanceMatrix.needsUpdate = true;
    }
    if (slowIM.current) {
      slowIM.current.count = slo;
      slowIM.current.instanceMatrix.needsUpdate = true;
    }
    if (magnetIM.current) {
      magnetIM.current.count = mag;
      magnetIM.current.instanceMatrix.needsUpdate = true;
    }

    flush.current += 1;
    if (flush.current % HUD_EVERY === 0) syncHud();

    if (groupRef.current) {
      groupRef.current.position.set(sx, sy, 0);
    }
  });

  return (
    <>
      <RendererSetup />
      <CosmicSkyDome speedRef={speedRef} />
      <CameraRig shipX={shipX} shipY={shipY} shake={shakeRef} speedRef={speedRef} />
      <CinematicLensFlares />
      <DistantGalaxyPlanes />
      <DeepSpaceHighlights />
      <CinematicPlanets />
      <EnemyScoutShip speedRef={speedRef} />

      <color attach="background" args={["#020611"]} />
      <fog attach="fog" args={["#050a19", 26, 210]} />
      <hemisphereLight intensity={0.34} color="#b8c8e8" groundColor="#12081c" />
      <ambientLight intensity={0.16} />
      <directionalLight position={[6, 12, 8]} intensity={1.12} color="#e8e0f5" castShadow={false} />
      <directionalLight position={[-8, 4, -5]} intensity={0.48} color="#6eb0e8" />
      <pointLight position={[0, 1.5, 9]} intensity={0.65} color="#bfdbfe" distance={45} decay={2} />
      <pointLight position={[-4, -2, 4]} intensity={0.28} color="#f9a8d4" distance={38} decay={2} />

      <Stars radius={165} depth={145} count={7600} factor={2.25} saturation={0.08} fade speed={0.22} />

      <group ref={groupRef}>
        <PlayerShipDetailed
          hullColor={hullColor}
          boostingRef={boostingRef}
          shipVxRef={shipVx}
          shipVyRef={shipVy}
          healthRef={healthRef}
        />
      </group>

      <EngineParticles shipX={shipX} shipY={shipY} boostingRef={boostingRef} runningRef={runningRef} />

      <instancedMesh ref={meteorIM} args={[meteorGeom, meteorMat, MAX_METEOR_INSTANCES]} frustumCulled={false} />
      <instancedMesh ref={coinIM} args={[starGeom, coinMatGold, MAX_COIN_INSTANCES]} frustumCulled={false} />
      <instancedMesh ref={specIM} args={[starGeom, coinMatSilver, MAX_SPEC_INSTANCES]} frustumCulled={false} />
      <instancedMesh ref={shieldIM} args={[crystalGeom, shieldMat, MAX_SHIELD_INST]} frustumCulled={false} />
      <instancedMesh ref={slowIM} args={[slowStarGeom, slowMat, MAX_SLOW_INST]} frustumCulled={false} />
      <instancedMesh ref={magnetIM} args={[magnetGeom, magnetMat, MAX_MAGNET_INST]} frustumCulled={false} />

      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.62} luminanceSmoothing={0.35} mipmapBlur intensity={0.2} radius={0.36} />
      </EffectComposer>
    </>
  );
}
