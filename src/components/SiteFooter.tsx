import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  text?: string;
}

export function SiteFooter({ text }: SiteFooterProps) {
  if (!text) return null;

  return (
    <footer className={styles.footer}>
      <p className={styles.end}>{text}</p>
    </footer>
  );
}
