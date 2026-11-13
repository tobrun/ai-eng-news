import type { Redis } from "@upstash/redis";
import { hashedId, keyPrefix } from "./redis.ts";

const DAY_SECONDS = 86_400;
const KEEP_SECONDS = 8 * DAY_SECONDS;
const WINDOW_DAYS = 7;
const TOP_COUNT = 5;
const MIN_STORIES = 3;
const MIN_TOTAL = 10;

/** Clicks per slug on one UTC day. */
type DayCounts = Record<string, number>;

interface SlugCount {
  slug: string;
  clicks: number;
}

/** The UTC day of `date` as `YYYY-MM-DD`, the name of that day's click set. */
export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function clicksKey(day: string): string {
  return `${keyPrefix()}:clicks:${day}`;
}

/**
 * Sums the daily counts of known slugs and returns the best five, most clicks first.
 * Empty when fewer than three stories have clicks or those clicks total under ten.
 */
export function mergeCounts(days: DayCounts[], known: ReadonlySet<string>): SlugCount[] {
  const totals = new Map<string, number>();
  for (const day of days) {
    for (const [slug, clicks] of Object.entries(day)) {
      if (known.has(slug) && clicks > 0) totals.set(slug, (totals.get(slug) ?? 0) + clicks);
    }
  }
  const sum = [...totals.values()].reduce((total, clicks) => total + clicks, 0);
  if (totals.size < MIN_STORIES || sum < MIN_TOTAL) return [];
  return [...totals]
    .map(([slug, clicks]) => ({ slug, clicks }))
    .sort((a, b) => b.clicks - a.clicks || a.slug.localeCompare(b.slug))
    .slice(0, TOP_COUNT);
}

/** Counts one click on `slug` unless this visitor already clicked it today. */
export async function recordClick(redis: Redis, slug: string, visitorId: string, now: Date): Promise<void> {
  const day = dayKey(now);
  const seenKey = `${keyPrefix()}:seen:${day}:${hashedId("seen", `${visitorId}:${slug}`)}`;
  const first = await redis.set(seenKey, 1, { nx: true, ex: DAY_SECONDS });
  if (first === null) return;
  const key = clicksKey(day);
  await redis.pipeline().zincrby(key, 1, slug).expire(key, KEEP_SECONDS).exec();
}

/** A `ZRANGE ... WITHSCORES` reply, `[member, score, member, score, ...]`, as counts. */
function toDayCounts(reply: unknown): DayCounts {
  const counts: DayCounts = {};
  if (!Array.isArray(reply)) return counts;
  for (let i = 0; i + 1 < reply.length; i += 2) {
    counts[String(reply[i])] = Number(reply[i + 1]);
  }
  return counts;
}

/** The Trending slugs over the last seven UTC days, today included. */
export async function topSlugs(redis: Redis, now: Date, known: ReadonlySet<string>): Promise<SlugCount[]> {
  const pipeline = redis.pipeline();
  for (let back = 0; back < WINDOW_DAYS; back++) {
    const day = dayKey(new Date(now.getTime() - back * DAY_SECONDS * 1000));
    pipeline.zrange(clicksKey(day), 0, -1, { withScores: true });
  }
  const replies = await pipeline.exec();
  return mergeCounts(replies.map(toDayCounts), known);
}
