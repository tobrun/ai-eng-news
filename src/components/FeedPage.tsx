import type { ReactNode } from "react";
import type { Article } from "@/lib/types";
import { pageTitle } from "@/lib/articles";
import { Header, type MenuEntry } from "./Header";
import { FrontPage } from "./FrontPage";
import { StoryList } from "./StoryList";
import { Pagination } from "./Pagination";
import { SiteFooter } from "./SiteFooter";

const MAIN_ID = "summaries";
const EARLIER_HEADING = "Earlier";
const END_OF_FEED = "That's the end of the feed. Every summary links to its original post.";

interface PageShellProps {
  /** The menu entry marked as the current page. */
  current?: MenuEntry;
  /** A closing line above the footer's links, such as the end-of-feed note. */
  footer?: string;
  children: ReactNode;
}

export function PageShell({ current, footer, children }: PageShellProps) {
  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link">
        Skip to summaries
      </a>
      <Header current={current} />
      <div className="page">
        <main id={MAIN_ID}>{children}</main>
        <SiteFooter text={footer} />
      </div>
    </>
  );
}

interface FeedPageProps {
  /** The newest edition; given only on the first page of the home list. */
  frontPage?: Article[];
  rows: Article[];
  page: number;
  pageCount: number;
  basePath: string;
}

export function FeedPage({ frontPage, rows, page, pageCount, basePath }: FeedPageProps) {
  const showList = rows.length > 0 || !frontPage;
  const isEmpty = !frontPage?.length && rows.length === 0;

  return (
    <PageShell current="news" footer={!isEmpty && page === pageCount ? END_OF_FEED : undefined}>
      {frontPage && <FrontPage edition={frontPage} />}
      {showList && (
        <StoryList articles={rows} heading={page > 1 ? pageTitle(page, EARLIER_HEADING) : EARLIER_HEADING} />
      )}
      <Pagination basePath={basePath} page={page} pageCount={pageCount} />
    </PageShell>
  );
}
