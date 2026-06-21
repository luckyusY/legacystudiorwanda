import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import {
  INDOOR_PACKAGES,
  OUTDOOR_PACKAGES,
  WEDDING_PACKAGES,
  EXPRESS_NOTICE,
  type PackageGroup,
  type PackageTier,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Indoor, outdoor and wedding photography packages from Legacy Studio Kigali. Transparent pricing for every occasion.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages & Pricing"
        title="Transparent pricing for every occasion"
        subtitle="Prices are in Rwandan Francs (RWF). k = thousand, M = million. Need something custom? Just ask."
      />

      {/* INDOOR */}
      <section className="container-x py-20">
        <SectionHeading eyebrow="Studio" title="Indoor Packages" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {INDOOR_PACKAGES.map((g) => (
            <GroupCard key={g.category} group={g} />
          ))}
        </div>
      </section>

      {/* OUTDOOR */}
      <section className="bg-charcoal border-y border-border py-20">
        <div className="container-x">
          <SectionHeading eyebrow="On location" title="Outdoor Packages" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {OUTDOOR_PACKAGES.map((g) => (
              <GroupCard key={g.category} group={g} />
            ))}
          </div>
        </div>
      </section>

      {/* WEDDING */}
      <section className="container-x py-20">
        <SectionHeading
          eyebrow="The big day"
          title="Wedding Packages"
          subtitle="Comprehensive coverage from civil ceremonies to full traditional, church and reception weddings."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {WEDDING_PACKAGES.map((t) => (
            <WeddingCard key={t.name} tier={t} />
          ))}
        </div>
      </section>

      {/* EXPRESS NOTICE */}
      <section className="container-x pb-16">
        <div className="rounded-xl border border-gold/30 bg-charcoal-2 p-6">
          <h3 className="font-serif text-lg text-gold-soft">A note on express work</h3>
          <p className="text-sm text-muted mt-3 leading-relaxed">{EXPRESS_NOTICE}</p>
        </div>
      </section>

      <section className="container-x pb-24 text-center">
        <Link href="/booking" className="btn-gold rounded-full px-8 py-3.5 inline-block">
          Book your package
        </Link>
      </section>
    </>
  );
}

function GroupCard({ group }: { group: PackageGroup }) {
  return (
    <div className="card rounded-xl p-6 flex flex-col">
      <h3 className="font-serif text-xl text-gold-soft">{group.category}</h3>
      {group.tiers.map((t) => (
        <div key={t.name} className="mt-4">
          {t.price && <p className="text-gold text-sm font-semibold">{t.price}</p>}
          <ul className="space-y-2 mt-2">
            {t.lines.map((line) => (
              <li key={line} className="text-sm text-foreground/80 leading-snug">
                {line}
              </li>
            ))}
          </ul>
          {t.bonus && <p className="text-xs text-muted mt-3 italic">{t.bonus}</p>}
        </div>
      ))}
    </div>
  );
}

function WeddingCard({ tier }: { tier: PackageTier }) {
  return (
    <div className="card rounded-xl p-7 flex flex-col">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-xl">{tier.name}</h3>
        <span className="text-gold font-serif text-lg">{tier.price}</span>
      </div>
      <div className="h-px bg-border my-4" />
      <ul className="space-y-2.5 flex-1">
        {tier.lines.map((line) => (
          <li key={line} className="text-sm text-foreground/80 flex gap-2 leading-snug">
            <span className="text-gold mt-0.5">·</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/booking?package=${encodeURIComponent(tier.name + " Wedding")}`}
        className="btn-outline rounded-full px-5 py-2.5 text-sm text-center mt-6"
      >
        Choose {tier.name}
      </Link>
    </div>
  );
}
