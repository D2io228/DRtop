/* ===================================================================
   YEEZUS — book assembly + pagination engine
   =================================================================== */
const TRACKS = [
  { n: 1, id: 't1', title: 'On Sight', ru: 'Агрессия как способ немедленно завладеть миром', dur: '2:36', ch: 0,
    theme: 'dark', bg: '#0A0A0A', acc: '#E0201B',
    vibe: 'Сигнал, который не должен был включиться. Кислота, металл, сухие удары — и хор за стеной, на несколько секунд открывающий дверь в другой мир.',
    tags: 'Кислотный синт · сухие удары · искажённый низ · госпел', who: 'Интерполяция «Sermon (He’ll Give Us What We Really Need)»', dev: 'Обрыв' },
  { n: 2, id: 't2', title: 'Black Skinhead', ru: 'Тело под наблюдением', dur: '3:08', ch: 0,
    theme: 'dark', bg: '#070707', acc: '#E3231C',
    vibe: 'Барабаны как погоня. Дыхание как сирена. Прожекторы ищут тело, которое уже назначили чудовищем.',
    tags: 'Марш · дыхание · скандирование · погоня', who: 'Образ: Кинг-Конг на вершине', dev: 'Присвоение символа' },
  { n: 3, id: 't3', title: 'I Am a God', ru: 'Самообожествление и страх', dur: '3:51', ch: 1,
    theme: 'bone', bg: '#F1F1EE', acc: '#C81A14', fg: '#111214', mute: '#7D8085',
    vibe: 'Холодный зал. Нимб, который приходится всё время поддерживать. Крик, которого никто не ждал, — и круассаны, которых ждут слишком долго.',
    tags: 'Холод · разреженность · крик · дыхание', who: 'В треклисте: feat. God', dev: 'Батос' },
  { n: 4, id: 't4', title: 'New Slaves', ru: 'Освобождение, которое застревает в языке господства', dur: '4:16', ch: 1,
    theme: 'bone', bg: '#DCD8D1', acc: '#C41C16', fg: '#121110', mute: '#6E6A63',
    vibe: 'Штрихкод на стене здания. Решётка из цен. И горизонт, который открывается только в самом конце.',
    tags: 'Проекция · обвинение · кода', who: 'Frank Ocean · семпл Omega «Gyöngyhajú lány»', dev: 'Переименование' },
  { n: 5, id: 't5', title: 'Hold My Liquor', ru: 'Когда возвращение оказывается повторением', dur: '5:26', ch: 2,
    theme: 'dark', bg: '#0E0A07', acc: '#E0962F', fg: '#EADFCC', mute: '#8F7F68',
    vibe: 'Четыре утра. Фары на мокром асфальте. Гитара, которая договаривает то, что ты так и не смог сказать.',
    tags: 'Туман · похмелье · гитарное соло', who: 'Justin Vernon · Chief Keef · соло Mike Dean', dev: 'Звуковая петля' },
  { n: 6, id: 't6', title: 'I’m in It', ru: 'Желание, утратившее обещание свободы', dur: '3:54', ch: 2,
    theme: 'dark', bg: '#140404', acc: '#FF3B2E', fg: '#F0DCD6', mute: '#9A6A62',
    vibe: 'Красная комната без окон. Дыхание, вшитое в ритм. Чем глубже — тем меньше выхода.',
    tags: 'Дыхание · дэнсхолл · дымка', who: 'Assassin · Justin Vernon', dev: 'Присвоение символов' },
  { n: 7, id: 't7', title: 'Blood on the Leaves', ru: 'Частная катастрофа перед лицом исторической боли', dur: '6:00', ch: 2,
    theme: 'dark', bg: '#070505', acc: '#B3141A', fg: '#E8E1D6', mute: '#8C7F78',
    vibe: 'Фортепиано. Голос, несущий память о терроре. Медь, которая обрушивается как небо, — и человек, не способный вместить масштаб чужой боли.',
    tags: 'Фортепиано · медь · Auto-Tune', who: 'Nina Simone «Strange Fruit» · TNGHT «R U Ready»', dev: 'Несоразмерность' },
  { n: 8, id: 't8', title: 'Guilt Trip', ru: 'Остроумие как защита от признания', dur: '4:03', ch: 3,
    theme: 'dark', bg: '#060A14', acc: '#8FB0EA', fg: '#DCE3F0', mute: '#6F7C96',
    vibe: 'Синий туман после бури. Звёзды, которые никак не складываются в созвездие. Голос, который остался, когда все ушли.',
    tags: 'Мерцание · струнные · дымка', who: 'Kid Cudi', dev: 'Каламбур как уклонение' },
  { n: 9, id: 't9', title: 'Send It Up', ru: 'Последняя попытка заглушить память', dur: '2:58', ch: 3,
    theme: 'dark', bg: '#090909', acc: '#FF2A1F', fg: '#ECE6DC', mute: '#8A847A',
    vibe: 'Сирена над танцполом. Бархатный канат. Память, которую не перекричать никакой громкостью.',
    tags: 'Сирена · клуб · холодный ритм', who: 'King Louie · семпл Beenie Man «Memories»', dev: 'Самоумаление' },
  { n: 10, id: 't10', title: 'Bound 2', ru: 'Возможность связи и предел превращения', dur: '3:49', ch: 4,
    theme: 'bone', bg: '#F3E8D8', acc: '#D2552C', fg: '#2A1A12', mute: '#94705A',
    vibe: 'Окно настежь. Тёплый соул, закатный свет, нарезанный грубыми ножницами. И впервые — слёзы.',
    tags: 'Соул · нарезка · тепло', who: 'Ponderosa Twins Plus One · Brenda Lee · Charlie Wilson', dev: 'Двусмысленность' },
];
const CHAPTERS = [
  { n: 'I', en: 'Fighting', ru: 'Борьба', tracks: [1, 2], note: 'Голос входит без стука и требует, чтобы на него смотрели.' },
  { n: 'II', en: 'Rising', ru: 'Восхождение', tracks: [3, 4], note: 'Подъём на вершину — и вопрос о том, кто ею владеет.' },
  { n: 'III', en: 'Falling', ru: 'Падение', tracks: [5, 6, 7], note: 'Частная жизнь, желание и катастрофа, которую не удаётся объяснить.' },
  { n: 'IV', en: 'Searching', ru: 'Поиск', tracks: [8, 9], note: 'Вина, клуб, память — и попытки не чувствовать.' },
  { n: 'V', en: 'Finding', ru: 'Обретение', tracks: [10], note: 'Маска снята. Окно открыто.' },
];
const SOURCES = {
  'apple': ['Apple Music — Kanye West, «Yeezus» (2013)', 'music.apple.com/us/album/yeezus/1440873068'],
  'wiki': ['Wikipedia — «Yeezus»: запись, упаковка, минимализм, презентация «New Slaves»', 'en.wikipedia.org/wiki/Yeezus'],
  'wmag': ['W Magazine — Kanye West on Kim Kardashian and His New Album «Yeezus»', 'wmagazine.com/story/kanye-west-on-kim-kardashian-and-his-new-album-yeezus'],
  'credits-pf': ['Pitchfork — Check Out the Full Credits for Kanye West’s «Yeezus»', 'pitchfork.com/news/51178-check-out-the-full-credits-for-kanye-wests-yeezus'],
  'rubin': ['Pitchfork — Rick Rubin Discusses the Intense Completion of Kanye West’s «Yeezus»', 'pitchfork.com/news/51175-rick-rubin-discusses-the-intense-completion-of-kanye-wests-yeezus'],
  'lou': ['Talkhouse — Lou Reed Talks Kanye West’s «Yeezus»', 'talkhouse.com/lou-reed-of-the-velvet-underground-talks-kanye-wests-yeezus'],
  'stereogum': ['Stereogum — «Yeezus» Cover Revealed', 'stereogum.com/1370362/yeezus-cover-revealed/news'],
  'credits': ['Официальные кредиты «Yeezus» (PDF)', 'images.modlife.com.s3.amazonaws.com/custom/kanye/YEEZUS-CREDITS.pdf'],
  'ohhla-bs': ['OHHLA — текст «Black Skinhead»', 'ohhla.com/anonymous/kan_west/yeezus/blk_skin.wst.txt'],
  'ohhla-god': ['OHHLA — текст «I Am a God»', 'ohhla.com/anonymous/kan_west/yeezus/iam_agod.wst.txt'],
  'shazam': ['Shazam — «New Slaves»', 'shazam.com/song/1440873235/new-slaves'],
  'ohhla-hml': ['OHHLA — текст «Hold My Liquor»', 'ohhla.com/anonymous/kan_west/yeezus/hold_my.wst.txt'],
  'sessions': ['Pitchfork — The «Yeezus» Sessions', 'pitchfork.com/features/article/9157-the-yeezus-sessions'],
  'ohhla-im': ['OHHLA — текст «I’m in It»', 'ohhla.com/anonymous/kan_west/yeezus/im_in_it.wst.txt'],
  'loc': ['Library of Congress Blog — The Power of a Poem', 'blogs.loc.gov/loc/2015/04/the-power-of-a-poem'],
  'ohhla-blood': ['OHHLA — текст «Blood on the Leaves»', 'ohhla.com/anonymous/kan_west/yeezus/blood_on.wst.txt'],
  'lw-gt': ['LyricsWeb — «Guilt Trip»', 'lyricsweb.com/song/kanye-west/kanye-west-guilt-trip'],
  'cudi': ['Pitchfork — Kid Cudi Is Annoyed With His «Yeezus» Feature', 'pitchfork.com/news/54155-kid-cudi-is-annoyed-with-his-yeezus-feature'],
  'lw-siu': ['LyricsWeb — «Send It Up»', 'lyricsweb.com/song/kanye-west/kanye-west-send-it-up'],
  'ohhla-b2': ['OHHLA — текст «Bound 2»', 'ohhla.com/anonymous/kan_west/yeezus/bound_2.wst.txt'],
  'tour': ['Wikipedia — The Yeezus Tour: сцена, маски, пять глав шоу', 'en.wikipedia.org/wiki/The_Yeezus_Tour'],
};
const SECTIONS = {
  prologue: { label: 'Пролог', title: 'Неисправность', theme: 'dark', mini: 'prologue', hdrR: 'Пролог · 0:00' },
  context: { label: 'I · Контекст', title: 'После вершины', theme: 'bone', mini: 'context', hdrR: 'Контекст' },
  sound: { label: 'II · Звук', title: 'Тщательно устроенная грубость', theme: 'bone', mini: 'sound', hdrR: 'Музыкальная эстетика', vars: { bg: '#E4E2DE' } },
  whole: { label: 'Целое', title: 'Человек внутри машины', theme: 'bone', mini: 'whole', hdrR: 'Литературная целостность' },
  limit: { label: 'Предел', title: 'Выразительность и правота', theme: 'dark', mini: 'limit', hdrR: 'Самое серьёзное ограничение', head: true, sub: 'Соблазн принять выразительность за правоту' },
};

const BOOK_TITLE = 'Yeezus — власть, желание и человек внутри машины';
const $ = (s, el = document) => el.querySelector(s);
const book = document.getElementById('book');
const pagesMeta = []; // {el, anchor}

function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function styleVars(o) { if (!o) return ''; return Object.entries(o).filter(([k, v]) => v).map(([k, v]) => `--${k}:${v}`).join(';'); }
function trackVars(t) { return styleVars({ bg: t.bg, acc: t.acc, fg: t.fg, mute: t.mute }); }

function addPage(cls, inner, opts = {}) {
  const p = el(`<section class="page ${cls}" style="${opts.style || ''}">${inner}</section>`);
  if (opts.anchor) p.dataset.anchor = opts.anchor;
  if (opts.notape) p.dataset.notape = '1';
  book.appendChild(p);
  return p;
}
function tapeHTML(seed) { return `<div class="tape"><svg viewBox="0 0 8.4 44" preserveAspectRatio="none">${A.tape(8.4, 44, seed, { tornTop: false })}</svg><div class="pn"></div></div>`; }

/* ------------------------------------------------------------------ */
/* FLOW ENGINE                                                          */
/* ------------------------------------------------------------------ */
function flowPage(conf, idx) {
  const { theme, vars, hdrL, hdrR, mini, rail, head } = conf;
  const p = addPage(`theme-${theme} flow`, `
      <div class="grain"></div>
      ${tapeHTML(idx * 31 + conf.seed)}
      <div class="hdr mono"><span class="l">${hdrL}</span><span class="r">${hdrR}</span></div>
      <div class="rail"></div>
      <div class="col ${idx === 0 && head ? 'withhead' : ''}"></div>
      <div class="mini">${A.mini(mini, 'var(--acc)', 'var(--fg)').replace(/var\(--acc\)/g, conf.accHex).replace(/var\(--fg\)/g, conf.fgHex)}</div>
      <div class="ftr mono"><span>${BOOK_TITLE}</span><span class="fr"></span></div>`, { style: styleVars(vars) });
  if (idx === 0 && head) {
    p.appendChild(el(`<div class="shead"><div class="lab mono">${head.lab}</div><h2>${head.title}</h2><div class="sub">${head.sub || ''}</div></div>`));
  }
  p.dataset.flow = conf.id; p.dataset.fidx = idx;
  if (idx === 0 && conf.anchor) p.dataset.anchor = conf.anchor;
  return p;
}

function wordBoundaries(node) {
  const res = []; const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let tn; while ((tn = walker.nextNode())) { const t = tn.data; for (let i = 1; i < t.length; i++) if (t[i] === ' ' && t[i - 1] !== ' ') res.push([tn, i]); }
  return res;
}

function runFlow(conf) {
  const src = document.querySelector(`#src section[data-flow="${conf.id}"]`);
  const nodes = [...src.children];
  if (nodes[0] && nodes[0].tagName === 'P') nodes[0].classList.add('lead');
  let idx = 0; let page = flowPage(conf, idx); let col = $('.col', page);
  const pages = [page];
  const bottom = () => col.getBoundingClientRect().bottom;
  const fits = () => { const l = col.lastElementChild; if (!l) return true; const r = l.getBoundingClientRect(); const mb = parseFloat(getComputedStyle(l).marginBottom) || 0; return r.bottom <= bottom() + .5; };
  const next = () => { idx++; page = flowPage(conf, idx); col = $('.col', page); pages.push(page); };
  const queue = nodes.slice();
  while (queue.length) {
    const node = queue.shift();
    col.appendChild(node);
    if (fits()) continue;
    // try splitting paragraphs
    if (node.tagName === 'P') {
      const lh = parseFloat(getComputedStyle(node).lineHeight);
      const avail = bottom() - node.getBoundingClientRect().top;
      const totalLines = Math.round(node.getBoundingClientRect().height / lh);
      const fitLines = Math.floor((avail + 1) / lh);
      if (fitLines >= 2 && totalLines - fitLines >= 1) {
        const b = wordBoundaries(node);
        // binary search the largest boundary that fits
        let lo = 0, hi = b.length - 1, best = -1;
        const original = node.cloneNode(true);
        const tryCut = (k) => {
          node.replaceChildren(...original.cloneNode(true).childNodes);
          const bb = wordBoundaries(node)[k];
          const rg = document.createRange(); rg.setStart(bb[0], bb[1]); rg.setEnd(node, node.childNodes.length);
          rg.deleteContents();
          return fits();
        };
        while (lo <= hi) { const mid = (lo + hi) >> 1; if (tryCut(mid)) { best = mid; lo = mid + 1; } else hi = mid - 1; }
        if (best >= 0) {
          // widow control: tail must have >= 2 lines if possible
          tryCut(best);
          let headLines = Math.round(node.getBoundingClientRect().height / lh);
          let restLines = totalLines - headLines;
          if (restLines < 2 && headLines >= 3) {
            // back off ~one line
            const targetBottom = node.getBoundingClientRect().bottom - lh;
            let k = best; while (k > 0) { k--; tryCut(k); if (node.getBoundingClientRect().bottom <= targetBottom + .5) break; }
            best = k;
          }
          tryCut(best);
          headLines = Math.round(node.getBoundingClientRect().height / lh);
          if (headLines >= 2) {
            // build tail
            const tail = original.cloneNode(true);
            const bb = wordBoundaries(tail)[best];
            const rg = document.createRange(); rg.setStart(tail, 0); rg.setEnd(bb[0], bb[1] + 1);
            rg.deleteContents();
            tail.classList.add('cont'); tail.classList.remove('lead');
            node.classList.add('splithead');
            next();
            queue.unshift(tail);
            continue;
          }
          node.replaceChildren(...original.childNodes);
        } else node.replaceChildren(...original.childNodes);
      }
    }
    // move to the next page
    col.removeChild(node);
    const carry = [];
    while (col.lastElementChild && col.lastElementChild.tagName === 'H3') carry.unshift(col.removeChild(col.lastElementChild));
    next();
    carry.forEach(c => col.appendChild(c));
    col.appendChild(node);
  }
  // end mark
  if (conf.end) {
    const em = el(`<div class="endmark mono">${conf.end}</div>`);
    col.appendChild(em);
    if (!fits()) col.removeChild(em);
  }
  // rail: first page meta + playhead on all pages
  pages.forEach((pg, i) => {
    const rail = $('.rail', pg);
    if (i === 0 && conf.railMeta) rail.insertAdjacentHTML('beforeend', conf.railMeta);
    if (conf.play) {
      const t0 = i / pages.length, t1 = (i + 1) / pages.length;
      const H = 46; const y = H * t1;
      rail.insertAdjacentHTML('beforeend', `<div class="play"><div class="line"></div><div class="done" style="height:${(H * t1).toFixed(1)}mm"></div><div class="dot" style="top:${(y - 1.35).toFixed(1)}mm"></div><div class="t0 mono">0:00</div><div class="t1 mono">${conf.play}</div></div>`);
    }
  });
  return pages;
}

/* ------------------------------------------------------------------ */
/* STATIC PAGES                                                         */
/* ------------------------------------------------------------------ */
function art(name, ...args) { try { return A[name] ? A[name](...args) : ''; } catch (e) { console.error('art fail', name, e); return ''; } }

function pageCover() {
  addPage('cover', `${art('cover')}<div class="grain" style="--grain:url(../assets/grain-dark.png);--gop:.35"></div>
    <div class="over mono" style="left:31mm;top:22mm;color:#1a1a1a">Kanye West · 18.06.2013</div>
    <div class="over mono" style="right:31mm;top:22mm;color:#1a1a1a;text-align:right">10 треков · 40:01</div>
    <div class="over sticker" style="left:122mm;top:160mm;width:51mm;">
      <div class="mono" style="font-size:5.6pt;letter-spacing:.14em;color:#111"><b>Критическое прочтение</b></div>
      <div style="font:italic 500 10.5pt/1.12 var(--serif);color:#111;margin-top:1.4mm">Власть, желание и человек внутри машины</div>
      <div class="mono" style="font-size:5pt;color:#777;margin-top:1.6mm">Разбор альбома · иллюстрированное издание</div>
    </div>
    <div class="over" style="left:29mm;top:199mm;font:900 100pt/0.8 var(--grot);letter-spacing:-.045em;color:#0E0E0E">YEEZUS</div>
    <div class="over tsub" style="left:31mm;top:241mm;font-size:21pt;color:#1a1a1a;line-height:1.1">Власть, желание<br>и человек внутри машины</div>
    <div class="over mono" style="left:31mm;bottom:16mm;color:#555">Разбор альбома Kanye West</div>
    <div class="over mono" style="right:31mm;bottom:16mm;color:#555;text-align:right">Fighting · Rising · Falling · Searching · Finding</div>
  `, { notape: true });
}

function pageTitle() {
  addPage('theme-dark', `<div class="grain"></div>${art('titleArt')}
    <div class="over mono acc" style="left:27mm;top:24mm">Эпиграф</div>
    <div class="over" style="left:27mm;right:24mm;top:96mm;font:italic 400 30pt/1.12 var(--serif);color:var(--fg)">Сначала он даёт почувствовать себя неуязвимым.<br><span style="color:var(--acc)">Потом предъявляет счёт.</span></div>
    <div class="over mono mute" style="left:27mm;top:150mm">— о том, как действует «Yeezus»</div>
    <div class="over" style="left:27mm;width:96mm;bottom:28mm;font:500 9.5pt/1.45 var(--serif);color:var(--mute)">
      Это авторское критическое прочтение. Сведения о записи, семплах и участниках опираются на источники — их список в конце книги. Трактовки образов и драматургии остаются интерпретациями: альбом допускает больше одного честного прочтения.</div>
    <div class="over mono mute" style="right:24mm;bottom:28mm;text-align:right">Yeezus<br>2013 / Def Jam<br>40:01</div>`, { notape: true });
}

function pageContents() {
  const rows = [];
  const sec = (num, title, sub, anchor) => rows.push(`<div class="toc-row sec"><span class="n mono">${num}</span><span class="t">${title}</span><span class="s">${sub}</span><span class="d mono"></span><span class="pg mono" data-ref="${anchor}"></span></div>`);
  sec('◦', 'Пролог', 'Неисправность', 'prologue');
  sec('I', 'Контекст', 'После вершины', 'context');
  sec('II', 'Звук', 'Тщательно устроенная грубость', 'sound');
  CHAPTERS.forEach((c, ci) => {
    rows.push(`<div class="toc-ch mono"><span>Глава ${c.n} — ${c.ru}</span><span>${c.en}</span></div>`);
    c.tracks.forEach(n => { const t = TRACKS[n - 1]; rows.push(`<div class="toc-row trk" style="--c:${t.acc}"><span class="n">${String(n).padStart(2, '0')}</span><span class="t">${t.title}</span><span class="s">${t.ru}</span><span class="d mono">${t.dur}</span><span class="pg mono" data-ref="${t.id}"></span></div>`); });
  });
  rows.push(`<div class="toc-ch mono"><span>После</span><span>Outro</span></div>`);
  sec('◦', 'Целое', 'Человек внутри машины', 'whole');
  sec('◦', 'Предел', 'Выразительность и правота', 'limit');
  sec('◦', 'Кода', 'Другой человек', 'coda');
  sec('◦', 'Источники', 'И выходные данные', 'sources');
  // timeline
  const total = 2401; const secs = ['2:36', '3:08', '3:51', '4:16', '5:26', '3:54', '6:00', '4:03', '2:58', '3:49'].map(s => { const [m, x] = s.split(':'); return +m * 60 + +x; });
  let acc = 0; let bar = '';
  secs.forEach((s, i) => { const t = TRACKS[i]; bar += `<div class="seg" style="left:${(acc / total * 100).toFixed(3)}%;width:${(s / total * 100).toFixed(3)}%;background:${t.acc};--bgc:${t.bg}"><span class="mono">${String(i + 1).padStart(2, '0')}</span></div>`; acc += s; });
  addPage('theme-bone contents', `<div class="grain"></div>${tapeHTML(5)}
    <div class="over mono acc" style="left:27mm;top:22mm">Содержание / Tracklist</div>
    <div class="over" style="left:27mm;top:30mm;font:900 54pt/.86 var(--cond);text-transform:uppercase;color:var(--fg)">Сорок минут<br>и одна секунда</div>
    <div class="over tl" style="left:27mm;right:18mm;top:66mm;">${bar}<div class="tl-a mono">0:00</div><div class="tl-b mono">40:01</div></div>
    <div class="over toc" style="left:27mm;right:18mm;top:82mm;">${rows.join('')}</div>
    <div class="over" style="left:27mm;right:18mm;bottom:15mm;font:italic 500 9.6pt/1.4 var(--serif);color:var(--mute)">Главы книги названы по пяти актам тура Yeezus 2013–2014 годов — Fighting, Rising, Falling, Searching, Finding.<sup class="fnx" data-s="tour"></sup> Распределение песен по главам — интерпретация, а не авторский замысел.</div>
  `, { anchor: 'contents' });
}

function pageOpenerSection(key) {
  const fn = { prologue: 'prologueArt', context: 'contextArt', sound: 'soundArt', whole: 'wholeArt' }[key];
  const s = SECTIONS[key];
  const p = addPage(`theme-${s.theme} opener op-${key}`, `${art(fn)}<div class="grain"></div>${(window.OPENER_TXT[key] || (() => ''))()}`, { anchor: key, style: styleVars(s.vars) });
  return p;
}

function pageChapter(c, i) {
  addPage('theme-dark chapter', `${art('chapterArt', i)}<div class="grain"></div>
    <div class="over mono" style="left:24mm;top:20mm;color:var(--fg)">Глава ${c.n}</div>
    <div class="over mono" style="right:24mm;top:20mm;color:var(--mute);text-align:right">Yeezus Tour · act ${i + 1}/5</div>
    <div class="over chword" style="left:0;right:0;top:152.6mm;text-align:center;">${c.en.toUpperCase()}</div>
    <div class="over" style="left:0;right:0;top:183mm;text-align:center;font:900 44pt/1 var(--cond);letter-spacing:.02em;text-transform:uppercase;color:var(--fg)">${c.ru}</div>
    <div class="over" style="left:40mm;right:40mm;top:200mm;text-align:center;font:italic 500 13pt/1.3 var(--serif);color:var(--mute)">${c.note}</div>
    <div class="over mono" style="left:24mm;right:24mm;bottom:16mm;display:flex;justify-content:space-between;color:var(--fg)">${c.tracks.map(n => `<span><span class="acc">${String(n).padStart(2, '0')}</span> ${TRACKS[n - 1].title}</span>`).join('')}</div>
  `, { anchor: 'ch' + i, notape: true });
}

function pageTrackOpener(t) {
  const f = window.TRACK_LAYOUT[t.id] || window.TRACK_LAYOUT.default;
  addPage(`theme-${t.theme} opener trk`, `${art(t.id)}<div class="grain"></div>${f(t)}`, { anchor: t.id, style: trackVars(t) });
}

function trackRailMeta(t) {
  return `<div class="meta mono"><div class="big">${String(t.n).padStart(2, '0')}</div>
    <div><span class="k">Трек</span><br><span class="v">${t.n} / 10 · ${t.dur}</span></div>
    <div><span class="k">Глава</span><br><span class="v">${CHAPTERS[t.ch].n} · ${CHAPTERS[t.ch].ru}</span></div>
    <div><span class="k">Приём</span><br><span class="v">${t.dev}</span></div></div>`;
}

/* ------------------------------------------------------------------ */
async function build() {
  await document.fonts.ready;
  const faces = ['500 12pt "Cormorant Garamond"', 'italic 500 12pt "Cormorant Garamond"', '700 12pt "Cormorant Garamond"', 'italic 400 12pt "Cormorant Garamond"', 'italic 300 12pt "Cormorant Garamond"', '400 12pt "Cormorant Garamond"', '600 12pt "Cormorant Garamond"',
    '400 8pt "IBM Plex Mono"', '600 8pt "IBM Plex Mono"', '500 8pt "IBM Plex Mono"', '900 20pt "Alumni Sans"', '800 20pt "Alumni Sans"', '300 20pt "Alumni Sans"', '900 20pt "Inter Display"'];
  await Promise.all(faces.map(f => document.fonts.load(f, 'АБВ abc')));

  // footnote numbering by first appearance (contents note first, then flow order)
  const order = []; const num = {};
  const assign = (k) => { if (!(k in num)) { order.push(k); num[k] = order.length; } return num[k]; };
  // flows appear in this order
  ['prologue', 'context', 'sound', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 'whole', 'limit'].forEach(id => {
    document.querySelectorAll(`#src section[data-flow="${id}"] sup[data-s]`).forEach(s => { s.textContent = assign(s.dataset.s); });
  });
  assign('tour');
  window.__FN = { order, num };

  pageCover();
  pageTitle();
  pageContents();
  document.querySelectorAll('sup.fnx[data-s]').forEach(s => s.textContent = num[s.dataset.s]);

  const flowConf = (id, extra) => {
    const s = SECTIONS[id];
    return Object.assign({ id, seed: id.length * 7, theme: s.theme, vars: s.vars, hdrL: s.label, hdrR: s.hdrR, mini: s.mini, accHex: s.theme === 'dark' ? '#E0201B' : '#D61E17', fgHex: s.theme === 'dark' ? '#E6E0D5' : '#141210' }, extra || {});
  };
  pageOpenerSection('prologue');
  runFlow(flowConf('prologue', { end: '<span class="sq"></span><span>Дальше → I · После вершины</span>' }));
  pageOpenerSection('context');
  runFlow(flowConf('context', { end: '<span class="sq"></span><span>Дальше → люди внутри машины</span>' }));
  if (A.personnelArt) { addPage('theme-dark personnel', `${art('personnelArt')}<div class="grain"></div>${window.OPENER_TXT.personnel()}`, { anchor: 'personnel', style: '--bg:#101010' }); }
  pageOpenerSection('sound');
  runFlow(flowConf('sound', { vars: SECTIONS.sound.vars, end: '<span class="sq"></span><span>Дальше → открытый гроб</span>' }));
  if (A.packagingArt) { addPage('theme-bone packaging', `${art('packagingArt')}<div class="grain"></div>${window.OPENER_TXT.packaging()}`, { anchor: 'packaging', style: '--bg:#F0F0EE' }); }

  CHAPTERS.forEach((c, ci) => {
    pageChapter(c, ci);
    c.tracks.forEach(n => {
      const t = TRACKS[n - 1];
      pageTrackOpener(t);
      runFlow({ id: t.id, seed: n * 13, theme: t.theme, vars: { bg: t.bg, acc: t.acc, fg: t.fg, mute: t.mute }, hdrL: `${String(n).padStart(2, '0')} — ${t.title}`, hdrR: `Глава ${CHAPTERS[t.ch].n} · ${CHAPTERS[t.ch].ru}`, mini: t.id, accHex: t.acc, fgHex: t.fg || (t.theme === 'dark' ? '#E6E0D5' : '#141210'), railMeta: trackRailMeta(t), play: t.dur, anchor: t.id + '-text',
        end: `<span class="sq"></span><span>Конец трека · ${t.dur}</span><span class="nx">Дальше → ${n < 10 ? String(n + 1).padStart(2, '0') + ' · ' + TRACKS[n].title : 'Целое · Человек внутри машины'}</span>` });
    });
  });
  pageOpenerSection('whole');
  runFlow(flowConf('whole', { end: '<span class="sq"></span><span>Дальше → Предел</span>' }));
  runFlow(flowConf('limit', { head: { lab: 'Предел', title: 'Выразительность<br>и правота', sub: SECTIONS.limit.sub }, anchor: 'limit', end: '<span class="sq"></span><span>Дальше → Кода</span>' }));
  if (A.codaArt) addPage('theme-dark coda', `${art('codaArt')}<div class="grain"></div>${window.OPENER_TXT.coda()}`, { anchor: 'coda' });
  pageSources();
  addPage('back', `${art('back')}<div class="grain" style="--grain:url(../assets/grain-dark.png);--gop:.35"></div>${window.OPENER_TXT.back()}`, { notape: true });

  // page numbers
  const pages = [...document.querySelectorAll('.page')];
  pages.forEach((p, i) => { const pn = p.querySelector('.tape .pn'); if (pn) pn.textContent = String(i + 1).padStart(2, '0'); const fr = p.querySelector('.ftr .fr'); if (fr) fr.textContent = `${String(i + 1).padStart(2, '0')} / ${pages.length}`; });
  const anchorPage = {}; pages.forEach((p, i) => { if (p.dataset.anchor && !(p.dataset.anchor in anchorPage)) anchorPage[p.dataset.anchor] = i + 1; });
  document.querySelectorAll('[data-ref]').forEach(r => { const v = anchorPage[r.dataset.ref]; r.textContent = v ? String(v).padStart(2, '0') : '—'; });
  window.__pages = pages.length;
  window.__done = true;
}

function pageSources() {
  const { order, num } = window.__FN;
  const items = order.map(k => { const s = SOURCES[k]; return `<div class="src"><span class="sn mono">${num[k]}</span><span class="st">${s[0]}<br><span class="su mono">${s[1]}</span></span></div>`; }).join('');
  addPage('theme-bone sources', `<div class="grain"></div>${tapeHTML(9)}
    <div class="over mono acc" style="left:27mm;top:22mm">Источники</div>
    <div class="over" style="left:27mm;top:30mm;font:900 54pt/.86 var(--cond);text-transform:uppercase;color:var(--fg)">Сноски<br>и следы</div>
    <div class="over srcs" style="left:27mm;right:18mm;top:64mm;">${items}</div>
    <div class="over colo" style="left:27mm;right:18mm;bottom:15mm;">
      <div class="mono acc">Выходные данные</div>
      <div class="cbody">Текст — литературная редакция авторского разбора альбома Kanye West «Yeezus» (2013). Все иллюстрации — оригинальные генеративные работы, созданные для этого издания по мотивам эстетики альбома и тура: прозрачный футляр, красная лента, маски, гора, свет. Гарнитуры — Cormorant Garamond, Alumni Sans, Inter Display, IBM Plex Mono.</div>
    </div>`, { anchor: 'sources' });
}

window.addEventListener('load', () => { build().catch(e => { console.error(e); window.__err = String(e && e.stack || e); window.__done = true; }); });
