import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";
import IndexList, { type GalleryEntry } from "@/components/portfolio/IndexList";
import { cldCrop, cldBlur } from "@/lib/img";
import { COMPANY } from "@/lib/content";

export const dynamic = "force-dynamic";

async function getEntries(): Promise<GalleryEntry[]> {
  await connectDB();
  const collections = await Collection.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const counts = await GalleryImage.aggregate([{ $group: { _id: "$collection", count: { $sum: 1 } } }]);
  const countMap = new Map<string, number>(counts.map((c) => [c._id, c.count]));

  const entries = await Promise.all(
    collections.map(async (c) => {
      let coverUrl = c.coverUrl as string;
      if (!coverUrl) {
        const img = await GalleryImage.findOne({ collection: c.slug }).sort({ featured: -1, order: 1 }).lean();
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
  const hero = entries[0]?.coverUrl;

  return (
    <>
      {/* PDF-style cover */}
      <section className="grid lg:grid-cols-[46%_54%] min-h-[92vh]">
        <div className="relative flex flex-col justify-between px-6 sm:px-12 py-20 lg:py-16 bg-charcoal order-2 lg:order-1">
          <div
            className="absolute inset-0 -z-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <span className="relative eyebrow">{COMPANY.name} · Kigali</span>
          <div className="relative">
            <h1 className="lb lb-ol-gold text-[22vw] lg:text-[10rem] leading-[0.82]">Port&shy;folio</h1>
            <div className="h-1 w-28 bg-gold mt-8" />
            <p className="font-sans text-foreground/70 mt-6 max-w-sm leading-relaxed">
              Selected galleries — weddings, brands and the milestones in between, photographed across Rwanda.
            </p>
          </div>
          <span className="relative font-sans text-xs tracking-[0.3em] uppercase text-muted">
            {COMPANY.website}
          </span>
        </div>

        {hero && (
          <div
            className="relative order-1 lg:order-2 min-h-[46vh] lg:min-h-0 overflow-hidden"
            style={{ backgroundImage: `url(${cldBlur(hero)})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldCrop(hero, 1400, 1700)}
              srcSet={`${cldCrop(hero, 900, 1093)} 900w, ${cldCrop(hero, 1400, 1700)} 1400w, ${cldCrop(hero, 1900, 2300)} 1900w`}
              sizes="(max-width:1024px) 100vw, 54vw"
              alt="Legacy Studio"
              className="h-full w-full object-cover"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-charcoal/40 lg:to-transparent" />
          </div>
        )}
      </section>

      {/* Galleries index */}
      <section className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 pt-20 sm:pt-28 pb-28">
        <span className="eyebrow">The Galleries</span>
        <div className="mt-10 sm:mt-14">
          {entries.length === 0 ? (
            <p className="text-muted py-20">Galleries coming soon.</p>
          ) : (
            <IndexList entries={entries} />
          )}
        </div>
      </section>
    </>
  );
}
