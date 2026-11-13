import assert from "node:assert/strict";
import { test } from "node:test";
import { matches, type SearchRecord } from "./search.ts";

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
