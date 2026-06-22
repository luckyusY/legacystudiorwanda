/**
 * Download harvested gallery images by INTERCEPTING the image responses as the
 * gallery page loads them (the only requests pixieset authorizes — they carry
 * the right Referer/Sec-Fetch headers). A high deviceScaleFactor makes the page
 * request the large/xlarge srcset variants. Saves to .extracted/dl/<slug>/.
 *
 * Usage: node scripts/download-images.mjs [slugFilter]
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HARVEST = path.join(root, ".extracted", "harvest");
const DL = path.join(root, ".extracted", "dl");
const slugFilter = process.argv[2];

const SOURCES = {
  "shizzo-tessy-prewedding": ["https://legacystudios89.pixieset.com/shizzoandtessyprewedding/"],
  "fed-rwanda": ["https://legacystudios32.pixieset.com/fedarwanda/"],
  cainergy: [
    "https://legacystudios89.pixieset.com/cainergy/",
    "https://legacystudios32.pixieset.com/cainergy/",
  ],
};

const META = {
  "shizzo-tessy-prewedding": { title: "Shizzo & Tessy — Pre-Wedding", category: "Wedding" },
  "fed-rwanda": { title: "Fed Rwanda", category: "Event" },
  cainergy: { title: "Cainergy", category: "Event" },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const baseOf = (u) =>
  u.replace(/^\/\//, "https://").replace(/-(thumb|small|medium|large|xlarge|cover)\.jpg.*$/i, "");

async function autoScroll(page) {
  let stable = 0;
  let last = 0;
  for (let i = 0; i < 150; i++) {
    const count = await page.evaluate(() => {
      window.scrollBy(0, Math.max(900, window.innerHeight - 100));
      return document.querySelectorAll("img").length;
    });
    await sleep(800);
    if (count <= last) {
      if (++stable >= 5) break;
    } else {
      stable = 0;
      last = count;
    }
  }
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1000);
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-blink-features=AutomationControlled", "--window-size=1500,2400"],
});

try {
  const slugs = Object.keys(SOURCES).filter((s) => !slugFilter || s === slugFilter);

  for (const slug of slugs) {
    const outDir = path.join(DL, slug);
    mkdirSync(outDir, { recursive: true });

    const captured = new Map(); // base -> { buf, size }

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );
    // High DPR so the page loads the largest srcset variant (xlarge)
    await page.setViewport({ width: 1500, height: 2400, deviceScaleFactor: 3 });
    await page.setCacheEnabled(false);

    page.on("response", async (resp) => {
      const u = resp.url();
      if (!u.includes("images.pixieset.com")) return;
      if (!/\.(jpe?g)(\?|$)/i.test(u)) return;
      if (/-(thumb|cover)\.jpg/i.test(u)) return; // skip tiny/cover dupes
      try {
        const buf = await resp.buffer();
        if (buf.length < 3000) return;
        const base = baseOf(u);
        const prev = captured.get(base);
        if (!prev || prev.size < buf.length) captured.set(base, { buf, size: buf.length });
      } catch {
        /* response not bufferable */
      }
    });

    for (const src of SOURCES[slug]) {
      try {
        await page.goto(src, { waitUntil: "networkidle2", timeout: 80000 });
        await sleep(1500);
        await autoScroll(page);
      } catch (e) {
        console.warn(`  ! ${src}: ${e.message}`);
      }
    }
    await sleep(1500);
    await page.close();

    const files = [];
    let i = 0;
    for (const { buf } of captured.values()) {
      i++;
      const fname = `${String(i).padStart(3, "0")}.jpg`;
      writeFileSync(path.join(outDir, fname), buf);
      files.push(fname);
    }
    writeFileSync(
      path.join(outDir, "manifest.json"),
      JSON.stringify({ slug, title: META[slug].title, category: META[slug].category, files }, null, 2)
    );
    console.log(`[${slug}] captured ${files.length} images`);
  }
} finally {
  await browser.close();
}
