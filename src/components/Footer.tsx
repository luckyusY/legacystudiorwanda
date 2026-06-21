import Link from "next/link";
import { COMPANY } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border mt-24">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-serif text-2xl text-gradient-gold">{COMPANY.name}</span>
          <p className="text-muted text-sm mt-4 max-w-sm leading-relaxed">
            {COMPANY.tagline} A creative photography and media production company based in Kigali,
            Rwanda.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-foreground/75">
            <li><Link href="/services" className="hover:text-gold">Services</Link></li>
            <li><Link href="/packages" className="hover:text-gold">Packages</Link></li>
            <li><Link href="/portfolio" className="hover:text-gold">Portfolio</Link></li>
            <li><Link href="/booking" className="hover:text-gold">Book a Session</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm text-foreground/75">
            <li>{COMPANY.location}</li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">{COMPANY.email}</a>
            </li>
            <li>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {COMPANY.phone}
              </a>
            </li>
            <li>{COMPANY.website}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-gold">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
