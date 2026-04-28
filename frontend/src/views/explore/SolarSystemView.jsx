import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Moon, Maximize2, FastForward, Target, Lock, Unlock } from 'lucide-react';
import { planetsData } from '@/data/planetsData';
import { Link } from 'react-router-dom';
import { useGamificationStore } from '@/store/useGamificationStore';

// --- 3D Components ---

const SUN_RADIUS = 5.5;

const Sun = () => {
  const coronaRef = useRef(null);
  
  useFrame(({ clock }) => {
    if (coronaRef.current) {
      coronaRef.current.rotation.z = clock.elapsedTime * 0.1;
      coronaRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[SUN_RADIUS, 96, 96]} />
        <meshStandardMaterial 
          color="#ffcc00" 
          emissive="#ffaa00" 
          emissiveIntensity={5} 
          toneMapped={false} 
        />
        <pointLight intensity={6} distance={520} decay={1.45} color="#fff8e7" castShadow shadow-mapSize={[2048, 2048]} />
        <ambientLight intensity={0.03} />
      </mesh>
      
      {/* Sun Corona / Glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[SUN_RADIUS * 1.12, 80, 80]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.22} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.28, 48, 48]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const Planet = ({ data, timeScale, onClick, isSelected, isUnlocked }) => {
  const groupRef = useRef(null);
  const planetRef = useRef(null);
  const cloudsRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Random starting angle
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const angleRef = useRef(initialAngle);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Orbit rotation
      angleRef.current += data.speed * timeScale * delta * 50;
      groupRef.current.position.x = Math.cos(angleRef.current) * data.distance;
      groupRef.current.position.z = Math.sin(angleRef.current) * data.distance;
    }
    if (planetRef.current) {
      // Axial rotation
      planetRef.current.rotation.y += data.rotationSpeed * timeScale * delta * 50;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster
      cloudsRef.current.rotation.y += data.rotationSpeed * timeScale * delta * 60;
    }
  });

  const isEarth = data.id === 'earth';

  return (
    <group>
      {/* Orbit Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
        <meshBasicMaterial color={isUnlocked ? "#ffffff" : "#ff0000"} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>
        <mesh
          ref={planetRef}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onClick(data);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshPhysicalMaterial 
            color={isUnlocked ? data.color : '#333333'} 
            roughness={isEarth ? 0.4 : 0.7} 
            metalness={isEarth ? 0.1 : 0.2}
            clearcoat={isEarth ? 0.3 : 0.1}
            clearcoatRoughness={0.1}
            emissive={hovered || isSelected ? new THREE.Color(isUnlocked ? data.color : '#550000') : new THREE.Color(0x000000)}
            emissiveIntensity={hovered || isSelected ? 0.5 : 0}
          />
          
          {/* Earth Clouds Simulation */}
          {isEarth && isUnlocked && (
            <mesh ref={cloudsRef}>
              <sphereGeometry args={[data.radius * 1.015, 64, 64]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.4} 
                roughness={1} 
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}

          {/* Atmospheric Glow (All planets) */}
          <mesh>
            <sphereGeometry args={[data.radius * 1.1, 64, 64]} />
            <meshBasicMaterial 
              color={isUnlocked ? data.color : '#ff0000'} 
              transparent 
              opacity={0.1} 
              blending={THREE.AdditiveBlending} 
              side={THREE.BackSide} 
            />
          </mesh>

          {/* Rings */}
          {data.hasRings && (
            <group rotation={[Math.PI / 2.2, 0, 0]}>
              <mesh castShadow receiveShadow>
                <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 128]} />
                <meshPhysicalMaterial 
                  color={isUnlocked ? data.ringColor : '#555555'} 
                  transparent 
                  opacity={0.6} 
                  side={THREE.DoubleSide} 
                  roughness={0.3}
                  metalness={0.2}
                />
              </mesh>
              {/* Subtle outer ring */}
              <mesh>
                <ringGeometry args={[data.radius * 2.25, data.radius * 2.4, 128]} />
                <meshBasicMaterial color={isUnlocked ? data.ringColor : '#555555'} transparent opacity={0.2} side={THREE.DoubleSide} />
              </mesh>
            </group>
          )}
        </mesh>

        {/* Label */}
        <Html distanceFactor={15} position={[0, data.radius + 0.8, 0]} center zIndexRange={[100, 0]}>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md transition-all duration-300 ${hovered || isSelected ? 'bg-white/20 text-white backdrop-blur-md scale-110' : 'text-white/50 scale-100 pointer-events-none'}`}>
            {!isUnlocked && <Lock className="w-3 h-3 text-red-400" />}
            {data.name}
          </div>
        </Html>
      </group>
    </group>
  );
};

// --- Main View Component ---

export default function SolarSystemView() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [timeScale, setTimeScale] = useState(1);
  const { level } = useGamificationStore();

  // Simple logic: unlock planets based on level.
  // Mercury (lvl 1), Venus (lvl 2), Earth (lvl 3), Mars (lvl 4), etc.
  const getRequiredLevel = (index) => index + 1;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 36, 72], fov: 42 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <color attach="background" args={['#02040c']} />
          <fog attach="fog" args={['#02040c', 90, 260]} />
          <Stars radius={160} depth={70} count={12000} factor={4.2} saturation={0.42} fade speed={0.85} />
          
          <Sun />
          
          {planetsData.map((planet, index) => (
            <Planet 
              key={planet.id} 
              data={planet} 
              timeScale={timeScale} 
              onClick={setSelectedPlanet}
              isSelected={selectedPlanet?.id === planet.id}
              isUnlocked={level >= getRequiredLevel(index)}
            />
          ))}

          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={220}
            minDistance={12}
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.85} mipmapBlur intensity={1.85} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-20 left-4 z-10 pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Galaxy map — <span className="text-neon-blue">solar system</span></h1>
        <p className="text-gray-300 drop-shadow-md max-w-md">Drag to orbit, scroll to zoom. The Sun is scaled large so you can feel its dominance; planet orbits are educational spacing. Tap a world for facts and missions.</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 glass px-6 py-4 rounded-full flex items-center gap-4">
        <FastForward className="w-5 h-5 text-neon-blue" />
        <span className="text-sm font-bold w-24">Time Speed: {timeScale.toFixed(1)}x</span>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          value={timeScale} 
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-32 accent-neon-blue"
        />
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-24 right-4 md:right-8 w-80 glass p-6 rounded-2xl z-20 border border-white/10 shadow-2xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 150px)' }}
          >
            <button 
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 10px ${selectedPlanet.color}` }} />
              <h2 className="text-3xl font-bold text-white">{selectedPlanet.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Maximize2 className="w-4 h-4" />
                    <span>Diameter</span>
                  </div>
                  <span className="font-mono text-neon-blue">{selectedPlanet.diameter}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Moon className="w-4 h-4" />
                    <span>Moons</span>
                  </div>
                  <span className="font-mono text-neon-purple">{selectedPlanet.moons}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Mission Briefing
                </h3>
                <ul className="space-y-2">
                  {selectedPlanet.facts.map((fact, idx) => (
                    <li key={idx} className="text-sm text-gray-200 flex items-start gap-2">
                      <span className="text-neon-blue mt-1">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-auto">
              {(() => {
                const planetIndex = planetsData.findIndex(p => p.id === selectedPlanet.id);
                const reqLvl = getRequiredLevel(planetIndex);
                const isUnlocked = level >= reqLvl;

                if (isUnlocked) {
                  return (
                    <Link 
                      to={`/unit/${selectedPlanet.id}`}
                      className="w-full py-3 bg-neon-blue text-space-900 font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 box-glow-blue"
                    >
                      <Target className="w-5 h-5" /> Start Mission
                    </Link>
                  );
                } else {
                  return (
                    <div className="w-full py-3 bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" /> Requires Level {reqLvl}
                    </div>
                  );
                }
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
