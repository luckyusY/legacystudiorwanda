import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, ".pdfwork", "lookbook.html");
const out = path.join(root, ".pdfwork", "Legacy-Studio-Portfolio.pdf");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--allow-file-access-from-files"],
});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load", timeout: 120000 });
  try {
    await page.evaluate(async () => {
      // @ts-ignore
      await document.fonts.ready;
    });
  } catch {}
  await new Promise((r) => setTimeout(r, 1200));
  await page.pdf({
    path: out,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    pageRanges: "",
  });
  console.log("PDF written:", out);
} finally {
  await browser.close();
}
