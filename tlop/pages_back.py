"""Epilogue, sources & colophon, back cover."""
from data import ALBUMS, MOTIFS, MOTIF_MAP, TRACKS
from lib import P, esc, folio, icon_escobar, icon_paul, icon_picasso, page, typo

T = {t["n"]: t for t in TRACKS}
SHORT = {1: "Ultralight Beam", 2: "Pt. 1", 3: "Pt. 2", 4: "Famous", 5: "Feedback", 6: "Low Lights",
         7: "Highlights", 8: "Freestyle 4", 9: "I Love Kanye", 10: "Waves", 11: "FML", 12: "Real Friends",
         13: "Wolves", 14: "Frank’s Track", 15: "Silver Surfer", 16: "30 Hours", 17: "No More Parties", 18: "Facts",
         19: "Fade", 20: "Saint Pablo"}


# =================================================================== EPILOGUE (a): the seam + seismograph
def epi_a():
    W, H = 210, 74
    cw = W / 20
    mid = 36
    unit = 9.6
    s = [f'<svg width="{W}mm" height="{H + 22}mm" viewBox="0 0 {W} {H + 22}">']
    for v in (-3, 0, 3):
        y = mid - v * unit
        s.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="#15110e" stroke-width="{.35 if v == 0 else .15}" stroke-dasharray="{"" if v == 0 else "1 1"}" opacity=".6"/>')
    s.append(f'<text x="0" y="{mid - 3 * unit - 2.5}" font-family="Arimo" font-weight="700" font-size="2.9" letter-spacing=".6">ВЛАДЕТЬ СОБОЙ</text>')
    s.append(f'<text x="0" y="{mid + 3 * unit + 5.2}" font-family="Arimo" font-weight="700" font-size="2.9" letter-spacing=".6">НУЖДАТЬСЯ В ДРУГИХ</text>')
    pts = [(i * cw + cw / 2, mid - t["self"] * unit) for i, t in enumerate(TRACKS)]
    # smooth line
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    s.append(f'<path d="{d}" fill="none" stroke="#d9662c" stroke-width="1.3"/>')
    strong = {1: "уступает место хору", 12: "признаёт своё отсутствие", 14: "даёт Фрэнку закончить", 20: "даёт Самфе попросить"}
    for (x, y), t in zip(pts, TRACKS):
        big = t["n"] in strong
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{2.2 if big else 1.1}" fill="{"#15110e" if big else "#d9662c"}"/>')
        s.append(f'<text x="{x:.1f}" y="{H + 8}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="2.6">{t["n"]:02d}</text>')
        s.append(f'<text x="{x:.1f}" y="{H + 11.5}" text-anchor="middle" font-family="EB Garamond" font-style="italic" font-size="2.1" transform="rotate(0)">{esc(SHORT[t["n"]][:14])}</text>')
        if big:
            off = {1: (10, 7.4, "start"), 12: (0, -5.2, "middle"), 14: (0, 7.6, "middle"), 20: (-3, -5.2, "end")}[t["n"]]
            s.append(f'<text x="{x + off[0]:.1f}" y="{y + off[1]:.1f}" text-anchor="{off[2]}" font-family="EB Garamond" font-style="italic" font-size="3.3">{strong[t["n"]]}</text>')
    s.append("</svg>")
    css = """
#epi-a .k{position:absolute;left:20mm;top:18mm}
#epi-a h2{position:absolute;left:19mm;top:23mm;margin:0;font:italic 300 54pt/1 'Cormorant Garamond'}
#epi-a .mark{position:absolute;right:20mm;top:17mm;font:700 5.2pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #15110e;padding:.7mm 1.3mm}
#epi-a .ck{position:absolute;left:20mm;top:50mm;font:700 6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#epi-a .chart{position:absolute;left:20mm;top:56mm}
#epi-a .txt{position:absolute;left:20mm;top:156mm;width:210mm;height:74mm;font-size:11pt}
"""
    text = P(
        "Величие <i>The Life of Pablo</i> — в редкой согласованности литературной и музыкальной проблемы. Тексты всё время обещают устойчивую идентичность; форма показывает её распад и повторную сборку. Местоимения меняют направление ответственности. Просьбы становятся приказами. Воспоминание оборачивается оправданием. Самоирония даёт краткую дистанцию, после которой привычное поведение возвращается.",
        "На музыкальном уровне ту же работу выполняют монтаж, обработка голоса, изменение плотности и повтор. Голос способен стать телом, хором, призраком, ударным элементом или телефонным документом. Петля удерживает воспоминание; резкий переход прерывает его осмысление; чужая мелодия приносит чувство, которого собственная речь героя не могла выразить.",
        "При этом красота музыки иногда наделяет слова эмоциональным авторитетом, которого они сами не заслужили. Великолепный госпел-подъём способен сделать грубую реплику частью катарсиса. Прекрасная мелодия окружает заботой человека, который пока недостаточно заботлив к другим. Это одна из самых сложных сторон альбома: слушатель переживает сострадание — и сохраняет основания для несогласия.",
        first="dc",
    )
    body = (
        '<div class="k kicker">Эпилог</div><div class="mark">прочтение</div>'
        + '<h2>Шов</h2>'
        + '<div class="ck">Сейсмограмма альбома: двадцать треков между двумя полюсами главного конфликта</div>'
        + f'<div class="chart">{"".join(s)}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="Эпилог")
    )
    return page("epi-a", body, cls="tex", css=css)


# =================================================================== EPILOGUE (b): three albums + motif map
def epi_b():
    # albums: dots = tracks, bar = minutes
    a = ['<svg width="96mm" height="70mm" viewBox="0 0 96 70">']
    for i, (name, year, n, mins, word) in enumerate(ALBUMS):
        y = 6 + i * 22
        a.append(f'<text x="0" y="{y}" font-family="Arimo" font-weight="700" font-size="2.9">{esc(name)} · {year}</text>')
        for k in range(n):
            a.append(f'<circle cx="{1.6 + k * 4.2:.1f}" cy="{y + 4.5}" r="1.4" fill="{"#d9662c" if i == 2 else "#15110e"}"/>')
        a.append(f'<rect x="0" y="{y + 8}" width="{mins * 1.2:.1f}" height="3" fill="{"#d9662c" if i == 2 else "#15110e"}" opacity=".85"/>')
        a.append(f'<text x="{mins * 1.2 + 2:.1f}" y="{y + 10.6}" font-family="Arimo" font-size="2.7">≈ {mins} мин · {n} треков</text>')
        a.append(f'<text x="96" y="{y}" text-anchor="end" font-family="EB Garamond" font-style="italic" font-size="4">{word}</text>')
    a.append("</svg>")
    # motif matrix
    cw, rh = 7.6, 4.15
    m = [f'<svg width="{30 + cw * len(MOTIFS):.0f}mm" height="{14 + rh * 20:.0f}mm" viewBox="0 0 {30 + cw * len(MOTIFS):.0f} {14 + rh * 20:.0f}">']
    for j, mo in enumerate(MOTIFS):
        x = 30 + j * cw + cw / 2
        m.append(f'<text x="{x:.1f}" y="9" text-anchor="start" font-family="Arimo" font-weight="700" font-size="2.5" transform="rotate(-40 {x:.1f} 9)">{mo}</text>')
    for i, t in enumerate(TRACKS):
        y = 14 + i * rh + rh / 2
        m.append(f'<text x="0" y="{y + .9:.1f}" font-family="Arimo" font-size="2.4">{t["n"]:02d} {esc(SHORT[t["n"]])}</text>')
        if i % 2 == 0:
            m.append(f'<rect x="29" y="{y - rh / 2:.1f}" width="{cw * len(MOTIFS):.1f}" height="{rh:.2f}" fill="#15110e" opacity=".05"/>')
        for j in range(len(MOTIFS)):
            x = 30 + j * cw + cw / 2
            if j in MOTIF_MAP[t["n"]]:
                m.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.35" fill="{"#d9662c" if j in (6, 7) else "#15110e"}"/>')
            else:
                m.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r=".35" fill="#15110e" opacity=".35"/>')
    m.append("</svg>")
    css = """
#epi-b .k{position:absolute;left:20mm;top:18mm}
#epi-b .txt{position:absolute;left:20mm;top:26mm;width:100mm;height:118mm;font-size:11pt}
#epi-b .alb{position:absolute;left:20mm;top:156mm}
#epi-b .albk{position:absolute;left:20mm;top:150mm;font:700 5.8pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#epi-b .mot{position:absolute;left:134mm;top:24mm}
#epi-b .motk{position:absolute;left:134mm;top:120mm;width:96mm;font:400 6.6pt/1.45 'Arimo'}
#epi-b .motk b{color:#d9662c}
#epi-b .four{position:absolute;left:134mm;top:140mm;width:96mm}
#epi-b .four .t{font:700 5.8pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-bottom:2mm}
#epi-b .four div.r{display:flex;gap:3mm;border-top:.3mm solid #15110e;padding:1.8mm 0;font:italic 400 10pt/1.25 'EB Garamond'}
#epi-b .four div.r b{font:700 6.6pt/1.6 'Arimo';font-style:normal;width:22mm;flex:none}
"""
    text = P(
        "По сравнению с тщательно выстроенным спектаклем <i>My Beautiful Dark Twisted Fantasy</i> здесь сильнее ощущается вмешательство повседневности. По сравнению с концентрированным давлением <i>Yeezus</i> гораздо больше внутренних голосов получают возможность изменить направление произведения. TLOP обладает менее надёжной редакторской цельностью, зато допускает особую близость: герой не всегда успевает превратить неловкое признание в красивую позу.",
        "Его сильнейшие эпизоды возникают тогда, когда самопрезентация теряет безусловную власть. Канье уступает место хору. Признаёт собственное отсутствие в жизни друзей. Позволяет Фрэнку закончить мысль иначе. Даёт Самфе выразить потребность, которую сам чаще прячет за объяснениями и заявлениями.",
    )
    four = [("01 · хор", "уступает место хору"), ("12 · звонки", "признаёт собственное отсутствие"),
            ("14 · Фрэнк", "позволяет закончить мысль иначе"), ("20 · Самфа", "даёт выразить потребность")]
    fh = '<div class="t">Четыре момента, когда поза теряет власть</div>' + "".join(f'<div class="r"><b>{a}</b><span>{b}</span></div>' for a, b in four)
    body = (
        '<div class="k kicker">Эпилог · 2</div>'
        + f'<div class="txt prose">{text}</div>'
        + '<div class="albk">Три альбома · треки и минуты</div>'
        + f'<div class="alb">{"".join(a)}</div>'
        + f'<div class="mot">{"".join(m)}</div>'
        + '<div class="motk">' + typo("Карта мотивов — по прочтению этого эссе: где какая тема возникает. <b>Свет</b> и <b>телефон</b> отмечены цветом — две нити, на которых держится альбом.", False) + '</div>'
        + f'<div class="four">{fh}</div>'
        + folio(right="Эпилог")
    )
    return page("epi-b", body, cls="tex", css=css)


# =================================================================== EPILOGUE (c): the phone rings
def epi_c():
    rings = "".join(
        f'<circle cx="196" cy="62" r="{6 + i * 7}" fill="none" stroke="#f28a55" stroke-width="{1.1 - i * .09:.2f}" opacity="{max(.12, 1 - i * .1):.2f}"/>'
        for i in range(10))
    css = """
#epi-c{background:#0f0c0a;color:#f4efe6}
#epi-c .rings{position:absolute;left:0;top:0}
#epi-c .k{position:absolute;left:20mm;top:18mm;color:#f28a55}
#epi-c h2{position:absolute;left:19mm;top:24mm;margin:0;font:italic 300 50pt/1 'Cormorant Garamond';width:150mm}
#epi-c .fin{position:absolute;left:20mm;top:112mm;width:200mm;font:italic 300 22pt/1.3 'Cormorant Garamond';text-align:left}
#epi-c .fin b{font-style:normal;font-weight:500;color:#f28a55}
#epi-c .last{position:absolute;left:20mm;top:212mm;font:700 25pt/1 'Arimo';letter-spacing:-.01em;color:#f28a55;white-space:nowrap}
#epi-c .cur{display:inline-block;width:3.2mm;height:8mm;background:#f28a55;margin-left:1.4mm;vertical-align:-1mm}
"""
    fin = typo("Поэтому телефонный звонок в конце <i>30 Hours</i> оказывается таким точным образом всего альбома. <b>Запись ещё идёт.</b> Автор занят собственной историей. И всё же другой человек может позвонить, вмешаться — и потребовать настоящего ответа.", False)
    body = (
        f'<svg class="rings" width="250mm" height="250mm" viewBox="0 0 250 250">{rings}<circle cx="196" cy="62" r="3.4" fill="#f28a55"/></svg>'
        + '<div class="k kicker">Эпилог · 3</div>'
        + '<h2>Телефон звонит</h2>'
        + f'<div class="fin">{fin}</div>'
        + '<div class="last">THE LIFE OF PA<i class="cur"></i></div>'
        + folio(right="Эпилог", color="#f28a55")
    )
    return page("epi-c", body, css=css)


# =================================================================== SOURCES & COLOPHON
SOURCES = [
    ("Apple Music", "The Life of Pablo — страница альбома", "music.apple.com/us/album/the-life-of-pablo/1443063578"),
    ("Hip-Hop Wired", "Kanye West Finally Says Pablo Inspired New Album Title", "hiphopwired.com/502249/kanye-west-finally-says-pablo-inspired-new-album-title-video/"),
    ("Hypebeast", "The Life of Pablo — обложка", "hypebeast.com/2016/2/kanye-west-the-life-of-pablo-cover"),
    ("The FADER", "Fonzworth Bentley: история Ultralight Beam", "thefader.com/2016/02/26/kanye-west-story-of-ultralight-beam-interview-fonzworth-bentley"),
    ("LyricsWeb", "Ultralight Beam — текст", "lyricsweb.com/song/kanye-west/kanye-west-ultralight-beam"),
    ("Groove.pl", "The Life of Pablo — титры", "groove.pl/kanye-west/the-life-of-pablo-credits/piosenka/"),
    ("Groove.pl", "Pt. 2", "groove.pl/kanye-west/pt-2-2/piosenka/"),
    ("Shazam", "Famous", "shazam.com/song/1443063974/famous"),
    ("Groove.pl", "Feedback", "groove.pl/kanye-west/feedback-8/piosenka/"),
    ("The FADER", "Kelly Price Talks Life of Pablo", "thefader.com/2016/02/16/kelly-price-talks-life-of-pablo"),
    ("Wikipedia", "The Life of Pablo", "en.wikipedia.org/wiki/The_Life_of_Pablo"),
    ("Groove.pl", "Highlights", "groove.pl/kanye-west/highlights-5/piosenka/"),
    ("Miss Info", "The Life of Pablo — full credits", "missinfo.tv/index.php/kanye-west-the-life-of-pablo-full-credits/"),
    ("Qobuz", "The Life of Pablo", "qobuz.com/gb-en/album/the-life-of-pablo-kanye-west/0060255702733"),
    ("Music Charts Archive", "Waves", "musicchartsarchive.com/singles/kanye-west/waves"),
    ("LyricsWeb", "FML — текст", "lyricsweb.com/song/kanye-west/kanye-west-fml"),
    ("XXL", "Havoc о работе над The Life of Pablo", "xxlmag.com/havoc-produced-on-kanye-west-the-life-of-pablo-album-interview/"),
    ("LyricsWeb", "Real Friends — текст", "lyricsweb.com/song/kanye-west/kanye-west-real-friends"),
    ("FACT", "Fractal Fantasy — интервью", "factmag.com/2016/06/26/fractal-fantasy-interview/"),
    ("OHHLA", "Wolves — текст", "ohhla.com/anonymous/kan_west/pablo/wolves.wst.txt"),
    ("Groove.pl", "Frank’s Track", "groove.pl/kanye-west/franks-track/piosenka/"),
    ("OHHLA", "30 Hours — текст", "ohhla.com/anonymous/kan_west/pablo/30_hours.wst.txt"),
    ("LyricsWeb", "No More Parties in LA — текст", "lyricsweb.com/song/kanye-west/kanye-west-no-more-parties-in-la"),
    ("Pitchfork", "Kanye West Shares Full The Life of Pablo Credits", "pitchfork.com/news/63604-kanye-west-shares-full-the-life-of-pablo-credits/"),
    ("Groove.pl", "Facts (Charlie Heat Version)", "groove.pl/kanye-west/facts-charlie-heat-version/piosenka/"),
    ("FACT", "Every sample on The Life of Pablo", "factmag.com/2016/02/14/kanye-west-samples-the-life-of-pablo/"),
    ("OHHLA", "Fade — текст", "ohhla.com/anonymous/kan_west/pablo/fade.wst.txt"),
    ("Pitchfork", "Kanye West Releases New Track Saint Pablo", "pitchfork.com/news/65882-kanye-west-releases-new-track-saint-pablo-listen/"),
    ("OHHLA", "Saint Pablo — текст", "ohhla.com/anonymous/kan_west/pablo/st_pablo.wst.txt"),
]

EXTRA = [
    "Wikipedia: история релиза, смены названия (So Help Me God → SWISH → WAVES → The Life of Pablo), слова Канье о «госпел-альбоме» (радио Big Boy, 2016), коммерческие данные.",
    "Billboard, Complex: рукописный треклист WAVES 25–27 января 2016 года и рабочее название Famous — Nina Chop.",
    "Fonts In Use: шрифт обложки (гротеск в духе Arial). Hypebeast, Complex: готика мерча Кали Торнхилла ДеВитта.",
    "Stereogum, FACT, Rolling Stone: премьера Wolves на показе Yeezy Season 1 (12.02.2015); сцена тура Saint Pablo (2016).",
    "Numero Group: история альбома Father’s Children «Who’s Gonna Save the World» (записан в начале 1970-х, издан в 2011).",
    "Расшифровки текстов (OHHLA) — для подсчётов: 23 «Kanye» в I Love Kanye; куплеты No More Parties in LA — 370 и 618 слов.",
    "Т. С. Элиот, «Филип Мэссинджер» (The Sacred Wood, 1920). М. де Сайас, «Picasso Speaks» (The Arts, 1923). Библия — синодальный перевод.",
]


def sources():
    items = "".join(
        f'<li><b>{i + 1}</b><span><em>{esc(a)}</em> — {esc(t)}<br><u>{esc(u)}</u></span></li>' for i, (a, t, u) in enumerate(SOURCES))
    extra = "".join(f"<p>{typo(x, False)}</p>" for x in EXTRA)
    css = """
#sources{background-color:#f4efe6}
#sources .k{position:absolute;left:20mm;top:18mm}
#sources h2{position:absolute;left:19mm;top:22mm;margin:0;font:italic 300 34pt/1 'Cormorant Garamond'}
#sources ol{position:absolute;left:20mm;top:44mm;width:136mm;margin:0;padding:0;list-style:none;column-count:2;column-gap:6mm}
#sources li{display:flex;gap:2mm;break-inside:avoid;font:400 6.3pt/1.32 'Arimo';margin-bottom:1.55mm}
#sources li b{font-weight:700;width:4.5mm;flex:none;color:#d9662c}
#sources li em{font-style:normal;font-weight:700}
#sources li u{text-decoration:none;opacity:.7;font-size:5.6pt;word-break:break-all}
#sources .ex{position:absolute;left:166mm;top:44mm;width:64mm}
#sources .ex h3,#sources .col h3{font:700 6pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin:0 0 2mm}
#sources .ex p{font:400 7.2pt/1.4 'EB Garamond';margin:0 0 1.6mm}
#sources .col{position:absolute;left:166mm;top:148mm;width:64mm;font:400 7.2pt/1.42 'EB Garamond'}
#sources .col p{margin:0 0 1.6mm}
"""
    colophon = (
        '<h3>Колофон</h3>'
        + "<p>" + typo("Шрифты (все — SIL Open Font License): EB Garamond, Cormorant Garamond, Arimo, Monomakh, UnifrakturCook, Playfair, Inter Tight, Sofia Sans Extra Condensed, Dela Gothic One, Bodoni Moda, Rubik Glitch, Rubik Broken Fax, Rubik Dirt, Alice, Tenor Sans, IBM Plex Mono, Overpass, Unbounded, Press Start 2P, Tiny5, Climate Crisis, Caveat.", False) + "</p>"
        + "<p>" + typo("Изображения: Рембрандт, «Автопортрет в образе апостола Павла», 1661 (Рейксмюсеум, общественное достояние); Караваджо, «Обращение Савла», 1601 (общественное достояние); Этьен Пикар по Чиро Ферри, «Святые Пётр и Павел в темнице» (The Met, CC0). Все схемы, графики и иллюстрации нарисованы для этого издания; обложка альбома и фотографии не воспроизводятся.", False) + "</p>"
        + "<p>" + typo("Строки песен приводятся короткими фрагментами для комментария. Схемы с пометкой «прочтение» — интерпретация, а не измерение.", False) + "</p>"
    )
    body = (
        '<div class="k kicker">Источники</div><h2>Сноски и ссылки</h2>'
        + f'<ol>{items}</ol>'
        + f'<div class="ex"><h3>Дополнительно</h3>{extra}</div>'
        + f'<div class="col">{colophon}</div>'
        + folio(right="Источники")
    )
    return page("sources", body, cls="tex", css=css)


# =================================================================== BACK COVER
def back():
    rows = "".join('<div>WHICH / ONE</div>' for _ in range(22))
    css = """
#back{background:#f28a55;color:#0d0b0a}
#back .col{position:absolute;top:16mm;font:700 9.4pt/1 'Arimo'}
#back .col div{height:9.6mm}
#back .mid{position:absolute;left:62mm;top:60mm;width:126mm;text-align:center}
#back .mid .ics{display:flex;justify-content:center;gap:12mm;margin-bottom:8mm}
#back .mid .t{font:italic 300 22pt/1.22 'Cormorant Garamond'}
#back .mid .s{margin-top:8mm;font:700 6.6pt/1.6 'Arimo';letter-spacing:.24em;text-transform:uppercase}
#back .bot{position:absolute;left:62mm;top:200mm;width:126mm;text-align:center;font:700 18pt/1 'Arimo';letter-spacing:-.01em}
#back .bot small{display:block;margin-top:3mm;font:400 6.4pt/1.4 'Arimo';letter-spacing:.2em}
"""
    body = (
        f'<div class="col" style="left:19mm">{rows}</div>'
        + f'<div class="col" style="right:19mm;text-align:right">{rows}</div>'
        + '<div class="mid"><div class="ics">' + icon_paul("#0d0b0a", 16) + icon_picasso("#0d0b0a", 16) + icon_escobar("#0d0b0a", 16) + '</div>'
        + '<div class="t">' + typo("Павел, Пикассо, Эскобар — и один человек, который так и не решил, который из них он.", False) + '</div>'
        + '<div class="s">послание · искусство · продукт</div></div>'
        + '<div class="bot">THE LIFE OF PABLO<small>' + typo("эссе в двадцати треках · 2016 / 2026", False) + '</small></div>'
    )
    return page("back", body, cls="tex", css=css)


def pages():
    return [epi_a(), epi_b(), epi_c(), sources(), back()]
