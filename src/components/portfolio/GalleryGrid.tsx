"use client";

import { useEffect, useRef, useState } from "react";
import Lightbox from "./Lightbox";
import { cldFit, fitSrcSet, cldBlur } from "@/lib/img";
import type { Photo } from "./types";

const BATCH = 18;

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [count, setCount] = useState(Math.min(BATCH, photos.length));
  const [open, setOpen] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  // Reveal more as the sentinel approaches the viewport (keeps the DOM light).
  useEffect(() => {
    if (count >= photos.length) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + BATCH, photos.length));
        }
      },
      { rootMargin: "1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, photos.length]);

  return (
    <>
      <div className="columns-2 md:columns-3 xl:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
        {photos.slice(0, count).map((p, i) => (
          <Tile key={p._id} photo={p} index={i} priority={i < 4} onOpen={setOpen} />
        ))}
      </div>

      {count < photos.length && <div ref={sentinel} className="h-px w-full" aria-hidden />}

      <Lightbox photos={photos} index={open} setIndex={setOpen} />
    </>
  );
}

function Tile({
  photo,
  index,
  priority,
  onOpen,
}: {
  photo: Photo;
  index: number;
  priority: boolean;
  onOpen: (i: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const ratio = photo.width && photo.height ? photo.width / photo.height : 0.8;

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={photo.title || photo.category || "View photo"}
      className="group relative mb-3 sm:mb-4 block w-full overflow-hidden rounded-[3px] bg-charcoal-2 cursor-zoom-in break-inside-avoid"
      style={{
        aspectRatio: String(ratio),
        backgroundImage: `url(${cldBlur(photo.url)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cldFit(photo.url, 768)}
        srcSet={fitSrcSet(photo.url)}
        sizes="(max-width:640px) 50vw, (max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
        alt={photo.title || photo.category || "Legacy Studio photography"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.035] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
}
