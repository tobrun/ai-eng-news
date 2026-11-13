import assert from "node:assert/strict";
import { test } from "node:test";
import { matches, type SearchRecord, toRecords } from "./search.ts";
import type { Article } from "./types.ts";

function record(slug: string, fields: Partial<SearchRecord> = {}): SearchRecord {
  return {
    slug,
    title: `Story ${slug}`,
    summary: "A summary.",
    source: "Example blog",
    author: "Example author",
    topic: null,
    url: `https://example.com/${slug}`,
    postedAt: "2026-11-13",
    ...fields,
  };
}

const slugsOf = (records: SearchRecord[]) => records.map((found) => found.slug);

test("every word of the query must appear: a title with both words matches, one with only one does not", () => {
  const records = [
    record("both", { title: "Claude runs agents overnight" }),
    record("one", { title: "Claude writes a poem" }),
  ];

  assert.deepEqual(slugsOf(matches(records, "claude agents")), ["both"]);
});

test("the query is case-insensitive", () => {
  const records = [record("lower", { title: "what claude learned" })];

  assert.deepEqual(slugsOf(matches(records, "CLAUDE")), ["lower"]);
});

test("a query under two characters returns nothing", () => {
  const records = [record("a-title", { title: "A study of attention" })];

  assert.deepEqual(matches(records, "a"), []);
});

test("thirty matching stories: the twenty newest are returned, newest first", () => {
  const records = Array.from({ length: 30 }, (_, index) =>
    record(`day-${index + 1}`, { title: "Inference notes", postedAt: `2026-10-${String(index + 1).padStart(2, "0")}` }),
  );

  const found = matches(records, "inference");

  assert.equal(found.length, 20);
  assert.equal(found[0].slug, "day-30");
  assert.equal(found[19].slug, "day-11");
});

test("a query naming only a story's source finds that story", () => {
  const records = [record("hf", { source: "Hugging Face" }), record("other", { source: "Example blog" })];

  assert.deepEqual(slugsOf(matches(records, "hugging")), ["hf"]);
});

test("a topic name finds the stories carrying that topic", () => {
  const records = [
    record("ret-1", { topic: "retrieval" }),
    record("agents", { topic: "agents" }),
    record("ret-2", { topic: "retrieval", postedAt: "2026-11-12" }),
  ];

  assert.deepEqual(slugsOf(matches(records, "retrieval")), ["ret-1", "ret-2"]);
});

test("a query of exactly two characters searches", () => {
  const records = [record("ai", { title: "AI at work" })];

  assert.deepEqual(slugsOf(matches(records, "ai")), ["ai"]);
});

test("spaces around a one-letter query do not count toward its length", () => {
  const records = [record("a-title", { title: "A study of attention" })];

  assert.deepEqual(matches(records, " a "), []);
});

test("a query word does not match across the end of one field and the start of the next", () => {
  const records = [record("split", { title: "Going deep", summary: "Learning to plan." })];

  assert.deepEqual(matches(records, "deeplearning"), []);
});

test("an article becomes a search record holding only the searched and linked fields, with a missing topic as null", () => {
  const article: Article = {
    slug: "s",
    title: "T",
    summary: "S",
    url: "https://example.com/s",
    source: "Src",
    author: "Au",
    readMinutes: 4,
    postedAt: "2026-11-13",
    editionId: "2026-11-13",
    prominence: "brief",
  };

  assert.deepEqual(toRecords([article, { ...article, slug: "t", topic: "agents" }]), [
    { slug: "s", title: "T", summary: "S", source: "Src", author: "Au", topic: null, url: "https://example.com/s", postedAt: "2026-11-13" },
    { slug: "t", title: "T", summary: "S", source: "Src", author: "Au", topic: "agents", url: "https://example.com/s", postedAt: "2026-11-13" },
  ]);
});

test("a story without a topic is found by none of the words outside its own fields", () => {
  const records = [record("plain", { title: "Notes from the field" })];

  assert.deepEqual(matches(records, "here"), []);
});
