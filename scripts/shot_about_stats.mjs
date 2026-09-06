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

// viewport widths to test the stats + card: user's desktop, a narrow desktop, tablet
const CASES = [
  ["desktop", 1440, 900],
  ["narrow", 1100, 800],
  ["tablet", 820, 900],
];

const browser = await chromium.launch();
for (const [name, w, h] of CASES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(5200); // full intro passes

  // REAL scroll to the About section (stats grid just below the card)
  await page.evaluate(() => window.scrollTo(0, 1250));
  await page.waitForTimeout(1600);

  // overflow truth: does any stat card stick out of its container?
  const geo = await page.evaluate(() => {
    const grid = document.querySelector("#about .grid.grid-cols-2");
    const gr = grid.getBoundingClientRect();
    const cards = [...grid.children].map((c) => {
      const r = c.getBoundingClientRect();
      return {
        pct: c.textContent.includes("%"),
        right: Math.round(r.right),
        inside: r.right <= gr.right + 1,
        clipped: r.right > gr.right + 1,
        text: c.textContent.trim().slice(0, 26),
      };
    });
    const txt = document.body.textContent;
    return {
      gridRight: Math.round(gr.right),
      cards,
      rowsGone: !txt.includes("ROLE") && !txt.includes("HOUSE") && !txt.includes("FOCUS"),
      narrative: txt.includes("Bookkeeping NC III, with years of experience working in an accounting firm"),
    };
  });
  console.log(`${name} (${w}px):`, JSON.stringify(geo));
  await page.screenshot({ path: `${OUT}/about-stats-${name}.png` });
  console.log(`  pixels: ${JSON.stringify(pixels(await page.screenshot()))} | errors: ${errors.length ? errors.join("|") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
