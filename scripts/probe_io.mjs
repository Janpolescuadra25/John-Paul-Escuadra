import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3800);

// attach our own IO mirrors to the card + the wipe wrapper + hairline
await page.evaluate(() => {
  window.__ioLog = [];
  const card = document.querySelector("#about .lux-shadow");
  const wipe = card.closest("section > div > div")?.parentElement; // wipe wrapper
  const targets = [
    ["card", card],
    ["wipe", document.querySelector("#about > div:nth-of-type(2)")],
    ["hairline", document.querySelector("#about > div:first-child")],
  ];
  for (const [name, el] of targets) {
    if (!el) { window.__ioLog.push({ name, err: "missing" }); continue; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        window.__ioLog.push({
          name, t: Math.round(performance.now()),
          isIntersecting: e.isIntersecting,
          ratio: +e.intersectionRatio.toFixed(3),
          rootBounds: e.rootBounds ? { t: Math.round(e.rootBounds.top), b: Math.round(e.rootBounds.bottom) } : null,
          rect: { t: Math.round(e.boundingClientRect.top), b: Math.round(e.boundingClientRect.bottom) },
        });
      }
    }, { rootMargin: "-80px 0px" });
    io.observe(el);
  }
});

// Method 1: scrollIntoViewIfNeeded
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const afterC = await page.evaluate(() => ({
  log: window.__ioLog,
  cardOpacity: getComputedStyle(document.querySelector("#about .lux-shadow")).opacity,
}));
console.log("after scrollIntoViewIfNeeded:");
console.log(JSON.stringify(afterC, null, 2));
await browser.close();
