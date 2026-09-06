import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1600);

const state = await page.evaluate(() => {
  const card = document.querySelector("#about .lux-shadow");
  const c = card.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const sec = card.closest("section");
  const ss = getComputedStyle(sec);
  const inner = sec?.querySelector(":scope > *");
  const innerCs = inner ? getComputedStyle(inner) : null;
  return {
    scrollY: window.scrollY,
    cardTop: c.top, cardH: c.height,
    opacity: cs.opacity, visibility: cs.visibility, display: cs.display,
    secClip: ss.clipPath, secTransform: ss.transform, secWillChange: ss.willChange,
    innerClip: innerCs?.clipPath, innerTransform: innerCs?.transform,
    secRect: sec.getBoundingClientRect().top,
  };
});
console.log("state:", JSON.stringify(state, null, 2));
await page.screenshot({ path: "/home/z/my-project/download/verify/probe-render.png" });

// pixel truth: crop the card region and measure brightness variance
const buf = await page.screenshot({ clip: { x: 260, y: 200, width: 600, height: 500 } });
const { PNG } = await import("pngjs");
const png = PNG.sync.read(buf);
let sum = 0, sumSq = 0, n = 0;
for (let i = 0; i < png.data.length; i += 40) {
  const v = (png.data[i] + png.data[i+1] + png.data[i+2]) / 3;
  sum += v; sumSq += v * v; n++;
}
const mean = sum / n, variance = sumSq / n - mean * mean;
console.log(`card-region pixels: mean=${mean.toFixed(1)} stddev=${Math.sqrt(variance).toFixed(1)} (blank white would be ~mean 250, stddev < 5; text content pushes stddev > 15)`);
await browser.close();
