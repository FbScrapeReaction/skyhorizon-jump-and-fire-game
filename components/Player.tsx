import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { PerspectiveCamera, Trail, Float, Sparkles, PointerLockControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, LEVELS } from '../store';
import { GamePhase } from '../types';
import { BASE_RING_DATA } from './Environment';

// Add this to fix R3F JSX type issues
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const WindParticles = ({ speed }: { speed: number }) => {
  const count = 200;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 60,
      z: (Math.random() - 0.5) * 30,
      speed: 0.5 + Math.random(),
    }));
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.y += p.speed * (speed * 0.2) + 0.5;
      if (p.y > 40) {
        p.y = -40;
        p.x = (Math.random() - 0.5) * 30;
        p.z = (Math.random() - 0.5) * 30;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.02, 1 + speed * 0.3, 0.02); 
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="white" transparent opacity={0.3} />
    </instancedMesh>
  );
};

// -- HERO SUIT COMPONENTS (SKYDIVE) --
const HeroSuit = ({ phase, speed }: { phase: GamePhase, speed: number }) => {
    const leftWing = useRef<THREE.Group>(null);
    const rightWing = useRef<THREE.Group>(null);
    const chuteRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if(leftWing.current && rightWing.current) {
            // Open wings based on speed/phase
            const targetAngle = phase === GamePhase.FREEFALL ? 0 : 1.2; // 0 is open, 1.2 is folded down
            leftWing.current.rotation.z = THREE.MathUtils.lerp(leftWing.current.rotation.z, -targetAngle, delta * 2);
            rightWing.current.rotation.z = THREE.MathUtils.lerp(rightWing.current.rotation.z, targetAngle, delta * 2);

            // Flutter effect
            const flutter = Math.sin(state.clock.elapsedTime * 20) * (speed * 0.0005);
            leftWing.current.rotation.y = flutter;
            rightWing.current.rotation.y = -flutter;
        }
    });

    const armorMaterial = new THREE.MeshStandardMaterial({ 
        color: "#1e293b", roughness: 0.3, metalness: 0.8 
    });
    const accentMaterial = new THREE.MeshStandardMaterial({ 
        color: "#f97316", roughness: 0.4, metalness: 0.6 
    });
    const techMaterial = new THREE.MeshStandardMaterial({ 
        color: "#94a3b8", roughness: 0.2, metalness: 1.0 
    });
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: "#0ea5e9", toneMapped: false 
    });

    return (
        <group dispose={null}>
            {/* Main Torso */}
            <mesh position={[0, 0.2, 0]} castShadow material={armorMaterial}>
                <boxGeometry args={[0.5, 0.8, 0.3]} />
            </mesh>
            <mesh position={[0, 0.2, 0.16]} castShadow material={accentMaterial}>
                <boxGeometry args={[0.3, 0.5, 0.1]} />
            </mesh>

            {/* Helmet */}
            <group position={[0, 0.75, 0]}>
                <mesh castShadow material={techMaterial}>
                    <sphereGeometry args={[0.25, 32, 32]} />
                </mesh>
                <mesh position={[0, 0, 0.18]} rotation={[0.1, 0, 0]}>
                    <sphereGeometry args={[0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI/2]} />
                    <meshStandardMaterial color="#38bdf8" roughness={0} metalness={1} emissive="#0ea5e9" emissiveIntensity={0.2} />
                </mesh>
            </group>

            {/* Jetpack / Backpack */}
            <group position={[0, 0.3, -0.25]}>
                <mesh material={armorMaterial} castShadow>
                    <boxGeometry args={[0.4, 0.6, 0.25]} />
                </mesh>
                {/* Thrusters */}
                <mesh position={[-0.15, -0.35, 0]} rotation={[0,0,0.1]}>
                     <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
                     <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[0.15, -0.35, 0]} rotation={[0,0,-0.1]}>
                     <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
                     <meshStandardMaterial color="#334155" />
                </mesh>
                {/* Engine Glow */}
                {phase === GamePhase.FREEFALL && (
                    <>
                        <mesh position={[-0.15, -0.6, 0]}>
                            <coneGeometry args={[0.1, 0.5, 8]} />
                            <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
                        </mesh>
                        <mesh position={[-0.15, -0.6, 0]}>
                            <coneGeometry args={[0.1, 0.5, 8]} />
                            <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
                        </mesh>
                        <Sparkles count={20} scale={2} size={2} speed={0.4} opacity={0.5} color="#60a5fa" position={[0, -0.8, 0]} />
                    </>
                )}
            </group>

            {/* Wings */}
            <group position={[0, 0.5, -0.2]}>
                {/* Left Wing */}
                <group ref={leftWing} position={[-0.2, 0, 0]}>
                    <mesh position={[-0.6, 0, 0]} rotation={[0,0,0.2]} castShadow material={techMaterial}>
                         <boxGeometry args={[1.2, 0.1, 0.4]} />
                    </mesh>
                    <mesh position={[-0.6, 0, 0.21]} rotation={[0,0,0.2]} material={glowMaterial}>
                         <boxGeometry args={[1.0, 0.02, 0.05]} />
                    </mesh>
                    {/* Wing Tip Trail */}
                    {phase === GamePhase.FREEFALL && (
                        <group position={[-1.2, 0, 0]}>
                             <Trail width={2} length={6} color="#0ea5e9" attenuation={(t) => t * t}>
                                <mesh visible={false}><boxGeometry args={[0.1,0.1,0.1]} /></mesh>
                            </Trail>
                        </group>
                    )}
                </group>

                {/* Right Wing */}
                <group ref={rightWing} position={[0.2, 0, 0]}>
                     <mesh position={[0.6, 0, 0]} rotation={[0,0,-0.2]} castShadow material={techMaterial}>
                         <boxGeometry args={[1.2, 0.1, 0.4]} />
                    </mesh>
                     <mesh position={[0.6, 0, 0.21]} rotation={[0,0,-0.2]} material={glowMaterial}>
                         <boxGeometry args={[1.0, 0.02, 0.05]} />
                    </mesh>
                    {phase === GamePhase.FREEFALL && (
                        <group position={[1.2, 0, 0]}>
                             <Trail width={2} length={6} color="#0ea5e9" attenuation={(t) => t * t}>
                                <mesh visible={false}><boxGeometry args={[0.1,0.1,0.1]} /></mesh>
                            </Trail>
                        </group>
                    )}
                </group>
            </group>

            {/* Legs (Fixed pose for now) */}
            <group position={[0, -0.2, 0]}>
                <mesh position={[-0.15, -0.4, 0.1]} rotation={[0.5, 0, 0]} castShadow material={armorMaterial}>
                    <boxGeometry args={[0.15, 0.8, 0.2]} />
                </mesh>
                <mesh position={[0.15, -0.4, 0.1]} rotation={[0.5, 0, 0]} castShadow material={armorMaterial}>
                     <boxGeometry args={[0.15, 0.8, 0.2]} />
                </mesh>
            </group>
            
            <group ref={chuteRef} visible={phase === GamePhase.PARACHUTE} position={[0, 2, 0]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[5, 5, 1.5, 7, 1, true, 0, Math.PI * 2]} />
              <meshStandardMaterial color="#f97316" side={THREE.DoubleSide} transparent opacity={0.95} />
            </mesh>
            <mesh position={[0, 2.5, 0]} scale={[1.02, 1, 1.02]}>
               <cylinderGeometry args={[5, 5, 1.5, 16, 2, true]} />
               <meshBasicMaterial color="#0ea5e9" wireframe side={THREE.DoubleSide} transparent opacity={0.4} />
            </mesh>
            <group position={[0, -0.5, 0]}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <lineSegments key={i} geometry={new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(Math.cos(i)*4.5, 3, Math.sin(i)*4.5)])}>
                        <lineBasicMaterial color="#cbd5e1" opacity={0.6} transparent />
                    </lineSegments>
                ))}
            </group>
          </group>
        </group>
    );
};

// -- VISUAL BULLET SYSTEM --
const Lasers = ({ projectiles }: { projectiles: { start: THREE.Vector3, end: THREE.Vector3, id: number }[] }) => {
    return (
        <group>
            {projectiles.map(p => (
                 <group key={p.id} position={p.start} lookAt={p.end}>
                     <mesh rotation={[Math.PI/2, 0, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                        <meshBasicMaterial color="cyan" toneMapped={false} />
                     </mesh>
                 </group>
            ))}
        </group>
    )
}

// -- IMPACT EFFECT --
const ImpactFlare = ({ position }: { position: THREE.Vector3 }) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setVisible(false), 200);
        return () => clearTimeout(t);
    }, []);

    if (!visible) return null;

    return (
        <group position={position}>
            <Sparkles count={10} scale={2} size={5} speed={0.5} color="orange" />
            <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="yellow" toneMapped={false} transparent opacity={0.8} />
            </mesh>
        </group>
    )
}


// -- WEAPON MODEL --
const FPSWeapon = ({ isShooting }: { isShooting: boolean }) => {
    const gunRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (gunRef.current) {
            // Weapon Sway
            const time = state.clock.elapsedTime;
            gunRef.current.position.y = THREE.MathUtils.lerp(gunRef.current.position.y, -0.3 + Math.sin(time * 2) * 0.01, 0.1);
            gunRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;

            // Recoil
            if (isShooting) {
                gunRef.current.position.z = 0.2;
                gunRef.current.rotation.x = 0.1;
            } else {
                gunRef.current.position.z = THREE.MathUtils.lerp(gunRef.current.position.z, 0, 0.2);
                gunRef.current.rotation.x = THREE.MathUtils.lerp(gunRef.current.rotation.x, 0, 0.2);
            }
        }
    });

    return (
        <group ref={gunRef} position={[0.3, -0.3, -0.5]}>
            {/* Gun Body */}
            <mesh position={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[0.1, 0.15, 0.6]} />
                <meshStandardMaterial color="#333" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.08, 0.2]}>
                <boxGeometry args={[0.08, 0.05, 0.55]} />
                <meshStandardMaterial color="#orange" emissive="#f97316" emissiveIntensity={0.5} />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.05, -0.3]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
                <meshStandardMaterial color="#666" metalness={0.8} />
            </mesh>
            {/* Scope */}
            <mesh position={[0, 0.15, 0.1]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.2, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Muzzle Flash */}
            {isShooting && (
                <mesh position={[0, 0.05, -0.6]}>
                     <planeGeometry args={[0.5, 0.5]} />
                     <meshBasicMaterial color="#ffff00" transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            )}
        </group>
    )
}

// -- MAIN PLAYER CONTROLLER --
export const Player: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  const { phase, setPhase, setAltitude, setSpeed, setDistance, setScore, incrementRings, ringsCollected, triggerScan, currentLevelIndex, fireWeapon, killEnemy, setSliding } = useGameStore();
  const { mouse, camera, scene } = useThree();

  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const position = useRef(new THREE.Vector3(0, 3000, 0)); 
  const currentSpeed = useRef(0);
  
  const checkedRings = useRef<Set<number>>(new Set());
  const currentLevel = LEVELS[currentLevelIndex];

  // FPS State
  const [isShooting, setIsShooting] = useState(false);
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const isSprinting = useRef(false);
  const isCrouching = useRef(false); // Used for Slide
  const raycaster = useRef(new THREE.Raycaster());

  // Visual Projectiles
  const [projectiles, setProjectiles] = useState<{id: number, position: THREE.Vector3, velocity: THREE.Vector3}[]>([]);
  const [impacts, setImpacts] = useState<{id: number, position: THREE.Vector3}[]>([]);

  // Input Handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
        if (phase !== GamePhase.GROUND_COMBAT) {
             if (e.code === 'Space' && (phase === GamePhase.FREEFALL || phase === GamePhase.PARACHUTE)) {
                triggerScan();
            }
            return;
        }

        switch (e.code) {
            case 'KeyW': moveForward.current = true; break;
            case 'KeyS': moveBackward.current = true; break;
            case 'KeyA': moveLeft.current = true; break;
            case 'KeyD': moveRight.current = true; break;
            case 'ShiftLeft': isSprinting.current = true; break;
            case 'KeyC': 
                if (!isCrouching.current && (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current)) {
                    isCrouching.current = true;
                    setSliding(true);
                    velocity.current.multiplyScalar(1.8);
                }
                break;
        }
    };
    const onKeyUp = (e: KeyboardEvent) => {
        if (phase !== GamePhase.GROUND_COMBAT) return;
        switch (e.code) {
            case 'KeyW': moveForward.current = false; break;
            case 'KeyS': moveBackward.current = false; break;
            case 'KeyA': moveLeft.current = false; break;
            case 'KeyD': moveRight.current = false; break;
            case 'ShiftLeft': isSprinting.current = false; break;
            case 'KeyC': 
                isCrouching.current = false; 
                setSliding(false);
                break;
        }
    };
    const onMouseDown = () => {
        if (phase === GamePhase.GROUND_COMBAT) {
            setIsShooting(true);
            fireWeapon();

            // 1. Raycast for instant hit detection (Hitscan)
            raycaster.current.setFromCamera(new THREE.Vector2(0,0), camera);
            const intersects = raycaster.current.intersectObjects(scene.children, true);
            
            // Filter out player/weapon if accidentally hit
            const hit = intersects.find(i => {
                // Check if enemy
                if (i.object.userData?.type === 'enemy' || i.object.parent?.userData?.type === 'enemy') return true;
                // Check if ground
                if (i.distance < 100) return true; 
                return false;
            });

            if (hit) {
                // Spawn impact visual
                const impactPos = hit.point.clone();
                setImpacts(prev => [...prev, { id: Math.random(), position: impactPos }]);
                
                // If enemy, damage it
                const enemyObj = hit.object.userData?.type === 'enemy' ? hit.object : hit.object.parent;
                if (enemyObj && enemyObj.userData?.type === 'enemy' && enemyObj.userData?.alive) {
                    killEnemy(enemyObj.userData.id);
                }
            }

            // 2. Spawn visual projectile
            const startPos = camera.position.clone().add(new THREE.Vector3(0.2, -0.2, -0.5).applyQuaternion(camera.quaternion));
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            
            setProjectiles(prev => [...prev, {
                id: Math.random(),
                position: startPos,
                velocity: direction.multiplyScalar(200) // Fast speed
            }]);

            setTimeout(() => setIsShooting(false), 100);
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('mousedown', onMouseDown);
    };
  }, [phase, triggerScan, camera, scene, fireWeapon, killEnemy]);


  // Physics & Logic Loop
  useFrame((state, delta) => {
    // Update Projectiles
    if (projectiles.length > 0) {
        setProjectiles(prev => prev.map(p => ({
            ...p,
            position: p.position.clone().add(p.velocity.clone().multiplyScalar(delta))
        })).filter(p => p.position.distanceTo(camera.position) < 300)); // Remove far projectiles
    }

    // Clean up impacts over time (handled by component internal timer mostly, but clear list to prevent leak)
    if (impacts.length > 10) {
        setImpacts(prev => prev.slice(prev.length - 10));
    }


    if (!group.current) return;
    
    // --- SKYDIVING LOGIC ---
    if (phase === GamePhase.FREEFALL || phase === GamePhase.PARACHUTE) {
      const gravity = -9.81;
      let dragCoeff = 0.02; 
      let controlAuthority = 40; 

      if (phase === GamePhase.PARACHUTE) {
        dragCoeff = 1.5; 
        controlAuthority = 15; 
      }

      velocity.current.y += gravity * delta;
      velocity.current.y -= velocity.current.y * dragCoeff * delta;

      const targetVelX = mouse.x * controlAuthority;
      const targetVelZ = -mouse.y * controlAuthority;

      velocity.current.x += (targetVelX - velocity.current.x) * 3 * delta;
      velocity.current.z += (targetVelZ - velocity.current.z) * 3 * delta;

      position.current.add(velocity.current.clone().multiplyScalar(delta));

      currentSpeed.current = Math.abs(velocity.current.y);
      setAltitude(Math.max(0, Math.round(position.current.y)));
      setSpeed(Math.round(currentSpeed.current));
      
      const dist = Math.sqrt(position.current.x ** 2 + position.current.z ** 2);
      setDistance(Math.round(dist));

      // Ring Collision
      const complexity = currentLevel.ringComplexity;
      BASE_RING_DATA.forEach((ringBase, index) => {
          if (checkedRings.current.has(index)) return;
          const ring = { ...ringBase, x: ringBase.x * complexity, z: ringBase.z * complexity };
          const playerPos = position.current;
          const dy = Math.abs(playerPos.y - ring.y);
          const dHz = Math.sqrt(Math.pow(playerPos.x - ring.x, 2) + Math.pow(playerPos.z - ring.z, 2));

          if (dy < 15 && dHz < 30) {
              incrementRings();
              checkedRings.current.add(index);
              if (phase === GamePhase.FREEFALL) velocity.current.y -= 20; 
          }
      });

      // Landing / Transition
      if (position.current.y <= 10 && velocity.current.y < 0) {
        if (Math.abs(velocity.current.y) > 25) {
          setPhase(GamePhase.CRASHED);
        } else {
            // TRANSITION TO FPS
            position.current.y = 2; // Snap to ground
            velocity.current.set(0,0,0);
            setPhase(GamePhase.GROUND_COMBAT);
        }
      }

      // Visuals (Tilt)
      const tiltX = -velocity.current.z * 0.08; 
      const tiltZ = -velocity.current.x * 0.08; 
      if (bodyRef.current) {
        bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, tiltX, delta * 4);
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, tiltZ, delta * 4);
      }

      // Camera Follow
      if (cameraRef.current) {
        const isParachute = phase === GamePhase.PARACHUTE;
        const targetOffset = isParachute ? new THREE.Vector3(0, 8, 15) : new THREE.Vector3(0, 3.5, 7);
        targetOffset.y += velocity.current.y * 0.02;
        targetOffset.z -= velocity.current.y * 0.05;
        
        const idealPos = position.current.clone().add(targetOffset);
        cameraRef.current.position.lerp(idealPos, delta * 5);
        
        const lookTarget = position.current.clone().add(new THREE.Vector3(velocity.current.x * 0.5, 0, velocity.current.z * 0.5));
        cameraRef.current.lookAt(lookTarget);
      }
      group.current.position.copy(position.current);

    } 
    // --- GROUND COMBAT (FPS) LOGIC ---
    else if (phase === GamePhase.GROUND_COMBAT) {
        if (!cameraRef.current) return;

        // Friction
        const damping = isCrouching.current ? 2.0 : 10.0;
        velocity.current.x -= velocity.current.x * damping * delta;
        velocity.current.z -= velocity.current.z * damping * delta;

        // Move Direction relative to Camera
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, Number(moveBackward.current) - Number(moveForward.current));
        const sideVector = new THREE.Vector3(Number(moveLeft.current) - Number(moveRight.current), 0, 0);
        
        direction.subVectors(frontVector, sideVector).normalize();
        
        // Speed Calculation
        let speed = 40.0; // Base speed
        if (isSprinting.current) speed = 80.0;
        if (isCrouching.current) speed = 0; // Slide relies on momentum

        if (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current) {
            // Project camera direction to flat ground plane
            const camDir = new THREE.Vector3();
            cameraRef.current.getWorldDirection(camDir);
            camDir.y = 0;
            camDir.normalize();
            
            // Calculate right vector manually
            const camRight = new THREE.Vector3(-camDir.z, 0, camDir.x);

            const v = new THREE.Vector3();
            v.add(camDir.multiplyScalar(frontVector.z)); // W/S
            v.add(camRight.multiplyScalar(sideVector.x)); // A/D
            v.normalize();
            v.multiplyScalar(speed * delta);
            
            if (!isCrouching.current) {
                velocity.current.add(v);
            }
        }

        position.current.add(velocity.current.clone().multiplyScalar(delta));
        
        // Floor constraint
        if (position.current.y < 2) position.current.y = 2;

        const targetHeight = isCrouching.current ? 1.0 : 2.5;
        cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, position.current.y + targetHeight, delta * 10);
        cameraRef.current.position.x = position.current.x;
        cameraRef.current.position.z = position.current.z;
    }
    // --- MENU LOGIC ---
    else if (phase === GamePhase.MENU) {
      position.current.set(0, 2500, 0);
      velocity.current.set(0, 0, 0);
      position.current.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      group.current.position.copy(position.current);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={85} near={0.1} far={8000} />
      
      {phase === GamePhase.GROUND_COMBAT && (
        <PointerLockControls />
      )}

      {/* RENDER PROJECTILES */}
      {projectiles.map(p => (
         <mesh key={p.id} position={p.position} rotation={[0,0,0]}>
             <boxGeometry args={[0.1, 0.1, 2]} />
             <meshBasicMaterial color="#06b6d4" toneMapped={false} />
         </mesh>
      ))}

      {/* RENDER IMPACTS */}
      {impacts.map(i => (
          <ImpactFlare key={i.id} position={i.position} />
      ))}

      <WeaponAttacher visible={phase === GamePhase.GROUND_COMBAT} isShooting={isShooting} />

      <group ref={group}>
        {(phase === GamePhase.FREEFALL || phase === GamePhase.PARACHUTE) && (
             <WindParticles speed={currentSpeed.current} />
        )}

        <group ref={bodyRef} visible={phase !== GamePhase.GROUND_COMBAT}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <HeroSuit phase={phase} speed={currentSpeed.current} />
          </Float>
        </group>
      </group>
    </>
  );
};

// Helper to attach weapon to camera
const WeaponAttacher = ({ visible, isShooting }: { visible: boolean, isShooting: boolean }) => {
    const { camera } = useThree();
    const [weaponGroup] = useState(() => new THREE.Group());
    
    useEffect(() => {
        if (visible) {
            camera.add(weaponGroup);
        } else {
            camera.remove(weaponGroup);
        }
        return () => {
            camera.remove(weaponGroup);
        }
    }, [visible, camera, weaponGroup]);

    return visible ? (
        <group>
             <primitive object={weaponGroup}>
                <FPSWeapon isShooting={isShooting} />
             </primitive>
        </group>
    ) : null;
}