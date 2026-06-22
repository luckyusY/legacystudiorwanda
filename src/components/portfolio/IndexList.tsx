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
      <div className="hidden lg:block pointer-events-none fixed right-[5vw] top-1/2 -translate-y-1/2 z-0 w-[26vw] max-w-[420px] aspect-[4/5]">
        {entries.map((e, i) => (
          <div
            key={e.slug}
            className="absolute inset-0 overflow-hidden transition-opacity duration-500"
            style={{
              opacity: hover === i ? 1 : 0,
              backgroundImage: `url(${cldBlur(e.coverUrl)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldCrop(e.coverUrl, 720, 900)} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>

      <ul className="relative z-10 border-t border-border/70">
        {entries.map((e, i) => (
          <li key={e.slug} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <Link
              href={`/portfolio/${e.slug}`}
              className="group flex items-center gap-4 sm:gap-8 border-b border-border/70 py-8 sm:py-12"
            >
              <span className="font-sans text-xs text-gold/70 tabular-nums w-8 shrink-0 pt-3 self-start">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* inline thumb on mobile */}
              <span
                className="lg:hidden shrink-0 w-16 h-20 overflow-hidden bg-charcoal-2"
                style={{ backgroundImage: `url(${cldBlur(e.coverUrl)})`, backgroundSize: "cover" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cldCrop(e.coverUrl, 200, 250)} alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[13vw] sm:text-7xl lg:text-8xl leading-[0.9] transition-colors duration-300 ${
                    hover === i ? "lb text-gold" : "lb lb-ol-white"
                  }`}
                >
                  {e.title}
                </span>
              </span>

              <span className="hidden sm:flex flex-col items-end shrink-0 text-right self-start pt-3">
                <span className="eyebrow !text-muted">{e.category}</span>
                <span className="font-sans text-sm text-muted mt-1">{e.count} photos</span>
              </span>

              <span className="shrink-0 self-start pt-2 text-2xl text-muted transition-all duration-300 group-hover:text-gold group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
