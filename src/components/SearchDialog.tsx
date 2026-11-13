"use client";

import { useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { formatShortDate } from "@/lib/format";
import { matches, MIN_QUERY_LENGTH, type SearchRecord } from "@/lib/search";
import { topicOf } from "@/lib/topics";
import styles from "./SearchDialog.module.css";

const INDEX_URL = "/search-index.json";
const UNAVAILABLE = "Search is unavailable right now";

type IndexState = { status: "idle" | "loading" | "failed" } | { status: "ready"; records: SearchRecord[] };

function countLabel(count: number): string {
  if (count === 0) return "No results";
  return count === 1 ? "1 result" : `${count} results`;
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

/** The header's search button and dialog; the index is fetched the first time the dialog opens. */
export function SearchDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputId = useId();
  const [index, setIndex] = useState<IndexState>({ status: "idle" });
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => (index.status === "ready" ? matches(index.records, query) : []),
    [index, query],
  );
  const searching = query.trim().length >= MIN_QUERY_LENGTH;

  async function loadIndex() {
    setIndex({ status: "loading" });
    try {
      const response = await fetch(INDEX_URL);
      if (!response.ok) throw new Error(`search index answered ${response.status}`);
      setIndex({ status: "ready", records: (await response.json()) as SearchRecord[] });
    } catch {
      setIndex({ status: "failed" });
    }
  }

  function open() {
    dialogRef.current?.showModal();
    if (index.status === "idle" || index.status === "failed") void loadIndex();
  }

  function close() {
    dialogRef.current?.close();
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) close();
  }

  let status = "";
  if (index.status === "failed") status = UNAVAILABLE;
  else if (index.status === "ready" && searching) status = countLabel(results.length);

  return (
    <>
      <button type="button" className={styles.trigger} aria-label="Search" aria-haspopup="dialog" onClick={open}>
        <SearchIcon className={styles.icon} />
      </button>
      {/* A click on the backdrop lands on the dialog itself; Esc closes it natively. */}
      <dialog ref={dialogRef} className={styles.dialog} aria-label="Search stories" onClick={closeOnBackdrop}>
        <div className={styles.panel}>
          <div className={styles.field}>
            <label htmlFor={inputId} className="sr-only">
              Search stories
            </label>
            <SearchIcon className={styles.fieldIcon} />
            <input
              id={inputId}
              type="search"
              className={styles.input}
              placeholder="Search stories, sources, topics"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>
          <p aria-live="polite" className={styles.status}>
            {status}
          </p>
          {results.length > 0 && (
            <ol className={styles.results}>
              {results.map((record) => {
                const topic = topicOf(record.topic);
                return (
                  <li key={record.slug} className={styles.result} data-topic={topic?.slug}>
                    <a href={record.url} rel="noopener noreferrer" data-slug={record.slug} className={styles.link}>
                      {record.title}
                    </a>
                    <p className={styles.meta}>
                      {topic && <span className="topic-kicker">{topic.name}</span>}
                      <span>{record.source}</span>
                      <time dateTime={record.postedAt}>{formatShortDate(record.postedAt)}</time>
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </dialog>
    </>
  );
}
