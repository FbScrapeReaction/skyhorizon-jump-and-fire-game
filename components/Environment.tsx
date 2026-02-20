import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Sky, Stars, Cloud, Float, Instance, Instances, Sparkles } from '@react-three/drei';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, LEVELS, BiomeType, LevelData } from '../store';
import { GamePhase } from '../types';

// Add this to fix R3F JSX type issues
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Base ring positions
export const BASE_RING_DATA = [
    { y: 2200, x: 0, z: 50 },
    { y: 1700, x: 80, z: 20 },
    { y: 1200, x: -50, z: -60 },
    { y: 700, x: 20, z: 100 }
];

// -- TRAFFIC SYSTEM --
const TrafficStreams = ({ color }: { color: string }) => {
    const count = 400;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    const cars = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            lane: Math.floor(Math.random() * 5), // 5 Altitude lanes
            radius: 300 + Math.random() * 1000,
            angle: Math.random() * Math.PI * 2,
            speed: 0.2 + Math.random() * 0.5,
            yOffset: Math.random() * 50
        }));
    }, []);

    useFrame((state, delta) => {
        if (!mesh.current) return;
        cars.forEach((car, i) => {
            car.angle += car.speed * delta * 0.1;
            const x = Math.cos(car.angle) * car.radius;
            const z = Math.sin(car.angle) * car.radius;
            const y = 100 + (car.lane * 150) + car.yOffset;

            dummy.position.set(x, y, z);
            dummy.rotation.y = -car.angle;
            // Stretch based on speed
            dummy.scale.set(4, 1, 1);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <boxGeometry args={[2, 0.5, 0.5]} />
            <meshBasicMaterial color={color} toneMapped={false} />
        </instancedMesh>
    );
};

// -- ATMOSPHERIC PARTICLES --
const AtmosphericParticles = ({ biome, color }: { biome: BiomeType, color: string }) => {
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 2000,
                (Math.random() * 2500),
                (Math.random() - 0.5) * 2000
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ),
            scale: Math.random()
        }));
    }, []);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((p, i) => {
            p.position.add(p.velocity);
            if (p.position.y < 0) p.position.y = 2500;
            if (p.position.y > 2500) p.position.y = 0;
            
            dummy.position.copy(p.position);
            const scale = biome === BiomeType.SNOW ? 0.8 : 0.3;
            dummy.scale.setScalar(p.scale * scale);
            dummy.rotation.x += 0.01;
            dummy.rotation.y += 0.01;
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
        </instancedMesh>
    );
};

// -- MEGA STRUCTURES --
const MegaStructures = ({ color, biome }: { color: string, biome: BiomeType }) => {
    if (biome === BiomeType.JUNGLE || biome === BiomeType.SNOW) return null;

    const structures = useMemo(() => {
        return [1, 2, 3, 4].map((i) => ({
            pos: [
                (Math.random() - 0.5) * 5000, 
                0, 
                (Math.random() - 0.5) * 5000
            ].map(v => v > 0 ? v + 1500 : v - 1500),
            scale: [100 + Math.random() * 200, 400 + Math.random() * 600, 100 + Math.random() * 200]
        }));
    }, []);

    return (
        <group>
            {structures.map((s, i) => (
                <mesh key={i} position={s.pos as any}>
                    <boxGeometry args={s.scale as any} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
                    <mesh position={[0, s.scale[1]/4, s.scale[2]/2 + 1]}>
                        <planeGeometry args={[s.scale[0]*0.1, s.scale[1]*0.8]} />
                        <meshBasicMaterial color="#0ea5e9" toneMapped={false} />
                    </mesh>
                </mesh>
            ))}
        </group>
    )
}

const DetailedAncientMachines = ({ color, wireframe }: { color: string, wireframe: boolean }) => {
  const count = 12;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 800 + Math.random() * 400;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      pos.push({ 
        position: [x, -20, z], 
        rotation: [0, Math.atan2(x, z) + Math.PI, 0], 
        scale: 25 + Math.random() * 10 
      });
    }
    return pos;
  }, []);

  return (
    <group>
      {positions.map((props, i) => (
        <group key={i} position={props.position as any} rotation={props.rotation as any}>
           {/* Legs */}
           <mesh position={[-15, 0, 10]} rotation={[0.2, 0, -0.2]}>
               <cylinderGeometry args={[2, 4, 60, 6]} />
               <meshStandardMaterial color="#1c1917" roughness={0.7} />
           </mesh>
           <mesh position={[15, 0, 10]} rotation={[0.2, 0, 0.2]}>
               <cylinderGeometry args={[2, 4, 60, 6]} />
               <meshStandardMaterial color="#1c1917" roughness={0.7} />
           </mesh>
           <mesh position={[0, 0, -20]} rotation={[-0.2, 0, 0]}>
               <cylinderGeometry args={[2, 5, 60, 6]} />
               <meshStandardMaterial color="#1c1917" roughness={0.7} />
           </mesh>

           {/* Main Body */}
           <mesh castShadow receiveShadow position={[0, 30, 0]} rotation={[0.1,0,0]}>
             <cylinderGeometry args={[5, 12, 50, 6]} />
             <meshStandardMaterial color="#292524" roughness={0.6} metalness={0.4} />
           </mesh>
           
           {/* Head Disc */}
           <mesh position={[0, 65, 10]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[20, 20, 3, 32]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
           </mesh>
           <mesh position={[0, 66, 10]} rotation={[0.3, 0, 0]}>
              <ringGeometry args={[12, 19, 32]} />
              <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} toneMapped={false} />
           </mesh>
        </group>
      ))}
    </group>
  );
};

// -- PROCEDURAL CITY & NATURE GENERATOR --
const ProceduralTerrain = ({ level, isScanning }: { level: LevelData, isScanning: boolean }) => {
    const { biome, density, structureColor } = level;
    
    // Split instances into types for variety
    const instancesData = useMemo(() => {
        const typeA = []; // Tall/Thin
        const typeB = []; // Bulk/Wide
        const typeC = []; // Small/Filler
        
        const range = 4000; 
        
        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = biome === BiomeType.URBAN 
                ? (Math.random() * range * 0.6) + 300 // Donut hole for landing
                : (Math.sqrt(Math.random()) * range); 
                
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            
            if (Math.sqrt(x*x + z*z) < 250) continue; 

            let scaleY = 1;
            let scaleXZ = 1;
            let yPos = 0;
            let rot = [0, Math.random() * Math.PI, 0];
            
            // Randomly assign type
            const type = Math.random();

            if (biome === BiomeType.URBAN) {
                if (type > 0.7) { // Type A: Mega Tower
                    scaleY = 100 + Math.random() * 400;
                    scaleXZ = 20 + Math.random() * 20;
                    yPos = scaleY / 2;
                    typeA.push({ pos: [x, yPos, z], scale: [scaleXZ, scaleY, scaleXZ], rot });
                } else if (type > 0.3) { // Type B: Block
                    scaleY = 50 + Math.random() * 150;
                    scaleXZ = 30 + Math.random() * 40;
                    yPos = scaleY / 2;
                    typeB.push({ pos: [x, yPos, z], scale: [scaleXZ, scaleY, scaleXZ], rot });
                } else { // Type C: Connector/Low
                    scaleY = 20 + Math.random() * 50;
                    scaleXZ = 15 + Math.random() * 15;
                    yPos = scaleY / 2;
                    typeC.push({ pos: [x, yPos, z], scale: [scaleXZ, scaleY, scaleXZ], rot });
                }
            } else {
                // Nature biomes (Simplified logic reused)
                 scaleY = 10 + Math.random() * 100;
                 scaleXZ = 5 + Math.random() * 20;
                 if (biome === BiomeType.SNOW) scaleY *= 2; // Spiky
                 if (biome === BiomeType.JUNGLE) scaleXZ *= 0.5; // Thin trees
                 yPos = scaleY / 2;
                 if(biome === BiomeType.ALIEN) { yPos += 50 + Math.random() * 100; rot = [Math.random()*3, Math.random()*3, Math.random()*3]; }
                 typeA.push({ pos: [x, yPos, z], scale: [scaleXZ, scaleY, scaleXZ], rot });
            }
        }
        return { typeA, typeB, typeC };
    }, [biome, density]);

    // GEOMETRIES FOR URBAN
    const urbanGeoA = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []); // Towers
    const urbanGeoB = useMemo(() => new THREE.CylinderGeometry(0.8, 0.8, 1, 6), []); // Hex Towers
    const urbanGeoC = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []); // Low Blocks

    // NATURE GEOMETRIES
    const natureGeo = useMemo(() => {
        if (biome === BiomeType.SNOW) return new THREE.ConeGeometry(1, 1, 4);
        if (biome === BiomeType.DESERT) return new THREE.ConeGeometry(1, 1, 4);
        if (biome === BiomeType.ANCIENT) return new THREE.CylinderGeometry(0.5, 0.7, 1, 8);
        if (biome === BiomeType.JUNGLE) return new THREE.ConeGeometry(1, 1, 7);
        return new THREE.DodecahedronGeometry(1);
    }, [biome]);

    return (
        <group>
            {biome === BiomeType.URBAN ? (
                <>
                    {/* Towers */}
                    <Instances range={instancesData.typeA.length} geometry={urbanGeoA} castShadow receiveShadow>
                        <meshStandardMaterial color={structureColor} roughness={0.2} metalness={0.8} wireframe={isScanning} />
                        {instancesData.typeA.map((d, i) => <Instance key={i} position={d.pos as any} scale={d.scale as any} rotation={d.rot as any} />)}
                    </Instances>
                    {/* Add windows texture/detail via secondary instance slightly larger */}
                    <Instances range={instancesData.typeA.length} geometry={urbanGeoA}>
                        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.3} wireframe />
                        {instancesData.typeA.map((d, i) => <Instance key={i} position={d.pos as any} scale={[d.scale[0]*1.02, d.scale[1], d.scale[2]*1.02] as any} rotation={d.rot as any} />)}
                    </Instances>

                    {/* Hex Buildings */}
                    <Instances range={instancesData.typeB.length} geometry={urbanGeoB} castShadow receiveShadow>
                        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} wireframe={isScanning} />
                        {instancesData.typeB.map((d, i) => <Instance key={i} position={d.pos as any} scale={d.scale as any} rotation={d.rot as any} />)}
                    </Instances>

                    {/* Low Tech Blocks */}
                    <Instances range={instancesData.typeC.length} geometry={urbanGeoC} castShadow receiveShadow>
                        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.3} wireframe={isScanning} />
                        {instancesData.typeC.map((d, i) => <Instance key={i} position={d.pos as any} scale={d.scale as any} rotation={d.rot as any} />)}
                    </Instances>
                </>
            ) : (
                <Instances range={instancesData.typeA.length} geometry={natureGeo} castShadow receiveShadow>
                    <meshStandardMaterial color={structureColor} roughness={0.9} metalness={0.1} wireframe={isScanning} />
                    {instancesData.typeA.map((d, i) => <Instance key={i} position={d.pos as any} scale={d.scale as any} rotation={d.rot as any} />)}
                </Instances>
            )}
        </group>
    );
}

const HolographicGrid = ({ color }: { color: string }) => {
    return (
        <group>
            <gridHelper args={[8000, 200, color, color]} position={[0, 10, 0]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </gridHelper>
             <gridHelper args={[8000, 50, color, color]} position={[0, 2, 0]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
            </gridHelper>
        </group>
    )
}

const FloatingIslands = ({ biome }: { biome: BiomeType }) => {
    const count = 30;
    const positions = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 3000,
                500 + Math.random() * 2000, 
                (Math.random() - 0.5) * 3000
            ],
            scale: 20 + Math.random() * 80,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
        }));
    }, []);

    const geo = biome === BiomeType.URBAN ? new THREE.BoxGeometry(1,0.2,1) : new THREE.TetrahedronGeometry(1, 1);

    return (
        <group>
            {positions.map((props, i) => (
                <Float key={i} speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <mesh position={props.position as any} rotation={props.rotation as any} castShadow scale={props.scale}>
                        <primitive object={geo} />
                        <meshStandardMaterial color="#57534e" roughness={0.9} />
                    </mesh>
                    {/* Tech details on islands */}
                    <mesh position={props.position as any} scale={props.scale * 1.2} rotation={props.rotation as any}>
                         <primitive object={geo} />
                         <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.1} />
                    </mesh>
                    {Math.random() > 0.5 && (
                        <mesh position={[props.position[0], props.position[1] - props.scale, props.position[2]]}>
                            <cylinderGeometry args={[0.5, 2, props.scale * 2, 4, 1, true]} />
                            <meshBasicMaterial color="#bae6fd" transparent opacity={0.2} />
                        </mesh>
                    )}
                </Float>
            ))}
        </group>
    )
}

const SkyRings = ({ complexity }: { complexity: number }) => {
    const { ringsCollected } = useGameStore();
    const rings = useMemo(() => {
        return BASE_RING_DATA.map(r => ({
            ...r,
            x: r.x * (1 + complexity * 0.8), 
            z: r.z * (1 + complexity * 0.8)
        }))
    }, [complexity]);
    
    return (
        <group>
            {rings.map((data, i) => {
                const isCollected = i < ringsCollected;
                return (
                    <group key={i} position={[data.x, data.y, data.z]}>
                        <mesh rotation={[Math.PI/2, 0, 0]}>
                            <torusGeometry args={[35, 3, 16, 100]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
                        </mesh>
                        <mesh rotation={[Math.PI/2, 0, 0]}>
                             <torusGeometry args={[35.1, 1, 16, 100]} />
                             <meshBasicMaterial color="#0ea5e9" toneMapped={false} transparent opacity={0.5} />
                        </mesh>
                        <mesh rotation={[Math.PI/2, 0, 0]}>
                            <torusGeometry args={[30, 0.5, 16, 64]} />
                            <meshBasicMaterial color={isCollected ? "#22c55e" : "#f59e0b"} transparent opacity={isCollected ? 0 : 1} toneMapped={false} />
                        </mesh>
                        
                        {!isCollected && (
                            <group rotation={[Math.PI/2, 0, 0]}>
                                <mesh rotation={[0,0, Date.now() * 0.001]}>
                                    <ringGeometry args={[25, 25.5, 64, 1, 0, Math.PI * 1.5]} />
                                    <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} side={THREE.DoubleSide} />
                                </mesh>
                                <mesh rotation={[0,0, -Date.now() * 0.002]}>
                                    <ringGeometry args={[18, 18.5, 32, 1, 0, Math.PI]} />
                                    <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} side={THREE.DoubleSide} />
                                </mesh>
                            </group>
                        )}
                    </group>
                )
            })}
        </group>
    )
}

const EnemyExplosion = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position as any}>
            <Sparkles count={50} scale={15} size={5} speed={0.4} opacity={1} color="#ef4444" noise={1} />
            <mesh>
                 <sphereGeometry args={[2, 8, 8]} />
                 <meshBasicMaterial color="orange" transparent opacity={0.5} />
            </mesh>
        </group>
    )
}

const TargetDrones = () => {
    const { enemies } = useGameStore();
    const groupRef = useRef<THREE.Group>(null);
    
    // Animate idle
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            if (child.userData.alive) {
                child.position.y += Math.sin(state.clock.elapsedTime * 3 + i) * 0.03;
                child.rotation.y += 0.02;
            }
        });
    });

    return (
        <group ref={groupRef} name="enemies">
            {enemies.map((enemy, i) => {
               if (!enemy.alive) return <EnemyExplosion key={enemy.id} position={enemy.position} />;

               return (
               <group key={enemy.id} position={enemy.position as any} userData={{ type: 'enemy', id: enemy.id, alive: true }}>
                   {/* Drone Eye */}
                   <mesh>
                       <sphereGeometry args={[1, 16, 16]} />
                       <meshStandardMaterial color="#333" roughness={0.4} />
                   </mesh>
                   {/* Glow */}
                   <mesh position={[0,0,0.8]}>
                       <sphereGeometry args={[0.4, 16, 16]} />
                       <meshBasicMaterial color="#ef4444" toneMapped={false} />
                   </mesh>
                   {/* Rings */}
                   <mesh rotation={[Math.PI/2, 0, 0]}>
                       <torusGeometry args={[1.5, 0.1, 8, 32]} />
                       <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" />
                   </mesh>
               </group> 
               )
            })}
        </group>
    )
}

const ScanWave = () => {
    const { isScanning } = useGameStore();
    const meshRef = useRef<THREE.Mesh>(null);
    const gridRef = useRef<THREE.Mesh>(null);
    
    useFrame((state, delta) => {
        if (!meshRef.current || !gridRef.current) return;
        if (isScanning) {
            meshRef.current.scale.addScalar(delta * 2500); 
            gridRef.current.scale.copy(meshRef.current.scale); 
            
            if (meshRef.current.scale.x > 8000) {
                 meshRef.current.visible = false;
                 gridRef.current.visible = false;
            } else {
                 meshRef.current.visible = true;
                 gridRef.current.visible = true;
                 const opacity = Math.max(0, 1 - (meshRef.current.scale.x / 6000));
                 (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3;
                 (gridRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
            }
        } else {
            meshRef.current.scale.set(1, 1, 1);
            meshRef.current.visible = false;
            gridRef.current.scale.set(1, 1, 1);
            gridRef.current.visible = false;
        }
    });

    return (
        <group rotation={[-Math.PI/2, 0, 0]}>
            <mesh ref={meshRef} visible={false}>
                <ringGeometry args={[0.9, 1, 128]} />
                <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={gridRef} visible={false}>
                 <ringGeometry args={[0, 1, 128, 20]} />
                 <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.3} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>
    );
}

export const WorldEnvironment: React.FC = () => {
  const { isScanning, currentLevelIndex } = useGameStore();
  const level = LEVELS[currentLevelIndex];

  return (
    <>
      <Sky sunPosition={level.sunPosition as any} turbidity={0.2} rayleigh={level.biome === BiomeType.ALIEN ? 4 : 0.8} mieCoefficient={0.002} mieDirectionalG={0.85} />
      <Stars radius={300} depth={50} count={10000} factor={4} saturation={0} fade speed={0.5} />
      
      <ambientLight intensity={0.6} color={level.skyColor} />
      <directionalLight 
        position={level.sunPosition as any} 
        intensity={2.8} 
        castShadow 
        shadow-bias={-0.0005}
        shadow-mapSize={[4096, 4096]}
        color={level.horizonColor}
      >
        <orthographicCamera attach="shadow-camera" args={[-2000, 2000, 2000, -2000]} far={5000} />
      </directionalLight>

      <fogExp2 attach="fog" args={[level.fogColor, 0.0003]} />

      <group position={[0, -200, 0]}>
        <Cloud position={[-800, 1600, -800]} opacity={0.5} speed={0.2} bounds={[1200, 200, 200]} segments={40} color={level.fogColor} />
        <Cloud position={[800, 1400, 800]} opacity={0.4} speed={0.25} bounds={[1200, 200, 200]} segments={40} color={level.skyColor} />
        <Cloud position={[0, 2200, 0]} opacity={0.25} speed={0.1} bounds={[2000, 100, 400]} segments={60} />
        <Cloud position={[0, 600, 0]} opacity={0.15} speed={0.6} bounds={[3000, 100, 100]} segments={50} color={level.horizonColor} />
      </group>

      <AtmosphericParticles biome={level.biome} color={level.horizonColor} />
      <FloatingIslands biome={level.biome} />
      <SkyRings complexity={level.ringComplexity} />
      <MegaStructures color={level.structureColor} biome={level.biome} />
      {level.biome === BiomeType.URBAN && <TrafficStreams color="#ef4444" />}
      {level.biome === BiomeType.URBAN && <group rotation={[0,Math.PI/2,0]}><TrafficStreams color="#3b82f6" /></group>}
      
      <group position={[0, 2800, 0]}>
           <ScanWave />
      </group>

      <group position={[0, -10, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[10000, 10000, 256, 256]} />
          <meshStandardMaterial color={level.groundColor} roughness={0.9} metalness={0.1} wireframe={isScanning} />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
             <planeGeometry args={[5000, 5000, 64, 64]} />
             <meshBasicMaterial color={level.structureColor} wireframe transparent opacity={0.03} />
        </mesh>

        <HolographicGrid color={level.structureColor} />
        <ProceduralTerrain level={level} isScanning={isScanning} />
        <DetailedAncientMachines color={level.horizonColor} wireframe={isScanning} />
        <TargetDrones />
      </group>

      <group position={[0, 1, 0]}>
         <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[45, 48, 128]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.8} toneMapped={false} />
         </mesh>
         <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 45, 64]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
         </mesh>
         <pointLight position={[0, 10, 0]} color="#ef4444" intensity={2} distance={200} decay={2} />
      </group>
    </>
  );
};