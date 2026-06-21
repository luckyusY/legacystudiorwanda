import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { COMPANY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Legacy Studio — ${COMPANY.location}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        subtitle="Questions, ideas or ready to book? Reach out and our team will respond promptly."
      />

      <section className="container-x py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <InfoCard title="Studio">
              {COMPANY.location}
            </InfoCard>
            <InfoCard title="Phone">
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {COMPANY.phone}
              </a>
            </InfoCard>
            <InfoCard title="Email">
              <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                {COMPANY.email}
              </a>
            </InfoCard>
            <InfoCard title="Website">{COMPANY.website}</InfoCard>
          </aside>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="rounded-2xl overflow-hidden border border-border h-80">
          <iframe
            title="Legacy Studio location"
            src="https://www.google.com/maps?q=Kacyiru,Kigali,Rwanda&output=embed"
            className="w-full h-full"
            loading="lazy"
            style={{ filter: "grayscale(0.4) invert(0.9) contrast(0.9)" }}
          />
        </div>
      </section>
    </>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card rounded-xl p-6">
      <h3 className="text-xs uppercase tracking-widest text-gold">{title}</h3>
      <p className="text-foreground/85 mt-2 text-sm">{children}</p>
    </div>
  );
}
