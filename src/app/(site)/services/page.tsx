import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import { SERVICES, PROCESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Portrait, wedding, event, maternity, kids, artistic, commercial and product photography & video in Kigali, Rwanda.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Visual storytelling for every moment"
        subtitle="Every service emphasizes visual storytelling, ensuring that the final images and videos reflect the essence of each moment and project."
      />

      <section className="container-x py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <div key={s.slug} className="card rounded-xl p-7">
              <span className="font-serif text-gold/60 text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-xl mt-2">{s.title}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal border-y border-border py-20">
        <div className="container-x">
          <SectionHeading center eyebrow="Our process" title="From consultation to delivery" />
          <div className="grid md:grid-cols-5 gap-6 mt-14">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold font-serif">
                  {i + 1}
                </div>
                <h3 className="font-serif text-base mt-4">{p.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="font-serif text-3xl">Ready to tell your story?</h2>
        <p className="text-muted mt-4 max-w-lg mx-auto">
          Browse our packages or book a session — we&apos;ll handle the rest.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/packages" className="btn-outline rounded-full px-7 py-3">View packages</Link>
          <Link href="/booking" className="btn-gold rounded-full px-7 py-3">Book a session</Link>
        </div>
      </section>
    </>
  );
}
