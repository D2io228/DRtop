/* ===================================================================
   Track art — one world per song
   =================================================================== */

/* 01 — ON SIGHT: signal, tear, choir */
A.t1 = function () {
  const R = rnd(11); const cut = 196; const id = uid('t1');
  let s = IMG('t1-church.jpg');
  const tear = (() => { const pts = [[0, 0], [210, 0]]; const e = []; for (let x = 210; x >= 0; x -= R.r(1.2, 3.2)) e.push([x, cut + R.r(-2.2, 2.2)]); return { clip: PC(pts.concat(e, [[0, cut]])), edge: P(e) }; })();
  s += `<defs><clipPath id="${id}top"><path d="${tear.clip}"/></clipPath>
    <linearGradient id="${id}robe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bdb3a4"/><stop offset=".45" stop-color="#FFF8EC"/><stop offset="1" stop-color="#d9cfbf"/></linearGradient></defs>`;
  // choir in white robes, lit from above
  const rows = [[244, .62, 21, .55], [254, .74, 18, .7], [266, .88, 15, .85], [280, 1.05, 12, 1]];
  rows.forEach(([y, sc, n, op], ri) => {
    const span = 176 * (0.8 + ri * .07); const x0 = 105 - span / 2;
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + .5) * span / n + (ri % 2 ? 2 : 0) + R.r(-.6, .6);
      const h = 10.5 * sc, w = 5.4 * sc, hr = 1.25 * sc; const sway = R.r(-.6, .6) * sc;
      s += `<ellipse cx="${n2(x)}" cy="${n2(y + .4)}" rx="${n2(w * .6)}" ry="${n2(.7 * sc)}" fill="#000" fill-opacity=".5"/>`;
      s += `<path d="M${n2(x - w * .2)} ${n2(y - h + hr * 1.7)}C${n2(x - w * .42)} ${n2(y - h * .78)} ${n2(x - w * .5)} ${n2(y - h * .55)} ${n2(x - w * .34)} ${n2(y - h * .48)}C${n2(x - w * .4)} ${n2(y - h * .25)} ${n2(x - w * .62 + sway)} ${n2(y - h * .1)} ${n2(x - w * .58 + sway)} ${n2(y)}L${n2(x + w * .58 + sway)} ${n2(y)}C${n2(x + w * .62 + sway)} ${n2(y - h * .1)} ${n2(x + w * .4)} ${n2(y - h * .25)} ${n2(x + w * .34)} ${n2(y - h * .48)}C${n2(x + w * .5)} ${n2(y - h * .55)} ${n2(x + w * .42)} ${n2(y - h * .78)} ${n2(x + w * .2)} ${n2(y - h + hr * 1.7)}Z" fill="url(#${id}robe)" fill-opacity="${op}"/>`;
      s += `<path d="M${n2(x - w * .3)} ${n2(y - h * .5)}Q${n2(x)} ${n2(y - h * .42)} ${n2(x + w * .3)} ${n2(y - h * .5)}" fill="none" stroke="#8d8273" stroke-opacity="${n2(op * .5)}" stroke-width=".15"/>`;
      s += `<path d="M${n2(x - w * .12)} ${n2(y - h * .62)}Q${n2(x - w * .2)} ${n2(y - h * .3)} ${n2(x - w * .24)} ${n2(y)}" fill="none" stroke="#8d8273" stroke-opacity="${n2(op * .6)}" stroke-width=".18"/>`;
      s += `<ellipse cx="${n2(x)}" cy="${n2(y - h + hr * .45)}" rx="${n2(hr * .92)}" ry="${n2(hr * 1.12)}" fill="#F3EDE2" fill-opacity="${op}"/>`;
    }
  });
  // upper world
  s += `<g clip-path="url(#${id}top)">${IMG('t1-top.jpg')}`;
  for (let x = 0; x <= 210; x += 15) s += `<line x1="${x}" x2="${x}" y1="0" y2="${cut}" stroke="#fff" stroke-opacity=".05" stroke-width=".15"/>`;
  const pts = []; const yc = 96, per = 27;
  for (let x = -4; x <= 214; x += .25) { const ph = ((x + 6) % per) / per; let v = (1 - ph) * 2 - 1; v += Math.exp(-ph * 9) * Math.sin(ph * 70) * .55; pts.push([x, yc - v * 30]); }
  const d = P(pts);
  s += `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="3.2"/>`;
  s += `<path d="${d}" fill="none" stroke="${RED}" stroke-width="1.2" transform="translate(1.4 .6)"/>`;
  s += `<path d="${d}" fill="none" stroke="#fff" stroke-width=".7"/>`;
  [['CUTOFF', .78], ['RESO', .93], ['ENV', .64], ['DIST', 1]].forEach(([l, v], i) => { const x = 140 + i * 15, y = 30; s += `<circle cx="${x}" cy="${y}" r="4.2" fill="#0A0A0A" fill-opacity=".7" stroke="#fff" stroke-opacity=".5" stroke-width=".25"/><line x1="${x}" y1="${y}" x2="${n2(x + Math.cos(deg(-225 + v * 270)) * 3.4)}" y2="${n2(y + Math.sin(deg(-225 + v * 270)) * 3.4)}" stroke="${RED}" stroke-width=".5"/>` + T(x, y + 8, l, { a: 'middle', s: 1.7, c: '#fff', op: .7 }); });
  s += `</g>`;
  s += `<path d="${tear.edge}" fill="none" stroke="#FFE8C4" stroke-opacity=".75" stroke-width=".35"/>`;
  s += T(196, cut + 34, 'СТОП ▮▮ → ХОР', { a: 'end', s: 1.9, c: '#E8D2AE', w: 600 });
  return svgWrap(s);
};

/* 02 — BLACK SKINHEAD: tower, searchlights, viewfinder */
A.t2 = function () {
  const id = uid('t2'); let s = IMG('t2-body.jpg');
  const bx = 138, sc = 205 / 1.78, gy = 262; const Y = h => gy - h * sc;
  // viewfinder
  const m = 12, L = 9; [[m, m, 1, 1], [210 - m, m, -1, 1], [m, 297 - m, 1, -1], [210 - m, 297 - m, -1, -1]].forEach(([x, y, sx, sy]) => s += `<path d="M${x} ${y + sy * L}V${y}H${x + sx * L}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".35"/>`);
  s += `<circle cx="170" cy="22.3" r="1.3" fill="${RED}"/>` + T(173, 23, 'REC', { s: 2.2, c: '#fff', w: 600 }) + T(184, 23, '03:08', { s: 2.2, c: '#fff', op: .7 });
  // head target
  const hy = Y(1.655); s += `<circle cx="${bx}" cy="${n2(hy)}" r="13" fill="none" stroke="${RED}" stroke-width=".35"/><circle cx="${bx}" cy="${n2(hy)}" r="17" fill="none" stroke="${RED}" stroke-opacity=".45" stroke-width=".2" stroke-dasharray="1 1.2"/>`;
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => s += `<line x1="${bx + dx * 9}" y1="${n2(hy + dy * 9)}" x2="${bx + dx * 20}" y2="${n2(hy + dy * 20)}" stroke="${RED}" stroke-width=".3"/>`);
  // height ruler
  for (let h = 0; h <= 1.8001; h += .05) { const y = Y(h); const big = Math.abs(h * 10 - Math.round(h * 10)) < .01; s += `<line x1="186" x2="${big ? 191 : 189}" y1="${n2(y)}" y2="${n2(y)}" stroke="#fff" stroke-opacity=".5" stroke-width=".15"/>`; if (Math.abs(h * 2 - Math.round(h * 2)) < .01) s += T(192.5, y + .7, h.toFixed(1), { s: 1.6, c: '#fff', op: .6 }); }
  s += T(186, Y(1.82), 'М', { s: 1.6, c: '#fff', op: .6 });
  // scan readout
  const scy = Y(1.30); s += T(14, scy - 1.2, 'SCAN 1.30 М', { s: 1.9, c: RED, w: 600 }) + T(14, scy + 2.2, 'ПРОХОД 07 / 12', { s: 1.6, c: '#fff', op: .55 });
  // classification labels — the public assigns meaning to the body
  const lab = (px, py, tx, ty, t1, t2) => `<path d="M${px} ${py}L${tx} ${ty}H${tx + (tx < px ? -2 : 2)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".15"/><rect x="${px - .8}" y="${py - .8}" width="1.6" height="1.6" fill="none" stroke="${RED}" stroke-width=".3"/>` + T(tx + (tx < px ? -3 : 3), ty + .8, t1, { a: tx < px ? 'end' : 'start', s: 2, c: '#fff', w: 600 }) + T(tx + (tx < px ? -3 : 3), ty + 3.8, t2, { a: tx < px ? 'end' : 'start', s: 1.6, c: '#fff', op: .55 });
  s += lab(bx - 4, Y(1.62), 102, 52, 'УГРОЗА?', 'класс назначен заранее');
  s += lab(bx + 16, Y(1.36), 172, 98, 'ЗРЕЛИЩЕ?', 'знаменитость');
  s += lab(bx - 14, Y(1.05), 98, 128, 'ЧУДОВИЩЕ?', 'кинг-конг на вершине');
  s += lab(bx + 8, Y(.6), 172, 160, 'ТОВАР?', 'цена не указана');
  // step sequencer HUD
  const hits = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];
  hits.forEach((h, i) => s += `<rect x="${n2(146 + i * 3.4)}" y="31" width="2.4" height="2.4" fill="${h ? RED : 'none'}" stroke="#fff" stroke-opacity="${h ? 0 : .3}" stroke-width=".15"/>`);
  s += T(146, 38, 'STOMP · BREATH · CHANT', { s: 1.6, c: '#fff', op: .5 });
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
  let s = IMG('t3-cold.jpg');
  const cx = 105, cy = 124, r = 60;
  s += `<defs><radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#F7F7F5"/><stop offset="1" stop-color="#F1F1EE" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa0a8"/><stop offset=".45" stop-color="#ffffff"/><stop offset=".55" stop-color="#c9cdd2"/><stop offset="1" stop-color="#6c727a"/></linearGradient></defs>`;
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
  let s = IMG('t4-night.jpg');
  s += `<defs><linearGradient id="${id}bar" x1="0" x2="1"><stop offset="0" stop-color="#0c0b0a"/><stop offset=".35" stop-color="#5c5750"/><stop offset=".6" stop-color="#161412"/><stop offset="1" stop-color="#080707"/></linearGradient>
    <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  s += `<path d="M40 22L170 26L176 104L34 100Z" fill="#fff" fill-opacity=".05"/>`;
  s += `<ellipse cx="108" cy="66" rx="80" ry="46" fill="url(#${id}glow)"/>`;
  const tg = `M62 36H170V96H62L46 66Z`;
  s += `<path d="${tg}" fill="#F7F3EA" fill-opacity=".93"/><path d="${tg}" fill="none" stroke="#fff" stroke-width=".3"/>`;
  s += `<circle cx="58" cy="66" r="2.6" fill="#1a1918" stroke="#ccc" stroke-width=".3"/>`;
  s += `<path d="M58 66C40 60 26 44 14 18" fill="none" stroke="#d8d2c6" stroke-opacity=".6" stroke-width=".35"/>`;
  let x = 78; const barXs = []; while (x < 160) { const w = R.pick([.5, .5, .9, 1.3, 1.8]); s += `<rect x="${n2(x)}" y="44" width="${w}" height="38" fill="${ink}"/>`; barXs.push([x, w]); x += w + R.pick([.5, .9, 1.2]); }
  s += T(118, 89, '0  13  2013  0618  4  00', { a: 'middle', s: 2.4, c: ink, ls: .6 });
  s += T(68, 46, 'ЦЕНА', { s: 1.8, c: RED, w: 600 });
  // NOT FOR SALE stamp (SNL, May 2013)
  s += `<g transform="translate(132 76) rotate(-9)"><rect x="-21" y="-6" width="42" height="11" fill="none" stroke="${RED}" stroke-width=".7"/><rect x="-19.6" y="-4.6" width="39.2" height="8.2" fill="none" stroke="${RED}" stroke-width=".25"/>` + T(0, 1.6, 'NOT FOR SALE', { a: 'middle', s: 3.6, c: RED, w: 600, ls: .6 }) + `</g>`;
  const bars = []; for (let bx = 122; bx <= 196; bx += 9.2) bars.push(bx);
  bars.forEach((bx, i) => { const src = barXs[Math.min(barXs.length - 1, Math.floor(i * barXs.length / bars.length))]; s += `<path d="M${n2(src[0] + src[1] / 2)} 82L${bx + 1.3} 100" stroke="#ddd" stroke-opacity=".35" stroke-width=".15"/>`; });
  bars.forEach(bx => s += `<rect x="${bx}" y="100" width="2.6" height="197" fill="url(#${id}bar)"/><rect x="${bx + .9}" y="100" width=".35" height="197" fill="#FFD9A0" fill-opacity=".35"/>`);
  [176, 236].forEach(y => s += `<rect x="118" y="${y}" width="92" height="3" fill="#0e0d0c"/><rect x="118" y="${y}" width="92" height=".6" fill="#FFD9A0" fill-opacity=".45"/>`);
  s += T(196, 270, 'OMEGA · GYÖNGYHAJÚ LÁNY · 1969', { a: 'end', s: 1.8, c: '#FFE2B0', w: 600 });
  s += T(14, 20, '17.05.2013 · ПРОЕКЦИЯ · 66 ЗДАНИЙ', { s: 1.8, c: '#EDE7DD', op: .7 });
  return svgWrap(s);
};

/* 05 — HOLD MY LIQUOR: tilted glass, loop, guitar string */
A.t5 = function () {
  const R = rnd(55); const id = uid('t5'); const am = '#E0962F', bone = '#EADFCC';
  let s = IMG('t5-bar.jpg');
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
  const id = uid('t6'); let s = IMG('t6-tunnel.jpg');
  const cx = 108, cy = 196; let w = 230, h = 300;
  s += `<defs><radialGradient id="${id}c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#FF8A70" stop-opacity=".8"/><stop offset="1" stop-color="#FF3B2E" stop-opacity="0"/></radialGradient></defs>`;
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = i / N; const sc = Math.pow(.88, i); const ww = w * sc, hh = h * sc; const x = lerp(105, cx, t), y = lerp(150, cy - 20, t);
    s += `<rect x="${n2(x - ww / 2)}" y="${n2(y - hh / 2)}" width="${n2(ww)}" height="${n2(hh)}" fill="none" stroke="${i % 5 === 0 ? '#FFD0C4' : '#FF3B2E'}" stroke-opacity="${n2(.25 + t * .75)}" stroke-width="${n2(.9 - t * .6)}" transform="rotate(${n2(i * 3.4)} ${n2(x)} ${n2(y)})"/>`;
  }
  
  // breath bands
  for (let k = 0; k < 4; k++) { const p = []; const by = 240 + k * 7; for (let x = 0; x <= 210; x += .6) p.push([x, by + Math.sin(x * .07 + k) * 3 * Math.sin(x * .013 + k * .5)]); s += `<path d="${P(p)}" fill="none" stroke="#FFC2B6" stroke-opacity="${n2(.28 - k * .05)}" stroke-width=".35"/>`; }
  const fx = cx, fy = cy - 13.5; s += `<circle cx="${fx}" cy="${fy - 5.6}" r=".9" fill="#1a0202"/><path d="M${fx - 1.1} ${fy - 4.6}L${fx + 1.1} ${fy - 4.6}L${fx + 1.3} ${fy - 1.2}L${fx + .7} ${fy - 1.2}L${fx + .55} ${fy + 1.8}L${fx + .1} ${fy + 1.8}L${fx} ${fy - .6}L${fx - .1} ${fy + 1.8}L${fx - .55} ${fy + 1.8}L${fx - .7} ${fy - 1.2}L${fx - 1.3} ${fy - 1.2}Z" fill="#1a0202"/>`;
  s += T(cx, cy - 3, 'ВЫ ЗДЕСЬ', { a: 'middle', s: 1.6, c: '#FFE6DE', w: 600, op: .9 });
  return svgWrap(s);
};

/* 07 — BLOOD ON THE LEAVES: branches, leaves, brass shockwave, piano */
A.t7 = function () {
  const R = rnd(77); const bone = '#E8E1D6', cr = '#B3141A'; let s = IMG('t7-night.jpg');
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
  let s = IMG('t8-road.jpg');
  s += `<defs><radialGradient id="${id}tl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3030" stop-opacity=".9"/><stop offset="1" stop-color="#ff3030" stop-opacity="0"/></radialGradient><radialGradient id="${id}st" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#cfe0ff" stop-opacity=".6"/><stop offset="1" stop-color="#8FB0EA" stop-opacity="0"/></radialGradient></defs>`;
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
  const hz = 236; s += `<rect y="${hz}" width="210" height="${297 - hz}" fill="#050810" fill-opacity=".45"/>`;
  s += `<path d="M104 ${hz}L106 ${hz}L176 297L34 297Z" fill="#0b1222" fill-opacity=".75"/>`;
  [104.2, 105.8].forEach(x => s += `<circle cx="${x}" cy="243" r="2.4" fill="url(#${id}tl)"/><circle cx="${x}" cy="243" r=".32" fill="#ff5a4a"/>`);
  for (let k = 0; k < 9; k++) { const t0 = Math.pow(k / 9, 1.8), t1 = Math.pow((k + .45) / 9, 1.8); const y0 = lerp(hz, 297, t0), y1 = lerp(hz, 297, t1); const w0 = lerp(.2, 1.6, t0), w1 = lerp(.2, 1.6, t1); s += `<path d="M${n2(105 - w0 / 2)} ${n2(y0)}L${n2(105 + w0 / 2)} ${n2(y0)}L${n2(105 + w1 / 2)} ${n2(y1)}L${n2(105 - w1 / 2)} ${n2(y1)}Z" fill="${fg}" fill-opacity=".6"/>`; }
  s += `<line x1="0" x2="210" y1="${hz}" y2="${hz}" stroke="${pale}" stroke-opacity=".35" stroke-width=".2"/>`;
  return svgWrap(s);
};

/* 09 — SEND IT UP: siren, crowd, velvet rope, memories */
A.t9 = function () {
  const R = rnd(99); const id = uid('t9'); let s = IMG('t9-haze.jpg');
  const bx = 105, by = 50;
  s += `<defs>
    <linearGradient id="${id}r1" gradientUnits="userSpaceOnUse" x1="${bx}" y1="${by}" x2="${bx - 200}" y2="${by + 70}"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".7"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}r2" gradientUnits="userSpaceOnUse" x1="${bx}" y1="${by}" x2="${bx + 200}" y2="${by - 40}"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".55"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}dome" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFD2C8"/><stop offset=".35" stop-color="#FF3B2E"/><stop offset="1" stop-color="#7a0c08"/></radialGradient>
    <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF2A1F" stop-opacity=".55"/><stop offset="1" stop-color="#FF2A1F" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}post" x1="0" x2="1"><stop offset="0" stop-color="#5a5650"/><stop offset=".4" stop-color="#E9E3D6"/><stop offset=".7" stop-color="#8a857c"/><stop offset="1" stop-color="#3a3733"/></linearGradient>
    <linearGradient id="${id}rope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2453c"/><stop offset=".5" stop-color="#9b0f14"/><stop offset="1" stop-color="#4a0508"/></linearGradient></defs>`;
  for (let k = 1; k < 16; k++) s += `<circle cx="${bx}" cy="${by}" r="${n2(k * 12 + k * k * .4)}" fill="none" stroke="#FF2A1F" stroke-opacity="${n2(Math.max(.04, .5 - k * .03))}" stroke-width="${k % 3 === 0 ? .5 : .2}"/>`;

  s += `<rect x="${bx - 11}" y="${by + 6}" width="22" height="5" rx="1" fill="#1d1d1d" stroke="#444" stroke-width=".25"/>`;
  s += `<path d="M${bx - 9} ${by + 6}V${by - 2}A9 9 0 0 1 ${bx + 9} ${by - 2}V${by + 6}Z" fill="url(#${id}dome)"/>`;
  for (let k = 0; k < 5; k++) s += `<line x1="${bx - 9}" x2="${bx + 9}" y1="${by - 1 + k * 1.6}" y2="${by - 1 + k * 1.6}" stroke="#fff" stroke-opacity=".18" stroke-width=".2"/>`;
  // crowd
  for (let row = 0; row < 7; row++) { const y = 196 + row * 6.5; const sz = 1.6 + row * .45; for (let x = R.r(-4, 2); x < 214; x += sz * 2.2 + R.r(0, 1.4)) { const yy = y + R.r(-1.2, 1.2); s += `<circle cx="${n2(x)}" cy="${n2(yy)}" r="${n2(sz)}" fill="${row < 2 ? '#1a0b0b' : '#0b0606'}"/><path d="M${n2(x - sz * 1.9)} ${n2(yy + sz * 3.6)}Q${n2(x)} ${n2(yy + sz * .7)} ${n2(x + sz * 1.9)} ${n2(yy + sz * 3.6)}Z" fill="${row < 2 ? '#1a0b0b' : '#0b0606'}"/>`; if (R() < .25) s += `<path d="M${n2(x - sz * .9)} ${n2(yy - sz * .6)}A${n2(sz)} ${n2(sz)} 0 0 1 ${n2(x + sz * .2)} ${n2(yy - sz)}" fill="none" stroke="#FF2A1F" stroke-opacity=".7" stroke-width=".3"/>`; } }
  s += `<defs><linearGradient id="${id}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090909" stop-opacity=".6"/><stop offset=".25" stop-color="#090909" stop-opacity=".95"/><stop offset="1" stop-color="#090909"/></linearGradient></defs><rect x="0" y="236" width="210" height="61" fill="url(#${id}fl)"/>`;
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
A.horse = function (x, y, sc, flip, col) {
  const d = 'M9 7C14 5 24 5 28 7L33 1L35 0L35.5 1.5C38 2.5 40 4 40.5 6L38.5 7C36 6 34 6 31 9.5C31 11 30 13 29 13.5L34 17L37 19.5L36 20.5L32.5 18L28 15.5L26 18L25 21.5L24 21.5L24.5 17.5L25 14.5C20 15 15 15 12 14L13 17L15 21L14 21.5L11 17.5L9.5 15.5L5 18L1.5 19.5L1 18.5L4.5 16.5L7 13C5 12 3 13 0 15C2 11 5 9 9 7Z';
  return `<path d="${d}" fill="${col}" transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc}) translate(${flip ? -40 : 0} 0)"/>`;
};
A.t10 = function () {
  const R = rnd(1010); const id = uid('t10'); const warm = '#2A1A12';
  let s = IMG('t10-room.jpg');
  const x0 = 46, x1 = 164, ytop = 32, ybot = 196; const rA = (x1 - x0) / 2, cxw = (x0 + x1) / 2, ya = ytop + rA;
  const win = (inset) => `M${x0 + inset} ${ybot - inset}V${ya}A${rA - inset} ${rA - inset} 0 0 1 ${x1 - inset} ${ya}V${ybot - inset}Z`;
  s += `<defs><clipPath id="${id}w"><path d="${win(5)}"/></clipPath><filter id="${id}sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>`;
  // phony horses moving in contrasting directions
  s += `<g clip-path="url(#${id}w)">${A.horse(60, 180.5, .26, false, '#3a160f')}${A.horse(70, 182, .2, false, '#3a160f')}${A.horse(128, 181, .24, true, '#3a160f')}${A.horse(141, 183.5, .18, false, '#3a160f')}</g>`;
  s += `<path d="${win(0)}" transform="translate(3 4)" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="10" filter="url(#${id}sh)"/>`;
  s += `<path d="${win(0)}" fill="none" stroke="#FBF5EC" stroke-width="10"/>`;
  s += `<path d="${win(-5)}" fill="none" stroke="${warm}" stroke-opacity=".25" stroke-width=".3"/><path d="${win(5)}" fill="none" stroke="${warm}" stroke-opacity=".35" stroke-width=".3"/>`;
  s += `<rect x="${cxw - 1.6}" y="${ytop + 4}" width="3.2" height="${ybot - ytop - 8}" fill="#FBF5EC"/><rect x="${x0 + 4}" y="128" width="${x1 - x0 - 8}" height="3.2" fill="#FBF5EC"/>`;
  s += `<rect x="${x0 - 9}" y="${ybot}" width="${x1 - x0 + 18}" height="5" fill="#FBF5EC" stroke="${warm}" stroke-opacity=".2" stroke-width=".25"/>`;
  s += `<path d="M138 104q1.6 3.4 0 5.2q-1.6 -1.8 0 -5.2z" fill="#fff" fill-opacity=".9"/><line x1="138" y1="110" x2="138.2" y2="121" stroke="#fff" stroke-opacity=".5" stroke-width=".3"/>`;
  s += T(cxw, ybot + 12, 'JESUS WEPT · ИН. 11:35', { a: 'middle', s: 1.9, c: warm, op: .6, w: 600 });
  s += T(x1 + 4, 60, '«AS PHONY', { s: 1.7, c: warm, op: .55, w: 600 }) + T(x1 + 4, 63.2, 'AS POSSIBLE»', { s: 1.7, c: warm, op: .55, w: 600 });
  return svgWrap(s);
};
