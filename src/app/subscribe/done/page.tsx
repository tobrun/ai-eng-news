import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/FeedPage";

const TITLE = "You're subscribed";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false },
};

export default function DonePage() {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="done-heading">
        <h2 id="done-heading">{TITLE}</h2>
        <p>
          The weekly newsletter will arrive in your inbox. Every issue has an unsubscribe link.{" "}
          <Link href="/">Back to the news</Link>.
        </p>
      </article>
    </PageShell>
  );
}
