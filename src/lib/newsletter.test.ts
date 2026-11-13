import assert from "node:assert/strict";
import { test } from "node:test";
import { errorMessage, normaliseEmail, openToken, sealToken, seeOther } from "./newsletter.ts";

const SECRET = "test-secret-one";
const OTHER_SECRET = "test-secret-two";
const ADDRESS = "a@b.co";
const HOUR_MS = 60 * 60 * 1000;
const SEALED_AT = new Date("2026-11-13T10:00:00Z");
const EXPIRES_AT = new Date("2026-11-15T10:00:00Z");

function sealed(): string {
  return sealToken(ADDRESS, EXPIRES_AT, SECRET);
}

function hoursAfterSealing(hours: number): Date {
  return new Date(SEALED_AT.getTime() + hours * HOUR_MS);
}

test("an address is trimmed and only its domain lower-cased", () => {
  assert.equal(normaliseEmail(" User@Example.COM "), "User@example.com");
});

test("an address without an at sign, without a dot in the domain, or over 254 characters is refused", () => {
  const tooLong = `${"x".repeat(255 - "@example.com".length)}@example.com`;
  assert.equal(tooLong.length, 255);
  assert.equal(normaliseEmail("no-at-sign"), null);
  assert.equal(normaliseEmail("a@b"), null);
  assert.equal(normaliseEmail(tooLong), null);
});

test("a token opened an hour after sealing gives back its address", () => {
  assert.equal(openToken(sealed(), hoursAfterSealing(1), SECRET), ADDRESS);
});

test("a token opened 49 hours after sealing has expired", () => {
  assert.equal(openToken(sealed(), hoursAfterSealing(49), SECRET), null);
});

test("a token with one changed character is refused", () => {
  const token = sealed();
  const middle = Math.floor(token.length / 2);
  const changed = `${token.slice(0, middle)}${token[middle] === "A" ? "B" : "A"}${token.slice(middle + 1)}`;
  assert.equal(openToken(changed, hoursAfterSealing(1), SECRET), null);
});

test("a token sealed under another secret is refused", () => {
  const foreign = sealToken(ADDRESS, EXPIRES_AT, OTHER_SECRET);
  assert.equal(openToken(foreign, hoursAfterSealing(1), SECRET), null);
});

test("the token text does not reveal the address in clear, base64 or base64url form", () => {
  const token = sealed();
  // "YUBiLmNv" is a@b.co in base64, and in base64url too since it has no "+" or "/".
  for (const form of ["a@b.co", "YUBiLmNv", Buffer.from(`"email":"${ADDRESS}"`).toString("base64url")]) {
    assert.equal(token.includes(form), false, form);
  }
});

test("two tokens for the same address differ", () => {
  assert.notEqual(sealed(), sealed());
});

test("a token whose tag is cut to four bytes is refused", () => {
  const raw = Buffer.from(sealed(), "base64url");
  const truncated = raw.subarray(0, raw.length - 12).toString("base64url");
  assert.equal(openToken(truncated, hoursAfterSealing(1), SECRET), null);
});

test("an address of exactly 254 characters is kept", () => {
  const longest = `${"x".repeat(254 - "@example.com".length)}@example.com`;
  assert.equal(normaliseEmail(longest), longest);
});

test("text before or after an address shape is refused", () => {
  assert.equal(normaliseEmail("two words@b.co"), null);
  assert.equal(normaliseEmail("a@b.co trailing"), null);
});

test("a token sealed by an earlier deploy still opens, so links in flight survive a release", () => {
  const earlier = "XE-SkCcCfoL_o12ekRuISwakUKhhnsxrf4yLiHlvqbZOxGWG3-Jz7RKrfULolX_LBAN8fsaGqd7nG5xI5VWxG_WqUmS1aQqN";
  assert.equal(openToken(earlier, hoursAfterSealing(1), SECRET), ADDRESS);
});

test("a token opened at its exact expiry has expired", () => {
  assert.equal(openToken(sealed(), EXPIRES_AT, SECRET), null);
});

test("a token whose address is not text, or whose expiry is not a number, is refused", () => {
  const farFuture = { getTime: () => "99999999999999" } as unknown as Date;
  const numberAddress = sealToken(42 as unknown as string, EXPIRES_AT, SECRET);
  const textExpiry = sealToken(ADDRESS, farFuture, SECRET);
  assert.equal(openToken(numberAddress, hoursAfterSealing(1), SECRET), null);
  assert.equal(openToken(textExpiry, hoursAfterSealing(1), SECRET), null);
});

test("see-other answers 303 with a relative Location", () => {
  const response = seeOther("/subscribe/check");
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("Location"), "/subscribe/check");
});

test("an error's message is logged, and a thrown non-error is an unknown error", () => {
  assert.equal(errorMessage(new Error("boom")), "boom");
  assert.equal(errorMessage("boom"), "unknown error");
});
