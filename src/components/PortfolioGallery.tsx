"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GALLERY_CATEGORIES } from "@/lib/content";

interface GalleryItem {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  width?: number;
  height?: number;
}

export default function PortfolioGallery() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setItems(d.images || []))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (active === "All") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm transition-colors border ${
              active === c
                ? "bg-gold text-[#1a1408] border-gold"
                : "border-border text-foreground/70 hover:border-gold hover:text-gold"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading */}
      {items === null && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl bg-charcoal-2 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {items !== null && filtered.length === 0 && (
        <div className="text-center py-24 text-muted">
          <p className="font-serif text-2xl text-foreground/80">Gallery coming soon</p>
          <p className="mt-3 max-w-md mx-auto text-sm">
            Our team is curating a selection of our finest work. In the meantime, get in touch to see
            samples relevant to your project.
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="columns-2 md:columns-3 gap-4 mt-10 [column-fill:_balance]">
          {filtered.map((img) => (
            <button
              key={img._id}
              onClick={() => setLightbox(img)}
              className="mb-4 block w-full relative rounded-xl overflow-hidden group"
            >
              <Image
                src={img.url}
                alt={img.title || img.category || "Legacy Studio"}
                width={img.width || 800}
                height={img.height || 1000}
                sizes="(max-width:768px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm text-gold-soft">{img.title || img.category}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-3xl text-foreground/80 hover:text-gold"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.title || "Legacy Studio"}
              width={lightbox.width || 1200}
              height={lightbox.height || 1500}
              className="object-contain w-auto h-auto max-h-[85vh] rounded-lg"
            />
            {(lightbox.title || lightbox.category) && (
              <p className="text-center text-sm text-gold-soft mt-3">
                {lightbox.title} {lightbox.category ? `· ${lightbox.category}` : ""}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
