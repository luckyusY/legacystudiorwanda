import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { uploadImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
// Allow larger base64 payloads for image uploads
export const maxDuration = 60;

export async function GET() {
  await connectDB();
  const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ images });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dataUri, title, category, featured } = body;

    if (!dataUri) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const uploaded = await uploadImage(dataUri);

    await connectDB();
    const image = await GalleryImage.create({
      title: title || "",
      category: category || "Portrait",
      featured: Boolean(featured),
      url: uploaded.url,
      publicId: uploaded.publicId,
      width: uploaded.width,
      height: uploaded.height,
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/gallery", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
