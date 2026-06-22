import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const allowed = ["title", "category", "collection", "featured", "order"] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const image = await GalleryImage.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ image });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const image = await GalleryImage.findById(id);
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await deleteImage(image.publicId);
  } catch (err) {
    console.error("Cloudinary delete failed", err);
  }

  await image.deleteOne();
  return NextResponse.json({ ok: true });
}
