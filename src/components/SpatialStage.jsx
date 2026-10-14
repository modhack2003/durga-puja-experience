"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyFrame } from "./journey";

// Real brass geometry gives the photographic tableaux a foreground with parallax.
export default function SpatialStage({ journey, ritual, reduced }) {
  const bell = useRef(),
    lamp = useRef(),
    flames = useRef(),
    glow = useRef();
  const time = useRef(0),
    hit = useRef({ serial: 0, at: -100 });
  const { viewport, size } = useThree();
  const bellProfile = useMemo(
    () => [
      new THREE.Vector2(0.02, 0.2),
      new THREE.Vector2(0.055, 0.18),
      new THREE.Vector2(0.08, 0.12),
      new THREE.Vector2(0.09, -0.02),
      new THREE.Vector2(0.15, -0.14),
      new THREE.Vector2(0.19, -0.17),
      new THREE.Vector2(0.19, -0.2),
      new THREE.Vector2(0.16, -0.2),
    ],
    [],
  );
  const lampProfile = useMemo(
    () => [
      new THREE.Vector2(0.24, 0),
      new THREE.Vector2(0.24, 0.06),
      new THREE.Vector2(0.12, 0.1),
      new THREE.Vector2(0.07, 0.2),
      new THREE.Vector2(0.045, 0.95),
      new THREE.Vector2(0.1, 1.02),
      new THREE.Vector2(0.28, 1.08),
      new THREE.Vector2(0.28, 1.14),
      new THREE.Vector2(0.09, 1.08),
    ],
    [],
  );
  useFrame(({ pointer }, delta) => {
    if (!reduced) time.current += Math.min(delta, 0.05);
    const t = time.current,
      frame = journeyFrame(journey.current.value),
      mobile = size.width < 760;
    if (ritual.current.serial !== hit.current.serial)
      hit.current = { serial: ritual.current.serial, at: t };
    const age = t - hit.current.at,
      ringing = ritual.current.kind === "bell" ? Math.exp(-age * 1.25) : 0;
    bell.current.visible =
      frame.index === 0 ||
      frame.index === 1 ||
      frame.index === 3 ||
      frame.index === 4;
    bell.current.position.set(
      viewport.width * (mobile ? 0.39 : 0.4),
      viewport.height * (mobile ? 0.34 : 0.42),
      1,
    );
    bell.current.scale.setScalar(mobile ? 0.62 : 1);
    bell.current.rotation.z = reduced
      ? 0
      : Math.sin(t * 1.4) * 0.025 +
        Math.sin(age * 11) * 0.3 * ringing +
        pointer.x * 0.018;
    lamp.current.visible = !mobile && [1, 3, 4].includes(frame.index);
    lamp.current.position.set(
      viewport.width * 0.405,
      -viewport.height * 0.39,
      1,
    );
    lamp.current.rotation.y = reduced ? 0 : pointer.x * 0.05;
    const welcome =
      ritual.current.kind === "flame" ? Math.max(0, 1 - age / 5) : 0;
    glow.current.intensity =
      3 + welcome * 6 + (reduced ? 0 : Math.sin(t * 9) * 0.2);
    flames.current.children.forEach((flame, i) => {
      flame.scale.y = reduced ? 1 : 1 + Math.sin(t * 7 + i * 2) * 0.12;
    });
  });
  return (
    <>
      <ambientLight intensity={1.5} color="#d9b88b" />
      <directionalLight position={[-3, 5, 5]} intensity={3} color="#ffce8b" />
      <group ref={bell} renderOrder={25}>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.7, 6]} />
          <meshStandardMaterial
            color="#a0763e"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh>
          <latheGeometry args={[bellProfile, 32]} />
          <meshStandardMaterial
            color="#c29654"
            metalness={0.82}
            roughness={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.038, 12, 8]} />
          <meshStandardMaterial
            color="#a17737"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.054, 0.012, 8, 24]} />
          <meshStandardMaterial
            color="#e4b96d"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
      <group ref={lamp} renderOrder={24}>
        <mesh>
          <latheGeometry args={[lampProfile, 32]} />
          <meshStandardMaterial
            color="#a7783e"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <group ref={flames}>
          {Array.from({ length: 5 }, (_, i) => (
            <group
              key={i}
              position={[
                Math.sin((i * Math.PI * 2) / 5) * 0.21,
                1.17,
                Math.cos((i * Math.PI * 2) / 5) * 0.21,
              ]}
            >
              <mesh scale={[0.018, 0.073, 0.018]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#ffdd9a" />
              </mesh>
            </group>
          ))}
        </group>
        <pointLight
          ref={glow}
          position={[0, 1.25, 0.3]}
          color="#ffa548"
          intensity={3}
          distance={2.5}
        />
      </group>
    </>
  );
}
