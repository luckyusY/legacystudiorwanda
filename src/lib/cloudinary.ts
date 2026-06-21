import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDER = "legacystudio";

/**
 * Upload an image from a data URI (data:image/...;base64,xxxx) or remote URL.
 * Returns the secure URL and the public_id (needed for deletion).
 */
export async function uploadImage(dataUri: string) {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    resource_type: "image",
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export default cloudinary;
