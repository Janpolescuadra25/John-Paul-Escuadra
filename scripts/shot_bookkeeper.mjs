import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3800); // curtain done

  // marquee band sits right below the hero (100vh)
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/bookkeeper-marquee-${name}.png` });

  // About dossier card
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // section wipe-in + counters
  await page.screenshot({ path: `${OUT}/bookkeeper-about-${name}.png` });

  console.log(`${name}: page errors = ${errors.length ? errors.join(" | ") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
