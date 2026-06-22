import type { Metadata } from "next";
import SmoothScroll from "@/components/portfolio/SmoothScroll";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "An immersive gallery of photography by Legacy Studio, Kigali — weddings, events and portraits.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PortfolioHeader />
      <main>{children}</main>
    </SmoothScroll>
  );
}
