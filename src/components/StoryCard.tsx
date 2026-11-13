import type { CSSProperties } from "react";
import type { Article } from "@/lib/types";
import { topicOf } from "@/lib/topics";
import { formatReadTime, formatShortDate } from "@/lib/format";
import { StoryImage } from "./StoryImage";
import styles from "./StoryCard.module.css";

/** Where a card sits on the front page: the hero, a side card, a Latest News card or an In Depth card. */
export type CardVariant = "hero" | "side" | "news" | "depth";

const WITH_SUMMARY: ReadonlySet<CardVariant> = new Set(["hero", "depth"]);

interface StoryCardProps {
  article: Article;
  variant: CardVariant;
  priority?: boolean;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.clock}>
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75V8l2.25 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.arrow}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StoryCard({ article, variant, priority = false }: StoryCardProps) {
  const topic = topicOf(article.topic);
  const tint = article.accentHue == null ? undefined : ({ "--hue": article.accentHue } as CSSProperties);

  return (
    <article className={`${styles.card} ${styles[variant]}`} data-topic={topic?.slug} style={tint}>
      <StoryImage
        src={article.image}
        className={styles.media}
        placeholderClassName={styles.placeholder}
        imageClassName={styles.image}
        priority={priority}
      />
      <div className={styles.body}>
        {topic && <p className={styles.kicker}>{topic.name}</p>}
        <h3 className={styles.title}>
          {/* The link's ::after stretches over the whole card so the card stays one click target. */}
          <a href={article.url} rel="noopener noreferrer" data-slug={article.slug} className={styles.link}>
            {article.title}
            {variant === "hero" && (
              <>
                {" "}
                <span className={styles.readMore}>
                  Read more
                  <ArrowIcon />
                </span>
              </>
            )}
          </a>
        </h3>
        {WITH_SUMMARY.has(variant) && <p className={styles.summary}>{article.summary}</p>}
        <p className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          <span className={styles.numbers}>
            <span className={styles.readTime}>
              <ClockIcon />
              {formatReadTime(article.readMinutes)}
            </span>
            <time dateTime={article.postedAt}>{formatShortDate(article.postedAt)}</time>
          </span>
        </p>
      </div>
    </article>
  );
}
