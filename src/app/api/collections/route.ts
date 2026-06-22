import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";

export const dynamic = "force-dynamic";

// Public: list published collections with image counts and a cover image.
export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Counts + fallback covers in two grouped queries
    const counts = await GalleryImage.aggregate([
      { $group: { _id: "$collection", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id, c.count]));

    const result = await Promise.all(
      collections.map(async (c) => {
        let coverUrl = c.coverUrl;
        if (!coverUrl) {
          const img = await GalleryImage.findOne({ collection: c.slug })
            .sort({ featured: -1, order: 1 })
            .lean();
          coverUrl = img?.url || "";
        }
        return {
          _id: String(c._id),
          title: c.title,
          slug: c.slug,
          category: c.category,
          description: c.description,
          coverUrl,
          count: countMap.get(c.slug) || 0,
        };
      })
    );

    // Only return collections that actually have images
    return NextResponse.json({ collections: result.filter((c) => c.count > 0) });
  } catch (err) {
    console.error("GET /api/collections", err);
    return NextResponse.json({ collections: [] }, { status: 500 });
  }
}
