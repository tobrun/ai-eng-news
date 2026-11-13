import type { TopicSlug } from "./types.ts";

export interface Topic {
  slug: TopicSlug;
  name: string;
  /** OKLCH hue (degrees) of the topic's kicker colour. */
  hue: number;
}

/** The editor's seven topics in menu order. */
export const topics: readonly Topic[] = [
  { slug: "agents", name: "Agents", hue: 295 },
  { slug: "evals", name: "Evals", hue: 145 },
  { slug: "retrieval", name: "Retrieval", hue: 195 },
  { slug: "inference", name: "Inference", hue: 75 },
  { slug: "training", name: "Training", hue: 25 },
  { slug: "security", name: "Security", hue: 345 },
  { slug: "foundations", name: "Foundations", hue: 245 },
];

export function topicOf(slug: string | null | undefined): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function topicPath(slug: TopicSlug): string {
  return `/topics/${slug}`;
}
