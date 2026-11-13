/** The editor's seven topics; a story carries one of these slugs or none. */
export type TopicSlug =
  | "agents"
  | "evals"
  | "retrieval"
  | "inference"
  | "training"
  | "security"
  | "foundations";

/** The editor's size for a story. Position, not prominence, picks the hero and side cards; the rest split by it. */
export type Prominence = "lead" | "feature" | "brief";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  author: string;
  readMinutes: number;
  /** ISO date (YYYY-MM-DD) the summary was posted on this site. */
  postedAt: string;
  /** ID of the edition the story is listed under; the first row's edition is the front page. */
  editionId: string;
  prominence: Prominence;
  /** Absolute URL of the post's share image, linked where its author hosts it. */
  image?: string | null;
  /** Null or absent: no kicker and on no topic page. */
  topic?: TopicSlug | null;
  /** Hue (degrees, OKLCH) for the story's tint; null or absent falls back to its topic's hue. */
  accentHue?: number | null;
}
