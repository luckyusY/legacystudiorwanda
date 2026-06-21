import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";
import { COMPANY, PROCESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book your photography or video session with Legacy Studio, Kigali.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Session"
        title="Let's plan your shoot"
        subtitle="Fill in the details below and our team will get back to you to confirm your session."
      />

      <section className="container-x py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="card rounded-2xl p-9 text-muted">Loading form…</div>}>
              <BookingForm />
            </Suspense>
          </div>

          <aside className="space-y-8">
            <div className="card rounded-xl p-6">
              <h3 className="font-serif text-lg text-gold-soft">What happens next</h3>
              <ol className="mt-4 space-y-3">
                {PROCESS.map((p, i) => (
                  <li key={p.title} className="flex gap-3 text-sm">
                    <span className="text-gold font-serif">{i + 1}.</span>
                    <span className="text-foreground/80">{p.title}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card rounded-xl p-6">
              <h3 className="font-serif text-lg text-gold-soft">Prefer to talk?</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li>{COMPANY.location}</li>
                <li>
                  <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                    {COMPANY.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                    {COMPANY.email}
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
