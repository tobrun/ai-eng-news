"use client";

import { useState } from "react";

interface StoryImageProps {
  src: string;
  className?: string;
  priority?: boolean;
}

/** The author's share image, linked where they host it; removed from the card when it fails to load. */
export function StoryImage({ src, className, priority = false }: StoryImageProps) {
  const [failed, setFailed] = useState(false);

  // An image that failed before hydration fires no error handler, so it is checked when the element attaches.
  function checkLoaded(img: HTMLImageElement | null) {
    if (img?.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }

  if (failed) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- D-image-attrs: the image is linked from the author's host, not optimised by next/image.
    <img
      ref={checkLoaded}
      src={src}
      alt=""
      width={1200}
      height={628}
      decoding="async"
      referrerPolicy="no-referrer"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
