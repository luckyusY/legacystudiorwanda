import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MasonryGallery, { type GalleryItem } from "@/components/MasonryGallery";
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
    collection: {
      title: collection.title as string,
      category: collection.category as string,
      description: (collection.description as string) || "",
    },
    images: images.map((i) => ({
      _id: String(i._id),
      url: i.url as string,
      title: (i.title as string) || "",
      category: (i.category as string) || "",
      width: i.width as number | undefined,
      height: i.height as number | undefined,
    })) as GalleryItem[],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const collection = await Collection.findOne({ slug }).lean();
  if (!collection) return { title: "Gallery" };
  return {
    title: collection.title as string,
    description: `${collection.title} — a photography collection by Legacy Studio, Kigali.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();

  const { collection, images } = data;

  return (
    <>
      <section className="relative py-20 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(201,162,75,0.12), transparent 45%), #0b0b0d",
          }}
        />
        <div className="container-x">
          <Link href="/portfolio" className="text-sm text-muted hover:text-gold">
            ← All collections
          </Link>
          <span className="block text-xs uppercase tracking-[0.4em] text-gold mt-6">
            {collection.category}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl mt-3">{collection.title}</h1>
          <p className="text-muted mt-3 text-sm">
            {images.length} photo{images.length === 1 ? "" : "s"}
            {collection.description ? ` · ${collection.description}` : ""}
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <MasonryGallery images={images} />
      </section>

      <section className="container-x pb-20 text-center">
        <Link href="/booking" className="btn-gold rounded-full px-8 py-3.5 inline-block">
          Book a session like this
        </Link>
      </section>
    </>
  );
}
