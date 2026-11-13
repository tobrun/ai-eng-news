import Link from "next/link";
import { newsletterEnabled } from "@/lib/newsletter";
import styles from "./NewsletterBox.module.css";

const HEADING = "Get the latest AI engineering news";
const TEXT = "Weekly digest of the most important stories, delivered to your inbox.";

/** The sign-up form: a plain form post, so it and its error page work without script. `website` is the honeypot people leave empty. */
export function NewsletterForm() {
  return (
    <>
      <form method="post" action="/api/subscribe" className={styles.form}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          required
          className={styles.input}
        />
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className={styles.button}>
          Subscribe
        </button>
      </form>
      <p className={styles.note}>
        No spam, one email a week. <Link href="/privacy">How we handle your address</Link>.
      </p>
    </>
  );
}

/** The rail's sign-up box at `#newsletter`; nothing at all while the newsletter's settings are missing. */
export function NewsletterBox() {
  if (!newsletterEnabled()) return null;

  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className={styles.box}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm.8 2 8.2 6 8.2-6H3.8Z" />
      </svg>
      <h2 id="newsletter-heading" className={styles.heading}>
        {HEADING}
      </h2>
      <p className={styles.text}>{TEXT}</p>
      <NewsletterForm />
    </section>
  );
}
