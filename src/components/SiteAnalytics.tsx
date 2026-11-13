"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/** Search words and tokens travel in the query string, so it never leaves the browser. */
function withoutQuery(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  url.search = "";
  return { ...event, url: url.toString() };
}

/** Vercel Web Analytics, page views only; a client component because `beforeSend` is a function. */
export function SiteAnalytics() {
  return <Analytics beforeSend={withoutQuery} />;
}
