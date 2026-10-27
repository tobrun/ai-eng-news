import Link from "next/link";
import type { Topic } from "@/lib/types";
import styles from "./TopicNav.module.css";

interface TopicNavProps {
  topics: Topic[];
  activeSlug?: string;
}

export function TopicNav({ topics, activeSlug }: TopicNavProps) {
  return (
    <nav aria-label="Topics" className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link href="/" className={styles.link} aria-current={activeSlug ? undefined : "page"}>
            All
          </Link>
        </li>
        {topics.map((topic) => (
          <li key={topic.slug} data-topic={topic.slug}>
            <Link
              href={`/topics/${topic.slug}`}
              className={`${styles.link} ${styles.topic}`}
              aria-current={topic.slug === activeSlug ? "page" : undefined}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
