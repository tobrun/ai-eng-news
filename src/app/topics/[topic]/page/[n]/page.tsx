import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/FeedPage";
import { StoryList } from "@/components/StoryList";
import { Pagination } from "@/components/Pagination";
import { getArticlesByTopic, isPageNumber, pageCount, pageOf, pageTitle } from "@/lib/articles";
import { topicOf, topicPath, topics } from "@/lib/topics";

// Cache Components reject an empty list, so a one-page topic gets a placeholder page 2; the page 404s it.
export function generateStaticParams() {
  return topics.flatMap((topic) => {
    const count = pageCount(getArticlesByTopic(topic.slug));
    if (count < 2) return [{ topic: topic.slug, n: "2" }];
    return Array.from({ length: count - 1 }, (_, index) => ({ topic: topic.slug, n: String(index + 2) }));
  });
}

export async function generateMetadata({ params }: PageProps<"/topics/[topic]/page/[n]">): Promise<Metadata> {
  const { topic: slug, n } = await params;
  const topic = topicOf(slug);
  return topic ? { title: pageTitle(Number(n), topic.name) } : {};
}

export default async function TopicLaterPage({ params }: PageProps<"/topics/[topic]/page/[n]">) {
  const { topic: slug, n } = await params;
  const topic = topicOf(slug);
  if (!topic) notFound();

  const stories = getArticlesByTopic(topic.slug);
  const count = pageCount(stories);
  if (!isPageNumber(n, count)) notFound();

  const page = Number(n);
  return (
    <PageShell current={topic.slug}>
      <StoryList articles={pageOf(stories, page)} heading={pageTitle(page, topic.name)} />
      <Pagination basePath={topicPath(topic.slug)} page={page} pageCount={count} />
    </PageShell>
  );
}
