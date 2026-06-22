import type { Metadata } from "next";
import SmoothScroll from "@/components/portfolio/SmoothScroll";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";

export const metadata: Metadata = {
  title: {
    default: "Legacy Studio — Photography Galleries, Kigali",
    template: "%s | Legacy Studio",
  },
  description:
    "Selected photography galleries by Legacy Studio, Kigali — weddings, events, brands and portraits.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PortfolioHeader />
      <main>{children}</main>
    </SmoothScroll>
  );
}
