"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  url: string;
  title?: string;
  category?: string;
}

const PLACEHOLDERS = [
  { label: "Weddings", hue: 28 },
  { label: "Portraits", hue: 18 },
  { label: "Events", hue: 40 },
  { label: "Maternity", hue: 12 },
  { label: "Kids", hue: 35 },
  { label: "Products", hue: 22 },
];

export default function FeaturedGallery() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setItems(d.images || []))
      .catch(() => setItems([]));
  }, []);

  const images = (items || []).slice(0, 6);

  if (items !== null && images.length === 0) {
    // No uploads yet — show branded placeholders
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PLACEHOLDERS.map((p) => (
          <Placeholder key={p.label} label={p.label} hue={p.hue} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {(images.length ? images : []).map((img) => (
        <div key={img._id} className="relative aspect-[4/5] rounded-xl overflow-hidden group">
          <Image
            src={img.url}
            alt={img.title || img.category || "Legacy Studio"}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-sm text-gold-soft">{img.title || img.category}</span>
          </div>
        </div>
      ))}
      {items === null &&
        PLACEHOLDERS.slice(0, 6).map((p) => <Placeholder key={p.label} label={p.label} hue={p.hue} skeleton />)}
    </div>
  );
}

function Placeholder({ label, hue, skeleton }: { label: string; hue: number; skeleton?: boolean }) {
  return (
    <div
      className="relative aspect-[4/5] rounded-xl overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 30% 12%), hsl(${hue} 25% 8%))`,
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(201,162,75,0.35), transparent 50%)",
        }}
      />
      {!skeleton && (
        <span className="relative font-serif text-gold-soft/70 tracking-wide">{label}</span>
      )}
    </div>
  );
}
