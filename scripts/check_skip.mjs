import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// curtain is up — click center to skip
const before = await page.evaluate(() => !!document.querySelector("video"));
await page.mouse.click(720, 450);
await page.waitForTimeout(1200);
const after = await page.evaluate(() => ({
  videoGone: !document.querySelector("video"),
  scrollUnlocked: document.body.style.overflow !== "hidden",
}));
console.log(`skip test: video-before=${before}, after-click=${JSON.stringify(after)}`);
await browser.close();
