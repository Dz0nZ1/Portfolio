import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * Neo-brutalist WebGL hero scene.
 * - A distorted wireframe torus-knot core (the "machine")
 * - A field of emissive instanced cubes drifting around it
 * - Bloom postprocessing for electric glow
 * - Mouse parallax on the whole rig
 *
 * Rendered with client:only — never SSR'd. The wrapper decides whether the
 * scene runs at all (reduced-motion / tiny screens get a static fallback).
 */

const ACCENT = '#ff3d00';
const LIME = '#d6ff3d';
const BLUE = '#3da5ff';

function Knot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.18;
    ref.current.rotation.y += dt * 0.24;
  });
  return (
    <mesh ref={ref} scale={1.55}>
      <torusKnotGeometry args={[1, 0.32, 180, 28]} />
      <MeshDistortMaterial
        color={ACCENT}
        emissive={ACCENT}
        emissiveIntensity={0.6}
        wireframe
        distort={0.32}
        speed={1.4}
        roughness={0.4}
      />
    </mesh>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x -= dt * 0.12;
    ref.current.rotation.z += dt * 0.1;
  });
  return (
    <mesh ref={ref} scale={0.85}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#0a0a0a"
        emissive={LIME}
        emissiveIntensity={0.25}
        metalness={0.6}
        roughness={0.2}
        flatShading
      />
    </mesh>
  );
}

const CUBE_COUNT = 60;

function Cubes() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Stable random layout for each cube.
  const data = useMemo(
    () =>
      Array.from({ length: CUBE_COUNT }, () => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 10 - 2
        ),
        rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        spin: 0.2 + Math.random() * 0.6,
        scale: 0.08 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    data.forEach((d, i) => {
      dummy.position.set(
        d.pos.x,
        d.pos.y + Math.sin(t * 0.5 + d.phase) * 0.4,
        d.pos.z
      );
      dummy.rotation.set(d.rot.x + t * d.spin, d.rot.y + t * d.spin, 0);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, CUBE_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#161616"
        emissive={BLUE}
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.5}
      />
    </instancedMesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    // Smooth parallax toward the pointer.
    const tx = state.pointer.x * 0.35;
    const ty = state.pointer.y * 0.25;
    ref.current.rotation.y += (tx - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-ty - ref.current.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Scene3D() {
  const [show, setShow] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    setMobile(window.innerWidth < 640);
    setShow(true);
  }, []);

  if (!show) return null;

  // On small screens push the camera back and shrink the rig so the mesh
  // sits behind the copy instead of swallowing it.
  const camZ = mobile ? 9 : 6;
  const rigScale = mobile ? 0.7 : 1;

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, camZ], fov: 52 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color={ACCENT} />
      <pointLight position={[-6, -3, 2]} intensity={30} color={BLUE} />
      <Rig>
        <group scale={rigScale}>
          <Knot />
          <Core />
          <Cubes />
        </group>
      </Rig>
      <EffectComposer>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
