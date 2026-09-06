import { chromium } from "playwright";
import { PNG } from "pngjs";

const OUT = "/home/z/my-project/download/verify";

const pixels = (buf) => {
  const png = PNG.sync.read(buf);
  let sum = 0, sumSq = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 40) {
    const v = (png.data[i] + png.data[i+1] + png.data[i+2]) / 3;
    sum += v; sumSq += v * v; n++;
  }
  return { mean: +(sum / n).toFixed(1), std: +Math.sqrt(sumSq / n - (sum/n)**2).toFixed(1) };
};

const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // t≈1s — video should be playing inside the curtain
  await page.waitForTimeout(1000);
  const videoState = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { currentTime: +v.currentTime.toFixed(2), paused: v.paused, readyState: v.readyState } : null;
  });
  await page.screenshot({ path: `${OUT}/intro-early-${name}.png` });

  // t≈3.9s — late intro (video nearly done, name + rule up)
  await page.waitForTimeout(2900);
  await page.screenshot({ path: `${OUT}/intro-late-${name}.png` });

  // t≈6.3s — curtain split done, hero settled
  await page.waitForTimeout(2400);
  const dom = await page.evaluate(() => ({
    curtainGone: !document.querySelector('[class*="z-\\[95\\]"]') || !document.querySelector("video"),
    noLedger: !document.body.textContent.includes("LEDGER") && !document.body.textContent.includes("accounting firm"),
    nc3Kept: document.body.textContent.includes("Bookkeeper — NC III"),
    scrollUnlocked: document.body.style.overflow !== "hidden",
  }));
  await page.screenshot({ path: `${OUT}/intro-after-${name}.png` });
  console.log(`${name} | video: ${JSON.stringify(videoState)} | dom: ${JSON.stringify(dom)} | pixels: ${JSON.stringify(pixels(await page.screenshot()))}`);

  console.log(`${name}: page errors = ${errors.length ? errors.join(" | ") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
