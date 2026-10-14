"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import FestivalBackdrop from "./FestivalBackdrop";
import { journeyFrame } from "./journey";
import SpatialStage from "./SpatialStage";

const artSpecs = [
  { chapter: 0, map: 0, x: 0.66, y: 0.46, width: 0.64 },
  { chapter: 1, map: 1, x: 0.56, y: 0.49, width: 0.39 },
  { chapter: 3, map: 1, x: 0.7, y: 0.48, width: 0.52 },
  { chapter: 4, map: 1, x: 0.6, y: 0.52, width: 0.34 },
  { chapter: 4, map: 2, x: 0.67, y: 0.3, width: 0.4 },
];
function Artwork({ journey, reduced }) {
  const maps = useTexture([
    "/art/mahishasura-mardini.webp",
    "/art/uma-family.webp",
    "/art/dhaki-musicians.webp",
  ]);
  const layers = useRef([]),
    { viewport, size } = useThree();
  maps.forEach((map) => {
    map.colorSpace = THREE.SRGBColorSpace;
  });
  useFrame(({ pointer }) => {
    const f = journeyFrame(journey.current.value),
      mobile = size.width < 760;
    artSpecs.forEach((s, i) => {
      const mesh = layers.current[i];
      if (!mesh) return;
      const blend = reduced ? 0 : f.blend;
      const opacity =
        (f.index === s.chapter ? 1 - blend : 0) +
        (f.next === s.chapter && f.next !== f.index ? blend : 0);
      mesh.visible = opacity > 0.001;
      mesh.material.opacity = opacity;
      const width = mobile
        ? viewport.width * (s.map === 2 ? 0.7 : 0.91)
        : Math.min(
            viewport.width * s.width,
            viewport.height * (s.chapter === 0 ? 1.16 : 0.92),
          );
      const dolly = reduced
        ? 1
        : 1 + (f.index === s.chapter ? f.local : 0) * 0.04;
      mesh.scale.set(width * dolly, (width * dolly * 2) / 3, 1);
      const x = mobile ? (s.map === 2 ? 0.12 : 0.04) : s.x - 0.5,
        y = mobile ? (s.map === 2 ? 0.13 : 0.24) : s.y - 0.5;
      mesh.position.set(
        viewport.width * x + (reduced ? 0 : pointer.x * 0.055),
        viewport.height * y + (reduced ? 0 : pointer.y * 0.035),
        0,
      );
    });
  });
  return artSpecs.map((s, i) => (
    <mesh
      key={i}
      ref={(el) => {
        layers.current[i] = el;
      }}
      renderOrder={i + 1}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={maps[s.map]}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  ));
}
function Petals({ reduced, ritual, low }) {
  const mesh = useRef(),
    clock = useRef(0),
    burst = useRef({ serial: 0, time: -100 });
  const dummy = useMemo(() => new THREE.Object3D(), []),
    { viewport } = useThree(),
    count = low ? 48 : 100;
  useFrame(({ pointer }, delta) => {
    if (!reduced) clock.current += Math.min(delta, 0.05);
    const t = clock.current;
    if (burst.current.serial !== ritual.current.serial)
      burst.current = { serial: ritual.current.serial, time: t };
    const age = t - burst.current.time,
      bloom = ritual.current.kind === "flower" && age < 4 && !reduced;
    for (let i = 0; i < count; i++) {
      const seed = i * 2.39996,
        z = Math.sin(seed * 3) * 2;
      let x =
        Math.sin(seed * 1.3) * viewport.width * 0.6 +
        Math.sin(t * 0.15 + seed) * 0.3;
      let y =
        viewport.height * 0.65 -
        ((i * 0.231 + t * (0.07 + (i % 5) * 0.018)) % (viewport.height * 1.3));
      if (bloom && i < count * 0.65) {
        x = viewport.width * 0.17 + Math.cos(seed) * age * 0.55;
        y = -0.7 + Math.sin(seed) * age * 0.6 + age * 0.8 - age * age * 0.22;
      }
      x += reduced ? 0 : pointer.x * (0.05 + z * 0.016);
      dummy.position.set(x, y, z + 1);
      dummy.rotation.set(seed + t * 0.25, seed * 2 + t * 0.3, seed + t * 0.15);
      const scale = i % 4 === 0 ? 0.027 : 0.012;
      dummy.scale.set(scale, scale * 1.8, scale * 0.35);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, count]}
      frustumCulled={false}
      renderOrder={20}
    >
      <sphereGeometry args={[1, 5, 4]} />
      <meshBasicMaterial
        color="#efb164"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
const smokeFragment = `varying vec2 vUv; uniform float uTime,uStrength;
float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
void main(){vec2 uv=vUv;float f=n(uv*3.+vec2(uTime*.045,-uTime*.09))*.55+n(uv*7.+vec2(-uTime*.04,-uTime*.12))*.3+n(uv*13.-uTime*.07)*.15;float mask=pow(sin(uv.x*3.14159),2.)*pow(1.-uv.y,1.6)*smoothstep(.0,.15,uv.y);gl_FragColor=vec4(.66,.47,.29,smoothstep(.31,.78,f)*mask*uStrength);}`;
function Incense({ reduced, journey }) {
  const ref = useRef(),
    time = useRef(0),
    { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uStrength: { value: 0.23 } }),
    [],
  );
  useFrame((_, delta) => {
    if (!reduced) time.current += Math.min(delta, 0.05);
    ref.current.uniforms.uTime.value = time.current;
    const chapter = journeyFrame(journey.current.value).index;
    ref.current.uniforms.uStrength.value =
      chapter === 2 || chapter === 5 ? 0.07 : 0.25;
  });
  return (
    <mesh
      position={[viewport.width * 0.15, -viewport.height * 0.13, 2]}
      scale={[viewport.width * 0.9, viewport.height * 0.85, 1]}
      renderOrder={15}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={ref}
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"
        fragmentShader={smokeFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
function RiverLights({ ritual, journey, reduced }) {
  const group = useRef(),
    time = useRef(0),
    count = useRef(0),
    last = useRef(0),
    { viewport } = useThree();
  useFrame((_, delta) => {
    if (!reduced) time.current += Math.min(delta, 0.05);
    const f = journeyFrame(journey.current.value);
    if (ritual.current.serial !== last.current) {
      last.current = ritual.current.serial;
      if (f.index === 5) count.current = Math.min(8, count.current + 1);
    }
    group.current.visible = f.index === 5;
    group.current.children.forEach((lamp, i) => {
      lamp.visible = i < count.current;
      lamp.position.set(
        viewport.width * (0.1 + i * 0.044) +
          Math.sin(time.current * 0.15 + i) * 0.06,
        -viewport.height * (0.12 + (i % 3) * 0.047) +
          Math.sin(time.current * 0.5 + i) * 0.01,
        1,
      );
      lamp.rotation.z = Math.sin(time.current + i) * 0.04;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} scale={0.7}>
          <mesh rotation={[0.3, 0, 0]} scale={[0.13, 0.045, 0.08]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshBasicMaterial color="#b87635" />
          </mesh>
          <mesh position={[0, 0.085, 0.01]} scale={[0.022, 0.067, 0.022]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffdc88" />
          </mesh>
          <mesh position={[0, -0.1, -0.01]} scale={[0.028, 0.1, 0.02]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="#edac4f" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function Scene({ onReady, ...props }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <>
      <FestivalBackdrop {...props} />
      <Artwork {...props} />
      <SpatialStage {...props} />
      <Incense {...props} />
      <Petals {...props} />
      <RiverLights {...props} />
    </>
  );
}
export default function World(props) {
  const [hidden, setHidden] = useState(false);
  const [low] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) < 4),
  );
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 42 }}
      dpr={[1, low ? 1 : 1.5]}
      frameloop={hidden ? "never" : "always"}
      gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute("aria-hidden", "true");
        gl.domElement.addEventListener("webglcontextlost", props.onFallback, {
          once: true,
        });
      }}
    >
      <Suspense fallback={null}>
        <Scene {...props} low={low} />
      </Suspense>
    </Canvas>
  );
}
