import Link from "next/link";
import type { Article } from "@/lib/types";
import { StoryCell } from "./StoryCell";
import styles from "./StoryGrid.module.css";

interface StoryGridProps {
  articles: Article[];
  heading: string;
}

export function StoryGrid({ articles, heading }: StoryGridProps) {
  const firstLead = articles.find((article) => article.prominence === "lead");

  return (
    <section aria-labelledby="feed-heading" className={styles.section}>
      <h2 id="feed-heading" className="sr-only">
        {heading}
      </h2>
      {articles.length === 0 ? (
        <p className={styles.empty}>
          No summaries here yet. <Link href="/">See all summaries</Link>
        </p>
      ) : (
        <ul className={styles.grid}>
          {articles.map((article) => (
            <StoryCell key={article.slug} article={article} priority={article === firstLead} />
          ))}
        </ul>
      )}
    </section>
  );
}
