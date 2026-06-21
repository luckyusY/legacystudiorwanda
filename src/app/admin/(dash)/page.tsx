"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

interface Stats {
  bookings: number;
  pending: number;
  messages: number;
  unread: number;
  images: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<
    { _id: string; name: string; service: string; status: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      const [b, c, g] = await Promise.all([
        fetch("/api/admin/bookings").then((r) => r.json()),
        fetch("/api/admin/contacts").then((r) => r.json()),
        fetch("/api/admin/gallery").then((r) => r.json()),
      ]);
      const bookings = b.bookings || [];
      const messages = c.messages || [];
      setStats({
        bookings: bookings.length,
        pending: bookings.filter((x: { status: string }) => x.status === "pending").length,
        messages: messages.length,
        unread: messages.filter((x: { read: boolean }) => !x.read).length,
        images: (g.images || []).length,
      });
      setRecent(bookings.slice(0, 5));
    }
    load().catch(() => setStats({ bookings: 0, pending: 0, messages: 0, unread: 0, images: 0 }));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="text-muted mt-2 text-sm">Welcome back. Here&apos;s what&apos;s happening.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard label="Total Bookings" value={stats?.bookings} hint={`${stats?.pending ?? 0} pending`} href="/admin/bookings" />
        <StatCard label="Messages" value={stats?.messages} hint={`${stats?.unread ?? 0} unread`} href="/admin/contacts" />
        <StatCard label="Gallery Images" value={stats?.images} hint="manage portfolio" href="/admin/gallery" />
        <StatCard label="Pending Bookings" value={stats?.pending} hint="needs attention" href="/admin/bookings" />
      </div>

      <div className="card rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-gold hover:underline">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {recent.length === 0 && <p className="text-muted text-sm py-4">No bookings yet.</p>}
          {recent.map((b) => (
            <div key={b._id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="text-foreground">{b.name}</p>
                <p className="text-muted text-xs">{b.service}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, href }: { label: string; value?: number; hint: string; href: string }) {
  return (
    <Link href={href} className="card rounded-xl p-6 block">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="font-serif text-4xl text-gradient-gold mt-3">{value ?? "—"}</p>
      <p className="text-xs text-muted mt-2">{hint}</p>
    </Link>
  );
}
