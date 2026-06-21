import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    packageName: { type: String, default: "" },
    eventDate: { type: Date },
    location: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type BookingType = InferSchemaType<typeof BookingSchema> & { _id: mongoose.Types.ObjectId };

export default models.Booking || model("Booking", BookingSchema);
