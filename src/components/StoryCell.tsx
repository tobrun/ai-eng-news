import { ViewTransition, type CSSProperties } from "react";
import type { Article } from "@/lib/types";
import { formatReadTime, formatShortDate } from "@/lib/format";
import { StoryImage } from "./StoryImage";
import styles from "./StoryCell.module.css";

interface StoryCellProps {
  article: Article;
  priority?: boolean;
}

export function StoryCell({ article, priority = false }: StoryCellProps) {
  // A brief is one grid module tall and has no room for an image.
  const image = article.prominence === "brief" ? null : article.image;

  const hue = Number.isFinite(article.accentHue) ? article.accentHue : null;
  const style = hue === null ? undefined : ({ "--hue": hue } as CSSProperties);

  return (
    <ViewTransition
      name={`story-${article.slug}`}
      share="reflow"
      enter="cell-in"
      exit="cell-out"
      default="none"
    >
      <li className={`${styles.cell} ${styles[article.prominence]}`}>
        <article className={styles.card} style={style}>
          {image && <StoryImage src={image} className={styles.image} priority={priority} />}
          <p className={styles.top}>
            <span className={styles.source}>{article.source}</span>
          </p>
          <h3 className={styles.title}>
            {/* The link's ::after stretches over the whole card so the cell stays one click target. */}
            <a href={article.url} rel="noopener noreferrer" className={styles.link}>
              {article.title}
            </a>
          </h3>
          <p className={styles.summary}>{article.summary}</p>
          <p className={styles.bottom}>
            <span>{article.author}</span>
            <span className={styles.numbers}>
              <span className={styles.readTime}>{formatReadTime(article.readMinutes)}</span>
              <time dateTime={article.postedAt}>{formatShortDate(article.postedAt)}</time>
            </span>
          </p>
        </article>
      </li>
    </ViewTransition>
  );
}
