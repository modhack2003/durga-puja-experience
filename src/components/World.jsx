'use client'
import { useMemo, useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, AdaptiveDpr, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CHAPTER_COUNT } from './chapters'

const GOLD = '#bf8b43'
const material = { color: GOLD, metalness: 0.72, roughness: 0.32 }
const smooth = (x) => x * x * (3 - 2 * x)
const mix = THREE.MathUtils.lerp

// The sacred figures use original devotional artwork on planes inside the 3D world.
// Keeping the painted face intact avoids distorting Bengali pratima iconography.
function SacredTableau({ position = [0, 0, 0], width = 7.4, battle = false }) {
  const texture = useTexture(battle ? '/art/mahishasura-mardini.webp' : '/art/uma-family.webp')
  texture.colorSpace = THREE.SRGBColorSpace
  return <mesh position={position}>
    <planeGeometry args={[width, width * 2 / 3]} />
    <meshBasicMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
  </mesh>
}

function Mahalaya({ journey, reduced, entered }) {
  const dawn = useRef()
  const aura = useRef()
  const glow = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(225,168,82,0.6)')
    gradient.addColorStop(0.4, 'rgba(225,168,82,0.22)')
    gradient.addColorStop(1, 'rgba(225,168,82,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])
  useEffect(() => () => glow.dispose(), [glow])
  useFrame(({ clock }) => {
    const progress = Math.min(1, journey.current.value * CHAPTER_COUNT)
    if (dawn.current) dawn.current.intensity = entered ? 8 + progress * 14 : 7
    if (aura.current) aura.current.material.opacity = 0.12 + (entered ? progress * 0.16 : 0) + (reduced ? 0 : Math.sin(clock.elapsedTime * 0.5) * 0.025)
  })
  return <group>
    <SacredTableau position={[3.2, 0.25, 0]} width={8.6} battle={entered} />
    <pointLight ref={dawn} position={[2.7, 3, 1]} color="#ffbd72" intensity={12} distance={14} />
    <mesh ref={aura} position={[3.2, 0.8, -0.3]}><planeGeometry args={[10, 10]} /><meshBasicMaterial map={glow} transparent opacity={0.15} depthWrite={false} toneMapped={false} /></mesh>
    <mesh position={[3.2, -2.8, 0]}><cylinderGeometry args={[3.2, 3.4, 0.3, 64]} /><meshStandardMaterial color="#301e17" roughness={0.9} /></mesh>
    {Array.from({length:12}, (_,i) => <Lamp key={i} position={[i * 0.52 + 0.3, -2.6, 1.2]} scale={0.7} />)}
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
    <SacredTableau position={[0, -0.15, -18]} width={5.8} />
  </group>
}

const waterVertex = `varying vec2 vUv; varying float vDepth; uniform float uTime; void main(){ vUv=uv; vec3 p=position; p.z+=sin(p.x*1.8+uTime*.6)*.07+sin(p.y*2.2-uTime*.4)*.06; vec4 view=modelViewMatrix*vec4(p,1.); vDepth=-view.z; gl_Position=projectionMatrix*view; }`
const waterFragment = `varying vec2 vUv; varying float vDepth; uniform float uTime; void main(){ float wave=sin(vUv.y*160.+sin(vUv.x*28.+uTime)*2.-uTime*1.8)*.5+.5; float path=exp(-pow((vUv.x-.57)*8.,2.)); vec3 base=vec3(.008,.012,.019); vec3 gold=vec3(.23,.11,.035); vec3 color=base+gold*wave*path; gl_FragColor=vec4(mix(color,vec3(.0024,.0024,.0033),smoothstep(13.,29.,vDepth)),1.); }`

function River({ reduced, saptami = false }) {
  const water = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => { if (water.current && !reduced) water.current.uniforms.uTime.value = clock.elapsedTime })
  return <group>
    <mesh position={[0, -2.5, -5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 40, 70, 70]} /><shaderMaterial ref={water} uniforms={uniforms} vertexShader={waterVertex} fragmentShader={waterFragment} /></mesh>
    <mesh position={[2, 3.5, -16]}><sphereGeometry args={[0.8, 32, 24]} /><meshBasicMaterial color={[2, 0.75, 0.24]} toneMapped={false} /></mesh>
    {Array.from({ length: saptami ? 8 : 45 }, (_, i) => <Lamp key={i} position={[Math.sin(i * 2.4) * 7, -2.38, -1 - i * 0.38]} scale={0.65 + (i % 4) * 0.12} />)}
    {!saptami && <SacredTableau position={[1.7, -0.55, -5]} width={4.9} />}
    {[-1, 1].map(side => <group key={side} position={[side * 8, -2.25, -4]}><mesh><boxGeometry args={[4, 0.4, 22]} /><meshStandardMaterial color="#3e302b" roughness={0.85} /></mesh>{Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, i * -0.13, 10 + i * 0.35]}><boxGeometry args={[4, 0.2, 0.6]} /><meshStandardMaterial color="#514238" /></mesh>)}</group>)}
  </group>
}

function Saptami({ reduced }) {
  const leaf = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(-0.8, 0.5, -0.9, 1.8, 0, 2.3)
    shape.bezierCurveTo(0.8, 1.5, 0.6, 0.5, 0, 0)
    return shape
  }, [])
  return <group>
    <River reduced={reduced} saptami />
    <group position={[2.6, -0.1, 0]}>
      <mesh position={[0, -1.55, 0]}><cylinderGeometry args={[0.9, 1.25, 0.22, 48]} /><meshStandardMaterial color="#3c2d21" /></mesh>
      <mesh position={[0, -0.65, 0]}><cylinderGeometry args={[0.27, 0.67, 1.6, 48]} /><meshStandardMaterial color="#f2e4ca" roughness={0.9} /></mesh>
      <mesh position={[0, -1.35, 0]}><cylinderGeometry args={[0.64, 0.69, 0.2, 48]} /><meshStandardMaterial color="#a52b2f" roughness={0.7} /></mesh>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, -0.18]}><cylinderGeometry args={[0.035, 0.035, 1.7, 12]} /><meshStandardMaterial color="#28682b" /></mesh>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[0, 0.1 + (i % 3) * 0.15, 0]} rotation={[0.08, i / 9 * Math.PI * 2, (i % 2 ? 1 : -1) * (0.25 + (i % 3) * 0.28)]} scale={i < 3 ? 1 : 0.65}>
        <mesh><shapeGeometry args={[leaf]} /><meshStandardMaterial color={i % 2 ? '#598448' : '#3b7135'} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 1, 0.005]}><cylinderGeometry args={[0.008, 0.008, 2, 6]} /><meshStandardMaterial color="#a9b875" /></mesh>
      </group>)}
      {Array.from({length:10}, (_,i) => <mesh key={i} position={[Math.cos(i)*0.75,-1.38,Math.sin(i)*0.75]}><sphereGeometry args={[0.08,12,10]} /><meshStandardMaterial color={i%2?'#b92234':'#edb143'} /></mesh>)}
      <Lamp position={[-1.1,-1.4,0.5]} />
      <Lamp position={[1.1,-1.4,0.5]} />
    </group>
  </group>
}

function Pulse({ reduced }) {
  const circle = useRef()
  useFrame(({ clock }) => { if (circle.current && !reduced) circle.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.12 })
  return <group ref={circle}>
    <SacredTableau position={[2.9, 0.3, -2.5]} width={7.5} />
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
  { position: [0, 0.7, 12], look: [1.4, 0.2, 0], fov: 42 },
  { position: [0.1, 0.2, -23], look: [0, 0.2, -40], fov: 50 },
  { position: [0.4, 0.8, -45], look: [1.8, 0.1, -56], fov: 45 },
  { position: [0.4, 0.6, -72], look: [1.5, -0.1, -84], fov: 42 },
  { position: [-0.6, 1, -100], look: [1, -0.5, -113], fov: 47 },
  { position: [0.8, 0.7, -131], look: [1, -0.4, -144], fov: 48 },
]

function CameraRig({ journey, reduced, entered }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ pointer }, delta) => {
    const p = Math.min(journey.current.value, 0.9999) * CHAPTER_COUNT
    const index = Math.min(CHAPTER_COUNT - 1, Math.floor(p))
    const local = p - index
    // Travel between worlds in the last third of a chapter; hold composition for reading.
    const transition = reduced ? 0 : smooth(THREE.MathUtils.clamp((local - 0.62) / 0.38, 0, 1))
    const a = stops[index], b = stops[Math.min(index + 1, CHAPTER_COUNT - 1)]
    const mobile = size.width < 760
    const parallax = reduced ? 0 : 0.22
    target.set(mix(a.position[0], b.position[0], transition) + pointer.x * parallax, mix(a.position[1], b.position[1], transition) + (reduced ? 0 : pointer.y * 0.12), mix(a.position[2], b.position[2], transition) + (mobile ? 4 : 0) - (entered && !reduced ? local * 0.7 : 0))
    look.set(mix(a.look[0], b.look[0], transition), mix(a.look[1], b.look[1], transition), mix(a.look[2], b.look[2], transition))
    if (mobile && transition === 0 && index !== 1) {
      const centres = [3.2, 0, 2.6, 3.1, 2.9, 1.7]
      target.x = centres[index] + pointer.x * parallax
      look.x = centres[index]
      look.y -= entered ? 2.3 : 0.4
      target.z += index === 0 || index === 3 ? 6 : 2
    }
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
    const index = Math.min(CHAPTER_COUNT - 1, Math.floor(journey.current.value * CHAPTER_COUNT))
    const inTransition = (journey.current.value * CHAPTER_COUNT) % 1 >= 0.62
    worlds.current.forEach((world, i) => { if (world) world.visible = i === index || (!reduced && inTransition && i === index + 1) })
  })
  useEffect(() => { onReady() }, [onReady])
  return <>
    <color attach="background" args={['#08080b']} />
    <fog attach="fog" args={['#08080b', 13, 29]} />
    <ambientLight intensity={0.45} color="#b9b4cb" />
    <directionalLight position={[5, 8, 5]} intensity={3.2} color="#ffc887" />
    <directionalLight position={[-6, 2, 4]} intensity={0.7} color="#98afd3" />
    {Array.from({length: CHAPTER_COUNT}, (_,i) => -i * 28).map((z, i) => <group key={z} ref={node => { worlds.current[i] = node }} position={[0, 0, z]}>
      <pointLight position={[2, 2, 4]} intensity={35} distance={18} color={i === 4 ? '#ed6332' : '#f4bd76'} />
      <pointLight position={[-4, 0, -3]} intensity={15} distance={16} color="#966346" />
      <Sparkles count={low ? 45 : 110} scale={[18, 11, 16]} position={[0, 0, -2]} size={2} speed={reduced ? 0 : 0.18} color="#dca973" opacity={0.5} />
      {i === 0 && <Mahalaya journey={journey} reduced={reduced} entered={entered} />}
      {i === 1 && <Pandal />}
      {i === 2 && <Saptami reduced={reduced} />}
      {i === 3 && <group><SacredTableau position={[3.1, 0.3, 0]} width={8.3} />{Array.from({ length: 24 }, (_, n) => <Lamp key={n} position={[Math.sin(n * 2.4) * 4.7, -2.75, Math.cos(n * 2.4) * 2]} />)}<mesh position={[3.1, -2.7, 0]}><boxGeometry args={[8, 0.35, 3]} /><meshStandardMaterial color="#381b20" metalness={0.4} roughness={0.35} /></mesh></group>}
      {i === 4 && <Pulse reduced={reduced} />}
      {i === 5 && <River reduced={reduced} />}
    </group>)}
    {!low && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1} intensity={0.65} mipmapBlur /><Vignette offset={0.15} darkness={0.65} /></EffectComposer>}
    <CameraRig journey={journey} reduced={reduced} entered={entered} />
    <AdaptiveDpr pixelated />
  </>
}

export default function World(props) {
  const [low, setLow] = useState(false)
  useEffect(() => { setLow(window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) < 4) }, [])
  useEffect(() => { useTexture.preload('/art/mahishasura-mardini.webp') }, [])
  return <Canvas camera={{ position: [0, 0.7, 12], fov: 42 }} dpr={[1, low ? 1.2 : 1.5]} gl={{ antialias: !low, powerPreference: 'high-performance' }} fallback={<div className="world-fallback">Your browser cannot display the 3D world. You can still explore all six chapters.</div>} onCreated={({ gl }) => {
    gl.domElement.setAttribute('aria-label', 'An animated journey through six Durga Puja worlds')
    gl.domElement.addEventListener('webglcontextlost', props.onFallback, { once: true })
  }}>
    <Suspense fallback={null}><Scene {...props} low={low} /></Suspense>
  </Canvas>
}
