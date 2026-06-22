import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Curated photography collections by Legacy Studio, Kigali — weddings, events, portraits and more.",
};

export const dynamic = "force-dynamic";

interface CollectionCard {
  title: string;
  slug: string;
  category: string;
  coverUrl: string;
  count: number;
}

async function getCollections(): Promise<CollectionCard[]> {
  await connectDB();
  const collections = await Collection.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const counts = await GalleryImage.aggregate([
    { $group: { _id: "$collection", count: { $sum: 1 } } },
  ]);
  const countMap = new Map<string, number>(counts.map((c) => [c._id, c.count]));

  const cards = await Promise.all(
    collections.map(async (c) => {
      let coverUrl = c.coverUrl as string;
      if (!coverUrl) {
        const img = await GalleryImage.findOne({ collection: c.slug })
          .sort({ featured: -1, order: 1 })
          .lean();
        coverUrl = img?.url || "";
      }
      return {
        title: c.title as string,
        slug: c.slug as string,
        category: c.category as string,
        coverUrl,
        count: countMap.get(c.slug as string) || 0,
      };
    })
  );

  return cards.filter((c) => c.count > 0);
}

export default async function PortfolioPage() {
  const collections = await getCollections();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Galleries of moments worth keeping"
        subtitle="Explore our work organized into collections — each one a story we had the honor of telling."
      />

      <section className="container-x py-16">
        {collections.length === 0 ? (
          <p className="text-center text-muted py-20">Collections coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/portfolio/${c.slug}`}
                className="group block rounded-2xl overflow-hidden card p-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {c.coverUrl ? (
                    <Image
                      src={c.coverUrl}
                      alt={c.title}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-charcoal-2" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-gold/90 text-[#1a1408] px-2.5 py-1 rounded-full font-semibold">
                    {c.category}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-xl text-foreground">{c.title}</h3>
                    <p className="text-xs text-gold-soft mt-1">
                      {c.count} photo{c.count === 1 ? "" : "s"} · View gallery →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
