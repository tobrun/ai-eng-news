import assert from "node:assert/strict";
import { test } from "node:test";
import { frontRegions, type FrontRegions } from "./regions.ts";
import type { Article, Prominence } from "./types.ts";

function edition(...prominences: Prominence[]): Article[] {
  return prominences.map((prominence, index) => ({
    slug: `story-${index + 1}`,
    title: `Story ${index + 1}`,
    summary: "A summary.",
    url: `https://example.com/${index + 1}`,
    source: "Example blog",
    author: "Example blog",
    readMinutes: 4,
    postedAt: "2026-11-13",
    editionId: "2026-11-13",
    prominence,
  }));
}

function slugsOf(regions: FrontRegions) {
  return {
    hero: regions.hero?.slug ?? null,
    side: regions.side.map((article) => article.slug),
    news: regions.news.map((article) => article.slug),
    depth: regions.depth.map((article) => article.slug),
  };
}

test("a lead, two features and four briefs: the features flank the hero and the briefs go In Depth", () => {
  const regions = frontRegions(
    edition("lead", "feature", "feature", "brief", "brief", "brief", "brief"),
  );

  assert.deepEqual(slugsOf(regions), {
    hero: "story-1",
    side: ["story-2", "story-3"],
    news: [],
    depth: ["story-4", "story-5", "story-6", "story-7"],
  });
});

test("three leads, four features and six briefs: Latest News holds the four features in order", () => {
  const regions = frontRegions(
    edition(
      "lead", "lead", "lead",
      "feature", "feature", "feature", "feature",
      "brief", "brief", "brief", "brief", "brief", "brief",
    ),
  );

  assert.deepEqual(slugsOf(regions), {
    hero: "story-1",
    side: ["story-2", "story-3"],
    news: ["story-4", "story-5", "story-6", "story-7"],
    depth: ["story-8", "story-9", "story-10", "story-11", "story-12", "story-13"],
  });
});

test("one lead and six briefs: briefs 2 and 3 take the side cards and the other four go In Depth", () => {
  const regions = frontRegions(edition("lead", "brief", "brief", "brief", "brief", "brief", "brief"));

  assert.deepEqual(slugsOf(regions), {
    hero: "story-1",
    side: ["story-2", "story-3"],
    news: [],
    depth: ["story-4", "story-5", "story-6", "story-7"],
  });
});

test("a one-story edition fills only the hero", () => {
  const regions = frontRegions(edition("lead"));

  assert.deepEqual(slugsOf(regions), { hero: "story-1", side: [], news: [], depth: [] });
});

test("a brief in first position is the hero", () => {
  const regions = frontRegions(edition("brief", "lead", "feature", "feature"));

  assert.deepEqual(slugsOf(regions), {
    hero: "story-1",
    side: ["story-2", "story-3"],
    news: ["story-4"],
    depth: [],
  });
});

test("every story of an edition is drawn in exactly one region", () => {
  const stories = edition(
    "feature", "brief", "lead", "brief", "feature", "lead", "brief", "feature", "brief",
  );
  const { hero, side, news, depth } = slugsOf(frontRegions(stories));

  const drawn = [hero, ...side, ...news, ...depth];

  assert.deepEqual(
    [...drawn].sort(),
    [
      "story-1", "story-2", "story-3", "story-4", "story-5",
      "story-6", "story-7", "story-8", "story-9",
    ],
  );
});
