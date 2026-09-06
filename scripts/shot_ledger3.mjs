import { chromium } from "playwright";
import { PNG } from "pngjs";

const OUT = "/home/z/my-project/download/verify";

const pixels = (buf) => {
  const png = PNG.sync.read(buf);
  let sum = 0, sumSq = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 40) {
    const v = (png.data[i] + png.data[i+1] + png.data[i+2]) / 3;
    sum += v; sumSq += v * v; n++;
  }
  return { mean: +(sum / n).toFixed(1), std: +Math.sqrt(sumSq / n - (sum/n)**2).toFixed(1) };
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

// REAL scroll (fires IntersectionObservers like a user's wheel) — dossier rows
await page.evaluate(() => window.scrollTo(0, 1300));
await page.waitForTimeout(1400);
const st = await page.evaluate(() => ({
  scrollY: window.scrollY,
  cardOpacity: getComputedStyle(document.querySelector("#about .lux-shadow")).opacity,
  cardTop: document.querySelector("#about .lux-shadow").getBoundingClientRect().top,
}));
console.log("rows state:", JSON.stringify(st));
await page.screenshot({ path: `${OUT}/ledger-rows-desktop.png` });
console.log("rows pixels:", JSON.stringify(pixels(await page.screenshot())));

// REAL scroll — narrative paragraph
await page.evaluate(() => window.scrollTo(0, 1850));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/ledger-para-desktop.png` });
console.log("para pixels:", JSON.stringify(pixels(await page.screenshot())));

console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
console.log("done");
