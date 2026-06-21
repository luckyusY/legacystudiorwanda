import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ContactMessageType = InferSchemaType<typeof ContactMessageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.ContactMessage || model("ContactMessage", ContactMessageSchema);
