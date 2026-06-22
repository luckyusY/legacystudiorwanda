import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryGrid from "@/components/portfolio/GalleryGrid";
import type { Photo } from "@/components/portfolio/types";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";

export const dynamic = "force-dynamic";

async function getData(slug: string) {
  await connectDB();
  const collection = await Collection.findOne({ slug, published: true }).lean();
  if (!collection) return null;
  const images = await GalleryImage.find({ collection: slug })
    .sort({ featured: -1, order: 1, createdAt: 1 })
    .lean();
  return {
    title: collection.title as string,
    category: collection.category as string,
    photos: images.map((i) => ({
      _id: String(i._id),
      url: i.url as string,
      width: i.width as number | undefined,
      height: i.height as number | undefined,
      title: (i.title as string) || "",
      category: (i.category as string) || "",
    })) as Photo[],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const c = await Collection.findOne({ slug }).lean();
  return c
    ? { title: c.title as string, description: `${c.title} — photographed by Legacy Studio, Kigali.` }
    : { title: "Gallery" };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24">
      <header className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 mb-10 sm:mb-14">
        <Link href="/portfolio" className="eyebrow !text-muted hover:!text-gold transition-colors">
          ← Galleries
        </Link>
        <div className="flex items-end justify-between gap-6 mt-5">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9]">{data.title}</h1>
          <p className="hidden sm:block font-sans text-sm text-muted shrink-0 pb-2">
            {data.category} · {data.photos.length} photos
          </p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <GalleryGrid photos={data.photos} />
      </section>
    </div>
  );
}
