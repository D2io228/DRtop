/* ===================================================================
   Infographics: tension profile, radial album map, tour stage blueprint
   =================================================================== */
const GOLD = '#E8C27A';
const DUR = [156, 188, 231, 256, 326, 234, 360, 243, 178, 229];
/* interpretive intensity profile: returns [value 0..1, tender?] */
A.PROFILE = function (i, u, R) {
  const j = (a) => (R ? (R() - .5) * a : 0);
  switch (i) {
    case 0: return (u > .42 && u < .56) ? [.22 + j(.08), true] : [.82 + j(.3) * (u < .04 ? 0 : 1) * Math.min(1, u * 20), false];
    case 1: return [.88 + .1 * Math.abs(Math.sin(u * 80)) + j(.06), false];
    case 2: return [Math.random && R && R() < .07 ? 1 : .62 + j(.3), false];
    case 3: return u >= .71 ? [.3 + j(.08), true] : [.55 + u * .2 + j(.16), false];
    case 4: return u < .14 ? [.3 + j(.08), true] : u >= .7 ? [.62 + .1 * Math.sin(u * 60) + j(.1), true] : [.55 + j(.18), false];
    case 5: return [.72 + .12 * Math.sin(u * 50) + j(.16), false];
    case 6: return u < .17 ? [.28 + j(.1), true] : [.86 + j(.24), false];
    case 7: return u >= .8 ? [.34 + j(.08), true] : [.45 + .08 * Math.sin(u * 90) + j(.12), false];
    case 8: return u >= .86 ? [.5 + j(.1), true] : [.86 + j(.18), false];
    case 9: return [.5 + .08 * Math.sin(u * 40) + j(.12), R ? R() > .12 : true];
  }
  return [0, false];
};

/* album waveform for contents page */
A.albumWave = function (w, h) {
  const R = rnd(4001); const total = DUR.reduce((a, b) => a + b, 0); let s = ''; const N = 300; let acc = 0;
  DUR.forEach((d, i) => {
    const x0 = acc / total * w, x1 = (acc + d) / total * w; const n = Math.max(6, Math.round(N * d / total));
    for (let k = 0; k < n; k++) { const u = (k + .5) / n; const [v, td] = A.PROFILE(i, u, R); const x = x0 + (x1 - x0) * u; const hh = Math.max(.3, Math.min(1, v)) * h / 2;
      s += `<rect x="${n2(x)}" y="${n2(h / 2 - hh)}" width="${n2((x1 - x0) / n * .62)}" height="${n2(hh * 2)}" fill="${td ? GOLD : TRACKS[i].acc}"/>`; }
    s += `<line x1="${n2(x1)}" x2="${n2(x1)}" y1="-1.5" y2="${h + 1.5}" stroke="var(--bg)" stroke-width=".6"/>`;
    acc += d;
  });
  return `<svg viewBox="0 0 ${w} ${h}" style="width:${w}mm;height:${h}mm;overflow:visible;display:block">${s}</svg>`;
};

/* radial album map */
A.albumMap = function () {
  const R = rnd(777); const cx = 105, cy = 148, r0 = 33, L = 44; const total = DUR.reduce((a, b) => a + b, 0);
  let s = IMG('tx-limit.jpg'); const id = uid('am');
  s += `<defs><radialGradient id="${id}c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1c1a18"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient></defs>`;
  // grooves
  for (let rr = r0 + 2; rr < r0 + L + 4; rr += 1.3) s += `<circle cx="${cx}" cy="${cy}" r="${n2(rr)}" fill="none" stroke="#fff" stroke-opacity=".035" stroke-width=".2"/>`;
  [.25, .5, .75, 1].forEach(t => s += `<circle cx="${cx}" cy="${cy}" r="${n2(r0 + 2 + L * t)}" fill="none" stroke="#fff" stroke-opacity="${t === 1 ? .14 : .06}" stroke-width=".15" stroke-dasharray="${t === 1 ? '' : '.6 1'}"/>`);
  let acc = 0; const sectors = [];
  DUR.forEach((d, i) => {
    const a0 = -90 + acc / total * 360 + .6, a1 = -90 + (acc + d) / total * 360 - .6; sectors.push([a0, a1]);
    const n = Math.round((a1 - a0) / .55);
    for (let k = 0; k < n; k++) {
      const u = (k + .5) / n; const a = deg(a0 + (a1 - a0) * u); const [v, td] = A.PROFILE(i, u, R); const len = Math.max(.08, Math.min(1, v)) * L;
      const c = Math.cos(a), sn = Math.sin(a);
      s += `<line x1="${n2(cx + c * (r0 + 2))}" y1="${n2(cy + sn * (r0 + 2))}" x2="${n2(cx + c * (r0 + 2 + len))}" y2="${n2(cy + sn * (r0 + 2 + len))}" stroke="${td ? GOLD : TRACKS[i].acc}" stroke-width=".42" stroke-opacity="${td ? .95 : .9}"/>`;
    }
    // track labels on arcs
    const mid = (a0 + a1) / 2; const bottom = Math.sin(deg(mid)) > .15; const rr = r0 + L + (bottom ? 11.6 : 9.4);
    const pa = bottom ? [a1, a0] : [a0, a1]; const pid = uid('arc');
    const p0 = [cx + Math.cos(deg(pa[0])) * rr, cy + Math.sin(deg(pa[0])) * rr], p1 = [cx + Math.cos(deg(pa[1])) * rr, cy + Math.sin(deg(pa[1])) * rr];
    s += `<path id="${pid}" d="M${n2(p0[0])} ${n2(p0[1])}A${rr} ${rr} 0 0 ${bottom ? 0 : 1} ${n2(p1[0])} ${n2(p1[1])}" fill="none"/>`;
    s += `<text font-family="IBM Plex Mono" font-size="2.15" font-weight="600" letter-spacing=".3" fill="#E6E0D5"><textPath href="#${pid}" startOffset="50%" text-anchor="middle"><tspan fill="${TRACKS[i].acc}">${String(i + 1).padStart(2, '0')}</tspan> ${TRACKS[i].title.toUpperCase()}</textPath></text>`;
    s += `<line x1="${n2(cx + Math.cos(deg(a0 - .6)) * (r0 - 1))}" y1="${n2(cy + Math.sin(deg(a0 - .6)) * (r0 - 1))}" x2="${n2(cx + Math.cos(deg(a0 - .6)) * (r0 + L + 3))}" y2="${n2(cy + Math.sin(deg(a0 - .6)) * (r0 + L + 3))}" stroke="#fff" stroke-opacity=".18" stroke-width=".15"/>`;
    acc += d;
  });
  // chapter arcs (inner)
  const chs = [[0, 1], [2, 3], [4, 6], [7, 8], [9, 9]];
  chs.forEach(([i0, i1], ci) => { const a0 = sectors[i0][0], a1 = sectors[i1][1]; const rr = r0 - 4; const p0 = [cx + Math.cos(deg(a0)) * rr, cy + Math.sin(deg(a0)) * rr], p1 = [cx + Math.cos(deg(a1)) * rr, cy + Math.sin(deg(a1)) * rr];
    s += `<path d="M${n2(p0[0])} ${n2(p0[1])}A${rr} ${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n2(p1[0])} ${n2(p1[1])}" fill="none" stroke="#E6E0D5" stroke-opacity=".7" stroke-width=".5"/>`;
    const m = deg((a0 + a1) / 2); s += T(cx + Math.cos(m) * (rr - 4.5), cy + Math.sin(m) * (rr - 4.5) + .7, ['I', 'II', 'III', 'IV', 'V'][ci], { a: 'middle', s: 2, c: '#E6E0D5', w: 600, op: .8 }); });
  s += `<circle cx="${cx}" cy="${cy}" r="${r0 - 13}" fill="url(#${id}c)" stroke="#fff" stroke-opacity=".15" stroke-width=".2"/>`;
  s += `<text x="${cx}" y="${cy + 2.6}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="8.4" letter-spacing="-.35" fill="#E6E0D5">40:01</text>` + T(cx, cy + 7.6, 'YEEZUS', { a: 'middle', s: 1.8, c: RED, w: 600, ls: .9 });
  // annotations: lettered markers just outside the bars
  const marks = [[0, .49, 'A', 1], [1, .5, 'B', 0], [2, .5, 'C', 0], [3, .86, 'D', 1], [4, .85, 'E', 1], [6, .06, 'F', 1], [6, .4, 'G', 0], [7, .9, 'H', 1], [8, .93, 'I', 1], [9, .5, 'J', 1]];
  marks.forEach(([i, u, l, g]) => { const [a0, a1] = sectors[i]; const a = deg(a0 + (a1 - a0) * u); const rr = r0 + L + 4.2; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    s += `<circle cx="${n2(x)}" cy="${n2(y)}" r="2" fill="#0b0b0b" stroke="${g ? GOLD : TRACKS[i].acc}" stroke-width=".35"/>` + T(x, y + .72, l, { a: 'middle', s: 2, w: 600, c: g ? GOLD : '#E6E0D5', ls: 0 }); });
  return svgWrap(s);
};

/* tour stage blueprint */
A.stageArt = function () {
  const R = rnd(55); const ln = '#DCE3EA'; let s = `<rect width="210" height="297" fill="#0A0D11"/>`;
  for (let x = 0; x <= 210; x += 5) s += `<line x1="${x}" x2="${x}" y1="0" y2="297" stroke="${ln}" stroke-opacity="${x % 25 ? .025 : .06}" stroke-width=".12"/>`;
  for (let y = 0; y <= 297; y += 5) s += `<line x1="0" x2="210" y1="${y}" y2="${y}" stroke="${ln}" stroke-opacity="${y % 25 ? .025 : .06}" stroke-width=".12"/>`;
  const m = 6; const fl = 214; // 1 m = 6 mm
  // screen 18.3 m
  const sr = 18.3 * m / 2, scx = 105, scy = fl - 15.24 * m * .62 - sr * .55;
  s += `<circle cx="${scx}" cy="${n2(scy)}" r="${n2(sr)}" fill="#11161c" stroke="${ln}" stroke-width=".35"/>`;
  for (let k = 1; k < 8; k++) s += `<circle cx="${scx}" cy="${n2(scy)}" r="${n2(sr * k / 8)}" fill="none" stroke="${ln}" stroke-opacity=".07" stroke-width=".12"/>`;
  s += `<path d="M${n2(scx - sr)} ${n2(scy)}H${n2(scx + sr)}M${scx} ${n2(scy - sr)}V${n2(scy + sr)}" stroke="${ln}" stroke-opacity=".12" stroke-width=".12"/>`;
  // mountain 15.24 m
  const mh = 15.24 * m; const pk = fl - mh; const mp = [[40, fl]]; let x = 40;
  while (x < 105) { x += R.r(2, 5); mp.push([Math.min(x, 105), lerp(fl, pk, Math.min(1, (x - 40) / 65)) + R.r(-1.4, 1.4)]); }
  mp.push([105, pk]); x = 105; while (x < 170) { x += R.r(2, 5); mp.push([Math.min(x, 170), lerp(pk, fl, Math.min(1, (x - 105) / 65)) + R.r(-1.4, 1.4)]); }
  const mg = uid('mg'); s += `<defs><linearGradient id="${mg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3540"/><stop offset=".35" stop-color="#151b22"/><stop offset="1" stop-color="#0A0D11"/></linearGradient><pattern id="${mg}h" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="1.6" stroke="${ln}" stroke-opacity=".08" stroke-width=".25"/></pattern></defs>`;
  s += `<path d="${PC(mp)}" fill="url(#${mg})" stroke="${ln}" stroke-width=".45"/><path d="${PC(mp)}" fill="url(#${mg}h)"/>`;
  for (let k = 0; k < 7; k++) { const pts = [[105 + R.r(-3, 3), pk + 3]]; let px = pts[0][0], py = pk + 3; const dir = k % 2 ? 1 : -1; for (let t = 0; t < 6; t++) { px += dir * R.r(3, 8); py += R.r(4, 9); if (py > fl) break; pts.push([px, py]); } s += `<path d="${P(pts)}" fill="none" stroke="${ln}" stroke-opacity=".25" stroke-width=".18"/>`; }
  // human scale figures
  const fig = (fx, fy, h, col) => `<circle cx="${fx}" cy="${n2(fy - h + h * .07)}" r="${n2(h * .07)}" fill="${col}"/><path d="M${n2(fx - h * .12)} ${n2(fy - h * .82)}H${n2(fx + h * .12)}L${n2(fx + h * .09)} ${n2(fy - h * .45)}L${n2(fx + h * .07)} ${fy}H${n2(fx + h * .02)}L${fx} ${n2(fy - h * .4)}L${n2(fx - h * .02)} ${fy}H${n2(fx - h * .07)}L${n2(fx - h * .09)} ${n2(fy - h * .45)}Z" fill="${col}"/>`;
  s += fig(105, pk, 1.8 * m, RED) + fig(186, fl, 1.8 * m, ln);
  s += T(188.5, fl - 12, '1,8 М', { s: 1.6, c: ln, op: .7 });
  // floor + catwalk elevation
  s += `<line x1="10" x2="200" y1="${fl}" y2="${fl}" stroke="${ln}" stroke-width=".4"/><rect x="20" y="${fl}" width="170" height="4" fill="none" stroke="${ln}" stroke-opacity=".5" stroke-width=".2"/>`;
  // dimensions
  s += `<path d="M30 ${fl}V${n2(pk)}M28.5 ${fl}h3M28.5 ${n2(pk)}h3M30 ${n2(pk)}H100" stroke="${RED}" stroke-width=".25" fill="none" stroke-dasharray="0"/>`;
  s += T(0, 0, 'ГОРА ≈ 15 М · 50 ФУТОВ', { s: 2, c: RED, w: 600, tr: `translate(27.5 ${n2((fl + pk) / 2 + 14)}) rotate(-90)` });
  s += `<path d="M${n2(scx - sr)} ${n2(scy - sr - 5)}H${n2(scx + sr)}M${n2(scx - sr)} ${n2(scy - sr - 6.5)}v3M${n2(scx + sr)} ${n2(scy - sr - 6.5)}v3" stroke="${ln}" stroke-width=".25" fill="none"/>`;
  s += T(scx, scy - sr - 7, 'КРУГЛЫЙ LED-ЭКРАН ≈ 18 М · 60 ФУТОВ', { a: 'middle', s: 2, c: ln, w: 600 });
  // plan inset: triangular catwalk
  const px0 = 24, py0 = 232; s += T(px0, py0, 'ПЛАН', { s: 1.8, c: ln, op: .6, w: 600 });
  s += `<path d="M${px0} ${py0 + 4}H${px0 + 40}L${px0 + 20} ${py0 + 26}Z" fill="none" stroke="${ln}" stroke-width=".3"/><circle cx="${px0 + 20}" cy="${py0 + 9}" r="4" fill="none" stroke="${ln}" stroke-width=".3"/><path d="M${px0 + 2} ${py0 + 3}H${px0 + 38}" stroke="${RED}" stroke-width=".5"/>`;
  s += T(px0 + 46, py0 + 9, 'треугольный подиум —', { s: 1.7, c: ln, op: .7 }) + T(px0 + 46, py0 + 12, '«конец света»', { s: 1.7, c: ln, op: .7 }) + T(px0 + 46, py0 + 17, 'гора и экран в глубине', { s: 1.7, c: ln, op: .7 }) + T(px0 + 46, py0 + 22, 'зал ↓', { s: 1.7, c: ln, op: .45 });
  return svgWrap(s);
};
