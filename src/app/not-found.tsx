import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/FeedPage";
import { site } from "@/lib/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageShell>
      <section className={styles.panel} aria-labelledby="not-found-heading">
        <p className={styles.code}>404</p>
        <h2 id="not-found-heading" className={styles.heading}>
          This page isn&apos;t on {site.name}.
        </h2>
        <p className={styles.body}>
          The address may be mistyped, or the page doesn&apos;t exist.{" "}
          <Link href="/">Go to all summaries</Link>.
        </p>
      </section>
    </PageShell>
  );
}
