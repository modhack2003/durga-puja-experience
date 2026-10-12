import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import './styles.css'

const chapters = [
  {
    id: 'mahalaya',
    index: '01',
    eyebrow: 'MAHALAYA / THE CALLING',
    title: <>Before the<br /><i>city wakes.</i></>,
    copy: 'A single brushstroke gives the clay its gaze. The first light moves through the sleeping city.',
    location: 'KUMARTULI / 04:18 AM',
    cue: 'Scroll to wake the city',
    source: '/audio/01-agomoni.mp3',
    tone: 146.83,
  },
  {
    id: 'arrival',
    index: '02',
    eyebrow: 'SHASHTI / THE ARRIVAL',
    title: <>A thousand<br /><i>doors open.</i></>,
    copy: 'Temporary worlds bloom in every lane. Step through one and the ordinary loses its edges.',
    location: 'NORTH KOLKATA / 07:32 PM',
    cue: 'Keep moving',
    source: '/audio/02-pandal.mp3',
    tone: 196,
  },
  {
    id: 'eyes',
    index: '03',
    eyebrow: 'ASHTAMI / THE DARSHAN',
    title: <>Look into<br /><i>the light.</i></>,
    copy: 'For one held breath, every face in the crowd turns toward the same presence.',
    location: 'BAGBAZAR / 11:56 PM',
    cue: 'Let the gaze find you',
    source: '/audio/03-dhak.mp3',
    tone: 220,
  },
  {
    id: 'pulse',
    index: '04',
    eyebrow: 'NAVAMI / THE PULSE',
    title: <>The night<br /><i>is alive.</i></>,
    copy: 'Dhak, incense, red powder, shared food. The festival spills out of the pandal and into everyone.',
    location: 'COLLEGE SQUARE / 01:11 AM',
    cue: 'Feel the rhythm',
    source: '/audio/04-sindoor.mp3',
    tone: 110,
  },
  {
    id: 'return',
    index: '05',
    eyebrow: 'DASHAMI / THE RETURN',
    title: <>Carry the<br /><i>glow home.</i></>,
    copy: 'The clay returns to the river. The light returns with you. Until next year, Ma.',
    location: 'THE GHATS / 06:07 PM',
    cue: 'Restart the journey',
    source: '/audio/05-bijoya.mp3',
    tone: 164.81,
  },
]

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value) => value * value * (3 - 2 * value)
const lerp = (a, b, amount) => a + (b - a) * amount

function makeGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 230, 158, 1)')
  gradient.addColorStop(0.12, 'rgba(244, 160, 75, .9)')
  gradient.addColorStop(0.36, 'rgba(209, 76, 55, .26)')
  gradient.addColorStop(1, 'rgba(20, 10, 11, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

function createParticleField(count, spread, depth, texture) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const palette = [new THREE.Color('#f4c77c'), new THREE.Color('#e56e47'), new THREE.Color('#e9d8bb'), new THREE.Color('#812f38')]

  for (let index = 0; index < count; index += 1) {
    const i = index * 3
    const radius = Math.pow(Math.random(), 0.62) * spread
    const angle = Math.random() * Math.PI * 2
    positions[i] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
    positions[i + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2
    positions[i + 2] = (Math.random() - 0.5) * depth
    const color = palette[Math.floor(Math.random() * palette.length)]
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
    sizes[index] = Math.random() * 0.08 + 0.025
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  const material = new THREE.PointsMaterial({
    size: 0.11,
    map: texture,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.9,
  })
  return new THREE.Points(geometry, material)
}

function makeLine(points, color = '#e69a62', opacity = 0.45) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  return new THREE.Line(geometry, material)
}

function createPandalFrame() {
  const group = new THREE.Group()
  const gold = new THREE.MeshBasicMaterial({ color: '#d77c4e', transparent: true, opacity: 0.56 })
  const dimGold = new THREE.MeshBasicMaterial({ color: '#b35b43', transparent: true, opacity: 0.27 })
  const frame = (width, height, z, material) => {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(width, 0.025, 8, 96, Math.PI), material)
    arch.position.set(0, height * 0.18, z)
    arch.scale.y = height / width
    group.add(arch)
  }

  frame(2.5, 3.6, -0.8, gold)
  frame(3.25, 4.6, -1.2, dimGold)
  frame(4.0, 5.5, -1.6, dimGold)
  for (let index = -2; index <= 2; index += 1) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 4.5, 0.035), index === 0 ? gold : dimGold)
    pillar.position.set(index * 1.15, -0.8, -1.1 - Math.abs(index) * 0.15)
    pillar.rotation.z = index * -0.035
    group.add(pillar)
  }
  return group
}

function createGoddessObject(texture) {
  const group = new THREE.Group()
  const skin = new THREE.MeshBasicMaterial({ color: '#d56b4a', transparent: true, opacity: 0.9 })
  const gold = new THREE.MeshBasicMaterial({ color: '#f6ce89', transparent: true, opacity: 0.85 })
  const dark = new THREE.MeshBasicMaterial({ color: '#3c1722', transparent: true, opacity: 0.88 })
  const face = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 24), skin)
  face.scale.set(0.78, 1.08, 0.38)
  face.position.z = 0.2
  group.add(face)

  const crown = new THREE.Group()
  for (let index = 0; index < 9; index += 1) {
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.105 + (index === 4 ? 0.12 : 0), 0.95 + (index === 4 ? 0.34 : 0), 4), gold)
    point.position.set((index - 4) * 0.21, 1.08 - Math.abs(index - 4) * 0.065, 0.18)
    point.rotation.z = (index - 4) * -0.1
    crown.add(point)
  }
  group.add(crown)

  const eye = (x, rotation) => {
    const eyeGroup = new THREE.Group()
    const line = makeLine([
      new THREE.Vector3(-0.31, 0, 0),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0.31, 0, 0),
    ], '#f9e1b1', 0.9)
    line.rotation.z = rotation
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), dark)
    pupil.position.z = 0.06
    eyeGroup.add(line, pupil)
    eyeGroup.position.set(x, 0.2, 0.64)
    return eyeGroup
  }
  group.add(eye(-0.34, -0.05), eye(0.34, 0.05))

  const bindi = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: '#f4c77c', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending }))
  bindi.scale.set(0.21, 0.21, 1)
  bindi.position.set(0, 0.49, 0.69)
  group.add(bindi)

  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.018, 8, 128), gold)
  halo.rotation.x = Math.PI / 2
  halo.position.z = -0.1
  group.add(halo)
  const outerHalo = new THREE.Mesh(new THREE.TorusGeometry(1.73, 0.008, 8, 128), new THREE.MeshBasicMaterial({ color: '#c35441', transparent: true, opacity: 0.45 }))
  outerHalo.rotation.x = Math.PI / 2
  outerHalo.position.z = -0.2
  group.add(outerHalo)

  const trident = new THREE.Group()
  trident.add(new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 2.7, 8), gold))
  ;[-0.22, 0, 0.22].forEach((x, index) => {
    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.035, index === 1 ? 0.76 : 0.52, 8), gold)
    prong.position.set(x, 1.53 + (index === 1 ? 0.1 : 0), 0)
    trident.add(prong)
  })
  trident.position.set(0, 0.05, -0.2)
  trident.scale.set(0.55, 0.55, 0.55)
  group.add(trident)
  return group
}

function createRiver(texture) {
  const group = new THREE.Group()
  const geometry = new THREE.PlaneGeometry(18, 12, 60, 40)
  const position = geometry.attributes.position
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index)
    const y = position.getY(index)
    position.setZ(index, Math.sin(x * 1.5 + y * 1.9) * 0.07 + Math.sin(y * 4) * 0.035)
  }
  geometry.computeVertexNormals()
  const material = new THREE.MeshBasicMaterial({ color: '#2d1c25', transparent: true, opacity: 0.88, wireframe: true })
  const water = new THREE.Mesh(geometry, material)
  water.rotation.x = -Math.PI / 2.12
  water.position.set(0, -2.1, -1.2)
  group.add(water)

  for (let index = 0; index < 22; index += 1) {
    const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: '#e7764c', transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }))
    const scale = Math.random() * 0.17 + 0.08
    lamp.scale.set(scale, scale, 1)
    lamp.position.set((Math.random() - 0.5) * 9, -1.95 + Math.random() * 0.8, (Math.random() - 0.5) * 5)
    group.add(lamp)
  }
  return group
}

function PandalScene({ progressRef, pointerRef, activeRef, ready }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!ready || !canvasRef.current) return undefined

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor('#100d10', 1)
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#100d10', 0.038)
    const camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0.15, 6.7)
    const texture = makeGlowTexture()
    const universe = new THREE.Group()
    scene.add(universe)

    const particles = createParticleField(1450, 8, 15, texture)
    particles.position.z = -3
    universe.add(particles)

    const farParticles = createParticleField(580, 5, 20, texture)
    farParticles.position.z = -10
    farParticles.material.opacity = 0.48
    universe.add(farParticles)

    const frame = createPandalFrame()
    frame.position.set(0, -0.1, 0)
    frame.scale.set(1.25, 1.25, 1.25)
    universe.add(frame)

    const goddess = createGoddessObject(texture)
    goddess.position.set(0, 0.08, -0.15)
    goddess.scale.set(1.02, 1.02, 1.02)
    universe.add(goddess)

    const river = createRiver(texture)
    river.visible = false
    universe.add(river)

    const axis = makeLine([new THREE.Vector3(-5, 0, -3), new THREE.Vector3(5, 0, -3)], '#f4c77c', 0.16)
    axis.rotation.z = Math.PI / 2
    axis.visible = false
    universe.add(axis)

    const clock = new THREE.Clock()
    const target = { progress: 0, x: 0, y: 0 }
    let animationFrame

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    }
    window.addEventListener('resize', resize)

    const tick = () => {
      const time = clock.getElapsedTime()
      target.progress = lerp(target.progress, progressRef.current, 0.065)
      target.x = lerp(target.x, pointerRef.current.x, 0.04)
      target.y = lerp(target.y, pointerRef.current.y, 0.04)
      const progress = target.progress
      const intro = clamp(progress / 0.18)
      const arrive = clamp((progress - 0.12) / 0.25)
      const darshan = clamp((progress - 0.33) / 0.25)
      const pulse = clamp((progress - 0.55) / 0.25)
      const returnTrip = clamp((progress - 0.76) / 0.24)

      camera.position.x = target.x * 0.42 + Math.sin(time * 0.16) * 0.06
      camera.position.y = 0.15 + target.y * -0.26 + Math.cos(time * 0.18) * 0.05
      camera.position.z = lerp(6.7, 4.3, ease(arrive))
      camera.rotation.z = Math.sin(time * 0.11) * 0.004 + target.x * -0.008
      camera.fov = lerp(43, 37, ease(darshan))
      camera.updateProjectionMatrix()

      universe.position.y = Math.sin(time * 0.18) * 0.06
      universe.rotation.y = target.x * -0.06 + Math.sin(time * 0.08) * 0.02
      universe.rotation.x = target.y * 0.035
      universe.scale.setScalar(lerp(1, 1.1, ease(returnTrip)))

      particles.rotation.z = time * 0.008
      particles.rotation.y = time * 0.013 + target.x * 0.04
      farParticles.rotation.z = time * -0.004
      farParticles.position.y = Math.sin(time * 0.16) * 0.25

      frame.position.z = lerp(0, -1.5, ease(darshan))
      frame.rotation.z = Math.sin(time * 0.1) * 0.01
      frame.children.forEach((child, index) => { child.material.opacity = lerp(child.material.opacity, Math.max(0.025, 0.56 - darshan * 0.36 - returnTrip * 0.5), 0.04); child.rotation.z += (index % 2 ? 1 : -1) * 0.0004 })

      goddess.position.z = lerp(-0.15, -0.72, ease(darshan))
      goddess.position.y = Math.sin(time * 0.45) * 0.04
      goddess.rotation.y = target.x * 0.1
      goddess.position.z = lerp(goddess.position.z, -1.95, ease(returnTrip))
      goddess.scale.setScalar(lerp(lerp(1.02, 1.3, ease(darshan)), 0.28, ease(returnTrip)))
      goddess.children.forEach((child, index) => {
        if (child.material) {
          const glow = darshan < 0.4 ? 0.9 : 0.78 + Math.sin(time * 0.9 + index) * 0.08
          child.material.opacity = lerp(child.material.opacity, glow * lerp(1, 0.05, ease(returnTrip)), 0.04)
        }
      })

      river.visible = returnTrip > 0.01
      river.position.z = lerp(4, 0.35, ease(returnTrip))
      river.rotation.y = target.x * 0.05
      river.children.forEach((child, index) => {
        child.position.y += index > 0 ? Math.sin(time * 0.8 + index) * 0.0008 : 0
        if (child.material) child.material.opacity = lerp(child.material.opacity, returnTrip * 0.86, 0.08)
      })
      axis.visible = pulse > 0.05
      axis.material.opacity = pulse * 0.35
      particles.material.opacity = lerp(particles.material.opacity, 0.74 + pulse * 0.3 - returnTrip * 0.4, 0.05)

      const color = new THREE.Color().lerpColors(new THREE.Color('#100d10'), new THREE.Color('#331822'), clamp(pulse * 0.9 + returnTrip * 0.2))
      renderer.setClearColor(color, 1)
      renderer.render(scene, camera)
      animationFrame = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
      renderer.dispose()
      texture.dispose()
    }
  }, [activeRef, pointerRef, progressRef, ready])

  return <canvas ref={canvasRef} className="webgl-canvas" aria-label="Interactive Durga Puja world" />
}

function useSectionAudio(started, chapterIndex, tone) {
  const audioRef = useRef(null)
  const contextRef = useRef(null)
  const fallbackRef = useRef({ oscillators: [], gain: null })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!started || startedRef.current) return undefined
    startedRef.current = true
    const audio = audioRef.current
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return undefined
    const context = new AudioContext()
    contextRef.current = context
    const master = context.createGain()
    master.gain.value = 0.0001
    master.connect(context.destination)
    const oscillator = context.createOscillator()
    const shimmer = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    shimmer.type = 'triangle'
    oscillator.frequency.value = tone
    shimmer.frequency.value = tone * 2
    gain.gain.value = 0.025
    oscillator.connect(gain).connect(master)
    shimmer.connect(gain)
    oscillator.start()
    shimmer.start()
    fallbackRef.current = { oscillators: [oscillator, shimmer], gain: master }
    context.resume()
    if (audio) audio.play().catch(() => {})
    return () => {
      fallbackRef.current.oscillators.forEach((item) => item.stop())
      context.close()
    }
  }, [started, tone])

  useEffect(() => {
    if (!started) return
    const audio = audioRef.current
    if (!audio) return
    audio.src = chapters[chapterIndex].source
    audio.volume = 0.48
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [chapterIndex, started])

  useEffect(() => {
    const master = fallbackRef.current.gain
    if (!master || !contextRef.current) return
    const now = contextRef.current.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.linearRampToValueAtTime(0.018 + (chapterIndex === 3 ? 0.014 : 0), now + 0.8)
  }, [chapterIndex])

  return audioRef
}

function BootScreen({ onEnter, loading }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setCount((value) => Math.min(100, value + Math.ceil(Math.random() * 7))), 80)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <div className="boot-screen">
      <div className="boot-mark">দুর্গোৎসব</div>
      <div className="boot-center">
        <div className="boot-title"><span>THE</span><strong>GODDESS</strong><span>RETURNS</span></div>
        <div className="boot-progress"><i style={{ width: `${count}%` }} /></div>
        <div className="boot-meta"><span>{loading || count < 100 ? 'BUILDING A DIGITAL PANDAL' : 'THE DOORS ARE OPEN'}</span><b>{String(Math.min(count, 100)).padStart(2, '0')}%</b></div>
        {count >= 100 && <button className="enter-world" onClick={onEnter}>Enter the experience <span>↗</span></button>}
      </div>
      <div className="boot-footer"><span>AN INTERACTIVE FILM / SHARODIYA 2026</span><span>USE SCROLL + POINTER</span></div>
    </div>
  )
}

function App() {
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [chapterIndex, setChapterIndex] = useState(0)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const activeRef = useRef(0)
  const scrollFrame = useRef(null)
  const audioRef = useSectionAudio(started, chapterIndex, chapters[chapterIndex].tone)

  const chapter = chapters[chapterIndex]
  const chapterProgress = useMemo(() => {
    const slice = 1 / chapters.length
    return clamp((progress - chapterIndex * slice) / slice)
  }, [chapterIndex, progress])

  useEffect(() => {
    if (!started) return undefined
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const next = max > 0 ? clamp(window.scrollY / max) : 0
      progressRef.current = next
      const nextChapter = Math.min(chapters.length - 1, Math.floor(next * chapters.length + 0.0001))
      if (nextChapter !== activeRef.current) {
        activeRef.current = nextChapter
        setChapterIndex(nextChapter)
      }
      setProgress(next)
      scrollFrame.current = null
    }
    const onScroll = () => {
      if (!scrollFrame.current) scrollFrame.current = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current)
    }
  }, [started])

  useEffect(() => {
    const onPointerMove = (event) => {
      const next = { x: (event.clientX / window.innerWidth - 0.5) * 2, y: (event.clientY / window.innerHeight - 0.5) * 2 }
      pointerRef.current = next
      setPointer(next)
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useEffect(() => {
    if (!started) return undefined
    const onKey = (event) => {
      if (event.key === 'ArrowDown' || event.key === ' ') window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })
      if (event.key === 'ArrowUp') window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started])

  const enter = () => {
    setStarted(true)
    window.setTimeout(() => window.scrollTo({ top: 1, behavior: 'instant' }), 30)
  }

  const restart = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!started) return <BootScreen onEnter={enter} loading="LOADING 3D WORLD" />

  return (
    <div className="film-experience" style={{ '--chapter-progress': chapterProgress }}>
      <div className="film-stage">
        <PandalScene progressRef={progressRef} pointerRef={pointerRef} activeRef={activeRef} ready={started} />
        <div className="vignette" />
        <div className="scanlines" />
        <div className="film-cursor" style={{ transform: `translate3d(${pointer.x * 8}px, ${pointer.y * 8}px, 0)` }}><span /></div>
        <div className="hud-top"><span className="hud-logo">ॐ / 2026</span><span className="hud-title">THE GODDESS RETURNS</span><span className="hud-state"><i /> LIVE SCENE</span></div>
        <div className="hud-side"><span>SCROLL TO TRAVEL</span><i className="side-line" /></div>
        <div className="hud-progress"><span>0{chapter.index}</span><div><i style={{ width: `${(progress * 100)}%` }} /></div><span>05</span></div>
        <div className="chapter-overlay" key={chapter.id}>
          <div className="chapter-topline"><span>{chapter.eyebrow}</span><span>{chapter.location}</span></div>
          <div className="chapter-copy"><h1>{chapter.title}</h1><p>{chapter.copy}</p></div>
          <div className="chapter-bottom"><button onClick={chapterIndex === chapters.length - 1 ? restart : () => window.scrollBy({ top: window.innerHeight * 0.72, behavior: 'smooth' })}>{chapterIndex === chapters.length - 1 ? 'Replay film' : chapter.cue} <span>↓</span></button><span>{String(Math.round(chapterProgress * 100)).padStart(2, '0')} / 100</span></div>
        </div>
        <div className="chapter-dots">{chapters.map((item, index) => <span key={item.id} className={index === chapterIndex ? 'active' : ''} />)}</div>
        <audio ref={audioRef} preload="auto" loop aria-hidden="true" />
      </div>
      <div className="scroll-film" aria-hidden="true" />
    </div>
  )
}

export default App
