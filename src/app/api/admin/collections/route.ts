import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import GalleryImage from "@/models/GalleryImage";

export const dynamic = "force-dynamic";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  await connectDB();
  const collections = await Collection.find().sort({ order: 1, createdAt: 1 }).lean();
  const counts = await GalleryImage.aggregate([
    { $group: { _id: "$collection", count: { $sum: 1 } } },
  ]);
  const countMap = new Map<string, number>(counts.map((c) => [c._id, c.count]));
  return NextResponse.json({
    collections: collections.map((c) => ({ ...c, count: countMap.get(c.slug as string) || 0 })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  await connectDB();
  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const exists = await Collection.findOne({ slug });
  if (exists) return NextResponse.json({ error: "A collection with this slug exists." }, { status: 409 });

  const last = await Collection.findOne().sort({ order: -1 }).lean();
  const collection = await Collection.create({
    title: body.title,
    slug,
    category: body.category || "Event",
    description: body.description || "",
    coverUrl: body.coverUrl || "",
    order: (last?.order ?? 0) + 1,
    published: body.published ?? true,
  });
  return NextResponse.json({ collection }, { status: 201 });
}
