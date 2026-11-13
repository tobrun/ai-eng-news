import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  /** A closing line shown above the links, such as the end-of-feed note on the last page. */
  text?: string;
}

export function SiteFooter({ text }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      {text && <p className={styles.end}>{text}</p>}
      <div className={styles.links}>
        <Link href="/" className={styles.name}>
          <Logo className={styles.logo} />
          {site.name}
        </Link>
        <Link href="/privacy" className={styles.link}>
          Privacy
        </Link>
      </div>
    </footer>
  );
}
