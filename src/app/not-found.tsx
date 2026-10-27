import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/FeedPage";
import { getArticles, getLatestPostedAt } from "@/lib/articles";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  const articles = getArticles();

  return (
    <PageShell storyCount={articles.length} updatedAt={getLatestPostedAt(articles)}>
      <section className={styles.panel} aria-labelledby="not-found-heading">
        <h2 id="not-found-heading" className={styles.heading}>
          This page didn&apos;t make it through the forward pass.
        </h2>
        <p className={styles.body}>
          The address may be mistyped, or the page doesn&apos;t exist.{" "}
          <Link href="/">Go to all summaries</Link>.
        </p>
      </section>
    </PageShell>
  );
}
