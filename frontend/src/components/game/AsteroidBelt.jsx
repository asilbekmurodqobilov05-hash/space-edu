import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AsteroidBelt({ count = 5000, innerRadius = 2.1, outerRadius = 3.3, timeScale = 1 }) {
  const meshRef = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const asteroids = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const a = innerRadius + Math.random() * (outerRadius - innerRadius);
      const e = Math.random() * 0.2;
      const angle = Math.random() * Math.PI * 2;
      const i_angle = (Math.random() - 0.5) * 0.2;
      const speed = Math.sqrt(1 / a) * (Math.random() * 0.2 + 0.9); // roughly Keplerian speed
      const size = Math.random() * 0.02 + 0.005;
      
      data.push({ a, e, angle, i_angle, speed, size });
    }
    return data;
  }, [count, innerRadius, outerRadius]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    asteroids.forEach((ast, i) => {
      ast.angle += ast.speed * delta * timeScale * 0.1;
      
      const r = ast.a * (1 - ast.e * ast.e) / (1 + ast.e * Math.cos(ast.angle));
      const x = r * Math.cos(ast.angle);
      const z = r * Math.sin(ast.angle);
      const y = r * Math.sin(ast.angle) * ast.i_angle;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(ast.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </instancedMesh>
  );
}
