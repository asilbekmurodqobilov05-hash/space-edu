import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Activity, Navigation as NavIcon, Satellite, Globe2, MapPin, Gauge, Rocket, Calendar } from 'lucide-react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTranslation } from '@/hooks/useTranslation';
import UpcomingLaunches from '@/components/live/UpcomingLaunches';
import NasaApod from '@/components/live/NasaApod';

// --- 3D Earth & Satellites Component ---
const EarthAndSatellites = ({ issLat, issLng }) => {
  const { t } = useTranslation();
  const earthRef = useRef(null);
  const issGroupRef = useRef(null);
  const tiangongGroupRef = useRef(null);

  // Load realistic Earth textures
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png'
  ]);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005; // Earth rotation
    }
    if (tiangongGroupRef.current) {
      // Mock Tiangong orbit (faster than Earth rotation)
      const t = clock.getElapsedTime();
      const tiangongLat = Math.sin(t * 0.5) * 41.5; // ~41.5 deg inclination
      const tiangongLng = (t * 20) % 360 - 180;
      
      const phi = (90 - tiangongLat) * (Math.PI / 180);
      const theta = (tiangongLng + 180) * (Math.PI / 180);
      const radius = 2.45; // Slightly lower than ISS
      
      tiangongGroupRef.current.position.x = -(radius * Math.sin(phi) * Math.cos(theta));
      tiangongGroupRef.current.position.z = (radius * Math.sin(phi) * Math.sin(theta));
      tiangongGroupRef.current.position.y = (radius * Math.cos(phi));
    }
  });

  // Convert ISS lat/lng to 3D position
  const phi = (90 - issLat) * (Math.PI / 180);
  const theta = (issLng + 180) * (Math.PI / 180);
  const radius = 2.5; // Earth radius (2) + Altitude (0.5)

  const issX = -(radius * Math.sin(phi) * Math.cos(theta));
  const issZ = (radius * Math.sin(phi) * Math.sin(theta));
  const issY = (radius * Math.cos(phi));

  return (
    <group>
      {/* Realistic Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={35}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshPhongMaterial 
          color="#4ca6ff" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ISS Marker */}
      <group ref={issGroupRef} position={[issX, issY, issZ]}>
        <mesh>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html distanceFactor={15} position={[0, 0.15, 0]} center>
          <div className="bg-space-900/80 backdrop-blur-md border border-neon-blue/50 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
            <Satellite className="w-3 h-3 text-neon-blue" /> {t('live', 'iss')}
          </div>
        </Html>
      </group>

      {/* Tiangong Marker (Mocked Orbit) */}
      <group ref={tiangongGroupRef}>
        <mesh>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ff0055" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ff0055" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html distanceFactor={15} position={[0, 0.15, 0]} center>
          <div className="bg-space-900/80 backdrop-blur-md border border-neon-purple/50 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
            <Satellite className="w-3 h-3 text-neon-purple" /> {t('live', 'tiangong')}
          </div>
        </Html>
      </group>

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
    </group>
  );
};

// --- Main View ---

export default function LiveSpaceView() {
  const { addXp, badges } = useGamificationStore();
  const { t } = useTranslation();
  const [issData, setIssData] = useState(null);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Award XP for visiting live data
    addXp(10);

    const fetchISSData = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await res.json();
        setIssData(data);
      } catch (error) {
        console.error('Failed to fetch ISS data:', error);
      }
    };

    const fetchAstronauts = async () => {
      try {
        // Using a reliable HTTPS proxy/alternative for open-notify
        const res = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json');
        if (res.ok) {
          const data = await res.json();
          setAstronauts(data.people);
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (error) {
        // Fallback mock data if API fails
        setAstronauts([
          { name: "Oleg Kononenko", craft: "ISS" },
          { name: "Nikolai Chub", craft: "ISS" },
          { name: "Tracy Caldwell Dyson", craft: "ISS" },
          { name: "Matthew Dominick", craft: "ISS" },
          { name: "Michael Barratt", craft: "ISS" },
          { name: "Jeanette Epps", craft: "ISS" },
          { name: "Alexander Grebenkin", craft: "ISS" }
        ]);
      }
    };

    fetchISSData();
    fetchAstronauts();
    setLoading(false);

    // Update ISS position every 3 seconds
    const interval = setInterval(fetchISSData, 3000);
    return () => clearInterval(interval);
  }, [addXp]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {t('live', 'title')} <span className="text-glow-purple text-neon-purple">{t('live', 'titleHighlight')}</span> {t('live', 'data')}
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {t('live', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D ISS Tracker */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass rounded-3xl overflow-hidden relative h-[500px] border-neon-blue/30"
        >
          <div className="absolute top-4 left-4 z-10 bg-space-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Satellite className="w-5 h-5 text-neon-blue" /> {t('live', 'telemetry')}
            </h3>
            {issData ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-neon-purple" />
                  <span>{t('live', 'lat')}: {issData.latitude.toFixed(4)}°</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-neon-purple" />
                  <span>{t('live', 'lng')}: {issData.longitude.toFixed(4)}°</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <NavIcon className="w-4 h-4 text-yellow-400" />
                  <span>{t('live', 'alt')}: {issData.altitude.toFixed(2)} km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Gauge className="w-4 h-4 text-red-400" />
                  <span>{t('live', 'vel')}: {issData.velocity.toFixed(2)} km/h</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm animate-pulse">{t('live', 'acquiring')}</div>
            )}
          </div>

          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <color attach="background" args={['#000005']} />
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
              {issData && <EarthAndSatellites issLat={issData.latitude} issLng={issData.longitude} />}
              <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
            </Canvas>
          </div>
        </motion.div>

        {/* Astronauts List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-3xl flex flex-col h-[500px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-neon-purple" />
              {t('live', 'humans')}
            </h2>
            <div className="bg-neon-purple/20 text-neon-purple px-3 py-1 rounded-full font-bold">
              {astronauts.length}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="text-center text-gray-400 py-8 animate-pulse">{t('live', 'connecting')}</div>
            ) : (
              astronauts.map((astro, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white">
                      {astro.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{astro.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Globe2 className="w-3 h-3" /> 
                        {astro.craft === 'ISS' ? t('live', 'iss') : 
                         astro.craft === 'Tiangong' ? t('live', 'tiangong') : 
                         astro.craft}
                      </p>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-neon-blue" />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Live Video Feed Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 glass p-6 rounded-3xl border border-white/10"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-neon-blue" />
          {t('live', 'videoFeed')}
        </h2>
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/sWasdbDVNvc?si=I9YUJ72H5_JibrEi" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      {/* ── MISSION TRACKER SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

        {/* Upcoming Launches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 glass p-6 rounded-3xl border border-white/10"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Rocket className="w-6 h-6 text-neon-purple" />
            {t('live', 'launches')}
            <span className="ml-auto text-xs font-medium text-white/30 uppercase tracking-widest">{t('live', 'liveApi')}</span>
          </h2>
          <UpcomingLaunches />
        </motion.div>

        {/* NASA APOD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-6 rounded-3xl border border-white/10"
        >
          <NasaApod />
        </motion.div>
      </div>
    </div>
  );
}
