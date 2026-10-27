import type { ReactNode } from "react";
import type { Article, Topic } from "@/lib/types";
import { pageTitle } from "@/lib/articles";
import { Masthead } from "./Masthead";
import { TopicNav } from "./TopicNav";
import { StoryGrid } from "./StoryGrid";
import { StoryList } from "./StoryList";
import { Pagination } from "./Pagination";
import { SiteFooter } from "./SiteFooter";

const MAIN_ID = "summaries";
const FRONT_HEADING = "Latest summaries";
const EARLIER_HEADING = "Earlier";
const END_OF_FEED = "That's the end of the feed. Every summary links to its original post.";

interface PageShellProps {
  topics: Topic[];
  storyCount: number;
  updatedAt?: string;
  activeTopic?: Topic;
  footer?: string;
  children: ReactNode;
}

export function PageShell({
  topics,
  storyCount,
  updatedAt,
  activeTopic,
  footer,
  children,
}: PageShellProps) {
  return (
    <div className="page">
      <a href={`#${MAIN_ID}`} className="skip-link">
        Skip to summaries
      </a>
      <Masthead storyCount={storyCount} updatedAt={updatedAt} topicName={activeTopic?.name} />
      <TopicNav topics={topics} activeSlug={activeTopic?.slug} />
      <main id={MAIN_ID} className="full">
        {children}
      </main>
      <SiteFooter text={footer} />
    </div>
  );
}

interface FeedPageProps {
  topics: Topic[];
  /** The newest edition; given only on the first page of the home list. */
  frontPage?: Article[];
  rows: Article[];
  page: number;
  pageCount: number;
  basePath: string;
  totalCount: number;
  updatedAt?: string;
  activeTopic?: Topic;
}

export function FeedPage({
  topics,
  frontPage,
  rows,
  page,
  pageCount,
  basePath,
  totalCount,
  updatedAt,
  activeTopic,
}: FeedPageProps) {
  const listHeading = activeTopic ? `${activeTopic.name} summaries` : EARLIER_HEADING;
  const showList = rows.length > 0 || !frontPage;

  return (
    <PageShell
      topics={topics}
      storyCount={totalCount}
      updatedAt={updatedAt}
      activeTopic={activeTopic}
      footer={totalCount > 0 && page === pageCount ? END_OF_FEED : undefined}
    >
      {frontPage && (
        <StoryGrid articles={frontPage} topics={topics} heading={FRONT_HEADING} showTopic />
      )}
      {showList && (
        <StoryList
          articles={rows}
          topics={topics}
          heading={page > 1 ? pageTitle(page, listHeading) : listHeading}
        />
      )}
      <Pagination basePath={basePath} page={page} pageCount={pageCount} />
    </PageShell>
  );
}
