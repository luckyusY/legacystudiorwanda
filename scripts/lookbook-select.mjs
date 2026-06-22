/**
 * Curate + download a high-res subset of the best client-gallery photos for the
 * print lookbook. Even-samples each collection (avoids burst near-duplicates),
 * tags orientation, downloads from Cloudinary at print size, writes manifest.json.
 */
import { readFileSync, writeFileSync, mkdirSync, createWriteStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import mongoose from "mongoose";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, ".pdfwork", "img");
mkdirSync(OUT, { recursive: true });

try {
  const env = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const G = mongoose.model("G", new mongoose.Schema({}, { strict: false, collection: "galleryimages" }));

// target count per collection for the lookbook
const TARGETS = [
  { slug: "shizzo-tessy-prewedding", title: "Shizzo & Tessy", subtitle: "A Pre-Wedding Story", category: "Wedding", n: 18 },
  { slug: "cainergy", title: "Cainergy", subtitle: "Corporate & Event", category: "Event", n: 12 },
  { slug: "fed-rwanda", title: "Fed Rwanda", subtitle: "Brand & Event", category: "Event", n: 12 },
];

function orient(w, h) {
  const r = (w || 1) / (h || 1);
  if (r > 1.15) return "land";
  if (r < 0.87) return "port";
  return "square";
}

function evenSample(arr, n) {
  if (arr.length <= n) return arr.slice();
  const out = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * step)]);
  return out;
}

function cloudPrint(url, w = 2400) {
  return url.replace("/upload/", `/upload/f_jpg,q_82,w_${w},c_limit/`);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
      })
      .on("error", (e) => {
        file.close();
        reject(e);
      });
  });
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || "legacystudio" });

  const manifest = [];
  for (const t of TARGETS) {
    const docs = await G.find({ collection: t.slug })
      .sort({ featured: -1, order: 1 })
      .lean();
    // keep featured/first, even-sample the remainder
    const first = docs[0];
    const rest = evenSample(docs.slice(1), t.n - 1);
    const chosen = [first, ...rest].filter(Boolean);

    const items = [];
    let i = 0;
    for (const d of chosen) {
      i++;
      const file = `${t.slug}_${String(i).padStart(2, "0")}.jpg`;
      const dest = path.join(OUT, file);
      if (!existsSync(dest)) {
        try {
          await download(cloudPrint(d.url), dest);
        } catch (e) {
          console.warn(`  ! ${file}: ${e.message}`);
          continue;
        }
      }
      items.push({ file, w: d.width, h: d.height, orient: orient(d.width, d.height) });
    }
    manifest.push({ ...t, items });
    console.log(`[${t.slug}] downloaded ${items.length} (land:${items.filter((x) => x.orient === "land").length} port:${items.filter((x) => x.orient === "port").length})`);
  }

  writeFileSync(path.join(root, ".pdfwork", "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("manifest written");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL", e.message);
  process.exit(1);
});
