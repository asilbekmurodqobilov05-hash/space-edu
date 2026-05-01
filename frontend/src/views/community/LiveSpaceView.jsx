import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Satellite, Globe2, Gauge, Crosshair, Search, ShieldAlert, Activity, Database } from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGamificationStore } from '@/store/useGamificationStore';

// --- MOCK DATA GENERATOR (API-less Simulation) ---
const generateMockSatellites = () => {
  const sats = [];
  const TOTAL = 8000;
  
  // ISS Base Station
  sats.push({
    id: 'iss-zarya',
    name: 'ISS (Zarya)',
    type: 'ISS',
    r: 2.06,
    i: 0.9,
    omega: 0,
    theta: 0,
    speed: 0.002,
    color: new THREE.Color('#ff0055')
  });

  // Starlink constellations (trains)
  for(let train=0; train<40; train++) {
    const r = 2.08 + Math.random() * 0.03;
    const i = (Math.random() * Math.PI) / 1.2;
    const omega = Math.random() * Math.PI * 2;
    for(let j=0; j<60; j++) {
      sats.push({
        id: `starlink-${train}-${j}`,
        name: `STARLINK-${train * 60 + j}`,
        type: 'Starlink',
        r, i, omega,
        theta: (j * 0.015), 
        speed: 0.0015 + (Math.random() * 0.0001),
        color: new THREE.Color('#00ffff')
      });
    }
  }

  // Other Random Satellites (LEO, MEO, GEO)
  while(sats.length < TOTAL) {
    const isMEO = Math.random() > 0.85;
    const isGEO = Math.random() > 0.95;
    const r = isGEO ? 6 : isMEO ? 3 + Math.random()*1.5 : 2.1 + Math.random() * 0.3;
    sats.push({
      id: `sat-${sats.length}`,
      name: isGEO ? `GEO-COM-${sats.length}` : `LEO-SAT-${sats.length}`,
      type: isGEO ? 'GEO' : isMEO ? 'MEO' : 'LEO',
      r,
      i: Math.random() * Math.PI,
      omega: Math.random() * Math.PI * 2,
      theta: Math.random() * Math.PI * 2,
      speed: (0.0005 + Math.random() * 0.001) * (2 / r),
      color: new THREE.Color(isGEO ? '#ffaa00' : isMEO ? '#bbbbbb' : '#1e3a8a')
    });
  }
  return sats;
}

// --- 3D Components ---

const EarthAndSatellites = ({ activeSatellites, selectedSatId }) => {
  const earthRef = useRef(null);
  const pointsRef = useRef(null);
  const glowPointsRef = useRef(null);
  
  // Textures for a sleek, dark mode Earth matching satellitemap.space aesthetics
  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [
    'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  ]);

  const positions = useMemo(() => new Float32Array(activeSatellites.length * 3), [activeSatellites]);
  const colors = useMemo(() => {
    const cols = new Float32Array(activeSatellites.length * 3);
    for (let i = 0; i < activeSatellites.length; i++) {
      cols[i * 3] = activeSatellites[i].color.r;
      cols[i * 3 + 1] = activeSatellites[i].color.g;
      cols[i * 3 + 2] = activeSatellites[i].color.b;
    }
    return cols;
  }, [activeSatellites]);

  // High performance orbital calculation without external TLE propagation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0002; 
    }
    
    if (activeSatellites.length > 0 && pointsRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array;
      const glowArray = glowPointsRef.current?.geometry.attributes.position.array;
      
      for (let i = 0; i < activeSatellites.length; i++) {
        const sat = activeSatellites[i];
        sat.theta += sat.speed;
        
        // Spherical to Cartesian with inclination and RAAN
        const x1 = sat.r * Math.cos(sat.theta);
        const z1 = sat.r * Math.sin(sat.theta);
        
        const y2 = z1 * Math.sin(sat.i);
        const z2 = z1 * Math.cos(sat.i);
        const x2 = x1;

        const x3 = x2 * Math.cos(sat.omega) + z2 * Math.sin(sat.omega);
        const z3 = -x2 * Math.sin(sat.omega) + z2 * Math.cos(sat.omega);

        positionsArray[i * 3] = x3;
        positionsArray[i * 3 + 1] = y2;
        positionsArray[i * 3 + 2] = z3;
        
        if (glowArray) {
           glowArray[i * 3] = x3;
           glowArray[i * 3 + 1] = y2;
           glowArray[i * 3 + 2] = z3;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      if(glowPointsRef.current) glowPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const selectedSat = useMemo(() => activeSatellites.find(s => s.id === selectedSatId), [selectedSatId, activeSatellites]);

  return (
    <group>
      {/* Dark Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          color="#aaaaaa"
          emissive="#050505"
          specular={new THREE.Color('#222222')}
          shininess={15}
        />
      </mesh>
      
      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[2.03, 64, 64]} />
        <meshPhongMaterial 
          color="#0066ff" 
          transparent 
          opacity={0.12} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Satellites Core Layer */}
      {activeSatellites.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={activeSatellites.length} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={activeSatellites.length} array={colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.012} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} />
        </points>
      )}

      {/* Satellites Bloom Layer */}
      {activeSatellites.length > 0 && (
        <points ref={glowPointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={activeSatellites.length} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={activeSatellites.length} array={colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.035} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      )}

      {/* Selected Orbit Visualization */}
      {selectedSat && <SelectedOrbitRing sat={selectedSat} />}

      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 5, -10]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-10, -5, 10]} intensity={0.4} color="#0055ff" />
    </group>
  );
};

const SelectedOrbitRing = ({ sat }) => {
  const orbitPoints = useMemo(() => {
    const points = [];
    for(let i=0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2;
      const x1 = sat.r * Math.cos(theta);
      const z1 = sat.r * Math.sin(theta);
      const y2 = z1 * Math.sin(sat.i);
      const z2 = z1 * Math.cos(sat.i);
      const x3 = x1 * Math.cos(sat.omega) + z2 * Math.sin(sat.omega);
      const z3 = -x1 * Math.sin(sat.omega) + z2 * Math.cos(sat.omega);
      points.push(new THREE.Vector3(x3, y2, z3));
    }
    return points;
  }, [sat]);

  const markerRef = useRef();

  useFrame(() => {
    if(markerRef.current) {
        const x1 = sat.r * Math.cos(sat.theta);
        const z1 = sat.r * Math.sin(sat.theta);
        const y2 = z1 * Math.sin(sat.i);
        const z2 = z1 * Math.cos(sat.i);
        const x3 = x1 * Math.cos(sat.omega) + z2 * Math.sin(sat.omega);
        const z3 = -x1 * Math.sin(sat.omega) + z2 * Math.cos(sat.omega);
        markerRef.current.position.set(x3, y2, z3);
    }
  });

  return (
    <group>
      <Line points={orbitPoints} color={sat.color.getHexString()} opacity={0.5} transparent lineWidth={2.5} />
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={sat.color} />
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={sat.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
    </group>
  );
};

// --- MAIN VIEW UI ---

export default function LiveSpaceView() {
  const { addXp } = useGamificationStore();
  const [activeSatellites, setActiveSatellites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSatId, setSelectedSatId] = useState(null);
  
  // Real-time counter for UI tick
  const [, setTick] = useState(0);

  useEffect(() => {
    addXp(20);
    const mockData = generateMockSatellites();
    setActiveSatellites(mockData);
    
    // Default select ISS
    const iss = mockData.find(s => s.type === 'ISS');
    if(iss) setSelectedSatId(iss.id);

    const int = setInterval(() => setTick(t => t+1), 100); 
    return () => clearInterval(int);
  }, [addXp]);

  const filteredSats = useMemo(() => {
    if(!searchQuery) return activeSatellites.filter(s => s.type === 'ISS' || s.type === 'Starlink').slice(0, 50); 
    return activeSatellites.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 100);
  }, [searchQuery, activeSatellites]);

  const selectedSat = useMemo(() => activeSatellites.find(s => s.id === selectedSatId), [selectedSatId, activeSatellites]);

  const stats = useMemo(() => {
    return {
      total: activeSatellites.length,
      starlink: activeSatellites.filter(s => s.type === 'Starlink').length,
      leo: activeSatellites.filter(s => s.type === 'LEO' || s.type === 'ISS').length,
      geo: activeSatellites.filter(s => s.type === 'GEO').length
    };
  }, [activeSatellites]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020205] overflow-hidden text-white font-sans selection:bg-neon-blue/30 pt-16">
      
      {/* --- 3D CANVAS BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <color attach="background" args={['#010103']} />
          <Stars radius={100} depth={50} count={5000} factor={3} saturation={0} fade speed={0.5} />
          
          <Suspense fallback={null}>
            <EarthAndSatellites activeSatellites={activeSatellites} selectedSatId={selectedSatId} />
          </Suspense>

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.15} mipmapBlur intensity={1.8} />
          </EffectComposer>

          <OrbitControls 
            enablePan={true} 
            panSpeed={0.5} 
            minDistance={2.5} 
            maxDistance={12} 
            autoRotate 
            autoRotateSpeed={0.2} 
            dampingFactor={0.05} 
          />
        </Canvas>
      </div>

      {/* --- HUD UI OVERLAY --- */}
      <div className="absolute inset-0 pt-20 pb-4 px-4 sm:px-6 z-10 pointer-events-none flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 pointer-events-auto shadow-[0_0_30px_rgba(0,240,255,0.05)]"
          >
            <div className="flex items-center gap-3 mb-1">
              <Globe2 className="w-6 h-6 text-neon-blue" />
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Orbital <span className="text-neon-blue">Map</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neon-blue font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
              Simulation Active
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 sm:gap-4 pointer-events-auto"
          >
            <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-xl px-4 py-2 flex flex-col items-end shadow-lg">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Objects Tracked</span>
              <span className="text-lg font-mono font-bold text-white">{stats.total.toLocaleString()}</span>
            </div>
            <div className="hidden sm:flex backdrop-blur-xl bg-black/50 border border-white/10 rounded-xl px-4 py-2 flex-col items-end shadow-lg">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Starlink DB</span>
              <span className="text-lg font-mono font-bold text-neon-blue">{stats.starlink.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Middle Section (Sidebars) */}
        <div className="flex justify-between items-end flex-1 my-4 gap-4">
          
          {/* Left Panel - Satellite Info & Target */}
          <div className="w-full max-w-sm pointer-events-auto flex flex-col gap-4">
            
            <AnimatePresence mode="popLayout">
              {selectedSat && (
                <motion.div 
                  key="target-info"
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="backdrop-blur-2xl bg-black/60 border border-neon-blue/30 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] text-neon-blue font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Crosshair className="w-3 h-3" /> Target Locked
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-wider truncate max-w-[200px]">{selectedSat.name}</h3>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <Satellite className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-neon-blue/30 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                        <Activity className="w-3.5 h-3.5 text-neon-purple" /> Alt (Radius)
                      </div>
                      <div className="font-mono text-sm text-white group-hover:text-neon-purple transition-colors">
                        {((selectedSat.r - 2) * 6371).toFixed(1)} <span className="text-gray-500 text-[10px]">km</span>
                      </div>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-neon-blue/30 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                        <Gauge className="w-3.5 h-3.5 text-orange-400" /> Velocity
                      </div>
                      <div className="font-mono text-sm text-white group-hover:text-orange-400 transition-colors">
                        {(selectedSat.speed * 1000000).toFixed(0)} <span className="text-gray-500 text-[10px]">km/h</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 flex flex-col">
                        <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Inclination</span>
                        <span className="font-mono text-sm text-white">{(selectedSat.i * (180/Math.PI)).toFixed(2)}°</span>
                      </div>
                      <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 flex flex-col">
                        <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Class</span>
                        <span className="font-bold text-sm text-white uppercase">{selectedSat.type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl flex flex-col h-[350px] shadow-2xl"
            >
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search constellation..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pl-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors font-mono"
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredSats.map(sat => (
                  <button
                    key={sat.id}
                    onClick={() => setSelectedSatId(sat.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                      selectedSatId === sat.id 
                        ? 'bg-neon-blue/20 border border-neon-blue/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                        : 'bg-transparent border border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sat.color.getStyle(), boxShadow: `0 0 10px ${sat.color.getStyle()}` }}></div>
                    <div className="truncate flex-grow">
                      <div className={`font-mono text-xs font-bold truncate transition-colors ${selectedSatId === sat.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {sat.name}
                      </div>
                      <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{sat.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Legend & Extra Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col gap-4 w-64 pointer-events-auto"
          >
            <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-5 shadow-2xl">
               <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
                 <Database className="w-4 h-4" /> Orbital Legend
               </h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-[#00ffff] shadow-[0_0_12px_#00ffff]"></div>
                   <span className="text-xs font-mono font-bold text-gray-200 tracking-wider">Starlink / LEO</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-[#ffaa00] shadow-[0_0_12px_#ffaa00]"></div>
                   <span className="text-xs font-mono font-bold text-gray-200 tracking-wider">GEO Satellites</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-[#ff0055] shadow-[0_0_12px_#ff0055]"></div>
                   <span className="text-xs font-mono font-bold text-gray-200 tracking-wider">ISS Station</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-[#bbbbbb] shadow-[0_0_12px_#bbbbbb]"></div>
                   <span className="text-xs font-mono font-bold text-gray-200 tracking-wider">MEO / Deep Space</span>
                 </div>
               </div>
            </div>

            <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-gray-400 shadow-2xl">
              <ShieldAlert className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider mb-1">Collision Check</div>
                <div className="font-mono text-[10px] text-green-400 font-bold">SYSTEM NOMINAL</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

