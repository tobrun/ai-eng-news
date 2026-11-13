import type { Metadata } from "next";
import { PageShell } from "@/components/FeedPage";

const TITLE = "Something went wrong, try the link again";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false },
};

export default function ErrorPage() {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="error-heading">
        <h2 id="error-heading">{TITLE}</h2>
        <p>Your subscription was not saved. Open the link in the email again and press the button once more.</p>
      </article>
    </PageShell>
  );
}
