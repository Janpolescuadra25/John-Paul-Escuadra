import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4200); // intro curtain + delayed chips (3.65s) done

  await page.screenshot({ path: `${OUT}/cards-hero-${name}.png` });
  console.log(`${name}: page errors = ${errors.length ? errors.join(" | ") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
