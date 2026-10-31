import type { CSSProperties } from "react";
import type { Article } from "@/lib/types";
import { formatReadTime, formatShortDate } from "@/lib/format";
import { StoryGrid } from "./StoryGrid";
import styles from "./StoryList.module.css";

interface StoryListProps {
  articles: Article[];
  heading: string;
}

export function StoryList({ articles, heading }: StoryListProps) {
  if (articles.length === 0) {
    return <StoryGrid articles={articles} heading={heading} />;
  }


  return (
    <section aria-labelledby="list-heading" className={styles.section}>
      <h2 id="list-heading" className={styles.heading}>
        {heading}
      </h2>
      <ol className={styles.list}>
        {articles.map((article) => (
          <li key={article.slug} className={styles.row}>
            <article
              className={styles.article}
              style={
                Number.isFinite(article.accentHue)
                  ? ({ "--hue": article.accentHue } as CSSProperties)
                  : undefined
              }
            >
              <time dateTime={article.postedAt} className={styles.date}>
                {formatShortDate(article.postedAt)}
              </time>
              <h3 className={styles.title}>
                {/* The link's ::after stretches over the whole row so it stays one click target. */}
                <a href={article.url} rel="noopener noreferrer" className={styles.link}>
                  {article.title}
                </a>
              </h3>
              <p className={styles.meta}>
                <span>{article.source}</span>
                <span>{formatReadTime(article.readMinutes)}</span>
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
