import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import * as satellite from 'satellite.js';

// ─── DOM SETUP ───────────────────────────────────────────────────────────────
const app = document.querySelector('#app');
app.innerHTML = `
  <canvas id="scene"></canvas>
  <div id="scanline"></div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  
  <div id="virtual-cursor"></div>

  <div class="hud top-left">
    <h1>⬡ FALCON 9 TRACKER</h1>
    <p>Ultimate Realism · SpaceX Falcon 9</p>
  </div>

  <div class="hud top-right" id="rocket-inspector" style="display: none; width: 320px;">
    <div class="panel-title" style="margin-bottom: 8px; color: #a78bfa;">TARGET ACQUIRED</div>
    <h2 id="part-name" style="font-family:'Orbitron'; font-size:1.2rem; color:#60a5fa; margin-bottom:8px; text-transform: uppercase;">—</h2>
    
    <div class="metric"><span>System Status</span><strong id="part-status" class="green">—</strong></div>
    
    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(96, 165, 250, 0.2);">
      <div style="font-size: 0.85rem; color: #a78bfa; margin-bottom: 6px;">TECHNICAL SPECIFICATIONS</div>
      <table style="width: 100%; font-size: 0.8rem; color: #cbd5e1; border-collapse: collapse;" id="part-stats-table">
        <!-- Stats will be injected here -->
      </table>
    </div>

    <div style="font-size:0.8rem; color:#94a3b8; margin-top:12px; line-height:1.5; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; border-left: 2px solid #60a5fa;" id="part-desc">—</div>
  </div>

  <div class="hud bottom-left">
    <strong>MAGIC GESTURES (1-HAND)</strong>
    <p><span class="key">🖐 Open Hand</span> Rotate Rocket</p>
    <p><span class="key">☝️ Pointing</span> Select Part</p>
    <p><span class="key">🤏 Pinch</span> Grab & Drag Part</p>
    <p><span class="key">✌️ Peace</span> Zoom In/Out</p>
    <p><span class="key">👍 Thumbs Up</span> Assemble Rocket</p>
    <p><span class="key">👎 Thumbs Down</span> Explode Rocket</p>
    <p><span class="key">☝️ Sabr</span> X-Ray Skeleton Mode</p>
  </div>

  <div class="hud" id="gesture-panel">
    <div class="panel-title">AI SENSOR</div>
    <div class="gesture-video-wrap">
      <video id="gesture-video" playsinline autoplay muted></video>
      <canvas id="gesture-canvas"></canvas>
    </div>
    <div id="gesture-status">Click to enable camera</div>
    <div id="gesture-label">—</div>
    <button class="gesture-toggle" id="gesture-btn">✋ START SENSOR</button>
  </div>

  <div id="loading">
    <div class="loading-ring"></div>
    <h2>FALCON 9 INITIALIZING</h2>
    <p id="loading-msg">Loading ultra-realistic PBR textures...</p>
  </div>
`;

// ─── THREE.JS SCENE ──────────────────────────────────────────────────────────
const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010103);
scene.fog = new THREE.FogExp2(0x010103, 0.015);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 1000);
camera.position.set(0, 4, 35);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 5;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);

// ─── LIGHTS ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x080c1a, 0.5));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(15, 20, 15);
keyLight.castShadow = true;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x4060ff, 1.5);
fillLight.position.set(-15, 5, -15);
scene.add(fillLight);
const engineGlow = new THREE.PointLight(0xff4010, 5, 25);
engineGlow.position.set(0, -11, 0);
scene.add(engineGlow);

// ─── TEXTURES ────────────────────────────────────────────────────────────────
const tl = new THREE.TextureLoader();
const texMetal = tl.load('/rocket_metal.png');
texMetal.wrapS = texMetal.wrapT = THREE.RepeatWrapping;
texMetal.repeat.set(1, 4);

const texBurnt = tl.load('/burnt_metal.png');
texBurnt.wrapS = texBurnt.wrapT = THREE.RepeatWrapping;

const cx = document.createElement('canvas');
cx.width = 512; cx.height = 2048;
const ctx = cx.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, cx.width, cx.height);
ctx.translate(cx.width / 2, cx.height / 2);
ctx.rotate(-Math.PI / 2);
ctx.fillStyle = '#111';
ctx.font = 'bold 160px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.letterSpacing = '10px';
ctx.fillText('S P A C E X', 0, 0);
const texLogo = new THREE.CanvasTexture(cx);
texLogo.wrapS = texLogo.wrapT = THREE.RepeatWrapping;

// ─── FALCON 9 MODEL (ULTRA DETAILED) ─────────────────────────────────────────
const rocketGroup = new THREE.Group();
scene.add(rocketGroup);

// Materials
const matWhite = new THREE.MeshStandardMaterial({ map: texMetal, roughness: 0.25, metalness: 0.6 });
const matLogo = new THREE.MeshStandardMaterial({ map: texLogo, roughness: 0.25, metalness: 0.6 });
const matBlack = new THREE.MeshStandardMaterial({ map: texBurnt, roughness: 0.8, metalness: 0.7 });
const matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.9 });
const matNozzle = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.8 });
const matFire = new THREE.MeshBasicMaterial({ color: 0xff3000, transparent: true, opacity: 0.8 });
const matHighlight = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.5 });

const partsData = [];

function registerPart(mesh, name, status, desc, stats) {
  const pos = mesh.position.clone();
  mesh.userData = {
    isPart: true, name, status, desc, stats,
    origPos: pos,
    expPos: new THREE.Vector3(
      pos.x + (Math.random() - 0.5) * 30,
      pos.y + (Math.random() - 0.5) * 20,
      pos.z + (Math.random() - 0.5) * 30
    ),
    isGrabbed: false
  };
  partsData.push(mesh);
  rocketGroup.add(mesh);
}

// 1. FIRST STAGE (Booster + Raceway + Landing Legs)
const firstStage = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 12, 64), matLogo);
firstStage.position.y = -3;
registerPart(firstStage, 'FIRST STAGE BOOSTER', 'Nominal', 'Reusable booster fuel tank containing RP-1 and LOX.', {
  'Material': 'Al-Li Alloy',
  'Propellant': 'LOX / RP-1',
  'Dry Mass': '22,200 kg',
  'Height': '41.2 m'
});

const raceway = new THREE.Mesh(new THREE.BoxGeometry(0.15, 12, 0.1), matDarkMetal);
raceway.position.set(0.85, -3, 0.3);
registerPart(raceway, 'AVIONICS RACEWAY', 'Active', 'Houses critical wiring, telemetry cables and avionics along the booster body.', {
  'Components': 'Power cables, Telemetry',
  'Shielding': 'Ablative Cork',
  'Data Rate': '20 Gbps'
});

for (let i = 0; i < 4; i++) {
  const angle = (i * Math.PI) / 2;
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 3.8, 16), matDarkMetal);
  leg.position.set(Math.cos(angle) * 0.85, -7.2, Math.sin(angle) * 0.85);
  leg.rotation.x = Math.sin(angle) * 0.04;
  leg.rotation.z = -Math.cos(angle) * 0.04;
  registerPart(leg, `LANDING LEG ${i + 1}`, 'Stowed', 'Carbon fiber landing leg for vertical propulsive landing.', {
    'Material': 'Carbon Fiber / Honeycomb',
    'Deployment': 'Pneumatic',
    'Span': '18 m (Deployed)'
  });

  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2, 16), matWhite);
  piston.position.set(Math.cos(angle) * 0.95, -8.2, Math.sin(angle) * 0.95);
  piston.rotation.x = Math.sin(angle) * 0.1;
  piston.rotation.z = -Math.cos(angle) * 0.1;
  registerPart(piston, `DEPLOYMENT ACTUATOR ${i + 1}`, 'Pressurized', 'High-pressure helium actuator to deploy the landing leg.', {
    'Pressure': '4000 PSI',
    'Gas': 'Helium (He)',
    'Force': '120 kN'
  });
}

// 2. OCTAWEB & 9 MERLIN ENGINES
const octaweb = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.8, 64), matBlack);
octaweb.position.y = -9.4;
registerPart(octaweb, 'OCTAWEB SHIELD', 'Intact', 'Protective heat shield covering the engine compartment during reentry.', {
  'Material': 'Inconel & Ablative',
  'Max Temp': '1,400 °C',
  'Configuration': '8 Outer + 1 Center'
});

const structure = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), matDarkMetal);
structure.rotation.x = Math.PI / 2;
structure.position.y = -9.8;
registerPart(structure, 'THRUST STRUCTURE', 'Stable', 'Distributes the massive thrust force from the engines to the booster.', {
  'Material': 'Titanium Billet',
  'Max Load': '7,600 kN'
});

const nozzleGeo = new THREE.CylinderGeometry(0.15, 0.32, 0.7, 32);
const fireGeo = new THREE.SphereGeometry(0.28, 16, 16);
for (let i = 0; i < 8; i++) {
  const angle = (i * Math.PI * 2) / 8;
  const eng = new THREE.Mesh(nozzleGeo, matNozzle);
  eng.position.set(Math.cos(angle) * 0.55, -10.15, Math.sin(angle) * 0.55);
  const fire = new THREE.Mesh(fireGeo, matFire);
  fire.position.y = -0.2; fire.scale.y = 1.5;
  eng.add(fire);
  registerPart(eng, `MERLIN 1D ENGINE ${i + 1}`, 'Ignited', 'Sea-level optimized rocket engine.', {
    'Thrust': '845 kN',
    'ISP': '282 s (Sea Level)',
    'Cycle': 'Gas Generator'
  });
}
const centerEng = new THREE.Mesh(nozzleGeo, matNozzle);
centerEng.position.set(0, -10.15, 0);
const cFire = new THREE.Mesh(fireGeo, matFire);
cFire.position.y = -0.2; cFire.scale.y = 1.5;
centerEng.add(cFire);
registerPart(centerEng, 'MERLIN 1D (CENTER)', 'Ignited', 'Center engine used for initial boost, reentry burn, and landing.', {
  'Thrust': '845 kN',
  'Gimbal': '±5 degrees',
  'Restarts': 'Multiple'
});

// 3. INTERSTAGE & GRID FINS
const interstage = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.5, 64), matBlack);
interstage.position.y = 4.25;
registerPart(interstage, 'CARBON INTERSTAGE', 'Nominal', 'Connects stages. Made of carbon composite material.', {
  'Material': 'Carbon Composite',
  'Pusher': 'Pneumatic Separation'
});

const rcsGeo = new THREE.BoxGeometry(0.2, 0.2, 0.1);
const rcs1 = new THREE.Mesh(rcsGeo, matDarkMetal); rcs1.position.set(0.85, 4.75, 0);
registerPart(rcs1, 'RCS THRUSTER BLOCK 1', 'Active', 'Nitrogen gas thruster used to flip and orient the booster.', {
  'Gas': 'Cold Nitrogen',
  'Purpose': 'Attitude Control'
});
const rcs2 = new THREE.Mesh(rcsGeo, matDarkMetal); rcs2.position.set(-0.85, 4.75, 0);
registerPart(rcs2, 'RCS THRUSTER BLOCK 2', 'Active', 'Nitrogen gas thruster used to flip and orient the booster.', {
  'Gas': 'Cold Nitrogen',
  'Purpose': 'Attitude Control'
});

for (let i = 0; i < 4; i++) {
  const angle = (i * Math.PI) / 2 + Math.PI / 4;

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3), matWhite);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(Math.cos(angle) * 0.95, 4.8, Math.sin(angle) * 0.95);
  registerPart(hinge, `GRID FIN HINGE ${i + 1}`, 'Locked', 'Heavy-duty hinge mechanism connecting the grid fin.', {
    'Actuation': 'Hydraulic',
    'Fluid': 'Aviation Fluid'
  });

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.05), matDarkMetal);
  fin.position.set(Math.cos(angle) * 1.0, 5.5, Math.sin(angle) * 1.0);
  fin.rotation.y = -angle;
  registerPart(fin, `TITANIUM GRID FIN ${i + 1}`, 'Stowed', 'Heat-resistant aerodynamic fin used to steer the booster.', {
    'Material': 'Cast Titanium',
    'Max Temp': '1,000 °C'
  });
}

// 4. SECOND STAGE
const secondStage = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 4.5, 64), matWhite);
secondStage.position.y = 7.75;
registerPart(secondStage, 'SECOND STAGE TANK', 'Fueled', 'Upper stage carrying LOX and RP-1 for the vacuum engine.', {
  'Mass': '4,000 kg (Dry)',
  'Propellant Mass': '111,500 kg',
  'Burn Time': '397 s'
});

const vacNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.8, 1.8, 32), matNozzle);
vacNozzle.position.y = 4.6;
registerPart(vacNozzle, 'MERLIN VACUUM (MVac)', 'Standby', 'Highly expanded nozzle optimized for vacuum efficiency.', {
  'Thrust': '981 kN (Vacuum)',
  'ISP': '348 s',
  'Expansion Ratio': '165:1'
});

// 5. PAYLOAD FAIRING
const fairingBase = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 1.5, 64), matWhite);
fairingBase.position.y = 10.75;
registerPart(fairingBase, 'FAIRING BASE RING', 'Sealed', 'Pneumatic separation interface between second stage and payload.', {
  'Separation': 'Pneumatic pushers',
  'Diameter': '5.2 m'
});

const fairingMid = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 3, 64), matWhite);
fairingMid.position.y = 13;
registerPart(fairingMid, 'PAYLOAD FAIRING (BODY)', 'Sealed', 'Carbon composite shell protecting the satellite payload.', {
  'Material': 'Carbon composite/Al core',
  'Payload Capacity': '22,800 kg (LEO)'
});

const fairingNose = new THREE.Mesh(new THREE.ConeGeometry(1.05, 3.5, 64), matWhite);
fairingNose.position.y = 16.25;
registerPart(fairingNose, 'FAIRING (NOSE CONE)', 'Sealed', 'Aerodynamic tip reducing drag during atmospheric ascent.', {
  'Heat Shield': 'Ablative coat',
  'Recovery': 'Parachute / Ship net'
});

const sepLine = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.05, 64), matDarkMetal);
sepLine.position.y = 11.5;
registerPart(sepLine, 'SEPARATION JOINT', 'Armed', 'Explosive bolts and pneumatic pushers to split the fairing in half.', {
  'Type': 'Frangible Joint'
});

// Highlight Mesh
const highlightMesh = new THREE.Mesh(new THREE.SphereGeometry(1), matHighlight);
highlightMesh.visible = false;
scene.add(highlightMesh);

// ─── STARS ───────────────────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const N_STARS = 6000;
const starPos = new Float32Array(N_STARS * 3);
for (let i = 0; i < N_STARS; i++) {
  const r = THREE.MathUtils.randFloat(60, 300);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
  starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.cos(phi);
  starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
  size: 0.15, color: 0xaaccff, transparent: true, opacity: 0.8
})));

// ─── SATELLITES AROUND ROCKET ────────────────────────────────────────────────
let activeSatellites = [];
const satGeo = new THREE.BufferGeometry();
let satPosArr = new Float32Array(0);
satGeo.setAttribute('position', new THREE.BufferAttribute(satPosArr, 3));
const satPoints = new THREE.Points(satGeo, new THREE.PointsMaterial({
  color: 0xffe177, size: 0.18, sizeAttenuation: true, transparent: true, opacity: 0.9
}));
scene.add(satPoints);

async function loadSatellites() {
  const loadMsg = document.getElementById('loading-msg');
  try {
    const res = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json');
    if (!res.ok) throw new Error(`Celestrak Error: ${res.status}`);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON'); }

    activeSatellites = data.map(item => {
      const l1 = item.TLE_LINE1 || item.tle_line1;
      const l2 = item.TLE_LINE2 || item.tle_line2;
      if (!l1 || !l2) return null;
      try { return satellite.twoline2satrec(l1.trim(), l2.trim()); } catch { return null; }
    }).filter(Boolean).slice(0, 1500);

    satPosArr = new Float32Array(activeSatellites.length * 3);
    satGeo.setAttribute('position', new THREE.BufferAttribute(satPosArr, 3));
    satGeo.computeBoundingSphere();

    document.getElementById('loading').style.opacity = '0';
    setTimeout(() => document.getElementById('loading').remove(), 800);
  } catch (e) {
    console.error(e);
    loadMsg.textContent = 'Failed to load satellites. Offline Mode.';
    setTimeout(() => document.getElementById('loading').remove(), 1500);
  }
}
loadSatellites();

function updateSatellites() {
  if (!activeSatellites.length) return;
  const now = new Date();
  const gmst = satellite.gstime(now);
  const SCALE = 1 / 300;
  for (let i = 0; i < activeSatellites.length; i++) {
    const pv = satellite.propagate(activeSatellites[i], now);
    if (pv.position) {
      const geo = satellite.eciToGeodetic(pv.position, gmst);
      const r = 5 + geo.height * SCALE;
      const x = r * Math.cos(geo.latitude) * Math.cos(geo.longitude);
      const y = r * Math.sin(geo.latitude);
      const z = -r * Math.cos(geo.latitude) * Math.sin(geo.longitude);
      satPosArr[i * 3] = x; satPosArr[i * 3 + 1] = y; satPosArr[i * 3 + 2] = z;
    }
  }
  satGeo.attributes.position.needsUpdate = true;
}

// ─── 1-HAND GESTURE LOGIC & DRAG N DROP ──────────────────────────────────────
let gestureActive = false;
let gestureStream = null;
const gVideo = document.getElementById('gesture-video');
const gCanvas = document.getElementById('gesture-canvas');
const gCtx = gCanvas.getContext('2d');
const gStatus = document.getElementById('gesture-status');
const gLabel = document.getElementById('gesture-label');
const gBtn = document.getElementById('gesture-btn');
const vCursor = document.getElementById('virtual-cursor');

const raycaster = new THREE.Raycaster();
let cursorNorm = new THREE.Vector2(-2, -2);
let hoveredPart = null;
let grabbedPart = null;
let grabPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

let gestureRotX = 0;
let gestureRotY = 0;
let animTarget = null;

let lastPeaceY = null;
let isXRay = false;

function classifyGesture(lm) {
  const wrist = lm[0];
  const thumb = lm[4];
  const index = lm[8];
  const indexBase = lm[5];
  const middle = lm[12];
  const ring = lm[16];
  const pinky = lm[20];

  const thumbUp = thumb.y < indexBase.y && thumb.y < wrist.y - 0.1;
  const thumbDown = thumb.y > wrist.y + 0.1;

  const indexUp = index.y < indexBase.y;
  const middleUp = middle.y < lm[9].y;
  const ringUp = ring.y < lm[13].y;
  const pinkyUp = pinky.y < lm[17].y;

  // Cursor position from index finger tip
  const cx = (1 - index.x) * innerWidth;
  const cy = index.y * innerHeight;
  cursorNorm.x = (cx / innerWidth) * 2 - 1;
  cursorNorm.y = -(cy / innerHeight) * 2 + 1;

  // Pinch = thumb tip touches index tip
  const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y);

  // Sabr detection: thumb tucked across palm (thumb tip near index PIP lm[6])
  const thumbToIndexPIP = Math.hypot(thumb.x - lm[6].x, thumb.y - lm[6].y);
  const isSabr = indexUp && !middleUp && !ringUp && !pinkyUp && thumbToIndexPIP < 0.09;

  // Helper: exit X-Ray mode
  function exitXRay() {
    if (isXRay) {
      isXRay = false;
      partsData.forEach(p => {
        p.material.wireframe = false;
        if (p.material.__origColor) p.material.color.copy(p.material.__origColor);
        if (p.material.__origOpacity !== undefined) p.material.opacity = p.material.__origOpacity;
        p.material.transparent = p.material.__origTransparent || false;
      });
    }
  }

  // ─── 1. ☝️ SABR (index UP + thumb TUCKED) = TOGGLE X-RAY ───
  if (isSabr) {
    vCursor.style.opacity = '0'; cursorNorm.set(-2, -2);
    if (!isXRay) {
      isXRay = true;
      partsData.forEach(p => {
        p.material.__origColor = p.material.color.clone();
        p.material.__origOpacity = p.material.opacity;
        p.material.__origTransparent = p.material.transparent;
        p.material.wireframe = true;
        p.material.transparent = true;
        p.material.opacity = 0.3;
        p.material.color.set(0x00ffcc);
      });
    }
    return '☝️ X-RAY ON';
  }

  // ─── 2. 🤏 PINCH (thumb + index tips close) = GRAB & DRAG ───
  if (pinchDist < 0.07) {
    vCursor.style.opacity = '1';
    vCursor.style.transform = `translate(${cx}px, ${cy}px) scale(0.6)`;
    vCursor.style.background = 'rgba(251, 191, 36, 0.7)';
    vCursor.style.borderColor = '#f59e0b';

    if (!grabbedPart && hoveredPart) { grabbedPart = hoveredPart; controls.enabled = false; }
    if (grabbedPart) {
      raycaster.setFromCamera(cursorNorm, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(grabPlane, intersectPoint);
      grabbedPart.position.lerp(intersectPoint, 0.2);
      grabbedPart.userData.isGrabbed = true;
      return '🤏 DRAGGING';
    }
    return '🤏 PINCH';
  } else {
    if (grabbedPart) { grabbedPart.userData.isGrabbed = false; grabbedPart = null; controls.enabled = true; }
    vCursor.style.background = 'rgba(96, 165, 250, 0.4)'; vCursor.style.borderColor = '#60a5fa';
  }

  // ─── 3. ✌️ PEACE (index + middle UP, ring + pinky DOWN) = ZOOM ───
  if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbUp) {
    vCursor.style.opacity = '0'; cursorNorm.set(-2, -2);
    const handSize = Math.hypot(wrist.x - lm[9].x, wrist.y - lm[9].y);
    const targetZ = 60 - (handSize * 150);
    camera.position.z += (targetZ - camera.position.z) * 0.1;
    camera.position.z = Math.max(5, Math.min(camera.position.z, 60));
    return '✌️ ZOOMING';
  }

  // ─── 4. 👍 THUMBS UP (only thumb up) = ASSEMBLE ───
  if (!indexUp && !middleUp && !ringUp && !pinkyUp && thumbUp) {
    vCursor.style.opacity = '0'; cursorNorm.set(-2, -2);
    exitXRay();
    animTarget = 'assemble';
    gestureRotX = 0; gestureRotY = 0;
    return '👍 ASSEMBLE';
  }

  // ─── 5. 👎 THUMBS DOWN (only thumb down) = EXPLODE ───
  if (!indexUp && !middleUp && !ringUp && !pinkyUp && thumbDown) {
    vCursor.style.opacity = '0'; cursorNorm.set(-2, -2);
    exitXRay();
    animTarget = 'explode';
    gestureRotX = 0; gestureRotY = 0;
    return '👎 EXPLODE';
  }

  // ─── 6. ☝️ POINTING (index up, thumb NOT tucked) = SELECT / HOVER ───
  if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp && !thumbDown && !isSabr) {
    vCursor.style.opacity = '1';
    vCursor.style.transform = `translate(${cx}px, ${cy}px) scale(1)`;
    gestureRotX *= 0.8; gestureRotY *= 0.8;
    return '☝️ POINTING';
  }

  vCursor.style.opacity = '0'; cursorNorm.set(-2, -2);

  // ─── 7. 🖐 OPEN HAND (all 4 fingers up) = ROTATE ───
  if (indexUp && middleUp && ringUp && pinkyUp) {
    const dx = (0.5 - wrist.x) * 0.15;
    const dy = (wrist.y - 0.5) * 0.15;
    gestureRotY += (dx - gestureRotY) * 0.4;
    gestureRotX += (dy - gestureRotX) * 0.4;
    rocketGroup.rotation.y += gestureRotY;
    rocketGroup.rotation.x = Math.max(-0.4, Math.min(0.4, rocketGroup.rotation.x + gestureRotX));
    return '🖐 ROTATING';
  }

  gestureRotX *= 0.8; gestureRotY *= 0.8;
  return '—';
}

function drawHand(lm) {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  const conns = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]];
  gCtx.strokeStyle = '#60a5fa'; gCtx.fillStyle = '#60a5fa'; gCtx.lineWidth = 2;
  conns.forEach(([a, b]) => {
    gCtx.beginPath(); gCtx.moveTo(lm[a].x * gCanvas.width, lm[a].y * gCanvas.height); gCtx.lineTo(lm[b].x * gCanvas.width, lm[b].y * gCanvas.height); gCtx.stroke();
  });
  lm.forEach(pt => {
    gCtx.beginPath(); gCtx.arc(pt.x * gCanvas.width, pt.y * gCanvas.height, 3, 0, Math.PI * 2); gCtx.fill();
  });
}

async function startGesture() {
  gStatus.textContent = 'Loading MediaPipe...';
  try {
    if (!window.Hands) {
      await new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'; s.crossOrigin = 'anonymous';
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    gStatus.textContent = 'Starting camera...';
    gestureStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
    gVideo.srcObject = gestureStream;
    await new Promise(r => gVideo.onloadedmetadata = r);
    gCanvas.width = gVideo.videoWidth; gCanvas.height = gVideo.videoHeight;

    const hands = new window.Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
    hands.onResults(results => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        drawHand(results.multiHandLandmarks[0]);
        gLabel.textContent = classifyGesture(results.multiHandLandmarks[0]);
      } else {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        gLabel.textContent = '— NO HAND —';
        vCursor.style.opacity = '0';
        cursorNorm.set(-2, -2);
      }
    });

    if (!window.Camera) {
      await new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'; s.crossOrigin = 'anonymous';
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    const cam = new window.Camera(gVideo, { onFrame: async () => { await hands.send({ image: gVideo }); }, width: 320, height: 240 });
    cam.start();
    gStatus.textContent = '✅ Tracking 1 Hand';
    gestureActive = true;
    gBtn.textContent = '⛔ STOP SENSOR';
    gBtn.classList.add('active');
  } catch (err) {
    gStatus.textContent = '❌ Camera error';
  }
}

function stopGesture() {
  if (gestureStream) { gestureStream.getTracks().forEach(t => t.stop()); gestureStream = null; }
  gVideo.srcObject = null;
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  gStatus.textContent = 'Click to enable camera';
  gLabel.textContent = '—';
  gBtn.textContent = '✋ START SENSOR';
  gBtn.classList.remove('active');
  gestureActive = false;
  vCursor.style.opacity = '0';
  cursorNorm.set(-2, -2);
}

gBtn.addEventListener('click', () => { gestureActive ? stopGesture() : startGesture(); });

// Mouse fallback
let isMouseDown = false;
window.addEventListener('mousedown', () => { isMouseDown = true; });
window.addEventListener('mouseup', () => { isMouseDown = false; grabbedPart = null; controls.enabled = true; });
window.addEventListener('mousemove', e => {
  if (gestureActive && vCursor.style.opacity === '1') return;
  cursorNorm.x = (e.clientX / innerWidth) * 2 - 1;
  cursorNorm.y = -(e.clientY / innerHeight) * 2 + 1;

  if (isMouseDown) {
    if (!grabbedPart && hoveredPart) { grabbedPart = hoveredPart; controls.enabled = false; }
    if (grabbedPart) {
      raycaster.setFromCamera(cursorNorm, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(grabPlane, intersectPoint);
      grabbedPart.position.lerp(intersectPoint, 0.2);
    }
  }
});

// ─── ANIMATE & RAYCAST ───────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
});

let lastUpdate = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  controls.update();

  if (now - lastUpdate > 500) { updateSatellites(); lastUpdate = now; }

  if (animTarget === 'explode') {
    let doneCount = 0;
    partsData.forEach(p => {
      p.position.lerp(p.userData.expPos, 0.08);
      if (p.position.distanceTo(p.userData.expPos) < 0.1) doneCount++;
    });
    // Smoothly reset rocket rotation to 0
    rocketGroup.rotation.y += (0 - rocketGroup.rotation.y) * 0.08;
    rocketGroup.rotation.x += (0 - rocketGroup.rotation.x) * 0.08;
    if (doneCount === partsData.length && Math.abs(rocketGroup.rotation.y) < 0.01) animTarget = null;
  } else if (animTarget === 'assemble') {
    let doneCount = 0;
    partsData.forEach(p => {
      p.position.lerp(p.userData.origPos, 0.08);
      if (p.position.distanceTo(p.userData.origPos) < 0.01) {
        p.position.copy(p.userData.origPos); // Perfect snap!
        doneCount++;
      }
    });
    // Smoothly reset rocket rotation to 0
    rocketGroup.rotation.y += (0 - rocketGroup.rotation.y) * 0.08;
    rocketGroup.rotation.x += (0 - rocketGroup.rotation.x) * 0.08;
    if (doneCount === partsData.length && Math.abs(rocketGroup.rotation.y) < 0.01) animTarget = null;
  }

  // Raycasting for selection
  if (!grabbedPart) {
    raycaster.setFromCamera(cursorNorm, camera);
    const intersects = raycaster.intersectObjects(rocketGroup.children, false);

    let hitPart = null;
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      if (obj.userData && obj.userData.isPart) {
        hitPart = obj;
        break;
      }
    }

    const inspector = document.getElementById('rocket-inspector');

    if (hitPart) {
      document.body.style.cursor = 'grab';
      if (hoveredPart !== hitPart) {
        hoveredPart = hitPart;
        inspector.style.display = 'block';
        document.getElementById('part-name').textContent = hitPart.userData.name;
        document.getElementById('part-status').textContent = hitPart.userData.status;
        document.getElementById('part-desc').textContent = hitPart.userData.desc;

        // Inject stats
        const statsTable = document.getElementById('part-stats-table');
        statsTable.innerHTML = '';
        if (hitPart.userData.stats) {
          for (const [key, val] of Object.entries(hitPart.userData.stats)) {
            statsTable.innerHTML += `
              <tr>
                <td style="padding: 4px 0; color: #94a3b8;">${key}:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #f8fafc;">${val}</td>
              </tr>
            `;
          }
        }

        grabPlane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(new THREE.Vector3()),
          hitPart.position
        );
      }
      highlightMesh.visible = true;
      const box = new THREE.Box3().setFromObject(hitPart);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      highlightMesh.geometry = new THREE.BoxGeometry(size.x * 1.05, size.y * 1.05, size.z * 1.05);
      highlightMesh.position.copy(center);
      highlightMesh.material.opacity = 0.4 + 0.2 * Math.sin(now * 0.01);
    } else {
      document.body.style.cursor = 'default';
      if (hoveredPart) {
        hoveredPart = null;
        inspector.style.display = 'none';
        highlightMesh.visible = false;
      }
    }
  } else {
    document.body.style.cursor = 'grabbing';
    const box = new THREE.Box3().setFromObject(grabbedPart);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    highlightMesh.geometry = new THREE.BoxGeometry(size.x * 1.05, size.y * 1.05, size.z * 1.05);
    highlightMesh.position.copy(center);
  }

  renderer.render(scene, camera);
}
animate();
