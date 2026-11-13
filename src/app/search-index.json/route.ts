import { getArticles } from "@/lib/articles";
import { toRecords } from "@/lib/search";

/** The search dialog's index; prerendered at build time from the published stories. */
export function GET() {
  return Response.json(toRecords(getArticles()));
}
