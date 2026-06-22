import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export const dynamic = "force-dynamic";

// Public: list gallery images, optionally filtered by ?category=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");

    await connectDB();
    const filter: Record<string, unknown> = {};
    if (category && category !== "All") filter.category = category;
    if (collection) filter.collection = collection;

    const images = await GalleryImage.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ images });
  } catch (err) {
    console.error("GET /api/gallery", err);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
