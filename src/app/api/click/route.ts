import { after } from "next/server";
import type { Redis } from "@upstash/redis";
import { getArticles } from "@/lib/articles";
import { recordClick } from "@/lib/clicks";
import { clientIp, hashedId, overLimit, redisOrNull, sameOrigin } from "@/lib/redis";

const MAX_BODY_BYTES = 200;
const LIMIT_NAME = "click";
const LIMIT_PER_WINDOW = 30;
const LIMIT_WINDOW_SECONDS = 60;

const knownSlugs = new Set(getArticles().map((article) => article.slug));

async function knownSlug(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return null;
  const body = await request.text();
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) return null;
  return knownSlugs.has(body) ? body : null;
}

async function countClick(redis: Redis, slug: string, ip: string): Promise<void> {
  try {
    const visitor = hashedId("ip", ip);
    if (await overLimit(redis, LIMIT_NAME, visitor, LIMIT_PER_WINDOW, LIMIT_WINDOW_SECONDS)) return;
    await recordClick(redis, slug, visitor, new Date());
  } catch {
    // A store outage loses this click; the reader has their answer already.
  }
}

/** Every answer is 204 with no body, counted or not, so a script learns nothing about slugs or limits. */
export async function POST(request: Request): Promise<Response> {
  const redis = redisOrNull();
  if (redis && sameOrigin(request)) {
    const slug = await knownSlug(request);
    const ip = clientIp(request);
    if (slug && ip) after(() => countClick(redis, slug, ip));
  }
  return new Response(null, { status: 204 });
}
