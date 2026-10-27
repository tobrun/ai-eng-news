import { NextResponse, type NextRequest } from "next/server";
import {
  getArticlesByTopic,
  getOlderArticles,
  getTopic,
  isPageNumber,
  pageCount,
} from "@/lib/articles";

// Unknown topics and pages are rewritten to an unmatched path so they get a hard 404 instead of a streamed 200.
const UNMATCHED_PATH = "/_unknown-topic";

function exists([first, second, , page]: string[]): boolean {
  if (first === "page") return isPageNumber(second ?? "", pageCount(getOlderArticles()));
  const topic = getTopic(second ?? "");
  if (!topic) return false;
  return page === undefined || isPageNumber(page, pageCount(getArticlesByTopic(topic.slug)));
}

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  if (exists(segments)) return NextResponse.next();
  return NextResponse.rewrite(new URL(UNMATCHED_PATH, request.url));
}

export const config = {
  matcher: ["/topics/:topic", "/page/:n", "/topics/:topic/page/:n"],
};
