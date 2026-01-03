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

  // Reusable vector for tail calculations to avoid allocations every frame
  const tempVector = useRef(new THREE.Vector3());

  const starColor = isDark ? "#ffffff" : "#78716c"; // Slightly brighter in light mode

  const spawnStar = () => {
    const star = starRef.current;
    // Start from bottom-left area
    const startX = Math.random() * -6 - 2; // Left side: -8 to -2
    const startY = Math.random() * -6 - 1; // Bottom: -7 to -1
    const startZ = Math.random() * -5 - 2;

    star.position.set(startX, startY, startZ);

    const speed = 0.12 + Math.random() * 0.15; // Slightly slower for more graceful movement
    // Angle pointing toward top-right (45 degrees)
    const angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.3;
    star.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);

    star.length = 1.5 + Math.random() * 2; // Longer tails for more dramatic effect
    star.opacity = 0;
    star.active = true;
    star.lifetime = 0;
    star.maxLifetime = 2 + Math.random() * 1.5; // Longer lifetime for smoother animation
  };

  // Create geometry once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0]), 3));
    return geo;
  }, []);

  // Create material once - never recreate
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: 0,
    });
  }, []);

  // Update material color when theme changes without recreating material
  useEffect(() => {
    material.color.set(starColor);
  }, [starColor, material]);

  useFrame((_, delta) => {
    const star = starRef.current;

    if (!star.active && Math.random() < 0.002 + index * 0.0003) { // Less frequent spawning
      spawnStar();
    }

    if (!star.active || !lineRef.current) return;

    star.lifetime += delta;

    const progress = star.lifetime / star.maxLifetime;
    // Smoother fade in/out curve
    if (progress < 0.15) {
      star.opacity = progress / 0.15;
    } else if (progress > 0.75) {
      star.opacity = 1 - (progress - 0.75) / 0.25;
    } else {
      star.opacity = 1;
    }

    star.position.add(star.velocity);

    const positions = geometry.attributes.position.array as Float32Array;
    positions[0] = star.position.x;
    positions[1] = star.position.y;
    positions[2] = star.position.z;

    // Use temp vector to avoid creating new Vector3 instances every frame
    tempVector.current.copy(star.velocity).normalize().multiplyScalar(-star.length);
    positions[3] = star.position.x + tempVector.current.x;
    positions[4] = star.position.y + tempVector.current.y;
    positions[5] = star.position.z + tempVector.current.z;

    // Only update GPU buffer when star is active and moving (optimization)
    geometry.attributes.position.needsUpdate = true;
    material.opacity = star.opacity * 0.6; // Increased opacity for more visibility

    // Deactivate when star goes too far right or up
    if (star.lifetime >= star.maxLifetime || star.position.x > 15 || star.position.y > 10) {
      star.active = false;
      material.opacity = 0;
      // Set needsUpdate one last time to clear the star from view
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}

function ShootingStars({ isDark = true }: { isDark?: boolean }) {
  return (
    <group>
      {Array(2).fill(null).map((_, i) => (
        <ShootingStar key={i} isDark={isDark} index={i} />
      ))}
    </group>
  );
}

// Ambient particles (slower, floating)
function AmbientParticles({ count = 50, isDark = true }: { count?: number; isDark?: boolean }) {
  const mesh = useRef<THREE.Points>(null);
  const particleColor = isDark ? "#71717a" : "#a8a29e"; // Lighter gray in dark mode

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

interface MovingShape {
  position: THREE.Vector3;
  velocity: number;
  size: number;
  active: boolean;
  rotationSpeed: number;
  rotation: THREE.Euler;
}

// Single moving shape
function MovingShapeInstance({ isDark, index, groupOffset }: { isDark: boolean; index: number; groupOffset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shapeRef = useRef<MovingShape>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: 0,
    size: 0,
    active: false,
    rotationSpeed: 0,
    rotation: new THREE.Euler(0, 0, 0),
  });

  const shapeColor = isDark ? "#52525b" : "#d6d3d1";

  // Hide mesh on mount
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0);
    }
  }, []);

  const spawnShape = () => {
    const shape = shapeRef.current;
    // Start from right side with random Y position
    const startX = Math.random() * 3 + 10;
    const startY = (Math.random() - 0.5) * 8;
    const startZ = -8 - Math.random() * 4;

    // Add offset based on position in group (0, 1, or 2)
    const offsetY = (groupOffset - 1) * 1.5; // -1.5, 0, or 1.5
    const offsetX = groupOffset * 0.5;

    shape.position.set(startX + offsetX, startY + offsetY, startZ);
    shape.velocity = 0.02 + Math.random() * 0.01; // Slower movement
    shape.size = 0.4 + Math.random() * 0.4;
    shape.rotationSpeed = 0.1 + Math.random() * 0.15;
    shape.active = true;
  };

  useFrame((state, delta) => {
    const shape = shapeRef.current;

    // Spawn shapes less frequently, staggered by group offset
    if (!shape.active && Math.random() < 0.001 + groupOffset * 0.0002) {
      spawnShape();
    }

    if (!shape.active || !meshRef.current) return;

    // Move left
    shape.position.x -= shape.velocity;

    // Rotate
    const time = state.clock.getElapsedTime();
    shape.rotation.y = time * shape.rotationSpeed;
    shape.rotation.x = Math.sin(time * shape.rotationSpeed * 0.7) * 0.3;

    // Update mesh
    meshRef.current.position.copy(shape.position);
    meshRef.current.rotation.copy(shape.rotation);
    meshRef.current.scale.setScalar(shape.size);

    // Deactivate when too far left
    if (shape.position.x < -15) {
      shape.active = false;
      meshRef.current.scale.setScalar(0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1]} />
      <meshBasicMaterial
        color={shapeColor}
        transparent
        opacity={isDark ? 0.25 : 0.25}
        wireframe
      />
    </mesh>
  );
}

// Floating 3D geometric shapes - moving right to left in groups of 3
function FloatingShapes({ isDark = true }: { isDark?: boolean }) {
  return (
    <group>
      {/* Create multiple groups of 3 shapes */}
      {Array(3).fill(null).map((_, groupIndex) => (
        <group key={groupIndex}>
          {/* 3 shapes per group, spaced out */}
          {Array(3).fill(null).map((_, shapeIndex) => (
            <MovingShapeInstance
              key={shapeIndex}
              isDark={isDark}
              index={groupIndex * 3 + shapeIndex}
              groupOffset={shapeIndex}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

export default function ParticleBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 4 : 5], fov: isMobile ? 70 : 60 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ pointerEvents: "none" }}
        events={() => ({ enabled: false, priority: 0 })}
      >
        <ShootingStars isDark={isDark} />
        {!isMobile && (
          <>
            <AmbientParticles count={60} isDark={isDark} />
            <FloatingShapes isDark={isDark} />
          </>
        )}
      </Canvas>
    </div>
  );
}
