"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

export interface GalleryItem {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  width?: number;
  height?: number;
}

export default function MasonryGallery({ images }: { images: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  if (!images.length) {
    return <p className="text-center text-muted py-20">No images in this gallery yet.</p>;
  }

  const active = index === null ? null : images[index];

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
        {images.map((img, i) => (
          <button
            key={img._id}
            onClick={() => setIndex(i)}
            className="mb-3 sm:mb-4 block w-full relative rounded-xl overflow-hidden group cursor-zoom-in"
          >
            <Image
              src={img.url}
              alt={img.title || img.category || "Legacy Studio photo"}
              width={img.width || 800}
              height={img.height || 1000}
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4 select-none"
          onClick={close}
        >
          <button
            className="absolute top-4 right-5 text-4xl leading-none text-foreground/70 hover:text-gold"
            aria-label="Close"
            onClick={close}
          >
            ×
          </button>
          <button
            className="absolute left-3 sm:left-6 text-4xl text-foreground/60 hover:text-gold px-3 py-6"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <button
            className="absolute right-3 sm:right-6 text-4xl text-foreground/60 hover:text-gold px-3 py-6"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>

          <div
            className="relative max-w-5xl max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt={active.title || "Legacy Studio photo"}
              width={active.width || 1400}
              height={active.height || 1750}
              className="object-contain w-auto h-auto max-h-[84vh] rounded-lg"
              priority
            />
            <p className="text-xs text-muted mt-3">
              {index! + 1} / {images.length}
              {active.title ? ` · ${active.title}` : ""}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
