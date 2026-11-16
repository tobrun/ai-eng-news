import assert from "node:assert/strict";
import { test } from "node:test";
import { menuEntries, topicOf, topicPath, topicStyle, topics, type Topic } from "./topics.ts";

const SEEDS: Topic[] = [
  { slug: "agents", name: "Agents", hue: 295 },
  { slug: "evals", name: "Evals", hue: 145 },
  { slug: "retrieval", name: "Retrieval", hue: 195 },
  { slug: "inference", name: "Inference", hue: 75 },
  { slug: "training", name: "Training", hue: 25 },
  { slug: "security", name: "Security", hue: 345 },
  { slug: "foundations", name: "Foundations", hue: 245 },
];
const ROBOTICS: Topic = { slug: "robotics", name: "Robotics", hue: 110 };
const EIGHT_TOPICS: Topic[] = [...SEEDS, ROBOTICS];

test("the published topic list holds the seven seeds, in menu order, with their names and kicker hues", () => {
  assert.deepEqual(topics, SEEDS);
});

test("a topic added to the list is found by its slug and tints with its own hue", () => {
  const robotics = topicOf("robotics", EIGHT_TOPICS);
  assert.deepEqual(robotics, ROBOTICS);
  assert.deepEqual(topicStyle(robotics), { "--topic-h": 110 });
});

test("a seed topic tints with its published hue", () => {
  assert.deepEqual(topicStyle(topicOf("security")), { "--topic-h": 345 });
});

test("a slug not in the list finds no topic and sets no tint", () => {
  assert.equal(topicOf("cloud"), undefined);
  assert.equal(topicOf("cloud", EIGHT_TOPICS), undefined);
  assert.equal(topicStyle(topicOf("cloud")), undefined);
});

test("a null or missing slug finds no topic", () => {
  assert.equal(topicOf(null), undefined);
  assert.equal(topicOf(undefined), undefined);
});

test("the menu lists News, then every topic in use in the list's order", () => {
  assert.deepEqual(
    menuEntries(EIGHT_TOPICS).map(({ key, name, href }) => [key, name, href]),
    [
      ["news", "News", "/"],
      ["agents", "Agents", "/topics/agents"],
      ["evals", "Evals", "/topics/evals"],
      ["retrieval", "Retrieval", "/topics/retrieval"],
      ["inference", "Inference", "/topics/inference"],
      ["training", "Training", "/topics/training"],
      ["security", "Security", "/topics/security"],
      ["foundations", "Foundations", "/topics/foundations"],
      ["robotics", "Robotics", "/topics/robotics"],
    ],
  );
});

test("a topic's page lives under /topics/", () => {
  assert.equal(topicPath("evals"), "/topics/evals");
});
