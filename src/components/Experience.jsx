"use client";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Drum,
  Eye,
  Flame,
  Flower2,
  Grid2X2,
  Headphones,
  MoveUpRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { chapters, CHAPTER_COUNT } from "./chapters";
import { chapterDesign, journeyFrame, sceneArt } from "./journey";
import Alpona, { GoddessMark } from "./Alpona";
import ExperienceDialogs from "./ExperienceDialogs";
import useSound from "./useSound";

const World = dynamic(() => import("./World"), { ssr: false });
const ritualIcons = {
  bell: Bell,
  flame: Flame,
  water: Waves,
  flower: Flower2,
  drum: Drum,
};
gsap.registerPlugin(ScrollTrigger);

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const readMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => false;

class WorldBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFallback();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function FlatScene({ chapter }) {
  return (
    <div
      className="flat-scene"
      style={{ backgroundImage: `url(${sceneArt[chapter]})` }}
    >
      {[0, 1, 3, 4].includes(chapter) && (
        <img
          className={`flat-deity flat-deity-${chapter}`}
          src={
            chapter === 0
              ? "/art/mahishasura-mardini.webp"
              : "/art/uma-family.webp"
          }
          alt=""
          width="1536"
          height="1024"
        />
      )}
      {chapter === 4 && (
        <img
          className="flat-musicians"
          src="/art/dhaki-musicians.webp"
          alt=""
          width="1536"
          height="1024"
        />
      )}
    </div>
  );
}

export default function Experience() {
  const [entered, setEntered] = useState(false),
    [chapter, setChapter] = useState(0);
  const [panel, setPanel] = useState(null),
    [muted, setMuted] = useState(true);
  const [flat, setFlat] = useState(false),
    [ready, setReady] = useState(false);
  const [still, setStill] = useState(false),
    [film, setFilm] = useState(false),
    [clean, setClean] = useState(false);
  const [feedback, setFeedback] = useState(""),
    [gesture, setGesture] = useState(0),
    [lights, setLights] = useState(0);
  const systemReduced = useSyncExternalStore(
      subscribeMotion,
      readMotion,
      serverMotion,
    ),
    reduced = !!systemReduced || still;
  const journey = useRef({ value: 0 }),
    ritual = useRef({ serial: 0, kind: "" }),
    track = useRef(null);
  const lenis = useRef(null),
    progress = useRef(null),
    progressInput = useRef(null),
    chapterRef = useRef(0);
  const pendingChapter = useRef(0),
    hero = useRef(null),
    stage = useRef(null),
    returnFocus = useRef(null);
  const { start, update, strike } = useSound();
  const onReady = useCallback(() => setReady(true), []);
  const onFallback = useCallback(() => {
    setFlat(true);
    setReady(false);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) setFlat(true);
    else gl.getExtension("WEBGL_lose_context")?.loseContext();
  }, []);

  useEffect(() => {
    if (!entered) return;
    const scroll = new Lenis({
      duration: 1.15,
      smoothWheel: !reduced,
      syncTouch: false,
    });
    lenis.current = scroll;
    scroll.on("scroll", ScrollTrigger.update);
    const tick = (time) => scroll.raf(time * 1000);
    gsap.ticker.add(tick);
    const tween = gsap.fromTo(
      journey.current,
      { value: 0 },
      {
        value: 1,
        ease: "none",
        onUpdate: () => {
          const value = journey.current.value,
            next = journeyFrame(value).index;
          if (progress.current)
            progress.current.style.transform = `scaleX(${value})`;
          if (progressInput.current)
            progressInput.current.value = Math.round(value * 1000);
          stage.current?.style.setProperty(
            "--travel",
            String(journeyFrame(value).local),
          );
          if (next !== chapterRef.current) {
            chapterRef.current = next;
            setChapter(next);
            setFeedback("");
            setGesture(0);
          }
        },
        scrollTrigger: {
          trigger: track.current,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.45,
        },
      },
    );
    ScrollTrigger.refresh();
    if (pendingChapter.current) {
      scroll.scrollTo(
        ScrollTrigger.maxScroll(window) *
          ((pendingChapter.current + 0.12) / CHAPTER_COUNT),
        { immediate: true, force: true },
      );
      pendingChapter.current = 0;
    }
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.ticker.remove(tick);
      scroll.destroy();
      lenis.current = null;
    };
  }, [entered, reduced]);

  useEffect(() => {
    if (entered)
      document
        .getElementById("chapter-content")
        ?.focus({ preventScroll: true });
  }, [entered]);

  useEffect(() => {
    update(chapter, muted);
  }, [chapter, muted, update]);
  useEffect(() => {
    document.body.style.overflow = !entered || panel ? "hidden" : "";
    if (panel) lenis.current?.stop();
    else lenis.current?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered, panel]);

  useEffect(() => {
    if (entered || reduced || !hero.current) return;
    const element = hero.current;
    const x = gsap.quickTo(element, "--mx", {
      duration: 1,
      ease: "power3.out",
    });
    const y = gsap.quickTo(element, "--my", {
      duration: 1,
      ease: "power3.out",
    });
    const move = (event) => {
      x((event.clientX / window.innerWidth - 0.5) * 16);
      y((event.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      x.tween.kill();
      y.tween.kill();
    };
  }, [entered, reduced]);

  useEffect(() => {
    if (!film || !entered || panel) return;
    const tick = (_, delta) => {
      if (document.hidden) return;
      const max = ScrollTrigger.maxScroll(window),
        y = window.scrollY + (max * Math.min(delta, 50)) / 108000;
      if (y >= max) {
        setFilm(false);
        return;
      }
      lenis.current?.scrollTo(y, { immediate: true, force: true });
    };
    const stop = () => setFilm(false);
    gsap.ticker.add(tick);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
  }, [film, entered, panel]);

  const enter = useCallback(
    (index = 0, autoplay = false) => {
      pendingChapter.current = index;
      window.scrollTo(0, 0);
      if (!muted) {
        start();
        update(index, false);
      }
      setEntered(true);
      setFilm(autoplay);
      setPanel(null);
    },
    [muted, start, update],
  );

  const goTo = useCallback(
    (index) => {
      if (!entered) {
        enter(index);
        return;
      }
      setPanel(null);
      setFilm(false);
      setFeedback("");
      const y =
        ScrollTrigger.maxScroll(window) * ((index + 0.1) / CHAPTER_COUNT);
      lenis.current?.start();
      if (lenis.current)
        lenis.current.scrollTo(y, {
          duration: reduced ? 0 : 1.6,
          immediate: reduced,
          force: true,
        });
      else window.scrollTo({ top: y, behavior: "instant" });
    },
    [entered, enter, reduced],
  );

  useEffect(() => {
    if (!entered || panel) return;
    const key = (event) => {
      if (event.target.closest("button, a, input, textarea, select")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(
          Math.min(
            CHAPTER_COUNT - 1,
            Math.max(
              0,
              chapterRef.current + (event.key === "ArrowRight" ? 1 : -1),
            ),
          ),
        );
      }
      if (event.key === "Escape") {
        setClean(false);
        setFilm(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [entered, panel, goTo]);

  const openPanel = (value) => {
    returnFocus.current = document.activeElement;
    setPanel(value);
    setFilm(false);
  };
  const closePanel = () => {
    setPanel(null);
    returnFocus.current?.focus({ preventScroll: true });
  };
  const toggleSound = () => {
    start();
    update(chapter, !muted);
    setMuted(!muted);
  };
  const perform = () => {
    const kind = chapterDesign[chapter].symbol;
    if (kind === "bell" || kind === "drum") {
      start();
      update(chapter, false);
      setMuted(false);
    }
    strike(kind);
    ritual.current = { serial: ritual.current.serial + 1, kind };
    setGesture(ritual.current.serial);
    setFeedback(chapterDesign[chapter].response);
    if (chapter === 5) setLights((value) => Math.min(value + 1, 8));
  };
  const current = chapters[chapter],
    design = chapterDesign[chapter],
    RitualIcon = ritualIcons[design.symbol];
  const transition = { duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] };

  return (
    <main
      className={`experience ${entered ? "is-entered" : ""} ${reduced ? "reduced-motion" : ""} ${clean ? "is-clean" : ""}`}
      style={{ "--accent": current.color }}
    >
      <a
        className="skip-link"
        href="#chapter-content"
        onClick={() => {
          if (!entered) enter();
        }}
      >
        Skip to the story
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="ambient-dust" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <i
            key={i}
            style={{
              "--i": i,
              left: `${(i * 17.31) % 100}%`,
              top: `${(i * 23.17) % 100}%`,
            }}
          />
        ))}
      </div>

      <header className="header">
        <button
          className="brand"
          onClick={() => (entered ? goTo(0) : window.scrollTo(0, 0))}
          aria-label="The Goddess Returns, beginning"
        >
          <GoddessMark />
          <span>
            DURGA PUJA<small>A LIVING HOMECOMING</small>
          </span>
        </button>
        <span className="header-location">
          <i /> KOLKATA, WEST BENGAL
        </span>
        <div className="header-actions">
          <button
            className="sound-control"
            onClick={toggleSound}
            aria-label={muted ? "Enable sound" : "Mute sound"}
            aria-pressed={!muted}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>SOUND {muted ? "OFF" : "ON"}</span>
            {!muted && (
              <span className="sound-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
          <span className="header-divider" />
          <button
            className="atlas-toggle"
            aria-label="The chapters"
            onClick={() => openPanel("atlas")}
            aria-haspopup="dialog"
          >
            <span>THE CHAPTERS</span>
            <Grid2X2 size={17} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {!entered && (
          <motion.section
            className="intro"
            aria-labelledby="intro-title"
            exit={{ opacity: 0, scale: reduced ? 1 : 1.035 }}
            transition={{ duration: reduced ? 0 : 0.9 }}
          >
            <div className="intro-backdrop" aria-hidden="true" />
            <div ref={hero} className="hero-sanctum" aria-hidden="true">
              <div className="sanctum-aura" />
              <Alpona className="hero-alpona" />
              <div className="sanctum-arch">
                <div className="arch-inner" />
              </div>
              <span className="sanctum-bengali" lang="bn">
                মা
              </span>
              <img
                className="hero-deity"
                src="/art/uma-family.webp"
                width="1536"
                height="1024"
                alt=""
                fetchPriority="high"
              />
              <div className="altar-lights">
                {Array.from({ length: 9 }, (_, i) => (
                  <span className="diya" key={i} style={{ "--i": i }}>
                    <i />
                  </span>
                ))}
              </div>
              <div className="sanctum-caption">
                <span className="ornament-line" /> মায়ের আগমন{" "}
                <span className="ornament-line" />
              </div>
            </div>
            <div className="intro-copy">
              <div className="eyebrow intro-eyebrow">
                <span className="tiny-star">✦</span> BENGAL’S SOUL. AN
                EVERLASTING STORY.
              </div>
              <span className="bengali intro-bengali" lang="bn">
                শুভ শারদীয়া
              </span>
              <h1 id="intro-title">
                The Goddess
                <br />
                <em>Returns.</em>
              </h1>
              <p>
                Some journeys don’t take you somewhere new.
                <br />
                They bring you <em>home.</em>
              </p>
              <div className="intro-cta">
                <button className="begin-button" onClick={() => enter()}>
                  <span className="begin-circle">
                    <ArrowUpRight size={25} strokeWidth={1.4} />
                  </span>
                  <span>
                    Begin the journey
                    <small>SIX CHAPTERS. A THOUSAND EMOTIONS.</small>
                  </span>
                </button>
                <button className="film-entry" onClick={() => enter(0, true)}>
                  <Play size={12} fill="currentColor" /> PLAY AS A FILM
                </button>
              </div>
              <div className="headphone-note">
                <Headphones size={15} />
                <span>A little closer with headphones.</span>
              </div>
            </div>
            <span className="intro-side-note">
              DEVOTION · ART · COMMUNITY · HOMECOMING
            </span>
            <div className="intro-bottom">
              <div className="intro-bottom-label">
                <span className="eyebrow">THE PASSAGE OF PUJA</span>
                <span>From the first calling to the promise of return.</span>
              </div>
              <nav className="intro-chapters" aria-label="Begin at a chapter">
                {chapters.map((item, i) => (
                  <button key={item.name} onClick={() => enter(i)}>
                    <span>0{i + 1}</span>
                    <span>{item.name}</span>
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </nav>
              <div className="intro-colophon">
                <span>AN INTERACTIVE LOVE LETTER TO BENGAL</span>
                <span lang="bn">আসছে বছর আবার হবে</span>
                <button
                  onClick={() => {
                    setFlat(true);
                    enter();
                  }}
                >
                  Explore in light mode <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {entered && (
        <>
          <div className="world" aria-hidden="true">
            <FlatScene chapter={chapter} />
            {!flat && (
              <div className={`webgl-scene ${ready ? "is-ready" : ""}`}>
                <WorldBoundary onFallback={onFallback}>
                  <World
                    journey={journey}
                    ritual={ritual}
                    reduced={reduced}
                    onReady={onReady}
                    onFallback={onFallback}
                  />
                </WorldBoundary>
              </div>
            )}
          </div>
          <div className="world-shade" aria-hidden="true" />
          <div ref={stage} className="story-stage">
            <div className="scene-location">
              <span className="live-dot" />
              <span>{current.place}</span>
              <i />
              {current.time}
            </div>
            <div className="scene-tools">
              <button
                className="icon-button"
                onClick={() => setStill(!still)}
                aria-label={
                  systemReduced
                    ? "Reduced motion follows your device preference"
                    : still
                      ? "Resume ambient motion"
                      : "Pause ambient motion"
                }
                aria-pressed={reduced}
                disabled={!!systemReduced}
                title={still ? "Resume ambient motion" : "Pause ambient motion"}
              >
                <Sparkles size={17} />
                <span>{reduced ? "STILL" : "MOTION"}</span>
              </button>
              <button
                className="icon-button"
                onClick={() => setClean(!clean)}
                aria-label={clean ? "Show story text" : "Hide story text"}
                aria-pressed={clean}
                title={clean ? "Show story text" : "Hide story text"}
              >
                <Eye size={17} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.article
                className="chapter-content"
                id="chapter-content"
                key={chapter}
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -18 }}
                transition={transition}
                tabIndex={-1}
              >
                <div className="chapter-kicker">
                  <span>0{chapter + 1}</span>
                  <i />
                  <span>{current.name.toUpperCase()}</span>
                  <small>{design.mood}</small>
                </div>
                <span className="bengali chapter-bengali" lang="bn">
                  {current.bengali}
                </span>
                <h2>
                  {design.title[0]}
                  <br />
                  <em>{design.title[1]}</em>
                </h2>
                <p>{current.description}</p>
                <button
                  className="story-link"
                  onClick={() => openPanel("story")}
                  aria-haspopup="dialog"
                >
                  <BookOpen size={15} /> THE STORY & RITUALS{" "}
                  <ArrowUpRight size={14} />
                </button>
              </motion.article>
            </AnimatePresence>
            <div className="scene-poetry" aria-hidden="true">
              <span>0{chapter + 1} / 06</span>
              <p>{design.note}</p>
            </div>
            <div className="ritual-control">
              <button
                className={`ritual-button ${gesture ? "has-gesture" : ""}`}
                onClick={perform}
              >
                <span className="ritual-icon">
                  <RitualIcon size={21} strokeWidth={1.3} />
                </span>
                <span>
                  <small>A MOMENT TO BE HERE</small>
                  {design.action}
                </span>
                <MoveUpRight size={15} />
              </button>
              <p role="status" aria-live="polite">
                {feedback ||
                  (chapter === 4
                    ? "Tap to create your own rhythm."
                    : "A small gesture. A part of the story.")}
              </p>
            </div>
            {gesture > 0 && (
              <div
                key={`${chapter}-${gesture}`}
                className={`gesture-echo gesture-${design.symbol}`}
                aria-hidden="true"
              >
                <RitualIcon size={54} strokeWidth={0.7} />
              </div>
            )}
            {chapter === 5 && (flat || !ready) && (
              <div className="fallback-lights" aria-hidden="true">
                {Array.from({ length: lights }, (_, i) => (
                  <span className="diya" style={{ "--i": i }} key={i}>
                    <i />
                  </span>
                ))}
              </div>
            )}
            <footer className="journey-footer">
              <div className="journey-controls">
                <button
                  className="play-control"
                  onClick={() => {
                    if (journey.current.value > 0.99) goTo(0);
                    setFilm(!film);
                  }}
                  aria-label={film ? "Pause film" : "Play journey as a film"}
                  aria-pressed={film}
                >
                  {film ? <Pause size={15} /> : <Play size={15} />}
                  <span>{film ? "PAUSE FILM" : "PLAY JOURNEY"}</span>
                </button>
                <span className="scroll-note">
                  {film
                    ? "LET THE STORY CARRY YOU"
                    : "SCROLL TO FEEL THE STORY"}
                  <ArrowDown size={13} />
                </span>
                <div className="chapter-steppers">
                  <button
                    className="icon-button"
                    onClick={() => goTo(Math.max(0, chapter - 1))}
                    disabled={chapter === 0}
                    aria-label="Previous chapter"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <span>
                    0{chapter + 1}
                    <i> / 06</i>
                  </span>
                  <button
                    className="icon-button"
                    onClick={() => goTo(chapter === 5 ? 0 : chapter + 1)}
                    aria-label={
                      chapter === 5 ? "Replay journey" : "Next chapter"
                    }
                  >
                    {chapter === 5 ? (
                      <RotateCcw size={15} />
                    ) : (
                      <ChevronRight size={17} />
                    )}
                  </button>
                </div>
              </div>
              <div className="timeline-track">
                <i ref={progress} />
                <input
                  ref={progressInput}
                  type="range"
                  min="0"
                  max="1000"
                  defaultValue="0"
                  aria-label="Journey progress"
                  aria-valuetext={`Chapter ${chapter + 1}: ${current.name}`}
                  onChange={(event) => {
                    setFilm(false);
                    lenis.current?.scrollTo(
                      (ScrollTrigger.maxScroll(window) *
                        Number(event.target.value)) /
                        1000,
                      { immediate: true, force: true },
                    );
                  }}
                />
              </div>
              <nav className="chapter-timeline" aria-label="Festival chapters">
                {chapters.map((item, i) => (
                  <button
                    key={item.name}
                    onClick={() => goTo(i)}
                    aria-current={chapter === i ? "step" : undefined}
                  >
                    <span className="timeline-preview">
                      <img
                        src={sceneArt[i]}
                        alt=""
                        width="180"
                        height="120"
                        loading="lazy"
                      />
                      <small>{chapterDesign[i].mood}</small>
                    </span>
                    <span className="timeline-number">0{i + 1}</span>
                    <span>{item.name}</span>
                    <span className="timeline-dot" />
                  </button>
                ))}
              </nav>
            </footer>
          </div>
          <div ref={track} className="scroll-track" aria-hidden="true" />
          <div className="sr-only" aria-live="polite">
            Chapter {chapter + 1}: {current.name}, {current.ritual}
          </div>
        </>
      )}
      <ExperienceDialogs
        panel={panel}
        chapter={chapter}
        onClose={closePanel}
        onSelect={goTo}
      />
      <noscript>
        <div className="no-script">
          <h1>The Goddess Returns</h1>
          <p>
            A journey through Durga Puja. Enable JavaScript for the interactive
            experience, or read the story here.
          </p>
          {chapters.map((item) => (
            <section key={item.name}>
              <h2>
                {item.name} — {item.ritual}
              </h2>
              <p>{item.description}</p>
              {item.context.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}
        </div>
      </noscript>
    </main>
  );
}
