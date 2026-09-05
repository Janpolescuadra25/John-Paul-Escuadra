import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4200); // intro curtain done

  // 1) resting hero — readability + 3D floor visible
  await page.screenshot({ path: `${OUT}/depth-rest-${name}.png` });

  if (name === "desktop") {
    // 2) camera parallax: mouse at far left, then far right (scene should shift)
    await page.mouse.move(80, 500);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/depth-parallax-left-${name}.png` });
    await page.mouse.move(1360, 300);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/depth-parallax-right-${name}.png` });
    // 3) click on the floor (lower part) → 3D ground ripple
    await page.mouse.click(720, 780);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/depth-groundripple-${name}.png` });
  } else {
    // 2) tap on the floor
    await page.touchscreen.tap(200, 700);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/depth-groundripple-${name}.png` });
  }

  // 4) about section
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/depth-about-${name}.png` });

  // 5) full scroll — error check
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);

  console.log(name, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();
console.log("done");
