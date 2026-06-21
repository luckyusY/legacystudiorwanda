import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ bookings });
}
