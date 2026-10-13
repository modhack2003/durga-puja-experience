'use client'
import { useEffect, useRef } from 'react'
import { chapters } from './chapters'

// Sound is created inside the entry gesture so browser autoplay policies are respected.
export default function useSound() {
  const engine = useRef(null)
  const start = () => {
    if (engine.current) { engine.current.context.resume(); return }
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const master = context.createGain()
    master.gain.value = 0
    master.connect(context.destination)
    const voices = [1, 1.5, 2].map((ratio, index) => {
      const oscillator = context.createOscillator()
      const volume = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 146.83 * ratio
      volume.gain.value = 0.045 / (index + 1)
      oscillator.connect(volume).connect(master)
      oscillator.start()
      return { oscillator, ratio }
    })
    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.45
    engine.current = { context, master, voices, audio, chapter: -1, muted: false }
    context.resume()
    master.gain.setTargetAtTime(0.45, context.currentTime, 1)
  }
  const update = (chapter, muted) => {
    const sound = engine.current
    if (!sound) return
    sound.muted = muted
    sound.master.gain.setTargetAtTime(muted ? 0 : 0.45, sound.context.currentTime, 0.4)
    sound.audio.muted = muted
    if (sound.chapter === chapter) return
    sound.chapter = chapter
    sound.voices.forEach(({ oscillator, ratio }) => oscillator.frequency.setTargetAtTime(chapters[chapter].frequency * ratio, sound.context.currentTime, 1.2))
    // Local chapter recordings are optional. The original synthesized score remains audible
    // if a recording is absent; no broken media requests are issued by default.
    if (process.env.NEXT_PUBLIC_USE_CHAPTER_AUDIO === 'true') {
      sound.audio.src = chapters[chapter].audio
      sound.audio.play().catch(() => {})
    }
  }
  useEffect(() => () => {
    const sound = engine.current
    if (!sound) return
    sound.audio.pause()
    sound.voices.forEach(({ oscillator }) => oscillator.stop())
    sound.context.close()
    engine.current = null
  }, [])
  return { start, update }
}
