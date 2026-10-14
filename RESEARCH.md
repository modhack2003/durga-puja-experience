# A living homecoming — design research

Research and implementation: 13 October 2026.

## What the original project is saying

This is a homecoming, not an event directory. Uma is both the Divine Mother and the beloved daughter returning to her family. The existing sequence — Mahalaya, Shashti, Saptami, Ashtami, Navami, Dashami — and the Bengali copy, ritual explanations and reading links are its heart. They are retained.

The repository already contained Three.js, React Three Fiber, GSAP, Lenis and Motion. Its limitation was not a missing animation library. The audit found:

- An entrance blocked on the completion of a large 3D scene. In the baseline browser check, the primary button remained on “Preparing the world.”
- A visually isolated title treatment, with much of the devotional art hidden behind the opening overlay.
- Separate scroll-derived chapter labels and scrubbed scene progress, which could disagree during quick navigation.
- A generic image in light mode instead of a different composition for each chapter.
- Mostly passive interaction, despite an already rich narrative.
- An accumulated 1,500-line stylesheet with overlapping generations of layout rules.

## Cultural and visual research

[UNESCO’s inscription announcement](https://www.unesco.org/en/articles/durga-puja-inscribed-unesco-representative-list-intangible-cultural-heritage-humanity) places the festival’s religious observance alongside its public art, craftsmanship and communal life. That supports keeping artisans, families and collective experience central to the design.

[UNESCO’s festival record](https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703) and the original project’s [art documentation](public/art/README.md) supply the broader cultural framing. The festival-record page presented an anti-bot challenge during this session; the accessible inscription announcement and the existing chapter-specific sources were used instead. [Belur Math’s ritual context](https://belurmath.org/durga-puja-at-belur-math/) remains linked in the relevant story panels.

[Edolus](https://edolus.com/) was already the coder’s explicit interface reference. Its cinematic presentation informed the audit; no assets or code were copied. [Bruno Simon’s interactive world](https://bruno-simon.com/) informed a different principle: give the visitor a small, understandable action with an immediate response. The new interactions are quiet and connected to each chapter’s mood.

### Art direction

- **Palette:** deep burgundy, soot brown, warm ivory, lamp gold and the vermilion already present in the artwork.
- **Composition:** a generous editorial title beside a complete family tableau, framed by an arch and an original alpona-inspired line drawing.
- **Typography:** Cormorant Garamond provides warmth and variation between upright and italic forms. Manrope handles navigation; Noto Serif Bengali preserves Bengali headings. All fonts are hosted locally, with their OFL licenses.
- **Pacing:** each chapter holds its composition for its first 70%; the last 30% dissolves into the next. Visitors may scroll, jump chapters, scrub the timeline or start the approximately 108-second film mode.
- **Phone layout:** a complete tableau above the narrative, with separate entry and ritual controls. The initial browser review caught an overly cropped hero; the layout was revised before delivery.

## Interaction score

| Chapter | Visitor’s gesture | Response |
| --- | --- | --- |
| Mahalaya | Ring the bell | Synthesized bell tone, visual resonance and a swinging brass bell |
| Shashti | Light the welcome | A warm pulse and brighter foreground lamp light |
| Saptami | Touch the river | A ripple through the water portion of the scene |
| Ashtami | Offer a flower | An instanced petal burst, with a text confirmation |
| Navami | Play the dhak | A playable synthesized percussion response |
| Dashami | Leave a light | Up to eight small lamps remain on the river during the visit |

These are creative gestures, not instructions for performing puja. Sound is off by default; pressing the bell or drum explicitly enables it. No licensed broadcast, song or documentary footage is embedded. The full ritual context remains in the story panels.

## Technical research and decisions

1. [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) explicitly distinguishes a scroll callback from a scrubbed animation’s update. The new implementation derives chapter labels and progress from the animation itself. The same normalized timeline drives the rendering. Recreating the timeline after changing motion preferences uses an explicit zero-to-one range.
2. [React Three Fiber’s performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) recommends instancing repeated objects and adjusting render cost for weaker devices. The new scene uses 48 mobile or 100 desktop instanced particles, capped pixel ratios, no full-screen postprocessing stack, and stops the render loop while the document is hidden.
3. The photographic artwork stays intact. Depth comes from layered planes, pointer parallax, lathed brass geometry, animated light, instanced petals and a custom incense shader. Scene transitions use a noise-shaped dissolve; river motion is masked to lower water areas. The people in the source images remain still. This is an interactive, animated composition, not live-action video or a volumetric scan.
4. [W3C’s animation-from-interactions guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) informed the explicit motion control and respect for the system’s reduced-motion preference. Reduced motion uses immediate chapter changes, frozen ambient effects and text feedback instead of gesture animation.
5. Native HTML dialogs provide modal focus containment and Escape dismissal. The underlying page is inert while a dialog is open. Chapter controls, the native range scrubber, audio and ritual actions remain keyboard operable.
6. WebGL is progressive enhancement. Entry is immediate; a chapter-specific DOM composition remains beneath the scene. Missing WebGL, texture/render failures and context loss leave the story usable. The no-JavaScript narrative includes all six chapters.

## Scope and verification

The project remains a statically exportable Next.js app. No backend, accounts, paid service, content API or new production runtime dependency was introduced. Browser tests are a development dependency. Source artwork and cultural context were preserved.

Run `npm test`, `npm run build`, and `npm run test:e2e`. The browser suite checks all chapters, gestures, sound, replay, atlas focus containment, film interruption, scrubbing, motion toggling, missing WebGL, context loss, two phone sizes and the no-JavaScript narrative. Physical mobile GPU performance and Safari require device testing beyond the available Chromium environment.
