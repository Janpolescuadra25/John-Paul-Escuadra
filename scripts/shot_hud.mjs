import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4200); // intro curtain done

  // 1) resting hero — the readability test
  await page.screenshot({ path: `${OUT}/hud-rest-${name}.png` });

  // 2) interaction: move mouse across hero, then click
  if (name === "desktop") {
    await page.mouse.move(700, 450);
    await page.waitForTimeout(150);
    await page.mouse.move(720, 460, { steps: 12 });
    await page.waitForTimeout(80);
    await page.mouse.move(740, 480, { steps: 12 });
    await page.screenshot({ path: `${OUT}/hud-cursor-${name}.png` });
    await page.mouse.click(980, 420);
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT}/hud-pulse-${name}.png` });
  } else {
    await page.touchscreen.tap(200, 380);
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT}/hud-pulse-${name}.png` });
  }

  // 3) about section over background
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/hud-about-${name}.png` });

  console.log(name, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();
console.log("done");
