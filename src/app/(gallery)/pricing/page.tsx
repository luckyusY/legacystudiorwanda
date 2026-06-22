import type { Metadata } from "next";
import {
  INDOOR_PACKAGES,
  OUTDOOR_PACKAGES,
  WEDDING_PACKAGES,
  EXPRESS_NOTICE,
  COMPANY,
  type PackageGroup,
  type PackageTier,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Studio, on-location and wedding photography packages by Legacy Studio, Kigali.",
};

// "10 Photos — 60k" -> { label: "10 Photos", price: "60k" }
function splitLine(line: string): { label: string; price?: string } {
  const parts = line.split("—");
  if (parts.length >= 2) return { label: parts[0].trim(), price: parts.slice(1).join("—").trim() };
  return { label: line.trim() };
}

const FEATURED_WEDDING = "Premium";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-28">
      {/* Header */}
      <header className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <span className="eyebrow">Investment</span>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl mt-4 leading-[0.92]">
          Packages &amp; Pricing
        </h1>
        <p className="font-sans text-muted mt-6 max-w-xl leading-relaxed">
          Transparent rates for every kind of session. Prices are in Rwandan Francs —
          <span className="text-foreground/80"> k</span> = thousand,
          <span className="text-foreground/80"> M</span> = million. Need something bespoke? Just ask.
        </p>
      </header>

      {/* Studio (indoor) */}
      <Section eyebrow="In the Studio" title="Studio Sessions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDOOR_PACKAGES.map((g) => (
            <TierCard key={g.category} group={g} />
          ))}
        </div>
      </Section>

      {/* On location (outdoor) */}
      <Section eyebrow="On Location" title="Events &amp; Celebrations">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OUTDOOR_PACKAGES.map((g) => (
            <TierCard key={g.category} group={g} />
          ))}
        </div>
      </Section>

      {/* Weddings */}
      <Section eyebrow="The Big Day" title="Wedding Collections">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WEDDING_PACKAGES.map((t) => (
            <WeddingCard key={t.name} tier={t} featured={t.name === FEATURED_WEDDING} />
          ))}
        </div>
      </Section>

      {/* Express notice */}
      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mt-16">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal to-charcoal-2 p-7 sm:p-9">
          <span className="eyebrow">Good to know</span>
          <p className="font-sans text-sm sm:text-base text-foreground/75 mt-4 leading-relaxed max-w-3xl">
            {EXPRESS_NOTICE}
          </p>
        </div>
      </section>

      {/* Enquire */}
      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mt-16 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl">Ready to reserve your date?</h2>
        <p className="text-muted mt-3">Tell us what you have in mind and we&apos;ll tailor a package to it.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
          <a href={`mailto:${COMPANY.email}`} className="btn-gold rounded-full px-8 py-3.5">
            Enquire by email
          </a>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-outline rounded-full px-8 py-3.5">
            {COMPANY.phone}
          </a>
        </div>
      </section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mt-20 sm:mt-28">
      <div className="flex items-end gap-5 mb-9">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="font-serif text-3xl sm:text-5xl mt-2" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <div className="flex-1 h-px bg-border mb-3" />
      </div>
      {children}
    </section>
  );
}

/* Indoor/Outdoor card (price-per-line) */
function TierCard({ group }: { group: PackageGroup }) {
  const tier = group.tiers[0];
  return (
    <div className="group rounded-2xl border border-border bg-charcoal p-6 flex flex-col transition-colors duration-300 hover:border-gold/50">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-xl text-foreground">{group.category}</h3>
        {tier.price && <span className="font-sans text-sm text-gold font-semibold">{tier.price}</span>}
      </div>
      <div className="h-px bg-border my-5 group-hover:bg-gold/30 transition-colors" />
      <ul className="space-y-3 flex-1">
        {tier.lines.map((line) => {
          const { label, price } = splitLine(line);
          return (
            <li key={line} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-foreground/80">{label}</span>
              {price ? (
                <span className="font-semibold text-gold-soft tabular-nums whitespace-nowrap">{price}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {tier.bonus && (
        <p className="text-xs text-muted mt-5 pt-4 border-t border-border italic leading-relaxed">
          {tier.bonus}
        </p>
      )}
    </div>
  );
}

/* Wedding card (single headline price + features) */
function WeddingCard({ tier, featured }: { tier: PackageTier; featured: boolean }) {
  return (
    <div
      className={`relative rounded-2xl p-7 flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "border-2 border-gold bg-gradient-to-b from-charcoal-2 to-charcoal shadow-[0_0_50px_-12px_rgba(201,162,75,0.35)]"
          : "border border-border bg-charcoal"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-7 bg-gold text-[#1a1408] text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="font-serif text-2xl">{tier.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-serif text-5xl text-gradient-gold">{tier.price}</span>
        <span className="text-xs text-muted ml-1">RWF</span>
      </div>
      <div className="h-px bg-border my-6" />
      <ul className="space-y-3 flex-1">
        {tier.lines.map((line) => (
          <li key={line} className="flex gap-3 text-sm leading-snug">
            <span className="text-gold mt-1.5 shrink-0 w-1 h-1 rounded-full bg-gold" />
            <span className="text-foreground/80">{line}</span>
          </li>
        ))}
      </ul>
      <a
        href="mailto:info@mylegacystudio.com"
        className={`mt-7 rounded-full px-6 py-3 text-sm text-center transition ${
          featured ? "btn-gold" : "btn-outline"
        }`}
      >
        Book {tier.name}
      </a>
    </div>
  );
}
