import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service } = body;

    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { error: "Name, email, phone and service are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const booking = await Booking.create({
      name,
      email,
      phone,
      service,
      packageName: body.packageName || "",
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
      location: body.location || "",
      message: body.message || "",
    });

    return NextResponse.json({ ok: true, id: booking._id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
