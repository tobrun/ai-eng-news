"use client";

import { useState } from "react";

interface StoryImageProps {
  src?: string | null;
  className?: string;
  placeholderClassName?: string;
  imageClassName?: string;
  priority?: boolean;
}

/**
 * The image slot of a card: a tinted placeholder panel that is always drawn, and the author's share image
 * on top of it, linked where they host it and removed when it fails to load so the panel shows.
 */
export function StoryImage({ src, className, placeholderClassName, imageClassName, priority = false }: StoryImageProps) {
  const [failed, setFailed] = useState(false);

  // An image that failed before hydration fires no error handler, so it is checked when the element attaches.
  function checkLoaded(img: HTMLImageElement | null) {
    if (img?.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }

  return (
    <div className={className}>
      <div className={placeholderClassName} aria-hidden="true" />
      {src && !failed && (
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
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
