import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

const stats = await page.evaluate(() => new Promise((resolve) => {
  const cv = document.querySelector("canvas");
  const ctx = cv.getContext("2d");
  let blank = 0, total = 0, storeChanges = 0, lastSig = -1;
  const t0 = performance.now();
  const sample = () => {
    const w = cv.width, h = cv.height;
    if (w * h !== lastSig) { storeChanges++; lastSig = w * h; }
    const d = ctx.getImageData(0, 0, Math.min(w, 400), Math.min(h, 300)).data;
    let nonWhite = 0;
    for (let i = 0; i < d.length; i += 40) {
      if (d[i] < 245 || d[i+1] < 245 || d[i+2] < 245) nonWhite++;
    }
    total++;
    if (nonWhite === 0) blank++;
    if (performance.now() - t0 < 6000) requestAnimationFrame(sample);
    else resolve({ blank, total, storeChanges });
  };
  requestAnimationFrame(sample);
}));

await page.setViewportSize({ width: 1280, height: 640 });
await page.waitForTimeout(700);
await page.setViewportSize({ width: 1280, height: 760 });
await page.waitForTimeout(700);
await page.setViewportSize({ width: 1024, height: 760 });
await page.waitForTimeout(900);
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(700);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
console.log("monitor:", JSON.stringify(stats), "| page errors:", errors.length ? errors : "none");
await browser.close();
