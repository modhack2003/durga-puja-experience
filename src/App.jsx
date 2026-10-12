import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  ChevronDown,
  CirclePlay,
  Disc3,
  Headphones,
  Menu,
  MousePointer2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

const rituals = [
  {
    number: '01',
    short: 'MAHALAYA',
    title: 'The eyes open',
    body: 'Before the city turns gold, a single brushstroke gives the goddess her gaze. Clay becomes presence. Silence becomes invitation.',
    note: 'The calling · Dawn',
  },
  {
    number: '02',
    short: 'SHASHTI',
    title: 'The city dresses up',
    body: 'Pandal walls rise like temporary galaxies. Every lane finds a new colour, every doorway becomes a little more luminous.',
    note: 'The arrival · Evening',
  },
  {
    number: '03',
    short: 'ASHTAMI',
    title: 'A thousand lamps',
    body: 'Dhak rolls through the crowd. Incense makes ribbons in the air. For one night, a city breathes in the same rhythm.',
    note: 'The pulse · Midnight',
  },
  {
    number: '04',
    short: 'NAVAMI',
    title: 'Light finds everyone',
    body: 'Food, art, prayer, laughter — the sacred and the everyday fold into each other. The pandal has no edge anymore.',
    note: 'The offering · All day',
  },
  {
    number: '05',
    short: 'DASHAMI',
    title: 'Until next year',
    body: 'The clay returns to the river. What leaves is not the feeling. Homecoming becomes memory, and memory becomes a promise.',
    note: 'The return · Sunset',
  },
]

const sounds = [
  {
    kind: 'CLASSIC',
    title: 'Agomoni / The Calling',
    artist: 'Mahalaya · archival mood',
    duration: '04:24',
    tempo: [3, 6, 9, 6, 11, 8, 4, 8, 5, 10, 7, 11, 5, 8, 6, 9],
  },
  {
    kind: 'RITUAL',
    title: 'Dhak / The Pulse',
    artist: 'Pandal field recording · imagined',
    duration: '02:48',
    tempo: [7, 11, 6, 12, 8, 14, 6, 10, 8, 12, 5, 13, 7, 11, 6, 10],
  },
  {
    kind: 'NEW',
    title: 'Neon Sindoor / Afterglow',
    artist: 'Future folk · 2026 edit',
    duration: '03:39',
    tempo: [4, 8, 5, 13, 7, 9, 11, 6, 4, 10, 8, 12, 6, 9, 5, 12],
  },
]

function GoddessMark() {
  return (
    <svg className="goddess-mark" viewBox="0 0 500 610" role="img" aria-label="Abstract goddess illustration">
      <defs>
        <linearGradient id="haloGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffdd9d" />
          <stop offset="0.42" stopColor="#d8834b" />
          <stop offset="1" stopColor="#a8272d" />
        </linearGradient>
        <linearGradient id="faceGradient" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#f3bd7c" />
          <stop offset="0.52" stopColor="#c95a3c" />
          <stop offset="1" stopColor="#791d2a" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="mark-rays" opacity="0.68" stroke="url(#haloGradient)" strokeWidth="1">
        <path d="M250 18v70M178 32l27 64M322 32l-27 64M112 73l67 51M388 73l-67 51M59 140l88 28M441 140l-88 28" />
        <path d="M32 232l100-4M468 232l-100-4M52 326l99-31M448 326l-99-31" />
      </g>
      <circle className="mark-halo halo-a" cx="250" cy="250" r="184" fill="none" stroke="url(#haloGradient)" strokeWidth="2" />
      <circle className="mark-halo halo-b" cx="250" cy="250" r="156" fill="none" stroke="#f4c98e" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 14" />
      <path className="mark-crown" d="M150 176c18-76 55-115 100-137 45 22 82 61 100 137l-40-25 5 45-65-30-65 30 5-45-40 25Z" fill="url(#haloGradient)" stroke="#f9dca1" strokeWidth="2" />
      <path d="M185 165c15-22 36-35 65-35s50 13 65 35l-18 32H203l-18-32Z" fill="#5b1824" opacity="0.72" />
      <path className="mark-face" d="M171 205c4-38 34-65 79-65s75 27 79 65l-7 111c-3 55-36 94-72 94s-69-39-72-94l-7-111Z" fill="url(#faceGradient)" stroke="#f4c98e" strokeWidth="2" />
      <path d="M178 218c18-22 37-33 72-33s54 11 72 33" fill="none" stroke="#ffdca6" strokeOpacity="0.48" strokeWidth="2" />
      <path className="mark-eye" d="M195 251c15-16 30-16 46 0-15 11-30 11-46 0ZM259 251c16-16 31-16 46 0-15 11-30 11-46 0Z" fill="#fbe1aa" />
      <path d="M202 249c9-9 19-9 28 0M270 249c9-9 19-9 28 0" fill="none" stroke="#5a1623" strokeWidth="3" strokeLinecap="round" />
      <circle cx="216" cy="250" r="3" fill="#5a1623" /><circle cx="284" cy="250" r="3" fill="#5a1623" />
      <path d="M250 263v38M235 320c10 9 20 9 30 0" fill="none" stroke="#ffdca6" strokeOpacity="0.72" strokeWidth="2" strokeLinecap="round" />
      <circle cx="250" cy="220" r="8" fill="#f5c172" stroke="#5a1623" strokeWidth="2" />
      <path d="M203 363c30 22 64 22 94 0M213 384c24 17 50 17 74 0" fill="none" stroke="#6e1c27" strokeWidth="5" strokeLinecap="round" />
      <path d="M165 205c-35 16-53 52-49 90 4 43 27 70 56 83M335 205c35 16 53 52 49 90-4 43-27 70-56 83" fill="none" stroke="#efad74" strokeOpacity="0.75" strokeWidth="5" strokeLinecap="round" />
      <path d="M185 411c28 23 50 31 65 31s37-8 65-31l25 119H160l25-119Z" fill="#8e2633" stroke="#f0b16e" strokeWidth="2" />
      <path d="M173 530c23-30 44-43 77-43s54 13 77 43" fill="none" stroke="#f7d49b" strokeWidth="5" />
      <path d="M121 489c26-13 51-13 75 2-22 13-46 14-75 5 29 36 58 51 91 48-27-39-44-58-91-55ZM379 489c-26-13-51-13-75 2 22 13 46 14 75 5-29 36-58 51-91 48 27-39 44-58 91-55Z" fill="#cc633f" stroke="#f1b273" strokeWidth="2" />
      <path className="mark-trident" d="M250 50v-30M236 24c0-14 7-21 14-21s14 7 14 21M250 50v106M231 128l19 18 19-18" fill="none" stroke="#fce0a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g className="mark-specks" fill="#f8d89e" filter="url(#softGlow)">
        <circle cx="111" cy="206" r="3" /><circle cx="393" cy="189" r="4" /><circle cx="125" cy="370" r="2" /><circle cx="386" cy="351" r="3" /><circle cx="99" cy="438" r="2" /><circle cx="406" cy="433" r="2" />
      </g>
    </svg>
  )
}

function LotusField() {
  return (
    <div className="lotus-field" aria-hidden="true">
      <span className="lotus lotus-one">✦</span>
      <span className="lotus lotus-two">✧</span>
      <span className="lotus lotus-three">✦</span>
      <span className="lotus lotus-four">✧</span>
      <span className="lotus lotus-five">✦</span>
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [activeRitual, setActiveRitual] = useState(2)
  const [activeSound, setActiveSound] = useState(1)
  const [soundOn, setSoundOn] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [wish, setWish] = useState('')
  const [wishReleased, setWishReleased] = useState(false)
  const audioRef = useRef({ context: null, timer: null })

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  useEffect(() => {
    const handlePointer = (event) => {
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      document.documentElement.style.setProperty('--pointer-x', `${x * 100}%`)
      document.documentElement.style.setProperty('--pointer-y', `${y * 100}%`)
      document.documentElement.style.setProperty('--pointer-dx', `${(x - 0.5) * 18}px`)
      document.documentElement.style.setProperty('--pointer-dy', `${(y - 0.5) * 18}px`)
    }
    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [])

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-section]')]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(Number(entry.target.dataset.section))
        })
      },
      { threshold: 0.45 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!soundOn) return undefined
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return undefined
    const context = audioRef.current.context || new AudioContext()
    audioRef.current.context = context
    const sound = sounds[activeSound]
    let step = 0
    const tick = () => {
      const frequency = activeSound === 0 ? 164.81 : activeSound === 1 ? 110 : 220
      const now = context.currentTime
      const osc = context.createOscillator()
      const gain = context.createGain()
      osc.type = activeSound === 2 ? 'triangle' : 'sine'
      osc.frequency.value = frequency * (step % 4 === 0 ? 1 : 1.5)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(activeSound === 1 ? 0.075 : 0.04, now + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)
      osc.connect(gain).connect(context.destination)
      osc.start(now)
      osc.stop(now + 0.25)
      step += 1
    }
    tick()
    audioRef.current.timer = window.setInterval(tick, activeSound === 1 ? 370 : 540)
    return () => window.clearInterval(audioRef.current.timer)
  }, [soundOn, activeSound])

  useEffect(() => {
    return () => {
      if (audioRef.current.timer) window.clearInterval(audioRef.current.timer)
      audioRef.current.context?.close()
    }
  }, [])

  const releaseWish = (event) => {
    event.preventDefault()
    if (!wish.trim()) return
    setWishReleased(true)
    window.setTimeout(() => {
      setWish('')
      setWishReleased(false)
      setWishOpen(false)
    }, 3200)
  }

  return (
    <div className={`experience ${hasEntered ? 'is-entered' : ''} ${menuOpen ? 'menu-is-open' : ''}`}>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="top-line" aria-hidden="true" />

      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('hero')} aria-label="Back to beginning">
          <span className="brand-symbol">ॐ</span>
          <span className="brand-copy"><strong>THE GODDESS</strong><small>RETURNS / 2026</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => scrollTo('ritual')}>The ritual</button>
          <button onClick={() => scrollTo('sound')}>Sound archive</button>
          <button onClick={() => setWishOpen(true)} className="nav-glow">Make a wish <ArrowUpRight size={14} /></button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <div className="mobile-nav">
        <button onClick={() => scrollTo('ritual')}>The ritual <ArrowDownRight size={16} /></button>
        <button onClick={() => scrollTo('sound')}>Sound archive <ArrowDownRight size={16} /></button>
        <button onClick={() => { setWishOpen(true); setMenuOpen(false) }}>Make a wish <Sparkles size={16} /></button>
      </div>

      <aside className="chapter-rail" aria-label="Experience chapters">
        <div className="rail-label">SHARODIYA / KOLKATA</div>
        <div className="rail-items">
          {['Arrival', 'The ritual', 'Living canvas', 'Sound archive', 'Afterglow'].map((label, index) => (
            <button key={label} className={activeSection === index ? 'is-active' : ''} onClick={() => scrollTo(['hero', 'ritual', 'canvas', 'sound', 'afterglow'][index])}>
              <span>0{index + 1}</span><i /><em>{label}</em>
            </button>
          ))}
        </div>
        <div className="rail-mark">শুভো দুর্গোৎসব</div>
      </aside>

      <main>
        <section id="hero" className="section hero-section" data-section="0">
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-aurora" aria-hidden="true" />

          <div className="hero-content page-shell">
            <div className="hero-overline reveal-up"><span className="overline-dot" /> KOLKATA / 22° 34′ N &nbsp;·&nbsp; SHARODIYA 2026</div>
            <div className="hero-title-wrap">
              <h1 className="hero-title reveal-up delay-one"><span>The</span><span className="title-accent">Goddess</span><span>Returns</span></h1>
              <p className="hero-bengali reveal-up delay-two">শুভো দুর্গোৎসব</p>
            </div>

            <div className="hero-description reveal-up delay-two">
              <span className="line-mark" />
              <p>A five-day living installation of<br />clay, light, and belonging.</p>
            </div>

            <div className="hero-art-wrap" aria-hidden="true">
              <div className="art-shadow" />
              <div className="art-ring ring-back" />
              <div className="art-ring ring-front" />
              <div className="art-glow" />
              <div className="goddess-art"><GoddessMark /></div>
              <span className="orbit-tag tag-top">THE EYES<br /><b>ARE OPEN</b></span>
              <span className="orbit-tag tag-bottom">FROM RIVER<br /><b>TO MEMORY</b></span>
            </div>

            <button className="enter-button reveal-up delay-three" onClick={() => { setHasEntered(true); scrollTo('ritual') }}>
              <span className="enter-icon"><MousePointer2 size={17} /></span>
              <span>Enter the pandal</span>
              <ArrowDownRight size={18} />
            </button>
          </div>

          <div className="hero-meta hero-meta-left"><span>SCROLL TO EXPERIENCE</span><ChevronDown size={15} /></div>
          <div className="hero-meta hero-meta-right"><span>© THE LIVING CITY</span><span>001 — 005</span></div>
          <div className="marquee-strip" aria-hidden="true"><div>শুভো দুর্গোৎসব <b>✦</b> SHUBHO DURGOTSAV <b>✦</b> THE CITY BECOMES A TEMPLE <b>✦</b> শুভো দুর্গোৎসব <b>✦</b> SHUBHO DURGOTSAV <b>✦</b></div></div>
        </section>

        <section id="ritual" className="section ritual-section" data-section="1">
          <div className="section-no">01 <span>— 05</span></div>
          <div className="page-shell ritual-layout">
            <div className="ritual-copy">
              <p className="eyebrow"><span /> THE FIRST LIGHT</p>
              <h2>Every year,<br /><i>she returns.</i></h2>
              <p className="body-copy">In Kolkata, Durga Puja is a city-sized act of making. Artists, artisans, electricians, cooks, drummers and neighbours build a temporary world — only to let it go.</p>
              <div className="ritual-quote"><span>“</span><p>The clay comes from the river.<br />The feeling stays with us.</p></div>
              <button className="text-link" onClick={() => scrollTo('canvas')}>Follow the light <ArrowUpRight size={15} /></button>
            </div>

            <div className="ritual-visual">
              <div className="sun-disc"><span>মা</span></div>
              <div className="bamboo-arch arch-one" />
              <div className="bamboo-arch arch-two" />
              <div className="arch-floor" />
              <div className="clay-bowl"><span /><span /><span /></div>
              <div className="ritual-caption"><span>MAHALAYA</span><b>the moment before<br />the city wakes</b></div>
              <LotusField />
            </div>
          </div>
          <div className="scroll-word">HOME / HOMECOMING / HOME / HOMECOMING /</div>
        </section>

        <section id="canvas" className="section canvas-section" data-section="2">
          <div className="page-shell canvas-heading">
            <div><p className="eyebrow"><span /> FIVE ACTS OF ARRIVAL</p><h2>A city in<br /><i>five moods.</i></h2></div>
            <p className="section-intro">Swipe through the days of a festival that moves from whisper to thunder, from making to memory.</p>
          </div>
          <div className="ritual-cards page-shell">
            {rituals.map((ritual, index) => (
              <button key={ritual.number} className={`ritual-card ritual-card-${index + 1} ${activeRitual === index ? 'is-selected' : ''}`} onClick={() => setActiveRitual(index)}>
                <span className="card-number">{ritual.number}</span>
                <span className="card-sun" />
                <span className="card-copy"><small>{ritual.short}</small><strong>{ritual.title}</strong></span>
                <span className="card-arrow"><ArrowUpRight size={17} /></span>
                <span className="card-hover-copy">{ritual.body}</span>
              </button>
            ))}
          </div>
          <div className="selected-ritual page-shell">
            <div className="selected-index">ACT / <b>{rituals[activeRitual].number}</b></div>
            <p>{rituals[activeRitual].body}</p>
            <span>{rituals[activeRitual].note}</span>
          </div>
        </section>

        <section id="sound" className="section sound-section" data-section="3">
          <div className="sound-bg-orb" aria-hidden="true" />
          <div className="page-shell sound-layout">
            <div className="sound-header">
              <div><p className="eyebrow"><span /> THE PANDAL AFTER DARK</p><h2>Hear the<br /><i>light move.</i></h2></div>
              <p className="section-intro">Old invocation. New voltage. A small sonic altar for the rituals that make the city feel alive.</p>
            </div>
            <div className="sound-console">
              <div className="console-topline"><span><Disc3 size={14} /> CURATED SOUND / 03</span><span className="live-indicator"><i /> LIVE IN YOUR BROWSER</span></div>
              <div className="now-playing">
                <div className="record-art"><div className="record-groove"><span>মা</span></div><span className="record-needle" /></div>
                <div className="track-info"><small>{sounds[activeSound].kind} / 0{activeSound + 1}</small><h3>{sounds[activeSound].title}</h3><p>{sounds[activeSound].artist}</p></div>
                <button className={`main-play ${soundOn ? 'is-playing' : ''}`} onClick={() => setSoundOn((on) => !on)} aria-label={soundOn ? 'Pause sound' : 'Play sound'}>{soundOn ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}</button>
              </div>
              <div className="sound-progress"><span /><i /></div>
              <div className="sound-time"><span>00:00</span><span>{sounds[activeSound].duration}</span></div>
              <div className="track-list">
                {sounds.map((sound, index) => (
                  <button key={sound.title} className={activeSound === index ? 'is-active' : ''} onClick={() => { setActiveSound(index); setSoundOn(true) }}>
                    <span className="track-play">{activeSound === index && soundOn ? <AudioLines size={15} /> : <CirclePlay size={15} />}</span>
                    <span className="mini-bars">{sound.tempo.map((height, barIndex) => <i key={barIndex} style={{ '--bar-height': `${height}px` }} />)}</span>
                    <span className="track-name"><small>{sound.kind}</small><b>{sound.title}</b><em>{sound.artist}</em></span>
                    <span className="track-duration">{sound.duration}</span>
                  </button>
                ))}
              </div>
              <div className="console-footer"><Headphones size={14} /> Turn the room up. The browser will make its own little dhak.</div>
            </div>
          </div>
        </section>

        <section id="afterglow" className="section afterglow-section" data-section="4">
          <div className="afterglow-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="page-shell afterglow-layout">
            <p className="eyebrow light"><span /> THE LAST LIGHT</p>
            <h2>Until next year,<br /><i>carry the glow.</i></h2>
            <p className="afterglow-copy">The idol returns to the river. The city returns to itself. Somewhere between goodbye and homecoming, the light becomes yours.</p>
            <div className="afterglow-actions"><button className="wish-button" onClick={() => setWishOpen(true)}><Sparkles size={16} /> Leave a little light <ArrowUpRight size={16} /></button><button className="quiet-link" onClick={() => scrollTo('hero')}>Start again <ArrowUpRight size={15} /></button></div>
            <div className="afterglow-signoff"><span>শুভো বিজয়া</span><small>SHUBHO BIJOYA / WITH LOVE FROM KOLKATA</small></div>
          </div>
          <div className="river-line" aria-hidden="true" />
        </section>
      </main>

      <div className="sound-fab"><button onClick={() => setSoundOn((on) => !on)} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>{soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}</button><span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span></div>

      {wishOpen && (
        <div className="wish-overlay" role="dialog" aria-modal="true" aria-labelledby="wish-title">
          <button className="wish-close" onClick={() => setWishOpen(false)} aria-label="Close wish dialog"><X size={19} /></button>
          <div className={`wish-card ${wishReleased ? 'is-released' : ''}`}>
            {!wishReleased ? <>
              <p className="eyebrow"><span /> A SMALL RITUAL</p>
              <h2 id="wish-title">Leave a light<br /><i>for someone.</i></h2>
              <p>Write one sentence. We will send it down the river with the last flame.</p>
              <form onSubmit={releaseWish}><textarea value={wish} onChange={(event) => setWish(event.target.value)} maxLength={120} placeholder="For the year ahead, I wish..." autoFocus /><div className="wish-form-footer"><span>{wish.length} / 120</span><button type="submit">Release into the river <ArrowUpRight size={16} /></button></div></form>
            </> : <div className="released-message"><div className="released-flame">✦</div><h2>Your light<br /><i>is on its way.</i></h2><p>Shubho Bijoya. May it find its way home.</p></div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
