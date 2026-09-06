import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);
await page.locator("#about").scrollIntoViewIfNeeded();
for (const ms of [300, 900, 1800]) {
  await page.waitForTimeout(ms);
  const state = await page.evaluate(() => {
    const card = document.querySelector("#about .lux-shadow");
    const cs = card ? getComputedStyle(card) : null;
    return { opacity: cs?.opacity, transform: cs?.transform, text: card?.textContent?.slice(0, 60) };
  });
  console.log(`t+${ms}:`, JSON.stringify(state));
}
await browser.close();
