import { CHAPTER_COUNT } from "./chapters.js";

// One timeline drives the copy, artwork, sound and navigation together.
export function journeyFrame(value) {
  const position = Math.min(Math.max(value, 0), 0.999999) * CHAPTER_COUNT;
  const index = Math.floor(position);
  const local = position - index;
  const t = Math.min(1, Math.max(0, (local - 0.7) / 0.3));
  return {
    index,
    next: Math.min(index + 1, CHAPTER_COUNT - 1),
    local,
    blend: t * t * (3 - 2 * t),
  };
}

export const sceneArt = [
  "/art/bengal-dawn.webp",
  "/art/thakur-dalan.webp",
  "/art/saptami-ghat.webp",
  "/art/ashtami-anjali.webp",
  "/art/navami-pandal.webp",
  "/art/bhasan-farewell.webp",
];

export const chapterDesign = [
  {
    title: ["Before the light,", "a calling."],
    mood: "ANTICIPATION",
    note: "The first light. The first promise.",
    action: "Ring the bell",
    response: "A little resonance. A new beginning.",
    symbol: "bell",
  },
  {
    title: ["The world’s mother.", "Our daughter."],
    mood: "HOMECOMING",
    note: "Every doorway becomes a welcome.",
    action: "Light the welcome",
    response: "A light for Uma. A home for everyone.",
    symbol: "flame",
  },
  {
    title: ["Where the river", "awakens life."],
    mood: "RENEWAL",
    note: "Nine plants. One living earth.",
    action: "Touch the river",
    response: "A ripple travels. Life begins again.",
    symbol: "water",
  },
  {
    title: ["A thousand hands.", "One prayer."],
    mood: "DEVOTION",
    note: "Some things are felt in silence.",
    action: "Offer a flower",
    response: "Your flowers join the offering.",
    symbol: "flower",
  },
  {
    title: ["Feel the rhythm.", "Hold the night."],
    mood: "CELEBRATION",
    note: "Stay a little longer. Ma is still here.",
    action: "Play the dhak",
    response: "Tap again. Make the rhythm your own.",
    symbol: "drum",
  },
  {
    title: ["Until we meet", "again, Ma."],
    mood: "THE PROMISE",
    note: "আসছে বছর আবার হবে",
    action: "Leave a light",
    response: "Your light carries the promise of return.",
    symbol: "flame",
  },
];
