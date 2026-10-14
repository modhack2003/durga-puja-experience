# Verification — living homecoming

Final validation: 14 October 2026.

The visitor can enter the exported website immediately, travel through six chapters, use each scene’s gesture, read the cultural context, control sound and motion, and return to the beginning. There is no server API or external data dependency in this flow.

| Check | Result |
| --- | --- |
| `npm run build` | Passed; static export includes `/`, the not-found page, and the icon |
| `npm test` | 2 passed; chapter boundaries and transition timing |
| `npm run test:e2e` | 7 passed in Chromium |
| Browser console | No JavaScript or console errors in the verified journey |
| Desktop layout | Inspected at 1440 × 960 |
| Phone layouts | Verified at 390 × 844 and 375 × 667, including text/control separation |
| Missing WebGL | All six chapter-specific fallback compositions remain navigable |
| WebGL context loss | Falls back without losing the active chapter |
| Dialogs | Tab containment, Escape dismissal and focus restoration verified |
| Motion | System preference applied at hydration; explicit pause does not change chapter |
| Film and timeline | Playback advances; wheel/touch interrupt; range scrubbing works |
| No JavaScript | Six complete narrative sections remain readable |
| Fonts | Four local WOFF2 files, 231,296 bytes total, with OFL licenses |
| Patch whitespace | `git diff --check` passed |

The first browser passes exposed a cropped mobile opening, a delayed reduced-motion preference, dialog Tab wrapping and a small text/control collision on the taller phone layout. These were corrected before the passing suite.

The test browser used Chromium with software WebGL in the cloud environment. This establishes functionality and visual composition, not a frame-rate guarantee on physical mobile GPUs. Safari and real-device testing remain outside this verification.

Reproduction commands and controls are in the root README. Preview images are in `docs/previews/`.
