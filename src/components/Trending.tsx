import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Article } from "@/lib/types";
import { getArticles } from "@/lib/articles";
import { topSlugs } from "@/lib/clicks";
import { redisOrNull } from "@/lib/redis";
import styles from "./Trending.module.css";

const HEADING = "Trending";

/**
 * The most clicked stories of the last 7 days. Empty means Trending is not shown.
 * The error is caught inside the cached scope: a cached function that throws fails the build.
 */
export async function getTrending(): Promise<Article[]> {
  "use cache";
  const redis = redisOrNull();
  if (!redis) {
    cacheLife("minutes");
    return [];
  }
  try {
    const bySlug = new Map(getArticles().map((article) => [article.slug, article]));
    const top = await topSlugs(redis, new Date(), new Set(bySlug.keys()));
    cacheLife("hours");
    return top.flatMap(({ slug }) => bySlug.get(slug) ?? []);
  } catch {
    console.error("trending unavailable: store error");
    cacheLife("minutes");
    return [];
  }
}

async function TrendingList() {
  const articles = await getTrending();
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="trending-heading" className={styles.trending}>
      <h2 id="trending-heading" className={styles.heading}>
        {HEADING}
      </h2>
      <ol className={styles.list}>
        {articles.map((article, index) => (
          <li key={article.slug} className={styles.row}>
            <span className={styles.rank} aria-hidden="true">
              {index + 1}
            </span>
            {/* No data-slug: a click here must not feed the list it comes from. */}
            <a href={article.url} rel="noopener noreferrer" className={styles.link}>
              {article.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The rail's Trending list; renders nothing until enough readers have clicked. */
export function Trending() {
  return (
    <Suspense>
      <TrendingList />
    </Suspense>
  );
}
