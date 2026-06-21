import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ messages });
}
