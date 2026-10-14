import { test } from "node:test";
import assert from "node:assert/strict";
import { journeyFrame } from "../src/components/journey.js";

test("the full scroll range resolves to six chapters without wrapping at the end", () => {
  for (let i = 0; i < 6; i++) {
    assert.equal(journeyFrame((i + 0.01) / 6).index, i);
    assert.equal(journeyFrame((i + 0.69) / 6).blend, 0);
    assert.equal(journeyFrame((i + 0.99) / 6).next, Math.min(i + 1, 5));
  }
  assert.equal(journeyFrame(1).index, 5);
  assert.equal(journeyFrame(2).next, 5);
  assert.equal(journeyFrame(-1).index, 0);
});

test("artwork transitions occur only in the final 30 percent of each chapter", () => {
  const frames = Array.from({ length: 101 }, (_, i) => journeyFrame(i / 600));
  for (let i = 0; i <= 70; i++) assert.equal(frames[i].blend, 0);
  assert.ok(Math.abs(frames[85].blend - 0.5) < 0.00001);
  for (let i = 71; i < 100; i++)
    assert.ok(frames[i].blend >= frames[i - 1].blend);
  assert.equal(frames[100].index, 1);
});
