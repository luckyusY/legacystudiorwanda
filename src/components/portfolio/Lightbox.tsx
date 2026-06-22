"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cldFit } from "@/lib/img";
import type { Photo } from "./Frame";

export default function Lightbox({
  photos,
  index,
  setIndex,
}: {
  photos: Photo[];
  index: number | null;
  setIndex: (i: number | null) => void;
}) {
  const close = useCallback(() => setIndex(null), [setIndex]);
  const go = useCallback(
    (dir: number) =>
      setIndex(index === null ? null : (index + dir + photos.length) % photos.length),
    [index, photos.length, setIndex]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, go]);

  const active = index === null ? null : photos[index];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 text-xs tracking-[0.3em] uppercase text-white/60">
            <span>{active.category || "Legacy Studio"}</span>
            <span>
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-4xl text-white/50 hover:text-gold transition-colors px-4 py-8"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-4xl text-white/50 hover:text-gold transition-colors px-4 py-8"
          >
            ›
          </button>
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-5 text-3xl leading-none text-white/60 hover:text-gold transition-colors z-10"
          >
            ×
          </button>

          <motion.img
            key={active._id}
            src={cldFit(active.url, 1600)}
            alt={active.title || "Legacy Studio photography"}
            className="max-w-[92vw] max-h-[86vh] object-contain select-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
