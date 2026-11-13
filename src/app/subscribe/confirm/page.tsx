import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/FeedPage";
import { CONFIRM_BUTTON, openToken } from "@/lib/newsletter";
import styles from "@/components/NewsletterBox.module.css";

const TITLE = "Confirm your subscription";
const EXPIRED = "This link has expired";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Request-time part: opening the token needs the query and the clock, so it streams in after the static shell. */
async function ConfirmBody({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  const email =
    typeof token === "string" ? openToken(token, new Date(), process.env.SITE_SECRET ?? "") : null;

  if (!email) {
    return (
      <>
        <h2 id="confirm-heading">{EXPIRED}</h2>
        <p>
          Confirmation links work for 48 hours. <Link href="/#newsletter">Sign up again</Link> to get a new one.
        </p>
      </>
    );
  }

  return (
    <>
      <h2 id="confirm-heading">{TITLE}</h2>
      <p>
        Press the button to send the weekly newsletter to <strong>{email}</strong>.
      </p>
      <form method="post" action="/api/subscribe/confirm">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className={styles.button}>
          {CONFIRM_BUTTON}
        </button>
      </form>
    </>
  );
}

export default function ConfirmPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="confirm-heading">
        <Suspense fallback={<h2 id="confirm-heading">{TITLE}</h2>}>
          <ConfirmBody searchParams={searchParams} />
        </Suspense>
      </article>
    </PageShell>
  );
}
