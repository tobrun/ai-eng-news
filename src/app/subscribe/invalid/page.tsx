import type { Metadata } from "next";
import { PageShell } from "@/components/FeedPage";
import { NewsletterForm } from "@/components/NewsletterBox";

const TITLE = "Enter a valid email address";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false },
};

export default function InvalidPage() {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="invalid-heading">
        <h2 id="invalid-heading">{TITLE}</h2>
        <p>That doesn&apos;t look like an email address. Check it and try again.</p>
        <NewsletterForm />
      </article>
    </PageShell>
  );
}
