import assert from "node:assert/strict";
import { test } from "node:test";
import { topicOf, topicPath, topics } from "./topics.ts";

test("the seven topics, in menu order, carry the editor's slugs and their display names", () => {
  assert.deepEqual(
    topics.map(({ slug, name }) => [slug, name]),
    [
      ["agents", "Agents"],
      ["evals", "Evals"],
      ["retrieval", "Retrieval"],
      ["inference", "Inference"],
      ["training", "Training"],
      ["security", "Security"],
      ["foundations", "Foundations"],
    ],
  );
});

test("a slug finds its topic, and an unknown, null or missing slug finds none", () => {
  assert.equal(topicOf("security")?.name, "Security");
  assert.equal(topicOf("unknown"), undefined);
  assert.equal(topicOf(null), undefined);
  assert.equal(topicOf(undefined), undefined);
});

test("a topic's page lives under /topics/", () => {
  assert.equal(topicPath("evals"), "/topics/evals");
});
