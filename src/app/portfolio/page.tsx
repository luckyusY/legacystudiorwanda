import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";
import IndexList, { type GalleryEntry } from "@/components/portfolio/IndexList";

export const dynamic = "force-dynamic";

async function getEntries(): Promise<GalleryEntry[]> {
  await connectDB();
  const collections = await Collection.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const counts = await GalleryImage.aggregate([
    { $group: { _id: "$collection", count: { $sum: 1 } } },
  ]);
  const countMap = new Map<string, number>(counts.map((c) => [c._id, c.count]));

  const entries = await Promise.all(
    collections.map(async (c) => {
      let coverUrl = c.coverUrl as string;
      if (!coverUrl) {
        const img = await GalleryImage.findOne({ collection: c.slug })
          .sort({ featured: -1, order: 1 })
          .lean();
        coverUrl = img?.url || "";
      }
      return {
        slug: c.slug as string,
        title: c.title as string,
        category: c.category as string,
        coverUrl,
        count: countMap.get(c.slug as string) || 0,
      };
    })
  );

  return entries.filter((e) => e.count > 0);
}

export default async function PortfolioIndexPage() {
  const entries = await getEntries();

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24">
      <header className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mb-12 sm:mb-16">
        <span className="eyebrow">Selected Galleries</span>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl mt-4 leading-[0.92]">
          The Work
        </h1>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        {entries.length === 0 ? (
          <p className="text-muted py-20">Galleries coming soon.</p>
        ) : (
          <IndexList entries={entries} />
        )}
      </section>
    </div>
  );
}
