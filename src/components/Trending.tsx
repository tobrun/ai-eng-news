import type { Article } from "@/lib/types";

/** The most clicked stories of the last 7 days; filled by change set 5. Empty means Trending is not shown. */
export async function getTrending(): Promise<Article[]> {
  return [];
}

/** The rail's Trending list; filled by change set 5. */
export function Trending() {
  return null;
}
