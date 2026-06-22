import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";
import ImmersiveGallery, { type Group } from "@/components/portfolio/ImmersiveGallery";

export const dynamic = "force-dynamic";

async function getGroups(): Promise<Group[]> {
  await connectDB();
  const collections = await Collection.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const groups: Group[] = [];
  for (const c of collections) {
    const images = await GalleryImage.find({ collection: c.slug })
      .sort({ featured: -1, order: 1, createdAt: 1 })
      .lean();
    if (!images.length) continue;
    groups.push({
      slug: c.slug as string,
      title: c.title as string,
      category: c.category as string,
      images: images.map((i) => ({
        _id: String(i._id),
        url: i.url as string,
        width: i.width as number | undefined,
        height: i.height as number | undefined,
        title: (i.title as string) || "",
        category: (i.category as string) || "",
        collection: i.collection as string,
      })),
    });
  }
  return groups;
}

export default async function PortfolioPage() {
  const groups = await getGroups();

  if (!groups.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Gallery coming soon.
      </div>
    );
  }

  return <ImmersiveGallery groups={groups} />;
}
