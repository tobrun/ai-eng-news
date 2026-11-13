import type { Article } from "./types.ts";

export interface FrontRegions {
  hero: Article | null;
  side: Article[];
  news: Article[];
  depth: Article[];
}

const SIDE_COUNT = 2;

/**
 * Splits an edition, in its published order, into the front page's regions.
 * Position wins: stories 1 to 3 fill the hero and side cards whatever their prominence,
 * and the rest go to Latest News (leads and features) or In Depth (briefs).
 */
export function frontRegions(edition: readonly Article[]): FrontRegions {
  const [hero = null, ...others] = edition;
  const side = others.slice(0, SIDE_COUNT);
  const rest = others.slice(SIDE_COUNT);
  return {
    hero,
    side,
    news: rest.filter((article) => article.prominence !== "brief"),
    depth: rest.filter((article) => article.prominence === "brief"),
  };
}
