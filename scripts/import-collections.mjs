/**
 * Import downloaded external-gallery photos into Cloudinary + MongoDB as collections,
 * and migrate the existing PDF photos into a "studio-portfolio" collection.
 *
 * Reads local files from .extracted/dl/<slug>/ (produced by download-images.mjs)
 * and each dir's manifest.json. Uploads local files to Cloudinary, inserts
 * GalleryImage docs tagged with collection + category, upserts Collection docs.
 * Resumable: progress saved to .extracted/dl/imported.json
 *
 * Usage: npm run import-collections
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DL = path.join(root, ".extracted", "dl");
const PROGRESS = path.join(DL, "imported.json");

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
async function withRetry(fn, label, tries = 4) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = Math.min(1500 * i, 6000);
      console.warn(`  retry ${i}/${tries} ${label}: ${err?.message || err} (${wait}ms)`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

const GalleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "Portrait" },
    collection: { type: String, default: "studio-portfolio" },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const CollectionSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    category: { type: String, default: "Event" },
    description: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const GalleryImage =
  mongoose.models.GalleryImage || mongoose.model("GalleryImage", GalleryImageSchema);
const Collection = mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

async function main() {
  await withRetry(
    () =>
      mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "legacystudio",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      }),
    "mongo-connect"
  );

  // 1) Migrate existing images without a collection -> studio-portfolio
  const migrated = await GalleryImage.updateMany(
    { $or: [{ collection: { $exists: false } }, { collection: null }, { collection: "" }] },
    { $set: { collection: "studio-portfolio" } }
  );
  console.log(`Migrated ${migrated.modifiedCount} existing images -> studio-portfolio`);

  await Collection.updateOne(
    { slug: "studio-portfolio" },
    {
      $setOnInsert: {
        title: "Studio Portfolio",
        slug: "studio-portfolio",
        category: "Portrait",
        description: "A selection of studio and on-location work.",
        order: 0,
        published: true,
      },
    },
    { upsert: true }
  );

  // 2) Import downloaded collections
  const progress = existsSync(PROGRESS) ? JSON.parse(readFileSync(PROGRESS, "utf8")) : {};
  const slugs = existsSync(DL)
    ? readdirSync(DL).filter((d) => {
        try {
          return statSync(path.join(DL, d)).isDirectory();
        } catch {
          return false;
        }
      })
    : [];

  let colOrder = 1;
  for (const slug of slugs) {
    const dir = path.join(DL, slug);
    const manifestPath = path.join(dir, "manifest.json");
    if (!existsSync(manifestPath)) continue;
    const { title, category, files } = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!files || !files.length) {
      console.log(`[${slug}] no files, skipping`);
      continue;
    }

    await Collection.updateOne(
      { slug },
      {
        $set: { title, category },
        $setOnInsert: { slug, order: colOrder++, published: true, description: "" },
      },
      { upsert: true }
    );

    progress[slug] = progress[slug] || {};
    let uploaded = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (progress[slug][file]) continue;
      const localPath = path.join(dir, file);
      if (!existsSync(localPath)) continue;
      const order = i + 1;
      const publicIdBase = `${slug}_${String(order).padStart(3, "0")}`;
      try {
        const res = await withRetry(
          () =>
            cloudinary.uploader.upload(localPath, {
              folder: `legacystudio/${slug}`,
              public_id: publicIdBase,
              resource_type: "image",
              overwrite: false,
            }),
          `${slug}/${order}`
        );
        await GalleryImage.create({
          collection: slug,
          category,
          url: res.secure_url,
          publicId: res.public_id,
          width: res.width,
          height: res.height,
          featured: order === 1,
          order,
        });
        progress[slug][file] = res.public_id;
        writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
        uploaded++;
        if (uploaded % 15 === 0) console.log(`  [${slug}] uploaded ${uploaded}/${files.length}…`);
      } catch (err) {
        console.error(`  ! [${slug}] failed ${file}: ${err?.message || err}`);
      }
    }
    console.log(`[${slug}] done: ${uploaded} new (of ${files.length})`);
  }

  const totals = await GalleryImage.aggregate([
    { $group: { _id: "$collection", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log("\n=== Gallery by collection ===");
  for (const t of totals) console.log(`  ${t._id}: ${t.count}`);
  console.log(`Total: ${await GalleryImage.countDocuments()}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL:", err?.message || err);
  process.exit(1);
});
