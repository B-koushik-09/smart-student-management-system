import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSphere() {
  const meshRef = useRef();
  const materialRef = useRef();

  // Slowly shifting color
  const baseColor = useMemo(() => new THREE.Color('#6366f1'), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Extremely slow, elegant rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.04;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
    if (materialRef.current) {
      // Subtle color pulse
      const t = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 + 0.5;
      materialRef.current.color.copy(baseColor).lerp(new THREE.Color('#0ea5e9'), t * 0.25);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.8} floatingRange={[-0.05, 0.05]}>
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#6366f1"
          attach="material"
          distort={0.25}
          speed={1}
          roughness={0.3}
          metalness={0.7}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingObject({ className = '', size = 'large' }) {
  const dims = size === 'small' ? 'w-28 h-28' : 'w-64 h-64';
  return (
    <div className={`${dims} ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#818cf8" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#0ea5e9" />
        <FloatingSphere />
      </Canvas>
    </div>
  );
}
