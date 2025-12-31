"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  opacity: number;
  length: number;
  active: boolean;
  lifetime: number;
  maxLifetime: number;
}

function ShootingStar({ isDark, index }: { isDark: boolean; index: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const starRef = useRef<ShootingStar>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    opacity: 0,
    length: 0,
    active: false,
    lifetime: 0,
    maxLifetime: 0,
  });

  const starColor = isDark ? "#ffffff" : "#57534e";

  const spawnStar = () => {
    const star = starRef.current;
    const startX = Math.random() * 10 + 5;
    const startY = Math.random() * 8 - 2;
    const startZ = Math.random() * -5 - 2;

    star.position.set(startX, startY, startZ);

    const speed = 0.15 + Math.random() * 0.2;
    const angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.3;
    star.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);

    star.length = 0.8 + Math.random() * 1.2;
    star.opacity = 0;
    star.active = true;
    star.lifetime = 0;
    star.maxLifetime = 1.5 + Math.random() * 1;
  };

  // Create geometry once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0]), 3));
    return geo;
  }, []);

  // Create material once
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: 0,
    });
  }, [starColor]);

  useFrame((_, delta) => {
    const star = starRef.current;

    if (!star.active && Math.random() < 0.005 + index * 0.001) {
      spawnStar();
    }

    if (!star.active || !lineRef.current) return;

    star.lifetime += delta;

    const progress = star.lifetime / star.maxLifetime;
    if (progress < 0.1) {
      star.opacity = progress / 0.1;
    } else if (progress > 0.7) {
      star.opacity = 1 - (progress - 0.7) / 0.3;
    } else {
      star.opacity = 1;
    }

    star.position.add(star.velocity);

    const positions = geometry.attributes.position.array as Float32Array;
    positions[0] = star.position.x;
    positions[1] = star.position.y;
    positions[2] = star.position.z;

    const tailDir = star.velocity.clone().normalize().multiplyScalar(-star.length);
    positions[3] = star.position.x + tailDir.x;
    positions[4] = star.position.y + tailDir.y;
    positions[5] = star.position.z + tailDir.z;

    geometry.attributes.position.needsUpdate = true;
    material.opacity = star.opacity * 0.7;

    if (star.lifetime >= star.maxLifetime || star.position.x < -15 || star.position.y < -10) {
      star.active = false;
      material.opacity = 0;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}

function ShootingStars({ isDark = true }: { isDark?: boolean }) {
  return (
    <group>
      {Array(6).fill(null).map((_, i) => (
        <ShootingStar key={i} isDark={isDark} index={i} />
      ))}
    </group>
  );
}

// Ambient particles (slower, floating)
function AmbientParticles({ count = 50, isDark = true }: { count?: number; isDark?: boolean }) {
  const mesh = useRef<THREE.Points>(null);
  const particleColor = isDark ? "#444444" : "#a8a29e";

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.05) * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={particleColor}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Floating 3D geometric shapes
function FloatingShapes({ isDark = true }: { isDark?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const shapeColor = isDark ? "#3d3530" : "#d6d3d1";

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 1.2) * 3,
            Math.cos(i * 1.2) * 3,
            -5 - i * 0.5,
          ]}
        >
          <octahedronGeometry args={[0.1 + i * 0.02]} />
          <meshBasicMaterial
            color={shapeColor}
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ShootingStars isDark={isDark} />
        <AmbientParticles count={60} isDark={isDark} />
        <FloatingShapes isDark={isDark} />
      </Canvas>
    </div>
  );
}
