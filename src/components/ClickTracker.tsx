"use client";

import { useEffect } from "react";

const CLICK_ROUTE = "/api/click";
const PRIMARY_BUTTON = 0;
const MIDDLE_BUTTON = 1;

function sendClick(event: MouseEvent) {
  if (event.button !== PRIMARY_BUTTON && event.button !== MIDDLE_BUTTON) return;
  if (!(event.target instanceof Element)) return;
  const slug = event.target.closest<HTMLAnchorElement>("a[data-slug]")?.dataset.slug;
  if (slug) navigator.sendBeacon(CLICK_ROUTE, slug);
}

/** Reports primary and middle clicks on story links (`a[data-slug]`); Trending rows carry no slug, so they never count. */
export function ClickTracker() {
  useEffect(() => {
    document.addEventListener("click", sendClick);
    document.addEventListener("auxclick", sendClick);
    return () => {
      document.removeEventListener("click", sendClick);
      document.removeEventListener("auxclick", sendClick);
    };
  }, []);

  return null;
}
