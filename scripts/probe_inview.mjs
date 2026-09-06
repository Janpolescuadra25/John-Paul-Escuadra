import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

const probe = () => page.evaluate(() => {
  const q = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).opacity : "missing";
  };
  return {
    card: q("#about .lux-shadow"),
    stat0: q("#about .grid.grid-cols-2 .group"),
    bars: q("#about .lux-shadow.flex-1") ?? q("#about div[class*='flex-1']"),
  };
});

// Variant A: instant jump
await page.evaluate(() => window.scrollTo(0, 1400));
await page.waitForTimeout(1200);
console.log("A instant-jump:", JSON.stringify(await probe()));

// Variant B: human stepped scroll (back to top first)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
for (let y = 200; y <= 1400; y += 200) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(120);
}
await page.waitForTimeout(1200);
console.log("B stepped:", JSON.stringify(await probe()));

// Variant C: scrollIntoViewIfNeeded (what earlier scripts used)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
console.log("C scrollIntoViewIfNeeded:", JSON.stringify(await probe()));
await browser.close();
