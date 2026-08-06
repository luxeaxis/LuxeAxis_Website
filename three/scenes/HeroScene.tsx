'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import type { SceneId, SceneModule } from '../registry';

function HeroSceneContent() {
  const groupRef = useRef<Group>(null);
  const outerRingRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);
  const node1Ref = useRef<Mesh>(null);
  const node2Ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      outerRingRef.current.rotation.z += delta * 0.08;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y += delta * 0.15;
      innerRingRef.current.rotation.x += delta * 0.05;
    }
    if (node1Ref.current) {
      node1Ref.current.position.y = Math.sin(time * 1.5) * 0.3 + 0.8;
      node1Ref.current.rotation.y += delta * 0.4;
    }
    if (node2Ref.current) {
      node2Ref.current.position.y = Math.cos(time * 1.2) * 0.25 - 0.8;
      node2Ref.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} color="#1E3F2E" />
      <directionalLight position={[6, 10, 6]} intensity={1.6} color="#FFC107" />
      <pointLight position={[-5, -4, -3]} intensity={1.4} color="#38BDF8" />
      <pointLight position={[4, -2, 4]} intensity={1.0} color="#FFE082" />

      {/* Central Luxe Gold Axis Pillar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 6.5, 32]} />
        <meshStandardMaterial color="#FFC107" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Outer Champagne Gold Torus Ring */}
      <mesh ref={outerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.2, 0.035, 16, 80]} />
        <meshStandardMaterial color="#FFE082" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Inner Tech Sapphire Torus Ring */}
      <mesh ref={innerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.025, 16, 64]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Floating Geometric Nodes (Vastu-Tech Signals) */}
      <mesh ref={node1Ref} position={[1.6, 0.8, 0.4]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.95} />
      </mesh>

      <mesh ref={node2Ref} position={[-1.4, -0.8, -0.4]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#FFC107" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Subtle Base Floor Wireframe Grid */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, 10, 10]} />
        <meshStandardMaterial color="#FFC107" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'hero') return null;
  return <HeroSceneContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 120,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
