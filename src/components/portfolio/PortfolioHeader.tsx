"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Gallery {
  slug: string;
  title: string;
}

export default function PortfolioHeader() {
  const pathname = usePathname();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setGalleries((d.collections || []).map((c: Gallery) => ({ slug: c.slug, title: c.title }))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[80] transition-colors duration-500 ${
        solid || open ? "bg-charcoal/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide text-gradient-gold">
          Legacy Studio
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {galleries.map((g) => {
            const active = pathname === `/${g.slug}`;
            return (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className={`text-sm transition-colors hover:text-gold ${active ? "text-gold" : "text-foreground/75"}`}
              >
                {g.title}
              </Link>
            );
          })}
        </nav>

        <button
          aria-label="Menu"
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-charcoal border-t border-border">
          <div className="px-5 py-4 flex flex-col gap-1">
            {galleries.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className={`py-2.5 text-sm ${pathname === `/${g.slug}` ? "text-gold" : "text-foreground/80"}`}
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
