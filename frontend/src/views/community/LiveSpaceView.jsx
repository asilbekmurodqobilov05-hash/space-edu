import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Satellite,
  Gauge,
  Crosshair,
  Search,
  Activity,
  Rocket,
  Camera,
  MapPinned,
} from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { twoline2satrec } from '../../../node_modules/satellite.js/dist/io.js';
import { propagate, gstime } from '../../../node_modules/satellite.js/dist/propagation.js';
import { eciToEcf, eciToGeodetic, radiansToDegrees } from '../../../node_modules/satellite.js/dist/transforms.js';
import { useGamificationStore } from '@/store/useGamificationStore';
import UpcomingLaunches from '@/components/live/UpcomingLaunches';
import NasaApod from '@/components/live/NasaApod';

const EARTH_RADIUS = 2;
const EARTH_KM = 6371;

const TLE_SOURCES = [
  { group: 'stations', type: 'ISS', limit: 700 },
  { group: 'starlink', type: 'Starlink', limit: 15000 },
  { group: 'active', type: 'LEO', limit: 20000 },
];

function parseTleGroup(raw, cfg) {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const output = [];
  for (let i = 0; i + 2 < lines.length && output.length < cfg.limit; i += 3) {
    const name = lines[i].replace(/^0\s*/, '');
    const l1 = lines[i + 1];
    const l2 = lines[i + 2];
    if (!l1?.startsWith('1 ') || !l2?.startsWith('2 ')) continue;

    try {
      const satrec = twoline2satrec(l1, l2);
      const satnum = String(satrec.satnum || `${cfg.group}-${i}`);
      const low = name.toLowerCase();
      const type =
        cfg.type === 'LEO'
          ? low.includes('geo')
            ? 'GEO'
            : low.includes('meo')
              ? 'MEO'
              : 'LEO'
          : cfg.type;

      const color = new THREE.Color('#ff2d6a');

      output.push({
        id: satnum,
        name,
        type,
        satrec,
        color,
      });
    } catch {
      // skip invalid tle rows
    }
  }

  return output;
}

async function loadRealSatellites() {
  const jobs = TLE_SOURCES.map(async (cfg) => {
    const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${cfg.group}&FORMAT=tle`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`failed ${cfg.group}`);
    const text = await response.text();
    return parseTleGroup(text, cfg);
  });

  const settled = await Promise.allSettled(jobs);
  const sats = [];
  for (const result of settled) {
    if (result.status === 'fulfilled') sats.push(...result.value);
  }

  const uniq = new Map();
  for (const sat of sats) {
    if (!uniq.has(sat.id)) uniq.set(sat.id, sat);
  }

  const arr = Array.from(uniq.values());
  if (!arr.length) throw new Error('no tle');
  return arr;
}

function fallbackSatellites() {
  return [
    {
      id: '25544',
      name: 'ISS (ZARYA)',
      type: 'ISS',
      color: new THREE.Color('#ff2d6a'),
      satrec: twoline2satrec(
        '1 25544U 98067A   26122.47509931  .00014920  00000+0  26616-3 0  9994',
        '2 25544  51.6380  69.2367 0003320  65.4491  48.5744 15.50352232508944',
      ),
    },
  ];
}

function RealEarth() {
  const earthRef = useRef(null);
  const cloudsRef = useRef(null);

  const [dayMap, bumpMap, specMap, nightMap, cloudMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.028;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.036;
  });

  return (
    <group>
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
          <meshPhongMaterial
            map={dayMap}
            bumpMap={bumpMap}
            bumpScale={0.035}
            specularMap={specMap}
            specular={new THREE.Color('#445577')}
            shininess={18}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[EARTH_RADIUS * 1.0015, 96, 96]} />
          <meshBasicMaterial map={nightMap} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 96, 96]} />
        <meshPhongMaterial map={cloudMap} transparent opacity={0.22} depthWrite={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.03, 64, 64]} />
        <meshBasicMaterial color="#3ba8ff" transparent opacity={0.09} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function selectedOrbitFromSatrec(satrec) {
  const points = [];
  const base = new Date();

  for (let idx = 0; idx <= 140; idx++) {
    const dt = new Date(base.getTime() + idx * 80 * 1000);
    const pv = propagate(satrec, dt);
    if (!pv.position) continue;

    const gmstValue = gstime(dt);
    const ecf = eciToEcf(pv.position, gmstValue);

    points.push(new THREE.Vector3((ecf.x / EARTH_KM) * EARTH_RADIUS, (ecf.z / EARTH_KM) * EARTH_RADIUS, (ecf.y / EARTH_KM) * EARTH_RADIUS));
  }

  return points;
}

function SelectedOrbitRing({ selectedSat }) {
  const markerRef = useRef(null);
  const points = useMemo(() => selectedOrbitFromSatrec(selectedSat.satrec), [selectedSat]);

  useFrame(() => {
    if (!markerRef.current) return;
    const now = new Date();
    const pv = propagate(selectedSat.satrec, now);
    if (!pv.position) return;

    const gmstValue = gstime(now);
    const ecf = eciToEcf(pv.position, gmstValue);

    markerRef.current.position.set((ecf.x / EARTH_KM) * EARTH_RADIUS, (ecf.z / EARTH_KM) * EARTH_RADIUS, (ecf.y / EARTH_KM) * EARTH_RADIUS);
  });

  if (points.length < 3) return null;

  return (
    <group>
      <Line points={points} color="#ffffff" opacity={0.95} transparent lineWidth={2.4} />
      <group ref={markerRef}>
        <mesh>
          <sphereGeometry args={[0.047, 18, 18]} />
          <meshBasicMaterial color={selectedSat.color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshBasicMaterial color={selectedSat.color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function EarthAndSatellites({ baseSatellites, mapSelectedSatId, onHotSatClick }) {
  const pointsRef = useRef(null);
  const glowRef = useRef(null);
  const hotRef = useRef(null);
  const hotHitRef = useRef(null);
  const lastRefreshRef = useRef(0);

  const hotSatellites = baseSatellites;

  const positions = useMemo(() => new Float32Array(baseSatellites.length * 3), [baseSatellites]);
  const colors = useMemo(() => {
    const data = new Float32Array(baseSatellites.length * 3);
    for (let i = 0; i < baseSatellites.length; i++) {
      data[i * 3] = baseSatellites[i].color.r;
      data[i * 3 + 1] = baseSatellites[i].color.g;
      data[i * 3 + 2] = baseSatellites[i].color.b;
    }
    return data;
  }, [baseSatellites]);

  const hotPositions = useMemo(() => new Float32Array(hotSatellites.length * 3), [hotSatellites]);
  const hotColors = useMemo(() => {
    const out = new Float32Array(hotSatellites.length * 3);
    for (let i = 0; i < hotSatellites.length; i++) {
      const c = new THREE.Color(
        hotSatellites[i].id === mapSelectedSatId ? '#ffe45c' : '#ff2d6a',
      );
      out[i * 3] = c.r;
      out[i * 3 + 1] = c.g;
      out[i * 3 + 2] = c.b;
    }
    return out;
  }, [hotSatellites, mapSelectedSatId]);

  useFrame(() => {
    const nowMs = performance.now();
    if (nowMs - lastRefreshRef.current < 300) return;
    lastRefreshRef.current = nowMs;

    if (!pointsRef.current || !baseSatellites.length) return;

    const now = new Date();
    const gmstValue = gstime(now);
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const glowArr = glowRef.current?.geometry.attributes.position.array;
    const hotArr = hotRef.current?.geometry.attributes.position.array;

    const parentPositions = new Map();
    for (let i = 0; i < baseSatellites.length; i++) {
      const sat = baseSatellites[i];
      const pv = propagate(sat.satrec, now);
      if (!pv.position) continue;

      const ecf = eciToEcf(pv.position, gmstValue);
      parentPositions.set(sat.id, {
        x: (ecf.x / EARTH_KM) * EARTH_RADIUS,
        y: (ecf.z / EARTH_KM) * EARTH_RADIUS,
        z: (ecf.y / EARTH_KM) * EARTH_RADIUS,
      });
    }

    for (let i = 0; i < baseSatellites.length; i++) {
      const sat = baseSatellites[i];
      const base = parentPositions.get(sat.id);
      if (!base) continue;

      const ox = base.x;
      const oy = base.y;
      const oz = base.z;

      posArr[i * 3] = ox;
      posArr[i * 3 + 1] = oy;
      posArr[i * 3 + 2] = oz;

      if (glowArr) {
        glowArr[i * 3] = ox;
        glowArr[i * 3 + 1] = oy;
        glowArr[i * 3 + 2] = oz;
      }
    }

    for (let i = 0; i < hotSatellites.length; i++) {
      const sat = hotSatellites[i];
      const base = parentPositions.get(sat.id);
      if (!base || !hotArr) continue;
      hotArr[i * 3] = base.x;
      hotArr[i * 3 + 1] = base.y;
      hotArr[i * 3 + 2] = base.z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (glowRef.current) glowRef.current.geometry.attributes.position.needsUpdate = true;
    if (hotRef.current) hotRef.current.geometry.attributes.position.needsUpdate = true;
    if (hotHitRef.current) hotHitRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const orbitSat = useMemo(
    () => baseSatellites.find((sat) => sat.id === mapSelectedSatId),
    [baseSatellites, mapSelectedSatId],
  );

  return (
    <group>
      <RealEarth />

      {baseSatellites.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={baseSatellites.length} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={baseSatellites.length} array={colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.0115} vertexColors transparent opacity={0.72} sizeAttenuation depthWrite={false} />
        </points>
      )}

      {baseSatellites.length > 0 && (
        <points ref={glowRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={baseSatellites.length} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={baseSatellites.length} array={colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.03} vertexColors transparent opacity={0.86} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      )}

      {hotSatellites.length > 0 && (
        <points
          ref={hotRef}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (typeof event.index === 'number') {
              const sat = hotSatellites[event.index];
              if (sat) onHotSatClick(sat.id);
            }
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={hotSatellites.length} array={hotPositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={hotSatellites.length} array={hotColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.038} vertexColors transparent opacity={0.97} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      )}

      {hotSatellites.length > 0 && (
        <points
          ref={hotHitRef}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (typeof event.index === 'number') {
              const sat = hotSatellites[event.index];
              if (sat) onHotSatClick(sat.id);
            }
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={hotSatellites.length} array={hotPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.09} transparent opacity={0} sizeAttenuation depthWrite={false} />
        </points>
      )}

      {orbitSat && <SelectedOrbitRing selectedSat={orbitSat} />}

      <ambientLight intensity={0.14} />
      <directionalLight position={[8, 3, -6]} intensity={1.6} color="#ffecc7" />
      <directionalLight position={[-7, -2, 7]} intensity={0.28} color="#7799ff" />
    </group>
  );
}

function getSatMetrics(selectedSat) {
  if (!selectedSat?.satrec) return null;

  const now = new Date();
  const pv = propagate(selectedSat.satrec, now);
  if (!pv.position || !pv.velocity) return null;

  const gmstValue = gstime(now);
  const geo = eciToGeodetic(pv.position, gmstValue);
  const speed = Math.sqrt(pv.velocity.x ** 2 + pv.velocity.y ** 2 + pv.velocity.z ** 2) * 3600;

  return {
    alt: geo.height.toFixed(1),
    vel: speed.toFixed(0),
    inc: ((selectedSat.satrec.inclo || 0) * (180 / Math.PI)).toFixed(2),
    lat: radiansToDegrees(geo.latitude).toFixed(3),
    lon: radiansToDegrees(geo.longitude).toFixed(3),
  };
}

export default function LiveSpaceView() {
  const { addXp } = useGamificationStore();

  const [activeSatellites, setActiveSatellites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSatId, setSelectedSatId] = useState(null);
  const [mapSelectedSatId, setMapSelectedSatId] = useState(null);
  const [liveMetrics, setLiveMetrics] = useState(null);
  const [mapMetrics, setMapMetrics] = useState(null);
  const [isRealData, setIsRealData] = useState(true);

  useEffect(() => {
    addXp(20);

    let mounted = true;

    loadRealSatellites()
      .then((sats) => {
        if (!mounted) return;
        setActiveSatellites(sats);
        const iss = sats.find((sat) => sat.type === 'ISS');
        setSelectedSatId(iss?.id || sats[0]?.id || null);
        setIsRealData(true);
      })
      .catch(() => {
        if (!mounted) return;
        const fallback = fallbackSatellites();
        setActiveSatellites(fallback);
        setSelectedSatId(fallback[0]?.id || null);
        setIsRealData(false);
      });

    return () => {
      mounted = false;
    };
  }, [addXp]);

  const filteredSats = useMemo(() => {
    if (!searchQuery) return activeSatellites;
    return activeSatellites.filter((sat) => sat.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeSatellites, searchQuery]);

  const selectedSat = useMemo(() => activeSatellites.find((sat) => sat.id === selectedSatId), [activeSatellites, selectedSatId]);
  const mapSelectedSat = useMemo(() => activeSatellites.find((sat) => sat.id === mapSelectedSatId), [activeSatellites, mapSelectedSatId]);

  useEffect(() => {
    if (!selectedSat) return;
    const refresh = () => setLiveMetrics(getSatMetrics(selectedSat));
    refresh();
    const timer = setInterval(refresh, 700);
    return () => clearInterval(timer);
  }, [selectedSat]);

  useEffect(() => {
    if (!mapSelectedSat) {
      setMapMetrics(null);
      return;
    }
    const refresh = () => setMapMetrics(getSatMetrics(mapSelectedSat));
    refresh();
    const timer = setInterval(refresh, 700);
    return () => clearInterval(timer);
  }, [mapSelectedSat]);

  return (
    <div className="relative bg-black text-white">
      <section className="relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 1.35, 6.2], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
            <color attach="background" args={['#000000']} />
            <Stars radius={120} depth={60} count={9000} factor={2.2} saturation={0} fade speed={0.35} />

            <Suspense fallback={null}>
              <EarthAndSatellites
                baseSatellites={activeSatellites}
                mapSelectedSatId={mapSelectedSatId}
                onHotSatClick={(id) => {
                  setMapSelectedSatId(id);
                  setSelectedSatId(id);
                }}
              />
            </Suspense>

            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={0.18} mipmapBlur intensity={1.35} radius={0.6} />
            </EffectComposer>

            <OrbitControls enablePan panSpeed={0.45} minDistance={2.8} maxDistance={14} autoRotate autoRotateSpeed={0.13} enableDamping dampingFactor={0.05} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 45%, transparent 0%, rgba(0,0,0,0.58) 100%)' }} />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-between p-3 pb-4 sm:p-6 sm:pb-5">
          <div className="pointer-events-auto flex w-full max-w-sm flex-col gap-3 lg:max-w-md">
            <div className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-[10px] uppercase tracking-widest text-cyan-300 backdrop-blur-md">
              {isRealData ? 'Live TLE tracking' : 'Fallback TLE mode'}
            </div>

            <AnimatePresence mode="popLayout">
              {selectedSat && liveMetrics && (
                <motion.div
                  key="target-info"
                  initial={{ opacity: 0, x: -16, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border border-cyan-500/25 border-l-2 border-l-cyan-400 bg-black/60 p-4 shadow-[0_0_36px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                        <Crosshair className="h-3 w-3 shrink-0" /> Target locked
                      </div>
                      <h3 className="truncate text-xl font-black uppercase tracking-wide text-white sm:text-2xl">{selectedSat.name}</h3>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                      <Satellite className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/50 p-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <Activity className="h-3.5 w-3.5 text-violet-400" /> Altitude
                      </div>
                      <div className="font-mono text-sm text-white">{liveMetrics.alt} <span className="text-[10px] text-gray-500">km</span></div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/50 p-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <Gauge className="h-3.5 w-3.5 text-amber-400" /> Velocity
                      </div>
                      <div className="font-mono text-sm text-white">{liveMetrics.vel} <span className="text-[10px] text-gray-500">km/h</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col rounded-xl border border-white/5 bg-black/50 p-2.5">
                        <span className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Inclination</span>
                        <span className="font-mono text-sm text-white">{liveMetrics.inc} deg</span>
                      </div>
                      <div className="flex flex-col rounded-xl border border-white/5 bg-black/50 p-2.5">
                        <span className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">Class</span>
                        <span className="text-sm font-bold uppercase text-white">{selectedSat.type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex max-h-[44vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/10 p-3 sm:p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search satellite..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-3 font-mono text-xs text-white placeholder-gray-500 transition-colors focus:border-cyan-400 focus:outline-none sm:py-3 sm:pl-11 sm:text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 sm:left-4 sm:top-3.5" />
                </div>
              </div>

              <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
                <div className="px-2 pb-1 text-[10px] font-mono text-white/40">
                  Total satellites: {filteredSats.length.toLocaleString()}
                </div>
                {filteredSats.map((sat) => (
                  <button
                    key={sat.id}
                    type="button"
                    onClick={() => {
                      setSelectedSatId(sat.id);
                      setMapSelectedSatId(sat.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all sm:p-3 ${selectedSatId === sat.id ? 'border border-cyan-400/45 bg-cyan-500/15 shadow-[0_0_16px_rgba(34,211,238,0.2)]' : 'border border-transparent hover:bg-white/5'}`}
                  >
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: sat.color.getStyle(), boxShadow: `0 0 10px ${sat.color.getStyle()}` }} />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate font-mono text-[11px] font-bold sm:text-xs ${selectedSatId === sat.id ? 'text-white' : 'text-gray-300'}`}>{sat.name}</div>
                      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">{sat.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {mapSelectedSat && mapMetrics && (
            <div className="pointer-events-auto hidden w-full max-w-xs rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-xl lg:block">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-rose-300">
                <MapPinned className="h-4 w-4" /> Selected red satellite
              </div>
              <div className="mb-2 text-sm font-bold text-white">{mapSelectedSat.name}</div>
              <div className="space-y-2 text-xs text-white/80">
                <div className="flex justify-between"><span>Altitude</span><span className="font-mono">{mapMetrics.alt} km</span></div>
                <div className="flex justify-between"><span>Velocity</span><span className="font-mono">{mapMetrics.vel} km/h</span></div>
                <div className="flex justify-between"><span>Latitude</span><span className="font-mono">{mapMetrics.lat} deg</span></div>
                <div className="flex justify-between"><span>Longitude</span><span className="font-mono">{mapMetrics.lon} deg</span></div>
                <div className="flex justify-between"><span>Inclination</span><span className="font-mono">{mapMetrics.inc} deg</span></div>
                <div className="flex justify-between"><span>Type</span><span className="font-mono">{mapSelectedSat.type}</span></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-20 border-t border-white/10 bg-[#06080f] px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-2.5 text-cyan-300">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Live</h2>
              <p className="text-sm text-white/45">Pastga tushganda jonli kontent bo limi shu yerda.</p>
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl sm:p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-rose-300">
              <Camera className="h-4 w-4" /> NASA Live Streams
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  title="NASA ISS Live Stream"
                  src="https://www.youtube.com/embed/21X5lGlDOfg"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  title="NASA TV Public-Edu Live"
                  src="https://www.youtube.com/embed/UxW6HfVGd3Y"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                <Rocket className="h-4 w-4" /> Upcoming Launches
              </div>
              <UpcomingLaunches />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-violet-300">
                <Camera className="h-4 w-4" /> NASA APOD
              </div>
              <NasaApod />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
