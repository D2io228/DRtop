// Render an HTML file to PNG screenshots of each .page (or full page) for QA.
// usage: node shot.js input.html outdir [scale] [selector]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const [,, input, outdir, scaleArg, selArg] = process.argv;
  const scale = parseFloat(scaleArg || '1');
  const sel = selArg || '.page';
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 1400, height: 1000 } });
  await page.goto('file://' + path.resolve(input), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const els = await page.$$(sel);
  if (els.length === 0) {
    await page.screenshot({ path: path.join(outdir, 'full.png'), fullPage: true });
  }
  let i = 0;
  for (const el of els) {
    i++;
    await el.screenshot({ path: path.join(outdir, `p${String(i).padStart(2, '0')}.png`) });
  }
  console.log('shots:', els.length || 1);
  await browser.close();
})();
