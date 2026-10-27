import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedPage } from "@/components/FeedPage";
import {
  getArticlesByTopic,
  getLatestPostedAt,
  getTopic,
  getTopics,
  pageCount,
  pageOf,
  topicPath,
} from "@/lib/articles";

export function generateStaticParams() {
  return getTopics().map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/topics/[topic]">): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  return topic ? { title: topic.name } : {};
}

export default async function TopicPage({ params }: PageProps<"/topics/[topic]">) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  const articles = getArticlesByTopic(topic.slug);
  return (
    <FeedPage
      topics={getTopics()}
      rows={pageOf(articles, 1)}
      page={1}
      pageCount={pageCount(articles)}
      basePath={topicPath(topic.slug)}
      totalCount={articles.length}
      updatedAt={getLatestPostedAt(articles)}
      activeTopic={topic}
    />
  );
}
