import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.argv[2] || "https://photos.app.goo.gl/gvRvTqoRaJCS3FHj8";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
});
try {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1440, height: 2000 });
  const resp = await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
  console.log("status", resp.status(), "| final url:", page.url());
  console.log("title:", await page.title());

  // scroll to load lazy images
  for (let i = 0; i < 14; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.9));
    await new Promise((r) => setTimeout(r, 700));
  }

  const html = await page.content();
  // Google Photos shared-link photos use the /pw/ path; avatars use /a/ or /a-/
  const re = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-]+/g;
  const set = new Set((html.match(re) || []));
  console.log("unique /pw/ photo URLs:", set.size);
  console.log("sample:", [...set].slice(0, 4));

  // also count via DOM imgs
  const domCount = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("img"))
      .map((i) => i.src || "")
      .filter((s) => s.includes("googleusercontent.com/pw/")).length;
  });
  console.log("DOM /pw/ imgs:", domCount);
} catch (e) {
  console.error("ERR", e.message);
} finally {
  await browser.close();
}
