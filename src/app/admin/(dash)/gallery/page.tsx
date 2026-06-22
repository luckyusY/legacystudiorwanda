"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY_CATEGORIES } from "@/lib/content";

interface GalleryItem {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  collection?: string;
  featured?: boolean;
}

interface CollectionOpt {
  slug: string;
  title: string;
  count: number;
}

const CATEGORIES = GALLERY_CATEGORIES.filter((c) => c !== "All");

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [collections, setCollections] = useState<CollectionOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [filter, setFilter] = useState("studio-portfolio");

  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [uploadCollection, setUploadCollection] = useState("studio-portfolio");
  const [title, setTitle] = useState("");
  const [featured, setFeatured] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function loadCollections() {
    const data = await fetch("/api/admin/collections").then((r) => r.json());
    setCollections(data.collections || []);
  }

  async function load(coll: string) {
    setLoading(true);
    const q = coll === "all" ? "" : `?collection=${encodeURIComponent(coll)}`;
    const data = await fetch(`/api/admin/gallery${q}`).then((r) => r.json());
    setImages(data.images || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCollections();
  }, []);
  useEffect(() => {
    load(filter);
  }, [filter]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const list = Array.from(files);

    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const dataUri = await fileToDataUri(list[i]);
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUri, title, category, collection: uploadCollection, featured }),
        });
        const data = await res.json();
        if (res.ok && data.image && (filter === "all" || filter === uploadCollection)) {
          setImages((prev) => [data.image, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);
    setProgress("");
    setTitle("");
    if (fileInput.current) fileInput.current.value = "";
    loadCollections();
  }

  async function updateImage(id: string, patch: Partial<GalleryItem>) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setImages((prev) => prev.map((img) => (img._id === id ? { ...img, ...patch } : img)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this image? This removes it from Cloudinary too.")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img._id !== id));
  }

  const SELECT =
    "w-full bg-charcoal-2 border border-border rounded-lg px-4 py-2.5 text-sm mt-2 focus:outline-none focus:border-gold";

  return (
    <div>
      <h1 className="font-serif text-3xl">Gallery</h1>
      <p className="text-muted mt-2 text-sm">
        Upload portfolio images and organize them into collections. Stored on Cloudinary.
      </p>

      {/* Upload panel */}
      <div className="card rounded-xl p-6 mt-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Collection</span>
            <select value={uploadCollection} onChange={(e) => setUploadCollection(e.target.value)} className={SELECT}>
              <option value="studio-portfolio">Studio Portfolio</option>
              {collections
                .filter((c) => c.slug !== "studio-portfolio")
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={SELECT}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Title (optional)</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={SELECT} placeholder="Applied to uploads" />
          </label>
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm text-foreground/80">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Mark uploads as featured (shown on home page)
        </label>

        <div className="mt-5">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-[#1a1408] hover:file:brightness-110 disabled:opacity-60"
          />
          {progress && <p className="text-gold text-sm mt-3">{progress}</p>}
        </div>
      </div>

      {/* Collection filter */}
      <div className="flex flex-wrap gap-2 mt-8">
        <FilterChip label="All" value="all" filter={filter} setFilter={setFilter} />
        <FilterChip label="Studio Portfolio" value="studio-portfolio" filter={filter} setFilter={setFilter} />
        {collections
          .filter((c) => c.slug !== "studio-portfolio")
          .map((c) => (
            <FilterChip key={c.slug} label={`${c.title} (${c.count})`} value={c.slug} filter={filter} setFilter={setFilter} />
          ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-muted mt-8">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-muted mt-8">No images in this collection.</p>
      ) : (
        <>
          <p className="text-xs text-muted mt-6">{images.length} images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {images.map((img) => (
              <div key={img._id} className="card rounded-xl overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={img.url} alt={img.title || ""} fill sizes="200px" className="object-cover" />
                  {img.featured && (
                    <span className="absolute top-2 left-2 text-[10px] bg-gold text-[#1a1408] px-2 py-0.5 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <select
                    value={img.collection || "studio-portfolio"}
                    onChange={(e) => updateImage(img._id, { collection: e.target.value })}
                    className="w-full bg-charcoal-2 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="studio-portfolio">Studio Portfolio</option>
                    {collections
                      .filter((c) => c.slug !== "studio-portfolio")
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.title}
                        </option>
                      ))}
                  </select>
                  <select
                    value={img.category}
                    onChange={(e) => updateImage(img._id, { category: e.target.value })}
                    className="w-full bg-charcoal-2 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1 text-foreground/70">
                      <input
                        type="checkbox"
                        checked={Boolean(img.featured)}
                        onChange={(e) => updateImage(img._id, { featured: e.target.checked })}
                      />
                      Featured
                    </label>
                    <button onClick={() => remove(img._id)} className="text-red-400/80 hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  label,
  value,
  filter,
  setFilter,
}: {
  label: string;
  value: string;
  filter: string;
  setFilter: (v: string) => void;
}) {
  return (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        filter === value
          ? "bg-gold text-[#1a1408] border-gold"
          : "border-border text-foreground/70 hover:border-gold"
      }`}
    >
      {label}
    </button>
  );
}
