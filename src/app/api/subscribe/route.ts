import { newsletterEnabled, normaliseEmail, seeOther, sendConfirmation } from "@/lib/newsletter";
import { clientIp, hashedId, overLimit, redisOrNull, sameOrigin } from "@/lib/redis";

const SENT_PATH = "/subscribe/sent";
const INVALID_PATH = "/subscribe/invalid";
const HONEYPOT_FIELD = "website";
const UNKNOWN_IP = "unknown";

const HOUR_SECONDS = 60 * 60;
const DAY_SECONDS = 24 * HOUR_SECONDS;
const PER_IP_PER_HOUR = 3;
const PER_ADDRESS_PER_DAY = 1;
const EMAILS_PER_DAY = 50;
// The daily key outlives its UTC day so a late increment cannot reset it.
const DAILY_KEY_SECONDS = 2 * DAY_SECONDS;

function formText(form: FormData | null, name: string): string {
  const value = form?.get(name);
  return typeof value === "string" ? value : "";
}

/** True when any limit is passed or the store fails; the daily cap is counted last so only real sends use it up. */
async function limited(request: Request, email: string): Promise<boolean> {
  const redis = redisOrNull();
  if (!redis) return true;
  const ip = clientIp(request) ?? UNKNOWN_IP;
  if (await overLimit(redis, "signup-ip", hashedId("ip", ip), PER_IP_PER_HOUR, HOUR_SECONDS)) return true;
  if (await overLimit(redis, "signup-email", hashedId("email", email), PER_ADDRESS_PER_DAY, DAY_SECONDS)) return true;
  const day = new Date().toISOString().slice(0, 10);
  if (await overLimit(redis, "signup-day", day, EMAILS_PER_DAY, DAILY_KEY_SECONDS)) {
    console.warn("signup cap reached");
    return true;
  }
  return false;
}

/** Every outcome but a malformed address answers the same "check your inbox" page, so the form reveals nothing. */
export async function POST(request: Request): Promise<Response> {
  if (!newsletterEnabled()) return new Response(null, { status: 404 });

  const form = await request.formData().catch(() => null);
  if (formText(form, HONEYPOT_FIELD) !== "" || !sameOrigin(request)) return seeOther(SENT_PATH);

  const email = normaliseEmail(formText(form, "email"));
  if (!email) return seeOther(INVALID_PATH);

  if (await limited(request, email)) return seeOther(SENT_PATH);

  try {
    await sendConfirmation(email);
  } catch (error) {
    console.error(`confirmation email failed: ${error instanceof Error ? error.message : "unknown error"}`);
  }
  return seeOther(SENT_PATH);
}
