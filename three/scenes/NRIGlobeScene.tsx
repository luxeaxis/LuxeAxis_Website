'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneId, SceneModule } from '../registry';

function NRIGlobeSceneContent() {
  const globeRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={globeRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} color="#C9A84C" />

      {/* Wireframe Latitude / Longitude Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshStandardMaterial color="#C9A84C" wireframe opacity={0.4} transparent />
      </mesh>

      {/* Inner Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#0D2B4E" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Chennai Hub Marker (Gold Node) */}
      <mesh position={[0.5, 0.4, 1.1]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#C9A84C" roughness={0.1} metalness={1} />
      </mesh>

      {/* Diaspora Remote Node (Teal Node) */}
      <mesh position={[-0.8, 0.6, 0.8]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1A7A85" roughness={0.1} metalness={1} />
      </mesh>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'nri-globe') return null;
  return <NRIGlobeSceneContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 130,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
