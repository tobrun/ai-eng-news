import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedPage } from "@/components/FeedPage";
import {
  getArticles,
  getLatestPostedAt,
  getOlderArticles,
  getTopics,
  isPageNumber,
  pageCount,
  pageOf,
  pageTitle,
} from "@/lib/articles";

// Cache Components reject an empty list, so a lone placeholder stands in until a second page exists; the page 404s it.
export function generateStaticParams() {
  const count = pageCount(getOlderArticles());
  if (count < 2) return [{ n: "2" }];
  return Array.from({ length: count - 1 }, (_, index) => ({ n: String(index + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/page/[n]">): Promise<Metadata> {
  const { n } = await params;
  return { title: pageTitle(Number(n)) };
}

export default async function OlderPage({ params }: PageProps<"/page/[n]">) {
  const { n } = await params;
  const older = getOlderArticles();
  const count = pageCount(older);
  if (!isPageNumber(n, count)) notFound();

  const articles = getArticles();
  return (
    <FeedPage
      topics={getTopics()}
      rows={pageOf(older, Number(n))}
      page={Number(n)}
      pageCount={count}
      basePath="/"
      totalCount={articles.length}
      updatedAt={getLatestPostedAt(articles)}
    />
  );
}
