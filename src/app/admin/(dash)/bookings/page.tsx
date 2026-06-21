"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  packageName?: string;
  eventDate?: string;
  location?: string;
  message?: string;
  status: string;
  createdAt: string;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/admin/bookings").then((r) => r.json());
    setBookings(data.bookings || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBookings((prev) => prev.filter((b) => b._id !== id));
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <h1 className="font-serif text-3xl">Bookings</h1>
      <div className="flex flex-wrap gap-2 mt-6">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm border capitalize transition-colors ${
              filter === s ? "bg-gold text-[#1a1408] border-gold" : "border-border text-foreground/70 hover:border-gold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted mt-8">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted mt-8">No bookings found.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((b) => (
            <div key={b._id} className="card rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif text-lg">{b.name}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {b.service}
                    {b.packageName ? ` · ${b.packageName}` : ""}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {new Date(b.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setOpenId(openId === b._id ? null : b._id)}
                  className="text-sm text-gold shrink-0"
                >
                  {openId === b._id ? "Hide" : "Details"}
                </button>
              </div>

              {openId === b._id && (
                <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-3 text-sm">
                  <Detail label="Email" value={<a href={`mailto:${b.email}`} className="text-gold">{b.email}</a>} />
                  <Detail label="Phone" value={<a href={`tel:${b.phone}`} className="text-gold">{b.phone}</a>} />
                  <Detail label="Event date" value={b.eventDate ? new Date(b.eventDate).toLocaleDateString() : "—"} />
                  <Detail label="Location" value={b.location || "—"} />
                  {b.message && <Detail label="Message" value={b.message} full />}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b._id, e.target.value)}
                  className="bg-charcoal-2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(b._id)}
                  className="text-sm text-red-400/80 hover:text-red-400 px-3 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      <p className="text-foreground/85 mt-1">{value}</p>
    </div>
  );
}
