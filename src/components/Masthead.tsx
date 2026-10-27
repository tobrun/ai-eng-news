import Link from "next/link";
import { site } from "@/lib/site";
import { formatLongDate } from "@/lib/format";
import styles from "./Masthead.module.css";

interface MastheadProps {
  storyCount: number;
  updatedAt?: string;
}

export function Masthead({ storyCount, updatedAt }: MastheadProps) {
  return (
    <header className={styles.masthead}>
      <h1 className={styles.title}>
        <Link href="/" className={styles.home}>
          {site.name}
        </Link>
      </h1>
      <div className={styles.about}>
        <p className={styles.description}>{site.description}</p>
        <dl className={styles.facts}>
          <div>
            <dt>Summaries</dt>
            <dd>{storyCount}</dd>
          </div>
          {updatedAt && (
            <div>
              <dt>Updated</dt>
              <dd>
                <time dateTime={updatedAt}>{formatLongDate(updatedAt)}</time>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </header>
  );
}
