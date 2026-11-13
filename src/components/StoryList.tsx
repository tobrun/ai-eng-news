import Link from "next/link";
import type { Article } from "@/lib/types";
import { topicOf } from "@/lib/topics";
import { formatReadTime, formatShortDate } from "@/lib/format";
import styles from "./StoryList.module.css";

interface EmptyNoteProps {
  className?: string;
}

/** What a list with no stories says, with a way back to the home page. */
export function EmptyNote({ className }: EmptyNoteProps) {
  return (
    <p className={className}>
      No summaries here yet. <Link href="/">See all summaries</Link>
    </p>
  );
}

interface StoryListProps {
  articles: Article[];
  heading: string;
}

export function StoryList({ articles, heading }: StoryListProps) {
  return (
    <section aria-labelledby="list-heading" className={styles.section}>
      <h2 id="list-heading" className={styles.heading}>
        {heading}
      </h2>
      {articles.length === 0 ? (
        <EmptyNote className={styles.empty} />
      ) : (
        <ol className={styles.list}>
          {articles.map((article) => {
            const topic = topicOf(article.topic);
            return (
              <li key={article.slug} className={styles.row}>
                <article className={styles.article} data-topic={topic?.slug}>
                  <time dateTime={article.postedAt} className={styles.date}>
                    {formatShortDate(article.postedAt)}
                  </time>
                  <h3 className={styles.title}>
                    {/* The link's ::after stretches over the whole row so it stays one click target. */}
                    <a href={article.url} rel="noopener noreferrer" data-slug={article.slug} className={styles.link}>
                      {article.title}
                    </a>
                  </h3>
                  <p className={styles.meta}>
                    {topic && <span className={styles.kicker}>{topic.name}</span>}
                    <span>{article.source}</span>
                    <span>{formatReadTime(article.readMinutes)}</span>
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
