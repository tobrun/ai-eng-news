import assert from "node:assert/strict";
import { test } from "node:test";
import { dayKey, mergeCounts } from "./clicks.ts";

const known = (...slugs: string[]) => new Set(slugs);

test("clicks over two days are summed per story, most clicks first", () => {
  const trending = mergeCounts([{ a: 4, b: 3 }, { a: 2, c: 5 }], known("a", "b", "c"));

  assert.deepEqual(trending, [
    { slug: "a", clicks: 6 },
    { slug: "c", clicks: 5 },
    { slug: "b", clicks: 3 },
  ]);
});

test("clicks on only two stories show no Trending list", () => {
  assert.deepEqual(mergeCounts([{ a: 20, b: 15 }], known("a", "b")), []);
});

test("three stories with three clicks in total show no Trending list", () => {
  assert.deepEqual(mergeCounts([{ a: 1, b: 1, c: 1 }], known("a", "b", "c")), []);
});

test("a clicked story no longer in the site data is dropped", () => {
  const trending = mergeCounts([{ a: 5, gone: 9, b: 4, c: 3 }], known("a", "b", "c"));

  assert.deepEqual(trending, [
    { slug: "a", clicks: 5 },
    { slug: "b", clicks: 4 },
    { slug: "c", clicks: 3 },
  ]);
});

test("eight clicked stories: only the best five are trending", () => {
  const day = { a: 8, b: 7, c: 6, d: 5, e: 4, f: 3, g: 2, h: 1 };

  const trending = mergeCounts([day], known(...Object.keys(day)));

  assert.deepEqual(
    trending.map((row) => row.slug),
    ["a", "b", "c", "d", "e"],
  );
});

test("the last second of a UTC day still belongs to that day", () => {
  assert.equal(dayKey(new Date("2026-11-13T23:59:59Z")), "2026-11-13");
});

test("a story with zero or negative clicks is not trending", () => {
  const trending = mergeCounts([{ a: 5, b: 4, c: 3, none: 0, negative: -2 }], known("a", "b", "c", "none", "negative"));

  assert.deepEqual(
    trending.map((row) => row.slug),
    ["a", "b", "c"],
  );
});

test("three stories with exactly ten clicks in total show a Trending list", () => {
  assert.deepEqual(
    mergeCounts([{ a: 5, b: 3, c: 2 }], known("a", "b", "c")).map((row) => row.slug),
    ["a", "b", "c"],
  );
});
