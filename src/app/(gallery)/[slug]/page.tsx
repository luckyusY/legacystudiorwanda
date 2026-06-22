import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LookbookGallery from "@/components/portfolio/LookbookGallery";
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

  return <LookbookGallery title={data.title} category={data.category} photos={data.photos} />;
}
