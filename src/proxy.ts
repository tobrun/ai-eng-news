import { NextResponse, type NextRequest } from "next/server";
import { getOlderArticles, isPageNumber, pageCount } from "@/lib/articles";

// Unknown pages are rewritten to an unmatched path so they get a hard 404 instead of a streamed 200.
const UNMATCHED_PATH = "/_unknown-page";

export function proxy(request: NextRequest) {
  const [, n] = request.nextUrl.pathname.split("/").filter(Boolean);
  if (isPageNumber(n ?? "", pageCount(getOlderArticles()))) return NextResponse.next();
  return NextResponse.rewrite(new URL(UNMATCHED_PATH, request.url));
}

export const config = {
  matcher: ["/page/:n"],
};
