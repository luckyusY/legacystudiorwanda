import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const CollectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "Event" },
    description: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type CollectionType = InferSchemaType<typeof CollectionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.Collection || model("Collection", CollectionSchema);
