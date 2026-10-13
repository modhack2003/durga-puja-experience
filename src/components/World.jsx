'use client'
import { useMemo, useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, AdaptiveDpr, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CHAPTER_COUNT } from './chapters'
import { DhakiPerformance } from './EnvironmentScenes'
import FestivalBackdrop from './FestivalBackdrop'

const smooth = (x) => x * x * (3 - 2 * x)
const mix = THREE.MathUtils.lerp

function OfferingPetals({ reduced, low }) {
  const petals=useRef()
  const transform=useMemo(()=>new THREE.Object3D(),[])
  const count=low?14:32
  useFrame(({clock})=>{
    const t=reduced?0:clock.elapsedTime
    for(let i=0;i<count;i++){
      const seed=i*2.39996
      transform.position.set(3+Math.sin(seed)*5+Math.sin(t*.18+seed)*.22,3.8-((i*.37+t*.16)%6.2),Math.cos(seed)*3)
      transform.rotation.set(seed+t*.28,seed*.7,Math.sin(t*.35+seed))
      transform.scale.set(.028,.065,.012)
      transform.updateMatrix();petals.current.setMatrixAt(i,transform.matrix)
    }
    petals.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={petals} args={[undefined,undefined,count]} frustumCulled={false}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial color="#dc7b36" roughness={.85}/></instancedMesh>
}

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

function Pandal() {
  return <group>
    <SacredTableau position={[1.2, -.2, -10]} width={7.2}/>
    {Array.from({length:10},(_,i)=><Lamp key={i} position={[i*.65-1.7,-2.7,-8.8]} scale={.65}/>)}
  </group>
}
function Pulse({reduced}) {
  return <group>
    <SacredTableau position={[2.9,0,-4.5]} width={7.5}/>
    <DhakiPerformance reduced={reduced}/>
    {[-1,1].map(side=><Lamp key={side} position={[2.9+side*3.5,-2.55,-1]} scale={1.2}/>)}
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
      const centres = [3.2, 0, 2.6, 3.1, 2.9, 2.8]
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
    <FestivalBackdrop journey={journey} reduced={reduced} />
    <fog attach="fog" args={['#08080b', 13, 29]} />
    <ambientLight intensity={0.45} color="#b9b4cb" />
    <directionalLight position={[5, 8, 5]} intensity={3.2} color="#ffc887" />
    <directionalLight position={[-6, 2, 4]} intensity={0.7} color="#98afd3" />
    {Array.from({length: CHAPTER_COUNT}, (_,i) => -i * 28).map((z, i) => <group key={z} ref={node => { worlds.current[i] = node }} position={[0, 0, z]}>
      <pointLight position={[2, 2, 4]} intensity={35} distance={18} color={i === 4 ? '#ed6332' : '#f4bd76'} />
      <pointLight position={[-4, 0, -3]} intensity={15} distance={16} color="#966346" />
      {i !== 5 && i !== 2 && <Sparkles count={low ? 45 : 110} scale={[18, 11, 16]} position={[0, 0, -2]} size={2} speed={reduced ? 0 : 0.18} color="#dca973" opacity={0.5} />}
      {(i===0||i===3||i===4)&&<OfferingPetals reduced={reduced} low={low}/>}
      {i === 0 && <Mahalaya journey={journey} reduced={reduced} entered={entered} />}
      {i === 1 && <Pandal />}

      {i === 3 && <group><SacredTableau position={[3.1, 0.3, 0]} width={8.3} />{Array.from({ length: 24 }, (_, n) => <Lamp key={n} position={[Math.sin(n * 2.4) * 4.7, -2.75, Math.cos(n * 2.4) * 2]} />)}<mesh position={[3.1, -2.7, 0]}><boxGeometry args={[8, 0.35, 3]} /><meshStandardMaterial color="#381b20" metalness={0.4} roughness={0.35} /></mesh></group>}
      {i === 4 && <Pulse reduced={reduced} />}

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
    gl.localClippingEnabled = true
    gl.domElement.setAttribute('aria-label', 'An animated journey through six Durga Puja worlds')
    gl.domElement.addEventListener('webglcontextlost', props.onFallback, { once: true })
  }}>
    <Suspense fallback={null}><Scene {...props} low={low} /></Suspense>
  </Canvas>
}
