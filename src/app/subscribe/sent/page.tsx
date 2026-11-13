import type { Metadata } from "next";
import { PageShell } from "@/components/FeedPage";

const TITLE = "Check your inbox";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false },
};

export default function SentPage() {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="sent-heading">
        <h2 id="sent-heading">{TITLE}</h2>
        <p>
          If that address can receive email, a confirmation link is on its way. Open it within 48 hours and press
          the button on the page to start the weekly newsletter.
        </p>
      </article>
    </PageShell>
  );
}
