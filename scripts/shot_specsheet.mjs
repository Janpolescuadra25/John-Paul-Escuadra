import { chromium } from "playwright";

const OUT = "/home/z/my-project/download/verify";

const CASES = [
  ["desktop", 1440, 900, 1250],
  ["narrow", 1100, 800, 1250],
  ["mobile", 390, 844, 1350],
];

const browser = await chromium.launch();
for (const [name, w, h, scrollTo] of CASES) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: name === "mobile" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(5200);
  await page.evaluate((v) => window.scrollTo(0, v), scrollTo);
  await page.waitForTimeout(1600);

  // alignment truth: every value must start at the SAME x; labels share a column
  const geo = await page.evaluate(() => {
    const dds = [...document.querySelectorAll("#about dl dd")].map((dd) => Math.round(dd.getBoundingClientRect().left));
    const dts = [...document.querySelectorAll("#about dl dt")].map((dt) => Math.round(dt.getBoundingClientRect().left));
    const valueX = [...new Set(dds)];
    const labelX = [...new Set(dts)];
    const card = document.querySelector("#about .lux-shadow");
    const cr = card.getBoundingClientRect();
    const txt = document.body.textContent;
    return {
      rows: dds.length,
      valueColumnAligned: valueX.length === 1,
      labelColumnAligned: labelX.length === 1,
      valueX, labelX,
      cardInsideViewport: cr.left >= 0 && cr.right <= window.innerWidth,
      noPageOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      storyNoExam: !txt.includes("passed the Bookkeeping"),
      storyBookkeeper: txt.includes("I’m also a bookkeeper") || txt.includes("I'm also a bookkeeper"),
      storyFirmYears: txt.includes("years of experience working in an accounting firm"),
      certifiedRow: txt.includes("Bookkeeper — NC III"),
    };
  });
  await page.screenshot({ path: `${OUT}/specsheet-${name}.png` });
  console.log(`${name}:`, JSON.stringify(geo));
  console.log(`  errors: ${errors.length ? errors.join("|") : "none"}`);
  await page.close();
}
await browser.close();
console.log("done");
