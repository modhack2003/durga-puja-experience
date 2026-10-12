# The Goddess Returns

An experimental, motion-first Durga Puja web experience. Built as a small digital pandal: part editorial film, part sound altar, part interactive ritual.

## Direction

- **Visual language:** night-time Kolkata, clay, sindoor, lamp light, oxidized gold, deep wine and ink.
- **Experience arc:** a loading gate → camera travel through five festival scenes → river return.
- **Interactions:** scroll-driven camera travel, pointer-driven orbit control, live chapter HUD, ambient particle field, 3D pandal frames, goddess geometry, river wireframe, and an enter-to-start audio narrative.
- **Audio:** there is no visible music player. The opening gesture starts local chapter audio when files are added; until then, a quiet Web Audio tonal bed keeps the prototype alive. See `public/audio/README.md`.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Experience architecture

The new interaction model takes the structural cue from [Edolus](https://edolus.com/): the screen is a fullscreen world, not a collection of web sections. A fixed Three.js stage is driven by a 650vh scroll track. As the visitor moves, the camera, fog, particle fields, ritual geometry and chapter copy move together like a short interactive film.

The five scenes are:

1. **Mahalaya / The Calling** — particles, first light, the pre-dawn eye-opening.
2. **Shasthi / The Arrival** — concentric pandal frames and a forward camera push.
3. **Ashtami / The Darshan** — the abstract goddess figure comes close and looks back.
4. **Navami / The Pulse** — faster particle rhythm and a warmer, denser scene.
5. **Dashami / The Return** — the goddess recedes into a wireframe river of floating lamps.

## Research notes

The visual story is grounded in the festival's public art and community rituals:

- UNESCO describes Kolkata's Durga Puja as an annual ten-day celebration in which clay images are made by artisans, given their eyes at Mahalaya, and immersed at the end of the festival. It is recognized on the Representative List of the Intangible Cultural Heritage of Humanity (2021).
- Incredible India describes the homecoming of Durga and her children, the theme-pandal tradition, dhak drumming, shared food, lighting, and the final immersion as the emotional arc of the celebration.
- The interaction direction takes cues from creative-web references such as Bruno Simon's playful world-building portfolio and the cinematic, scroll-led work collected by Awwwards and The FWA: strong chapters, small UI labels, ambient motion, and a feeling of discovering a place rather than browsing a brochure.

### Sources

- [UNESCO — Durga Puja in Kolkata](https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703)
- [Incredible India — Durga Puja: An incomparable celebration of devotion and art](https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja)
- [Bruno Simon — folio 2025](https://bruno-simon.com/)
- [The FWA — digital experience inspiration](https://thefwa.com/)

## Cultural note

This concept uses abstract visual motifs rather than reproducing a specific temple, family idol, artist's pandal, or devotional recording. It is meant to celebrate the atmosphere of Durga Puja while leaving space for many regional and personal interpretations.
