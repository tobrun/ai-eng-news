import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";

const TIMEOUT_MS = 2000;

function siteSecret(): string | undefined {
  return process.env.SITE_SECRET || undefined;
}

/** A client only when the store and `SITE_SECRET` are all set, so nothing is counted without them. */
export function redisOrNull(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token || !siteSecret()) return null;
  return new Redis({
    url,
    token,
    retry: false,
    signal: () => AbortSignal.timeout(TIMEOUT_MS),
    enableTelemetry: false,
  });
}

/** Separates production, preview and local keys in one store. */
export function keyPrefix(): string {
  return process.env.VERCEL_ENV || "dev";
}

/** HMAC-SHA256 of `value` under `SITE_SECRET`, so no clear IP or address is ever stored. */
export function hashedId(kind: string, value: string): string {
  const secret = siteSecret();
  if (!secret) throw new Error("SITE_SECRET is not set");
  return createHmac("sha256", secret).update(`${kind}:${value}`).digest("hex");
}

/** Counts one use of `name` by `id` in a window of `seconds`; true past `max`, or when the store fails. */
export async function overLimit(
  redis: Redis,
  name: string,
  id: string,
  max: number,
  seconds: number,
): Promise<boolean> {
  const key = `${keyPrefix()}:limit:${name}:${id}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, seconds);
    return count > max;
  } catch {
    return true;
  }
}

/** The visitor's address: the first entry of `x-forwarded-for`, as Vercel sets it. */
export function clientIp(request: Request): string | null {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first ? first : null;
}

export function sameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "same-origin") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
