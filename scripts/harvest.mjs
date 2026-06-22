/**
 * Harvest full-res image URLs from external galleries (Pixieset + Google Photos)
 * using headless Chrome. Writes .extracted/harvest/<slug>.json per collection.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, ".extracted", "harvest");
mkdirSync(OUT, { recursive: true });

const COLLECTIONS = [
  {
    slug: "shizzo-tessy-prewedding",
    title: "Shizzo & Tessy — Pre-Wedding",
    category: "Wedding",
    type: "pixieset",
    urls: ["https://legacystudios89.pixieset.com/shizzoandtessyprewedding/"],
  },
  {
    slug: "fed-rwanda",
    title: "Fed Rwanda",
    category: "Event",
    type: "pixieset",
    urls: ["https://legacystudios32.pixieset.com/fedarwanda/"],
  },
  {
    slug: "cainergy",
    title: "Cainergy",
    category: "Event",
    type: "pixieset",
    urls: [
      "https://legacystudios89.pixieset.com/cainergy/",
      "https://legacystudios32.pixieset.com/cainergy/",
    ],
  },
  {
    slug: "google-album",
    title: "Featured Album",
    category: "Event",
    type: "gphotos",
    urls: ["https://photos.app.goo.gl/KRwLLY5kujcbctyQA"],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoScroll(page, { settleRounds = 4, maxRounds = 120, step = 1200 } = {}) {
  let stable = 0;
  let last = 0;
  for (let i = 0; i < maxRounds; i++) {
    const count = await page.evaluate((s) => {
      window.scrollBy(0, s);
      return document.querySelectorAll("img").length;
    }, step);
    await sleep(700);
    if (count <= last) {
      stable++;
      if (stable >= settleRounds) break;
    } else {
      stable = 0;
      last = count;
    }
  }
  // jump to bottom a couple times for good measure
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(900);
  }
}

function pixiesetUpgrade(url) {
  // images.pixieset.com/<id>/<hash>-<size>.jpg -> -xlarge
  const m = url.replace(/^\/\//, "https://").match(/^(https:\/\/images\.pixieset\.com\/.+?)-(thumb|small|medium|large|xlarge|cover)\.jpg/i);
  if (!m) return null;
  return { base: m[1], url: `${m[1]}-xlarge.jpg` };
}

function gphotosUpgrade(url) {
  // lh3.googleusercontent.com/<id>=<params>  -> request a large size
  if (!/googleusercontent\.com/.test(url)) return null;
  const base = url.split("=")[0];
  if (!base || base.length < 40) return null;
  return { base, url: `${base}=w2000` };
}

async function harvestPage(page, type) {
  return page.evaluate((t) => {
    const out = [];
    for (const img of Array.from(document.querySelectorAll("img"))) {
      const cand = img.currentSrc || img.src || img.getAttribute("data-src") || "";
      if (t === "pixieset" && cand.includes("images.pixieset.com")) out.push(cand);
      if (t === "gphotos" && cand.includes("googleusercontent.com")) out.push(cand);
    }
    return out;
  }, type);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-blink-features=AutomationControlled", "--window-size=1440,2200"],
});

const summary = [];
try {
  for (const col of COLLECTIONS) {
    const byBase = new Map();
    for (const url of col.urls) {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1440, height: 2200 });
      try {
        const resp = await page.goto(url, { waitUntil: "networkidle2", timeout: 70000 });
        const status = resp ? resp.status() : 0;
        await sleep(1500);
        await autoScroll(page);
        const raw = await harvestPage(page, col.type);
        let added = 0;
        for (const r of raw) {
          const up = col.type === "pixieset" ? pixiesetUpgrade(r) : gphotosUpgrade(r);
          if (up && !byBase.has(up.base)) {
            byBase.set(up.base, up.url);
            added++;
          }
        }
        console.log(`[${col.slug}] ${url} -> status ${status}, +${added} (total ${byBase.size})`);
      } catch (e) {
        console.error(`[${col.slug}] ${url} ERROR: ${e.message}`);
      } finally {
        await page.close();
      }
    }
    const urls = Array.from(byBase.values());
    writeFileSync(
      path.join(OUT, `${col.slug}.json`),
      JSON.stringify({ slug: col.slug, title: col.title, category: col.category, urls }, null, 2)
    );
    summary.push({ slug: col.slug, count: urls.length });
  }
} finally {
  await browser.close();
}

console.log("\n=== Harvest summary ===");
for (const s of summary) console.log(`  ${s.slug}: ${s.count} images`);
