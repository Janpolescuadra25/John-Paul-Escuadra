import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
const checks = await page.evaluate(() => {
  const card = document.querySelector("#about .lux-shadow")?.textContent ?? "";
  return {
    certifiedRow: card.includes("Bookkeeper — NC III"),
    ledgerRow: card.includes("4 years — accounting field"),
    narrative: card.includes("Bookkeeping NC III") && card.includes("four years working in the accounting field"),
  };
});
console.log("DOM checks:", JSON.stringify(checks));

// frame the dossier card rows + narrative
await page.evaluate(() => {
  const el = document.querySelector("#about .lux-shadow");
  if (el) {
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top - 80);
  }
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/ledger-about-desktop.png` });

console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
console.log("done");
