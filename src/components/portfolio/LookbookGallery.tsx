"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "./Lightbox";
import { cldFit, cldCrop, fitSrcSet, cldBlur } from "@/lib/img";
import type { Photo } from "./types";

type Block =
  | { kind: "hero"; idx: number }
  | { kind: "full"; idx: number }
  | { kind: "duo"; idx: [number, number] }
  | { kind: "trio"; idx: [number, number, number] };

const ar = (p?: Photo) => (p?.width && p?.height ? p.width / p.height : 0.8);

function build(photos: Photo[]): Block[] {
  const blocks: Block[] = [];
  if (!photos.length) return blocks;
  blocks.push({ kind: "hero", idx: 0 });

  const pattern = ["duo", "trio", "full", "duo", "trio", "duo", "full"] as const;
  let i = 1;
  let p = 0;
  while (i < photos.length) {
    const rem = photos.length - i;
    const t = pattern[p % pattern.length];
    p++;
    if (t === "full" && ar(photos[i]) > 1.2) {
      blocks.push({ kind: "full", idx: i });
      i += 1;
    } else if (t === "trio" && rem >= 3) {
      blocks.push({ kind: "trio", idx: [i, i + 1, i + 2] });
      i += 3;
    } else if (rem >= 2) {
      blocks.push({ kind: "duo", idx: [i, i + 1] });
      i += 2;
    } else {
      blocks.push({ kind: "full", idx: i });
      i += 1;
    }
  }
  return blocks;
}

export default function LookbookGallery({
  title,
  category,
  photos,
}: {
  title: string;
  category: string;
  photos: Photo[];
}) {
  const blocks = useMemo(() => build(photos), [photos]);
  const [visible, setVisible] = useState(Math.min(5, blocks.length));
  const [open, setOpen] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= blocks.length) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => e[0].isIntersecting && setVisible((v) => Math.min(v + 4, blocks.length)),
      { rootMargin: "1600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, blocks.length]);

  const cap = `${title} · ${category}`;

  return (
    <div className="bg-background">
      {blocks.slice(0, visible).map((b, n) => {
        if (b.kind === "hero") {
          return (
            <Hero
              key={n}
              title={title}
              category={category}
              count={photos.length}
              photo={photos[b.idx]}
              onOpen={() => setOpen(b.idx)}
            />
          );
        }
        if (b.kind === "full") {
          return (
            <section key={n} className="w-full mt-1.5">
              <Img photo={photos[b.idx]} onOpen={() => setOpen(b.idx)} ratio={16 / 9} bleedH="h-[64vh] sm:h-[82vh]" caption={cap} />
            </section>
          );
        }
        if (b.kind === "duo") {
          return (
            <section key={n} className="grid grid-cols-2 gap-1.5 mt-1.5">
              {b.idx.map((ix) => (
                <Img key={ix} photo={photos[ix]} onOpen={() => setOpen(ix)} ratio={4 / 5} />
              ))}
            </section>
          );
        }
        return (
          <section key={n} className="grid grid-cols-2 md:grid-cols-3 gap-1.5 mt-1.5">
            {b.idx.map((ix, j) => (
              <Img
                key={ix}
                photo={photos[ix]}
                onOpen={() => setOpen(ix)}
                ratio={3 / 4}
                className={j === 2 ? "col-span-2 md:col-span-1" : ""}
              />
            ))}
          </section>
        );
      })}

      {visible < blocks.length && <div ref={sentinel} className="h-px w-full" aria-hidden />}

      {/* Closing */}
      {visible >= blocks.length && (
        <section className="px-5 sm:px-8 py-28 text-center">
          <p className="eyebrow">End of gallery</p>
          <a href="/" className="inline-block mt-5 lb lb-ol-gold text-5xl sm:text-7xl">
            More Work
          </a>
        </section>
      )}

      <Lightbox photos={photos} index={open} setIndex={setOpen} />
    </div>
  );
}

/* hero / divider — split panel + image (PDF style) */
function Hero({
  title,
  category,
  count,
  photo,
  onOpen,
}: {
  title: string;
  category: string;
  count: number;
  photo: Photo;
  onOpen: () => void;
}) {
  return (
    <section className="grid lg:grid-cols-[42%_58%] min-h-[88vh]">
      <div className="relative flex flex-col justify-center px-6 sm:px-12 py-16 bg-charcoal order-2 lg:order-1">
        <span className="eyebrow">{category} — Gallery</span>
        <h1 className="lb lb-ol-white text-[16vw] lg:text-[7.5rem] mt-4 break-words">{title}</h1>
        <div className="h-1 w-24 bg-gold my-7" />
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold">{count} frames</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open photo"
        className="relative order-1 lg:order-2 min-h-[46vh] lg:min-h-0 overflow-hidden cursor-zoom-in group"
        style={{ backgroundImage: `url(${cldBlur(photo.url)})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cldCrop(photo.url, 1300, 1500)}
          srcSet={`${cldCrop(photo.url, 800, 924)} 800w, ${cldCrop(photo.url, 1300, 1500)} 1300w, ${cldCrop(photo.url, 1800, 2078)} 1800w`}
          sizes="(max-width:1024px) 100vw, 58vw"
          alt={title}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
      </button>
    </section>
  );
}

/* single image slot with LQIP + lazy fade-in + optional caption */
function Img({
  photo,
  onOpen,
  ratio,
  bleedH,
  caption,
  className = "",
}: {
  photo: Photo;
  onOpen: () => void;
  ratio: number;
  bleedH?: string;
  caption?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={photo.title || "View photo"}
      className={`group relative block w-full overflow-hidden bg-charcoal-2 cursor-zoom-in ${bleedH || ""} ${className}`}
      style={{
        aspectRatio: bleedH ? undefined : String(ratio),
        backgroundImage: `url(${cldBlur(photo.url)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cldFit(photo.url, 1080)}
        srcSet={fitSrcSet(photo.url)}
        sizes={bleedH ? "100vw" : "(max-width:768px) 50vw, 40vw"}
        alt={photo.title || photo.category || "Legacy Studio"}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {caption && (
        <span className="absolute left-5 bottom-5 flex items-center gap-3 z-10">
          <span className="h-px w-9 bg-gold" />
          <span className="lb-cap text-xs tracking-[0.3em] uppercase text-white drop-shadow">{caption}</span>
        </span>
      )}
    </button>
  );
}
