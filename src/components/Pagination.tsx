import Link from "next/link";
import styles from "./Pagination.module.css";

interface PaginationProps {
  basePath: string;
  page: number;
  pageCount: number;
}

export function Pagination({ basePath, page, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pagePath = (n: number) => (n === 1 ? basePath : `${basePath.replace(/\/$/, "")}/page/${n}`);

  return (
    <nav aria-label="Pagination" className={styles.nav}>
      {page > 1 && (
        <Link href={pagePath(page - 1)} rel="prev" className={`${styles.link} ${styles.newer}`}>
          Newer
        </Link>
      )}
      <p className={styles.status}>
        Page {page} of {pageCount}
      </p>
      {page < pageCount && (
        <Link href={pagePath(page + 1)} rel="next" className={`${styles.link} ${styles.older}`}>
          Older
        </Link>
      )}
    </nav>
  );
}
