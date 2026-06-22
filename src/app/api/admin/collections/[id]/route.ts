import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const allowed = ["title", "category", "description", "coverUrl", "order", "published"] as const;
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const collection = await Collection.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ collection });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  // Deletes the collection record only; images keep their `collection` slug.
  await Collection.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
