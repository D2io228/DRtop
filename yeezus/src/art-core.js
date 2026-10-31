/* ===================================================================
   YEEZUS — generative illustration toolkit (core)
   All full-page art uses a viewBox in millimetres: 0 0 210 297.
   =================================================================== */
const A = {};
const RED = '#E0201B';

function rnd(seed) { // mulberry32
  let s = seed >>> 0;
  const f = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.r = (a, b) => a + (b - a) * f();
  f.i = (a, b) => Math.floor(a + (b - a + 1) * f());
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.g = () => { let u = 0, v = 0; while (!u) u = f(); while (!v) v = f(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  return f;
}
const n2 = v => (Math.round(v * 100) / 100);
const P = pts => 'M' + pts.map(p => n2(p[0]) + ' ' + n2(p[1])).join('L');
const PC = pts => P(pts) + 'Z';
const svgWrap = (inner, w = 210, h = 297, cls = 'art', extra = '') =>
  `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" ${extra}>${inner}</svg>`;
const IMG = (name, x = 0, y = 0, w = 210, h = 297, extra = '') => `<image href="../assets/${name}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${extra}/>`;
let __uid = 0; const uid = p => (p || 'u') + (++__uid);
const deg = a => a * Math.PI / 180;
function lerp(a, b, t) { return a + (b - a) * t; }
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function mix(c1, c2, t) { const a = hex2rgb(c1), b = hex2rgb(c2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join(''); }
function hsl(h, s, l) { return `hsl(${n2(h)},${n2(s)}%,${n2(l)}%)`; }

/* ---------------- torn tape ---------------- */
A.tapePath = function (w, h, seed, tornTop = true, tornBottom = true) {
  const R = rnd(seed); const pts = [];
  const steps = 9;
  // top edge
  for (let i = 0; i <= steps; i++) { const x = (w * i) / steps; pts.push([x, tornTop ? R.r(0, 1.6) : 0]); }
  // right edge
  for (let y = 4; y < h - 4; y += 6) pts.push([w + R.r(-.18, .18), y]);
  // bottom edge (torn)
  for (let i = steps; i >= 0; i--) { const x = (w * i) / steps; pts.push([x, h - (tornBottom ? R.r(0, 2.4) : 0)]); }
  for (let y = h - 4; y > 4; y -= 6) pts.push([R.r(-.18, .18), y]);
  return PC(pts);
};
A.tape = function (w, h, seed, opts = {}) {
  const id = uid('tp'); const color = opts.color || RED;
  const R = rnd(seed + 3);
  let tex = '';
  for (let y = 1.5; y < h; y += R.r(.7, 1.6)) tex += `<line x1="0" x2="${w}" y1="${n2(y)}" y2="${n2(y + R.r(-.2, .2))}" stroke="#000" stroke-opacity="${n2(R.r(.02, .07))}" stroke-width=".18"/>`;
  return `<defs><clipPath id="${id}"><path d="${A.tapePath(w, h, seed, opts.tornTop !== false, true)}"/></clipPath>
    <linearGradient id="${id}g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".45" stop-color="#fff" stop-opacity=".13"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient></defs>
    <g clip-path="url(#${id})"><rect x="-1" y="-1" width="${w + 2}" height="${h + 2}" fill="${color}" fill-opacity="${opts.op || .96}"/>${tex}<rect x="-1" y="-1" width="${w + 2}" height="${h + 2}" fill="url(#${id}g)"/></g>`;
};

/* ---------------- compact disc ---------------- */
A.disc = function (cx, cy, r, seed, opts = {}) {
  const id = uid('cd'); const R = rnd(seed);
  const rot = opts.rot || 0;
  let wedges = '';
  const N = 180;
  for (let i = 0; i < N; i++) {
    const a0 = deg(i * 360 / N + rot), a1 = deg((i + 1.15) * 360 / N + rot);
    const ang = i * 360 / N;
    // reflection streaks at two opposite angles
    const k = Math.pow(Math.max(0, Math.cos(deg(ang - 38) * 1)), 14) + Math.pow(Math.max(0, Math.cos(deg(ang - 218))), 14) * .8
      + Math.pow(Math.max(0, Math.cos(deg(ang - 120))), 40) * .35;
    const hue = (ang * 3.2 + 190) % 360;
    const base = 82 + 8 * Math.cos(deg(ang * 2 + 20));
    const col = k > .02 ? hsl(hue, 70 * Math.min(1, k * 1.4), base - 8 * k) : hsl(210, 6, base);
    wedges += `<path d="M${cx} ${cy}L${n2(cx + r * Math.cos(a0))} ${n2(cy + r * Math.sin(a0))}L${n2(cx + r * Math.cos(a1))} ${n2(cy + r * Math.sin(a1))}Z" fill="${col}"/>`;
  }
  let grooves = '';
  for (let rr = r * .4; rr < r * .985; rr += r * .016) grooves += `<circle cx="${cx}" cy="${cy}" r="${n2(rr)}" fill="none" stroke="${R() > .5 ? '#fff' : '#000'}" stroke-opacity="${n2(R.r(.03, .09))}" stroke-width="${n2(R.r(.08, .25))}"/>`;
  const hub = r * .385, stack = r * .29, hole = r * .125;
  return `<defs>
    <mask id="${id}m"><rect x="${cx - r - 1}" y="${cy - r - 1}" width="${2 * r + 2}" height="${2 * r + 2}" fill="#000"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${hub}" fill="#000"/></mask>
    <radialGradient id="${id}s" cx=".5" cy=".5" r=".5"><stop offset=".38" stop-color="#fff" stop-opacity=".5"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset=".62" stop-color="#fff" stop-opacity=".35"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <g mask="url(#${id}m)">${wedges}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}s)"/>${grooves}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}l)"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".25"/>
  <circle cx="${cx}" cy="${cy}" r="${n2(r - .6)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".2"/>
  <circle cx="${cx}" cy="${cy}" r="${n2(hub)}" fill="#fff" fill-opacity=".22" stroke="#000" stroke-opacity=".12" stroke-width=".2"/>
  <circle cx="${cx}" cy="${cy}" r="${n2(stack)}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".35"/>
  <circle cx="${cx}" cy="${cy}" r="${n2(stack - .7)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".25"/>
  <circle cx="${cx}" cy="${cy}" r="${n2(hole)}" fill="${opts.holeFill || 'none'}" stroke="#000" stroke-opacity=".3" stroke-width=".25"/>`;
};

/* jewel-case hub with teeth (seen through the hole) */
A.hub = function (cx, cy, r) {
  let teeth = '';
  for (let i = 0; i < 12; i++) {
    const a = deg(i * 30), a2 = deg(i * 30 + 18);
    teeth += `<path d="M${n2(cx + r * .35 * Math.cos(a))} ${n2(cy + r * .35 * Math.sin(a))}L${n2(cx + r * Math.cos(a))} ${n2(cy + r * Math.sin(a))}A${r} ${r} 0 0 1 ${n2(cx + r * Math.cos(a2))} ${n2(cy + r * Math.sin(a2))}L${n2(cx + r * .35 * Math.cos(a2))} ${n2(cy + r * .35 * Math.sin(a2))}Z" fill="#fff" fill-opacity=".25" stroke="#000" stroke-opacity=".22" stroke-width=".15"/>`;
  }
  return teeth + `<circle cx="${cx}" cy="${cy}" r="${n2(r * .35)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".2"/>`;
};

/* ---------------- jewel case ---------------- */
A.jewelCase = function (x0, y0, w, h, seed, opts = {}) {
  const id = uid('jc'); const R = rnd(seed);
  const flip = !!opts.flip;
  const hingeX = flip ? x0 + w - 7.5 : x0;
  const trayX = flip ? x0 + 3 : x0 + 9.5;
  const trayW = w - 12.5;
  const cx = trayX + trayW / 2, cy = y0 + h / 2; const r = Math.min(trayW, h) / 2 - 3.2;
  let ridges = '';
  [1.1, 2.3, 3.4, 5.6, 6.6].forEach((dx, i) => ridges += `<line x1="${n2(hingeX + dx)}" x2="${n2(hingeX + dx)}" y1="${y0 + .6}" y2="${y0 + h - .6}" stroke="${i % 2 ? '#fff' : '#000'}" stroke-opacity="${i % 2 ? .75 : .16}" stroke-width="${i % 2 ? .25 : .2}"/>`);
  const knuck = [[y0 + 1, 9], [y0 + h - 10, 9]].map(([yy, hh]) => `<rect x="${hingeX + .4}" y="${yy}" width="6.8" height="${hh}" rx=".8" fill="#fff" fill-opacity=".28" stroke="#000" stroke-opacity=".14" stroke-width=".18"/>`).join('');
  const tabs = flip ? '' : [y0 + 14, y0 + h - 22].map(yy => `<rect x="${x0 + w - 2.6}" y="${yy}" width="1.6" height="8" fill="#fff" fill-opacity=".55" stroke="#000" stroke-opacity=".12" stroke-width=".15"/>`).join('');
  return `<defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset=".18" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".46" stop-color="#fff" stop-opacity=".0"/><stop offset=".52" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".56" stop-color="#fff" stop-opacity=".02"/><stop offset=".86" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/>
    </linearGradient>
    <filter id="${id}sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
  </defs>
  ${opts.noShadow ? '' : `<rect x="${x0 + 3}" y="${y0 + 7}" width="${w}" height="${h}" fill="#000" fill-opacity=".22" filter="url(#${id}sh)"/>`}
  <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${opts.back || '#dcdcd9'}" fill-opacity=".55"/>
  <rect x="${trayX}" y="${y0 + 2.4}" width="${trayW}" height="${h - 4.8}" fill="#fff" fill-opacity=".08" stroke="#000" stroke-opacity=".10" stroke-width=".2"/>
  ${A.hub(cx, cy, r * .125 - .2)}
  ${opts.noDisc ? '' : A.disc(cx, cy, r, seed + 11, { rot: opts.rot || 0 })}
  <rect x="${hingeX}" y="${y0}" width="7.5" height="${h}" fill="#000" fill-opacity=".05"/>${ridges}${knuck}
  <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#${id}g)" stroke="#000" stroke-opacity=".28" stroke-width=".3"/>
  <rect x="${x0 + .9}" y="${y0 + .9}" width="${w - 1.8}" height="${h - 1.8}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width=".35"/>
  <rect x="${x0 + 2.1}" y="${y0 + 2.1}" width="${w - 4.2}" height="${h - 4.2}" fill="none" stroke="#000" stroke-opacity=".06" stroke-width=".25"/>
  ${tabs}`;
};

/* ---------------- running mini strips (text pages) ---------------- */
A.mini = function (key, acc, fg) {
  const R = rnd(key.length * 977 + 13); const W = 210, H = 9; let s = '';
  const o = (v) => n2(v);
  switch (key) {
    case 'prologue': case 't1': {
      let pts = []; for (let x = 66; x <= 192; x += .5) { const t = (x - 66) / 126; const a = t < .08 ? .2 : 3.6 * Math.min(1, t * 3); pts.push([x, 4.5 + Math.max(-4, Math.min(4, (R.g() * .6 + Math.sin(x * 2.1) * .8) * a))]); }
      s += `<path d="${P(pts)}" fill="none" stroke="${acc}" stroke-width=".3"/>`; break; }
    case 't2': for (let i = 0; i < 32; i++) { const on = [0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30].includes(i); s += `<rect x="${o(66 + i * 3.95)}" y="2.5" width="2.6" height="4" fill="${on ? acc : 'none'}" stroke="${acc}" stroke-opacity="${on ? 1 : .35}" stroke-width=".2"/>`; } break;
    case 't3': for (let i = 0; i <= 126; i++) { const L = i % 10 === 0 ? 4 : i % 5 === 0 ? 2.6 : 1.4; s += `<line x1="${66 + i}" x2="${66 + i}" y1="${9 - L}" y2="9" stroke="${fg}" stroke-opacity=".5" stroke-width=".15"/>`; } s += `<circle cx="129" cy="3" r="1.6" fill="none" stroke="${acc}" stroke-width=".3"/>`; break;
    case 't4': { let x = 66; while (x < 192) { const w = R.pick([.3, .3, .6, .9, 1.3]); s += `<rect x="${o(x)}" y="1" width="${w}" height="8" fill="${fg}" fill-opacity=".75"/>`; x += w + R.pick([.35, .6, .9, 1.2]); } break; }
    case 't5': { let pts = []; for (let x = 66; x <= 192; x += .4) { const t = (x - 66) / 126; pts.push([x, 4.5 + Math.sin(t * 90) * 3.8 * Math.exp(-t * 2.6) * Math.min(1, t * 12)]); } s += `<path d="${P(pts)}" fill="none" stroke="${acc}" stroke-width=".3"/>`; break; }
    case 't6': for (let i = 0; i < 18; i++) { const sz = 8 - i * .4; s += `<rect x="${o(66 + i * 7.2)}" y="${o(4.5 - sz / 2)}" width="${o(sz)}" height="${o(sz)}" fill="none" stroke="${acc}" stroke-opacity="${o(1 - i * .045)}" stroke-width=".25" transform="rotate(${i * 5} ${o(66 + i * 7.2 + sz / 2)} 4.5)"/>`; } break;
    case 't7': for (let i = 0; i < 26; i++) { const x = R.r(66, 192), y = R.r(1.5, 7.5), a = R.r(0, 180); s += `<ellipse cx="${o(x)}" cy="${o(y)}" rx="1.5" ry=".55" transform="rotate(${o(a)} ${o(x)} ${o(y)})" fill="${R() < .3 ? acc : fg}" fill-opacity="${R() < .3 ? .95 : .35}"/>`; } break;
    case 't8': { const st = []; for (let i = 0; i < 40; i++) st.push([R.r(66, 192), R.r(1, 8)]); st.forEach(p => s += `<circle cx="${o(p[0])}" cy="${o(p[1])}" r="${o(R.r(.12, .45))}" fill="${fg}" fill-opacity="${o(R.r(.3, .9))}"/>`); s += `<path d="${P([[120, 6], [128, 2.5], [137, 3.6], [143, 6.4], [150, 5.2]])}" fill="none" stroke="${acc}" stroke-width=".2" stroke-dasharray=".8 .6"/>`; break; }
    case 't9': for (let i = 0; i < 9; i++) s += `<path d="M${o(129 - 3 - i * 6)} 9 A ${o(3 + i * 6)} ${o(3 + i * 6)} 0 0 1 ${o(129 + 3 + i * 6)} 9" fill="none" stroke="${acc}" stroke-opacity="${o(1 - i * .1)}" stroke-width=".25"/>`; break;
    case 't10': { const gid = uid('h'); s += `<defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="${acc}" stop-opacity="0"/><stop offset=".5" stop-color="${acc}"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></linearGradient></defs><rect x="66" y="6" width="126" height=".5" fill="url(#${gid})"/><circle cx="129" cy="6" r="2.6" fill="${acc}" fill-opacity=".9"/>`; break; }
    case 'context': for (let i = 0; i < 16; i++) { const x = 66 + i * 8.2; s += `<rect x="${o(x)}" y="2" width="2.2" height="6" fill="none" stroke="${fg}" stroke-opacity=".45" stroke-width=".2"/><line x1="${o(x - .6)}" x2="${o(x + 2.8)}" y1="2" y2="2" stroke="${fg}" stroke-opacity=".45" stroke-width=".25"/>`; } break;
    case 'sound': { let pts = []; for (let x = 66; x <= 192; x += .5) { const gap = x > 118 && x < 140; const a = gap ? .6 : 3.8; pts.push([x, 4.5 + (gap ? Math.sin(x * .9) * a : Math.max(-4, Math.min(4, R.g() * a)))]); } s += `<path d="${P(pts)}" fill="none" stroke="${acc}" stroke-width=".28"/>`; break; }
    default: for (let i = 0; i < 6; i++) s += `<circle cx="129" cy="4.5" r="${1 + i * 1.6}" fill="none" stroke="${fg}" stroke-opacity="${o(.5 - i * .07)}" stroke-width=".18"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
};

/* ---------------- cover ---------------- */
A.cover = function () {
  const x0 = 31, y0 = 50, w = 148, h = 131;
  return svgWrap(`${IMG('cover-bg.jpg')}
   ${A.jewelCase(x0, y0, w, h, 2013, { rot: 8, noShadow: true })}
   <g transform="translate(${x0 - 2.5} ${y0 - 7}) rotate(-1.2)">${A.tape(12.5, 66, 44)}</g>`);
};

A.back = function () {
  const x0 = 31, y0 = 50, w = 148, h = 131;
  return svgWrap(`${IMG('back-bg.jpg')}
   ${A.jewelCase(x0, y0, w, h, 77, { flip: true, rot: 200, noShadow: true })}
   <g transform="translate(${x0 + w - 10} ${y0 + h - 58}) rotate(1.4)">${A.tape(12.5, 66, 91)}</g>`);
};

/* decorative barcode */
A.barcode = function (x, y, w, h, seed, color = '#111') {
  const R = rnd(seed); let s = ''; let cx = x;
  while (cx < x + w - 1) { const bw = R.pick([.25, .25, .5, .75, 1]); s += `<rect x="${n2(cx)}" y="${y}" width="${bw}" height="${h}" fill="${color}"/>`; cx += bw + R.pick([.25, .5, .5, .75]); }
  return s;
};
