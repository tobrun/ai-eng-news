import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedPage } from "@/components/FeedPage";
import {
  getArticlesByTopic,
  getLatestPostedAt,
  getTopic,
  getTopics,
  isPageNumber,
  pageCount,
  pageOf,
  pageTitle,
  topicPath,
} from "@/lib/articles";

// A topic with a single page gets a placeholder so the route always has params; the page 404s it.
export function generateStaticParams() {
  return getTopics().flatMap((topic) => {
    const count = pageCount(getArticlesByTopic(topic.slug));
    if (count < 2) return [{ topic: topic.slug, n: "2" }];
    return Array.from({ length: count - 1 }, (_, index) => ({
      topic: topic.slug,
      n: String(index + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/topics/[topic]/page/[n]">): Promise<Metadata> {
  const { topic: slug, n } = await params;
  const topic = getTopic(slug);
  return topic ? { title: pageTitle(Number(n), topic.name) } : {};
}

export default async function TopicOlderPage({ params }: PageProps<"/topics/[topic]/page/[n]">) {
  const { topic: slug, n } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(topic.slug);
  const count = pageCount(articles);
  if (!isPageNumber(n, count)) notFound();

  return (
    <FeedPage
      topics={getTopics()}
      rows={pageOf(articles, Number(n))}
      page={Number(n)}
      pageCount={count}
      basePath={topicPath(topic.slug)}
      totalCount={articles.length}
      updatedAt={getLatestPostedAt(articles)}
      activeTopic={topic}
    />
  );
}
