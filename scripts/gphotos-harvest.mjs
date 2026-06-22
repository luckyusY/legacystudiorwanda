/**
 * Harvest full photo URL lists from Google Photos shared albums (shared-link
 * photos use the lh3.../pw/ path). Scrolls until the count stabilizes.
 * Writes .extracted/gphotos/<slug>.json
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, ".extracted", "gphotos");
mkdirSync(OUT, { recursive: true });

const ALBUMS = [
  { slug: "olivie-gaju", title: "Olivie & Gaju", category: "Wedding", url: "https://photos.app.goo.gl/gvRvTqoRaJCS3FHj8" },
  { slug: "gphotos-album-2", title: "Untitled", category: "Wedding", url: "https://photos.app.goo.gl/KRwLLY5kujcbctyQA" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RE = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-]+/g;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
});

try {
  for (const a of ALBUMS) {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1440, height: 2200 });
    await page.goto(a.url, { waitUntil: "networkidle2", timeout: 90000 });
    const title = await page.title();
    await sleep(1200);

    const seen = new Set();
    let stable = 0;
    for (let i = 0; i < 90 && stable < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.9));
      await sleep(550);
      const html = await page.content();
      const before = seen.size;
      for (const u of html.match(RE) || []) seen.add(u);
      if (seen.size === before) stable++;
      else stable = 0;
    }

    const urls = [...seen];
    writeFileSync(
      path.join(OUT, `${a.slug}.json`),
      JSON.stringify({ slug: a.slug, title: a.title, category: a.category, sourceTitle: title, urls }, null, 2)
    );
    console.log(`[${a.slug}] "${title}" -> ${urls.length} photos`);
    await page.close();
  }
} finally {
  await browser.close();
}
