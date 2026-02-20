import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { WorldEnvironment } from './Environment';
import { Player } from './Player';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';

// Add this to fix R3F JSX type issues
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export const Experience: React.FC = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }} className="w-full h-full" dpr={[1, 2]}>
      <color attach="background" args={['#000000']} />
      
      <Suspense fallback={null}>
        <WorldEnvironment />
        <Player />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.2} radius={0.5} />
          <ChromaticAberration offset={new Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0} />
          <Vignette offset={0.3} darkness={0.5} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};