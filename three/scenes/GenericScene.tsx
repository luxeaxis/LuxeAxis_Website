'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneId, SceneModule } from '../registry';

function GenericSceneContent({ sceneId }: { sceneId: SceneId }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1} color="#C9A84C" />

      {/* Axis Marker Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 4, 16]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Dynamic Geometric Ring for Scene Accent */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 48]} />
        <meshStandardMaterial
          color={sceneId === 'portfolio' ? '#1A7A85' : '#FCFAF5'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  return <GenericSceneContent sceneId={sceneId} />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 90,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
