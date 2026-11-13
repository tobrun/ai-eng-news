import { articles } from "@/data/articles";
import { topics, type Topic } from "./topics";
import type { Article, TopicSlug } from "./types";

export { frontRegions } from "./regions";

const byNewest = (a: Article, b: Article) => b.postedAt.localeCompare(a.postedAt);

export function getArticles(): Article[] {
  return [...articles].sort(byNewest);
}

export function getArticlesByTopic(slug: TopicSlug): Article[] {
  return getArticles().filter((article) => article.topic === slug);
}

/** The topics, in menu order, that at least one published story carries. */
export function topicsWithStories(): Topic[] {
  const used = new Set(articles.map((article) => article.topic));
  return topics.filter((topic) => used.has(topic.slug));
}

export function getLatestPostedAt(list: Article[]): string | undefined {
  return list.map((article) => article.postedAt).sort().at(-1);
}

export const PAGE_SIZE = 50;

/** The newest edition: every story sharing the first row's edition. */
export function getFrontPage(): Article[] {
  const [first] = getArticles();
  return first ? getArticles().filter((article) => article.editionId === first.editionId) : [];
}

export function getOlderArticles(): Article[] {
  const [first] = getArticles();
  return first ? getArticles().filter((article) => article.editionId !== first.editionId) : [];
}

export function pageCount(list: Article[]): number {
  return Math.max(1, Math.ceil(list.length / PAGE_SIZE));
}

/** Rows of page `n` (1-based). */
export function pageOf(list: Article[], n: number): Article[] {
  return list.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE);
}

/** True for a canonical later page: digits without leading zeros, from 2 up to `count`. */
export function isPageNumber(text: string, count: number): boolean {
  if (!/^[1-9][0-9]*$/.test(text)) return false;
  const n = Number(text);
  return n >= 2 && n <= count;
}

export function pageTitle(n: number, base?: string): string {
  const label = `Page ${n}`;
  return base ? `${base} - ${label}` : label;
}
