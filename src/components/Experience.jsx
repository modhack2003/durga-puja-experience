'use client'
import { Component, useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Headphones, Menu, Volume2, VolumeX, X, RotateCcw, BookOpen } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { chapters, CHAPTER_COUNT } from './chapters'
import useSound from './useSound'

const World = dynamic(() => import('./World'), { ssr: false, loading: () => <div className="canvas-loading" aria-hidden="true" /> })
gsap.registerPlugin(ScrollTrigger)

class WorldBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFallback() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function Experience() {
  const [entered, setEntered] = useState(false)
  const [ready, setReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [menu, setMenu] = useState(false)
  const [story, setStory] = useState(false)
  const [muted, setMuted] = useState(false)
  const [flat, setFlat] = useState(false)
  const reduced = useReducedMotion()
  const journey = useRef({ value: 0 })
  const track = useRef(null)
  const progress = useRef(null)
  const lenis = useRef(null)
  const contextCleanup = useRef(null)
  const chapterRef = useRef(0)
  const menuButton = useRef(null)
  const menuPanel = useRef(null)
  const storyButton = useRef(null)
  const { start, update } = useSound()
  const onReady = useCallback(() => setReady(true), [])
  const onFallback = useCallback(() => { setFlat(true); setReady(true) }, [])

  useEffect(() => {
    // WebGL-unavailable visitors retain an accessible, complete reading experience.
    const canvas = document.createElement('canvas')
    const supported = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    if (!supported) { setFlat(true); setReady(true) }
  }, [])

  useEffect(() => {
    if (!entered) return
    menuButton.current?.focus({ preventScroll: true })
    const context = gsap.context(() => {
      const scroll = new Lenis({ duration: reduced ? 0 : 1.25, smoothWheel: !reduced, syncTouch: false })
      lenis.current = scroll
      scroll.on('scroll', ScrollTrigger.update)
      const ticker = time => scroll.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.to(journey.current, {
        value: 1, ease: 'none',
        scrollTrigger: {
          trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.7,
          onUpdate: self => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
            const next = Math.min(CHAPTER_COUNT - 1, Math.floor(self.progress * CHAPTER_COUNT))
            if (next !== chapterRef.current) { chapterRef.current = next; setChapter(next) }
          },
        },
      })
      ScrollTrigger.refresh()
      contextCleanup.current = () => { gsap.ticker.remove(ticker); scroll.destroy(); lenis.current = null }
    })
    return () => { contextCleanup.current?.(); context.revert() }
  }, [entered, reduced])

  useEffect(() => { if (entered) update(chapter, muted) }, [entered, chapter, muted, update])
  useEffect(() => {
    document.body.style.overflow = !entered || menu || story ? 'hidden' : ''
    if (menu || story) lenis.current?.stop(); else lenis.current?.start()
    return () => { document.body.style.overflow = '' }
  }, [entered, menu, story])

  useEffect(() => {
    if (!menu && !story) return
    const items = menuPanel.current?.querySelectorAll('button, a')
    items?.[0]?.focus()
    const keydown = event => {
      if (event.key === 'Escape') { setMenu(false); setStory(false); (story ? storyButton : menuButton).current?.focus({preventScroll:true}) }
      if (event.key !== 'Tab' || !items?.length) return
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [menu, story])

  const goTo = index => {
    setMenu(false)
    setStory(false)
    lenis.current?.start()
    const max = document.documentElement.scrollHeight - window.innerHeight
    const y = max * (index / CHAPTER_COUNT + 0.025)
    if (lenis.current) lenis.current.scrollTo(y, { duration: reduced ? 0 : 1.8, force: true })
    else window.scrollTo({ top: y, behavior: reduced ? 'instant' : 'smooth' })
    menuButton.current?.focus({ preventScroll: true })
  }
  const enter = () => {
    start()
    window.scrollTo(0, 0)
    setEntered(true)
    menuButton.current?.focus({ preventScroll: true })
  }
  const current = chapters[chapter]
  const transition = { duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }

  return <main className={`experience ${entered ? 'is-entered' : ''} ${flat ? 'flat-mode' : ''}`} style={{ '--accent': current.color }}>
    <a className="skip-link" href="#chapter-content" onClick={() => { if (!entered) enter() }}>Skip to story</a>
    <div className="world" aria-hidden="true">{!flat && <WorldBoundary onFallback={onFallback}><World journey={journey} reduced={!!reduced} entered={entered} onReady={onReady} onFallback={onFallback} /></WorldBoundary>}</div>
    <div className="world-shade" aria-hidden="true" />
    <div className="grain" aria-hidden="true" />

    <header className="header">
      <button ref={menuButton} className="header-control menu-button" onClick={() => setMenu(!menu)} aria-label="Open chapter navigation" aria-expanded={menu} disabled={!entered}><Menu size={17} /><span>EXPLORE</span></button>
      <a className="wordmark" href="#" onClick={event => { event.preventDefault(); if (entered) goTo(0) }} aria-label="The Goddess Returns, beginning">DURGA<span>PUJA</span><small>THE GODDESS RETURNS</small></a>
      <button className="header-control audio-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute sound' : 'Mute sound'} aria-pressed={!muted} disabled={!entered}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}<span>SOUND {muted ? 'OFF' : 'ON'}</span></button>
    </header>

    <AnimatePresence>
      {!entered && <motion.section className="intro" exit={{ opacity: 0, filter: reduced ? 'none' : 'blur(12px)' }} transition={{ duration: reduced ? 0 : 0.9 }} aria-label="Enter the experience">
        <div className="intro-eyebrow"><span /> AN IMMERSIVE HOMECOMING <span /></div>
        <h1><span>THE GODDESS</span><span>RETURNS.</span></h1>
        <p>UMA COMES HOME WITH HER CHILDREN.<br className="mobile-only" /> SIX CHAPTERS. ONE CITY. A THOUSAND STORIES.</p>
        <button className="enter-button" onClick={enter} disabled={!ready}><span>{ready ? 'BEGIN THE JOURNEY' : 'PREPARING THE WORLD'}</span>{ready ? <ArrowUpRight size={17} /> : <i className="loading-dot" />}<i className="corner c1" /><i className="corner c2" /><i className="corner c3" /><i className="corner c4" /></button>
        <button className="text-entry" onClick={() => { setFlat(true); setReady(true); enter() }}>Explore without 3D</button>
        <div className="headphone-note"><Headphones size={25} strokeWidth={1} /><span>BEST EXPERIENCED WITH HEADPHONES</span></div>
        <div className="intro-footer"><span>KOLKATA, WEST BENGAL</span><span>দুর্গোৎসব · A CELEBRATION OF HOMECOMING</span><span>SCROLL TO DISCOVER</span></div>
      </motion.section>}
    </AnimatePresence>

    {entered && <>
      <section className="story-ui" aria-label="Festival journey">
        <div className="scene-coordinate"><span className="live-dot" /> {current.place}<span className="coordinate-separator">/</span>{current.time}</div>
        <div className="scene-marker" aria-hidden="true"><span>0{chapter + 1}</span><i /> {current.ritual.toUpperCase()}</div>
        <AnimatePresence mode="wait">
          <motion.article id="chapter-content" key={chapter} className="chapter-content" initial={{ opacity: 0, y: reduced ? 0 : 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={transition} tabIndex={-1}>
            <div className="chapter-eyebrow"><span>0{chapter + 1} / {current.name.toUpperCase()}</span><i />{current.ritual.toUpperCase()}</div>
            <div className="chapter-bengali" lang="bn">{current.bengali}</div>
            <h2>{current.title.map(line => <span key={line}>{line}</span>)}</h2>
            <p>{current.description}</p>
            <div className="chapter-actions"><button className="next-chapter" onClick={() => goTo(chapter === CHAPTER_COUNT - 1 ? 0 : chapter + 1)}>{chapter === CHAPTER_COUNT - 1 ? <RotateCcw size={14} /> : <ArrowDown size={14} />}<span>{chapter === CHAPTER_COUNT - 1 ? 'RETURN TO THE BEGINNING' : 'CONTINUE THE JOURNEY'}</span></button><button ref={storyButton} className="next-chapter story-button" onClick={() => setStory(true)}><BookOpen size={14} /><span>STORY & RITUALS</span></button></div>
          </motion.article>
        </AnimatePresence>
        <nav className="chapter-rail" aria-label="Jump to a festival chapter">{chapters.map((item, index) => <button key={item.name} onClick={() => goTo(index)} aria-label={`${index + 1}. ${item.name}: ${item.ritual}`} aria-current={index === chapter ? 'step' : undefined}><span className="rail-label">{item.name.toUpperCase()}</span><i /><span className="rail-number">0{index + 1}</span></button>)}</nav>
        <footer className="journey-footer"><span className="footer-label">SCROLL TO TRAVEL <ArrowDown size={12} /></span><div className="progress-track"><i ref={progress} /></div><span>0{chapter + 1} <b>/</b> {String(CHAPTER_COUNT).padStart(2, '0')}</span></footer>
      </section>
      <div ref={track} className="scroll-track" aria-hidden="true" />
      <div className="sr-only" aria-live="polite">Chapter {chapter + 1}: {current.name}, {current.ritual}</div>
    </>}

    <AnimatePresence>
      {menu && <motion.div ref={menuPanel} className="chapter-menu" role="dialog" aria-modal="true" aria-label="Explore the festival" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }}>
        <div className="menu-top"><span>THE JOURNEY / SIX WORLDS</span><button className="header-control" onClick={() => { setMenu(false); menuButton.current?.focus() }} aria-label="Close chapter navigation"><span>CLOSE</span><X size={22} /></button></div>
        <div className="menu-chapters">{chapters.map((item, index) => <button key={item.name} onClick={() => goTo(index)}><span className="menu-index">0{index + 1}</span><span>{item.name}<small>{item.ritual}</small></span><ArrowUpRight size={30} /></button>)}</div>
        <div className="menu-note"><span>দুর্গোৎসব</span><p>An artistic interpretation of Durga Puja’s homecoming.<br />Built to celebrate the artisans, rituals, and shared spirit of Kolkata.</p></div>
      </motion.div>}
      {story && <motion.div ref={menuPanel} className="story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-title" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:0.3}}>
        <div className="story-body">
          <div className="menu-top"><span>0{chapter+1} / THE STORY OF {current.name.toUpperCase()}</span><button className="header-control" onClick={() => {setStory(false);storyButton.current?.focus({preventScroll:true})}} aria-label="Close story and rituals"><span>CLOSE</span><X size={22}/></button></div>
          <span className="story-bengali" lang="bn">{current.bengali}</span>
          <h2 id="story-title">{current.ritual}</h2>
          {current.context.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <ul className="ritual-list">{current.rituals.map(ritual => <li key={ritual}>{ritual}</li>)}</ul>
          <div className="story-sources"><span>READ MORE</span>{current.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={12}/></a>)}</div>
        </div>
      </motion.div>}
    </AnimatePresence>
    <noscript><div className="no-script"><h1>The Goddess Returns</h1>{chapters.map(item => <section key={item.name}><h2>{item.name} — {item.ritual}</h2><p>{item.description}</p>{item.context.map(text => <p key={text}>{text}</p>)}</section>)}</div></noscript>
  </main>
}
