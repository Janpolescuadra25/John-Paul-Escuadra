import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

// scroll so the profile card's narrative paragraph sits mid-viewport
await page.evaluate(() => {
  const el = document.querySelector("#about .lux-shadow");
  if (el) {
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top + r.height - window.innerHeight * 0.85);
  }
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/bookkeeper-para-desktop.png` });
console.log("captured");
await browser.close();
