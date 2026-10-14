import { test, expect } from "@playwright/test";

const names = [
  "Mahalaya",
  "Shashti",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
];
const actions = [
  "Ring the bell",
  "Light the welcome",
  "Touch the river",
  "Offer a flower",
  "Play the dhak",
  "Leave a light",
];
const timeline = (page) =>
  page.getByRole("navigation", { name: "Festival chapters" });
async function select(page, index) {
  await timeline(page).getByRole("button").nth(index).click();
  await expect(timeline(page).getByRole("button").nth(index)).toHaveAttribute(
    "aria-current",
    "step",
  );
  await expect(page.locator(".chapter-kicker")).toContainText(
    names[index].toUpperCase(),
  );
}

test("all six WebGL chapters, gestures, reading, sound and replay work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await expect(page.locator(".webgl-scene")).toHaveClass(/is-ready/, {
    timeout: 30000,
  });
  for (let i = 0; i < names.length; i++) {
    if (i) await select(page, i);
    await page.getByRole("button", { name: actions[i], exact: false }).click();
    await expect(page.getByRole("status")).not.toContainText(
      "A small gesture.",
    );
    await page.getByRole("button", { name: "THE STORY & RITUALS" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".ritual-list li")).toHaveCount(3);
    await expect(page.locator(".story-sources a").first()).toHaveAttribute(
      "href",
      /^https:/,
    );
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "THE STORY & RITUALS" }),
    ).toBeFocused();
  }
  await expect(page.getByRole("button", { name: "Mute sound" })).toBeVisible();
  await page.getByRole("button", { name: "Mute sound" }).click();
  await expect(
    page.getByRole("button", { name: "Enable sound" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Replay journey" }).click();
  await expect(timeline(page).getByRole("button").first()).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(errors).toEqual([]);
});

test("atlas traps focus, chapter entry, film interruption, scrubbing and motion controls", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /the chapters/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement.closest("dialog")),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Go to Ashtami" }).click();
  await expect(timeline(page).getByRole("button").nth(3)).toHaveAttribute(
    "aria-current",
    "step",
  );
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await expect(page.locator("main")).toHaveClass(/reduced-motion/);
  await expect(timeline(page).getByRole("button").nth(3)).toHaveAttribute(
    "aria-current",
    "step",
  );
  await page.getByRole("button", { name: "Resume ambient motion" }).click();
  await page.getByRole("button", { name: "Hide story text" }).click();
  await expect(page.locator(".chapter-content")).toBeHidden();
  await page.getByRole("button", { name: "Show story text" }).click();
  const y = await page.evaluate(() => scrollY);
  await page.getByRole("button", { name: "Play journey as a film" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 10);
  await page.mouse.wheel(0, 100);
  await expect(
    page.getByRole("button", { name: "Play journey as a film" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("slider", { name: "Journey progress" }).fill("1000");
  await expect(timeline(page).getByRole("button").nth(5)).toHaveAttribute(
    "aria-current",
    "step",
  );
});

test("WebGL failure keeps chapter-specific artwork and complete navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl")
        ? null
        : getContext.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await expect(page.locator(".webgl-scene")).toHaveCount(0);
  for (let i = 0; i < names.length; i++) {
    await select(page, i);
    await expect(page.locator(".flat-scene")).toHaveCSS(
      "background-image",
      /\.webp/,
    );
  }
  await page.getByRole("button", { name: "Leave a light" }).click();
  await expect(page.locator(".fallback-lights .diya")).toHaveCount(1);
});

test("context loss changes to the light experience without losing the current chapter", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin the journey" }).click();
  await expect(page.locator(".webgl-scene")).toHaveClass(/is-ready/, {
    timeout: 30000,
  });
  await select(page, 2);
  await page
    .locator("canvas")
    .evaluate((canvas) => canvas.dispatchEvent(new Event("webglcontextlost")));
  await expect(page.locator(".webgl-scene")).toHaveCount(0);
  await expect(timeline(page).getByRole("button").nth(2)).toHaveAttribute(
    "aria-current",
    "step",
  );
  await select(page, 3);
});

for (const [width, height] of [
  [390, 844],
  [375, 667],
]) {
  test(`portrait ${width}×${height} keeps controls and text separate`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("main")).toHaveClass(/reduced-motion/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.getByRole("button", { name: "Begin the journey" }).click();
    for (let i = 0; i < names.length; i++) {
      await select(page, i);
      const text = await page.locator(".chapter-content").boundingBox();
      const ritual = await page.locator(".ritual-control").boundingBox();
      expect(text.y + text.height).toBeLessThanOrEqual(ritual.y + 2);
      await page
        .getByRole("button", { name: actions[i], exact: false })
        .click();
    }
    await page.getByRole("button", { name: /the chapters/i }).click();
    await expect(
      page.getByRole("button", { name: "Go to Dashami" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}

test("the complete narrative remains readable with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator(".no-script")).toBeVisible();
  await expect(page.locator(".no-script section")).toHaveCount(6);
  await context.close();
});
