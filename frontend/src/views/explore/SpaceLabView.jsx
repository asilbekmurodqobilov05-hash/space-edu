import { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Flame, Globe2, Sparkles, Info, Settings2, Play, Pause, RotateCcw, Satellite } from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useTranslation } from '@/hooks/useTranslation';

// --- Realistic Earth Component ---
const RealisticEarth = ({ radius = 5, position = [0, 0, 0] }) => {
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png'
  ]);

  const earthRef = useRef(null);
  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005;
  });

  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh ref={earthRef} receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.02}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={35}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius + 0.05, 64, 64]} />
        <meshPhongMaterial 
          color="#4ca6ff" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// --- Sub-modules ---

const RocketEngineeringLab = () => {
  const { t } = useTranslation();
  const [activePart, setActivePart] = useState(null);
  const [showInternals, setShowInternals] = useState(false);
  const [payloadType, setPayloadType] = useState('fairing');
  const [stage1Type, setStage1Type] = useState('standard');

  const parts = [
    { id: 'payload', name: t('lab', 'payload'), desc: t('lab', 'payloadDesc'), color: '#ffffff' },
    { id: 'stage2', name: t('lab', 'stage2'), desc: t('lab', 'stage2Desc'), color: '#dddddd' },
    { id: 'stage1', name: t('lab', 'stage1'), desc: t('lab', 'stage1Desc'), color: '#eeeeee' },
    { id: 'engine', name: t('lab', 'engine'), desc: t('lab', 'engineDesc'), color: '#555555' }
  ];

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings2 className="text-neon-blue" /> {t('lab', 'controls')}</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">{t('lab', 'payloadType')}</label>
              <div className="flex gap-2">
                <button onClick={() => setPayloadType('fairing')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${payloadType === 'fairing' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>{t('lab', 'fairing')}</button>
                <button onClick={() => setPayloadType('capsule')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${payloadType === 'capsule' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>{t('lab', 'capsule')}</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">{t('lab', 'boosterType')}</label>
              <div className="flex gap-2">
                <button onClick={() => setStage1Type('standard')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${stage1Type === 'standard' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>{t('lab', 'standard')}</button>
                <button onClick={() => setStage1Type('heavy')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${stage1Type === 'heavy' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>{t('lab', 'heavy')}</button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/10">
            <span className="text-gray-300">{t('lab', 'showInternals')}</span>
            <button 
              onClick={() => setShowInternals(!showInternals)}
              className={`w-12 h-6 rounded-full transition-colors relative ${showInternals ? 'bg-neon-blue' : 'bg-space-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${showInternals ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="space-y-2">
            {parts.map(part => (
              <button
                key={part.id}
                onClick={() => setActivePart(part.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${activePart === part.id ? 'border-neon-blue bg-neon-blue/20' : 'border-white/10 hover:bg-white/5'}`}
              >
                {part.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activePart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass p-6 rounded-2xl border border-neon-blue/30"
            >
              <h4 className="text-lg font-bold text-neon-blue mb-2">{parts.find(p => p.id === activePart)?.name}</h4>
              <p className="text-gray-300 text-sm">{parts.find(p => p.id === activePart)?.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-2/3 bg-space-900/50 rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
        <Canvas shadows camera={{ position: [0, 2, 12], fov: 45 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <group position={[0, -4, 0]}>
            {/* Payload */}
            {payloadType === 'fairing' ? (
              <group position={[0, 5.5, 0]} onClick={() => setActivePart('payload')}>
                <mesh position={[0, 2, 0]} castShadow receiveShadow>
                  <coneGeometry args={[1.2, 3, 32]} />
                  <meshPhysicalMaterial color={activePart === 'payload' ? '#00f0ff' : '#ffffff'} metalness={0.8} roughness={0.2} clearcoat={1} wireframe={showInternals} />
                </mesh>
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
                  <meshPhysicalMaterial color={activePart === 'payload' ? '#00f0ff' : '#ffffff'} metalness={0.8} roughness={0.2} clearcoat={1} wireframe={showInternals} />
                </mesh>
              </group>
            ) : (
              <group position={[0, 5.5, 0]} onClick={() => setActivePart('payload')}>
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                  <coneGeometry args={[0.8, 2, 32]} />
                  <meshPhysicalMaterial color={activePart === 'payload' ? '#00f0ff' : '#222222'} metalness={0.5} roughness={0.5} clearcoat={0.5} wireframe={showInternals} />
                </mesh>
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
                  <meshPhysicalMaterial color={activePart === 'payload' ? '#00f0ff' : '#ffffff'} metalness={0.8} roughness={0.2} clearcoat={1} wireframe={showInternals} />
                </mesh>
              </group>
            )}

            {/* Stage 2 */}
            <mesh position={[0, 4, 0]} onClick={() => setActivePart('stage2')} castShadow receiveShadow>
              <cylinderGeometry args={[1.2, 1.2, 2, 32]} />
              <meshPhysicalMaterial color={activePart === 'stage2' ? '#00f0ff' : '#cccccc'} metalness={0.9} roughness={0.3} clearcoat={0.5} wireframe={showInternals} />
            </mesh>

            {/* Stage 1 */}
            <group position={[0, 0.5, 0]} onClick={() => setActivePart('stage1')}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 1.2, 5, 32]} />
                <meshPhysicalMaterial color={activePart === 'stage1' ? '#00f0ff' : '#dddddd'} metalness={0.7} roughness={0.4} clearcoat={0.2} wireframe={showInternals} />
              </mesh>
              
              {stage1Type === 'heavy' && (
                <>
                  {/* Side Boosters */}
                  <mesh position={[2.5, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 1.2, 5, 32]} />
                    <meshPhysicalMaterial color={activePart === 'stage1' ? '#00f0ff' : '#dddddd'} metalness={0.7} roughness={0.4} clearcoat={0.2} wireframe={showInternals} />
                  </mesh>
                  <mesh position={[2.5, 3.5, 0]} castShadow receiveShadow>
                    <coneGeometry args={[1.2, 2, 32]} />
                    <meshPhysicalMaterial color={activePart === 'stage1' ? '#00f0ff' : '#dddddd'} metalness={0.7} roughness={0.4} clearcoat={0.2} wireframe={showInternals} />
                  </mesh>
                  
                  <mesh position={[-2.5, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 1.2, 5, 32]} />
                    <meshPhysicalMaterial color={activePart === 'stage1' ? '#00f0ff' : '#dddddd'} metalness={0.7} roughness={0.4} clearcoat={0.2} wireframe={showInternals} />
                  </mesh>
                  <mesh position={[-2.5, 3.5, 0]} castShadow receiveShadow>
                    <coneGeometry args={[1.2, 2, 32]} />
                    <meshPhysicalMaterial color={activePart === 'stage1' ? '#00f0ff' : '#dddddd'} metalness={0.7} roughness={0.4} clearcoat={0.2} wireframe={showInternals} />
                  </mesh>
                </>
              )}
              
              {/* Grid Fins */}
              <mesh position={[1.3, 2.0, 0]} castShadow>
                <boxGeometry args={[0.4, 0.1, 0.8]} />
                <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.5} wireframe={showInternals} />
              </mesh>
              <mesh position={[-1.3, 2.0, 0]} castShadow>
                <boxGeometry args={[0.4, 0.1, 0.8]} />
                <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.5} wireframe={showInternals} />
              </mesh>
            </group>

            {/* Engine */}
            <group position={[0, -2.2, 0]} onClick={() => setActivePart('engine')}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 0.8, 0.5, 32]} />
                <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#444444'} metalness={0.9} roughness={0.6} wireframe={showInternals} />
              </mesh>
              <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.6, 1, 0.8, 32]} />
                <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#222222'} metalness={0.9} roughness={0.7} wireframe={showInternals} />
              </mesh>
              
              {stage1Type === 'heavy' && (
                <>
                  <mesh position={[2.5, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 0.8, 0.5, 32]} />
                    <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#444444'} metalness={0.9} roughness={0.6} wireframe={showInternals} />
                  </mesh>
                  <mesh position={[2.5, -0.5, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.6, 1, 0.8, 32]} />
                    <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#222222'} metalness={0.9} roughness={0.7} wireframe={showInternals} />
                  </mesh>
                  
                  <mesh position={[-2.5, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 0.8, 0.5, 32]} />
                    <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#444444'} metalness={0.9} roughness={0.6} wireframe={showInternals} />
                  </mesh>
                  <mesh position={[-2.5, -0.5, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.6, 1, 0.8, 32]} />
                    <meshPhysicalMaterial color={activePart === 'engine' ? '#00f0ff' : '#222222'} metalness={0.9} roughness={0.7} wireframe={showInternals} />
                  </mesh>
                </>
              )}
            </group>
          </group>

          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          {t('lab', 'hintDrag')} — {t('lab', 'hintScroll')} — {t('lab', 'hintClick')}
        </div>
      </div>
    </div>
  );
};

const SmokeParticles = ({ active }) => {
  const groupRef = useRef(null);
  const particles = useMemo(() => Array.from({ length: 60 }).map(() => ({
    position: new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 2, (Math.random() - 0.5) * 2),
    scale: Math.random() * 2 + 1,
    velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, Math.random() * 0.2, (Math.random() - 0.5) * 0.1),
    life: Math.random()
  })), []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const mesh = child;
      const material = mesh.material;
      if (active) {
        p.life += 0.02;
        if (p.life > 1) {
          p.life = 0;
          mesh.position.set((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2);
        }
        mesh.position.add(p.velocity);
        mesh.scale.setScalar(p.scale * (1 - p.life));
        material.opacity = (1 - p.life) * 0.5;
      } else {
        material.opacity = Math.max(0, material.opacity - 0.05);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#dddddd" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

const LaunchAnimator = ({ launchState, rocketRef, stage1Ref, speed }) => {
  useFrame((state) => {
    if (launchState === 'launched') {
      const altitude = rocketRef.current?.position.y || 0;
      const shakeIntensity = Math.max(0, 0.1 - altitude * 0.002);
      
      // Camera shake
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 50) * shakeIntensity;
      state.camera.position.y = 5 + Math.cos(state.clock.elapsedTime * 45) * shakeIntensity;
      
      if (rocketRef.current) {
        rocketRef.current.position.y += 0.1 * speed;
        // Stage separation
        if (rocketRef.current.position.y > 15 && stage1Ref.current) {
          stage1Ref.current.position.y -= 0.15 * speed; // falls away relative to rocket
          stage1Ref.current.rotation.z += 0.01 * speed;
          stage1Ref.current.rotation.x += 0.005 * speed;
        }
      }
      
      // Camera follow
      state.camera.position.z = 15 + altitude * 0.2;
      state.camera.lookAt(0, altitude, 0);
    } else {
      state.camera.position.lerp(new THREE.Vector3(0, 5, 15), 0.1);
      if (launchState === 'idle' && rocketRef.current) {
        rocketRef.current.position.y = 0;
        if (stage1Ref.current) {
          stage1Ref.current.position.y = 2.5; // reset position
          stage1Ref.current.rotation.z = 0;
          stage1Ref.current.rotation.x = 0;
        }
      }
    }
  });
  return null;
};

const RocketLaunchSimulator = () => {
  const { t } = useTranslation();
  const [launchState, setLaunchState] = useState('idle');
  const [countdown, setCountdown] = useState(3);
  const [speed, setSpeed] = useState(1);
  const rocketRef = useRef(null);
  const stage1Ref = useRef(null);

  const handleLaunch = () => {
    if (launchState === 'idle') {
      setLaunchState('countdown');
      let count = 3;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          setLaunchState('launched');
        }
      }, 1000);
    } else {
      setLaunchState('idle');
      setCountdown(3);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Flame className="text-orange-500" /> {t('lab', 'launchControl')}</h3>
          
          <div className="flex justify-center mb-8 mt-4">
            <button 
              onClick={handleLaunch}
              disabled={launchState === 'countdown'}
              className={`w-32 h-32 rounded-full font-bold text-2xl border-4 flex items-center justify-center transition-all shadow-[0_0_30px_rgba(255,0,0,0.3)] ${
                launchState === 'idle' 
                  ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                  : launchState === 'countdown'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                    : 'bg-space-700 border-space-600 text-gray-400 hover:bg-space-600'
              }`}
            >
              {launchState === 'idle' ? t('lab', 'launch') : launchState === 'countdown' ? countdown : t('lab', 'reset')}
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-space-800 p-4 rounded-xl border border-white/5">
              <div className="text-xs text-gray-400 mb-1">{t('lab', 'status')}</div>
              <div className="font-mono text-neon-blue font-bold">
                {launchState === 'idle' ? t('lab', 'statusHolding') : launchState === 'countdown' ? `T-MINUS 00:00:0${countdown}` : t('lab', 'statusLiftoff')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('lab', 'launchSpeed')}</span>
                <span>{speed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-space-900/50 rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
        <Canvas shadows camera={{ position: [0, 5, 15], fov: 45 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <LaunchAnimator launchState={launchState} rocketRef={rocketRef} stage1Ref={stage1Ref} speed={speed} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <group ref={rocketRef} position={[0, 0, 0]}>
            {/* Stage 1 */}
            <mesh ref={stage1Ref} position={[0, 2.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.5, 5, 32]} />
              <meshPhysicalMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
              
              {/* Engine Nozzle */}
              <mesh position={[0, -2.6, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.5, 0.4, 32, 1, true]} />
                <meshPhysicalMaterial color="#333333" metalness={0.9} roughness={0.5} side={THREE.DoubleSide} />
              </mesh>

              {/* Fire/Exhaust attached to Stage 1 */}
              {launchState === 'launched' && (
                <group position={[0, -3.5, 0]}>
                  <mesh>
                    <coneGeometry args={[0.8, 4, 32]} />
                    <meshBasicMaterial color="#ff5500" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                  </mesh>
                  <mesh position={[0, -1, 0]}>
                    <coneGeometry args={[1.2, 6, 32]} />
                    <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
                  </mesh>
                  <pointLight intensity={5} distance={20} color="#ffaa00" />
                </group>
              )}
            </mesh>
            
            {/* Stage 2 & Payload */}
            <group position={[0, 5.5, 0]}>
              <mesh castShadow receiveShadow>
                <coneGeometry args={[0.5, 1, 32]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Stage 2 engine fire (ignites after separation) */}
              {launchState === 'launched' && rocketRef.current && rocketRef.current.position.y > 15 && (
                <group position={[0, -0.5, 0]}>
                  <mesh>
                    <coneGeometry args={[0.4, 2, 32]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                  </mesh>
                </group>
              )}
            </group>
          </group>

          {/* Launch Pad Structure */}
          <group position={[0, -0.5, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[8, 1, 8]} />
              <meshStandardMaterial color="#333333" roughness={0.9} />
            </mesh>
            {/* Flame Trench */}
            <mesh position={[0, 0.51, 0]} receiveShadow>
              <boxGeometry args={[2, 0.02, 2]} />
              <meshStandardMaterial color="#111111" roughness={1} />
            </mesh>
            
            {/* Launch Tower */}
            <group position={[-2, 5, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.8, 10, 0.8]} />
                <meshStandardMaterial color="#883333" roughness={0.7} metalness={0.5} />
              </mesh>
              {/* Tower Arms */}
              <mesh position={[1.2, 3, 0]} castShadow>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
              <mesh position={[1.2, -1, 0]} castShadow>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
            </group>
          </group>
          
          {/* Smoke Particles */}
          <group position={[0, 0, 0]}>
            <SmokeParticles active={launchState === 'launched' && (rocketRef.current?.position.y || 0) < 15} />
          </group>

          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 - 0.1} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={2} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          {t('lab', 'hintDrag')} — {t('lab', 'hintScroll')}
        </div>
      </div>
    </div>
  );
};

const MeteorShower = ({ intensity }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: Math.floor(intensity / 2) }).map(() => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 10, 5 + Math.random() * 5, (Math.random() - 0.5) * 10),
      speed: 0.1 + Math.random() * 0.2,
      impacted: false
    }));
  }, [intensity]);

  const groupRef = useRef(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y -= meteors[i].speed;
        child.position.x -= meteors[i].speed * 0.5;
        
        // Impact effect (scale up slightly before reset)
        if (child.position.y < -2 && child.position.y > -2.2) {
          child.scale.setScalar(2);
        } else {
          child.scale.setScalar(1);
        }

        if (child.position.y < -3) {
          child.position.y = 5 + Math.random() * 5;
          child.position.x = (Math.random() - 0.5) * 10;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {meteors.map((m, i) => (
        <group key={i} position={m.position}>
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ff5500" emissiveIntensity={2} />
          </mesh>
          {/* Trail */}
          <mesh position={[0.1, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.01, 0.05, 0.5]} />
            <meshBasicMaterial color="#ff5500" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const PlanetaryProcessesLab = () => {
  const { t } = useTranslation();
  const [activeEvent, setActiveEvent] = useState('none');
  const [intensity, setIntensity] = useState(50);
  const [timeOfDay, setTimeOfDay] = useState(12);

  const [bumpMap] = useLoader(THREE.TextureLoader, [
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  ]);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe2 className="text-green-400" /> {t('lab', 'environment')}</h3>
          
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => setActiveEvent('none')}
              className={`w-full text-left p-3 rounded-xl border transition-all ${activeEvent === 'none' ? 'border-neon-blue bg-neon-blue/20' : 'border-white/10 hover:bg-white/5'}`}
            >
              {t('lab', 'normalConditions')}
            </button>
            <button 
              onClick={() => setActiveEvent('meteor')}
              className={`w-full text-left p-3 rounded-xl border transition-all ${activeEvent === 'meteor' ? 'border-red-500 bg-red-500/20' : 'border-white/10 hover:bg-white/5'}`}
            >
              {t('lab', 'meteorShower')} в„пёЏ
            </button>
            <button 
              onClick={() => setActiveEvent('volcano')}
              className={`w-full text-left p-3 rounded-xl border transition-all ${activeEvent === 'volcano' ? 'border-orange-500 bg-orange-500/20' : 'border-white/10 hover:bg-white/5'}`}
            >
              {t('lab', 'volcanicEruption')} рџЊ‹
            </button>
            <button 
              onClick={() => setActiveEvent('dust')}
              className={`w-full text-left p-3 rounded-xl border transition-all ${activeEvent === 'dust' ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 hover:bg-white/5'}`}
            >
              {t('lab', 'dustStorm')} рџЊЄпёЏ
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-sm text-gray-400">{t('lab', 'eventIntensity')}</label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full accent-neon-blue"
              disabled={activeEvent === 'none'}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{t('lab', 'timeOfDay')}</span>
              <span>{timeOfDay}:00</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={timeOfDay} 
              onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
              className="w-full accent-neon-blue"
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-space-900/50 rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <ambientLight intensity={0.05} />
          <directionalLight 
            position={[Math.sin((timeOfDay / 24) * Math.PI * 2) * 10, 3, Math.cos((timeOfDay / 24) * Math.PI * 2) * 10]} 
            intensity={2} 
            castShadow 
          />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            {activeEvent === 'none' ? (
              <RealisticEarth radius={2} position={[0, 0, 0]} />
            ) : (
              <group>
                {/* Textured Planet */}
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[2, 64, 64]} />
                  <meshStandardMaterial 
                    color={activeEvent === 'dust' ? '#c1440e' : activeEvent === 'volcano' ? '#2a1511' : '#555555'} 
                    bumpMap={bumpMap}
                    bumpScale={activeEvent === 'volcano' ? 0.05 : 0.02}
                    roughness={0.9} 
                    metalness={0.1}
                  />
                </mesh>

                {/* Atmosphere */}
                <mesh>
                  <sphereGeometry args={[2.02, 64, 64]} />
                  <meshStandardMaterial 
                    color={activeEvent === 'dust' ? '#e77d11' : '#ffffff'} 
                    transparent 
                    opacity={activeEvent === 'dust' ? intensity / 150 : 0.1} 
                    blending={THREE.AdditiveBlending} 
                  />
                </mesh>
              </group>
            )}
          </Suspense>

          {/* Meteor Shower */}
          {activeEvent === 'meteor' && <MeteorShower intensity={intensity} />}

          {/* Volcano Glow */}
          {activeEvent === 'volcano' && (
            <mesh>
              <sphereGeometry args={[2.05, 64, 64]} />
              <meshBasicMaterial color="#ff3300" transparent opacity={intensity / 200} blending={THREE.AdditiveBlending} />
            </mesh>
          )}

          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {activeEvent === 'dust' && <Noise opacity={intensity / 200} />}
          </EffectComposer>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          {t('lab', 'hintDrag')} — {t('lab', 'hintScroll')}
        </div>
      </div>
    </div>
  );
};

const ParticleSystem = ({ count, color, size, radius }) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  const pointsRef = useRef(null);
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

const UniverseChangesSimulator = () => {
  const { t } = useTranslation();
  const [stage, setStage] = useState('nebula');

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-neon-purple" /> {t('lab', 'stellarEvolution')}</h3>
          
          <div className="relative border-l-2 border-space-700 ml-3 space-y-8 py-4">
            {[
              { id: 'nebula', name: t('lab', 'stellarNebula'), desc: t('lab', 'stellarNebulaDesc') },
              { id: 'star', name: t('lab', 'mainSequenceStar'), desc: t('lab', 'mainSequenceStarDesc') },
              { id: 'supernova', name: t('lab', 'supernova'), desc: t('lab', 'supernovaDesc') },
              { id: 'blackhole', name: t('lab', 'blackHole'), desc: t('lab', 'blackHoleDesc') }
            ].map((s, idx) => (
              <div key={s.id} className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-space-900 ${stage === s.id ? 'bg-neon-purple scale-125' : 'bg-space-600'} transition-all`} />
                <button 
                  onClick={() => setStage(s.id)}
                  className={`text-left transition-colors ${stage === s.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <div className="font-bold">{s.name}</div>
                  {stage === s.id && <div className="text-sm text-gray-400 mt-1">{s.desc}</div>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-space-900/50 rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <ambientLight intensity={0.05} />
          <Stars radius={100} depth={50} count={10000} factor={4} saturation={0.5} fade speed={1} />
          
          {stage === 'nebula' && (
            <group>
              <ParticleSystem count={10000} color="#b026ff" size={0.05} radius={5} />
              <ParticleSystem count={5000} color="#00f0ff" size={0.08} radius={3} />
              <ParticleSystem count={2000} color="#ff00aa" size={0.1} radius={1.5} />
            </group>
          )}
          
          {stage === 'star' && (
            <mesh>
              <sphereGeometry args={[1.5, 64, 64]} />
              <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={4} toneMapped={false} />
              <pointLight intensity={5} distance={100} color="#ffcc00" />
            </mesh>
          )}

          {stage === 'supernova' && (
            <group>
              <ParticleSystem count={20000} color="#00f0ff" size={0.03} radius={8} />
              <ParticleSystem count={10000} color="#ffffff" size={0.05} radius={4} />
              <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={10} toneMapped={false} />
                <pointLight intensity={10} distance={200} color="#00f0ff" />
              </mesh>
            </group>
          )}

          {stage === 'blackhole' && (
            <group>
              {/* Event Horizon */}
              <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              {/* Accretion Disk Particles */}
              <group rotation={[Math.PI / 2.2, 0, 0]}>
                <ParticleSystem count={8000} color="#ffaa00" size={0.02} radius={3.5} />
                <ParticleSystem count={4000} color="#ffffff" size={0.04} radius={2.5} />
              </group>
              {/* Photon Sphere Glow */}
              <mesh>
                <sphereGeometry args={[1.1, 64, 64]} />
                <meshBasicMaterial color="#ff5500" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
              </mesh>
            </group>
          )}

          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={stage === 'supernova' ? 3 : 1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          {t('lab', 'hintDrag')} — {t('lab', 'hintScroll')}
        </div>
      </div>
    </div>
  );
};

const SatelliteControlSimulator = () => {
  const { t } = useTranslation();
  const [altitude, setAltitude] = useState(400); // km
  const [inclination, setInclination] = useState(51.6); // degrees
  const [solarPanelsDeployed, setSolarPanelsDeployed] = useState(true);
  const [power, setPower] = useState(100);
  const [satelliteType, setSatelliteType] = useState('iss');

  useEffect(() => {
    const interval = setInterval(() => {
      setPower(p => {
        if (!solarPanelsDeployed && p > 0) {
          return Math.max(0, p - 0.5);
        } else if (solarPanelsDeployed && p < 100) {
          return Math.min(100, p + 2);
        }
        return p;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [solarPanelsDeployed]);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe2 className="text-blue-400" /> {t('lab', 'satelliteControl')}</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">{t('lab', 'spacecraftType')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSatelliteType('iss')} className={`py-2 rounded-lg text-sm transition-colors ${satelliteType === 'iss' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>ISS</button>
                <button onClick={() => setSatelliteType('tiangong')} className={`py-2 rounded-lg text-sm transition-colors ${satelliteType === 'tiangong' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>Tiangong</button>
                <button onClick={() => setSatelliteType('dragon')} className={`py-2 rounded-lg text-sm transition-colors ${satelliteType === 'dragon' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>Crew Dragon</button>
                <button onClick={() => setSatelliteType('soyuz')} className={`py-2 rounded-lg text-sm transition-colors ${satelliteType === 'soyuz' ? 'bg-neon-blue text-space-900 font-bold' : 'bg-space-800 text-gray-400 hover:bg-space-700'}`}>Soyuz</button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{t('lab', 'altitude')}</span>
                <span>{altitude} km</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="2000" 
                value={altitude}
                onChange={(e) => setAltitude(parseInt(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{t('lab', 'orbitalInclination')}</span>
                <span>{inclination}В°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                value={inclination}
                onChange={(e) => setInclination(parseInt(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-gray-300">{t('lab', 'solarPanels')}</span>
              <button 
                onClick={() => setSolarPanelsDeployed(!solarPanelsDeployed)}
                className={`w-12 h-6 rounded-full transition-colors relative ${solarPanelsDeployed ? 'bg-blue-400' : 'bg-space-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${solarPanelsDeployed ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{t('lab', 'powerLevel')}</span>
                <span className={power < 20 ? 'text-red-500' : 'text-green-400'}>{Math.round(power)}%</span>
              </div>
              <div className="h-2 bg-space-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${power < 20 ? 'bg-red-500' : 'bg-green-400'}`}
                  style={{ width: `${power}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-space-900/50 rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <group rotation={[inclination * (Math.PI / 180), 0, 0]}>
              {/* Realistic Earth */}
              <RealisticEarth radius={5} position={[0, -5 - (altitude / 200), 0]} />

              {/* Satellite */}
              <group position={[0, 0, 0]}>
                {satelliteType === 'iss' && (
                  <group>
                    {/* ISS Main Truss */}
                    <mesh castShadow receiveShadow>
                      <boxGeometry args={[4, 0.2, 0.2]} />
                      <meshPhysicalMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* ISS Modules */}
                    <mesh position={[0, 0, 0.5]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.3, 0.3, 1.5]} />
                      <meshPhysicalMaterial color="#ffffff" metalness={0.5} roughness={0.5} />
                    </mesh>
                    {/* Solar Arrays */}
                    <group position={[1.5, 0, 0]} rotation={[0, 0, solarPanelsDeployed ? 0 : Math.PI / 2]}>
                      <mesh castShadow receiveShadow position={[0, 0, 0.8]}>
                        <boxGeometry args={[0.8, 0.05, 2]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                      <mesh castShadow receiveShadow position={[0, 0, -0.8]}>
                        <boxGeometry args={[0.8, 0.05, 2]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                    </group>
                    <group position={[-1.5, 0, 0]} rotation={[0, 0, solarPanelsDeployed ? 0 : -Math.PI / 2]}>
                      <mesh castShadow receiveShadow position={[0, 0, 0.8]}>
                        <boxGeometry args={[0.8, 0.05, 2]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                      <mesh castShadow receiveShadow position={[0, 0, -0.8]}>
                        <boxGeometry args={[0.8, 0.05, 2]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                    </group>
                  </group>
                )}

                {satelliteType === 'tiangong' && (
                  <group>
                    {/* Tiangong Core Module */}
                    <mesh rotation={[0, 0, Math.PI/2]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.4, 0.4, 2]} />
                      <meshPhysicalMaterial color="#eeeeee" metalness={0.6} roughness={0.4} />
                    </mesh>
                    {/* Solar Arrays */}
                    <group position={[0, 0, 0]} rotation={[solarPanelsDeployed ? 0 : Math.PI / 2, 0, 0]}>
                      <mesh castShadow receiveShadow position={[0, 0, 1.2]}>
                        <boxGeometry args={[1.5, 0.05, 0.8]} />
                        <meshPhysicalMaterial color="#1a4b8c" metalness={0.9} roughness={0.1} />
                      </mesh>
                      <mesh castShadow receiveShadow position={[0, 0, -1.2]}>
                        <boxGeometry args={[1.5, 0.05, 0.8]} />
                        <meshPhysicalMaterial color="#1a4b8c" metalness={0.9} roughness={0.1} />
                      </mesh>
                    </group>
                  </group>
                )}

                {satelliteType === 'dragon' && (
                  <group>
                    {/* Crew Dragon Capsule */}
                    <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
                      <coneGeometry args={[0.6, 1.2, 32]} />
                      <meshPhysicalMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
                    </mesh>
                    {/* Trunk */}
                    <mesh castShadow receiveShadow position={[0, -0.6, 0]}>
                      <cylinderGeometry args={[0.6, 0.6, 1, 32]} />
                      <meshPhysicalMaterial color="#222222" metalness={0.8} roughness={0.5} />
                    </mesh>
                    {/* Solar Panels on Trunk */}
                    {solarPanelsDeployed && (
                      <mesh position={[0, -0.6, 0.61]}>
                        <planeGeometry args={[0.8, 0.8]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                    )}
                  </group>
                )}

                {satelliteType === 'soyuz' && (
                  <group>
                    {/* Soyuz Orbital Module */}
                    <mesh castShadow receiveShadow position={[0, 1, 0]}>
                      <sphereGeometry args={[0.4, 32, 32]} />
                      <meshPhysicalMaterial color="#dddddd" metalness={0.5} roughness={0.5} />
                    </mesh>
                    {/* Descent Module */}
                    <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
                      <cylinderGeometry args={[0.3, 0.5, 0.6, 32]} />
                      <meshPhysicalMaterial color="#aaaaaa" metalness={0.6} roughness={0.6} />
                    </mesh>
                    {/* Service Module */}
                    <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
                      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
                      <meshPhysicalMaterial color="#cccccc" metalness={0.7} roughness={0.4} />
                    </mesh>
                    {/* Solar Arrays */}
                    <group position={[0, -0.4, 0]} rotation={[0, 0, solarPanelsDeployed ? 0 : Math.PI / 2]}>
                      <mesh castShadow receiveShadow position={[1, 0, 0]}>
                        <boxGeometry args={[1.5, 0.05, 0.4]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                      <mesh castShadow receiveShadow position={[-1, 0, 0]}>
                        <boxGeometry args={[1.5, 0.05, 0.4]} />
                        <meshPhysicalMaterial color="#113366" metalness={0.9} roughness={0.1} />
                      </mesh>
                    </group>
                  </group>
                )}
              </group>
            </group>
          </Suspense>

          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
          {t('lab', 'hintDrag')} — {t('lab', 'hintScroll')}
        </div>
      </div>
    </div>
  );
};

// --- Main View ---

export default function SpaceLabView() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState('rocket');

  const modules = [
    { id: 'rocket', name: t('lab', 'rocketEngineering'), icon: Rocket, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
    { id: 'launch', name: t('lab', 'launchSimulator'), icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'satellite', name: t('lab', 'satelliteControl'), icon: Globe2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'planet', name: t('lab', 'planetaryProcesses'), icon: Globe2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'universe', name: t('lab', 'universeChanges'), icon: Sparkles, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {t('lab', 'title')} <span className="text-glow-blue text-neon-blue">{t('lab', 'titleHighlight')}</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          {t('lab', 'subtitle')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all whitespace-nowrap lg:whitespace-normal ${
                activeModule === mod.id 
                  ? 'glass border-neon-blue/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'bg-white/5 border border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-xl ${mod.bg}`}>
                <mod.icon className={`w-5 h-5 ${mod.color}`} />
              </div>
              <span className={`font-bold ${activeModule === mod.id ? 'text-white' : 'text-gray-400'}`}>
                {mod.name}
              </span>
            </button>
          ))}
        </div>

        {/* Main Lab Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeModule === 'rocket' && <RocketEngineeringLab />}
              {activeModule === 'launch' && <RocketLaunchSimulator />}
              {activeModule === 'satellite' && <SatelliteControlSimulator />}
              {activeModule === 'planet' && <PlanetaryProcessesLab />}
              {activeModule === 'universe' && <UniverseChangesSimulator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

