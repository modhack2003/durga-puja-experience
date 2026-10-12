'use client'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const GOLD = '#bf8b43'
const clay = '#a85438'
const material = { color: GOLD, metalness: 0.72, roughness: 0.32 }
const smooth = (x) => x * x * (3 - 2 * x)
const mix = THREE.MathUtils.lerp

function Eye({ x }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.31, 0)
    s.quadraticCurveTo(0, 0.23, 0.34, 0.05)
    s.quadraticCurveTo(0, -0.16, -0.31, 0)
    return s
  }, [])
  return <group position={[x, 0.1, 0.43]} rotation={[0, x * 0.15, x < 0 ? -0.08 : 0.08]}>
    <mesh><shapeGeometry args={[shape]} /><meshStandardMaterial color="#f4dfad" roughness={0.75} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.025, 0.016]}><sphereGeometry args={[0.095, 20, 16]} /><meshStandardMaterial color="#1b0b08" roughness={0.2} /></mesh>
    <mesh position={[-0.025, 0.055, 0.1]}><sphereGeometry args={[0.019, 10, 8]} /><meshBasicMaterial color="#fff2c8" /></mesh>
  </group>
}

function Goddess({ scale = 1, position = [0, 0, 0], complete = false }) {
  const crown = useMemo(() => Array.from({ length: 17 }, (_, i) => {
    const a = (i / 16) * Math.PI
    return { x: Math.cos(a) * 0.93, y: Math.sin(a) * 0.8 + 0.83, angle: a - Math.PI / 2 }
  }), [])
  return <group position={position} scale={scale}>
    <mesh scale={[0.78, 1, 0.47]}><sphereGeometry args={[1, 48, 40]} /><meshStandardMaterial color={clay} roughness={0.88} /></mesh>
    <mesh position={[0, -0.08, 0.45]} scale={[0.075, 0.22, 0.1]}><sphereGeometry args={[1, 20, 20]} /><meshStandardMaterial color={clay} roughness={0.8} /></mesh>
    <mesh position={[0, -0.43, 0.4]} scale={[0.18, 0.036, 0.045]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#8e1c26" roughness={0.6} /></mesh>
    <Eye x={-0.36} /><Eye x={0.36} />
    <mesh position={[0, 0.43, 0.44]} scale={[0.055, 0.12, 0.026]}><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#a60924" /></mesh>
    <mesh position={[0, 0.66, 0.39]}><sphereGeometry args={[0.027, 12, 12]} /><meshStandardMaterial color="#f5c978" emissive="#ff9e42" emissiveIntensity={2} /></mesh>
    <mesh position={[0, 0.9, 0]} scale={[1, 0.5, 0.3]}><sphereGeometry args={[1.02, 40, 24]} /><meshStandardMaterial {...material} /></mesh>
    {crown.map((p, i) => <group key={i} position={[p.x, p.y, 0.02]} rotation={[0, 0, -p.angle]}>
      <mesh><coneGeometry args={[0.1, 0.48 + Math.sin(i / 16 * Math.PI) * 0.24, 6]} /><meshStandardMaterial {...material} /></mesh>
      <mesh position={[0, 0.04, 0.075]}><sphereGeometry args={[0.04, 10, 10]} /><meshStandardMaterial color={i % 2 ? '#6b1520' : '#e0aa53'} metalness={0.5} roughness={0.2} /></mesh>
    </group>)}
    {[1.43, 1.56, 1.78].map((r, i) => <mesh key={r} position={[0, 0.28, -0.35]}><torusGeometry args={[r, i === 1 ? 0.009 : 0.022, 8, 100]} /><meshStandardMaterial {...material} emissive="#9e6027" emissiveIntensity={0.35} /></mesh>)}
    {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 1.68, Math.sin(a) * 1.68 + 0.28, -0.35]} rotation={[0, 0, a]}><boxGeometry args={[0.14, 0.023, 0.035]} /><meshStandardMaterial {...material} /></mesh> })}
    {[-1, 1].map(side => <group key={side} position={[side * 0.8, -0.25, 0]}>
      <mesh><torusGeometry args={[0.14, 0.027, 8, 24]} /><meshStandardMaterial {...material} /></mesh>
      <mesh position={[0, -0.24, 0]}><sphereGeometry args={[0.095, 16, 16]} /><meshStandardMaterial {...material} /></mesh>
    </group>)}
    {complete && <group>
      <mesh position={[0, -2.05, -0.12]}><coneGeometry args={[1.15, 2.8, 64]} /><meshStandardMaterial color="#7b1028" roughness={0.68} metalness={0.15} /></mesh>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[0, -1.2 - i * 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.36 + i * 0.21, 0.025, 8, 50]} /><meshStandardMaterial {...material} /></mesh>)}
      {[-1, 1].map(side => Array.from({ length: 4 }, (_, i) => <group key={`${side}-${i}`} position={[side * 0.6, -1.1, -0.2]} rotation={[0, 0, side * (0.6 + i * 0.38)]}>
        <mesh position={[0, -0.62, 0]}><capsuleGeometry args={[0.07, 1.1, 6, 12]} /><meshStandardMaterial color={clay} roughness={0.85} /></mesh>
        <mesh position={[0, -1.18, 0]}><sphereGeometry args={[0.12, 12, 12]} /><meshStandardMaterial {...material} /></mesh>
      </group>))}
    </group>}
  </group>
}

function Lamp({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <mesh scale={[1, 0.32, 1]}><sphereGeometry args={[0.19, 16, 12]} /><meshStandardMaterial color="#754122" metalness={0.45} roughness={0.5} /></mesh>
    <mesh position={[0, 0.12, 0]} scale={[0.035, 0.13, 0.035]}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color={[5, 2.1, 0.35]} toneMapped={false} /></mesh>
  </group>
}

function Portal({ z, index }) {
  return <group position={[0, 0, z]}>
    <mesh position={[0, 1, 0]}><torusGeometry args={[3.1, 0.12, 10, 64, Math.PI]} /><meshStandardMaterial color={index % 2 ? '#834b32' : GOLD} metalness={0.45} roughness={0.55} /></mesh>
    {[-1, 1].map(side => <group key={side} position={[side * 3.1, -0.8, 0]}>
      <mesh><cylinderGeometry args={[0.11, 0.18, 3.6, 12]} /><meshStandardMaterial {...material} /></mesh>
      <mesh position={[0, -1.8, 0]}><boxGeometry args={[0.5, 0.3, 0.5]} /><meshStandardMaterial color="#5c3025" /></mesh>
      <Lamp position={[0, 0.2, 0.3]} scale={1.4} />
    </group>)}
    {Array.from({ length: 19 }, (_, i) => { const a = i / 18 * Math.PI; return <mesh key={i} position={[Math.cos(a) * 3.1, Math.sin(a) * 3.1 + 1, 0.1]}><sphereGeometry args={[0.06, 10, 10]} /><meshBasicMaterial color={[2.5, 1.2, 0.25]} toneMapped={false} /></mesh> })}
  </group>
}

function Pandal() {
  return <group>
    {Array.from({ length: 8 }, (_, i) => <Portal key={i} z={-i * 2.5} index={i} />)}
    <mesh position={[0, -2.8, -8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6.8, 26]} /><meshStandardMaterial color="#33191b" metalness={0.55} roughness={0.35} /></mesh>
    {[-1, 1].map(side => Array.from({ length: 14 }, (_, i) => <Lamp key={`${side}-${i}`} position={[side * 2.7, -2.65, -i * 1.3]} />))}
    <Goddess position={[0, 0, -18]} scale={1.15} complete />
  </group>
}

const waterVertex = `varying vec2 vUv; varying float vDepth; uniform float uTime; void main(){ vUv=uv; vec3 p=position; p.z+=sin(p.x*1.8+uTime*.6)*.07+sin(p.y*2.2-uTime*.4)*.06; vec4 view=modelViewMatrix*vec4(p,1.); vDepth=-view.z; gl_Position=projectionMatrix*view; }`
const waterFragment = `varying vec2 vUv; varying float vDepth; uniform float uTime; void main(){ float wave=sin(vUv.y*160.+sin(vUv.x*28.+uTime)*2.-uTime*1.8)*.5+.5; float path=exp(-pow((vUv.x-.57)*8.,2.)); vec3 base=vec3(.008,.012,.019); vec3 gold=vec3(.23,.11,.035); vec3 color=base+gold*wave*path; gl_FragColor=vec4(mix(color,vec3(.0024,.0024,.0033),smoothstep(13.,29.,vDepth)),1.); }`

function River({ reduced }) {
  const water = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => { if (water.current && !reduced) water.current.uniforms.uTime.value = clock.elapsedTime })
  return <group>
    <mesh position={[0, -2.5, -5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 40, 70, 70]} /><shaderMaterial ref={water} uniforms={uniforms} vertexShader={waterVertex} fragmentShader={waterFragment} /></mesh>
    <mesh position={[2, 3.5, -16]}><sphereGeometry args={[0.8, 32, 24]} /><meshBasicMaterial color={[2, 0.75, 0.24]} toneMapped={false} /></mesh>
    {Array.from({ length: 45 }, (_, i) => <Lamp key={i} position={[Math.sin(i * 2.4) * 7, -2.38, -1 - i * 0.38]} scale={0.65 + (i % 4) * 0.12} />)}
    <Goddess position={[1.7, -0.65, -5]} scale={0.65} complete />
    {[-1, 1].map(side => <group key={side} position={[side * 8, -2.25, -4]}><mesh><boxGeometry args={[4, 0.4, 22]} /><meshStandardMaterial color="#3e302b" roughness={0.85} /></mesh>{Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, i * -0.13, 10 + i * 0.35]}><boxGeometry args={[4, 0.2, 0.6]} /><meshStandardMaterial color="#514238" /></mesh>)}</group>)}
  </group>
}

function Pulse({ reduced }) {
  const circle = useRef()
  useFrame(({ clock }) => { if (circle.current && !reduced) circle.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.12 })
  return <group ref={circle}>
    <Goddess position={[1.4, 0.3, -2.5]} scale={1.1} complete />
    {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <group key={i} position={[Math.cos(a) * 4.8, -1.8, Math.sin(a) * 3 - 2]} rotation={[0.15, a, 0.15]}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.42, 0.38, 0.9, 24]} /><meshStandardMaterial color="#a34326" roughness={0.6} /></mesh>
      {[-1, 1].map(side => <mesh key={side} position={[side * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.43, 0.43, 0.035, 24]} /><meshStandardMaterial color="#b89a68" roughness={0.9} /></mesh>)}
      {[-1, 1].map(side => <mesh key={`rim-${side}`} position={[side * 0.44, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.43, 0.022, 6, 24]} /><meshStandardMaterial {...material} /></mesh>)}
      {Array.from({ length: 8 }, (_, n) => { const a = n / 8 * Math.PI * 2; return <mesh key={`rope-${n}`} position={[0, Math.cos(a) * 0.41, Math.sin(a) * 0.41]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.9, 5]} /><meshStandardMaterial color="#d1b783" roughness={1} /></mesh> })}
      <Lamp position={[0, 1.2, 0]} />
    </group> })}
    <Sparkles count={150} scale={[14, 6, 10]} size={4} speed={reduced ? 0 : 0.5} color="#ff6739" opacity={0.6} />
    <mesh position={[0, -2.6, -2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[8, 64]} /><meshStandardMaterial color="#24131a" roughness={0.7} metalness={0.25} /></mesh>
  </group>
}

const stops = [
  { position: [0, 0.7, 9], look: [1, 0.2, 0], fov: 42 },
  { position: [0.1, 0.2, -23], look: [0, 0.2, -40], fov: 50 },
  { position: [0.4, 0.6, -48], look: [1.7, -0.1, -56], fov: 42 },
  { position: [-0.6, 1, -74], look: [1, -0.5, -85], fov: 47 },
  { position: [0.8, 0.7, -103], look: [1, -0.4, -116], fov: 48 },
]

function CameraRig({ journey, reduced, entered }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ pointer }, delta) => {
    const p = Math.min(journey.current.value, 0.9999) * 5
    const index = Math.min(4, Math.floor(p))
    const local = p - index
    // Travel between worlds in the last third of a chapter; hold composition for reading.
    const transition = reduced ? 0 : smooth(THREE.MathUtils.clamp((local - 0.62) / 0.38, 0, 1))
    const a = stops[index], b = stops[Math.min(index + 1, 4)]
    const mobile = size.width < 760
    const parallax = reduced ? 0 : 0.22
    target.set(mix(a.position[0], b.position[0], transition) + pointer.x * parallax, mix(a.position[1], b.position[1], transition) + (reduced ? 0 : pointer.y * 0.12), mix(a.position[2], b.position[2], transition) + (mobile ? 4 : 0) - (entered && !reduced ? local * 0.7 : 0))
    look.set(mix(a.look[0], b.look[0], transition), mix(a.look[1], b.look[1], transition), mix(a.look[2], b.look[2], transition))
    camera.position.lerp(target, reduced ? 1 : 1 - Math.exp(-delta * 5))
    camera.lookAt(look)
    camera.fov = mix(a.fov, b.fov, transition) + (mobile ? 8 : 0)
    camera.updateProjectionMatrix()
  })
  return null
}

function Scene({ journey, reduced, entered, onReady, low }) {
  const worlds = useRef([])
  useFrame(() => {
    const index = Math.min(4, Math.floor(journey.current.value * 5))
    const inTransition = (journey.current.value * 5) % 1 >= 0.62
    worlds.current.forEach((world, i) => { if (world) world.visible = i === index || (!reduced && inTransition && i === index + 1) })
  })
  useEffect(() => { onReady() }, [onReady])
  return <>
    <color attach="background" args={['#08080b']} />
    <fog attach="fog" args={['#08080b', 13, 29]} />
    <ambientLight intensity={0.45} color="#b9b4cb" />
    <directionalLight position={[5, 8, 5]} intensity={3.2} color="#ffc887" />
    <directionalLight position={[-6, 2, 4]} intensity={0.7} color="#98afd3" />
    {[0, -28, -56, -84, -112].map((z, i) => <group key={z} ref={node => { worlds.current[i] = node }} position={[0, 0, z]}>
      <pointLight position={[2, 2, 4]} intensity={35} distance={18} color={i === 3 ? '#ed6332' : '#f4bd76'} />
      <pointLight position={[-4, 0, -3]} intensity={15} distance={16} color="#966346" />
      <Sparkles count={low ? 45 : 110} scale={[18, 11, 16]} position={[0, 0, -2]} size={2} speed={reduced ? 0 : 0.18} color="#dca973" opacity={0.5} />
      {i === 0 && <Float speed={reduced ? 0 : 0.8} floatIntensity={0.12} rotationIntensity={0.08}><Goddess position={[1.9, 0.25, 0]} scale={1.65} /><mesh position={[1.9, -2.3, 0]}><cylinderGeometry args={[1.2, 1.5, 0.35, 48]} /><meshStandardMaterial color="#33231e" roughness={0.9} /></mesh></Float>}
      {i === 1 && <Pandal />}
      {i === 2 && <group><Goddess position={[1.8, 0.5, 0]} scale={1.35} complete />{Array.from({ length: 24 }, (_, n) => <Lamp key={n} position={[Math.sin(n * 2.4) * 4.7, -2.75, Math.cos(n * 2.4) * 2]} />)}<mesh position={[1.8, -3, 0]}><boxGeometry args={[5.5, 0.35, 4]} /><meshStandardMaterial color="#381b20" metalness={0.4} roughness={0.35} /></mesh></group>}
      {i === 3 && <Pulse reduced={reduced} />}
      {i === 4 && <River reduced={reduced} />}
    </group>)}
    {!low && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1} intensity={0.65} mipmapBlur /><Vignette offset={0.15} darkness={0.65} /></EffectComposer>}
    <CameraRig journey={journey} reduced={reduced} entered={entered} />
    <AdaptiveDpr pixelated />
  </>
}

export default function World(props) {
  const [low, setLow] = useState(false)
  useEffect(() => { setLow(window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) < 4) }, [])
  return <Canvas camera={{ position: [0, 0.7, 9], fov: 42 }} dpr={[1, low ? 1.2 : 1.5]} gl={{ antialias: !low, powerPreference: 'high-performance' }} fallback={<div className="world-fallback">Your browser cannot display the 3D world. You can still explore all five chapters.</div>} onCreated={({ gl }) => {
    gl.domElement.setAttribute('aria-label', 'An animated journey through five Durga Puja worlds')
    gl.domElement.addEventListener('webglcontextlost', props.onFallback, { once: true })
  }}>
    <Scene {...props} low={low} />
  </Canvas>
}
