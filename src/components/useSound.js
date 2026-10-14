"use client";
import { useCallback, useEffect, useRef } from "react";
import { chapters } from "./chapters";

// Original synthesized ambience. All audio is unlocked by an explicit gesture.
export default function useSound() {
  const engine = useRef(null);
  const start = useCallback(() => {
    if (engine.current) {
      engine.current.context.resume().catch(() => {});
      return engine.current;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      const context = new AudioContext(),
        master = context.createGain(),
        compressor = context.createDynamicsCompressor();
      master.gain.value = 0;
      master.connect(compressor).connect(context.destination);
      const voices = [1, 1.5, 2.002].map((ratio, index) => {
        const oscillator = context.createOscillator(),
          volume = context.createGain();
        oscillator.frequency.value = 146.83 * ratio;
        volume.gain.value = 0.032 / (index + 1);
        oscillator.connect(volume).connect(master);
        oscillator.start();
        return { oscillator, ratio };
      });
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.32;
      engine.current = {
        context,
        master,
        voices,
        audio,
        chapter: -1,
        muted: true,
      };
      context.resume().catch(() => {});
      return engine.current;
    } catch {
      return null;
    }
  }, []);
  const update = useCallback((chapter, muted) => {
    const sound = engine.current;
    if (!sound) return;
    sound.muted = muted;
    sound.master.gain.setTargetAtTime(
      muted ? 0 : 0.55,
      sound.context.currentTime,
      0.25,
    );
    sound.audio.muted = muted;
    if (sound.chapter === chapter) return;
    sound.chapter = chapter;
    sound.voices.forEach(({ oscillator, ratio }) =>
      oscillator.frequency.setTargetAtTime(
        chapters[chapter].frequency * ratio,
        sound.context.currentTime,
        1.4,
      ),
    );
    if (process.env.NEXT_PUBLIC_USE_CHAPTER_AUDIO === "true") {
      sound.audio.src = chapters[chapter].audio;
      sound.audio.play().catch(() => {});
    }
  }, []);
  const strike = useCallback(
    (kind) => {
      const sound = start();
      if (!sound || sound.muted) return;
      const { context, master } = sound,
        now = context.currentTime,
        drum = kind === "drum";
      const frequencies = drum ? [105, 172, 240] : [523.25, 1049, 1573, 2198];
      frequencies.forEach((frequency, i) => {
        const oscillator = context.createOscillator(),
          gain = context.createGain();
        oscillator.frequency.setValueAtTime(frequency, now);
        if (drum)
          oscillator.frequency.exponentialRampToValueAtTime(
            frequency * 0.4,
            now + 0.22,
          );
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(
          (drum ? 0.34 : 0.11) / (i + 1),
          now + 0.008,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + (drum ? 0.55 : 3.5),
        );
        oscillator.connect(gain).connect(master);
        oscillator.start(now);
        oscillator.stop(now + (drum ? 0.6 : 3.6));
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
      });
    },
    [start],
  );
  useEffect(() => {
    const visibility = () => {
      const sound = engine.current;
      if (!sound) return;
      if (document.hidden) {
        sound.context.suspend().catch(() => {});
        sound.audio.pause();
      } else {
        sound.context.resume().catch(() => {});
        if (!sound.muted && sound.audio.src) sound.audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      const sound = engine.current;
      if (!sound) return;
      sound.audio.pause();
      sound.voices.forEach(({ oscillator }) => oscillator.stop());
      sound.context.close().catch(() => {});
      engine.current = null;
    };
  }, []);
  return { start, update, strike };
}
