import { topicOf } from "./topics.ts";
import type { Article, TopicSlug } from "./types.ts";

/** One row of `/search-index.json`. */
export interface SearchRecord {
  slug: string;
  title: string;
  summary: string;
  source: string;
  author: string;
  topic: TopicSlug | null;
  url: string;
  /** ISO date (YYYY-MM-DD) the summary was posted on this site. */
  postedAt: string;
}

const MAX_RESULTS = 20;
export const MIN_QUERY_LENGTH = 2;

export function toRecords(articles: readonly Article[]): SearchRecord[] {
  return articles.map(({ slug, title, summary, source, author, topic, url, postedAt }) => ({
    slug,
    title,
    summary,
    source,
    author,
    topic: topic ?? null,
    url,
    postedAt,
  }));
}

function searchableText(record: SearchRecord): string {
  const topicName = topicOf(record.topic)?.name ?? "";
  return [record.title, record.summary, record.source, record.author, topicName].join("\n").toLowerCase();
}

/** Records holding every word of the query (case-insensitive), newest first, at most MAX_RESULTS. */
export function matches(records: readonly SearchRecord[], query: string): SearchRecord[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];
  const words = trimmed.split(/\s+/);
  return records
    .filter((record) => {
      const text = searchableText(record);
      return words.every((word) => text.includes(word));
    })
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, MAX_RESULTS);
}
