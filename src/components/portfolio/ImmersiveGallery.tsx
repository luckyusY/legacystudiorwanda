"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Frame, { type Photo } from "./Frame";
import Lightbox from "./Lightbox";

export interface Group {
  slug: string;
  title: string;
  category: string;
  images: Photo[];
}

type Slot = { photo: Photo; index: number };

type Block =
  | { kind: "chapter"; n: number; title: string; category: string; count: number }
  | { kind: "bleed"; a: Slot }
  | { kind: "panoramic"; a: Slot }
  | { kind: "duo"; a: Slot; b: Slot }
  | { kind: "trio"; a: Slot; b: Slot; c: Slot }
  | { kind: "bigSmall"; a: Slot; b: Slot; flip: boolean }
  | { kind: "masonry"; items: Slot[] };

const PATTERN = ["bleed", "duo", "trio", "bigSmall", "panoramic", "masonry"] as const;

function buildBlocks(groups: Group[]) {
  const flat: Photo[] = [];
  const blocks: Block[] = [];
  let chapter = 0;

  for (const g of groups) {
    if (!g.images.length) continue;
    chapter += 1;
    blocks.push({
      kind: "chapter",
      n: chapter,
      title: g.title,
      category: g.category,
      count: g.images.length,
    });

    const queue = [...g.images];
    const take = (n: number): Slot[] => {
      const out: Slot[] = [];
      for (let i = 0; i < n && queue.length; i++) {
        const photo = queue.shift()!;
        out.push({ photo, index: flat.length });
        flat.push(photo);
      }
      return out;
    };

    let p = 0;
    while (queue.length) {
      const type = PATTERN[p % PATTERN.length];
      p += 1;
      const remaining = queue.length;

      if (type === "bleed" && remaining >= 1) {
        blocks.push({ kind: "bleed", a: take(1)[0] });
      } else if (type === "panoramic" && remaining >= 1) {
        blocks.push({ kind: "panoramic", a: take(1)[0] });
      } else if (type === "duo" && remaining >= 2) {
        const [a, b] = take(2);
        blocks.push({ kind: "duo", a, b });
      } else if (type === "trio" && remaining >= 3) {
        const [a, b, c] = take(3);
        blocks.push({ kind: "trio", a, b, c });
      } else if (type === "bigSmall" && remaining >= 2) {
        const [a, b] = take(2);
        blocks.push({ kind: "bigSmall", a, b, flip: chapter % 2 === 0 });
      } else if (type === "masonry" || remaining < 2) {
        const items = take(Math.min(6, Math.max(1, remaining)));
        blocks.push({ kind: "masonry", items });
      } else {
        const [a, b] = take(2);
        blocks.push({ kind: "duo", a, b });
      }
    }
  }

  return { blocks, flat };
}

/* ---------- reveal wrapper ---------- */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const WRAP = "mx-auto w-full max-w-[1500px] px-5 sm:px-8";

export default function ImmersiveGallery({ groups }: { groups: Group[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const { blocks, flat } = useMemo(() => buildBlocks(groups), [groups]);
  const hero = flat[0];

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // GSAP parallax on art-directed frames
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [blocks]);

  const onOpen = (i: number) => setOpen(i);

  return (
    <div ref={rootRef} className="relative bg-background">
      {/* scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gold origin-left z-[90]"
        style={{ scaleX: progress }}
      />

      {/* HERO */}
      {hero && (
        <section className="relative h-[100svh] w-full overflow-hidden">
          <button
            type="button"
            onClick={() => onOpen(0)}
            className="absolute inset-0 w-full h-full overflow-hidden cursor-zoom-in"
            aria-label="Open first photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${hero.url.replace("/upload/", "/upload/f_auto,q_auto,c_fill,g_auto,w_2000,h_2400/")}`}
              alt={hero.title || "Legacy Studio"}
              className="absolute left-0 -top-[10%] w-full h-[120%] object-cover will-change-transform"
              data-parallax=""
            />
          </button>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-background" />
          <div className="absolute inset-0 flex flex-col justify-end pb-[10vh]">
            <div className={WRAP}>
              <motion.span
                className="block text-xs uppercase tracking-[0.5em] text-gold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Legacy Studio · Kigali
              </motion.span>
              <motion.h1
                className="font-serif text-[15vw] leading-[0.86] sm:text-[10vw] lg:text-[8.5rem] mt-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                The Portfolio
              </motion.h1>
              <motion.p
                className="text-foreground/70 mt-5 max-w-md"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                A scroll through moments we had the honour of making permanent —
                weddings, events and portraits.
              </motion.p>
            </div>
          </div>
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-foreground/50"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            scroll
          </motion.div>
        </section>
      )}

      {/* BLOCKS */}
      <div className="pb-32">
        {blocks.map((block, i) => (
          <BlockView key={i} block={block} onOpen={onOpen} first={i === 0} />
        ))}
      </div>

      {/* OUTRO */}
      <section className={`${WRAP} pb-32 text-center`}>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Your story is next</p>
          <h2 className="font-serif text-4xl sm:text-5xl mt-4">Let&apos;s create something timeless.</h2>
          <a href="/booking" className="btn-gold rounded-full px-9 py-4 inline-block mt-8">
            Book a session
          </a>
        </Reveal>
      </section>

      <Lightbox photos={flat} index={open} setIndex={setOpen} />
    </div>
  );
}

/* ---------- block renderer ---------- */
function BlockView({
  block,
  onOpen,
  first,
}: {
  block: Block;
  onOpen: (i: number) => void;
  first: boolean;
}) {
  switch (block.kind) {
    case "chapter":
      return (
        <section className={`${WRAP} pt-28 pb-10`}>
          <Reveal className="flex items-end justify-between gap-6 border-b border-border pb-6">
            <div>
              <span className="font-serif text-gold/50 text-2xl">
                {String(block.n).padStart(2, "0")}
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl mt-2 leading-none">{block.title}</h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{block.category}</p>
              <p className="text-muted text-sm mt-1">{block.count} frames</p>
            </div>
          </Reveal>
        </section>
      );

    case "bleed":
      return (
        <section className="relative w-full mt-6">
          <Reveal>
            <Frame
              photo={block.a.photo}
              index={block.a.index}
              onOpen={onOpen}
              ratio={16 / 9}
              parallax
              priority={first}
              sizes="100vw"
              className="h-[78vh]"
            />
          </Reveal>
        </section>
      );

    case "panoramic":
      return (
        <section className="relative w-full mt-6">
          <Reveal>
            <Frame
              photo={block.a.photo}
              index={block.a.index}
              onOpen={onOpen}
              ratio={21 / 9}
              parallax
              sizes="100vw"
            />
          </Reveal>
        </section>
      );

    case "duo":
      return (
        <section className={`${WRAP} mt-6`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
            <Reveal>
              <Frame photo={block.a.photo} index={block.a.index} onOpen={onOpen} ratio={4 / 5} parallax sizes="(max-width:768px) 100vw, 50vw" />
            </Reveal>
            <Reveal delay={0.08} className="sm:mt-16">
              <Frame photo={block.b.photo} index={block.b.index} onOpen={onOpen} ratio={4 / 5} parallax sizes="(max-width:768px) 100vw, 50vw" />
            </Reveal>
          </div>
        </section>
      );

    case "trio":
      return (
        <section className={`${WRAP} mt-6`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-start">
            <Reveal>
              <Frame photo={block.a.photo} index={block.a.index} onOpen={onOpen} ratio={3 / 4} parallax sizes="(max-width:768px) 50vw, 33vw" />
            </Reveal>
            <Reveal delay={0.06} className="md:mt-20">
              <Frame photo={block.b.photo} index={block.b.index} onOpen={onOpen} ratio={3 / 4} parallax sizes="(max-width:768px) 50vw, 33vw" />
            </Reveal>
            <Reveal delay={0.12} className="col-span-2 md:col-span-1 md:mt-8">
              <Frame photo={block.c.photo} index={block.c.index} onOpen={onOpen} ratio={3 / 4} parallax sizes="(max-width:768px) 100vw, 33vw" />
            </Reveal>
          </div>
        </section>
      );

    case "bigSmall":
      return (
        <section className={`${WRAP} mt-6`}>
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center ${block.flip ? "" : ""}`}>
            <Reveal className={`lg:col-span-7 ${block.flip ? "lg:order-2" : ""}`}>
              <Frame photo={block.a.photo} index={block.a.index} onOpen={onOpen} ratio={3 / 2} parallax sizes="(max-width:1024px) 100vw, 58vw" />
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-5 ${block.flip ? "lg:order-1" : ""}`}>
              <Frame photo={block.b.photo} index={block.b.index} onOpen={onOpen} ratio={4 / 5} parallax sizes="(max-width:1024px) 100vw, 42vw" />
            </Reveal>
          </div>
        </section>
      );

    case "masonry":
      return (
        <section className={`${WRAP} mt-6`}>
          <Reveal>
            <div className="columns-2 lg:columns-3 gap-4 sm:gap-6 [column-fill:_balance]">
              {block.items.map((s) => (
                <div key={s.index} className="mb-4 sm:mb-6 break-inside-avoid">
                  <Frame
                    photo={s.photo}
                    index={s.index}
                    onOpen={onOpen}
                    sizes="(max-width:768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      );
  }
}
