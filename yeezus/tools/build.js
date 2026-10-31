// Usage: node tools/build.js [--pdf] [--png 1,2,5-7] [--scale 1.5]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { hyphenateSync } = require('hyphen/ru');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const want = k => args.includes(k);
const argv = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

function typo(t) {
  t = t.replace(/ — /g, ' — ').replace(/ – /g, ' — ');
  for (let i = 0; i < 2; i++) t = t.replace(/(^|[\s(« ])([а-яёА-ЯЁ]{1,2}|[A-Z]) (?=\S)/g, (m, a, w) => a + w + ' ');
  t = t.replace(/(\d) (?=[а-яё])/g, '$1 ');
  t = hyphenateSync(t, { hyphenChar: '­', minWordLength: 6 });
  return t;
}
let content = fs.readFileSync(path.join(root, 'src/content.html'), 'utf8');
content = content.replace(/<!--[\s\S]*?-->/g, '');
content = content.replace(/>([^<]+)</g, (m, t) => '>' + typo(t) + '<');
const shell = fs.readFileSync(path.join(root, 'src/book.html'), 'utf8').replace('<!--CONTENT-->', content);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const htmlPath = path.join(root, 'build/book.html');
fs.writeFileSync(htmlPath, shell);

(async () => {
  const browser = await chromium.launch();
  const scale = parseFloat(argv('--scale') || '1');
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: scale });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.type(), m.text()); });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file://' + htmlPath);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.__err);
  if (err) console.log('BUILD ERROR', err);
  const n = await page.evaluate(() => window.__pages);
  console.log('pages:', n);
  console.log(await page.evaluate(() => [...document.querySelectorAll('.page')].map((p, i) => (i + 1) + ':' + (p.dataset.anchor || (p.dataset.flow ? p.dataset.flow + '.' + p.dataset.fidx : '-'))).join(' ')));
  const pngSpec = argv('--png');
  if (pngSpec) {
    const list = new Set();
    pngSpec.split(',').forEach(p => { if (p === 'all') { for (let i = 1; i <= n; i++) list.add(i); } else if (p.includes('-')) { const [a, b] = p.split('-').map(Number); for (let i = a; i <= Math.min(b, n); i++) list.add(i); } else list.add(+p); });
    fs.mkdirSync(path.join(root, 'build/png'), { recursive: true });
    const els = await page.$$('.page');
    for (const i of list) { if (els[i - 1]) await els[i - 1].screenshot({ path: path.join(root, `build/png/p${String(i).padStart(2, '0')}.png`) }); }
    console.log('png:', [...list].join(','));
  }
  if (want('--pdf')) {
    await page.emulateMedia({ media: 'print' });
    const out = path.join(root, argv('--out') || 'Yeezus.pdf');
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, timeout: 600000 });
    console.log('pdf:', out, (fs.statSync(out).size / 1e6).toFixed(1) + 'MB');
  }
  await browser.close();
})();
