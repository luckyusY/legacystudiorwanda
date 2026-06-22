import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import FeaturedGallery from "@/components/FeaturedGallery";
import { ABOUT, SERVICES, WHY_US, PROCESS, COMPANY } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 25% 20%, rgba(201,162,75,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(201,162,75,0.10), transparent 40%), #0b0b0d",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-x fade-up">
          <span className="eyebrow">Photography &amp; Film · Kigali, Rwanda</span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[5.5rem] mt-6 leading-[0.98] max-w-4xl">
            Where moments become <span className="text-gradient-gold italic">heirlooms</span>.
          </h1>
          <p className="text-lg text-foreground/75 mt-7 max-w-xl leading-relaxed">
            We photograph weddings, milestones and brands across Rwanda — for the quiet,
            in-between feeling that makes an image worth returning to.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/booking" className="btn-gold rounded-full px-8 py-3.5">
              Start a Booking
            </Link>
            <Link href="/portfolio" className="btn-outline rounded-full px-8 py-3.5">
              See the Work
            </Link>
          </div>

          <div className="flex flex-wrap gap-10 mt-16 text-sm">
            <Stat value="1000+" label="Frames Delivered" />
            <Stat value="8" label="Ways We Shoot" />
            <Stat value="Kigali" label="Based in Rwanda" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-x py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeading eyebrow="About the Studio" title="The moments that shape a life, kept beautifully." />
            <p className="text-foreground/75 mt-6 leading-relaxed">{ABOUT.intro}</p>
            <p className="text-muted mt-4 leading-relaxed">{ABOUT.body}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ABOUT.values.map((v) => (
              <div key={v.title} className="card rounded-xl p-6">
                <h3 className="font-serif text-lg text-gold-soft">{v.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-12">
        <SectionHeading
          center
          eyebrow="What We Do"
          title="Ways we tell your story"
          subtitle="From weddings and portraits to brands and products — one studio, an eye for every occasion."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {SERVICES.map((s) => (
            <div key={s.slug} className="card rounded-xl p-6 h-full">
              <h3 className="font-serif text-lg">{s.title}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="btn-outline rounded-full px-7 py-3 inline-block">
            Explore all services
          </Link>
        </div>
      </section>

      {/* FEATURED PORTFOLIO */}
      <section className="container-x py-24">
        <SectionHeading center eyebrow="Selected Work" title="A look through the lens" />
        <div className="mt-12">
          <FeaturedGallery />
        </div>
        <div className="text-center mt-10">
          <Link href="/portfolio" className="btn-gold rounded-full px-7 py-3 inline-block">
            Browse the galleries
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-charcoal border-y border-border py-24">
        <div className="container-x">
          <SectionHeading center eyebrow="How We Work" title="From hello to gallery" />
          <div className="grid md:grid-cols-5 gap-6 mt-14">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold font-serif text-lg">
                  {i + 1}
                </div>
                <h3 className="font-serif text-base mt-4">{p.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-x py-24">
        <SectionHeading center eyebrow="Why Legacy" title="Why families and brands keep coming back" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {WHY_US.map((w) => (
            <div key={w.title} className="card rounded-xl p-6">
              <h3 className="font-serif text-lg text-gold-soft">{w.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-charcoal to-charcoal-2 p-12 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl">Let&apos;s make something worth keeping.</h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            Tell us about the day you have in mind. We&apos;ll bring the eye, the calm and the craft —
            and hand you images you&apos;ll still love in twenty years.
          </p>
          <Link href="/booking" className="btn-gold rounded-full px-8 py-3.5 inline-block mt-8">
            Start a booking
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl text-gradient-gold">{value}</div>
      <div className="text-muted uppercase tracking-widest text-[11px] mt-1">{label}</div>
    </div>
  );
}
