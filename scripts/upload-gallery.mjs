/**
 * Upload extracted photos to Cloudinary, then register them in MongoDB.
 * Resumable: progress is saved to .extracted/uploaded.json after each upload,
 * so re-running resumes without re-uploading. Retries transient network errors.
 *
 * Usage: npm run upload-gallery
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTRACT_DIR = path.join(root, ".extracted");
const PROGRESS = path.join(EXTRACT_DIR, "uploaded.json");
const FOLDER = "legacystudio";

// Load .env.local
try {
  const env = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, label, tries = 5) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = Math.min(2000 * i, 10000);
      console.warn(`  retry ${i}/${tries} for ${label}: ${err?.message || err} (waiting ${wait}ms)`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

const GalleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "Portrait" },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const GalleryImage =
  mongoose.models.GalleryImage || mongoose.model("GalleryImage", GalleryImageSchema);

async function main() {
  const manifest = JSON.parse(readFileSync(path.join(EXTRACT_DIR, "manifest.json"), "utf8"));

  // Resume map: file -> uploaded record
  const done = existsSync(PROGRESS) ? JSON.parse(readFileSync(PROGRESS, "utf8")) : {};

  // ---- Phase 1: Cloudinary uploads (resumable) ----
  let uploaded = 0;
  let order = 0;
  for (const item of manifest) {
    order++;
    if (done[item.file]) continue;
    const localPath = path.join(EXTRACT_DIR, item.file);
    if (!existsSync(localPath)) {
      console.warn(`  ! missing ${item.file}`);
      continue;
    }
    const baseName = item.file.replace(/\.[^.]+$/, "");
    const res = await withRetry(
      () =>
        cloudinary.uploader.upload(localPath, {
          folder: FOLDER,
          public_id: baseName,
          resource_type: "image",
          overwrite: false,
        }),
      item.file
    );
    done[item.file] = {
      url: res.secure_url,
      publicId: res.public_id,
      width: res.width || item.width,
      height: res.height || item.height,
      category: item.category || "Portrait",
      featured: Boolean(item.featured),
      order,
    };
    writeFileSync(PROGRESS, JSON.stringify(done, null, 2));
    uploaded++;
    if (uploaded % 10 === 0) console.log(`  uploaded ${uploaded}…`);
  }
  console.log(`Cloudinary phase complete. New uploads: ${uploaded}. Total ready: ${Object.keys(done).length}`);

  // ---- Phase 2: MongoDB insert (only missing publicIds) ----
  await withRetry(
    () =>
      mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "legacystudio",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      }),
    "mongo-connect"
  );

  const existing = new Set(
    (await GalleryImage.find({}, { publicId: 1 }).lean()).map((d) => d.publicId)
  );

  const toInsert = Object.values(done)
    .filter((d) => !existing.has(d.publicId))
    .map((d) => ({
      category: d.category,
      url: d.url,
      publicId: d.publicId,
      width: d.width,
      height: d.height,
      featured: d.featured,
      order: d.order,
    }));

  if (toInsert.length) {
    await withRetry(() => GalleryImage.insertMany(toInsert, { ordered: false }), "mongo-insert");
  }

  const total = await GalleryImage.countDocuments();
  console.log(`\nDone. Inserted ${toInsert.length} new docs. Gallery now has ${total} images.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL:", err?.message || err);
  process.exit(1);
});
