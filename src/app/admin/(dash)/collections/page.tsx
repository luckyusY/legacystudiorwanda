"use client";

import { useEffect, useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/content";

interface Collection {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description?: string;
  coverUrl?: string;
  order: number;
  published: boolean;
  count: number;
}

const CATEGORIES = GALLERY_CATEGORIES.filter((c) => c !== "All");
const INPUT =
  "w-full bg-charcoal-2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold";

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/admin/collections").then((r) => r.json());
    setCollections(data.collections || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!title.trim()) return;
    setCreating(true);
    await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category }),
    });
    setTitle("");
    setCreating(false);
    load();
  }

  async function update(id: string, patch: Partial<Collection>) {
    await fetch(`/api/admin/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setCollections((prev) => prev.map((c) => (c._id === id ? { ...c, ...patch } : c)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this collection? (Images keep their tag and can be reassigned.)")) return;
    await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    setCollections((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Collections</h1>
      <p className="text-muted mt-2 text-sm">
        Group gallery photos into albums shown on the public portfolio.
      </p>

      {/* Create */}
      <div className="card rounded-xl p-5 mt-6 flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-[200px]">
          <span className="text-xs uppercase tracking-widest text-muted">New collection title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={`${INPUT} mt-2`} placeholder="e.g. Mugisha Wedding" />
        </label>
        <label>
          <span className="text-xs uppercase tracking-widest text-muted">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${INPUT} mt-2`}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button onClick={create} disabled={creating} className="btn-gold rounded-lg px-6 py-2.5 text-sm disabled:opacity-60">
          {creating ? "Creating…" : "Create"}
        </button>
      </div>

      {loading ? (
        <p className="text-muted mt-8">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {collections.map((c) => (
            <div key={c._id} className="card rounded-xl p-5 flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal-2 shrink-0">
                {c.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.coverUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-[180px]">
                <input
                  defaultValue={c.title}
                  onBlur={(e) => e.target.value !== c.title && update(c._id, { title: e.target.value })}
                  className={INPUT}
                />
                <p className="text-xs text-muted mt-1">/{c.slug} · {c.count} photos</p>
              </div>
              <select
                defaultValue={c.category}
                onChange={(e) => update(c._id, { category: e.target.value })}
                className={`${INPUT} w-auto`}
              >
                {CATEGORIES.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-foreground/70">
                <span className="text-xs uppercase tracking-widest text-muted">Order</span>
                <input
                  type="number"
                  defaultValue={c.order}
                  onBlur={(e) => Number(e.target.value) !== c.order && update(c._id, { order: Number(e.target.value) })}
                  className={`${INPUT} w-20`}
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground/70">
                <input
                  type="checkbox"
                  checked={c.published}
                  onChange={(e) => update(c._id, { published: e.target.checked })}
                />
                Published
              </label>
              <button onClick={() => remove(c._id)} className="text-sm text-red-400/80 hover:text-red-400">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
