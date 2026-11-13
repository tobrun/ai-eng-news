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

function SideColumn({ side }: { side: Article[] }) {
  if (side.length === 0) return null;

  return (
    <div className={styles.sideColumn}>
      {side.map((article) => (
        <StoryCard key={article.slug} article={article} variant="side" />
      ))}
    </div>
  );
}

function TopRow({ hero, side }: { hero: Article | null; side: Article[] }) {
  if (!hero) return <EmptyNote />;

  return (
    <div className={styles.top}>
      <StoryCard article={hero} variant="hero" priority />
      <SideColumn side={side} />
    </div>
  );
}

function MainColumn({ news, depth }: { news: Article[]; depth: Article[] }) {
  if (news.length === 0 && depth.length === 0) return null;

  return (
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
  );
}

function Rail() {
  return (
    <aside className={styles.rail} aria-label="Newsletter and trending stories">
      <NewsletterBox />
      <Trending />
    </aside>
  );
}

async function railHasContent(): Promise<boolean> {
  return newsletterEnabled() || (await getTrending()).length > 0;
}

/** The newest edition by region: hero, side cards, Latest News, In Depth, and the rail beside them when it has content. */
export async function FrontPage({ edition }: FrontPageProps) {
  const { hero, side, news, depth } = frontRegions(edition);
  const hasMain = news.length > 0 || depth.length > 0;
  const hasRail = await railHasContent();

  return (
    <section aria-labelledby="feed-heading" className={styles.front}>
      <h2 id="feed-heading" className="sr-only">
        {FEED_HEADING}
      </h2>
      <TopRow hero={hero} side={side} />
      {(hasMain || hasRail) && (
        <div className={styles.columns}>
          <MainColumn news={news} depth={depth} />
          {hasRail && <Rail />}
        </div>
      )}
    </section>
  );
}
