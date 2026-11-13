import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import { site, siteUrl } from "./site.ts";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CIPHER = "aes-256-gcm";
const KEY_BYTES = 32;
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const GCM_OPTIONS = { authTagLength: TAG_BYTES };
const TOKEN_KEY_INFO = "ai-engine newsletter confirm token";

const TOKEN_LIFETIME_MS = 48 * 60 * 60 * 1000;
export const CONFIRM_PATH = "/subscribe/confirm";

const DEFAULT_RESEND_URL = "https://api.resend.com";
const USER_AGENT = "ai-engine-site";
const CONFIRM_SUBJECT = `Confirm your ${site.name} subscription`;
export const CONFIRM_BUTTON = "Confirm subscription";
const CONFIRM_INTRO = `Confirm your subscription to the ${site.name} weekly newsletter by opening this link and pressing "${CONFIRM_BUTTON}":`;
const CONFIRM_OUTRO = "The link works for 48 hours. If you did not ask for this, ignore this email and nothing happens.";

const REQUIRED_SETTINGS = [
  "RESEND_API_KEY",
  "RESEND_SEGMENT_ID",
  "NEWSLETTER_FROM",
  "SITE_SECRET",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
] as const;

/** True only when Resend, the sender, `SITE_SECRET`, `SITE_URL` and the store are all set; otherwise nothing about it is rendered. */
export function newsletterEnabled(): boolean {
  return REQUIRED_SETTINGS.every((name) => Boolean(process.env[name])) && siteUrl() !== null;
}

/** The trimmed address with its domain lower-cased, or null when it is too long or not shaped like `local@domain.tld`. */
export function normaliseEmail(text: string): string | null {
  const email = text.trim();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_SHAPE.test(email)) return null;
  const at = email.indexOf("@");
  return `${email.slice(0, at)}@${email.slice(at + 1).toLowerCase()}`;
}

/** A 303 to a path on this site; a relative `Location` keeps it on whatever host the form was posted to. */
export function seeOther(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

function tokenKey(secret: string): Buffer {
  return Buffer.from(hkdfSync("sha256", secret, "", TOKEN_KEY_INFO, KEY_BYTES));
}

/** The address and its expiry, AES-256-GCM encrypted under a key derived from `secret`; base64url of nonce, ciphertext and tag. */
export function sealToken(email: string, expiresAt: Date, secret: string): string {
  const nonce = randomBytes(NONCE_BYTES);
  const cipher = createCipheriv(CIPHER, tokenKey(secret), nonce, GCM_OPTIONS);
  const body = JSON.stringify({ email, expiresAt: expiresAt.getTime() });
  const sealed = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);
  return Buffer.concat([nonce, sealed, cipher.getAuthTag()]).toString("base64url");
}

/** The address in a token sealed under `secret` that has not expired at `now`; null for any changed, foreign or expired token. */
export function openToken(token: string, now: Date, secret: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= NONCE_BYTES + TAG_BYTES) return null;
    const decipher = createDecipheriv(CIPHER, tokenKey(secret), raw.subarray(0, NONCE_BYTES), GCM_OPTIONS);
    decipher.setAuthTag(raw.subarray(raw.length - TAG_BYTES));
    const body = Buffer.concat([decipher.update(raw.subarray(NONCE_BYTES, raw.length - TAG_BYTES)), decipher.final()]);
    const { email, expiresAt } = JSON.parse(body.toString("utf8")) as { email: unknown; expiresAt: unknown };
    if (typeof email !== "string" || typeof expiresAt !== "number") return null;
    return now.getTime() < expiresAt ? email : null;
  } catch {
    return null;
  }
}

/** A Resend call that did not succeed; its message names the call and status, never an address. */
class ResendError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(call: string, status: number, body: string) {
    super(`resend ${call} ${status}`);
    this.status = status;
    this.body = body;
  }
}

function setting(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/** `call` names the request in errors and log lines, since `path` may hold an address. */
async function resend(method: string, path: string, call: string, body?: unknown): Promise<void> {
  const base = (process.env.RESEND_API_URL || DEFAULT_RESEND_URL).replace(/\/+$/, "");
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${setting("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ResendError(call, 0, "");
  }
  if (!response.ok) throw new ResendError(call, response.status, await response.text().catch(() => ""));
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function confirmationText(link: string, senderLine: string | undefined): string {
  return [CONFIRM_INTRO, "", link, "", CONFIRM_OUTRO, ...(senderLine ? ["", senderLine] : [])].join("\n");
}

function confirmationHtml(link: string, senderLine: string | undefined): string {
  const href = escapeHtml(link);
  return [
    `<p>${escapeHtml(CONFIRM_INTRO)}</p>`,
    `<p><a href="${href}">${href}</a></p>`,
    `<p>${escapeHtml(CONFIRM_OUTRO)}</p>`,
    ...(senderLine ? [`<p>${escapeHtml(senderLine)}</p>`] : []),
  ].join("\n");
}

/** Emails `email` a link to the confirm page holding a token that expires 48 hours after `now`. */
export async function sendConfirmation(email: string, now: Date = new Date()): Promise<void> {
  const token = sealToken(email, new Date(now.getTime() + TOKEN_LIFETIME_MS), setting("SITE_SECRET"));
  const link = `${siteUrl()}${CONFIRM_PATH}?token=${token}`;
  const senderLine = process.env.NEWSLETTER_SENDER_LINE || undefined;
  await resend("POST", "/emails", "emails", {
    from: setting("NEWSLETTER_FROM"),
    to: [email],
    subject: CONFIRM_SUBJECT,
    html: confirmationHtml(link, senderLine),
    text: confirmationText(link, senderLine),
  });
}

function alreadyExists(error: unknown): boolean {
  return error instanceof ResendError && (error.status === 409 || /already exists/i.test(error.body));
}

/** Creates the contact in the segment; an existing contact is marked subscribed again and added to the segment. */
export async function addContact(email: string): Promise<void> {
  const segmentId = setting("RESEND_SEGMENT_ID");
  try {
    await resend("POST", "/contacts", "contacts create", { email, unsubscribed: false, segments: [{ id: segmentId }] });
  } catch (error) {
    if (!alreadyExists(error)) throw error;
    const contactPath = `/contacts/${encodeURIComponent(email)}`;
    await resend("PATCH", contactPath, "contacts update", { unsubscribed: false });
    await resend("POST", `${contactPath}/segments/${encodeURIComponent(segmentId)}`, "contacts segment");
  }
}
