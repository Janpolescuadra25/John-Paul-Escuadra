import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile", deviceScaleFactor: 2 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3800); // curtain + line fade-in (2.6s)

  // top of page — 0%
  await page.screenshot({ path: `${OUT}/line-top-${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(420, vp.height) } });

  // mid-scroll — ~50%
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
  await page.waitForTimeout(900); // spring settle
  await page.screenshot({ path: `${OUT}/line-mid-${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(420, vp.height) } });
  if (name === "desktop") {
    // tight close-up of the strip itself — continuity check
    await page.screenshot({ path: `${OUT}/line-closeup-desktop.png`, clip: { x: 0, y: 0, width: vp.width, height: 36 } });
  }

  // bottom — 100%
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/line-done-${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(420, vp.height) } });

  console.log(`${name}: page errors = ${errors.length ? errors.join(" | ") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
