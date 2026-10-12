# The Goddess Returns

A Next.js 16 / React 19 cinematic journey through Durga Puja. Five original 3D worlds celebrate the festival's artisans, pandals, collective prayer, dhak rhythms, and river farewell.

## Run

Node.js 20.9 or newer is required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a deployable static build:

```sh
npm run build
npm run preview
```

The generated `out/` directory can be served by any static host. `next start` is not used because this project exports a static website.

## Experience

- **Mahalaya:** a clay-and-gold goddess sculpture, crown, halo and drifting embers.
- **Shashti:** a layered illuminated pandal corridor with a forward camera journey.
- **Ashtami:** an idol, lamp offerings and a ceremonial altar.
- **Navami:** a circle of dhak drums and warm particles.
- **Dashami:** animated river reflections, floating lamps and a receding idol.

The fullscreen entry, restrained typography, scene overlays and scroll choreography take inspiration from [Edolus](https://edolus.com/). All geometry, narrative, palette and synthesized sound in this project are original; no Edolus assets or source code are included. The models are artistic, procedural interpretations rather than scans of a particular idol or pandal.

## Libraries and responsibilities

| Library | Purpose |
| --- | --- |
| Next.js App Router | Routing, metadata, client code splitting and static export |
| React Three Fiber + Three.js | Scene composition and camera rendering |
| Drei | Floating objects, particles and adaptive resolution |
| React Three Postprocessing | Bloom and vignette on desktop |
| GSAP + ScrollTrigger | Scroll progress and camera choreography |
| Lenis | Smooth scrolling and chapter jumps |
| Motion | Entry, chapter and navigation transitions |
| Lucide React | Accessible interface icons |

The heavier 3D component is dynamically loaded. Only the current and next worlds are rendered. Mobile devices use reduced resolution and skip postprocessing. Reduced-motion visitors get camera cuts, no parallax or particle movement, and immediate interface transitions. An explicit **Explore without 3D** option, automatic WebGL fallback, keyboard controls, focus-trapped chapter menu, sound toggle, and no-JavaScript chapter text keep the story accessible.

## Customize

- Edit `src/components/chapters.js` for copy, chapter colors and audio filenames.
- Edit `src/components/World.jsx` for models, lighting and camera stops.
- Edit `src/app/globals.css` for layout, typography and responsive behavior.
- Edit `src/components/Experience.jsx` for navigation and scroll behavior.

The font stylesheet uses Google Fonts with local fallbacks. The sound is a browser-generated ambient score, started only after the entry gesture. Optional local recordings can be enabled as described in `public/audio/README.md`.

## Validation

The migration was checked with a production build and browser inspection of entry, chapter navigation, replay, the sound toggle, menu dismissal and responsive layouts. Full performance across real mobile hardware remains device-dependent.

## Cultural context

This is an artistic interpretation of the homecoming and farewell of Durga, celebrating shared community and craftsmanship. It does not reproduce a specific artist's idol or claim to document every regional tradition.

Background sources: [UNESCO](https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703), [Incredible India](https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja).
