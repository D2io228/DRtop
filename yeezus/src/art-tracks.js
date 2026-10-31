/* ===================================================================
   Track art — one world per song
   =================================================================== */
const IMG = (name, x = 0, y = 0, w = 210, h = 297, extra = '') => `<image href="../assets/${name}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${extra}/>`;

/* 01 — ON SIGHT: signal, tear, choir */
A.t1 = function () {
  const R = rnd(11); const cut = 196; const id = uid('t1');
  let s = `<rect width="210" height="297" fill="#0A0A0A"/>`;
  s += `<defs><clipPath id="${id}top"><path d="${(() => { const pts = [[0, 0], [210, 0]]; for (let x = 210; x >= 0; x -= R.r(1.2, 3.2)) pts.push([x, cut + R.r(-2.2, 2.2)]); pts.push([0, cut]); return PC(pts); })()}"/></clipPath>
    <radialGradient id="${id}halo" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="#F7D9A0" stop-opacity=".85"/><stop offset=".5" stop-color="#F7E6C6" stop-opacity=".35"/><stop offset="1" stop-color="#F2EEE6" stop-opacity="0"/></radialGradient></defs>`;
  // lower world: light
  s += `<rect y="${cut - 6}" width="210" height="${303 - cut}" fill="#F2EEE6"/>`;
  s += `<ellipse cx="105" cy="268" rx="120" ry="58" fill="url(#${id}halo)"/>`;
  // rays from above the choir
  for (let k = 0; k < 13; k++) { const x = 20 + k * 14; s += `<path d="M${x} ${cut}L${x + 5} ${cut}L${x + 12} 297L${x - 4} 297Z" fill="#fff" fill-opacity=".22"/>`; }
  // choir
  const rows = [[244, .62, 21, '#5d5750'], [254, .74, 18, '#3d3833'], [266, .88, 15, '#24201c'], [280, 1.05, 12, '#141210']];
  rows.forEach(([y, sc, n, col], ri) => {
    const span = 176 * (0.8 + ri * .07); const x0 = 105 - span / 2;
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + .5) * span / n + (ri % 2 ? 2 : 0) + R.r(-.6, .6);
      const h = 9 * sc, w = 6.2 * sc, hr = 1.55 * sc;
      s += `<path d="M${n2(x - w * .28)} ${n2(y - h + hr * 1.6)}Q${n2(x - w * .62)} ${n2(y - h * .4)} ${n2(x - w / 2)} ${n2(y)}L${n2(x + w / 2)} ${n2(y)}Q${n2(x + w * .62)} ${n2(y - h * .4)} ${n2(x + w * .28)} ${n2(y - h + hr * 1.6)}Z" fill="${col}"/>`;
      s += `<circle cx="${n2(x)}" cy="${n2(y - h + hr * .3)}" r="${n2(hr)}" fill="${col}"/>`;
      if (ri === 3 && i % 3 === 1) s += `<rect x="${n2(x - w * .2)}" y="${n2(y - h * .55)}" width="${n2(w * .4)}" height="${n2(h * .18)}" fill="#F2EEE6" fill-opacity=".85"/>`;
    }
  });
  // upper world: static + acid wave, clipped by torn edge
  s += `<g clip-path="url(#${id}top)">${IMG('t1-static.jpg', 0, 0, 210, 297)}`;
  // grid
  for (let x = 0; x <= 210; x += 15) s += `<line x1="${x}" x2="${x}" y1="0" y2="${cut}" stroke="#fff" stroke-opacity=".05" stroke-width=".15"/>`;
  // resonant saw (303-like) — clean iconic line
  const pts = []; const yc = 96, per = 27;
  for (let x = -4; x <= 214; x += .25) { const ph = ((x + 6) % per) / per; let v = (1 - ph) * 2 - 1; v += Math.exp(-ph * 9) * Math.sin(ph * 70) * .55; pts.push([x, yc - v * 30]); }
  const d = P(pts);
  s += `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="3.2"/>`;
  s += `<path d="${d}" fill="none" stroke="${RED}" stroke-width="1.2" transform="translate(1.4 .6)"/>`;
  s += `<path d="${d}" fill="none" stroke="#fff" stroke-width=".7"/>`;
  // cutoff/resonance readouts
  [['CUTOFF', .78], ['RESO', .93], ['ENV', .64], ['DIST', 1]].forEach(([l, v], i) => { const x = 140 + i * 15, y = 30; s += `<circle cx="${x}" cy="${y}" r="4.2" fill="#0A0A0A" fill-opacity=".7" stroke="#fff" stroke-opacity=".5" stroke-width=".25"/><line x1="${x}" y1="${y}" x2="${n2(x + Math.cos(deg(-225 + v * 270)) * 3.4)}" y2="${n2(y + Math.sin(deg(-225 + v * 270)) * 3.4)}" stroke="${RED}" stroke-width=".5"/>` + T(x, y + 8, l, { a: 'middle', s: 1.7, c: '#fff', op: .7 }); });
  s += `</g>`;
  // torn edge shadow line
  s += T(196, cut + 34, 'СТОП ▮▮ → ХОР', { a: 'end', s: 1.9, c: '#7a7268', w: 600 });
  return svgWrap(s);
};

/* 02 — BLACK SKINHEAD: tower, searchlights, viewfinder */
A.t2 = function () {
  const R = rnd(22); const id = uid('t2');
  let s = `<rect width="210" height="297" fill="#070707"/>`;
  const tx = 146, topY = 60;
  // beams
  s += `<defs>`;
  const beams = [[-30, 297, -3], [40, 330, 2], [250, 320, -2], [190, 340, 3], [-20, 200, 5]];
  beams.forEach((b, i) => s += `<linearGradient id="${id}b${i}" gradientUnits="userSpaceOnUse" x1="${b[0]}" y1="${b[1]}" x2="${tx}" y2="${topY}"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/></linearGradient>`);
  s += `<radialGradient id="${id}spot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  beams.forEach((b, i) => { const ang = Math.atan2(topY - b[1], tx - b[0]); const nx = -Math.sin(ang), ny = Math.cos(ang); const wS = 2, wE = 9 + b[2]; s += `<path d="M${n2(b[0] + nx * wS)} ${n2(b[1] + ny * wS)}L${n2(tx + nx * wE)} ${n2(topY + ny * wE)}L${n2(tx - nx * wE)} ${n2(topY - ny * wE)}L${n2(b[0] - nx * wS)} ${n2(b[1] - ny * wS)}Z" fill="url(#${id}b${i})"/>`; });
  s += `<circle cx="${tx}" cy="${topY}" r="22" fill="url(#${id}spot)"/>`;
  // tower (stepped)
  const steps = [[297, 64], [214, 64], [214, 52], [172, 52], [172, 40], [134, 40], [134, 30], [108, 30], [108, 20], [92, 20], [92, 13], [81, 13], [81, 7], [72, 7], [72, 2.4], [56, 2.4], [56, .7], [44, .7]];
  const left = [], right = [];
  steps.forEach(([y, w]) => { left.push([tx - w / 2, y]); right.unshift([tx + w / 2, y]); });
  s += `<path d="${PC(left.concat(right))}" fill="#111" stroke="#2a2a2a" stroke-width=".25"/>`;
  // windows
  for (let i = 0; i < steps.length - 6; i += 2) {
    const yB = steps[i][0], yT = steps[i + 1 < steps.length ? i + 2 : i][0] || yB - 10, w = steps[i + 1][1];
    for (let y = yT + 2; y < yB - 1.5; y += 2.3) for (let x = tx - w / 2 + 1.6; x < tx + w / 2 - 1.6; x += 1.9) {
      const v = R(); if (v < .2) s += `<rect x="${n2(x)}" y="${n2(y)}" width=".55" height="1.1" fill="${v < .02 ? RED : '#fff'}" fill-opacity="${n2(v < .02 ? .9 : R.r(.12, .45))}"/>`;
    }
  }
  // figure at top + crosshair
  const fx = tx, fy = topY - 1.8;
  s += `<rect x="${fx - .7}" y="${fy - 1.2}" width="1.4" height="2.6" fill="${RED}"/><circle cx="${fx}" cy="${fy - 2}" r=".75" fill="${RED}"/>`;
  s += `<circle cx="${fx}" cy="${fy}" r="9" fill="none" stroke="${RED}" stroke-width=".3"/><circle cx="${fx}" cy="${fy}" r="13" fill="none" stroke="${RED}" stroke-opacity=".45" stroke-width=".2" stroke-dasharray="1 1.2"/>`;
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => s += `<line x1="${fx + dx * 5}" y1="${fy + dy * 5}" x2="${fx + dx * 16}" y2="${fy + dy * 16}" stroke="${RED}" stroke-width=".3"/>`);
  s += T(fx + 15, fy - 9, 'TARGET', { s: 1.9, c: RED, w: 600 }) + T(fx + 15, fy - 6.4, 'H 381 M · KONG', { s: 1.7, c: '#fff', op: .6 });
  // viewfinder
  const m = 12, L = 9; [[m, m, 1, 1], [210 - m, m, -1, 1], [m, 297 - m, 1, -1], [210 - m, 297 - m, -1, -1]].forEach(([x, y, sx, sy]) => s += `<path d="M${x} ${y + sy * L}V${y}H${x + sx * L}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".35"/>`);
  s += `<circle cx="170" cy="22.3" r="1.3" fill="${RED}"/>` + T(173, 23, 'REC', { s: 2.2, c: '#fff', w: 600 }) + T(184, 23, '03:08', { s: 2.2, c: '#fff', op: .7 });
  // step sequencer HUD
  const hits = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];
  hits.forEach((h, i) => s += `<rect x="${n2(146 + i * 3.4)}" y="31" width="2.4" height="2.4" fill="${h ? RED : 'none'}" stroke="#fff" stroke-opacity="${h ? 0 : .3}" stroke-width=".15"/>`);
  s += T(146, 38, 'STOMP · CLAP · BREATH', { s: 1.6, c: '#fff', op: .5 });
  return svgWrap(s);
};

/* 03 — I AM A GOD: halo instrument + croissant (bathos) */
A.croissant = function (cx, cy, sc, ink) {
  const X = (x) => n2(cx + x * sc), Y = (y) => n2(cy + y * sc);
  const q = (p0, c, p1, t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]];
  const L = [-27, 11], Rt = [27, 11];
  const O = t => q(L, [0, -30], Rt, t), I = t => q(L, [0, -6], Rt, t);
  const ts = [0, .13, .3, .5, .7, .87, 1];
  const nrm = (t) => { const o = O(t), i = I(t); const dx = o[0] - i[0], dy = o[1] - i[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  let d = `M${X(L[0])} ${Y(L[1])}`;
  for (let k = 0; k < ts.length - 1; k++) { const a = ts[k], b = ts[k + 1], m = (a + b) / 2; const o = O(m); const nn = nrm(m); const bul = (k === 0 || k === ts.length - 2) ? 1.2 : 3.4; const p1 = O(b); d += `Q${X(o[0] + nn[0] * bul)} ${Y(o[1] + nn[1] * bul)} ${X(p1[0])} ${Y(p1[1])}`; }
  for (let k = ts.length - 1; k > 0; k--) { const a = ts[k], b = ts[k - 1], m = (a + b) / 2; const i = I(m); const nn = nrm(m); const bul = (k === 1 || k === ts.length - 1) ? .4 : 1.6; const p1 = I(b); d += `Q${X(i[0] - nn[0] * bul)} ${Y(i[1] - nn[1] * bul)} ${X(p1[0])} ${Y(p1[1])}`; }
  let s = `<path d="${d}Z" fill="#F8F7F4" stroke="${ink}" stroke-width=".4" stroke-linejoin="round"/>`;
  ts.slice(1, -1).forEach((t, k) => { const o = O(t), i = I(t); const side = t < .5 ? -1 : 1; s += `<path d="M${X(o[0])} ${Y(o[1])}Q${X((o[0] + i[0]) / 2 + side * 2.4)} ${Y((o[1] + i[1]) / 2)} ${X(i[0])} ${Y(i[1])}" fill="none" stroke="${ink}" stroke-width=".3"/>`; });
  return s;
};
A.t3 = function () {
  const R = rnd(33); const ink = '#111214'; const id = uid('t3');
  let s = `<rect width="210" height="297" fill="#F1F1EE"/>`;
  const cx = 105, cy = 124, r = 60;
  s += `<defs><radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#F7F7F5"/><stop offset="1" stop-color="#F1F1EE" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa0a8"/><stop offset=".45" stop-color="#ffffff"/><stop offset=".55" stop-color="#c9cdd2"/><stop offset="1" stop-color="#6c727a"/></linearGradient></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r + 30}" fill="url(#${id}g)"/>`;
  // halo body: metallic ring
  s += `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="url(#${id}ring)" stroke-width="5.2"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r - .2}" fill="none" stroke="${ink}" stroke-width=".25"/><circle cx="${cx}" cy="${cy}" r="${r - 5.8}" fill="none" stroke="${ink}" stroke-width=".25"/>`;
  // dial ticks
  for (let a = 0; a < 360; a += 3) { const L = a % 30 === 0 ? 4 : a % 15 === 0 ? 2.6 : 1.4; const ra = deg(a - 90); s += `<line x1="${n2(cx + Math.cos(ra) * (r + 1.5))}" y1="${n2(cy + Math.sin(ra) * (r + 1.5))}" x2="${n2(cx + Math.cos(ra) * (r + 1.5 + L))}" y2="${n2(cy + Math.sin(ra) * (r + 1.5 + L))}" stroke="${ink}" stroke-opacity=".6" stroke-width=".15"/>`; if (a % 30 === 0) s += T(cx + Math.cos(ra) * (r + 9), cy + Math.sin(ra) * (r + 9) + .7, String(a).padStart(3, '0'), { a: 'middle', s: 1.6, c: ink, op: .6 }); }
  // center mark
  s += `<path d="M${cx - 3} ${cy}H${cx + 3}M${cx} ${cy - 3}V${cy + 3}" stroke="${ink}" stroke-opacity=".5" stroke-width=".2"/>`;
  // crack / scream through the halo
  const pts = []; let x = 170, y = 52; while (x > 42) { pts.push([x, y]); x -= R.r(1.2, 4.5); y += R.r(.8, 4.6) + (R() < .2 ? R.r(-3, 3) : 0); }
  s += `<path d="${P(pts)}" fill="none" stroke="#F1F1EE" stroke-width="2.2"/>`;
  s += `<path d="${P(pts)}" fill="none" stroke="${RED}" stroke-width=".55"/>`;
  for (let k = 0; k < 18; k++) { const p = R.pick(pts); s += `<path d="M${n2(p[0])} ${n2(p[1])}l${n2(R.r(-4, 4))} ${n2(R.r(-4, 4))}" stroke="${RED}" stroke-width=".25"/>`; }
  for (let k = 0; k < 14; k++) { const p = R.pick(pts); const sz = R.r(.8, 2.4); s += `<path d="M${n2(p[0] + R.r(-6, 6))} ${n2(p[1] + R.r(-6, 6))}l${n2(sz)} ${n2(-sz * .4)}l${n2(-sz * .3)} ${n2(sz)}Z" fill="${ink}" fill-opacity=".7"/>`; }
  s += T(150, 50, 'КРИК', { s: 1.8, c: RED, w: 600 });
  // dimension line over halo
  s += `<path d="M${cx + r * .72} ${cy - r * .72}L${cx + r + 8} ${cy - r - 4}H${cx + r + 26}" stroke="${ink}" stroke-width=".18" fill="none"/>` + T(cx + r + 9, cy - r - 5.2, 'НИМБ · Ø 120 ММ', { s: 1.8, c: ink, w: 600 }) + T(cx + r + 9, cy - r - 2.2 + 3.4, 'ВЫСОКИЙ РЕГИСТР', { s: 1.6, c: ink, op: .6 });
  // bathos arrow
  s += `<path d="M${cx} ${cy + r + 10}V${cy + r + 28}" stroke="${RED}" stroke-width=".3" stroke-dasharray="1 1"/><path d="M${cx - 1.6} ${cy + r + 25.5}L${cx} ${cy + r + 29}L${cx + 1.6} ${cy + r + 25.5}" fill="none" stroke="${RED}" stroke-width=".3"/>`;
  s += T(cx + 3, cy + r + 20, 'БАТОС', { s: 2.2, c: RED, w: 600 });
  const cy2 = cy + r + 44;
  s += A.croissant(cx, cy2, 1.0, ink);
  s += `<path d="M${cx + 26} ${cy2 - 2}H${cx + 34}" stroke="${ink}" stroke-width=".18"/>` + T(cx + 35, cy2 - 3.2, 'КРУАССАН · 1 ШТ.', { s: 1.8, c: ink, w: 600 }) + T(cx + 35, cy2 + .2, 'НИЗКИЙ РЕГИСТР', { s: 1.6, c: ink, op: .6 });
  return svgWrap(s);
};

/* 04 — NEW SLAVES: price tag → bars → horizon */
A.t4 = function () {
  const R = rnd(44); const ink = '#141311'; const id = uid('t4');
  let s = `<rect width="210" height="297" fill="#DCD8D1"/>`;
  s += `<defs><linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCD8D1"/><stop offset=".45" stop-color="#E9DCC0"/><stop offset=".78" stop-color="#F3C88A"/><stop offset="1" stop-color="#F7B46A"/></linearGradient>
    <radialGradient id="${id}sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4DC"/><stop offset=".55" stop-color="#FBD9A0"/><stop offset="1" stop-color="#F7B46A" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}bar" x1="0" x2="1"><stop offset="0" stop-color="#2a2724"/><stop offset=".35" stop-color="#6b665f"/><stop offset=".6" stop-color="#1a1816"/><stop offset="1" stop-color="#0e0d0c"/></linearGradient>
    <linearGradient id="${id}proj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".0"/></linearGradient></defs>`;
  // concrete facade grid
  for (let y = 8; y < 150; y += 14) for (let x = 6; x < 210; x += 12) s += `<rect x="${x}" y="${y}" width="8" height="9" fill="none" stroke="${ink}" stroke-opacity=".07" stroke-width=".25"/>`;
  // horizon world
  const hz = 262;
  s += `<rect x="0" y="150" width="210" height="${hz - 150}" fill="url(#${id}sky)"/>`;
  s += `<circle cx="132" cy="${hz}" r="34" fill="url(#${id}sun)"/><circle cx="132" cy="${hz}" r="11" fill="#FFF1D6"/>`;
  s += `<rect x="0" y="${hz}" width="210" height="${297 - hz}" fill="#8b7a63"/>`;
  for (let k = 0; k < 8; k++) s += `<rect x="0" y="${hz + 1 + k * 4.2}" width="210" height=".25" fill="#FFE2B0" fill-opacity="${n2(.5 - k * .05)}"/>`;
  s += `<rect x="0" y="150" width="210" height="18" fill="#DCD8D1" fill-opacity=".85"/>`;
  // projection keystone behind tag
  s += `<path d="M40 22L170 26L176 104L34 100Z" fill="url(#${id}proj)"/>`;
  // price tag
  const tg = `M62 36H170V96H62L46 66Z`;
  s += `<path d="${tg}" transform="translate(1.6 2.4)" fill="#000" fill-opacity=".12"/><path d="${tg}" fill="#FBFAF7" stroke="${ink}" stroke-width=".3"/>`;
  s += `<circle cx="58" cy="66" r="2.6" fill="#DCD8D1" stroke="${ink}" stroke-width=".3"/>`;
  s += `<path d="M58 66C40 60 26 44 14 18" fill="none" stroke="${ink}" stroke-width=".35"/>`;
  // barcode in tag; collect bar x positions
  let x = 78; const barXs = []; while (x < 160) { const w = R.pick([.5, .5, .9, 1.3, 1.8]); s += `<rect x="${n2(x)}" y="44" width="${w}" height="38" fill="${ink}"/>`; barXs.push([x, w]); x += w + R.pick([.5, .9, 1.2]); }
  s += T(118, 89, '0  13  2013  0618  4  00', { a: 'middle', s: 2.4, c: ink, ls: .6 });
  s += T(68, 46, 'ЦЕНА', { s: 1.8, c: RED, w: 600 });
  // prison bars descending from selected bars
  const bars = []; for (let bx = 122; bx <= 196; bx += 9.2) bars.push(bx);
  bars.forEach(bx => s += `<rect x="${bx}" y="100" width="2.6" height="197" fill="url(#${id}bar)"/>`);
  [176, 236].forEach(y => s += `<rect x="118" y="${y}" width="92" height="3" fill="#1a1816"/><rect x="118" y="${y}" width="92" height=".7" fill="#7a746b"/>`);
  // connectors from barcode to bars (dashed)
  bars.forEach((bx, i) => { const src = barXs[Math.min(barXs.length - 1, Math.floor(i * barXs.length / bars.length))]; s += `<path d="M${n2(src[0] + src[1] / 2)} 82L${bx + 1.3} 100" stroke="${ink}" stroke-opacity=".35" stroke-width=".15"/>`; });
  s += T(196, 270, 'ОMEGA · GYÖNGYHAJÚ LÁNY', { a: 'end', s: 1.8, c: '#3d3326', w: 600 });
  return svgWrap(s);
};

/* 05 — HOLD MY LIQUOR: tilted glass, loop, guitar string */
A.t5 = function () {
  const R = rnd(55); const id = uid('t5'); const am = '#E0962F', bone = '#EADFCC';
  let s = IMG('t5-smoke.jpg');
  const gx = 104, gy = 150, rot = -13;
  const glass = `M-28 -34L28 -34L23 30Q22 36 16 36L-16 36Q-22 36 -23 30Z`;
  const inner = `M-26 -33L26 -33L21.3 24L-21.3 24Z`;
  s += `<defs><clipPath id="${id}in"><path d="${inner}" transform="translate(${gx} ${gy}) rotate(${rot})"/></clipPath>
    <linearGradient id="${id}liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B04C"/><stop offset=".5" stop-color="#C66A17"/><stop offset="1" stop-color="#6A2E0A"/></linearGradient>
    <linearGradient id="${id}gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".2" stop-color="#fff" stop-opacity=".02"/><stop offset=".8" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient></defs>`;
  // orbit back half
  const orbit = (front) => { const rx = 74, ry = 20; const a0 = front ? 0 : 180, a1 = front ? 180 : 360; const p = []; for (let a = a0; a <= a1; a += 3) p.push([gx + Math.cos(deg(a)) * rx, gy + 6 + Math.sin(deg(a)) * ry]); return P(p); };
  const oid = uid('orb');
  s += `<path id="${oid}b" d="${orbit(false)}" fill="none" stroke="${am}" stroke-opacity=".25" stroke-width=".2"/>`;
  s += `<text font-family="IBM Plex Mono" font-size="2.6" font-weight="600" letter-spacing=".9" fill="${am}" fill-opacity=".45"><textPath href="#${oid}b">COMA · SOFA · ROVER · COMA · SOFA · ROVER · COMA · SOFA · ROVER ·</textPath></text>`;
  // double-vision ghost
  s += `<path d="${glass}" transform="translate(${gx + 5} ${gy - 2.5}) rotate(${rot + 3})" fill="none" stroke="${RED}" stroke-opacity=".45" stroke-width=".5"/>`;
  // liquid (level horizontal in page space)
  s += `<g clip-path="url(#${id}in)"><rect x="40" y="${gy - 4}" width="130" height="80" fill="url(#${id}liq)" fill-opacity=".92"/>
     <rect x="40" y="${gy - 4}" width="130" height=".6" fill="#FFE0A6"/>
     <rect x="${gx - 12}" y="${gy - 14}" width="15" height="14" rx="2" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-opacity=".55" stroke-width=".3" transform="rotate(18 ${gx - 5} ${gy - 7})"/>
     <rect x="${gx + 2}" y="${gy - 10}" width="13" height="12" rx="2" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".45" stroke-width=".3" transform="rotate(-9 ${gx + 8} ${gy - 4})"/></g>`;
  s += `<g transform="translate(${gx} ${gy}) rotate(${rot})"><path d="${glass}" fill="url(#${id}gl)" stroke="${bone}" stroke-width=".55"/><path d="M-21.3 24L21.3 24" stroke="${bone}" stroke-opacity=".5" stroke-width=".3"/><path d="M-24 -30L-20 20" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/></g>`;
  // orbit front half
  s += `<path id="${oid}f" d="${orbit(true)}" fill="none" stroke="${am}" stroke-opacity=".6" stroke-width=".25"/>`;
  s += `<text font-family="IBM Plex Mono" font-size="2.6" font-weight="600" letter-spacing=".9" fill="${am}"><textPath href="#${oid}f">COMA · SOFA · ROVER · COMA · SOFA · ROVER · COMA · SOFA · ROVER ·</textPath></text>`;
  // guitar string
  const sy = 226; const str = (amp, op, w, off) => { const p = []; for (let x = 0; x <= 210; x += .35) { const t = x / 210; const env = Math.sin(Math.PI * Math.min(1, t * 1.35)) * Math.exp(-Math.max(0, t - .7) * 4); p.push([x, sy + env * amp * (Math.sin(x * 1.15 + off) * .75 + Math.sin(x * 2.9 + off) * .25)]); } return `<path d="${P(p)}" fill="none" stroke="${am}" stroke-opacity="${op}" stroke-width="${w}"/>`; };
  s += str(9, .12, 2.4, 0) + str(9, .9, .45, 0) + str(6, .35, .25, 1.4);
  s += T(14, sy - 12, 'MIKE DEAN · СОЛО → ДО КОНЦА ТРЕКА', { s: 1.8, c: am, w: 600 });
  for (let k = 0; k <= 10; k++) s += `<line x1="${14 + k * 18.2}" x2="${14 + k * 18.2}" y1="${sy + 14}" y2="${sy + 16}" stroke="${bone}" stroke-opacity=".35" stroke-width=".15"/>`;
  return svgWrap(s);
};

/* 06 — I'M IN IT: nested rooms vortex */
A.t6 = function () {
  const id = uid('t6'); let s = IMG('t6-heat.jpg');
  const cx = 108, cy = 196; let w = 230, h = 300;
  s += `<defs><radialGradient id="${id}c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#FF8A70" stop-opacity=".8"/><stop offset="1" stop-color="#FF3B2E" stop-opacity="0"/></radialGradient></defs>`;
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = i / N; const sc = Math.pow(.88, i); const ww = w * sc, hh = h * sc; const x = lerp(105, cx, t), y = lerp(150, cy - 20, t);
    s += `<rect x="${n2(x - ww / 2)}" y="${n2(y - hh / 2)}" width="${n2(ww)}" height="${n2(hh)}" fill="none" stroke="${i % 5 === 0 ? '#FFD0C4' : '#FF3B2E'}" stroke-opacity="${n2(.25 + t * .75)}" stroke-width="${n2(.9 - t * .6)}" transform="rotate(${n2(i * 3.4)} ${n2(x)} ${n2(y)})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy - 20}" r="12" fill="url(#${id}c)"/>`;
  // breath bands
  for (let k = 0; k < 4; k++) { const p = []; const by = 240 + k * 7; for (let x = 0; x <= 210; x += .6) p.push([x, by + Math.sin(x * .07 + k) * 3 * Math.sin(x * .013 + k * .5)]); s += `<path d="${P(p)}" fill="none" stroke="#FFC2B6" stroke-opacity="${n2(.28 - k * .05)}" stroke-width=".35"/>`; }
  s += T(cx, cy - 4, 'ВЫ ЗДЕСЬ', { a: 'middle', s: 1.7, c: '#FFD8CE', w: 600, op: .85 });
  return svgWrap(s);
};

/* 07 — BLOOD ON THE LEAVES: branches, leaves, brass shockwave, piano */
A.t7 = function () {
  const R = rnd(77); const bone = '#E8E1D6', cr = '#B3141A'; let s = `<rect width="210" height="297" fill="#070505"/>`;
  // brass shockwave from below
  for (let k = 0; k < 16; k++) { const r = 70 + k * 15 + k * k * .6; s += `<circle cx="105" cy="372" r="${n2(r)}" fill="none" stroke="${cr}" stroke-opacity="${n2(Math.max(.05, .75 - k * .05))}" stroke-width="${n2(Math.max(.2, 2.6 - k * .17))}"/>`; }
  // branches
  let br = ''; let leaves = '';
  const grow = (x, y, a, len, wdt, d) => {
    if (d === 0 || len < 2) { const n = R.i(1, 2); for (let k = 0; k < n; k++) { const lx = x + R.r(-3, 3), ly = y + R.r(-2, 3), la = R.r(0, 180); const red = R() < .14; leaves += `<ellipse cx="${n2(lx)}" cy="${n2(ly)}" rx="${n2(R.r(1.4, 2.2))}" ry="${n2(R.r(.55, .9))}" transform="rotate(${n2(la)} ${n2(lx)} ${n2(ly)})" fill="${red ? cr : '#9C9187'}" fill-opacity="${red ? .95 : n2(R.r(.35, .75))}"/>`; } return; }
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    const mx = (x + x2) / 2 + R.r(-2, 2), my = (y + y2) / 2 + R.r(-2, 2);
    br += `<path d="M${n2(x)} ${n2(y)}Q${n2(mx)} ${n2(my)} ${n2(x2)} ${n2(y2)}" fill="none" stroke="${bone}" stroke-opacity="${n2(.35 + wdt * .2)}" stroke-width="${n2(wdt)}" stroke-linecap="round"/>`;
    const nb = d > 5 ? (R() < .75 ? 2 : 1) : (R() < .55 ? 1 : 2);
    if (d <= 4 && R() < .5) { const lx = x2 + R.r(-2, 2), ly = y2 + R.r(-1, 2); leaves += `<ellipse cx="${n2(lx)}" cy="${n2(ly)}" rx="1.7" ry=".7" transform="rotate(${n2(R.r(0, 180))} ${n2(lx)} ${n2(ly)})" fill="${R() < .15 ? cr : '#9C9187'}" fill-opacity=".6"/>`; }
    for (let k = 0; k < nb; k++) grow(x2, y2, a + R.r(-.35, .35) + (nb > 1 ? (k ? .42 : -.42) : 0) + .05, len * R.r(.72, .86), wdt * .72, d - 1);
  };
  grow(-6, 30, deg(4), 40, 2.8, 10);
  grow(216, 14, deg(172), 30, 2, 9);
  s += br + leaves;
  // falling leaves
  for (let k = 0; k < 42; k++) { const lx = R.r(10, 200), ly = R.r(100, 255); const red = R() < .3; s += `<ellipse cx="${n2(lx)}" cy="${n2(ly)}" rx="${n2(R.r(1.4, 2.2))}" ry=".7" transform="rotate(${n2(R.r(0, 180))} ${n2(lx)} ${n2(ly)})" fill="${red ? cr : '#9C9187'}" fill-opacity="${n2(red ? .9 : R.r(.2, .5) * (1 - (ly - 100) / 220))}"/>`; }
  // piano
  const ky = 284; for (let k = 0; k < 36; k++) s += `<rect x="${n2(k * 5.9)}" y="${ky}" width="5.6" height="14" fill="${bone}" fill-opacity=".16"/>`;
  for (let k = 0; k < 36; k++) { if ([2, 6].includes(k % 7)) continue; s += `<rect x="${n2(k * 5.9 + 4.1)}" y="${ky}" width="3.4" height="8.5" fill="#070505"/>`; }
  s += T(14, 279, 'STRANGE FRUIT · А. МИРОПОЛ, 1937 · B. HOLIDAY, 1939 · N. SIMONE, 1965', { s: 1.75, c: bone, op: .55 });
  return svgWrap(s);
};

/* 08 — GUILT TRIP: Leo dissolving, mist, road */
A.t8 = function () {
  const R = rnd(88); const pale = '#8FB0EA', fg = '#DCE3F0'; const id = uid('t8');
  let s = IMG('t8-mist.jpg');
  s += `<defs><radialGradient id="${id}st" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#cfe0ff" stop-opacity=".6"/><stop offset="1" stop-color="#8FB0EA" stop-opacity="0"/></radialGradient></defs>`;
  for (let k = 0; k < 420; k++) { const y = Math.pow(R(), 1.4) * 230; s += `<circle cx="${n2(R.r(0, 210))}" cy="${n2(y)}" r="${n2(R.r(.08, .38))}" fill="#fff" fill-opacity="${n2(R.r(.15, .85) * (1 - y / 260))}"/>`; }
  // Leo
  const ox = 36, oy = 46, sc = 1.22;
  const L = { reg: [10, 72], eta: [16, 52], alg: [22, 36], adh: [16, 22], ras: [26, 12], eps: [40, 16], zos: [92, 34], den: [128, 56], che: [90, 56] };
  const p = k => [ox + L[k][0] * sc, oy + L[k][1] * sc];
  const lines = [['reg', 'eta'], ['eta', 'alg'], ['alg', 'adh'], ['adh', 'ras'], ['ras', 'eps'], ['alg', 'zos'], ['zos', 'den'], ['den', 'che'], ['che', 'reg'], ['zos', 'che']];
  lines.forEach(([a, b], i) => { const A1 = p(a), B1 = p(b); const dis = i > 5; s += `<line x1="${n2(A1[0])}" y1="${n2(A1[1])}" x2="${n2(B1[0])}" y2="${n2(B1[1])}" stroke="${pale}" stroke-opacity="${dis ? .35 : .75}" stroke-width=".25" ${dis ? 'stroke-dasharray="1.4 1.6"' : ''}/>`; });
  Object.keys(L).forEach((k, i) => { const [x, y] = p(k); const big = ['reg', 'den', 'alg'].includes(k); s += `<circle cx="${n2(x)}" cy="${n2(y)}" r="${big ? 6 : 4}" fill="url(#${id}st)"/><circle cx="${n2(x)}" cy="${n2(y)}" r="${big ? .9 : .6}" fill="#fff"/>`; });
  // dissolving trail from Denebola
  const [dx, dy] = p('den'); for (let k = 0; k < 120; k++) { const t = R(); s += `<circle cx="${n2(dx + t * 60 + R.g() * 3)}" cy="${n2(dy + t * 34 + R.g() * 3 * t)}" r="${n2(R.r(.1, .45) * (1 - t))}" fill="${fg}" fill-opacity="${n2((1 - t) * .8)}"/>`; }
  const lab = (k, txt, dx2, dy2) => { const [x, y] = p(k); return T(x + dx2, y + dy2, txt, { s: 1.8, c: pale, w: 600 }); };
  s += lab('reg', 'LEOS', -4, 9) + lab('zos', 'TRIOS', 3, -4) + lab('den', 'RIO', 4, -3) + T(ox, oy - 6, 'LEO · СОЗВЕЗДИЕ, КОТОРОЕ НЕ СКЛАДЫВАЕТСЯ', { s: 1.7, c: fg, op: .55 });
  // road
  const hz = 236; s += `<rect y="${hz}" width="210" height="${297 - hz}" fill="#050810" fill-opacity=".72"/>`;
  s += `<path d="M104 ${hz}L106 ${hz}L176 297L34 297Z" fill="#0b1222"/>`;
  for (let k = 0; k < 9; k++) { const t0 = Math.pow(k / 9, 1.8), t1 = Math.pow((k + .45) / 9, 1.8); const y0 = lerp(hz, 297, t0), y1 = lerp(hz, 297, t1); const w0 = lerp(.2, 1.6, t0), w1 = lerp(.2, 1.6, t1); s += `<path d="M${n2(105 - w0 / 2)} ${n2(y0)}L${n2(105 + w0 / 2)} ${n2(y0)}L${n2(105 + w1 / 2)} ${n2(y1)}L${n2(105 - w1 / 2)} ${n2(y1)}Z" fill="${fg}" fill-opacity=".6"/>`; }
  s += `<line x1="0" x2="210" y1="${hz}" y2="${hz}" stroke="${pale}" stroke-opacity=".35" stroke-width=".2"/>`;
  return svgWrap(s);
};

/* 09 — SEND IT UP: siren, crowd, velvet rope, memories */
A.t9 = function () {
  const R = rnd(99); const id = uid('t9'); let s = `<rect width="210" height="297" fill="#090909"/>`;
  const bx = 105, by = 50;
  s += `<defs>
    <linearGradient id="${id}r1" gradientUnits="userSpaceOnUse" x1="${bx}" y1="${by}" x2="${bx - 200}" y2="${by + 70}"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".7"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}r2" gradientUnits="userSpaceOnUse" x1="${bx}" y1="${by}" x2="${bx + 200}" y2="${by - 40}"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".55"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}dome" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFD2C8"/><stop offset=".35" stop-color="#FF3B2E"/><stop offset="1" stop-color="#7a0c08"/></radialGradient>
    <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".55"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}post" x1="0" x2="1"><stop offset="0" stop-color="#5a5650"/><stop offset=".4" stop-color="#E9E3D6"/><stop offset=".7" stop-color="#8a857c"/><stop offset="1" stop-color="#3a3733"/></linearGradient>
    <linearGradient id="${id}rope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2453c"/><stop offset=".5" stop-color="#9b0f14"/><stop offset="1" stop-color="#4a0508"/></linearGradient></defs>`;
  for (let k = 1; k < 16; k++) s += `<circle cx="${bx}" cy="${by}" r="${n2(k * 12 + k * k * .4)}" fill="none" stroke="#FF2A1F" stroke-opacity="${n2(Math.max(.04, .5 - k * .03))}" stroke-width="${k % 3 === 0 ? .5 : .2}"/>`;
  s += `<path d="M${bx} ${by}L${bx - 230} ${by + 20}L${bx - 200} ${by + 120}Z" fill="url(#${id}r1)"/>`;
  s += `<path d="M${bx} ${by}L${bx + 230} ${by - 70}L${bx + 220} ${by + 10}Z" fill="url(#${id}r2)"/>`;
  s += `<circle cx="${bx}" cy="${by}" r="40" fill="url(#${id}glow)"/>`;
  s += `<rect x="${bx - 11}" y="${by + 6}" width="22" height="5" rx="1" fill="#1d1d1d" stroke="#444" stroke-width=".25"/>`;
  s += `<path d="M${bx - 9} ${by + 6}V${by - 2}A9 9 0 0 1 ${bx + 9} ${by - 2}V${by + 6}Z" fill="url(#${id}dome)"/>`;
  for (let k = 0; k < 5; k++) s += `<line x1="${bx - 9}" x2="${bx + 9}" y1="${by - 1 + k * 1.6}" y2="${by - 1 + k * 1.6}" stroke="#fff" stroke-opacity=".18" stroke-width=".2"/>`;
  // crowd
  for (let row = 0; row < 7; row++) { const y = 196 + row * 6.5; const sz = 1.6 + row * .45; for (let x = R.r(-4, 2); x < 214; x += sz * 2.2 + R.r(0, 1.4)) { const yy = y + R.r(-1.2, 1.2); s += `<circle cx="${n2(x)}" cy="${n2(yy)}" r="${n2(sz)}" fill="${row < 2 ? '#1b1010' : '#120c0c'}"/><path d="M${n2(x - sz * 1.9)} ${n2(yy + sz * 3.6)}Q${n2(x)} ${n2(yy + sz * .7)} ${n2(x + sz * 1.9)} ${n2(yy + sz * 3.6)}Z" fill="${row < 2 ? '#1b1010' : '#120c0c'}"/>`; if (R() < .25) s += `<path d="M${n2(x - sz * .9)} ${n2(yy - sz * .6)}A${n2(sz)} ${n2(sz)} 0 0 1 ${n2(x + sz * .2)} ${n2(yy - sz)}" fill="none" stroke="#FF2A1F" stroke-opacity=".7" stroke-width=".3"/>`; } }
  s += `<rect x="0" y="236" width="210" height="61" fill="#090909"/>`;
  // memories echo
  for (let k = 0; k < 6; k++) s += T(105, 250 + k * 6.6, 'M E M O R I E S', { a: 'middle', s: 4.6 - k * .2, c: '#FF2A1F', op: n2(.55 - k * .085), w: 600, ls: 1.4 });
  // stanchions + rope
  const posts = [42, 168], top = 246, base = 290;
  s += `<path d="M${posts[0] + 1.5} ${top + 2}C${posts[0] + 40} ${top + 34} ${posts[1] - 40} ${top + 34} ${posts[1] - 1.5} ${top + 2}" fill="none" stroke="#300306" stroke-width="3.6"/>`;
  s += `<path d="M${posts[0] + 1.5} ${top + 1.4}C${posts[0] + 40} ${top + 33} ${posts[1] - 40} ${top + 33} ${posts[1] - 1.5} ${top + 1.4}" fill="none" stroke="url(#${id}rope)" stroke-width="2.8"/>`;
  s += `<path d="M${posts[0] + 1.5} ${top + .6}C${posts[0] + 40} ${top + 32} ${posts[1] - 40} ${top + 32} ${posts[1] - 1.5} ${top + .6}" fill="none" stroke="#ff8a80" stroke-opacity=".5" stroke-width=".3"/>`;
  posts.forEach(px => { s += `<ellipse cx="${px}" cy="${base}" rx="9" ry="2.2" fill="url(#${id}post)"/><rect x="${px - 1.4}" y="${top}" width="2.8" height="${base - top}" fill="url(#${id}post)"/><circle cx="${px}" cy="${top - 1.6}" r="2.6" fill="url(#${id}post)"/>`; });
  return svgWrap(s);
};

/* 10 — BOUND 2: arched window, sunset, cross of light on the floor */
A.t10 = function () {
  const R = rnd(1010); const id = uid('t10'); const warm = '#2A1A12';
  let s = `<rect width="210" height="297" fill="#F3E8D8"/>`;
  const x0 = 46, x1 = 164, ytop = 32, ybot = 196; const rA = (x1 - x0) / 2, cxw = (x0 + x1) / 2, ya = ytop + rA;
  const win = (inset) => `M${x0 + inset} ${ybot - inset}V${ya}A${rA - inset} ${rA - inset} 0 0 1 ${x1 - inset} ${ya}V${ybot - inset}Z`;
  s += `<defs><clipPath id="${id}w"><path d="${win(5)}"/></clipPath>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9D9B2"/><stop offset=".35" stop-color="#F6A877"/><stop offset=".62" stop-color="#EE7448"/><stop offset=".8" stop-color="#D2552C"/><stop offset="1" stop-color="#9B3B26"/></linearGradient>
    <radialGradient id="${id}sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF3D6"/><stop offset=".45" stop-color="#FFD597"/><stop offset="1" stop-color="#F7A060" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6C2" stop-opacity=".95"/><stop offset="1" stop-color="#FFD9A8" stop-opacity=".25"/></linearGradient></defs>`;
  // wall shading
  s += `<rect width="210" height="297" fill="#EBDDC8" fill-opacity=".5"/>`;
  // light patch on floor (skewed window)
  const fy0 = 214; const sk = (x, y) => [x + (y - fy0) * .9 + 18, y];
  const patch = []; for (let a = 180; a <= 360; a += 6) { const xx = cxw + Math.cos(deg(a)) * (rA - 5), yy = fy0 + (Math.sin(deg(a)) + 1) * 14; patch.push(sk(xx, yy)); }
  patch.push(sk(x1 - 5, 286), sk(x0 + 5, 286));
  s += `<path d="${PC(patch)}" fill="url(#${id}floor)"/>`;
  s += `<path d="${PC([sk(cxw - 1.5, fy0), sk(cxw + 1.5, fy0), sk(cxw + 1.5, 286), sk(cxw - 1.5, 286)])}" fill="#EBDDC8"/>`;
  s += `<path d="${PC([sk(x0 + 5, 248), sk(x1 - 5, 248), sk(x1 - 5, 251), sk(x0 + 5, 251)])}" fill="#EBDDC8"/>`;
  s += `<line x1="0" x2="210" y1="206" y2="206" stroke="${warm}" stroke-opacity=".18" stroke-width=".3"/>`;
  // view
  s += `<g clip-path="url(#${id}w)"><rect x="${x0}" y="${ytop}" width="${x1 - x0}" height="${ybot - ytop}" fill="url(#${id}sky)"/>`;
  for (let k = 0; k < 7; k++) { const y = 70 + k * 9 + R.r(-3, 3); const x = R.r(x0 - 10, x1 - 40); s += `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(R.r(30, 70))}" height="${n2(R.r(.8, 2.2))}" rx="1" fill="#FFE9D2" fill-opacity="${n2(R.r(.3, .6))}"/>`; }
  s += `<circle cx="120" cy="160" r="30" fill="url(#${id}sun)"/><circle cx="120" cy="160" r="11" fill="#FFF0D0"/>`;
  // mesas
  const mesa = (pts, fill) => `<path d="${PC(pts)}" fill="${fill}"/>`;
  s += mesa([[x0, 170], [60, 170], [64, 150], [70, 148], [84, 148], [88, 152], [92, 170], [124, 170], [128, 158], [131, 156], [138, 156], [141, 162], [146, 170], [x1, 170], [x1, 200], [x0, 200]], '#B25B40');
  s += mesa([[x0, 178], [74, 178], [78, 160], [80, 132], [86, 130], [92, 131], [96, 158], [100, 178], [140, 178], [143, 166], [150, 164], [154, 178], [x1, 178], [x1, 200], [x0, 200]], '#7A3022');
  s += mesa([[x0, 186], [x1, 183], [x1, 200], [x0, 200]], '#4B1C14');
  s += `</g>`;
  // frame + mullions (cross)
  s += `<path d="${win(0)}" fill="none" stroke="#FBF5EC" stroke-width="10"/>`;
  s += `<path d="${win(-5)}" fill="none" stroke="${warm}" stroke-opacity=".25" stroke-width=".3"/><path d="${win(5)}" fill="none" stroke="${warm}" stroke-opacity=".35" stroke-width=".3"/>`;
  s += `<rect x="${cxw - 1.6}" y="${ytop + 4}" width="3.2" height="${ybot - ytop - 8}" fill="#FBF5EC"/><rect x="${x0 + 4}" y="128" width="${x1 - x0 - 8}" height="3.2" fill="#FBF5EC"/>`;
  s += `<rect x="${x0 - 9}" y="${ybot}" width="${x1 - x0 + 18}" height="5" fill="#FBF5EC" stroke="${warm}" stroke-opacity=".2" stroke-width=".25"/>`;
  // a single drop on the glass
  s += `<path d="M138 104q1.6 3.4 0 5.2q-1.6 -1.8 0 -5.2z" fill="#fff" fill-opacity=".85"/><line x1="138" y1="110" x2="138.2" y2="121" stroke="#fff" stroke-opacity=".45" stroke-width=".3"/>`;
  s += T(cxw, ybot + 12, 'JESUS WEPT · ИН. 11:35', { a: 'middle', s: 1.9, c: warm, op: .6, w: 600 });
  return svgWrap(s);
};
