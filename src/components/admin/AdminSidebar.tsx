"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/contacts", label: "Messages" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between border-b border-border px-4 h-14">
        <span className="font-serif text-lg text-gradient-gold">Legacy Admin</span>
        <button onClick={() => setOpen((v) => !v)} className="text-sm text-gold">
          Menu
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } lg:block lg:sticky lg:top-0 lg:h-screen w-full lg:w-64 shrink-0 border-r border-border bg-charcoal`}
      >
        <div className="p-6 hidden lg:block">
          <span className="font-serif text-xl text-gradient-gold">Legacy Studio</span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mt-1">Admin Panel</p>
        </div>

        <nav className="px-3 py-2 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold/15 text-gold border border-gold/40"
                    : "text-foreground/75 hover:bg-charcoal-2 hover:text-gold"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-4 pt-4 border-t border-border">
          <Link href="/" className="block rounded-lg px-4 py-2.5 text-sm text-foreground/60 hover:text-gold">
            ← View site
          </Link>
          <button
            onClick={logout}
            className="w-full text-left rounded-lg px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400"
          >
            Sign out
          </button>
          <p className="px-4 py-3 text-xs text-muted">Signed in as {name}</p>
        </div>
      </aside>
    </>
  );
}
