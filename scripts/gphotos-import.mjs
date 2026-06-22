/**
 * Import harvested Google Photos albums (.extracted/gphotos/*.json) into
 * Cloudinary + MongoDB as new galleries. Uploads each /pw/ URL at =w2000 via
 * Cloudinary remote fetch. Resumable: progress saved to .extracted/gphotos/imported.json
 *
 * Usage: npm run gphotos-import
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(root, ".extracted", "gphotos");
const PROGRESS = path.join(DIR, "imported.json");

try {
  const env = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

if (!process.env.MONGODB_URI) { console.error("Missing MONGODB_URI"); process.exit(1); }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withRetry(fn, label, tries = 4) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try { return await fn(); }
    catch (e) { last = e; const w = Math.min(1500 * i, 6000); console.warn(`  retry ${i}/${tries} ${label}: ${e?.message || e}`); await sleep(w); }
  }
  throw last;
}

const GalleryImage = mongoose.models.GalleryImage || mongoose.model("GalleryImage", new mongoose.Schema({
  title: { type: String, default: "" }, category: { type: String, default: "Wedding" },
  collection: { type: String, default: "studio-portfolio" }, url: { type: String, required: true },
  publicId: { type: String, required: true }, width: Number, height: Number,
  featured: { type: Boolean, default: false }, order: { type: Number, default: 0 },
}, { timestamps: true }));
const Collection = mongoose.models.Collection || mongoose.model("Collection", new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, category: { type: String, default: "Wedding" },
  description: { type: String, default: "" }, coverUrl: { type: String, default: "" },
  order: { type: Number, default: 0 }, published: { type: Boolean, default: true },
}, { timestamps: true }));

async function main() {
  await withRetry(() => mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "legacystudio", serverSelectionTimeoutMS: 30000, socketTimeoutMS: 60000,
  }), "mongo-connect");

  const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "imported.json");
  const progress = existsSync(PROGRESS) ? JSON.parse(readFileSync(PROGRESS, "utf8")) : {};

  // place new galleries after existing ones
  const maxOrder = (await Collection.find().sort({ order: -1 }).limit(1).lean())[0]?.order ?? 0;
  let nextOrder = maxOrder + 1;

  for (const file of files) {
    const album = JSON.parse(readFileSync(path.join(DIR, file), "utf8"));
    const { slug, title, category, urls } = album;
    if (!urls?.length) continue;

    const existing = await Collection.findOne({ slug });
    await Collection.updateOne(
      { slug },
      { $set: { title, category }, $setOnInsert: { slug, order: nextOrder, published: true, description: "" } },
      { upsert: true }
    );
    if (!existing) nextOrder++;

    progress[slug] = progress[slug] || {};
    let uploaded = 0;
    for (let i = 0; i < urls.length; i++) {
      const src = `${urls[i]}=w2000`;
      if (progress[slug][urls[i]]) continue;
      const order = i + 1;
      const publicId = `${slug}_${String(order).padStart(3, "0")}`;
      try {
        const res = await withRetry(() => cloudinary.uploader.upload(src, {
          folder: `legacystudio/${slug}`, public_id: publicId, resource_type: "image", overwrite: false,
        }), `${slug}/${order}`);
        await GalleryImage.create({
          collection: slug, category, url: res.secure_url, publicId: res.public_id,
          width: res.width, height: res.height, featured: order === 1, order,
        });
        progress[slug][urls[i]] = res.public_id;
        writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
        uploaded++;
        if (uploaded % 15 === 0) console.log(`  [${slug}] ${uploaded}/${urls.length}`);
      } catch (e) {
        console.error(`  ! [${slug}] ${order}: ${e?.message || e}`);
      }
    }
    console.log(`[${slug}] done: ${uploaded} new (of ${urls.length})`);
  }

  const totals = await GalleryImage.aggregate([{ $group: { _id: "$collection", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
  console.log("\n=== Gallery by collection ===");
  for (const t of totals) console.log(`  ${t._id}: ${t.count}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => { console.error("FATAL:", e?.message || e); process.exit(1); });
