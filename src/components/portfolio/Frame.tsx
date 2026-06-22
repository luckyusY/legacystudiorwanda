"use client";

import { cldCrop, cldFit, cropSrcSet, fitSrcSet } from "@/lib/img";

export interface Photo {
  _id: string;
  url: string;
  width?: number;
  height?: number;
  title?: string;
  category?: string;
  collection?: string;
}

/**
 * A single gallery image.
 * - `ratio` set  -> art-directed crop (content-aware g_auto); can parallax.
 * - `ratio` null -> natural aspect (used in masonry); no parallax.
 */
export default function Frame({
  photo,
  index,
  onOpen,
  ratio,
  parallax = false,
  sizes,
  priority = false,
  className = "",
}: {
  photo: Photo;
  index: number;
  onOpen: (i: number) => void;
  ratio?: number;
  parallax?: boolean;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const cropped = typeof ratio === "number";

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={photo.title || photo.category || "View photo"}
      className={`group relative block w-full overflow-hidden bg-charcoal-2 cursor-zoom-in ${className}`}
      style={cropped ? { aspectRatio: String(ratio) } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cropped ? cldCrop(photo.url, 1280, Math.round(1280 / (ratio as number))) : cldFit(photo.url, 1280)}
        srcSet={cropped ? cropSrcSet(photo.url, ratio as number) : fitSrcSet(photo.url)}
        sizes={sizes}
        alt={photo.title || photo.category || "Legacy Studio photography"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(cropped ? {} : { width: photo.width, height: photo.height })}
        data-parallax={parallax ? "" : undefined}
        className={
          cropped
            ? `absolute left-0 w-full object-cover will-change-transform ${
                parallax ? "h-[126%] -top-[13%]" : "h-full top-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              }`
            : "block w-full h-auto transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        }
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-white/10 transition-[box-shadow] duration-500" />
    </button>
  );
}
