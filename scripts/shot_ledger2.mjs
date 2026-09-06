import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

// framing A (proven in shot_bookkeeper.mjs): scrollIntoView + settle → dossier rows
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/ledger-rows-desktop.png` });

// framing B (proven in shot_para.mjs): bottom of the card → narrative paragraph
await page.evaluate(() => {
  const el = document.querySelector("#about .lux-shadow");
  if (el) {
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top + r.height - window.innerHeight * 0.85);
  }
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/ledger-para-desktop.png` });

console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
console.log("done");
