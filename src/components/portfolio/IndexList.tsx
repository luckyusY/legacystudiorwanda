"use client";

import Link from "next/link";
import { useState } from "react";
import { cldCrop, cldBlur } from "@/lib/img";

export interface GalleryEntry {
  slug: string;
  title: string;
  category: string;
  count: number;
  coverUrl: string;
}

export default function IndexList({ entries }: { entries: GalleryEntry[] }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* floating cover preview (desktop) */}
      <div className="hidden lg:block pointer-events-none fixed right-[6vw] top-1/2 -translate-y-1/2 z-0 w-[30vw] max-w-[460px] aspect-[4/5]">
        {entries.map((e, i) => (
          <div
            key={e.slug}
            className="absolute inset-0 overflow-hidden rounded-sm transition-opacity duration-500"
            style={{
              opacity: hover === i ? 1 : 0,
              backgroundImage: `url(${cldBlur(e.coverUrl)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldCrop(e.coverUrl, 720, 900)}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <ul className="relative z-10 border-t border-border">
        {entries.map((e, i) => (
          <li key={e.slug} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <Link
              href={`/portfolio/${e.slug}`}
              className="group flex items-center gap-5 sm:gap-8 border-b border-border py-7 sm:py-10 transition-colors"
            >
              <span className="font-sans text-xs sm:text-sm text-gold/70 tabular-nums w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* inline thumb on mobile */}
              <span
                className="lg:hidden shrink-0 w-16 h-20 rounded-sm overflow-hidden bg-charcoal-2"
                style={{ backgroundImage: `url(${cldBlur(e.coverUrl)})`, backgroundSize: "cover" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldCrop(e.coverUrl, 200, 250)}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-serif text-3xl sm:text-5xl lg:text-6xl leading-[0.98] text-foreground/90 transition-colors duration-300 group-hover:text-gold">
                  {e.title}
                </span>
              </span>

              <span className="hidden sm:flex flex-col items-end shrink-0 text-right">
                <span className="eyebrow !text-muted">{e.category}</span>
                <span className="font-sans text-sm text-muted mt-1">
                  {e.count} photo{e.count === 1 ? "" : "s"}
                </span>
              </span>

              <span className="shrink-0 text-2xl text-muted transition-all duration-300 group-hover:text-gold group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
