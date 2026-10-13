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
- **Shashti:** a weathered bonedi-bari courtyard with chandeliers, green shutters, alpona and the family pratima.
- **Saptami:** a detailed Nabapatrika snan tableau with priests, plant bundle, brass vessels and bathing devotees at the ghat.
- **Ashtami:** a daylight pushpanjali courtyard with flower offerings, devotees and the complete Bengali family pratima.
- **Navami:** lifelike dhakis before the family altar in a bamboo-and-terracotta pandal with families and incense.
- **Dashami:** a cohesive river farewell with a peaceful Bengali pratima, its complete family, bearers, spectators and natural water reflections.

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

The heavier 3D component is dynamically loaded. Six original generated WebP environment plates add photographic detail, with devotional and musician layers in the 3D scenes. Custom shaders add restrained water shimmer, drifting light shafts, slow framing changes and directional chapter dissolves. Instanced petals add depth. Faces remain undistorted. These are animated photographic-style compositions, not fully animated documentary footage. Only the current and next worlds are rendered. Mobile devices use reduced resolution and skip postprocessing. Reduced-motion visitors get camera cuts, frozen ambient effects and immediate interface transitions. An explicit **Explore without 3D** option, automatic WebGL fallback, keyboard controls, focus-trapped chapter menu, sound toggle, and no-JavaScript chapter text keep the story accessible.

## Customize

- Edit `src/components/chapters.js` for copy, chapter colors and audio filenames.
- Edit `src/components/World.jsx` for models, lighting and camera stops.
- Edit `src/app/globals.css` for layout, typography and responsive behavior.
- Edit `src/components/Experience.jsx` for navigation and scroll behavior.

The font stylesheet uses Google Fonts with local fallbacks. The sound is a browser-generated ambient score, started only after the entry gesture. Optional local recordings can be enabled as described in `public/audio/README.md`.

## Validation

The migration was checked with a production build and browser inspection of entry, chapter navigation, replay, the sound toggle, menu dismissal and responsive layouts. Full performance across real mobile hardware remains device-dependent.

The latest six-background realism revision passes the production build and exported-asset checks. Source images were visually inspected. Final in-browser visual verification remains pending because browser access to the local preview was blocked by the browser tool's security policy.

## Cultural context

This is an artistic interpretation of the homecoming and farewell of Durga, celebrating shared community and craftsmanship. It does not reproduce a specific artist's idol or claim to document every regional tradition.

Background sources: [UNESCO](https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703), [Incredible India](https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja).

Each of the six chapters has a **Story & Rituals** panel with Bengali headings, fuller homecoming and ritual context, and direct reading links. Chapter navigation, camera stops, progress totals and replay derive from the six-chapter sequence.
