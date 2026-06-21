import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminType = InferSchemaType<typeof AdminSchema> & { _id: mongoose.Types.ObjectId };

export default models.Admin || model("Admin", AdminSchema);
