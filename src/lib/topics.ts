import type { CSSProperties } from "react";
import { topics as publishedTopics } from "../data/articles.ts";
import type { TopicSlug } from "./types.ts";

export interface Topic {
  slug: TopicSlug;
  name: string;
  /** OKLCH hue (degrees) of the topic's kicker colour. */
  hue: number;
}

/** A header menu link: the home page ("news") or a topic page. */
export interface MenuLink {
  key: TopicSlug | "news";
  name: string;
  href: string;
}

/** The published topics in menu order: the seeds, then each new topic in use. */
export const topics: readonly Topic[] = publishedTopics;

export function topicOf(slug: string | null | undefined, list: readonly Topic[] = topics): Topic | undefined {
  return list.find((topic) => topic.slug === slug);
}

export function topicPath(slug: TopicSlug): string {
  return `/topics/${slug}`;
}

/** Inline style setting the topic's hue as `--topic-h`, which the kicker and placeholder tint read. */
export function topicStyle(topic: Topic | undefined): CSSProperties | undefined {
  return topic ? ({ "--topic-h": topic.hue } as CSSProperties) : undefined;
}

/** The header menu: News, then each topic in use in the given order. */
export function menuEntries(topicsInUse: readonly Topic[]): MenuLink[] {
  return [
    { key: "news", name: "News", href: "/" },
    ...topicsInUse.map((topic) => ({ key: topic.slug, name: topic.name, href: topicPath(topic.slug) })),
  ];
}
