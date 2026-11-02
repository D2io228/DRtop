// Render build/tlop.html -> PDF, and report text boxes that overflow.
// usage: node render.js build/tlop.html out.pdf [--shots dir] [--only id1,id2]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const args = process.argv.slice(2);
  const input = path.resolve(args[0]);
  const out = path.resolve(args[1]);
  const shotsIdx = args.indexOf('--shots');
  const shots = shotsIdx >= 0 ? args[shotsIdx + 1] : null;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
  page.on('pageerror', e => console.log('pageerror:', e.message));
  page.on('requestfailed', r => console.log('requestfailed:', r.url()));
  await page.goto('file://' + input, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(300);
  // font check: which declared families actually loaded
  const fontReport = await page.evaluate(() => {
    const fams = new Set();
    document.fonts.forEach(f => { if (f.status === 'loaded') fams.add(f.family.replace(/"/g, '')); });
    return [...fams].sort();
  });
  console.log('fonts loaded:', fontReport.length, fontReport.join(', '));
  const problems = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('.flow, .prose').forEach(el => {
      const pg = el.closest('.page');
      const over = el.scrollHeight - el.clientHeight > 1.5 || el.scrollWidth - el.clientWidth > 1.5;
      if (over && getComputedStyle(el).overflow !== 'visible' || over && el.classList.contains('flow')) {
        res.push(`${pg ? pg.id : '?'}: ${el.className} sh=${el.scrollHeight} ch=${el.clientHeight} sw=${el.scrollWidth} cw=${el.clientWidth}`);
      }
    });
    // elements sticking out of their page
    document.querySelectorAll('.page').forEach(pg => {
      if (pg.scrollHeight > pg.clientHeight + 2 || pg.scrollWidth > pg.clientWidth + 2) {
        res.push(`${pg.id}: PAGE content exceeds (sh=${pg.scrollHeight} sw=${pg.scrollWidth})`);
      }
    });
    return res;
  });
  if (problems.length) console.log('OVERFLOW:\n  ' + problems.join('\n  ')); else console.log('overflow: none');
  const n = await page.$$eval('.page', els => els.length);
  console.log('pages:', n);
  if (shots) {
    fs.mkdirSync(shots, { recursive: true });
    const els = await page.$$('.page');
    let i = 0;
    for (const el of els) {
      i++;
      const id = await el.getAttribute('id');
      await el.screenshot({ path: path.join(shots, `${String(i).padStart(2, '0')}_${id}.png`) });
    }
  }
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, outline: false });
  console.log('pdf:', out, (fs.statSync(out).size / 1048576).toFixed(2), 'MB');
  await browser.close();
})();
