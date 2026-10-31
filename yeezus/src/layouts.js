/* text overlays for designed pages */
const pad2 = n => String(n).padStart(2, '0');
function metaBlock(t, extra = '') {
  return `<div class="metaGrid mono">
    <span class="k">Длительность</span><span>${t.dur}</span>
    <span class="k">Звук</span><span>${t.tags}</span>
    <span class="k">В кадре</span><span>${t.who}</span>
    <span class="k">Приём</span><span>${t.dev}</span>${extra}</div>`;
}
/* generic opener builder: o = positions (css strings) */
function trackOpener(t, o) {
  o = Object.assign({
    top: `<div class="over mono" style="left:24mm;top:18mm;color:var(--fg)">Трек ${pad2(t.n)} / 10 — Глава ${CHAPTERS[t.ch].n} · ${CHAPTERS[t.ch].ru}</div><div class="over mono" style="right:20mm;top:18mm;color:var(--mute)">${t.dur}</div>`,
    num: 'left:20mm;top:26mm;font-size:96pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;bottom:70mm;font-size:120pt;color:var(--fg)',
    sub: 'left:22mm;width:120mm;bottom:56mm;font-size:17pt;color:var(--fg)',
    vibe: 'left:22mm;width:96mm;bottom:20mm;color:var(--fg)',
    meta: 'left:126mm;right:16mm;bottom:20mm;color:var(--fg)',
    titleHTML: t.title,
  }, o || {});
  return `${o.top}
    ${o.num ? `<div class="over tnum" style="${o.num}">${pad2(t.n)}</div>` : ''}
    <div class="over ttitle" style="${o.title}">${o.titleHTML}</div>
    <div class="over tsub" style="${o.sub}">${t.ru}</div>
    <div class="over vibe" style="${o.vibe}">${t.vibe}</div>
    <div class="over" style="${o.meta}">${metaBlock(t)}</div>
    ${o.extra || ''}`;
}
window.TRACK_LAYOUT = { default: t => trackOpener(t) };
window.OPENER_TXT = {
  personnel: () => '', packaging: () => '', coda: () => '', back: () => '',
};

const H = (style, html, cls = '') => `<div class="over ${cls}" style="${style}">${html}</div>`;
Object.assign(window.OPENER_TXT, {
  prologue: () => H('left:24mm;top:20mm', 'Пролог', 'mono acc') + H('right:20mm;top:20mm;text-align:right;color:var(--mute)', '0:00 / 40:01<br>signal unstable', 'mono')
    + H('left:24mm;top:34mm;width:120mm;color:var(--mute)', 'Власть, желание<br>и человек внутри машины', 'tsub') 
    + H('left:20mm;right:14mm;top:186mm;font-size:94pt;color:var(--fg);text-shadow:.9mm 0 0 rgba(224,32,27,.85), -.5mm 0 0 rgba(255,255,255,.25)', 'Неисправ&shy;ность', 'ttitle')
    + H('left:23mm;width:150mm;top:236mm;font-size:21pt;line-height:1.15;color:var(--fg)', 'Первый звук похож на поломку. И в эту ещё не остывшую неисправность входит человек.', 'tsub')
    + H('left:24mm;bottom:16mm;color:var(--mute)', 'Yeezus · 18 июня 2013', 'mono') + H('right:20mm;bottom:16mm;color:var(--mute)', '▮▮ ▶', 'mono'),
  context: () => H('left:24mm;top:20mm', 'I · Контекст', 'mono acc') + H('right:20mm;top:20mm;color:var(--mute)', '2010 → 2011 → 2013', 'mono')
    + H('left:22mm;right:14mm;top:28mm;font-size:76pt;color:var(--fg)', 'После вершины', 'ttitle')
    + H('left:24mm;top:58mm;width:150mm;font-size:16pt;color:var(--mute)', 'Что происходит, когда вершина уже взята', 'tsub')
    + H('left:24mm;right:20mm;top:226mm;font-size:22pt;line-height:1.12;color:var(--fg)', 'На <i>MBDTF</i> Канье строил дворец.<br>На <i>Yeezus</i> — оставил одну лампу.', 'tsub')
    + H('left:24mm;width:76mm;top:252mm;color:var(--mute)', 'Длинные композиции, роскошные аранжировки, хоры гостей. Даже исповедь в пороках — часть спектакля.', 'mono')
    + H('left:110mm;width:80mm;top:252mm;color:var(--mute)', '«Главный источник вдохновения — одна-единственная лампа Ле Корбюзье». Красоту приходится ждать.', 'mono'),
  sound: () => H('left:18mm;top:20mm', 'II · Звук', 'mono acc') + H('right:18mm;top:20mm;color:var(--mute)', 'Анатомия обрыва · схема', 'mono')
    + H('left:16mm;right:14mm;top:28mm;font-size:56pt;color:var(--fg)', 'Тщательно устроенная<br>грубость', 'ttitle')
    + H('left:18mm;right:18mm;top:268mm;font-size:15pt;line-height:1.2;color:var(--fg)', 'Главный приём пластинки — резкая смена эмоциональной среды. После нескольких секунд госпела электронная жестокость звучит иначе.', 'tsub'),
  whole: () => H('left:24mm;top:20mm', 'Целое', 'mono acc') + H('right:20mm;top:20mm;color:var(--mute)', 'Литературная целостность', 'mono')
    + H('left:22mm;right:14mm;top:28mm;font-size:72pt;color:var(--fg)', 'Человек<br>внутри машины', 'ttitle')
    + H('left:24mm;top:82mm;width:150mm;font-size:16pt;color:var(--mute)', 'Три сквозных мотива и один голос, который меняется', 'tsub')
    + [['Владение', 'Что принадлежит ему — и кому может принадлежать он сам.'], ['Доступ', 'Кого впускают, кто решает и почему чужое признание так много значит.'], ['Отсрочка', 'Неспособность выдержать время между чувством и действием.']]
      .map(([k, v], i) => H(`left:${18 + i * 61}mm;width:52mm;top:183mm;text-align:center`, `<div class="mono acc" style="font-weight:600">${['01', '02', '03'][i]} · ${k}</div><div class="cap" style="margin-top:1.6mm;color:var(--fg)">${v}</div>`)).join(''),
  personnel: () => H('left:25mm;top:20mm', 'Люди внутри машины', 'mono acc') + H('right:18mm;top:20mm;color:#8A847A;text-align:right', 'Микшерный пульт · 21 канал', 'mono')
    + H('left:24mm;right:14mm;top:28mm;font-size:54pt;color:#E6E0D5', 'Коллектив и вычитание', 'ttitle')
    + H('left:25mm;width:120mm;top:47mm;font-size:12pt;color:#8A847A', 'Авторство Канье — в отборе, столкновении и монтаже чужих языков.', 'tsub')
    + H('left:25mm;right:18mm;bottom:12mm;color:#6d685f', 'Только имена, упомянутые в тексте; полный список участников шире. Фейдер Рика Рубина опущен до −∞: «не продюсер, а редуктор».', 'mono'),
  packaging: () => H('left:22mm;top:20mm', 'Упаковка как манифест', 'mono acc') + H('right:18mm;top:20mm;color:var(--mute)', 'Схема в разнесённом виде', 'mono')
    + H('left:20mm;right:14mm;top:28mm;font-size:58pt;color:var(--fg)', 'Открытый гроб', 'ttitle')
    + H('left:150mm;width:46mm;top:194mm;font-size:11pt;line-height:1.22;color:var(--fg)', '«Формат показывают публике в последний раз». Даже отказ от украшений становится предметом желания.', 'tsub')
    + H('left:20mm;right:14mm;top:226mm;font:900 40pt/1 var(--grot);letter-spacing:-.04em;color:var(--fg)', 'YEEZY <span style="color:var(--acc)">+</span> JESUS <span style="color:var(--acc)">=</span><br>YEEZUS')
    + H('left:22mm;right:18mm;top:262mm;font-size:13pt;color:var(--mute)', 'Религиозное имя становится личным брендом; личный бренд претендует на священный статус.', 'tsub'),
  coda: () => H('left:40mm;top:22mm', 'Кода', 'mono acc') + H('right:20mm;top:22mm;color:var(--mute)', '39:59 → 40:01', 'mono')
    + [['01 · хор', 'Когда в «On Sight» вступает хор, слышно пространство, в котором герой пока не способен жить.'], ['05 · гитара', 'Когда заканчивается «Hold My Liquor», гитара удерживает чувство, от которого он пытается увернуться.'], ['10 · соул', 'Когда в «Bound 2» раскрывается соул, становится ясно, как долго альбом обходил потребность, которую невозможно утолить демонстрацией силы.']]
      .map(([k, v], i) => H(`left:40mm;right:22mm;top:${40 + i * 24}mm;display:grid;grid-template-columns:26mm 1fr;`, `<span class="mono acc" style="padding-top:1.2mm">${k}</span><span style="font:500 13.5pt/1.32 var(--serif);color:var(--fg)">${v}</span>`)).join('')
    + H('left:24mm;right:24mm;top:128mm;font:italic 400 25pt/1.16 var(--serif);color:var(--fg)', 'К последним минутам <i style="font-style:normal">Yeezus</i> человек внутри машины всё ещё тщеславен, груб и противоречив. Но его голос уже допускает простую вещь: <span style="color:var(--acc)">другой человек может быть нужен ему сильнее, чем очередное доказательство собственного величия.</span>')
    + H('left:24mm;bottom:18mm;color:var(--mute)', '■ Конец', 'mono'),
  back: () => H('left:42mm;top:116mm;width:66mm;', `<div class="sticker" style="padding:3mm 3.2mm">
      <div class="mono" style="font-size:5.2pt;letter-spacing:.12em;color:#111"><b>Yeezus</b> · 2013 · 40:01</div>
      <div style="margin-top:1.6mm;display:grid;grid-template-columns:5mm 1fr 8mm;row-gap:.25mm;font:500 6.2pt/1.25 var(--mono);color:#222">${TRACKS.map(t => `<span style="color:${t.n % 2 ? '#E0201B' : '#111'}">${pad2(t.n)}</span><span>${t.title}</span><span style="text-align:right;color:#777">${t.dur}</span>`).join('')}</div>
      <svg viewBox="0 0 40 8" style="width:40mm;height:8mm;margin-top:2mm;display:block">${A.barcode(0, 0, 40, 7, 2013)}</svg>
      <div class="mono" style="font-size:4.6pt;color:#777;margin-top:.6mm">Семплы и благодарности — внутри. Носитель — напоказ.</div></div>`)
    + H('left:31mm;right:31mm;top:206mm;font:italic 400 19pt/1.2 var(--serif);color:#1a1a1a', 'Другой человек может быть нужен ему сильнее, чем очередное доказательство собственного величия.')
    + H('left:31mm;bottom:16mm;color:#555', 'Yeezus — власть, желание и человек внутри машины', 'mono') + H('right:31mm;bottom:16mm;color:#555', 'Иллюстрированный разбор', 'mono'),
});

/* per-track opener layouts */
const DARKTXT = 'color:#1a1816';
Object.assign(window.TRACK_LAYOUT, {
  t1: t => trackOpener(t, {
    num: 'left:20mm;top:26mm;font-size:96pt;color:var(--acc)',
    vibe: 'left:136mm;width:60mm;top:203mm;font-size:11pt;line-height:1.28;color:#1a1816',
    title: 'left:19mm;right:14mm;top:136mm;font-size:124pt;color:#fff;text-shadow:1mm 0 0 rgba(224,32,27,.9)',
    sub: 'left:22mm;width:150mm;top:176mm;font-size:16pt;color:#fff',
    meta: 'left:22mm;width:106mm;top:203mm;color:#1a1816',
  }),
  t2: t => trackOpener(t, {
    num: 'left:20mm;top:26mm;font-size:96pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;top:170mm;font-size:110pt;color:var(--fg)', titleHTML: 'Black<br>Skinhead',
    sub: 'left:22mm;width:100mm;top:232mm;font-size:16pt;color:var(--fg)',
    vibe: 'left:22mm;width:92mm;bottom:16mm;font-size:12.5pt;color:var(--fg)',
    meta: 'left:122mm;right:16mm;bottom:16mm;color:var(--fg)',
  }),
  t3: t => trackOpener(t, {
    num: 'right:18mm;top:26mm;font-size:54pt;color:var(--acc)',
    title: 'left:19mm;right:40mm;top:27mm;font-size:96pt;color:var(--fg)',
    sub: 'left:22mm;width:120mm;top:52mm;font-size:15pt;color:var(--mute)',
    vibe: 'left:22mm;width:92mm;top:262mm;font-size:12pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;top:262mm;color:var(--fg)',
  }),
  t4: t => trackOpener(t, {
    num: 'left:20mm;top:26mm;font-size:54pt;color:var(--acc)',
    title: 'left:18mm;width:100mm;top:106mm;font-size:96pt;color:var(--fg)', titleHTML: 'New<br>Slaves',
    sub: 'left:21mm;width:92mm;top:162mm;font-size:15pt;line-height:1.12;color:var(--fg)',
    vibe: 'left:21mm;width:90mm;top:184mm;font-size:12.5pt;color:var(--fg)',
    meta: 'left:21mm;width:92mm;top:224mm;color:var(--fg)',
  }),
  t5: t => trackOpener(t, {
    num: 'right:20mm;top:46mm;font-size:66pt;color:var(--acc)',
    title: 'left:19mm;right:30mm;top:27mm;font-size:104pt;color:var(--fg)', titleHTML: 'Hold my<br>liquor',
    sub: 'left:22mm;width:120mm;top:88mm;font-size:15pt;color:var(--mute)',
    vibe: 'left:22mm;width:94mm;top:250mm;font-size:12.5pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;top:250mm;color:var(--fg)',
  }),
  t6: t => trackOpener(t, {
    num: 'right:20mm;top:26mm;font-size:66pt;color:#FFD0C4',
    title: 'left:19mm;right:14mm;top:27mm;font-size:120pt;color:var(--fg)',
    sub: 'left:22mm;width:120mm;top:63mm;font-size:15pt;color:var(--fg)',
    vibe: 'left:22mm;width:94mm;bottom:16mm;font-size:12.5pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;bottom:16mm;color:var(--fg)',
  }),
  t7: t => trackOpener(t, {
    num: 'right:20mm;top:26mm;font-size:66pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;top:134mm;font-size:100pt;color:var(--fg)', titleHTML: 'Blood on<br>the leaves',
    sub: 'left:22mm;width:150mm;top:192mm;font-size:16pt;color:var(--fg)',
    vibe: 'left:22mm;width:94mm;top:208mm;font-size:12pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;top:209mm;color:var(--fg)',
  }),
  t8: t => trackOpener(t, {
    num: 'right:20mm;top:26mm;font-size:66pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;top:156mm;font-size:120pt;color:var(--fg)',
    sub: 'left:22mm;width:150mm;top:194mm;font-size:16pt;color:var(--fg)',
    vibe: 'left:22mm;width:76mm;bottom:16mm;font-size:12pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;bottom:16mm;color:var(--fg)',
  }),
  t9: t => trackOpener(t, {
    num: 'left:20mm;top:26mm;font-size:66pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;top:112mm;font-size:120pt;color:var(--fg)',
    sub: 'left:22mm;width:150mm;top:149mm;font-size:16pt;color:var(--fg)',
    vibe: 'left:22mm;width:92mm;top:162mm;font-size:12.5pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;top:163mm;color:var(--fg)',
  }),
  t10: t => trackOpener(t, {
    num: 'left:20mm;top:26mm;font-size:54pt;color:var(--acc)',
    title: 'left:19mm;right:14mm;top:216mm;font-size:110pt;color:var(--fg)',
    sub: 'left:22mm;right:16mm;top:252mm;font-size:15pt;line-height:1.15;color:var(--fg)',
    vibe: 'left:22mm;width:94mm;bottom:12mm;font-size:12pt;color:var(--fg)',
    meta: 'left:124mm;right:14mm;bottom:12mm;color:var(--fg)',
  }),
});
