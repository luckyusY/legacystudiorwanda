"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { COMPANY } from "@/lib/content";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-charcoal/95 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between h-18 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl tracking-wide text-gradient-gold">
            {COMPANY.name}
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-muted mt-1">
            Photography · Media
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-colors hover:text-gold ${
                  active ? "text-gold" : "text-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/booking" className="btn-gold rounded-full px-5 py-2 text-sm">
            Book a Session
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-charcoal border-t border-border">
          <div className="container-x py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`py-2 text-sm ${pathname === l.href ? "text-gold" : "text-foreground/80"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/booking" className="btn-gold rounded-full px-5 py-2.5 text-sm text-center mt-2">
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
