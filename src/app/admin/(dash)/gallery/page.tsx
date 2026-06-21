"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY_CATEGORIES } from "@/lib/content";

interface GalleryItem {
  _id: string;
  url: string;
  title?: string;
  category?: string;
  featured?: boolean;
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
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [featured, setFeatured] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/admin/gallery").then((r) => r.json());
    setImages(data.images || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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
          body: JSON.stringify({ dataUri, title, category, featured }),
        });
        const data = await res.json();
        if (res.ok && data.image) {
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

  return (
    <div>
      <h1 className="font-serif text-3xl">Gallery</h1>
      <p className="text-muted mt-2 text-sm">
        Upload portfolio images. They are stored on Cloudinary and shown on the public site.
      </p>

      {/* Upload panel */}
      <div className="card rounded-xl p-6 mt-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-charcoal-2 border border-border rounded-lg px-4 py-2.5 text-sm mt-2 focus:outline-none focus:border-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted">Title (optional)</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-charcoal-2 border border-border rounded-lg px-4 py-2.5 text-sm mt-2 focus:outline-none focus:border-gold"
              placeholder="Applied to uploads below"
            />
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

      {/* Grid */}
      {loading ? (
        <p className="text-muted mt-8">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-muted mt-8">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
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
                  value={img.category}
                  onChange={(e) => updateImage(img._id, { category: e.target.value })}
                  className="w-full bg-charcoal-2 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
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
      )}
    </div>
  );
}
