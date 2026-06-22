import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const GalleryImageSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    category: { type: String, default: "Portrait" },
    collection: { type: String, default: "studio-portfolio", index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export type GalleryImageType = InferSchemaType<typeof GalleryImageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.GalleryImage || model("GalleryImage", GalleryImageSchema);
