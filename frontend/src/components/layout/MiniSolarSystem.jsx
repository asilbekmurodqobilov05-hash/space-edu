import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { planetsData } from "@/data/planetsData";

const SUN_RADIUS = 1.35;
const DIST_SCALE = 0.12; // Mini-map scaling for planet orbit distances
const TIME_SCALE = 0.65; // Animation speed for mini-map

function TransparentClearColor() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  return null;
}

function Sun({ frozen }) {
  const coronaRef = useRef(null);
  useFrame(({ clock }) => {
    if (frozen) return;
    if (!coronaRef.current) return;
    coronaRef.current.rotation.z = clock.elapsedTime * 0.15;
    coronaRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.2) * 0.02);
  });

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshStandardMaterial color="#ffcc33" emissive="#ff9900" emissiveIntensity={5} roughness={0.2} />
      </mesh>

      <mesh ref={coronaRef}>
        <sphereGeometry args={[SUN_RADIUS * 1.12, 24, 24]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight intensity={2.5} distance={80} decay={1.6} color="#fff3c4" />
    </group>
  );
}

function MiniPlanet({ data, index, frozen }) {
  const orbitRef = useRef(null);
  const planetRef = useRef(null);
  const cloudsRef = useRef(null);
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((_, delta) => {
    if (frozen) return;
    if (!orbitRef.current) return;
    const t = delta * TIME_SCALE;

    // Orbit around sun
    orbitRef.current.userData.angle += data.speed * t * 18;
    const a = orbitRef.current.userData.angle;
    orbitRef.current.position.x = Math.cos(a) * data.distance * DIST_SCALE;
    orbitRef.current.position.z = Math.sin(a) * data.distance * DIST_SCALE;

    // Axial rotation
    if (planetRef.current) planetRef.current.rotation.y += data.rotationSpeed * t * 60;
    if (cloudsRef.current) cloudsRef.current.rotation.y += data.rotationSpeed * t * 80;
  });

  return (
    <group
      ref={orbitRef}
      userData={{ angle: initialAngle }}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(0.15, data.distance * DIST_SCALE - 0.02), data.distance * DIST_SCALE + 0.02, 48]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={planetRef}>
        <sphereGeometry args={[Math.max(0.14, data.radius * 0.26), 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.55}
          metalness={0.05}
          emissive={data.color}
          emissiveIntensity={0.02}
        />

        {/* Quick Earth-like clouds when Earth exists */}
        {data.id === "earth" && (
          <mesh ref={cloudsRef} scale={1.015}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.22} roughness={1} metalness={0} blending={THREE.AdditiveBlending} />
          </mesh>
        )}
      </mesh>
    </group>
  );
}

export default function MiniSolarSystem({ frozen = false }) {
  const planets = useMemo(() => planetsData.slice(0, 5), []);

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power", premultipliedAlpha: false }}
        camera={{ position: [0, 6, 16], fov: 40, near: 0.1, far: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <TransparentClearColor />

        <Sun frozen={frozen} />

        {planets.map((p, i) => (
          <MiniPlanet key={p.id} data={p} index={i} frozen={frozen} />
        ))}

        <ambientLight intensity={0.16} />
        <directionalLight position={[5, 10, 6]} intensity={0.52} color="#fff0f8" />
      </Canvas>
    </div>
  );
}

