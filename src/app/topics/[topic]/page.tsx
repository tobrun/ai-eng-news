import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/FeedPage";
import { StoryList } from "@/components/StoryList";
import { Pagination } from "@/components/Pagination";
import { getArticlesByTopic, pageCount, pageOf } from "@/lib/articles";
import { topicOf, topicPath, topics } from "@/lib/topics";

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: PageProps<"/topics/[topic]">): Promise<Metadata> {
  const topic = topicOf((await params).topic);
  return topic ? { title: topic.name } : {};
}

export default async function TopicPage({ params }: PageProps<"/topics/[topic]">) {
  const topic = topicOf((await params).topic);
  if (!topic) notFound();

  const stories = getArticlesByTopic(topic.slug);
  return (
    <PageShell current={topic.slug}>
      <StoryList articles={pageOf(stories, 1)} heading={topic.name} />
      <Pagination basePath={topicPath(topic.slug)} page={1} pageCount={pageCount(stories)} />
    </PageShell>
  );
}
