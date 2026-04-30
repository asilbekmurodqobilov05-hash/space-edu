import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import * as THREE from "three";

// Convert degrees to radians
const DEG = Math.PI / 180;

// 24 hours in seconds — angular speed for one full light rotation
const FULL_DAY_SECONDS = 24 * 60 * 60;
const LIGHT_ANGULAR_SPEED = (2 * Math.PI) / FULL_DAY_SECONDS;

// Central Asia: ~42°N, ~66°E
// Rotate Y so longitude 66°E faces the camera (-Z axis)
const INITIAL_ROT_Y = -66 * DEG;

function EarthModel() {
  const { scene } = useGLTF("/earth.glb", true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const lightPivotRef = useRef();

  // Clone and optimise the scene once
  const earth = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.envMapIntensity = 0;
          child.material.needsUpdate = true;
        }
      }
    });
    return s;
  }, [scene]);

  // Slowly rotate the directional light pivot (full rotation = 24h)
  useFrame((_state, delta) => {
    if (lightPivotRef.current) {
      lightPivotRef.current.rotation.y += LIGHT_ANGULAR_SPEED * delta;
    }
  });

  return (
    <group>
      <primitive
        object={earth}
        scale={2.2}
        rotation={[0, INITIAL_ROT_Y, 0]}
      />
      {/* Light pivot — one full rotation takes 24 h */}
      <group ref={lightPivotRef}>
        <directionalLight position={[5, 3, 5]} intensity={3} color="#ffffff" />
      </group>
      <ambientLight intensity={0.18} color="#4a5ebd" />
      <pointLight position={[-5, 2, -5]} intensity={0.25} color="#6366f1" />
    </group>
  );
}

function SceneErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleContextLost = (e) => {
      console.warn("WebGL context lost", e);
      setHasError(true);
    };
    window.addEventListener("webglcontextlost", handleContextLost);
    return () =>
      window.removeEventListener("webglcontextlost", handleContextLost);
  }, []);

  if (hasError) {
    return (
      <div className="w-[520px] h-[520px] flex items-center justify-center">
        <div
          className="w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.12) 55%, transparent 75%)",
            boxShadow: "0 0 80px rgba(99,102,241,0.25)",
          }}
        />
      </div>
    );
  }
  return children;
}

export default function Earth3D() {
  return (
    <div className="relative w-[520px] h-[520px] select-none">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 0.8, 4.5], fov: 45, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
          frameloop="always"
          flat
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NoToneMapping;
          }}
        >
          <EarthModel />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={false}
            rotateSpeed={0.4}
            minPolarAngle={Math.PI * 0.3}
            maxPolarAngle={Math.PI * 0.7}
          />
        </Canvas>
      </SceneErrorBoundary>

      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08) 30%, rgba(139,92,246,0.04) 50%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

useGLTF.preload("/earth.glb", true, true, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
