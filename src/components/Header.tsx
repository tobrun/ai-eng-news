import Link from "next/link";
import { site } from "@/lib/site";
import { topicPath } from "@/lib/topics";
import { topicsWithStories } from "@/lib/articles";
import { newsletterEnabled } from "@/lib/newsletter";
import type { TopicSlug } from "@/lib/types";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";
import styles from "./Header.module.css";

/** A menu entry: the home page ("news") or a topic page. */
export type MenuEntry = TopicSlug | "news";

interface HeaderProps {
  current?: MenuEntry;
}

export function Header({ current }: HeaderProps) {
  const entries = [
    { key: "news", name: "News", href: "/" },
    ...topicsWithStories().map((topic) => ({ key: topic.slug, name: topic.name, href: topicPath(topic.slug) })),
  ];

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <h1 className={styles.brand}>
          <Link href="/" className={styles.home}>
            <Logo className={styles.logo} />
            {site.name}
          </Link>
        </h1>
        <nav aria-label="Topics" className={styles.menu}>
          <ul className={styles.entries}>
            {entries.map((entry) => (
              <li key={entry.key}>
                <Link
                  href={entry.href}
                  className={styles.entry}
                  aria-current={entry.key === current ? "page" : undefined}
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <SearchDialog />
          {newsletterEnabled() && (
            <Link href="/#newsletter" className={styles.subscribe}>
              Subscribe
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
