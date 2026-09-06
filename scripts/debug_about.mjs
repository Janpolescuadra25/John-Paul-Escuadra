import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

const diag = await page.evaluate(() => {
  const about = document.querySelector("#about");
  const card = document.querySelector("#about .lux-shadow");
  const r = about?.getBoundingClientRect();
  const c = card?.getBoundingClientRect();
  const cs = card ? getComputedStyle(card) : null;
  return {
    scrollY: window.scrollY,
    bodyH: document.body.scrollHeight,
    aboutTop: r?.top,
    aboutH: r?.height,
    cardTop: c?.top,
    cardH: c?.height,
    cardOpacity: cs?.opacity,
    cardTransform: cs?.transform,
    hasLedgerText: document.body.textContent?.includes("LEDGER"),
    curtainVisible: (() => {
      const el = document.querySelector('[class*="curtain"], [class*="Curtain"]');
      return el ? getComputedStyle(el).opacity : "no-curtain-el";
    })(),
  };
});
console.log("before scroll:", JSON.stringify(diag, null, 2));

await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1600);

const diag2 = await page.evaluate(() => {
  const card = document.querySelector("#about .lux-shadow");
  const c = card?.getBoundingClientRect();
  const sec = card?.closest("section");
  const s = sec ? getComputedStyle(sec) : null;
  const inner = sec?.firstElementChild;
  const i = inner ? getComputedStyle(inner) : null;
  return {
    scrollY: window.scrollY,
    cardTop: c?.top,
    cardH: c?.height,
    cardBottomInViewport: c ? c.bottom < window.innerHeight && c.top >= 0 : null,
    secClip: s?.clipPath,
    secOpacity: s?.opacity,
    innerClip: i?.clipPath,
    innerOpacity: i?.opacity,
    innerVisibility: i?.visibility,
  };
});
console.log("after scroll:", JSON.stringify(diag2, null, 2));

await page.screenshot({ path: `${OUT}/debug-about-desktop.png` });
console.log(`page errors = ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
console.log("done");
