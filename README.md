# The Goddess Returns

A Next.js 16 / React 19 cinematic journey through Durga Puja. Six cinematic worlds celebrate the festival's artisans, pandals, collective prayer, dhak rhythms, and river farewell.

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

- **Mahalaya:** a dawn Mahishasura Mardini tableau, paying tribute to the beloved Bengali morning programme.
- **Shashti:** a layered illuminated pandal corridor with a forward camera journey.
- **Saptami:** Nabapatrika snan, with nine plant forms and the red-bordered white sari at the riverbank.
- **Ashtami:** the complete Bengali family pratima, lamp offerings and anjali context.
- **Navami:** three lifelike dhakis performing before the family altar, small animated drummers and spectators, marigold garlands and a decorated floor.
- **Dashami:** a photorealistic Hooghly-inspired river ghat, subtle moving ripples, boats, ghat spectators and small attendants carrying the pratima on a supported platform.

The fullscreen entry, restrained typography, scene overlays and scroll choreography take inspiration from [Edolus](https://edolus.com/). The devotional artwork, geometry, narrative, palette and synthesized sound in this project are original; no Edolus assets or source code are included. Ma and her children are shown in original devotional artwork inside the 3D worlds. The old geometric figure has been removed; the artwork preserves a traditional Bengali painted-pratima appearance and is not a volumetric scan. See `public/art/README.md` for the art briefs and cultural sources.

## Libraries and responsibilities

| Library | Purpose |
| --- | --- |
| Next.js App Router | Routing, metadata, client code splitting and static export |
| React Three Fiber + Three.js | Scene composition and camera rendering |
| Drei | Art textures, particles and adaptive resolution |
| React Three Postprocessing | Bloom and vignette on desktop |
| GSAP + ScrollTrigger | Scroll progress and camera choreography |
| Lenis | Smooth scrolling and chapter jumps |
| Motion | Entry, chapter and navigation transitions |
| Lucide React | Accessible interface icons |

The heavier 3D component is dynamically loaded. Original generated WebP environment and musician artwork adds photographic detail; custom shaders animate the water, and small 3D people and boats provide scale and motion. Only the current and next worlds are rendered. Mobile devices use reduced resolution and skip postprocessing. Reduced-motion visitors get camera cuts, no parallax or particle movement, and immediate interface transitions. An explicit **Explore without 3D** option, automatic WebGL fallback, keyboard controls, focus-trapped chapter menu, sound toggle, and no-JavaScript chapter text keep the story accessible.

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

Each of the six chapters has a **Story & Rituals** panel with Bengali headings, fuller homecoming and ritual context, and direct reading links. Chapter navigation, camera stops, progress totals and replay derive from the six-chapter sequence.
