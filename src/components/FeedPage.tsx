import type { ReactNode } from "react";
import type { Article } from "@/lib/types";
import { pageTitle } from "@/lib/articles";
import { Masthead } from "./Masthead";
import { StoryGrid } from "./StoryGrid";
import { StoryList } from "./StoryList";
import { Pagination } from "./Pagination";
import { SiteFooter } from "./SiteFooter";

const MAIN_ID = "summaries";
const FRONT_HEADING = "Latest summaries";
const EARLIER_HEADING = "Earlier";
const END_OF_FEED = "That's the end of the feed. Every summary links to its original post.";

interface PageShellProps {
  storyCount: number;
  updatedAt?: string;
  footer?: string;
  children: ReactNode;
}

export function PageShell({ storyCount, updatedAt, footer, children }: PageShellProps) {
  return (
    <div className="page">
      <a href={`#${MAIN_ID}`} className="skip-link">
        Skip to summaries
      </a>
      <Masthead storyCount={storyCount} updatedAt={updatedAt} />
      <main id={MAIN_ID} className="full">
        {children}
      </main>
      <SiteFooter text={footer} />
    </div>
  );
}

interface FeedPageProps {
  /** The newest edition; given only on the first page of the home list. */
  frontPage?: Article[];
  rows: Article[];
  page: number;
  pageCount: number;
  basePath: string;
  totalCount: number;
  updatedAt?: string;
}

export function FeedPage({
  frontPage,
  rows,
  page,
  pageCount,
  basePath,
  totalCount,
  updatedAt,
}: FeedPageProps) {
  const showList = rows.length > 0 || !frontPage;

  return (
    <PageShell
      storyCount={totalCount}
      updatedAt={updatedAt}
      footer={totalCount > 0 && page === pageCount ? END_OF_FEED : undefined}
    >
      {frontPage && <StoryGrid articles={frontPage} heading={FRONT_HEADING} />}
      {showList && (
        <StoryList
          articles={rows}
          heading={page > 1 ? pageTitle(page, EARLIER_HEADING) : EARLIER_HEADING}
        />
      )}
      <Pagination basePath={basePath} page={page} pageCount={pageCount} />
    </PageShell>
  );
}
