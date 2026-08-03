'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneId, SceneModule } from '../registry';

function SpaceOSSceneContent() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={1} color="#FCFAF5" />

      {/* Floating 3D Interface Card */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.5, 0.08]} />
        <meshStandardMaterial color="#0D2B4E" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Gold Frame Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.46, 1.56, 0.04]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.1} metalness={0.9} wireframe />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'space-os') return null;
  return <SpaceOSSceneContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 110,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
