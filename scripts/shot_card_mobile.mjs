import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

// DOM truth check — the card must contain all three mentions
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
const checks = await page.evaluate(() => {
  const card = document.querySelector("#about .lux-shadow")?.textContent ?? "";
  const marquee = document.querySelector("main")?.textContent ?? "";
  return {
    certifiedRow: card.includes("Bookkeeper — NC III"),
    narrative: card.includes("Bookkeeping NC III"),
    marqueeWord: marquee.includes("Certified Bookkeeper"),
  };
});
console.log("DOM checks:", JSON.stringify(checks));

// centered viewport shot of the card's lower half (narrative paragraph)
await page.evaluate(() => {
  const el = document.querySelector("#about .lux-shadow");
  if (el) window.scrollBy(0, el.getBoundingClientRect().top + el.getBoundingClientRect().height * 0.55 - window.innerHeight * 0.35);
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/bookkeeper-para-mobile.png` });

console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
console.log("done");
