import type { Metadata } from "next";
import { PageShell } from "@/components/FeedPage";
import { newsletterEnabled } from "@/lib/newsletter";
import { site } from "@/lib/site";

const TITLE = "Privacy";

export const metadata: Metadata = {
  title: TITLE,
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="prose" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">{TITLE}</h2>
        <p>
          {site.name} sets no cookies and gives you no lasting visitor ID. There is no consent banner because
          nothing here needs one. This page lists everything the site keeps.
        </p>

        <h3>Clicks on stories</h3>
        <p>
          When you open a story, your browser tells this site which story it was. The site keeps a count of clicks
          per story per day, used for the Trending list, and deletes each day&apos;s counts after eight days.
        </p>
        <p>
          To count one click per visitor per story and to stop abuse, the site keeps a keyed hash of your IP
          address for at most one day. The address itself is never stored, and the hash cannot be turned back into
          it.
        </p>

        <h3>Page views</h3>
        <p>
          The site uses Vercel Web Analytics, which counts page views and the page you came from without cookies.
          Vercel identifies a visit by a hash of the request that changes every day. Query strings are removed
          before anything is sent.
        </p>

        {newsletterEnabled() && (
          <>
            <h3>Newsletter</h3>
            <p>
              If you sign up for the weekly newsletter, your email address is stored with Resend, the service that
              sends it, once you confirm it from the email we send. Every newsletter has an unsubscribe link, and
              unsubscribing stops all further email.
            </p>
            <p>
              Before you confirm, your email address is sent to Resend so it can deliver the confirmation email, and
              Resend keeps that email in its sending logs. To limit confirmation emails, the site keeps a keyed hash
              of your email address for one day. The address itself is not stored by the site, and the hash cannot
              be turned back into it.
            </p>
          </>
        )}
      </article>
    </PageShell>
  );
}
