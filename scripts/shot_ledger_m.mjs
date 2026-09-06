import { chromium } from "playwright";
const OUT = "/home/z/my-project/download/verify";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);
await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(1400);
const checks = await page.evaluate(() => ({
  opacity: getComputedStyle(document.querySelector("#about .lux-shadow")).opacity,
  ledger: document.querySelector("#about .lux-shadow").textContent.includes("4 years — accounting field"),
}));
console.log("mobile state:", JSON.stringify(checks));
await page.screenshot({ path: `${OUT}/ledger-rows-mobile.png` });
console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
