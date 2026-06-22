"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
];

export default function PortfolioHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[80] transition-colors duration-500 ${
        solid ? "bg-charcoal/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide text-gradient-gold">
          Legacy Studio
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-foreground/75 hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/booking" className="btn-gold rounded-full px-5 py-2 text-sm">
            Book
          </Link>
        </nav>
        <Link href="/booking" className="md:hidden btn-gold rounded-full px-4 py-1.5 text-sm">
          Book
        </Link>
      </div>
    </header>
  );
}
