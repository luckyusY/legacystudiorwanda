import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PortfolioGallery from "@/components/PortfolioGallery";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A selection of photography and media work by Legacy Studio, Kigali.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="A gallery of moments worth keeping"
        subtitle="Browse a selection of our work across weddings, portraits, events and more."
      />
      <section className="container-x py-16">
        <PortfolioGallery />
      </section>
    </>
  );
}
