/* ===================================================================
   Section art: title, prologue, context, personnel, sound, packaging,
   chapter dividers, whole (motifs), coda
   =================================================================== */
const T = (x, y, txt, o = {}) => `<text x="${n2(x)}" y="${n2(y)}" font-family="${o.f || 'IBM Plex Mono'}" font-size="${o.s || 2.2}" font-weight="${o.w || 400}" fill="${o.c || '#111'}" ${o.a ? `text-anchor="${o.a}"` : ''} letter-spacing="${o.ls != null ? o.ls : .35}" ${o.op ? `fill-opacity="${o.op}"` : ''} ${o.tr ? `transform="${o.tr}"` : ''} ${o.st ? `font-style="${o.st}"` : ''}>${txt}</text>`;

/* ---------------- title page ---------------- */
A.titleArt = function () {
  let s = IMG('title-bg.jpg');
  s += `<g transform="translate(22 186) rotate(-90)">${A.tape(9, 70, 12)}</g>`;
  return svgWrap(s);
};

/* ---------------- prologue: malfunction ---------------- */
A.prologueArt = function () {
  const R = rnd(101); let s = IMG('prologue-bg.jpg');
  const y0 = 58, y1 = 170, yc = 114;
  for (let x = 5; x <= 205; x += 10) s += `<line x1="${x}" x2="${x}" y1="${y0}" y2="${y1}" stroke="#fff" stroke-opacity="${(x - 5) % 50 ? .035 : .08}" stroke-width=".15"/>`;
  for (let y = y0; y <= y1 + .1; y += 11.2) s += `<line x1="0" x2="210" y1="${n2(y)}" y2="${n2(y)}" stroke="#fff" stroke-opacity=".04" stroke-width=".15"/>`;
  s += `<line x1="0" x2="210" y1="${yc}" y2="${yc}" stroke="#fff" stroke-opacity=".12" stroke-width=".15"/>`;
  // signal composed of modes
  const pts = [];
  const clip = v => Math.max(-38, Math.min(38, v));
  let motif = [];
  for (let x = 0; x <= 210; x += .25) {
    let v = 0;
    if (x < 40) v = R.g() * .25 + (x > 36 ? Math.sin(x * 9) * (x - 36) * 2 : 0);
    else if (x < 74) { const ph = (x - 40) / 6.2; v = (Math.sin(ph * Math.PI * 2) > 0 ? 1 : -1) * 24 * Math.min(1, (x - 40) / 4) + R.g() * 1.2; }
    else if (x < 104) { const ph = ((x - 74) / 3.1) % 1; v = clip((ph * 2 - 1) * 46 + R.g() * 2); }
    else if (x < 126) { const m = (x - 104) % 4.4; if (x < 108.4) motif.push(clip(Math.sin(m * 3.1) * 30 + R.g() * 4)); v = motif[Math.floor(m / .25)] || 0; }
    else if (x < 166) { v = clip(R.g() * 28 + Math.sin(x * 1.7) * 14); }
    else { const pw = .5 + .4 * Math.sin(x * .2); const ph = ((x - 166) / 5.4) % 1; v = (ph < pw ? 1 : -1) * 20 + R.g() * .8; }
    pts.push([x, yc + v]);
  }
  const d = P(pts);
  const id = uid('pg');
  // displaced slices
  let defs = `<path id="${id}s" d="${d}"/>`; let slices = '';
  const bands = [[74, 80, 6], [92, 95, -9], [101, 107, 4], [119, 121, -14], [128, 136, 7], [143, 146, -5], [151, 154, 12]];
  bands.forEach(([a, b, dx], i) => { defs += `<clipPath id="${id}c${i}"><rect x="-20" y="${a}" width="250" height="${b - a}"/></clipPath>`; slices += `<g clip-path="url(#${id}c${i})"><rect x="0" y="${a}" width="210" height="${b - a}" fill="#0A0A0A"/><use href="#${id}s" transform="translate(${dx} 0)" fill="none" stroke="${RED}" stroke-width=".55"/><use href="#${id}s" transform="translate(${dx + .8} -.5)" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".22"/></g>`; });
  s += `<defs>${defs}</defs>`;
  s += `<use href="#${id}s" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".22" transform="translate(.8 -.6)"/>`;
  s += `<use href="#${id}s" fill="none" stroke="${RED}" stroke-width=".55"/>`;
  s += slices;
  // glitch blocks
  for (let i = 0; i < 46; i++) { const x = R.r(70, 205), y = R.r(y0 + 4, y1 - 4), w = R.r(1, 16), h = R.r(.3, 2.6); s += `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" fill="${R() < .6 ? RED : '#fff'}" fill-opacity="${n2(R.r(.15, .9))}"/>`; }
  // CD-skip marker brackets around stutter zone
  s += `<path d="M104 ${yc - 44}h-2v88h2M126 ${yc - 44}h2v88h-2" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".25"/>`;
  s += T(104, yc - 47, 'SKIP ×5', { c: '#fff', op: .6, s: 2 });
  s += T(5, yc - 4, 'POWER ON', { c: '#fff', op: .5, s: 2 });
  s += T(170, yc - 47, 'CLIP +38', { c: RED, s: 2 });
  // scanlines
  for (let y = y0; y < y1; y += .7) s += `<line x1="0" x2="210" y1="${n2(y)}" y2="${n2(y)}" stroke="#0A0A0A" stroke-opacity=".38" stroke-width=".22"/>`;
  // dead pixels and frame ticks
  for (let i = 0; i < 12; i++) s += `<rect x="${n2(R.r(0, 208))}" y="${n2(R.r(180, 196))}" width=".8" height=".8" fill="${R() < .5 ? RED : '#fff'}" fill-opacity=".8"/>`;
  return svgWrap(s);
};

/* ---------------- context: palace vs lamp ---------------- */
A.contextArt = function () {
  const ink = '#26221E'; const st = `stroke="${ink}" fill="none"`; let s = IMG('context-bg.jpg');
  const g = 202; // ground
  // ground line
  s += `<line x1="14" x2="100" y1="${g}" y2="${g}" stroke="${ink}" stroke-width=".3"/><line x1="108" x2="196" y1="${g}" y2="${g}" stroke="#E6DCCB" stroke-opacity=".35" stroke-width=".3"/>`;
  // ---- palace (left) x 18..98
  const L = 18, Rr = 98, cxp = 58;
  for (let i = 0; i < 4; i++) s += `<rect x="${L + i * 1.6}" y="${g - (i + 1) * 3}" width="${Rr - L - i * 3.2}" height="3" ${st} stroke-width=".22"/>`;
  const top = g - 12; const colH = 58; const colTop = top - colH;
  const ncol = 6; for (let i = 0; i < ncol; i++) {
    const cx = 25.5 + i * (65 / (ncol - 1)); const w = 5.2;
    s += `<rect x="${n2(cx - w / 2 - .8)}" y="${top - 2}" width="${w + 1.6}" height="2" ${st} stroke-width=".2"/>`;
    s += `<rect x="${n2(cx - w / 2)}" y="${colTop + 2.4}" width="${w}" height="${colH - 4.4}" ${st} stroke-width=".22"/>`;
    for (let f = 1; f < 5; f++) s += `<line x1="${n2(cx - w / 2 + f * w / 5)}" x2="${n2(cx - w / 2 + f * w / 5)}" y1="${colTop + 3.4}" y2="${top - 3}" stroke="${ink}" stroke-opacity=".45" stroke-width=".12"/>`;
    s += `<rect x="${n2(cx - w / 2 - 1.2)}" y="${colTop}" width="${w + 2.4}" height="2.4" ${st} stroke-width=".2"/>`;
    s += `<circle cx="${n2(cx - w / 2 - .6)}" cy="${colTop + 1.2}" r=".9" ${st} stroke-width=".15"/><circle cx="${n2(cx + w / 2 + .6)}" cy="${colTop + 1.2}" r=".9" ${st} stroke-width=".15"/>`;
  }
  // entablature
  const eT = colTop - 9; s += `<rect x="20" y="${eT}" width="76" height="9" ${st} stroke-width=".25"/><line x1="20" x2="96" y1="${eT + 3}" y2="${eT + 3}" stroke="${ink}" stroke-width=".15"/>`;
  for (let x = 23; x < 95; x += 5.5) s += `<circle cx="${n2(x)}" cy="${eT + 6}" r="1.1" ${st} stroke-width=".14"/><line x1="${n2(x + 2.7)}" x2="${n2(x + 2.7)}" y1="${eT + 3.6}" y2="${eT + 8.4}" stroke="${ink}" stroke-opacity=".5" stroke-width=".14"/>`;
  s += `<line x1="17" x2="99" y1="${eT - .6}" y2="${eT - .6}" stroke="${ink}" stroke-width=".35"/>`;
  // pediment
  const pT = eT - 22; s += `<path d="M17 ${eT - .6}L${cxp} ${pT}L99 ${eT - .6}" ${st} stroke-width=".3"/><path d="M23 ${eT - 2}L${cxp} ${pT + 3}L93 ${eT - 2}Z" ${st} stroke-width=".18"/>`;
  for (let i = 0; i <= 14; i++) { const a = deg(180 + i * 180 / 14); s += `<line x1="${cxp}" y1="${eT - 2.5}" x2="${n2(cxp + Math.cos(a) * 15)}" y2="${n2(eT - 2.5 + Math.sin(a) * 13 * .95)}" stroke="${ink}" stroke-opacity=".4" stroke-width=".12"/>`; }
  s += `<circle cx="${cxp}" cy="${eT - 2.5}" r="2.2" ${st} stroke-width=".2"/>`;
  // dome behind
  const dR = 17; s += `<path d="M${cxp - dR} ${pT + 6}A${dR} ${dR} 0 0 1 ${cxp + dR} ${pT + 6}" ${st} stroke-width=".25"/>`;
  for (let i = 1; i < 6; i++) { const x = cxp - dR + i * dR * 2 / 6; s += `<path d="M${n2(x)} ${pT + 6}Q${n2(cxp + (x - cxp) * .35)} ${pT - dR + 4} ${cxp} ${pT - dR + 6}" ${st} stroke-opacity=".5" stroke-width=".13"/>`; }
  s += `<rect x="${cxp - 2}" y="${pT - dR + 1}" width="4" height="5" ${st} stroke-width=".2"/><circle cx="${cxp}" cy="${pT - dR - .2}" r="1.2" ${st} stroke-width=".2"/>`;
  // acroteria
  s += `<path d="M${cxp} ${pT}l-2 -3h4z" ${st} stroke-width=".18"/><path d="M17 ${eT - .6}l2 -3l2 3M99 ${eT - .6}l-2 -3l-2 3" ${st} stroke-width=".18"/>`;
  // chandelier in central bay
  const chx = cxp, chy = colTop + 14; s += `<line x1="${chx}" x2="${chx}" y1="${colTop + 2.4}" y2="${chy}" stroke="${ink}" stroke-width=".12"/>`;
  for (let k = 0; k < 3; k++) s += `<path d="M${chx - 6 + k * 1.5} ${chy + k * 2.2}Q${chx} ${chy + 5 + k * 2.2} ${chx + 6 - k * 1.5} ${chy + k * 2.2}" ${st} stroke-width=".15"/>`;
  for (let k = -3; k <= 3; k++) s += `<circle cx="${chx + k * 2}" cy="${chy + 4.6 + Math.abs(k) * -.5}" r=".45" fill="${RED}"/>`;
  // dimension under palace
  s += `<path d="M18 ${g + 6}h80M18 ${g + 4.5}v3M98 ${g + 4.5}v3" stroke="${ink}" stroke-width=".18" fill="none"/>`;
  s += T(58, g + 11, 'MBDTF · 2010 · 13 ТРЕКОВ · 68:42', { a: 'middle', s: 2.1, c: ink });
  s += T(58, eT - 30 - 17, 'ДВОРЕЦ', { a: 'middle', s: 2.4, c: RED, w: 600, ls: 1.2 });
  // ---- divider
  s += `<line x1="105" x2="105" y1="84" y2="${g + 12}" stroke="${ink}" stroke-opacity=".35" stroke-width=".2" stroke-dasharray="1 1.2"/>`;
  s += T(0, 0, 'WATCH THE THRONE · 2011', { s: 1.9, c: ink, op: .6, tr: `translate(103.2 ${g - 4}) rotate(-90)` });
  // ---- lamp (right) wall lamp at night, Le Corbusier-esque
  const lc = '#E9DFCF'; const wx = 189, wy = 112, jx = 152, jy = 101;
  s += `<rect x="${wx}" y="${wy - 7}" width="3.4" height="14" fill="none" stroke="${lc}" stroke-opacity=".7" stroke-width=".25"/>`;
  s += `<path d="M${wx} ${wy - 1}L${jx} ${jy}M${wx} ${wy + .6}L${jx} ${jy + 1.6}" fill="none" stroke="${lc}" stroke-opacity=".8" stroke-width=".22"/>`;
  s += `<circle cx="${jx}" cy="${jy + .8}" r="1.5" fill="#0E0D0C" stroke="${lc}" stroke-width=".25"/>`;
  s += `<path d="M${jx - 1.4} ${jy + 2}L${jx + 1.6} ${jy + 2.6}L${jx + 4.6} ${jy + 15}L${jx - 9.6} ${jy + 12}Z" fill="#1a1714" stroke="${lc}" stroke-opacity=".8" stroke-width=".22"/>`;
  s += `<path d="M${jx - 9.6} ${jy + 12}L${jx + 4.6} ${jy + 15}" stroke="#FFE7C2" stroke-width=".6"/>`;
  s += `<path d="M${wx - 1} ${g + 6}h-76M${wx - 1} ${g + 4.5}v3M${wx - 77} ${g + 4.5}v3" stroke="${lc}" stroke-opacity=".6" stroke-width=".18" fill="none"/>`;
  s += T(151, g + 11, 'YEEZUS · 2013 · 10 ТРЕКОВ · 40:01', { a: 'middle', s: 2.1, c: lc, op: .85 });
  s += T(151, 76, 'ОДНА ЛАМПА', { a: 'middle', s: 2.4, c: RED, w: 600, ls: 1.2 });
  s += T(112, 70.5, 'НОЧЬ · ПАРИЖ · ЛОФТ', { s: 1.7, c: lc, op: .55 });
  return svgWrap(s);
};

/* ---------------- personnel: mixing console ---------------- */
A.PERSONNEL = [
  ['A', 'Продакшн', [['Daft Punk', 'продюсеры', .72], ['Mike Dean', 'продюсер · гитара', .8], ['Arca', 'продюсер', .55], ['Gesaffelstein', 'продюсер', .68], ['Hudson Mohawke', 'продюсер', .62], ['Evian Christ', 'продюсер', .5], ['Rick Rubin', 'редуктор', 0]]],
  ['B', 'Голоса', [['Frank Ocean', 'New Slaves', .6], ['Justin Vernon', 'Liquor · I’m in It', .66], ['Chief Keef', 'Hold My Liquor', .58], ['Assassin', 'I’m in It', .7], ['Kid Cudi', 'Guilt Trip', .52], ['King Louie', 'Send It Up', .64], ['Charlie Wilson', 'Bound 2', .76]]],
  ['C', 'Семплы', [['«Sermon»', 'On Sight · интерп.', .48], ['Omega', 'New Slaves', .6], ['Nina Simone', 'Blood on the Leaves', .9], ['TNGHT', 'Blood on the Leaves', .84], ['Beenie Man', 'Send It Up', .5], ['Ponderosa Twins', 'Bound 2', .72], ['Brenda Lee', 'Bound 2', .44]]],
];
A.personnelArt = function () {
  const R = rnd(77); const gid = uid('pl'); let s = `<defs><radialGradient id="${gid}" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#2a2622"/><stop offset="1" stop-color="#0c0c0c"/></radialGradient><radialGradient id="${gid}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff3b2e" stop-opacity=".55"/><stop offset="1" stop-color="#ff3b2e" stop-opacity="0"/></radialGradient><radialGradient id="${gid}w" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9c8" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9c8" stop-opacity="0"/></radialGradient></defs><rect width="210" height="297" fill="url(#${gid})"/>`;
  const x0 = 25, sw = 22.2, gap = 1.6, sh = 64; const rows = [64, 138, 212];
  A.PERSONNEL.forEach(([bank, name, list], ri) => {
    const y = rows[ri];
    s += T(0, 0, `${bank} · ${name.toUpperCase()}`, { s: 2, c: '#E6E0D5', op: .55, ls: .8, tr: `translate(${x0 - 4} ${y + sh}) rotate(-90)` });
    list.forEach(([nm, role, lvl], i) => {
      const x = x0 + i * (sw + gap);
      const isRubin = nm === 'Rick Rubin';
      s += `<rect x="${n2(x)}" y="${y}" width="${sw}" height="${sh}" rx=".8" fill="#191919" stroke="#2c2c2c" stroke-width=".25"/>`;
      // knobs
      [[x + 6, y + 7.5], [x + 16, y + 7.5], [x + 6, y + 17], [x + 16, y + 17]].forEach(([kx, ky], k) => {
        const a = deg(-225 + R.r(.1, .95) * 270);
        s += `<circle cx="${n2(kx)}" cy="${ky}" r="3" fill="#232323" stroke="#3a3a3a" stroke-width=".25"/>`;
        for (let tck = 0; tck <= 10; tck++) { const ta = deg(-225 + tck * 27); s += `<line x1="${n2(kx + Math.cos(ta) * 3.6)}" y1="${n2(ky + Math.sin(ta) * 3.6)}" x2="${n2(kx + Math.cos(ta) * 4.1)}" y2="${n2(ky + Math.sin(ta) * 4.1)}" stroke="#E6E0D5" stroke-opacity=".3" stroke-width=".12"/>`; }
        s += `<line x1="${n2(kx)}" y1="${ky}" x2="${n2(kx + Math.cos(a) * 2.6)}" y2="${n2(ky + Math.sin(a) * 2.6)}" stroke="${k === 0 && ri === 2 ? RED : '#E6E0D5'}" stroke-width=".4" stroke-linecap="round"/>`;
      });
      // meter
      const segs = 14, my0 = y + 25, my1 = y + 51; const lit = Math.round(lvl * segs);
      for (let k = 0; k < segs; k++) { const yy = my1 - (k + 1) * (my1 - my0) / segs; const on = k < lit; const hot = k >= segs - 3; s += `<rect x="${n2(x + 3)}" y="${n2(yy + .2)}" width="3.2" height="${n2((my1 - my0) / segs - .55)}" fill="${on ? (hot ? RED : '#E6E0D5') : '#262626'}" fill-opacity="${on ? (hot ? 1 : .85) : 1}"/>` + (on ? `<circle cx="${n2(x + 4.6)}" cy="${n2(yy + 1)}" r="${hot ? 3.2 : 2.2}" fill="url(#${gid}${hot ? 'l' : 'w'})"/>` : ''); }
      // fader
      const fx = x + 14.5; s += `<rect x="${n2(fx - .5)}" y="${my0}" width="1" height="${my1 - my0}" fill="#050505"/>`;
      for (let k = 0; k <= 10; k++) s += `<line x1="${n2(fx + 2.4)}" x2="${n2(fx + 3.8)}" y1="${n2(my0 + k * (my1 - my0) / 10)}" y2="${n2(my0 + k * (my1 - my0) / 10)}" stroke="#E6E0D5" stroke-opacity=".25" stroke-width=".12"/>`;
      const fy = my1 - lvl * (my1 - my0);
      s += `<rect x="${n2(fx - 3.4)}" y="${n2(fy - 2.2)}" width="6.8" height="4.4" rx=".5" fill="${isRubin ? RED : '#cfcac2'}" stroke="#000" stroke-opacity=".5" stroke-width=".2"/><line x1="${n2(fx - 3.4)}" x2="${n2(fx + 3.4)}" y1="${n2(fy)}" y2="${n2(fy)}" stroke="#000" stroke-width=".3"/>`;
      // label
      s += `<rect x="${n2(x + 1.2)}" y="${y + 54}" width="${sw - 2.4}" height="8.4" fill="#E9E4DA"/>`;
      const fs = nm.length > 13 ? 1.55 : nm.length > 10 ? 1.75 : 2;
      s += T(x + sw / 2, y + 57.8, nm.toUpperCase(), { a: 'middle', s: fs, w: 600, c: '#111', ls: .12 });
      s += T(x + sw / 2, y + 60.9, role, { a: 'middle', s: 1.45, c: isRubin ? RED : '#555', ls: .05, w: isRubin ? 600 : 400 });
      if (isRubin) s += T(x + sw / 2, my1 + 2.2, '−∞', { a: 'middle', s: 2, c: RED, w: 600 });
    });
  });
  return svgWrap(s);
};

/* ---------------- sound: anatomy of a cut ---------------- */
A.soundArt = function () {
  const ink = '#151413'; let s = IMG('tx-sound.jpg');
  const x0 = 18, x1 = 192, y0 = 90, y1 = 190, xa = 96.3, xb = 136.3, yc = 140, A1 = 34;
  s += `<rect x="${x0 - .6}" y="${y0 - .6}" width="${x1 - x0 + 1.2}" height="${y1 - y0 + 1.2}" fill="#0a0a0a"/>`;
  s += IMG('sound-spec.jpg', x0, y0, x1 - x0, y1 - y0);
  // frequency axis (log)
  [['20 кГц', 0], ['2 кГц', .33], ['200 Гц', .66], ['20 Гц', 1]].forEach(([l, t]) => { const y = y0 + t * (y1 - y0); s += `<line x1="${x0 - 2.2}" x2="${x0}" y1="${n2(y)}" y2="${n2(y)}" stroke="${ink}" stroke-width=".2"/>` + T(x0 - 3, y + .7, l, { a: 'end', s: 1.6, c: '#555' }); });
  for (let x = x0; x <= x1; x += 2) s += `<line x1="${x}" x2="${x}" y1="${y1 + 1}" y2="${y1 + (x % 10 === 8 ? 4 : 2.4)}" stroke="${ink}" stroke-opacity=".45" stroke-width=".12"/>`;
  s += T(x0, y1 + 8, 'ВРЕМЯ →', { s: 1.7, c: '#555' }) + T(x1, y1 + 8, 'СХЕМА, НЕ ЗАПИСЬ', { a: 'end', s: 1.7, c: '#555' });
  [xa, xb].forEach(x => s += `<line x1="${x}" x2="${x}" y1="${y0 - 8}" y2="${y1 + 10}" stroke="${RED}" stroke-width=".5"/>`);
  const ann = (x, y, tx, ty, lines, col = ink) => { let o = `<path d="M${x} ${y}L${tx} ${ty}" stroke="${col}" stroke-width=".15" fill="none"/><circle cx="${x}" cy="${y}" r=".8" fill="${col}" stroke="#fff" stroke-width=".2"/>`; lines.forEach((l, i) => o += T(tx, ty + 3 + i * 3, l, { s: i ? 1.9 : 2.1, w: i ? 400 : 600, c: i ? '#555' : col })); return o; };
  s += ann(30, 104, 18, 70, ['ДАВЛЕНИЕ', 'тембр вместо гармонии', 'сигнал без разрешения']);
  s += ann(70, 120, 60, 70, ['ИСКАЖЕНИЕ', 'звук как поверхность:', 'можно порезаться'], RED);
  s += ann(116, 150, 102, 70, ['ГОСПЕЛ', 'другое пространство:', 'герой в нём не остаётся'], '#8A6420');
  s += ann(xa, y1 + 10, xa - 2, y1 + 12, ['ОБРЫВ'], RED);
  s += ann(165, 170, 150, 200, ['ТА ЖЕ ЖЕСТОКОСТЬ', 'звучит уже иначе —', 'мы знаем, что есть выход']);
  // voice glyphs
  const gy = 246; const glyph = (x, title, sub, fn) => { const pts = []; for (let t = 0; t <= 44; t += .3) pts.push([x + t, gy + fn(t)]); return `<path d="${P(pts)}" fill="none" stroke="${ink}" stroke-width=".35"/>` + T(x, gy + 13, title, { s: 2.1, w: 600, c: RED }) + T(x, gy + 16.2, sub, { s: 1.8, c: '#555' }); };
  s += T(18, gy - 15, 'ГОЛОС: ТРИ СОСТОЯНИЯ', { s: 2.1, w: 600, c: ink, ls: .8 });
  s += glyph(18, 'МЕХАНИЗМ', 'auto-tune, квантование', t => (Math.floor(t / 3) % 2 ? -5 : 5) * (Math.floor(t / 6) % 3 === 2 ? .4 : 1));
  s += glyph(82, 'ПРИЗРАК', 'наложения, растворение', t => Math.sin(t * .9) * 5 * Math.exp(-t / 18) + Math.sin(t * 2.3) * .8);
  s += glyph(146, 'ИНСТРУМЕНТ', 'растянутый слог, избыток', t => Math.sin(t * .35) * 7 * Math.sin(Math.PI * t / 44));
  return svgWrap(s);
};

/* ---------------- packaging: exploded isometric ---------------- */
A.packagingArt = function () {
  const ink = '#151413'; let s = IMG('tx-t3.jpg');
  const S = 60, cx = 96, cy = 150; const c30 = Math.cos(deg(30)), s30 = .5;
  const iso = (x, y, z) => [cx + (x - y) * c30, cy + (x + y) * s30 - z];
  const quad = (z, x0 = 0, y0 = 0, x1 = S, y1 = S) => PC([iso(x0, y0, z), iso(x1, y0, z), iso(x1, y1, z), iso(x0, y1, z)]);
  const slab = (z, th, fill, op, stroke = ink) => {
    const a = iso(S, 0, z), b = iso(S, S, z), c = iso(0, S, z), a2 = iso(S, 0, z - th), b2 = iso(S, S, z - th), c2 = iso(0, S, z - th);
    return `<path d="${PC([a, b, b2, a2])}" fill="${fill}" fill-opacity="${op * .9}" stroke="${stroke}" stroke-width=".18"/><path d="${PC([b, c, c2, b2])}" fill="${fill}" fill-opacity="${op * 1.2}" stroke="${stroke}" stroke-width=".18"/><path d="${quad(z)}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width=".25"/>`;
  };
  const circ = (z, r, ox = S / 2, oy = S / 2) => { const pts = []; for (let a = 0; a <= 360; a += 4) pts.push(iso(ox + r * Math.cos(deg(a)), oy + r * Math.sin(deg(a)), z)); return pts; };
  const levels = { back: 0, tray: 32, disc: 62, lid: 94 };
  // guides
  [[0, 0], [S, 0], [S, S], [0, S]].forEach(([x, y]) => { const a = iso(x, y, levels.lid), b = iso(x, y, levels.back); s += `<line x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(b[0])}" y2="${n2(b[1])}" stroke="${ink}" stroke-opacity=".25" stroke-width=".15" stroke-dasharray="1 1"/>`; });
  // back plate + sticker
  s += slab(levels.back, 2.4, '#d9d9d6', .6);
  s += `<path d="${quad(levels.back + .05, 30, 36, 56, 57)}" fill="#fff" stroke="${ink}" stroke-width=".18"/>`;
  for (let k = 0; k < 5; k++) { const a = iso(32, 38 + k * 2.2, levels.back + .1), b = iso(48, 38 + k * 2.2, levels.back + .1); s += `<line x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(b[0])}" y2="${n2(b[1])}" stroke="${ink}" stroke-opacity=".5" stroke-width=".25"/>`; }
  for (let k = 0; k < 16; k++) { const x = 37 + k * 1.1; const a = iso(x, 50, levels.back + .1), b = iso(x, 55, levels.back + .1); s += `<line x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(b[0])}" y2="${n2(b[1])}" stroke="${ink}" stroke-width="${k % 3 ? .25 : .45}"/>`; }
  // tray
  s += slab(levels.tray, 3.2, '#e8e8e6', .35);
  s += `<path d="${PC(circ(levels.tray + .1, 27))}" fill="none" stroke="${ink}" stroke-opacity=".35" stroke-width=".18"/>`;
  for (let k = 0; k < 12; k++) { const a = deg(k * 30); const p1 = iso(S / 2 + Math.cos(a) * 2, S / 2 + Math.sin(a) * 2, levels.tray + .1), p2 = iso(S / 2 + Math.cos(a) * 6.5, S / 2 + Math.sin(a) * 6.5, levels.tray + .1); s += `<line x1="${n2(p1[0])}" y1="${n2(p1[1])}" x2="${n2(p2[0])}" y2="${n2(p2[1])}" stroke="${ink}" stroke-width=".25"/>`; }
  s += `<path d="${PC(circ(levels.tray + .1, 7))}" fill="none" stroke="${ink}" stroke-width=".25"/>`;
  // disc
  const dg = uid('dg');
  s += `<defs><linearGradient id="${dg}" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#cfd2d6"/><stop offset=".3" stop-color="#f4f4f5"/><stop offset=".42" stop-color="#c9b8e8"/><stop offset=".5" stop-color="#9fd6dd"/><stop offset=".58" stop-color="#e9e3a8"/><stop offset=".7" stop-color="#f1f1f2"/><stop offset="1" stop-color="#bfc3c8"/></linearGradient></defs>`;
  s += `<path d="${PC(circ(levels.disc - 1.2, 28.5))}" fill="#b9bcc0"/>`;
  s += `<path d="${PC(circ(levels.disc, 28.5))}" fill="url(#${dg})" stroke="${ink}" stroke-width=".25"/>`;
  for (let r = 12; r < 28; r += 1.6) s += `<path d="${PC(circ(levels.disc + .05, r))}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".12"/>`;
  s += `<path d="${PC(circ(levels.disc + .05, 11))}" fill="#fff" fill-opacity=".5" stroke="${ink}" stroke-opacity=".4" stroke-width=".15"/>`;
  s += `<path d="${PC(circ(levels.disc + .05, 3.6))}" fill="#F0F0EE" stroke="${ink}" stroke-width=".2"/>`;
  // lid
  s += slab(levels.lid, 2.2, '#ffffff', .4);
  const hl = [iso(8, 0, levels.lid + .05), iso(26, 0, levels.lid + .05), iso(0, 26, levels.lid + .05), iso(0, 8, levels.lid + .05)];
  s += `<path d="${PC(hl)}" fill="#fff" fill-opacity=".6"/>`;
  // red tape on lid (left edge)
  s += `<path d="${PC([iso(-3, 2, levels.lid + .1), iso(-3, 11, levels.lid + .1), iso(38, 11, levels.lid + .1), iso(38, 2, levels.lid + .1)])}" fill="${RED}" fill-opacity=".95"/>`;
  // hinge marks
  for (let k = 0; k < 3; k++) { const a = iso(0, 6 + k * 1.4, levels.lid + .05), b = iso(S, 6 + k * 1.4, levels.lid + .05); }
  // labels
  const lab = (pt, tx, ty, num, title, sub) => `<path d="M${n2(pt[0])} ${n2(pt[1])}L${tx - 2} ${ty}H${tx}" fill="none" stroke="${ink}" stroke-width=".15"/><circle cx="${n2(pt[0])}" cy="${n2(pt[1])}" r=".7" fill="${RED}"/>` + T(tx + 1, ty - 1.2, `${num} ${title}`, { s: 2.1, w: 600, c: ink }) + T(tx + 1, ty + 2.2, sub, { s: 1.8, c: '#555' });
  s += lab(iso(S, S / 2, levels.lid), 158, 66, '01', 'КРЫШКА', 'прозрачная — без вкладыша');
  s += lab(iso(30, 6, levels.lid + .1), 158, 84, '02', 'ЛЕНТА', 'красная — вместо обложки');
  s += lab(iso(S / 2 + 25, S / 2, levels.disc), 158, 108, '03', 'ДИСК', 'выставлен напоказ');
  s += lab(iso(S, S / 2, levels.tray), 158, 140, '04', 'ЛОТОК', 'механизм без корпуса');
  s += lab(iso(50, 46, levels.back), 158, 176, '05', 'СТИКЕР', 'семплы и штрихкод — на обороте');
  return svgWrap(s);
};

/* ---------------- chapter dividers ---------------- */
A.maskShape = (cx, cy, rx, ry) => `M${cx} ${cy - ry}C${cx + rx * 1.05} ${cy - ry} ${cx + rx * 1.02} ${cy + ry * .35} ${cx + rx * .62} ${cy + ry * .78}C${cx + rx * .35} ${cy + ry * 1.02} ${cx - rx * .35} ${cy + ry * 1.02} ${cx - rx * .62} ${cy + ry * .78}C${cx - rx * 1.02} ${cy + ry * .35} ${cx - rx * 1.05} ${cy - ry} ${cx} ${cy - ry}Z`;
A.chapterArt = function (i) {
  const R = rnd(900 + i * 17); let s = IMG(`ch${i}-bg.jpg`);
  const cx = 105, cy = 106, r = 72; const id = uid('ch');
  s += `<defs>
    <pattern id="${id}px" width="1.1" height="1.1" patternUnits="userSpaceOnUse"><rect width=".5" height=".5" fill="#fff" fill-opacity=".07"/></pattern>
    <clipPath id="${id}cc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <clipPath id="${id}mk"><path d="${A.maskShape(cx, cy - 6, 31, 42)}"/></clipPath>
    <radialGradient id="${id}stud" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#9a9a9a"/><stop offset="1" stop-color="#222"/></radialGradient>
    <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}shade" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    <filter id="${id}sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>`;
  if (i === 0) for (let k = 0; k < 16; k++) { const a = deg(-170 + k * (160 / 15)); s += `<line x1="105" y1="226" x2="${n2(105 + Math.cos(a) * 320)}" y2="${n2(226 + Math.sin(a) * 320)}" stroke="#ff6a5a" stroke-opacity="${n2(R.r(.3, .7))}" stroke-width=".18"/>`; }
  s += `<g clip-path="url(#${id}cc)">`;
  const mk = A.maskShape(cx, cy - 6, 31, 42);
  if (i < 4) {
    s += `<path d="${mk}" transform="translate(2.5 4)" fill="#000" fill-opacity=".8" filter="url(#${id}sh)"/>`;
    const base = ['#3b2116', '#0d0d0d', '#0b0b0b', '#8a9097'][i];
    s += `<path d="${mk}" fill="${base}"/><g clip-path="url(#${id}mk)">`;
    if (i === 0) {
      for (let y = cy - 50; y < cy + 40; y += 2.1) for (let x = cx - 34; x < cx + 34; x += 2.1) { const ox = (Math.round((y - cy) / 2.1) % 2) * 1.05; const c = R.pick(['#c9a24a', '#e8d18a', '#8a3a1c', '#d23a1f', '#f3e6c2', '#6b2a14']); s += `<circle cx="${n2(x + ox)}" cy="${n2(y)}" r="${n2(R.r(.55, .95))}" fill="${c}"/><circle cx="${n2(x + ox - .3)}" cy="${n2(y - .3)}" r=".22" fill="#fff" fill-opacity=".85"/>`; }
      for (let k = 0; k < 5; k++) { const pts = []; let x = cx - 30 + R.r(0, 10), y = cy - 40 + k * 16; for (let t = 0; t < 12; t++) { pts.push([x, y]); x += R.r(3, 6); y += R.r(-3, 3); } s += `<path d="${P(pts)}" fill="none" stroke="#111" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>`; }
    }
    if (i === 1) for (let y = cy - 50; y < cy + 40; y += 4.2) for (let x = cx - 34; x < cx + 34; x += 4.2) { const ox = (Math.round((y - cy) / 4.2) % 2) * 2.1; s += `<circle cx="${n2(x + ox)}" cy="${n2(y)}" r="1.25" fill="url(#${id}stud)"/>`; }
    if (i === 2) for (let y = cy - 50; y < cy + 40; y += 3.1) for (let x = cx - 34; x < cx + 34; x += 3.1) { if (R() < .9) s += `<rect x="${n2(x + R.r(-.2, .2))}" y="${n2(y + R.r(-.2, .2))}" width="2.2" height="2.2" fill="#f2efe8" fill-opacity="${n2(R.r(.65, 1))}" transform="rotate(${n2(R.r(-6, 6))} ${n2(x + 1.1)} ${n2(y + 1.1)})"/>`; }
    if (i === 3) for (let y = cy - 50; y < cy + 40; y += 2.6) for (let x = cx - 34; x < cx + 34; x += 2.6) { const v = R(); const l = v > .93 ? 100 : 30 + v * 55; s += `<rect x="${n2(x)}" y="${n2(y)}" width="2.45" height="2.45" fill="${hsl(210, 8, l)}"/>`; }
    s += `<path d="${mk}" fill="url(#${id}shade)"/></g>`;
    s += `<path d="${mk}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".3"/>`;
    if (i === 0) {
      [-1, 1].forEach(sg => s += `<path d="M${cx + sg * 4} ${cy - 12}Q${cx + sg * 12} ${cy - 20} ${cx + sg * 20} ${cy - 13}Q${cx + sg * 12} ${cy - 7} ${cx + sg * 4} ${cy - 12}Z" fill="#080808" stroke="${RED}" stroke-width=".6"/>`);
      s += `<path d="M${cx - 7} ${cy + 15}Q${cx} ${cy + 20} ${cx + 7} ${cy + 15}Q${cx} ${cy + 17.5} ${cx - 7} ${cy + 15}Z" fill="#080808" stroke="${RED}" stroke-width=".5"/>`;
    }
    if (i === 3) for (let k = 0; k < 90; k++) { const a = R.r(0, 6.28), d = R.r(36, 80); s += `<rect x="${n2(cx + Math.cos(a) * d)}" y="${n2(cy + Math.sin(a) * d)}" width="${n2(R.r(.5, 1.6))}" height="${n2(R.r(.5, 1.6))}" fill="#fff" fill-opacity="${n2(R.r(.2, .95))}"/>`; }
  } else {
    s += `<circle cx="${cx}" cy="${cy - 6}" r="46" fill="url(#${id}glow)"/>`;
    s += `<path d="${mk}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".35" stroke-dasharray="1.2 1.6"/>`;
  }
  s += `<rect x="0" y="0" width="210" height="297" fill="url(#${id}px)"/></g>`;
  s += `<rect x="${cx - 60}" y="${cy + 45}" width="120" height="13" fill="#000" fill-opacity=".7"/>`;
  if (i === 2) { const pk = 232; for (let k = 0; k < 9; k++) { const pts = []; let px = 98 + k * 1.8, py = pk + 2; for (let t = 0; t < 12; t++) { pts.push([px, py]); px += (k < 4 ? -1 : 1) * R.r(1.2, 4); py += R.r(2, 4.5); } s += `<path d="${P(pts)}" fill="none" stroke="${k % 3 ? '#e2321a' : '#ffb070'}" stroke-opacity="${n2(R.r(.55, .95))}" stroke-width="${n2(R.r(.3, .8))}" stroke-linecap="round"/>`; } }
  if (i === 3) { const zz = [[62, 292], [88, 278], [72, 264], [98, 252], [86, 240], [105, 222]]; s += `<path d="${P(zz)}" fill="none" stroke="#1b2733" stroke-width=".4" stroke-dasharray="1.2 1"/>`; }
  return svgWrap(s);
};

/* ---------------- whole: three motifs + voice path ---------------- */
A.wholeArt = function () {
  const ink = '#141210'; let s = IMG('tx-whole.jpg');
  const R = rnd(55);
  // faint disc behind
  for (let r = 20; r < 120; r += 1.6) s += `<circle cx="196" cy="40" r="${r}" fill="none" stroke="${ink}" stroke-opacity="${n2(R.r(.02, .06))}" stroke-width=".18"/>`;
  const py = 150; const cols = [44, 105, 166];
  // panel frames
  cols.forEach(cx => s += `<rect x="${cx - 26}" y="${py - 36}" width="52" height="64" fill="none" stroke="${ink}" stroke-opacity=".2" stroke-width=".2"/>`);
  // KEY (ownership)
  { const cx = cols[0], cy = py - 4; s += `<circle cx="${cx - 9}" cy="${cy}" r="9" fill="none" stroke="${ink}" stroke-width="1.6"/><circle cx="${cx - 9}" cy="${cy}" r="3" fill="none" stroke="${ink}" stroke-width=".4"/><path d="M${cx} ${cy}H${cx + 19}M${cx + 13} ${cy}v5.5M${cx + 17} ${cy}v4M${cx + 19} ${cy}v6" stroke="${ink}" stroke-width="1.6" fill="none"/>`;
    s += `<path d="M${cx - 12} ${cy + 9}Q${cx - 18} ${cy + 18} ${cx - 8} ${cy + 22}" stroke="${RED}" stroke-width=".4" fill="none"/><rect x="${cx - 12}" y="${cy + 20}" width="10" height="6" fill="${RED}" transform="rotate(-12 ${cx - 7} ${cy + 23})"/>`; }
  // DOOR (access)
  { const cx = cols[1], cy = py - 4; const lg = uid('dl');
    s += `<defs><linearGradient id="${lg}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${RED}" stop-opacity=".85"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></linearGradient></defs>`;
    s += `<rect x="${cx - 9}" y="${cy - 22}" width="18" height="40" fill="${ink}"/><path d="M${cx - 9} ${cy - 22}L${cx - 1} ${cy - 19}L${cx - 1} ${cy + 15}L${cx - 9} ${cy + 18}Z" fill="#ECE7DF" stroke="${ink}" stroke-width=".3"/>`;
    s += `<rect x="${cx - 1}" y="${cy - 22}" width="10" height="40" fill="#fff" fill-opacity=".0"/><path d="M${cx - 1} ${cy - 19}L${cx + 9} ${cy - 22}L${cx + 9} ${cy + 18}L${cx - 1} ${cy + 15}Z" fill="${RED}" fill-opacity=".9"/>`;
    s += `<path d="M${cx - 1} ${cy + 15}L${cx + 9} ${cy + 18}L${cx + 24} ${cy + 26}L${cx + 4} ${cy + 26}Z" fill="url(#${lg})"/><circle cx="${cx - 3}" cy="${cy}" r=".6" fill="${ink}"/>`; }
  // HOURGLASS (no delay)
  { const cx = cols[2], cy = py - 4; s += `<path d="M${cx - 12} ${cy - 22}H${cx + 12}M${cx - 12} ${cy + 18}H${cx + 12}" stroke="${ink}" stroke-width="1.4"/><path d="M${cx - 10} ${cy - 22}L${cx} ${cy - 2}L${cx + 10} ${cy - 22}M${cx - 10} ${cy + 18}L${cx} ${cy - 2}L${cx + 10} ${cy + 18}" fill="none" stroke="${ink}" stroke-width=".5"/>`;
    s += `<path d="M${cx - 8.5} ${cy - 19}L${cx + 8.5} ${cy - 19}L${cx} ${cy - 3.5}Z" fill="${RED}"/><path d="M${cx} ${cy - 3}V${cy + 17}" stroke="${RED}" stroke-width=".25" stroke-dasharray=".6 .9"/><path d="M${cx - 3} ${cy + 17}Q${cx} ${cy + 15.6} ${cx + 3} ${cy + 17}Z" fill="${RED}"/>`; }
  // voice path
  const vy = 236; let pts = [];
  for (let x = 18; x <= 192; x += .3) { const t = (x - 18) / 174; let v;
    if (t < .25) v = (Math.floor(x * 1.2) % 2 ? -1 : 1) * 7 * (1 - t);
    else if (t < .45) v = Math.sin(x * 2.4) * 9 * Math.sin(Math.PI * (t - .25) / .2) + R.g() * 1.2;
    else if (t < .68) v = R.g() * 2.4 * (1 - (t - .45) / .23) + Math.sin(x * .9) * 1.2;
    else v = Math.sin(x * .32) * 4; pts.push([x, vy + v]); }
  s += `<path d="${P(pts)}" fill="none" stroke="${ink}" stroke-width=".4"/>`;
  [[.72, '#8A847A', 1.6], [.8, '#B5AEA3', 3.2]].forEach(([t0, c, off]) => { const pp = []; for (let x = 18 + 174 * t0; x <= 192; x += .3) pp.push([x, vy + Math.sin(x * .32 + off * .3) * 4 + off * (1 - (x - (18 + 174 * t0)) / (174 * (1 - t0))) * 2 - off * .2]); s += `<path d="${P(pp)}" fill="none" stroke="${c}" stroke-width=".35"/>`; });
  [[.12, 'ЗАВОЁВЫВАЕТ'], [.35, 'КРИЧИТ'], [.56, 'РАСТВОРЯЕТСЯ'], [.86, 'СОСУЩЕСТВУЕТ']].forEach(([t, l]) => { const x = 18 + 174 * t; s += `<line x1="${n2(x)}" x2="${n2(x)}" y1="${vy + 12}" y2="${vy + 15}" stroke="${RED}" stroke-width=".3"/>` + T(x, vy + 19, l, { a: 'middle', s: 2, w: 600, c: ink }); });
  s += T(18, vy - 16, 'ПУТЬ ГОЛОСА · 0:00 → 40:01', { s: 2, w: 600, c: RED, ls: .8 });
  return svgWrap(s);
};

/* ---------------- coda ---------------- */
A.codaArt = function () {
  const R = rnd(4001); let s = IMG('coda-bg.jpg');
  for (let r = 30; r < 104; r += 1.15) s += `<circle cx="168" cy="250" r="${n2(r)}" fill="none" stroke="#fff" stroke-opacity="${n2(R.r(.02, .07))}" stroke-width=".2"/>`;
  s += `<circle cx="168" cy="250" r="14" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".25"/><circle cx="168" cy="250" r="5" fill="#090909" stroke="#fff" stroke-opacity=".4" stroke-width=".25"/>`;
  s += `<g transform="translate(24 20)">${A.tape(9, 40, 7, { tornTop: true })}</g>`;
  return svgWrap(s);
};
