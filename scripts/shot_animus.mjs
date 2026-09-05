import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4200); // intro curtain done

  // 1) resting hero — compact chips + 3D floor
  await page.screenshot({ path: `${OUT}/animus-rest-${name}.png` });

  if (name === "desktop") {
    // 2) click on the floor → synchronize wave
    await page.mouse.click(720, 780);
    await page.waitForTimeout(220);
    await page.screenshot({ path: `${OUT}/animus-sync-${name}.png` });

    // 3) scroll dolly — background at two scroll positions (world streams past)
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/animus-dolly-A-${name}.png` });
    await page.evaluate(() => window.scrollTo(0, 1750));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/animus-dolly-B-${name}.png` });
  } else {
    // 2) tap on the floor → synchronize wave (diamond rings)
    await page.touchscreen.tap(200, 700);
    await page.waitForTimeout(220);
    await page.screenshot({ path: `${OUT}/animus-sync-${name}.png` });
  }

  // 4) about — capture MID-WIPE then settled (scroll transition proof)
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${OUT}/animus-wipe-mid-${name}.png` });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/animus-about-${name}.png` });

  // 5) ventures — navy band, SEQ. heading, chamfered chips, gold hairline
  await page.evaluate(() => document.querySelector("#ventures")?.scrollIntoView());
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/animus-ventures-${name}.png` });

  // 6) full scroll — error check
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);

  console.log(name, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();
console.log("done");
