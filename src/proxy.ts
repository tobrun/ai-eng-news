import { NextResponse, type NextRequest } from "next/server";
import { getArticlesByTopic, getOlderArticles, isPageNumber, pageCount } from "@/lib/articles";
import { topicOf } from "@/lib/topics";

// Unknown topics and pages are rewritten to an unmatched path so they get a hard 404 instead of a streamed 200.
const UNMATCHED_PATH = "/_unknown-page";

function exists([first, second, , page]: string[]): boolean {
  if (first === "page") return isPageNumber(second ?? "", pageCount(getOlderArticles()));
  const topic = topicOf(second);
  if (!topic) return false;
  return page === undefined || isPageNumber(page, pageCount(getArticlesByTopic(topic.slug)));
}

export function proxy(request: NextRequest) {
  if (exists(request.nextUrl.pathname.split("/").filter(Boolean))) return NextResponse.next();
  return NextResponse.rewrite(new URL(UNMATCHED_PATH, request.url));
}

export const config = {
  matcher: ["/page/:n", "/topics/:topic", "/topics/:topic/page/:n"],
};
