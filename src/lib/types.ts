export type TopicSlug =
  | "agents"
  | "evals"
  | "retrieval"
  | "inference"
  | "training"
  | "security"
  | "foundations";

export interface Topic {
  slug: TopicSlug;
  name: string;
}

/** How many grid modules a story occupies: lead 6×2, feature 3×2, brief 3×1. */
export type Prominence = "lead" | "feature" | "brief";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  author: string;
  topic: TopicSlug;
  readMinutes: number;
  /** ISO date (YYYY-MM-DD) the summary was posted on this site. */
  postedAt: string;
  /** ID of the edition the story is listed under; the first row's edition is the front page. */
  editionId: string;
  prominence: Prominence;
  /** Absolute URL of the post's share image, linked where its author hosts it. */
  image?: string | null;
}
