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

const FEATURED_WEDDING = "Premium";

const PACKAGE_IMAGES = {
  studio: {
    src: "/pricing/studio-portrait.jpg",
    alt: "Legacy Studio portrait session",
    position: "center 18%",
  },
  event: {
    src: "/pricing/events.jpg",
    alt: "Legacy Studio event photography",
    position: "center 42%",
  },
  wedding: {
    src: "/pricing/wedding.jpg",
    alt: "Legacy Studio wedding photography",
    position: "center 28%",
  },
  weddingPremium: {
    src: "/pricing/wedding-premium.jpg",
    alt: "Legacy Studio premium wedding photography",
    position: "center 34%",
  },
} as const;

function cleanText(text: string): string {
  return text.replace(/â€”/g, "—").replace(/Â·/g, "·").replace(/Ã—/g, "×");
}

function splitLine(line: string): { label: string; price?: string } {
  const normalized = cleanText(line);
  const parts = normalized.split("—");

  if (parts.length >= 2) {
    return { label: parts[0].trim(), price: parts.slice(1).join("—").trim() };
  }

  return { label: normalized.trim() };
}

function packageImageFor(category: string) {
  const indoorCategories = ["Gold", "Platinum", "Arts Photoshoot", "Creative Photos"];
  return indoorCategories.includes(category) ? PACKAGE_IMAGES.studio : PACKAGE_IMAGES.event;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-28">
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

      <Section eyebrow="In the Studio" title="Studio Sessions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDOOR_PACKAGES.map((g) => (
            <TierCard key={g.category} group={g} />
          ))}
        </div>
      </Section>

      <Section eyebrow="On Location" title="Events &amp; Celebrations">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OUTDOOR_PACKAGES.map((g) => (
            <TierCard key={g.category} group={g} />
          ))}
        </div>
      </Section>

      <Section eyebrow="The Big Day" title="Wedding Collections">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WEDDING_PACKAGES.map((t) => (
            <WeddingCard key={t.name} tier={t} featured={t.name === FEATURED_WEDDING} />
          ))}
        </div>
      </Section>

      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mt-16">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal to-charcoal-2 p-7 sm:p-9">
          <span className="eyebrow">Good to know</span>
          <p className="font-sans text-sm sm:text-base text-foreground/75 mt-4 leading-relaxed max-w-3xl">
            {cleanText(EXPRESS_NOTICE)}
          </p>
        </div>
      </section>

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

function TierCard({ group }: { group: PackageGroup }) {
  const tier = group.tiers[0];
  const image = packageImageFor(group.category);

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-charcoal flex flex-col transition-colors duration-300 hover:border-gold/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: image.position }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-serif text-2xl text-foreground leading-none">{group.category}</h3>
            {tier.price && (
              <span className="rounded-full bg-gold px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1408]">
                {cleanText(tier.price)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-1 flex-col">
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
            {cleanText(tier.bonus)}
          </p>
        )}
      </div>
    </div>
  );
}

function WeddingCard({ tier, featured }: { tier: PackageTier; featured: boolean }) {
  const image = featured ? PACKAGE_IMAGES.weddingPremium : PACKAGE_IMAGES.wedding;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "border-2 border-gold bg-gradient-to-b from-charcoal-2 to-charcoal shadow-[0_0_50px_-12px_rgba(201,162,75,0.35)]"
          : "border border-border bg-charcoal"
      }`}
    >
      {featured && (
        <span className="absolute top-4 left-5 z-20 bg-gold text-[#1a1408] text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <div className="relative aspect-[5/4] overflow-hidden bg-charcoal-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: image.position }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-serif text-3xl leading-none">{tier.name}</h3>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-serif text-5xl text-gradient-gold">{cleanText(tier.price || "")}</span>
            <span className="text-xs text-foreground/70 ml-1">RWF</span>
          </div>
        </div>
      </div>
      <div className="p-7 flex flex-1 flex-col">
        <ul className="space-y-3 flex-1">
          {tier.lines.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-snug">
              <span className="text-gold mt-1.5 shrink-0 w-1 h-1 rounded-full bg-gold" />
              <span className="text-foreground/80">{cleanText(line)}</span>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${COMPANY.email}`}
          className={`mt-7 rounded-full px-6 py-3 text-sm text-center transition ${
            featured ? "btn-gold" : "btn-outline"
          }`}
        >
          Book {tier.name}
        </a>
      </div>
    </div>
  );
}
