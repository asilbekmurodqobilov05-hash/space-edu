import { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Maximize2, FastForward, Play, Pause, Rewind, Calendar, Thermometer, Weight, Wind, Globe2 } from 'lucide-react';
import { celestialBodies, moons } from '@/data/solarSystemData';
import { calculatePosition } from '@/lib/astronomy';
import AsteroidBelt from '@/components/game/AsteroidBelt';

// --- Utils & Scaling ---
// 1 AU = 40 units
const DISTANCE_SCALE = 40;
const SUN_DISPLAY_RADIUS = 6;

// Visually pleasing non-linear size scaling based on actual radius (km)
const getDisplayRadius = (actualRadius) => {
  if (actualRadius > 100000) return SUN_DISPLAY_RADIUS; // Sun
  return Math.max(0.2, (Math.log10(actualRadius) - 2.5) * 0.8);
};

// --- 3D Components ---

const OrbitPath = ({ orbit, color }) => {
  const points = useMemo(() => {
    if (!orbit) return [];
    const pts = [];
    const segments = 128;
    // Fast mock of the orbit path
    for (let i = 0; i <= segments; i++) {
      const M0_mock = (360 / segments) * i;
      const pos = calculatePosition({ ...orbit, M0: M0_mock, n: 0 }, new Date('2000-01-01').getTime());
      pts.push(new THREE.Vector3(pos[0] * DISTANCE_SCALE, pos[2] * DISTANCE_SCALE, -pos[1] * DISTANCE_SCALE)); 
      // note mapping: Z is up in astronomy helper but we use Y up in 3JS, so z -> y, y -> -z
    }
    return pts;
  }, [orbit]);

  if (!orbit || points.length === 0) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  );
};

const DUMMY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

const CelestialBody = ({ data, currentDate, isSelected, onClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const displayRadius = getDisplayRadius(data.radius);
  const texMap = useTexture(data.texture || DUMMY_TEX);
  const texClouds = useTexture(data.textureClouds || DUMMY_TEX);
  const texSpecular = useTexture(data.textureSpecular || DUMMY_TEX);
  const texNormal = useTexture(data.textureNormal || DUMMY_TEX);
  const texRing = useTexture(data.textureRing || DUMMY_TEX);
  const cloudsRef = useRef();

  useFrame(() => {
    if (data.orbit) {
      const pos = calculatePosition(data.orbit, currentDate.getTime());
      // map astronomy [x,y,z] to 3JS [x,y,z]
      groupRef.current.position.set(pos[0] * DISTANCE_SCALE, pos[2] * DISTANCE_SCALE, -pos[1] * DISTANCE_SCALE);
    }
    if (meshRef.current) {
      // Axial rotation based on current date (approximate)
      const days = currentDate.getTime() / (1000 * 60 * 60 * 24);
      meshRef.current.rotation.y = days * 0.5; // generic rotation
      if (data.axialTilt) {
        meshRef.current.rotation.z = data.axialTilt * (Math.PI / 180);
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y = days * 0.55; // clouds rotate slightly faster
        cloudsRef.current.rotation.z = data.axialTilt * (Math.PI / 180);
      }
    }
  });

  const isSun = data.type === 'star';

  return (
    <group>
      {data.orbit && <OrbitPath orbit={data.orbit} color={data.color} />}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          castShadow={!isSun}
          receiveShadow={!isSun}
          onClick={(e) => { e.stopPropagation(); onClick(data, groupRef); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[displayRadius, 64, 64]} />
          {isSun ? (
            <meshBasicMaterial color={data.color} map={data.texture ? texMap : null} />
          ) : (
            <meshStandardMaterial 
              color={data.texture ? '#ffffff' : data.color} 
              map={data.texture ? texMap : null}
              normalMap={data.textureNormal ? texNormal : null}
              roughnessMap={data.textureSpecular ? null : undefined} // if specular map is used, use it to infer roughness 
              roughness={data.id === 'earth' ? 0.6 : 0.8}
              metalness={data.id === 'earth' ? 0.1 : 0.05}
              emissive={hovered || isSelected ? data.color : '#000000'}
              emissiveIntensity={hovered || isSelected ? 0.2 : 0}
            />
          )}

          {/* Earth Clouds */}
          {data.textureClouds && (
            <mesh ref={cloudsRef}>
              <sphereGeometry args={[displayRadius * 1.006, 64, 64]} />
              <meshStandardMaterial 
                map={texClouds}
                transparent={true}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Atmospheric Glow (especially for Earth) */}
          {data.atmosphere && data.id !== 'moon' && (
            <mesh>
              <sphereGeometry args={[displayRadius * 1.02, 64, 64]} />
              <meshBasicMaterial 
                color={data.id === 'earth' ? '#4b90ff' : data.color} 
                transparent 
                opacity={data.id === 'earth' ? 0.15 : 0.05} 
                blending={THREE.AdditiveBlending} 
                side={THREE.BackSide} 
              />
            </mesh>
          )}

          {/* Rings */}
          {data.hasRings && (
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <ringGeometry args={[displayRadius * 1.4, displayRadius * 2.2, 128]} />
              <meshStandardMaterial 
                color={data.textureRing ? '#ffffff' : data.color} 
                map={data.textureRing ? texRing : null}
                transparent 
                opacity={data.textureRing ? 0.9 : 0.6} 
                side={THREE.DoubleSide} 
                roughness={0.4}
              />
            </mesh>
          )}

          {/* Sun Glow and Light */}
          {isSun && (
            <>
              <pointLight intensity={6} distance={DISTANCE_SCALE * 200} decay={1.0} color="#fff8e7" castShadow shadow-mapSize={[4096, 4096]} />
              <mesh>
                <sphereGeometry args={[displayRadius * 1.2, 64, 64]} />
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
              </mesh>
            </>
          )}
        </mesh>

        {/* Label */}
        <Html distanceFactor={25} position={[0, displayRadius + 0.5, 0]} center zIndexRange={[100, 0]}>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition-all duration-300 ${hovered || isSelected ? 'text-white backdrop-blur-md bg-white/10 scale-110' : 'text-white/40 scale-100 pointer-events-none'}`}>
            {data.name}
          </div>
        </Html>
        
        <MoonsSystem parentGroupRef={groupRef} moonsData={moons.filter(m => m.parent === data.id)} currentDate={currentDate} />
      </group>
    </group>
  );
};

const MoonsSystem = ({ parentGroupRef, moonsData, currentDate }) => {
  // We attach moons relative to their parent's position but scaled down
  // Since we don't have full keplerian elements for moons in data yet, we approximate circular orbits
  return moonsData.map(moon => (
    <MoonObj key={moon.id} data={moon} parentGroupRef={parentGroupRef} currentDate={currentDate} />
  ));
};

const MoonObj = ({ data, parentGroupRef, currentDate }) => {
  const meshRef = useRef();
  const displayRadius = getDisplayRadius(data.radius) * 0.4; // make moons smaller
  const orbitRadius = data.distance * DISTANCE_SCALE * 15; // exaggerate distance for visibility
  const texMap = useTexture(data.texture || DUMMY_TEX);

  useFrame(() => {
    if (parentGroupRef.current && meshRef.current) {
      const days = currentDate.getTime() / (1000 * 60 * 60 * 24);
      const angle = days * data.speed * (Math.PI / 180);
      
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      
      meshRef.current.position.set(
        parentGroupRef.current.position.x + x,
        parentGroupRef.current.position.y,
        parentGroupRef.current.position.z + z
      );
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[displayRadius, 32, 32]} />
      <meshStandardMaterial color={data.texture ? '#ffffff' : data.color} map={data.texture ? texMap : null} roughness={0.8} />
    </mesh>
  );
};


// Camera Controller
const CameraController = ({ targetObject, orbitControlsRef, selectedObj }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const prevTargetPos = useRef(new THREE.Vector3());
  const isFlyingRef = useRef(false);

  useEffect(() => {
    if (targetObject && selectedObj) {
      targetObject.getWorldPosition(prevTargetPos.current);
      isFlyingRef.current = true;
    } else {
      isFlyingRef.current = false;
    }
  }, [targetObject, selectedObj]);

  useFrame(() => {
    if (!orbitControlsRef.current) return;
    
    if (targetObject) {
      targetObject.getWorldPosition(targetPos.current);
      
      // Calculate planet movement delta
      const deltaPos = targetPos.current.clone().sub(prevTargetPos.current);
      
      // Move camera along with the planet to maintain relative position
      camera.position.add(deltaPos);

      // Fly to planet initially
      if (isFlyingRef.current) {
        const radius = getDisplayRadius(selectedObj.radius);
        const desiredDistance = radius * 8; // Optimal viewing distance
        const currentDistance = camera.position.distanceTo(targetPos.current);
        
        // Smoothly lerp camera position closer to the planet
        if (currentDistance > desiredDistance * 1.05) {
          const dir = camera.position.clone().sub(targetPos.current).normalize();
          const targetCamPos = targetPos.current.clone().add(dir.multiplyScalar(desiredDistance));
          camera.position.lerp(targetCamPos, 0.08); // Speed of zoom
        } else {
          isFlyingRef.current = false;
        }
      }
      
      // Keep orbit controls target locked to planet
      orbitControlsRef.current.target.copy(targetPos.current);
      
      prevTargetPos.current.copy(targetPos.current);
    }
  });

  return null;
};

// --- Main View Component ---

export default function SolarSystemView() {
  const [selectedObj, setSelectedObj] = useState(null);
  const [targetGroupRef, setTargetGroupRef] = useState(null);
  const orbitControlsRef = useRef();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeScale, setTimeScale] = useState(1); // days per second
  const [isPlaying, setIsPlaying] = useState(true);

  // Update date based on timeScale using standard rAF instead of useFrame 
  // since this component renders the Canvas and isn't inside it
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const updateDate = (time) => {
      if (isPlaying) {
        const delta = (time - lastTime) / 1000; // in seconds
        setCurrentDate(prev => new Date(prev.getTime() + delta * timeScale * 24 * 60 * 60 * 1000));
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(updateDate);
    };

    animationFrameId = requestAnimationFrame(updateDate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, timeScale]);

  const handleSelect = (data, groupRef) => {
    setSelectedObj(data);
    setTargetGroupRef(groupRef);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 80, 150], fov: 45, far: 15000 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, alpha: false }}>
          <color attach="background" args={['#010204']} />
          <ambientLight intensity={0.4} />
          <hemisphereLight skyColor="#ffffff" groundColor="#000000" intensity={0.2} />
          
          <Suspense fallback={null}>
            <Stars radius={3000} depth={1000} count={15000} factor={8} saturation={0.5} fade speed={0.5} />
            
            <group>
              {celestialBodies.map((body) => (
                <CelestialBody 
                  key={body.id} 
                  data={body} 
                  currentDate={currentDate}
                  isSelected={selectedObj?.id === body.id}
                  onClick={handleSelect}
                />
              ))}
              
              <AsteroidBelt 
                count={3000} 
                innerRadius={2.2 * DISTANCE_SCALE} 
                outerRadius={3.2 * DISTANCE_SCALE} 
                timeScale={isPlaying ? timeScale : 0} 
              />
            </group>

            <OrbitControls 
              ref={orbitControlsRef}
              enablePan={!selectedObj} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={8000}
              minDistance={2}
            />
            <CameraController targetObject={targetGroupRef?.current} orbitControlsRef={orbitControlsRef} selectedObj={selectedObj} />

            <EffectComposer multisampling={0} disableNormalPass>
              <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
              <ChromaticAberration offset={[0.001, 0.001]} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Header UI */}
      <div className="absolute top-20 left-6 z-10 pointer-events-none">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
          <Globe2 className="w-8 h-8 text-neon-purple" />
          SOLAR SYSTEM <span className="text-neon-purple text-xl font-medium mt-2">REAL-TIME</span>
        </h1>
        <p className="text-white/60 mt-1 max-w-md text-sm leading-relaxed backdrop-blur-sm bg-black/20 p-2 rounded-lg border border-white/5">
          Live Keplerian orbital simulation. Data provided by NASA JPL Horizons.
        </p>
      </div>

      {/* Time Controls Panel */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 glass-panel px-6 py-3 rounded-2xl flex items-center gap-6 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col items-center min-w-[140px]">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Current Date</span>
          <span className="text-neon-blue font-mono font-bold tracking-tight">
            {currentDate.toISOString().split('T')[0]}
          </span>
        </div>
        
        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex items-center gap-2">
          <button onClick={() => setTimeScale(1/86400)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeScale === 1/86400 ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}>
            LIVE
          </button>
          <button onClick={() => setTimeScale(1)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeScale === 1 ? 'bg-neon-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}>
            1 DAY/S
          </button>
          <button onClick={() => setTimeScale(30)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeScale === 30 ? 'bg-neon-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}>
            1 MO/S
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex items-center gap-3">
          <button onClick={() => setTimeScale(s => s < 0 ? s * 2 : -1)} className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors">
            <Rewind className="w-4 h-4" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple border border-neon-purple/30 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
          </button>
          <button onClick={() => setTimeScale(s => s > 0 ? (s === 1/86400 ? 1 : s * 2) : 1)} className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors">
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Speed</span>
          <span className="text-white font-mono text-xs">
            {timeScale === 1/86400 ? 'REAL TIME' : `${timeScale > 0 ? '+' : ''}${timeScale.toFixed(timeScale < 1 ? 2 : 0)} d/s`}
          </span>
        </div>
      </div>

      {/* Planet Info Panel */}
      <AnimatePresence>
        {selectedObj && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="absolute top-24 right-6 w-80 glass-panel p-1 rounded-2xl z-20 border border-white/10 shadow-2xl bg-black/60 backdrop-blur-2xl"
          >
            <div className="relative p-5">
              <button 
                onClick={() => { setSelectedObj(null); setTargetGroupRef(null); }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full shadow-inner border-2 border-white/10 flex items-center justify-center overflow-hidden bg-black/50" style={{ boxShadow: `0 0 20px ${selectedObj.color}40` }}>
                   <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedObj.color }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{selectedObj.type}</div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{selectedObj.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <Maximize2 className="w-4 h-4 text-white/40 mb-2" />
                  <div className="text-[10px] uppercase text-white/50 mb-0.5">Radius</div>
                  <div className="font-mono text-sm text-white">{selectedObj.radius.toLocaleString()} km</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <Thermometer className="w-4 h-4 text-white/40 mb-2" />
                  <div className="text-[10px] uppercase text-white/50 mb-0.5">Temp</div>
                  <div className="font-mono text-sm text-white">{selectedObj.temperature || 'N/A'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <Weight className="w-4 h-4 text-white/40 mb-2" />
                  <div className="text-[10px] uppercase text-white/50 mb-0.5">Mass</div>
                  <div className="font-mono text-xs text-white truncate">{selectedObj.mass ? `${selectedObj.mass} kg` : 'N/A'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <Wind className="w-4 h-4 text-white/40 mb-2" />
                  <div className="text-[10px] uppercase text-white/50 mb-0.5">Atmosphere</div>
                  <div className="text-xs text-white truncate" title={selectedObj.atmosphere}>{selectedObj.atmosphere || 'None'}</div>
                </div>
                {selectedObj.gravity && (
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 col-span-2">
                    <div className="text-[10px] uppercase text-white/50 mb-0.5">Gravity</div>
                    <div className="font-mono text-sm text-white">{selectedObj.gravity}</div>
                  </div>
                )}
              </div>

              {selectedObj.orbit && (
                <div className="bg-neon-purple/10 border border-neon-purple/20 rounded-xl p-4 mb-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-neon-purple font-bold mb-3 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Orbital Parameters
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Distance from Sun</span>
                      <span className="font-mono text-white">{(selectedObj.orbit.a * 149.6).toFixed(1)} M km</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Orbital Period</span>
                      <span className="font-mono text-white">{(360 / selectedObj.orbit.n / 365.25).toFixed(2)} years</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Semi-major Axis</span>
                      <span className="font-mono text-white">{selectedObj.orbit.a} AU</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Eccentricity</span>
                      <span className="font-mono text-white">{selectedObj.orbit.e}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Inclination</span>
                      <span className="font-mono text-white">{selectedObj.orbit.i}°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
