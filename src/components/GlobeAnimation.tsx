
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const EarthGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#2D7FF9"
          roughness={0.7}
          metalness={0.1}
          opacity={0.8}
          transparent={true}
        />
      </Sphere>
      
      {/* Atmosphere effect */}
      <Sphere args={[1.08, 64, 64]}>
        <meshStandardMaterial
          color="#E6F2FF"
          roughness={1}
          metalness={0}
          opacity={0.2}
          transparent={true}
        />
      </Sphere>
    </group>
  );
};

const AnimatedPoints = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    // Create random points that will represent earthquake points or markers
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create points distributed on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 1 + (Math.random() * 0.1); // Slightly outside the globe
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }
    
    setPositions(posArray);
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });
  
  if (!positions) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#3BBFBA" 
        transparent 
        opacity={0.8} 
        depthWrite={false}
      />
    </points>
  );
};

const GlobeAnimation = () => {
  return (
    <div className="globe-container w-full h-[500px] md:h-[600px]">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <EarthGlobe />
        <AnimatedPoints />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default GlobeAnimation;
