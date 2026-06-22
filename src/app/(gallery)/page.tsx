import Link from "next/link";
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

export default async function HomeIndexPage() {
  const entries = await getEntries();
  const hero = entries[0]?.coverUrl;

  return (
    <>
      {/* Cover */}
      <section className="grid lg:grid-cols-[46%_54%] lg:min-h-[100svh]">
        <div className="relative flex flex-col justify-between gap-10 px-6 sm:px-12 py-14 sm:py-20 lg:py-16 bg-charcoal order-2 lg:order-1">
          <div
            className="absolute inset-0 -z-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <span className="relative eyebrow">{COMPANY.name} · Kigali, Rwanda</span>
          <div className="relative">
            <h1 className="lb lb-ol-gold text-[21vw] sm:text-[15vw] lg:text-[10rem] leading-[0.82]">
              Legacy
              <br />
              Studio
            </h1>
            <div className="h-1 w-24 bg-gold mt-7" />
            <p className="font-sans text-foreground/70 mt-6 max-w-sm leading-relaxed">
              A photography studio in Kigali. Selected galleries — weddings, events, brands and the
              moments in between.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#galleries" className="btn-gold rounded-full px-7 py-3 text-sm">
                View Galleries
              </a>
              <Link href="/pricing" className="btn-outline rounded-full px-7 py-3 text-sm">
                Pricing &amp; Packages
              </Link>
            </div>
          </div>
          <span className="relative font-sans text-xs tracking-[0.3em] uppercase text-muted">
            {COMPANY.website}
          </span>
        </div>

        {hero && (
          <div
            className="relative order-1 lg:order-2 min-h-[58vh] sm:min-h-[64vh] lg:min-h-0 overflow-hidden"
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

      {/* Galleries */}
      <section id="galleries" className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 pt-16 sm:pt-28 pb-20 sm:pb-28">
        <span className="eyebrow">The Galleries</span>
        <div className="mt-8 sm:mt-14">
          {entries.length === 0 ? (
            <p className="text-muted py-20">Galleries coming soon.</p>
          ) : (
            <IndexList entries={entries} />
          )}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 pb-24 sm:pb-32">
        <Link
          href="/pricing"
          className="group block rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal to-charcoal-2 p-8 sm:p-12 transition-colors hover:border-gold/60"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="eyebrow">Investment</span>
              <h2 className="font-serif text-3xl sm:text-5xl mt-3 leading-tight">
                Packages &amp; Pricing
              </h2>
              <p className="text-muted mt-3 max-w-md text-sm sm:text-base">
                Studio sessions, events and full wedding collections — see what each includes.
              </p>
            </div>
            <span className="btn-gold rounded-full px-8 py-3.5 text-sm shrink-0 self-start sm:self-auto">
              View Pricing →
            </span>
          </div>
        </Link>
      </section>
    </>
  );
}
