import { useRef, useMemo, useEffect, useLayoutEffect, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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
const SHIP_ACCEL = 180;
const SHIP_MAX_SPEED = 38;
const SHIP_DRAG = 6.2;
const BOOST_DRAIN = 34;
const BOOST_RECHARGE = 11;
const BOOST_SPEED_MUL = 2.45;
const SLOW_MUL = 0.52;
const HUD_EVERY = 5;

const _m = new THREE.Matrix4();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();
const _camQ = new THREE.Quaternion();
const _powerCol = new THREE.Color();
const TEXTURE_LOADING_MANAGER = new THREE.LoadingManager();
const TEXTURE_CACHE = new Map();
const GEOMETRY_CACHE = new Map();

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

function resetObstacleObject(o) {
  o.id = 0;
  o.type = "meteor";
  o.power = null;
  o.special = false;
  o.x = 0;
  o.y = 0;
  o.z = 0;
  o.vx = 0;
  o.vy = 0;
  o.vz = 0;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.rs = 0;
  o.scale = 0;
  o.damage = 0;
  o.waveX = 0;
  o.waveY = 0;
  o.waveF = 0;
  o.phase = 0;
  return o;
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

function createProceduralRoughnessTexture(seed = 1) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#8f8f8f";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const x = (Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
    const y = (Math.cos(i * 78.233 + seed) * 12345.678) % 1;
    const n = 110 + Math.floor((i * 37 + seed * 53) % 110);
    g.fillStyle = `rgb(${n},${n},${n})`;
    g.fillRect(((x + 1) % 1) * 256, ((y + 1) % 1) * 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createProceduralNormalTexture(seed = 1) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "rgb(128,128,255)";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2200; i++) {
    const x = ((Math.sin(i * 0.37 + seed) + 1) * 0.5) * 256;
    const y = ((Math.cos(i * 0.53 + seed) + 1) * 0.5) * 256;
    const nx = 110 + Math.floor((Math.sin(i * 1.11 + seed) + 1) * 32);
    const ny = 110 + Math.floor((Math.cos(i * 1.37 + seed) + 1) * 32);
    g.fillStyle = `rgb(${nx},${ny},255)`;
    g.fillRect(x, y, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createShipHullPanelTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createLinearGradient(0, 0, 256, 256);
  grd.addColorStop(0, "#d9e1ea");
  grd.addColorStop(0.5, "#a7b4c5");
  grd.addColorStop(1, "#6b7c91");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "rgba(15,23,42,0.35)";
  g.lineWidth = 2;
  for (let i = 0; i <= 8; i++) {
    const p = i * 32;
    g.beginPath();
    g.moveTo(p, 0);
    g.lineTo(p, 256);
    g.stroke();
    g.beginPath();
    g.moveTo(0, p);
    g.lineTo(256, p);
    g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.15)";
  for (let i = 0; i < 180; i++) {
    g.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
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

function createCoinSpriteFallbackTexture(kind = "gold") {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  g.clearRect(0, 0, 256, 256);
  const outer = g.createRadialGradient(128, 128, 12, 128, 128, 112);
  if (kind === "silver") {
    outer.addColorStop(0, "rgba(255,255,255,1)");
    outer.addColorStop(0.45, "rgba(220,230,240,0.98)");
    outer.addColorStop(0.78, "rgba(148,163,184,0.95)");
    outer.addColorStop(1, "rgba(100,116,139,0.0)");
  } else {
    outer.addColorStop(0, "rgba(255,255,220,1)");
    outer.addColorStop(0.45, "rgba(251,191,36,0.98)");
    outer.addColorStop(0.78, "rgba(217,119,6,0.95)");
    outer.addColorStop(1, "rgba(146,64,14,0.0)");
  }
  g.fillStyle = outer;
  g.beginPath();
  g.arc(128, 128, 112, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = kind === "silver" ? "rgba(226,232,240,0.85)" : "rgba(254,240,138,0.9)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(128, 128, 74, 0, Math.PI * 2);
  g.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function loadCoinSpriteTexture(path, kind = "gold") {
  if (TEXTURE_CACHE.has(path)) return TEXTURE_CACHE.get(path);
  const fallback = createCoinSpriteFallbackTexture(kind);
  if (!fallback) return null;
  try {
    const loader = new THREE.TextureLoader(TEXTURE_LOADING_MANAGER);
    loader.load(
      path,
      (loaded) => {
        if (!loaded?.image) return;
        fallback.image = loaded.image;
        fallback.needsUpdate = true;
      },
      undefined,
      () => {
        // Keep fallback if PNG is missing or fails to decode.
      }
    );
  } catch {
    // Keep fallback.
  }
  TEXTURE_CACHE.set(path, fallback);
  return fallback;
}

function preloadGameTextures() {
  const loader = new THREE.TextureLoader(TEXTURE_LOADING_MANAGER);
  ["/textures/space-run/coin-3d.png", "/textures/space-run/coin-special-3d.png"].forEach((path) => {
    if (TEXTURE_CACHE.has(path)) return;
    loader.load(
      path,
      (loaded) => {
        if (!loaded) return;
        loaded.colorSpace = THREE.SRGBColorSpace;
        TEXTURE_CACHE.set(path, loaded);
      },
      undefined,
      () => {
        // Leave fallback handling to call sites.
      }
    );
  });
}

function loadTextureCached(path, isColor = false) {
  if (!path) return null;
  if (TEXTURE_CACHE.has(path)) return TEXTURE_CACHE.get(path);
  const tex = new THREE.TextureLoader(TEXTURE_LOADING_MANAGER).load(path);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  TEXTURE_CACHE.set(path, tex);
  return tex;
}

function firstMeshGeometry(root) {
  let found = null;
  root?.traverse?.((obj) => {
    if (!found && obj?.isMesh && obj.geometry) found = obj.geometry;
  });
  return found;
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

  vec3 deep = vec3(0.012, 0.02, 0.065);
  vec3 blueCorner = vec3(0.018, 0.04, 0.11);
  vec3 purplePink = vec3(0.055, 0.02, 0.085);
  vec3 violetWash = vec3(0.038, 0.018, 0.065);

  float rightUp = smoothstep(0.15, 0.92, (dir.x * 0.52 + 0.5) * (h + 0.12));
  float leftMagenta = smoothstep(0.12, 0.88, (0.5 - dir.x * 0.58) * (1.08 - h * 0.32));
  vec3 base = mix(deep, blueCorner, rightUp * 0.68);
  base = mix(base, purplePink, leftMagenta * (0.5 + 0.32 * n1));
  base = mix(base, violetWash, smoothstep(0.22, 0.86, n2) * 0.5);
  base += vec3(0.03, 0.015, 0.05) * fbm(dir.xz * 4.2 + dir.y + uTime * 0.0012) * 0.12;

  float stars = starField(dir) * 0.46;
  vec3 col = base + vec3(stars);

  float vign = 1.0 - length(uv - 0.5) * 0.72;
  col *= 0.3 + 0.28 * vign;

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

function DistantFleet({ speedRef }) {
  const fleetRef = useRef(null);
  useFrame((state, delta) => {
    const dt = finiteDelta(delta);
    if (!fleetRef.current) return;
    const t = state.clock.elapsedTime;
    const speed = speedRef?.current ?? 16;
    fleetRef.current.position.x = -38 + Math.sin(t * 0.09) * 4.2;
    fleetRef.current.position.y = -8.5 + Math.cos(t * 0.11) * 1.4;
    fleetRef.current.position.z = -132 - (speed * 0.24) + Math.sin(t * 0.07) * 3.5;
    fleetRef.current.rotation.y = -0.12 + Math.sin(t * 0.15) * 0.04;
    fleetRef.current.children.forEach((ship, i) => {
      ship.rotation.z = Math.sin(t * 0.9 + i) * 0.05;
      ship.position.y += Math.sin(t * 0.35 + i * 1.7) * dt * 0.08;
    });
  });
  return (
    <group ref={fleetRef} scale={0.55}>
      {[
        [0, 0, 0],
        [1.4, 0.35, -0.8],
        [-1.3, -0.25, 0.5],
        [0.4, -0.45, 1.2],
      ].map((p, i) => (
        <group key={i} position={p}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.16, 0.96, 5, 1]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.2} emissive="#94a3b8" emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.36]}>
            <boxGeometry args={[0.5, 0.04, 0.18]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.65} metalness={0.35} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BlackHoleAnomaly({ speedRef }) {
  const g = useRef(null);
  const disk = useRef(null);
  const lens = useRef(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const v = (speedRef?.current ?? 16) * 0.02;
    if (g.current) {
      g.current.position.set(108, 40, -176 + Math.sin(t * 0.07) * 4.8);
      g.current.rotation.y = Math.sin(t * 0.08) * 0.12;
    }
    if (disk.current) disk.current.rotation.z = t * 0.22 + v * 0.06;
    if (lens.current) lens.current.rotation.z = -t * 0.11;
  });
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[24, 88, 64]} />
        <meshPhysicalMaterial color="#030208" emissive="#05040a" emissiveIntensity={0.14} roughness={1} metalness={0} transmission={0.04} thickness={2.5} />
      </mesh>
      <mesh ref={disk} rotation={[Math.PI / 2.9, 0.08, 0]}>
        <torusGeometry args={[39, 8.8, 24, 180]} />
        <meshPhysicalMaterial color="#f59e0b" emissive="#fb923c" emissiveIntensity={2.45} roughness={0.24} metalness={0.18} clearcoat={0.35} clearcoatRoughness={0.2} />
      </mesh>
      <mesh ref={lens} rotation={[Math.PI / 2.9, 0.08, 0]} scale={[1.35, 1.18, 1.35]}>
        <ringGeometry args={[31, 52, 120]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.9, 0.08, 0]} scale={[1.65, 1.42, 1.65]}>
        <ringGeometry args={[28, 58, 120]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function StarMotionLines({ speedRef }) {
  const ref = useRef(null);
  const N = 150;
  const pos = useMemo(() => new Float32Array(N * 6), []);
  const vel = useMemo(() => new Float32Array(N), []);
  const baseLen = useMemo(() => new Float32Array(N), []);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);
  useEffect(() => {
    return () => {
      geom.dispose();
    };
  }, [geom]);

  useEffect(() => {
    for (let i = 0; i < N; i++) {
      const i6 = i * 6;
      const x = randomRange(-20, 20);
      const y = randomRange(-10, 14);
      const z = randomRange(-160, -18);
      const len = randomRange(0.65, 1.7);
      baseLen[i] = len;
      pos[i6] = x;
      pos[i6 + 1] = y;
      pos[i6 + 2] = z;
      pos[i6 + 3] = x;
      pos[i6 + 4] = y;
      pos[i6 + 5] = z - len;
      vel[i] = randomRange(18, 42);
    }
  }, [N, pos, vel, baseLen]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = finiteDelta(delta);
    const speed = speedRef?.current ?? 16;
    const speedMul = 0.34 + (speed / 24) * 0.72;
    const att = ref.current.geometry.getAttribute("position");
    for (let i = 0; i < N; i++) {
      const i6 = i * 6;
      pos[i6 + 2] += vel[i] * speedMul * dt;
      const stretch = THREE.MathUtils.clamp(1 + speed * 0.028, 1, 2.8);
      pos[i6 + 5] = pos[i6 + 2] - baseLen[i] * stretch;
      if (pos[i6 + 2] > -6) {
        const x = randomRange(-20, 20);
        const y = randomRange(-10, 14);
        const z = randomRange(-170, -132);
        const len = randomRange(0.65, 1.9);
        baseLen[i] = len;
        pos[i6] = x;
        pos[i6 + 1] = y;
        pos[i6 + 2] = z;
        pos[i6 + 3] = x;
        pos[i6 + 4] = y;
        pos[i6 + 5] = z - len;
      }
    }
    att.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color="#9bb8ff" transparent opacity={0.34} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

function LeftAsteroidCluster() {
  const rockMap = useMemo(() => createCraterCanvasTexture(11), []);
  const g = useRef(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!g.current) return;
    g.current.rotation.y = t * 0.035;
    g.current.position.z = -136 + Math.sin(t * 0.08) * 2.4;
  });
  return (
    <group ref={g} position={[-54, 16, -136]}>
      {[
        [0, 0, 0, 2.6],
        [2.2, 1.1, -1.3, 1.5],
        [-2.4, -0.8, 0.9, 1.1],
        [1.4, -1.6, 1.4, 0.9],
        [-1.1, 1.8, -0.5, 0.8],
      ].map((a, i) => (
        <mesh key={i} position={[a[0], a[1], a[2]]} scale={a[3]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial map={rockMap} color="#8b6a4e" roughness={0.92} metalness={0.05} emissive="#2d1b0f" emissiveIntensity={0.05} />
        </mesh>
      ))}
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
      sail.current.position.set(18 + Math.sin(t * v * 0.22 + 2) * 5, -10 + Math.cos(t * v * 0.19) * 1.8, -86);
    }
    if (comet.current) {
      const u = (t * v * 2.4) % 140;
      comet.current.position.set(-55 + u * 0.85, -8 + Math.sin(u * 0.09) * 2.2, -96);
      comet.current.rotation.z = t * 0.12;
    }
    if (gate.current) {
      gate.current.rotation.z = t * 0.11;
      gate.current.rotation.y = t * 0.05;
      gate.current.position.set(-12 + Math.sin(t * v * 0.18 + 0.7) * 4, -9 + Math.cos(t * v * 0.16) * 1.4, -78);
    }
  });

  return (
    <group>
      <group ref={sats} position={[-22, -7, -90]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          const r = 3.2 + (i % 2) * 0.6;
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 0.9) * 0.8, Math.sin(a) * 0.5]} rotation={[0.2, a, 0.1]}>
              <boxGeometry args={[0.35, 0.06, 0.9]} />
              <meshStandardMaterial
                color="#e2e8f0"
                emissive={i % 2 === 0 ? "#38bdf8" : "#a78bfa"}
                emissiveIntensity={0.22}
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
            emissiveIntensity={0.18}
            metalness={0.6}
            roughness={0.25}
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh rotation={[0, 0, -0.25]}>
          <planeGeometry args={[2.8, 4.2]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fcd34d"
            emissiveIntensity={0.1}
            metalness={0.5}
            roughness={0.3}
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
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
          <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.2} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.35, 1.8, 12, 1, true]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={gate} scale={1.15}>
        <mesh rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[2.4, 0.06, 8, 48]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.45} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]} scale={0.72}>
          <torusGeometry args={[2.4, 0.04, 8, 40]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.24} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]}>
          <ringGeometry args={[1.15, 1.35, 32]} />
          <meshBasicMaterial color="#ddd6fe" transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
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
  const earthMap = useMemo(() => createEarthCanvasTexture(), []);
  const gasGreenMap = useMemo(() => createGasGiantGreenTexture(), []);
  const cloudMap = useMemo(() => createCloudCanvasTexture(), []);
  const sunMap = useMemo(() => createCraterCanvasTexture(3), []);
  const marsRough = useMemo(() => createProceduralRoughnessTexture(11), []);
  const marsNormal = useMemo(() => createProceduralNormalTexture(12), []);
  const gasRough = useMemo(() => createProceduralRoughnessTexture(21), []);
  const gasNormal = useMemo(() => createProceduralNormalTexture(22), []);
  const earthRough = useMemo(() => createProceduralRoughnessTexture(31), []);
  const earthNormal = useMemo(() => createProceduralNormalTexture(32), []);
  const sunRough = useMemo(() => createProceduralRoughnessTexture(41), []);
  const sunNormal = useMemo(() => createProceduralNormalTexture(42), []);
  const nsSun = useMemo(() => new THREE.Vector2(0.3, 0.3), []);
  const nsMars = useMemo(() => new THREE.Vector2(0.35, 0.35), []);
  const nsSaturn = useMemo(() => new THREE.Vector2(0.2, 0.2), []);
  const nsGas = useMemo(() => new THREE.Vector2(0.2, 0.2), []);
  const nsEarth = useMemo(() => new THREE.Vector2(0.28, 0.28), []);
  const sunRef = useRef(null);
  const saturnRef = useRef(null);
  const earthRef = useRef(null);
  const cloudRef = useRef(null);
  const gasRef = useRef(null);
  const marsG = useRef(null);
  const ringG = useRef(null);
  const gasG = useRef(null);
  const earthG = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dt = finiteDelta(state.clock.getDelta());
    const v = PLANET_DRIFT_U_S;

    if (sunRef.current) sunRef.current.rotation.y += dt * 0.03;
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.055;
    if (gasRef.current) gasRef.current.rotation.y += dt * 0.038;
    if (saturnRef.current) saturnRef.current.rotation.y += dt * 0.02;
    if (cloudRef.current) {
      cloudRef.current.rotation.y += dt * 0.08;
      if (cloudRef.current.material.map) {
        cloudRef.current.material.map.offset.x = t * 0.012;
      }
    }

    const baseX = -74;
    const baseY = 2;
    const baseZ = -178;
    const wM = v / 12;
    const wG = v / 9;
    const wE = v / 8;
    const wRing = v / 11;

    if (marsG.current) {
      marsG.current.position.set(
        baseX + Math.sin(t * wM + 0.3) * 16,
        baseY + 8 + Math.cos(t * wM * 0.82 + 1.1) * 4.8,
        baseZ + Math.cos(t * wM * 0.55) * 15
      );
      marsG.current.rotation.y += dt * 0.022;
    }
    if (ringG.current) {
      ringG.current.position.set(
        baseX + 22 + Math.sin(t * wRing + 2.2) * 18,
        baseY + 12 + Math.cos(t * wRing * 0.76) * 4.2,
        baseZ + 9 + Math.sin(t * wRing * 0.4) * 16
      );
      ringG.current.rotation.z = 0.55 + Math.sin(t * wRing * 0.5) * 0.06;
    }
    if (gasG.current) {
      gasG.current.position.set(
        baseX + 42 + Math.sin(t * wG + 4.1) * 24,
        baseY + 3 + Math.cos(t * wG * 0.88 + 0.4) * 5,
        baseZ + 26 + Math.cos(t * wG * 0.48) * 20
      );
    }
    if (earthG.current) {
      earthG.current.position.set(
        baseX + 8 + Math.sin(t * wE + 1.7) * 15,
        baseY - 4 + Math.cos(t * wE * 0.85 + 3.3) * 4.1,
        baseZ + 18 + Math.cos(t * wE * 0.5) * 14
      );
      earthG.current.rotation.y += dt * 0.018;
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
      <group position={[-74, 3, -178]}>
        <mesh ref={sunRef} scale={68}>
          <sphereGeometry args={[1, 96, 72]} />
          <meshPhongMaterial map={sunMap} normalMap={sunNormal ?? undefined} normalScale={nsSun} color="#ffd776" emissive="#ff8a00" emissiveIntensity={1.95} specular="#fef3c7" shininess={22} />
        </mesh>
        <mesh scale={76}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.26} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      </group>

      <group ref={marsG} scale={14.4}>
        <mesh>
          <sphereGeometry args={[1, 64, 48]} />
          <meshPhongMaterial map={marsMap} normalMap={marsNormal ?? undefined} normalScale={nsMars} shininess={10} specular="#6b4a3b" emissive="#d4622a" emissiveIntensity={0.1} />
        </mesh>
        <mesh scale={1.03}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshBasicMaterial color="#ff8a5c" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <mesh scale={1.08}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshBasicMaterial color="#fca5a5" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      </group>

      <group ref={ringG} rotation={[0.25, 0.1, -0.1]}>
        <group ref={saturnRef} scale={13.2}>
          <mesh>
            <sphereGeometry args={[1, 64, 48]} />
            <meshPhongMaterial map={gasGreenMap} normalMap={gasNormal ?? undefined} normalScale={nsSaturn} shininess={14} specular="#c9d8a6" emissive="#6b8f3a" emissiveIntensity={0.06} />
          </mesh>
          <mesh rotation={[Math.PI / 2.65, 0, 0]}>
            <ringGeometry args={[1.35, 2.75, 128]} />
            <meshStandardMaterial color="#dccca7" transparent opacity={0.72} side={THREE.DoubleSide} roughness={0.34} metalness={0.18} />
          </mesh>
          <mesh rotation={[Math.PI / 2.65, 0, 0]}>
            <ringGeometry args={[2.78, 3.18, 128]} />
            <meshBasicMaterial color="#f5deb3" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      </group>

      <group ref={gasG} scale={11.2}>
        <mesh ref={gasRef}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshPhongMaterial map={gasGreenMap} normalMap={gasNormal ?? undefined} normalScale={nsGas} shininess={16} specular="#9bd5d1" emissive="#355e5a" emissiveIntensity={0.04} />
        </mesh>
        <mesh scale={1.025}>
          <sphereGeometry args={[1, 40, 32]} />
          <meshBasicMaterial color="#86efac" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      </group>

      <group ref={earthG} scale={8.6}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshPhongMaterial map={earthMap} normalMap={earthNormal ?? undefined} normalScale={nsEarth} shininess={28} specular="#cbd5e1" emissive="#1e3a5f" emissiveIntensity={0.04} />
        </mesh>
        <mesh ref={cloudRef} scale={1.018}>
          <sphereGeometry args={[1, 48, 40]} />
          <primitive object={cloudMat} attach="material" />
        </mesh>
        <mesh scale={1.06}>
          <sphereGeometry args={[1, 48, 40]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
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
  const hullMap = useMemo(() => createShipHullPanelTexture(), []);
  useEffect(() => {
    return () => {
      hullMap?.dispose?.();
    };
  }, [hullMap]);
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
    <group ref={rootRef} scale={2.35}>
      <group rotation={[0, Math.PI, 0]}>
      {/* External tank — central rust column */}
      <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.95, 20]} />
        <meshStandardMaterial map={hullMap ?? undefined} color={etRust} roughness={0.62} metalness={0.22} emissive={etFoam} emissiveIntensity={0.04} />
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
          <meshStandardMaterial map={hullMap ?? undefined} color={orbiterWhite} roughness={0.3} metalness={0.72} />
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
        <coneGeometry args={[0.15, 1.15, 14, 1, true]} />
        <meshBasicMaterial color="#fef9c3" transparent opacity={0.68} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={thrR} position={[0.26, 0, -0.68]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 1.15, 14, 1, true]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.68} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={thrC} position={[0, 0, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 1.35, 16, 1, true]} />
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
  // Late update so camera follows fully-resolved ship movement each frame.
  useFrame((_, delta) => {
    const dt = finiteDelta(delta);
    const speedLag = THREE.MathUtils.clamp((speedRef.current - 16) * 0.05, 0, 1.85);
    camTarget.set(shipX.current * 0.44, shipY.current * 0.48 + 2.8, 12.8 - speedLag * 0.52);
    camera.position.lerp(camTarget, 1 - Math.exp(-5.5 * dt));
    if (shake.current > 0) {
      shake.current = Math.max(0, shake.current - dt * 4.2);
      const amp = shake.current * 0.2;
      camera.position.x += (Math.random() - 0.5) * amp;
      camera.position.y += (Math.random() - 0.5) * amp;
      camera.position.z += (Math.random() - 0.5) * amp * 0.45;
    }
    lookTarget.set(shipX.current * 0.2, shipY.current * 0.2, -20.0 - speedLag * 0.75);
    camera.lookAt(lookTarget);
    if (camera instanceof THREE.PerspectiveCamera) {
      const speedNorm = clamp01((speedRef.current - 13) / 35);
      const targetFov = 60 + speedNorm * 25;
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
      camera.updateProjectionMatrix();
    }
  }, 1);
  return null;
}

function RendererSetup() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.98;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
}

function EngineParticles({ shipX, shipY, boostingRef, runningRef, speedRef }) {
  const ref = useRef(null);
  const matRef = useRef(null);
  const N = 124;
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
      geom.dispose();
    };
  }, [geom, spriteTex]);

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
    const speedFactor = THREE.MathUtils.clamp((speedRef?.current ?? 16) / 16, 1, 3.4);

    if (matRef.current) {
      matRef.current.opacity = b ? 0.9 : 0.72;
      matRef.current.size = b ? 0.15 : 0.11;
    }
    const emit = 32 + b * 54;

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
      const zMin = b ? 0.24 : 0.34;
      const zMax = b ? 1.15 : 0.86;
      positions[i3 + 2] = randomRange(zMin, zMax);
      velocities[i3] = randomRange(-0.12, 0.12);
      velocities[i3 + 1] = randomRange(-0.1, 0.1);
      const vzMin = (b ? 6.2 : 4.2) * speedFactor;
      const vzMax = (b ? 10.8 : 7.2) * speedFactor;
      velocities[i3 + 2] = randomRange(vzMin, vzMax) + b * 7.5;
    }

    const att = mesh.geometry.getAttribute("position");
    for (let i = 0; i < N; i++) {
      if (ages[i] > 900) continue;
      ages[i] += dt;
      const i3 = i * 3;
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;
      velocities[i3 + 2] -= dt * (b ? 1.05 : 1.5);
      if (ages[i] > (b ? 0.9 : 0.72)) ages[i] = 999;
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
  const obstaclePool = useRef([]);
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
  const [modelGeometries, setModelGeometries] = useState(null);

  const meteorFallbackGeom = useMemo(() => createRockAsteroidGeometry(), []);
  const coinFallbackGeom = useMemo(() => new THREE.CylinderGeometry(0.42, 0.42, 0.12, 48), []);
  const specCoinFallbackGeom = useMemo(() => new THREE.CylinderGeometry(0.48, 0.48, 0.14, 48), []);
  const crystalFallbackGeom = useMemo(() => createCrystalFlowerGeometry(), []);
  const slowFallbackGeom = useMemo(() => new THREE.IcosahedronGeometry(0.48, 0), []);
  const magnetFallbackGeom = useMemo(() => createMagnetMergeGeometry(), []);

  const shieldColorMap = useMemo(() => loadTextureCached("/models/space-run/powerup-shield/albedo.jpg", true), []);
  const shieldNormalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-shield/normal.jpg"), []);
  const shieldRoughMap = useMemo(() => loadTextureCached("/models/space-run/powerup-shield/roughness.jpg"), []);
  const shieldMetalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-shield/metalness.jpg"), []);
  const slowColorMap = useMemo(() => loadTextureCached("/models/space-run/powerup-slow/albedo.jpg", true), []);
  const slowNormalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-slow/normal.jpg"), []);
  const slowRoughMap = useMemo(() => loadTextureCached("/models/space-run/powerup-slow/roughness.jpg"), []);
  const slowMetalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-slow/metalness.jpg"), []);
  const magnetColorMap = useMemo(() => loadTextureCached("/models/space-run/powerup-magnet/albedo.jpg", true), []);
  const magnetNormalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-magnet/normal.jpg"), []);
  const magnetRoughMap = useMemo(() => loadTextureCached("/models/space-run/powerup-magnet/roughness.jpg"), []);
  const magnetMetalMap = useMemo(() => loadTextureCached("/models/space-run/powerup-magnet/metalness.jpg"), []);
  const asteroidColorMap = useMemo(() => loadTextureCached("/models/space-run/asteroid/albedo.jpg", true), []);
  const asteroidNormalMap = useMemo(() => loadTextureCached("/models/space-run/asteroid/normal.jpg"), []);
  const asteroidRoughMap = useMemo(() => loadTextureCached("/models/space-run/asteroid/roughness.jpg"), []);
  const asteroidMetalMap = useMemo(() => loadTextureCached("/models/space-run/asteroid/metalness.jpg"), []);
  const coinColorMap = useMemo(() => loadTextureCached("/models/space-run/coin/albedo.jpg", true), []);
  const coinNormalMap = useMemo(() => loadTextureCached("/models/space-run/coin/normal.jpg"), []);
  const coinRoughMap = useMemo(() => loadTextureCached("/models/space-run/coin/roughness.jpg"), []);
  const coinMetalMap = useMemo(() => loadTextureCached("/models/space-run/coin/metalness.jpg"), []);
  const specCoinColorMap = useMemo(() => loadTextureCached("/models/space-run/coin-special/albedo.jpg", true), []);
  const specCoinNormalMap = useMemo(() => loadTextureCached("/models/space-run/coin-special/normal.jpg"), []);
  const specCoinRoughMap = useMemo(() => loadTextureCached("/models/space-run/coin-special/roughness.jpg"), []);
  const specCoinMetalMap = useMemo(() => loadTextureCached("/models/space-run/coin-special/metalness.jpg"), []);

  const shieldMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#c4b5fd",
        map: shieldColorMap ?? undefined,
        normalMap: shieldNormalMap ?? undefined,
        roughnessMap: shieldRoughMap ?? undefined,
        metalnessMap: shieldMetalMap ?? undefined,
        emissive: "#7c3aed",
        emissiveIntensity: 0.8,
        metalness: 0.45,
        roughness: 0.28,
        clearcoat: 0.25,
        clearcoatRoughness: 0.22,
      }),
    [shieldColorMap, shieldMetalMap, shieldNormalMap, shieldRoughMap]
  );
  const slowMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e2e8f0",
        map: slowColorMap ?? undefined,
        normalMap: slowNormalMap ?? undefined,
        roughnessMap: slowRoughMap ?? undefined,
        metalnessMap: slowMetalMap ?? undefined,
        emissive: "#94a3b8",
        emissiveIntensity: 0.35,
        metalness: 0.78,
        roughness: 0.24,
        clearcoat: 0.18,
        clearcoatRoughness: 0.24,
      }),
    [slowColorMap, slowMetalMap, slowNormalMap, slowRoughMap]
  );
  const magnetMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#e2e8f0",
      map: magnetColorMap ?? undefined,
      normalMap: magnetNormalMap ?? undefined,
      roughnessMap: magnetRoughMap ?? undefined,
      metalnessMap: magnetMetalMap ?? undefined,
      metalness: 0.78,
      roughness: 0.28,
      emissive: "#16a34a",
      emissiveIntensity: 0.4,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
    });
  }, [magnetColorMap, magnetMetalMap, magnetNormalMap, magnetRoughMap]);

  const meteorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7c5c3e",
        map: asteroidColorMap ?? undefined,
        normalMap: asteroidNormalMap ?? undefined,
        roughnessMap: asteroidRoughMap ?? undefined,
        metalnessMap: asteroidMetalMap ?? undefined,
        roughness: 0.95,
        metalness: 0.05,
        emissive: "#3d2918",
        emissiveIntensity: 0.04,
      }),
    [asteroidColorMap, asteroidMetalMap, asteroidNormalMap, asteroidRoughMap]
  );
  const coinMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#fef08a",
        map: coinColorMap ?? undefined,
        normalMap: coinNormalMap ?? undefined,
        roughnessMap: coinRoughMap ?? undefined,
        metalnessMap: coinMetalMap ?? undefined,
        metalness: 0.96,
        roughness: 0.12,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
        emissive: "#f59e0b",
        emissiveIntensity: 0.08,
      }),
    [coinColorMap, coinMetalMap, coinNormalMap, coinRoughMap]
  );
  const specCoinMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e2e8f0",
        map: specCoinColorMap ?? undefined,
        normalMap: specCoinNormalMap ?? undefined,
        roughnessMap: specCoinRoughMap ?? undefined,
        metalnessMap: specCoinMetalMap ?? undefined,
        metalness: 0.9,
        roughness: 0.16,
        clearcoat: 0.55,
        clearcoatRoughness: 0.12,
        emissive: "#93c5fd",
        emissiveIntensity: 0.1,
      }),
    [specCoinColorMap, specCoinMetalMap, specCoinNormalMap, specCoinRoughMap]
  );
  const acquireObstacle = useCallback(() => {
    const pool = obstaclePool.current;
    if (pool.length > 0) return pool.pop();
    return resetObstacleObject({});
  }, []);
  const releaseObstacle = useCallback((o) => {
    obstaclePool.current.push(resetObstacleObject(o));
  }, []);
  const meteorGeom = modelGeometries?.meteor ?? meteorFallbackGeom;
  const coinGeom = modelGeometries?.coin ?? coinFallbackGeom;
  const specCoinGeom = modelGeometries?.specCoin ?? specCoinFallbackGeom;
  const crystalGeom = modelGeometries?.shield ?? crystalFallbackGeom;
  const slowStarGeom = modelGeometries?.slow ?? slowFallbackGeom;
  const magnetGeom = modelGeometries?.magnet ?? magnetFallbackGeom;

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader(TEXTURE_LOADING_MANAGER);
    const modelDefs = [
      ["meteor", "/models/space-run/asteroid/asteroid.glb", meteorFallbackGeom, 0.65],
      ["coin", "/models/space-run/coin/coin.glb", coinFallbackGeom, 0.58],
      ["specCoin", "/models/space-run/coin-special/coin-special.glb", specCoinFallbackGeom, 0.62],
      ["shield", "/models/space-run/powerup-shield/powerup-shield.glb", crystalFallbackGeom, 0.55],
      ["slow", "/models/space-run/powerup-slow/powerup-slow.glb", slowFallbackGeom, 0.55],
      ["magnet", "/models/space-run/powerup-magnet/powerup-magnet.glb", magnetFallbackGeom, 0.55],
    ];
    const loadOne = ([key, path, fallback, scale]) =>
      new Promise((resolve) => {
        if (GEOMETRY_CACHE.has(path)) {
          resolve([key, GEOMETRY_CACHE.get(path)]);
          return;
        }
        loader.load(
          path,
          (gltf) => {
            const src = firstMeshGeometry(gltf.scene) ?? fallback;
            const next = src.clone();
            next.scale(scale, scale, scale);
            next.computeVertexNormals();
            GEOMETRY_CACHE.set(path, next);
            resolve([key, next]);
          },
          undefined,
          () => resolve([key, fallback])
        );
      });
    Promise.all(modelDefs.map(loadOne)).then((pairs) => {
      if (cancelled) return;
      setModelGeometries(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [coinFallbackGeom, crystalFallbackGeom, magnetFallbackGeom, meteorFallbackGeom, slowFallbackGeom, specCoinFallbackGeom]);

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
    preloadGameTextures();
    const setCullSphere = (im, radius) => {
      if (!im) return;
      im.frustumCulled = true;
      im.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -24), radius);
    };
    setCullSphere(meteorIM.current, 96);
    setCullSphere(coinIM.current, 90);
    setCullSphere(specIM.current, 90);
    setCullSphere(shieldIM.current, 84);
    setCullSphere(slowIM.current, 84);
    setCullSphere(magnetIM.current, 84);
    return () => {
      obstacles.current = [];
      obstaclePool.current = [];
      meteorFallbackGeom.dispose();
      coinFallbackGeom.dispose();
      specCoinFallbackGeom.dispose();
      crystalFallbackGeom.dispose();
      slowFallbackGeom.dispose();
      magnetFallbackGeom.dispose();
      shieldMat.dispose();
      slowMat.dispose();
      magnetMat.dispose();
      meteorMat.dispose();
      coinMat.dispose();
      specCoinMat.dispose();
    };
  }, [coinFallbackGeom, coinMat, crystalFallbackGeom, magnetFallbackGeom, magnetMat, meteorFallbackGeom, meteorMat, shieldMat, slowFallbackGeom, slowMat, specCoinFallbackGeom, specCoinMat]);

  useFrame((state, delta) => {
    const hud = useSpaceRunHud.getState();
    if (!runningRef.current) return;
    if (hud.gameOver || hud.paused) return;

    try {
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
    const pulse = 0.65 + Math.sin(e * 3.4) * 0.25;
    shieldMat.emissiveIntensity = 0.6 + pulse * 0.35;
    slowMat.emissiveIntensity = 0.22 + pulse * 0.22;
    magnetMat.emissiveIntensity = 0.28 + pulse * 0.34;
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
          const o = acquireObstacle();
          o.id = nextId.current++;
          o.type = "meteor";
          o.power = null;
          o.special = false;
          o.x = randomRange(-SPAWN_METEOR_X, SPAWN_METEOR_X);
          o.y = randomRange(-SPAWN_METEOR_Y, SPAWN_METEOR_Y);
          o.z = -46 - Math.random() * 8;
          o.vx = randomRange(-0.28, 0.28);
          o.vy = randomRange(-0.22, 0.22);
          o.vz = vz * randomRange(0.9, 1.1);
          o.rx = Math.random() * Math.PI * 2;
          o.ry = Math.random() * Math.PI * 2;
          o.rz = Math.random() * Math.PI * 2;
          o.rs = randomRange(1.1, 2.5);
          o.scale = randomRange(0.28, 0.72);
          o.damage = randomRange(11, 23);
          o.waveX = randomRange(0.12, 0.9);
          o.waveY = randomRange(0.08, 0.62);
          o.waveF = randomRange(0.75, 1.85);
          o.phase = Math.random() * Math.PI * 2;
          arr.push(o);
        }
      }

      if (spawnC.current >= coinEvery) {
        spawnC.current = 0;
        const roll = Math.random();
        if (roll < 0.055 && magnetT.current <= 0 && slowT.current <= 0 && arr.length < MAX_OBSTACLES) {
          const kinds = ["shield", "slow", "magnet"];
          const power = kinds[Math.floor(Math.random() * kinds.length)];
          const o = acquireObstacle();
          o.id = nextId.current++;
          o.type = "power";
          o.power = power;
          o.special = false;
          o.x = randomRange(-SPAWN_POWER_X, SPAWN_POWER_X);
          o.y = randomRange(-SPAWN_POWER_Y, SPAWN_POWER_Y);
          o.z = -40 - Math.random() * 6;
          o.vx = 0;
          o.vy = 0;
          o.vz = vz * 0.94;
          o.rx = 0;
          o.ry = 0;
          o.rz = 0;
          o.rs = 2.4;
          o.scale = 0.36;
          arr.push(o);
        } else if (arr.length < MAX_OBSTACLES) {
          const special = Math.random() < 0.13;
          const o = acquireObstacle();
          o.id = nextId.current++;
          o.type = "coin";
          o.special = special;
          o.power = null;
          o.x = randomRange(-SPAWN_COIN_X, SPAWN_COIN_X);
          o.y = randomRange(-SPAWN_COIN_Y, SPAWN_COIN_Y);
          o.z = -38 - Math.random() * 10;
          o.vx = 0;
          o.vy = 0;
          o.vz = vz * 0.87;
          o.rx = 0;
          o.ry = 0;
          o.rz = 0;
          o.rs = 3.6;
          o.scale = special ? 0.54 : 0.42;
          o.phase = Math.random() * Math.PI * 2;
          arr.push(o);
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

      if (!keep) {
        releaseObstacle(o);
        continue;
      }

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
        _e.set(0, o.ry, o.rz);
        _q.setFromEuler(_e);
        _s.setScalar(Math.max(0.26, o.scale * 1.95));
        _m.compose(_p, _q, _s);
        coinIM.current?.setMatrixAt(ci++, _m);
      } else if (o.type === "coin" && o.special && si < MAX_SPEC_INSTANCES) {
        _p.set(o.x, o.y, o.z);
        _e.set(0, o.ry, o.rz);
        _q.setFromEuler(_e);
        _s.setScalar(Math.max(0.32, o.scale * 2.15));
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
    } catch (err) {
      console.error("SpaceRunScene update error:", err);
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
      <LeftAsteroidCluster />
      <DistantFleet speedRef={speedRef} />
      <BlackHoleAnomaly speedRef={speedRef} />
      <StarMotionLines speedRef={speedRef} />
      <EnemyScoutShip speedRef={speedRef} />

      <color attach="background" args={["#030510"]} />
      <fogExp2 attach="fog" args={["#030510", 0.012]} />
      <hemisphereLight intensity={0.18} color="#8ea7d3" groundColor="#09040f" />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-74, 20, -168]} intensity={1.55} color="#ffe7b3" castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <pointLight position={[-74, 3, -178]} intensity={3.2} color="#ffd089" distance={430} decay={1.55} />
      <pointLight position={[98, 36, -150]} intensity={2.25} color="#f59e0b" distance={260} decay={1.45} />

      <Stars radius={175} depth={150} count={4200} factor={1.25} saturation={0.03} fade speed={0.12} />
      <Stars radius={195} depth={180} count={1200} factor={2.1} saturation={0.04} fade speed={0.06} />

      <group ref={groupRef}>
        <PlayerShipDetailed
          hullColor={hullColor}
          boostingRef={boostingRef}
          shipVxRef={shipVx}
          shipVyRef={shipVy}
          healthRef={healthRef}
        />
      </group>

      <EngineParticles shipX={shipX} shipY={shipY} boostingRef={boostingRef} runningRef={runningRef} speedRef={speedRef} />

      <instancedMesh ref={meteorIM} args={[meteorGeom, meteorMat, MAX_METEOR_INSTANCES]} castShadow receiveShadow />
      <instancedMesh ref={coinIM} args={[coinGeom, coinMat, MAX_COIN_INSTANCES]} castShadow receiveShadow />
      <instancedMesh ref={specIM} args={[specCoinGeom, specCoinMat, MAX_SPEC_INSTANCES]} castShadow receiveShadow />
      <instancedMesh ref={shieldIM} args={[crystalGeom, shieldMat, MAX_SHIELD_INST]} castShadow receiveShadow />
      <instancedMesh ref={slowIM} args={[slowStarGeom, slowMat, MAX_SLOW_INST]} castShadow receiveShadow />
      <instancedMesh ref={magnetIM} args={[magnetGeom, magnetMat, MAX_MAGNET_INST]} castShadow receiveShadow />

      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.74} luminanceSmoothing={0.58} mipmapBlur intensity={0.14} radius={0.78} />
      </EffectComposer>
    </>
  );
}
