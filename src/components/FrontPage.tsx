import type { Article } from "@/lib/types";
import { frontRegions } from "@/lib/articles";
import { newsletterEnabled } from "@/lib/newsletter";
import { StoryCard, type CardVariant } from "./StoryCard";
import { EmptyNote } from "./StoryList";
import { NewsletterBox } from "./NewsletterBox";
import { Trending, getTrending } from "./Trending";
import styles from "./FrontPage.module.css";

const FEED_HEADING = "Latest summaries";

interface FrontPageProps {
  /** The newest edition in its published order. */
  edition: Article[];
}

interface CardSectionProps {
  id: string;
  heading: string;
  articles: Article[];
  variant: CardVariant;
  gridClassName: string;
}

function CardSection({ id, heading, articles, variant, gridClassName }: CardSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <div className={styles.sectionHead}>
        <h2 id={id} className={styles.sectionTitle}>
          {heading}
        </h2>
      </div>
      <ul className={gridClassName}>
        {articles.map((article) => (
          <li key={article.slug} className={styles.slot}>
            <StoryCard article={article} variant={variant} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The newest edition by region: hero, side cards, Latest News, In Depth, and the rail beside them when it has content. */
export async function FrontPage({ edition }: FrontPageProps) {
  const { hero, side, news, depth } = frontRegions(edition);
  const hasMain = news.length > 0 || depth.length > 0;
  const hasRail = newsletterEnabled() || (await getTrending()).length > 0;

  return (
    <section aria-labelledby="feed-heading" className={styles.front}>
      <h2 id="feed-heading" className="sr-only">
        {FEED_HEADING}
      </h2>
      {hero ? (
        <div className={styles.top}>
          <StoryCard article={hero} variant="hero" priority />
          {side.length > 0 && (
            <div className={styles.sideColumn}>
              {side.map((article) => (
                <StoryCard key={article.slug} article={article} variant="side" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyNote />
      )}
      {(hasMain || hasRail) && (
        <div className={styles.columns}>
          {hasMain && (
            <div className={styles.main}>
              <CardSection
                id="news-heading"
                heading="Latest News"
                articles={news}
                variant="news"
                gridClassName={styles.newsGrid}
              />
              <CardSection
                id="depth-heading"
                heading="In Depth"
                articles={depth}
                variant="depth"
                gridClassName={styles.depthGrid}
              />
            </div>
          )}
          {hasRail && (
            <aside className={styles.rail} aria-label="Newsletter and trending stories">
              <NewsletterBox />
              <Trending />
            </aside>
          )}
        </div>
      )}
    </section>
  );
}
