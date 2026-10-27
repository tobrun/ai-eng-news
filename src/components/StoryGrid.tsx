import Link from "next/link";
import type { Article, Topic } from "@/lib/types";
import { StoryCell } from "./StoryCell";
import styles from "./StoryGrid.module.css";

interface StoryGridProps {
  articles: Article[];
  topics: Topic[];
  heading: string;
  showTopic: boolean;
}

export function StoryGrid({ articles, topics, heading, showTopic }: StoryGridProps) {
  const topicNames = new Map(topics.map((topic) => [topic.slug, topic.name]));
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
            <StoryCell
              key={article.slug}
              article={article}
              topicName={topicNames.get(article.topic) ?? article.topic}
              showTopic={showTopic}
              priority={article === firstLead}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
