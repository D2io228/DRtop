"""Part IV — «Запись ещё идёт»: archive of times, Silver Surfer, 30 Hours,
No More Parties in LA, Facts, Fade, Saint Pablo."""
import math
import random

from data import TRACKS
from lib import P, esc, folio, page, track_meta, typo, fmt_dur

T = {t["n"]: t for t in TRACKS}


# =================================================================== PART IV OPENER: archive of times
def part4():
    rows = [t for t in TRACKS if any(y for _, _, y in t["samples"])]
    y0, y1 = 1965, 2020
    W = 176
    X0 = 34

    def X(y):
        return X0 + (y - y0) / (y1 - y0) * W

    rh = 6.3
    H = len(rows) * rh + 22
    s = [f'<svg width="210mm" height="{H:.0f}mm" viewBox="0 0 210 {H:.0f}">']
    for yy in range(1970, 2021, 10):
        s.append(f'<line x1="{X(yy):.1f}" y1="6" x2="{X(yy):.1f}" y2="{H - 12:.1f}" stroke="#15110e" stroke-width=".15" opacity=".45"/>')
        s.append(f'<text x="{X(yy):.1f}" y="{H - 7:.1f}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="2.9">{yy}</text>')
    xt = X(2016)
    s.append(f'<rect x="{xt - .5:.1f}" y="2" width="1" height="{H - 14:.1f}" fill="#15110e"/>')
    s.append(f'<text x="{xt + 1.5:.1f}" y="5" font-family="Arimo" font-weight="700" font-size="3" letter-spacing=".5">TLOP · 2016</text>')
    for i, tr in enumerate(rows):
        y = 10 + i * rh
        s.append(f'<text x="0" y="{y + 1.1:.1f}" font-family="Arimo" font-weight="700" font-size="2.7">{tr["n"]:02d} {esc(tr["t"].replace(" (Charlie Heat Version)", "").replace("Father Stretch My Hands ", ""))}</text>')
        s.append(f'<line x1="{X0}" y1="{y}" x2="{xt:.1f}" y2="{y}" stroke="#15110e" stroke-width=".12" opacity=".35"/>')
        used = []
        for a, t, yr in tr["samples"]:
            if not yr:
                continue
            x = X(yr)
            k = sum(1 for u in used if abs(u - x) < 9)
            used.append(x)
            if a.startswith("Father"):
                s.append(f'<line x1="{x:.1f}" y1="{y}" x2="{X(2011):.1f}" y2="{y}" stroke="#15110e" stroke-width=".6" stroke-dasharray="1 .8"/>')
                s.append(f'<circle cx="{X(2011):.1f}" cy="{y}" r="1.1" fill="#f28a55" stroke="#15110e" stroke-width=".4"/>')
                s.append(f'<text x="{X(2011) + 1.6:.1f}" y="{y - 1.3:.1f}" font-family="EB Garamond" font-style="italic" font-size="2.6">издано лишь в 2011</text>')
            s.append(f'<circle cx="{x:.1f}" cy="{y}" r="1.45" fill="#15110e"/>')
            lab = f'{a} · {yr}'
            s.append(f'<text x="{x + 2:.1f}" y="{y - 1.4 - k * 2.6:.1f}" font-family="EB Garamond" font-style="italic" font-size="2.75">{esc(lab)}</text>')
    s.append("</svg>")
    lst = "".join(
        f'<div class="it"><span>{n:02d}</span><b>{esc(T[n]["t"].replace(" Intermission", ""))}</b><em>{fmt_dur(T[n]["sec"])}</em></div>'
        for n in range(15, 21))
    css = """
#part4{background-color:#f28a55;color:#15110e}
#part4 .k{position:absolute;left:20mm;top:18mm}
#part4 .num{position:absolute;left:16mm;top:20mm;font:900 110pt/1 'Playfair';letter-spacing:-.02em}
#part4 h2{position:absolute;left:96mm;top:26mm;margin:0;font:italic 300 40pt/1 'Cormorant Garamond'}
#part4 .lead{position:absolute;left:97mm;top:62mm;width:132mm;font:italic 400 12pt/1.3 'EB Garamond'}
#part4 .ck{position:absolute;left:20mm;top:84mm;font:700 6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#part4 .chart{position:absolute;left:20mm;top:89mm}
#part4 .list{position:absolute;left:20mm;top:197mm;width:110mm}
#part4 .it{display:flex;gap:3mm;align-items:baseline;border-top:.3mm solid #15110e;padding:1.2mm 0;font:400 7.6pt/1.2 'Arimo'}
#part4 .it span{font-weight:700;width:6mm}
#part4 .it b{flex:1;font-weight:700}
#part4 .it em{font-style:normal}
#part4 .epi{position:absolute;left:142mm;top:198mm;width:88mm;font-size:11.4pt;line-height:1.24}
"""
    body = (
        '<div class="k kicker">Часть четвёртая</div>'
        + '<div class="num">IV</div>'
        + '<h2>Запись ещё идёт</h2>'
        + '<div class="lead">' + typo("Альбом как архив разных времён, собранных в одном настоящем: от записи Нины Симон 1968 года до «Panda» 2015-го — почти полвека под одной обложкой.", False) + '</div>'
        + '<div class="ck">Архив времён · год первой записи каждого семпла и интерполяции · по титрам</div>'
        + f'<div class="chart">{"".join(s)}</div>'
        + f'<div class="list">{lst}</div>'
        + '<div class="epi">' + typo("«Говорю так не потому, чтобы я уже достиг, или усовершился; но стремлюсь…»", False)
        + '<span class="src">Флп. 3:12</span></div>'
        + folio(right="Часть IV", color="#15110e")
    )
    return page("part4", body, cls="tex", css=css)


# =================================================================== 15 SILVER SURFER INTERMISSION
def t15():
    tr = T[15]
    W = 200

    def X(f):
        return (math.log10(f) - math.log10(20)) / (math.log10(20000) - math.log10(20)) * W

    s = [f'<svg width="{W}mm" height="46mm" viewBox="0 0 {W} 46">']
    s.append(f'<rect x="0" y="12" width="{W}" height="16" fill="#2b2f33" opacity=".12"/>')
    s.append(f'<rect x="{X(300):.1f}" y="10" width="{X(3400) - X(300):.1f}" height="20" fill="#15191c"/>')
    for f in (20, 50, 100, 300, 1000, 3400, 10000, 20000):
        lab = f"{f // 1000} кГц" if f >= 1000 else f"{f} Гц"
        if f == 3400:
            lab = "3,4 кГц"
        s.append(f'<line x1="{X(f):.1f}" y1="30" x2="{X(f):.1f}" y2="33" stroke="#15191c" stroke-width=".3"/>')
        s.append(f'<text x="{X(f):.1f}" y="38" text-anchor="middle" font-family="Arimo" font-size="2.8">{lab}</text>')
    s.append(f'<text x="{(X(300) + X(3400)) / 2:.1f}" y="21.4" text-anchor="middle" font-family="Tiny5" font-size="4.4" fill="#c7f08a">ТЕЛЕФОН · 300–3400 Гц</text>')
    s.append('<text x="1" y="8" font-family="Arimo" font-weight="700" font-size="2.8" letter-spacing=".6">СЛУХ ЧЕЛОВЕКА · 20 Гц — 20 кГц</text>')
    s.append(f'<text x="{W}" y="45" text-anchor="end" font-family="EB Garamond" font-style="italic" font-size="3.4">голос Max B проходит в узкую щель: остальное отрезано</text>')
    s.append("</svg>")
    css = """
#t15{background:linear-gradient(160deg,#5e656b 0%,#cfd5da 32%,#f2f4f6 48%,#9aa2a9 68%,#e6e9ec 84%,#6f777e 100%);color:#15191c}
#t15 .k{position:absolute;left:20mm;top:18mm}
#t15 h1{position:absolute;left:16mm;top:24mm;margin:0;font:400 33pt/1.02 'Rubik Broken Fax';letter-spacing:-.01em;width:220mm}
#t15 .cnt{position:absolute;left:20mm;top:58mm;font:700 6.4pt/1.4 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#t15 .lcd{position:absolute;left:160mm;top:70mm;width:70mm;height:40mm;background:#b9c99a;border:1.6mm solid #2b2f33;border-radius:2mm;box-shadow:inset 0 0 6mm rgba(0,0,0,.25);padding:3mm;font:400 11pt/1.25 'Tiny5';color:#26321b}
#t15 .lcd b{display:block;font-size:16pt;margin:1mm 0}
#t15 .chart{position:absolute;left:20mm;top:120mm}
#t15 .meta{position:absolute;left:20mm;top:70mm;width:130mm}
#t15 .txt{position:absolute;left:20mm;top:170mm;width:210mm;height:60mm;font-size:10.8pt}
"""
    text = P(
        "<i>Siiiiiiiiilver Surffffeeeeer Intermission</i> возвращает альбом к разговору, дружескому обращению и рэп-среде. Голос Max B при участии French Montana звучит через телефонное сжатие; после огромных искусственных пространств <i>Wolves</i> эта узкая звуковая полоса кажется почти документальной.<sup class=\"fn\">14</sup>",
        "Интерлюдия связана с <i>wave</i>-мифологией и прежним названием альбома — <i>Waves</i>. Но её функция шире контекстной шутки: она напоминает, что даже художник, представляющий себя универсальным исключением, нуждается в признании внутри конкретной музыкальной культуры.",
        "Одновременно здесь чувствуется проблема редакторского отбора. После <i>Frank’s Track</i> эмоциональное завершение уже произошло, и новое продолжение требует от слушателя снова перестроить внимание. Убедительность такого решения зависит от того, насколько ценным кажется само ощущение незакрытой записи.",
    )
    body = (
        '<div class="k kicker">15 / 20 · Часть IV · интерлюдия</div>'
        + '<h1>Siiiiiiiiilver Surffffeeeeer Intermission</h1>'
        + '<div class="cnt">в названии: 9 × i · 4 × f · 5 × e — звук, растянутый буквами</div>'
        + f'<div class="meta">{track_meta(tr, color="#15191c", dim="rgba(0,0,0,.15)")}</div>'
        + '<div class="lcd">ВХОДЯЩИЙ ВЫЗОВ<b>MAX B</b>0:56 · ГРОМКАЯ СВЯЗЬ</div>'
        + f'<div class="chart">{"".join(s)}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="15 · Silver Surfer", color="#15191c")
    )
    return page("t15", body, css=css)


# =================================================================== 16 30 HOURS
def t16():
    tr = T[16]
    stops = ["машина", "дорога", "переводы денег", "гостиница", "еда", "ревность", "аутро", "звонок"]
    W = 210
    s = [f'<svg width="{W}mm" height="40mm" viewBox="0 0 {W} 40">']
    d = "M0,24 C 30,8 50,34 80,22 S 130,6 160,20 S 200,30 210,18"
    s.append(f'<path d="{d}" fill="none" stroke="#f2a541" stroke-width="2.4"/>')
    s.append(f'<path d="{d}" fill="none" stroke="#2a2826" stroke-width=".5" stroke-dasharray="3 3"/>')
    pts = [(6, 20.5), (32, 18), (58, 27.5), (84, 21), (110, 13.5), (136, 12.5), (166, 21.5), (204, 20.5)]
    for (x, y), lab in zip(pts, stops):
        last = lab == "звонок"
        s.append(f'<circle cx="{x}" cy="{y}" r="{2.2 if last else 1.5}" fill="{"#f2a541" if not last else "#fff"}" stroke="#2a2826" stroke-width=".5"/>')
        s.append(f'<text x="{x}" y="{y + (7 if y < 18 else -4)}" text-anchor="middle" font-family="Overpass" font-weight="700" font-size="3.2" fill="#f4efe6">{lab}</text>')
    s.append("</svg>")
    css = """
#t16{background:#2a2826;color:#f4efe6}
#t16 .k{position:absolute;left:20mm;top:18mm;color:#f2a541}
#t16 .sign{position:absolute;left:20mm;top:24mm;width:116mm;height:46mm;background:#0b6e4f;border-radius:3mm;box-shadow:inset 0 0 0 1.1mm #fff;padding:5mm 6mm;color:#fff}
#t16 .sign .r{font:800 9pt/1 'Overpass';letter-spacing:.06em}
#t16 .sign .t{font:800 46pt/1 'Overpass';letter-spacing:-.01em;margin-top:2mm}
#t16 .sign .s{font:700 9pt/1.2 'Overpass';margin-top:1mm}
#t16 .post{position:absolute;left:76mm;top:70mm;width:2.4mm;height:8mm;background:#8a8580}
#t16 .sub{position:absolute;left:146mm;top:26mm;width:84mm;font:italic 300 18pt/1.18 'Cormorant Garamond';color:#f2a541}
#t16 .meta{position:absolute;left:146mm;top:52mm;width:84mm}
#t16 .route{position:absolute;left:20mm;top:84mm}
#t16 .rl{position:absolute;left:20mm;top:124mm;font:700 5.6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#f2a541}
#t16 .txt{position:absolute;left:20mm;top:131mm;width:150mm;height:99mm;font-size:10.6pt;color:#efe8dc}
#t16 .side{position:absolute;left:178mm;top:131mm;width:52mm;font-size:11pt;line-height:1.24;color:#f4efe6}
#t16 .side .src{color:#f2a541}
#t16 .side p{font:400 8.3pt/1.4 'EB Garamond';margin:3mm 0 0;hyphens:manual;color:#cfc6b8}
"""
    text = P(
        "<i>30 Hours</i> превращает незакрытость в главный принцип. Обработанный голос Артура Расселла из <i>Answers Me</i>, мягкое движение ритма и вокальный рефрен André 3000 создают пространство воспоминания. У музыкального цикла есть особое свойство: он способен продолжаться дольше, чем рассказ.",
        "Бит Karriem Riggins существовал ещё во времена <i>Yeezus</i> и оказался на TLOP позже. В альбоме, таким образом, можно увидеть и архив разных творческих времён, собранных в одном настоящем.<sup class=\"fn\">6</sup>",
        "В тексте романтическое путешествие разложено на неудобные конкретности: машина, дорога, переводы денег, гостиница, еда. Большое чувство вспоминается через инфраструктуру, которая делала его возможным. Рассказчик начинает с позиции обиженного, но постепенно сообщает подробности, усложняющие эту позицию: признание собственной инициативы в открытых отношениях показывает, что ревность не исчезает после формального согласования свободы.",
        "Аутро ещё сильнее сдвигает перспективу. Канье объявляет песню бонус-треком, обращается к André, пробует фразы, благодарит людей и отвечает на звонок. Форма выпускает его из роли законченного рассказчика: мы слышим человека, который всё ещё рядом с материалом, хотя уже сообщил всё необходимое.<sup class=\"fn\">22</sup>",
        "В этом есть особое доверие к груву — и особая редакторская уязвимость. Песня позволяет побыть внутри процесса, но требует принять длительность, которую трудно оправдать одним развитием сюжета.",
    )
    side = (typo("«Приветствие моею рукою Павловою, что служит знаком во всяком послании; пишу так».", False)
            + '<span class="src">2 Фес. 3:17</span>'
            + '<p>' + typo("Послания Павла кончаются длинными приветами по именам и припиской, сделанной собственной рукой. Аутро <i>30 Hours</i> — такая же приписка: благодарности, имена, живая рука автора на полях.") + '</p>')
    body = (
        '<div class="k kicker">16 / 20 · Часть IV</div>'
        + '<div class="sign"><div class="r">↑ ВЫЕЗД 16 · ЧИКАГО — СЕНТ-ЛУИС ↑</div><div class="t">30 HOURS</div><div class="s">бонус-трек · 5:23 · André 3000</div></div>'
        + '<div class="post"></div>'
        + '<div class="sub">' + typo("Дорога, которая длиннее рассказа", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#f4efe6", dim="rgba(244,239,230,.2)")}</div>'
        + f'<div class="route">{"".join(s)}</div>'
        + '<div class="rl">Инфраструктура чувства · остановки рассказа, по тексту песни</div>'
        + f'<div class="txt prose cols" style="--fn:#f2a541">{text}</div>'
        + f'<div class="side epi">{side}</div>'
        + folio(right="16 · 30 Hours", color="#f2a541")
    )
    return page("t16", body, css=css)


# =================================================================== 17 NO MORE PARTIES IN LA (a)
def palms():
    out = []
    for x, h, lean in [(14, 70, -4), (38, 96, 3), (226, 88, -2), (246, 64, 5)]:
        top = (x + lean, 250 - h)
        out.append(f'<path d="M{x - 1.4},250 Q{x + lean * .4},{250 - h * .5} {top[0]},{top[1]} L{top[0] + 1.6},{top[1]} Q{x + lean * .4 + 2},{250 - h * .5} {x + 1.4},250 Z" fill="#14091f"/>')
        for k in range(7):
            a = math.radians(-160 + k * 26 + lean * 2)
            L = 15 + (k % 3) * 3
            ex, ey = top[0] + L * math.cos(a), top[1] + L * math.sin(a) * .55 + 5
            mx, my = top[0] + L * .5 * math.cos(a), top[1] + L * .5 * math.sin(a) * .55 - 3
            out.append(f'<path d="M{top[0]},{top[1]} Q{mx:.1f},{my:.1f} {ex:.1f},{ey:.1f}" fill="none" stroke="#14091f" stroke-width="2.2" stroke-linecap="round"/>')
    return f'<svg class="abs" style="left:0;top:0" width="250mm" height="250mm" viewBox="0 0 250 250">{"".join(out)}</svg>'


def t17a():
    tr = T[17]
    css = """
#t17a{background:linear-gradient(180deg,#2d1b4e 0%,#6b2c6e 36%,#c2457e 62%,#f2a65a 88%,#f7c77d 100%);color:#fff3e6}
#t17a .k{position:absolute;left:20mm;top:18mm;color:#ffd2a1}
#t17a h1{position:absolute;left:18mm;top:24mm;margin:0;font:800 34pt/1 'Unbounded';letter-spacing:-.02em;width:214mm}
#t17a .sub{position:absolute;left:20mm;top:62mm;font:italic 300 17pt/1.2 'Cormorant Garamond';color:#ffd2a1}
#t17a .big{position:absolute;left:120mm;top:66mm;font:800 70pt/1 'Unbounded';letter-spacing:-.04em;color:#fff3e6;text-align:right;width:112mm}
#t17a .big small{display:block;font:700 6pt/1.4 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-top:1mm}
#t17a .meta{position:absolute;left:20mm;top:78mm;width:92mm}
#t17a .txt{position:absolute;left:62mm;top:124mm;width:142mm;height:106mm;font-size:10.7pt;color:#fff6ec}
"""
    text = P(
        "<i>No More Parties in LA</i> отвечает на расслабленность <i>30 Hours</i> плотностью рэперской речи. Бит Madlib держится на устойчивом движении и множестве сэмпловых деталей: он даёт достаточно опоры для длинных куплетов и достаточно внутренней жизни, чтобы повтор не превращался в неподвижность. Kendrick Lamar и Канье по-разному распределяют речь внутри этого движения.<sup class=\"fn\">14</sup>",
        "Кендрик работает быстрыми сменами артикуляции, интонации и длины фраз; его наблюдение подвижно, персонажи и оценки возникают почти сценически. Канье действует накоплением: одно воспоминание тянет за собой следующее, и длинный куплет становится формой переполненности.",
        "Такой способ письма соответствует предмету. Лос-Анджелес существует как избыток возможностей, контактов, тел, вещей и тревог. Сама речевая продуктивность начинает напоминать среду, из которой герой хочет выбраться.",
        "Название обещает отказ, но текст выдаёт привязанность к тому же образу жизни. Домашняя вечеринка оказывается вполне допустимой заменой внешним. Меняется место — структура желания остаётся.",
    )
    body = (
        palms()
        + '<div class="k kicker">17 / 20 · Часть IV</div>'
        + '<h1>No More Parties<br>in LA</h1>'
        + '<div class="sub">' + typo("Тридцативосьмилетний восьмилетний", False) + '</div>'
        + '<div class="big">38 / 8<small>a thirty-eight-year-old eight-year-old</small></div>'
        + f'<div class="meta">{track_meta(tr, color="#fff3e6", dim="rgba(255,243,230,.25)")}</div>'
        + f'<div class="txt prose cols" style="--fn:#ffe1b8">{text}</div>'
        + folio(right="17 · No More Parties in LA", color="#fff3e6")
    )
    return page("t17a", body, css=css)


# =================================================================== 17 NO MORE PARTIES IN LA (b)
def t17b():
    crate = [("Junie Morrison", "Suzie Thundertussy", 1976, "#c2457e"), ("Johnny “Guitar” Watson", "Give Me My Love", 1977, "#f2a65a"),
             ("Larry Graham", "Stand Up and Shout About Love", 1980, "#6b2c6e"), ("Ghostface Killah", "Mighty Healthy", 2000, "#2d1b4e")]
    recs = "".join(
        f'<div class="rec"><svg width="30mm" height="30mm" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14.5" fill="#111"/>'
        f'<circle cx="15" cy="15" r="11" fill="none" stroke="#333" stroke-width=".3"/><circle cx="15" cy="15" r="8" fill="none" stroke="#333" stroke-width=".3"/>'
        f'<circle cx="15" cy="15" r="5.4" fill="{c}"/><circle cx="15" cy="15" r=".9" fill="#f4efe6"/></svg>'
        f'<b>{y}</b><span>{esc(a)}</span><i>{esc(t)}</i></div>' for a, t, y, c in crate)
    css = """
#t17b{background:#111;color:#f4efe6}
#t17b .shirt{position:absolute;left:20mm;top:18mm;width:120mm;height:94mm;background:#1b1b1b;border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center}
#t17b .shirt .g{font:400 30pt/1.05 'UnifrakturCook';text-align:center;color:#f4efe6}
#t17b .shirt .cap{margin-top:5mm;font:700 5.6pt/1.4 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#a99e90;text-align:center}
#t17b .words{position:absolute;left:148mm;top:18mm;width:82mm}
#t17b .words .t{font:700 5.8pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#f2a65a;margin-bottom:2mm}
#t17b .words .w{display:flex;align-items:flex-end;gap:2mm;margin-bottom:2.4mm}
#t17b .words .w .bar{background:#f4efe6}
#t17b .words .w b{font:700 7pt/1.2 'Arimo';width:20mm}
#t17b .words .w span{font:700 13pt/1 'Unbounded'}
#t17b .words .n{font:400 6.2pt/1.4 'Arimo';color:#a99e90}
#t17b .crate{position:absolute;left:148mm;top:66mm;width:82mm;display:grid;grid-template-columns:1fr 1fr;gap:3mm}
#t17b .rec{display:flex;flex-direction:column;font:400 6.6pt/1.3 'Arimo'}
#t17b .rec b{font:700 9pt/1 'Unbounded';margin:1.2mm 0 .6mm;color:#f2a65a}
#t17b .rec i{font-family:'EB Garamond';font-size:8pt;color:#cfc6b8}
#t17b .txt{position:absolute;left:20mm;top:122mm;width:120mm;height:108mm;font-size:10.7pt;color:#efe8dc}
#t17b .side{position:absolute;left:148mm;top:150mm;width:82mm;font:italic 400 10.6pt/1.35 'EB Garamond';color:#efe8dc;border-top:.3mm solid #f2a65a;padding-top:2.4mm}
"""
    k_words, y_words = 370, 618
    wmax = 60
    words = (
        '<div class="t">Длина куплетов · слов по расшифровке текста</div>'
        f'<div class="w"><b>Кендрик</b><div class="bar" style="width:{k_words / y_words * wmax:.1f}mm;height:5mm"></div><span>{k_words}</span></div>'
        f'<div class="w"><b>Канье</b><div class="bar" style="width:{wmax}mm;height:5mm;background:#f2a65a"></div><span>{y_words}</span></div>'
        '<div class="n">' + typo("38 строк против 68: переполненность, измеренная в словах.", False) + '</div>'
    )
    text = P(
        "Особенно выразительно самоопределение «a thirty-eight-year-old eight-year-old». Возраст и эмоциональная незрелость умещаются в одну короткую конструкцию. Герой способен увидеть собственную инфантильность и даже превратить её в удачную строку. Управлять его решениями она от этого не перестаёт.<sup class=\"fn\">23</sup>",
        "Возвращение истории украденного ноутбука связывает песню с <i>Real Friends</i>. Теперь обида живёт рядом с признанием в любви к родственнику и очередным оскорблением. Чувство не получает окончательного определения: привязанность и злость продолжают делить одно предложение.",
        "Музыкальная цельность песни показательна. TLOP умеет развивать продолжительную композицию, когда выбирает такой режим. Его разорванность в других местах нельзя целиком списать на отсутствие мастерства — хотя из этого не следует, что любой разрыв удачен.",
    )
    body = (
        '<div class="shirt"><div class="g">I feel like Pablo</div><div class="cap">' + typo("строка из этой песни стала слоганом мерча 2016 года — в готике Кали Торнхилла ДеВитта", False) + '</div></div>'
        + f'<div class="words">{words}</div>'
        + f'<div class="crate">{recs}</div>'
        + f'<div class="txt prose" style="--fn:#f2a65a">{text}</div>'
        + '<div class="side">' + typo("Ящик с пластинками Madlib: четыре записи из четырёх десятилетий складываются в один непрерывный бит длиной больше шести минут — самый длинный трек альбома.", False) + '</div>'
        + folio(right="17 · No More Parties in LA", color="#f2a65a")
    )
    return page("t17b", body, css=css)


# =================================================================== 18 FACTS
def t18():
    tr = T[18]
    lines = [("БРЕНД vs БРЕНД", "Yeezy > Jumpman"), ("ЦИФРЫ", "продажи, суммы"), ("ВЫПАДЫ", "злободневные"),
             ("ДОВОД", "«факты»"), ("МОРАЛЬ", "отложена"), ("АРХИВ", "Father’s Children")]
    rc = "".join(f'<div class="ln"><span>{a}</span><i></i><span>{b}</span></div>' for a, b in lines)
    bars = "".join(f'<i style="width:{(0.3 + (k * 7 % 5) * 0.25):.2f}mm"></i>' for k in range(46))
    css = """
#t18{background-color:#d8c8ae;color:#1b1714}
#t18 .k{position:absolute;left:20mm;top:18mm}
#t18 h1{position:absolute;left:18mm;top:25mm;margin:0;font:400 44pt/1.1 'Press Start 2P';letter-spacing:-.02em}
#t18 .sub{position:absolute;left:20mm;top:50mm;font:italic 400 15pt/1.2 'EB Garamond'}
#t18 .receipt{position:absolute;left:150mm;top:14mm;width:80mm;background:#fbfaf6;padding:6mm 5mm 5mm;font:400 7.6pt/1.5 'IBM Plex Mono';box-shadow:1mm 1.5mm 0 rgba(0,0,0,.15);transform:rotate(1.4deg)}
#t18 .receipt .h{text-align:center;font-weight:700;letter-spacing:.12em}
#t18 .receipt .ln{display:flex;gap:1mm;align-items:baseline}
#t18 .receipt .ln i{flex:1;border-bottom:.3mm dotted #1b1714}
#t18 .receipt .tot{border-top:.4mm dashed #1b1714;margin-top:2mm;padding-top:2mm;font-weight:700;display:flex;justify-content:space-between}
#t18 .receipt .bc{display:flex;gap:.55mm;height:10mm;margin-top:3mm;justify-content:center}
#t18 .receipt .bc i{display:block;background:#1b1714}
#t18 .receipt .ft{text-align:center;font-size:6.4pt;margin-top:1.4mm}
#t18 .arch{position:absolute;left:20mm;top:66mm;width:120mm;background:#1b1714;color:#d8c8ae;padding:4mm 4.4mm}
#t18 .arch b{display:block;font:700 6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#f2c230;margin-bottom:1.6mm}
#t18 .arch p{margin:0;font:italic 400 10pt/1.35 'EB Garamond'}
#t18 .arch .tl{display:flex;align-items:center;gap:2mm;margin-top:2.6mm;font:700 7pt/1 'Arimo'}
#t18 .arch .tl i{flex:1;border-top:.4mm dashed #d8c8ae}
#t18 .meta{position:absolute;left:20mm;top:108mm;width:120mm}
#t18 .sf{position:absolute;left:150mm;top:126mm;width:80mm;font:400 6.6pt/1.5 'Arimo'}
#t18 .sf b{font:400 7pt/1.4 'Press Start 2P';display:block;margin-bottom:1.4mm}
#t18 .txt{position:absolute;left:20mm;top:146mm;width:210mm;height:84mm;font-size:10.8pt}
"""
    receipt = (
        '<div class="receipt"><div class="h">TLOP · ЧЕК № 18</div><div class="ft" style="margin-bottom:3mm">14.02.2016 · 3:20</div>'
        + rc
        + '<div class="tot"><span>ИТОГО</span><span>ФАКТЫ?</span></div>'
        + f'<div class="bc">{bars}</div><div class="ft">' + typo("сохраните чек: успех продукта не закрывает спор о ценности его создателя", False) + '</div></div>'
    )
    text = P(
        "<i>Facts (Charlie Heat Version)</i> резко сужает предмет разговора до соревнования брендов. Рефрен, переиначивающий <i>Jumpman</i> Drake и Future, превращает коммерческую конкуренцию в образ физического превосходства: Yeezy будто перепрыгивает соперника. Само слово <i>facts</i> придаёт рекламе вид объективного суждения. Успех продукта должен закрыть спор о ценности его создателя.<sup class=\"fn\">24</sup>",
        "Музыка даёт этой позиции действенную телесную форму: тяжёлый бас, резкие акценты и выкрики рассчитаны на немедленное возбуждение. Но лирический мир песни гораздо беднее её энергии. Бренды, цифры и злободневные выпады быстро исчерпывают свои выразительные возможности.",
        "Показательно соседство с соул-фрагментом <i>Dirt and Grime</i> группы Father’s Children, где звучит мотив внутренней испорченности. Архивный голос приносит моральную тяжесть — куплет занят самоутверждением.<sup class=\"fn\">6</sup>",
        "Эта несогласованность интересна для портрета героя, но не спасает любую его реплику. Неудачная шутка, связывающая Билла Косби со сценической ошибкой Стива Харви, остаётся проявлением дурного суждения. Критический разбор должен сохранять право назвать слабую строку слабой.<sup class=\"fn\">25</sup>",
    )
    body = (
        '<div class="k kicker">18 / 20 · Часть IV</div>'
        + '<h1>FACTS</h1>'
        + '<div class="sub">' + typo("Чек вместо исповеди", False) + '</div>'
        + receipt
        + '<div class="arch"><b>архивный голос</b><p>' + typo("<i>Dirt and Grime</i>: группа Father’s Children записала альбом в начале 1970-х, но не смогла оплатить студию — плёнки пролежали почти сорок лет и вышли лишь в 2011 году.", False)
        + '</p><div class="tl"><span>1973</span><i></i><span>2011</span><i></i><span>2016 · TLOP</span></div></div>'
        + f'<div class="meta">{track_meta(tr, color="#1b1714", dim="rgba(0,0,0,.15)")}</div>'
        + '<div class="sf"><b>PLAYER 1</b>' + typo("В титрах трека — звуковые эффекты Street Fighter II (1991): спор брендов звучит как файтинг.", False) + '</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="18 · Facts", color="#1b1714")
    )
    return page("t18", body, cls="tex", css=css)


# =================================================================== 19 FADE
def t19():
    tr = T[19]
    years = [1979, 1996, 2012, 2034]
    title = "".join(f'<span style="font-variation-settings:\'YEAR\' {y}">{ch}</span>' for ch, y in zip("FADE", years))
    # 16-step generic house grid
    rows = [("бочка", [0, 4, 8, 12]), ("хлопок", [4, 12]), ("хэт", [2, 6, 10, 14]), ("бас", [0, 3, 6, 8, 11, 14])]
    g = ['<svg width="120mm" height="40mm" viewBox="0 0 120 40">']
    for r, (lab, hits) in enumerate(rows):
        y = 3 + r * 9
        g.append(f'<text x="0" y="{y + 5}" font-family="Arimo" font-weight="700" font-size="2.8" fill="#2ef2ff">{lab.upper()}</text>')
        for c in range(16):
            x = 20 + c * 6.2
            on = c in hits
            col = "#ff2e88" if on else "none"
            g.append(f'<rect x="{x:.1f}" y="{y}" width="5" height="6.4" rx=".8" fill="{col}" stroke="#ff2e88" stroke-width=".35" opacity="{1 if on else .45}"/>')
    g.append("</svg>")
    # pulse constant vs certainty fading
    c = ['<svg width="96mm" height="40mm" viewBox="0 0 96 40">']
    c.append('<polyline points="0,10 96,10" stroke="#2ef2ff" stroke-width="1.2"/>')
    pts = " ".join(f"{x},{10 + (x / 96) ** 1.6 * 24:.1f}" for x in range(0, 97, 4))
    c.append(f'<polyline points="{pts}" fill="none" stroke="#ff2e88" stroke-width="1.2" stroke-dasharray="2 1"/>')
    c.append('<text x="0" y="6" font-family="Arimo" font-weight="700" font-size="2.8" fill="#2ef2ff">ПУЛЬС — ПОСТОЯНЕН</text>')
    c.append('<text x="96" y="39" text-anchor="end" font-family="Arimo" font-weight="700" font-size="2.8" fill="#ff2e88">УВЕРЕННОСТЬ В БЛИЗОСТИ — ГАСНЕТ</text>')
    c.append("</svg>")
    css = """
#t19{background:radial-gradient(circle at 80% 18%,#4a1a6b 0,#1b0b2e 46%,#0d0618 100%);color:#f6e9ff}
#t19 .scan{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.035) 0,rgba(255,255,255,.035) .4mm,transparent .4mm,transparent 1.4mm)}
#t19 .k{position:absolute;left:20mm;top:18mm;color:#2ef2ff}
#t19 h1{position:absolute;left:16mm;top:20mm;margin:0;font:400 92pt/1 'Climate Crisis';color:#ff2e88;letter-spacing:.01em}
#t19 .sub{position:absolute;left:20mm;top:58mm;font:italic 300 17pt/1.2 'Cormorant Garamond';color:#2ef2ff}
#t19 .fade{position:absolute;left:150mm;top:24mm;width:80mm;text-align:right;font:italic 300 26pt/1.1 'Cormorant Garamond'}
#t19 .fade span{display:block}
#t19 .seq{position:absolute;left:20mm;top:74mm}
#t19 .sl{position:absolute;left:20mm;top:116mm;font:700 5.6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#2ef2ff}
#t19 .pc{position:absolute;left:134mm;top:74mm}
#t19 .mark{position:absolute;left:134mm;top:116mm;font:700 5.2pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #ff2e88;color:#ff2e88;padding:.7mm 1.3mm}
#t19 .meta{position:absolute;left:178mm;top:126mm;width:52mm}
#t19 .txt{position:absolute;left:20mm;top:126mm;width:150mm;height:104mm;font-size:10.6pt;color:#f3e6fb}
#t19 .vma{position:absolute;left:178mm;top:196mm;width:52mm;font:400 7pt/1.42 'Arimo';color:#d9c6ea;border-top:.3mm solid #2ef2ff;padding-top:2mm}
"""
    text = P(
        "В <i>Fade</i> центр тяжести снова смещается от декларации к музыкальному переживанию. Хаус-основа соединяет материал <i>Mystery of Love</i> (Mr. Fingers), <i>Deep Inside</i> (Hardrive) и <i>(I Know) I’m Losing You</i> (Rare Earth): разные исторические записи начинают работать как единый ритмический механизм.<sup class=\"fn\">26</sup>",
        "Упругий бас и регулярный пульс дают телу устойчивость. Повторяющийся голос сообщает об исчезновении чувства. Отсюда напряжение: музыка снова и снова возвращает знакомое переживание, а текст фиксирует его утрату.",
        "Формула «I feel it fade» указывает на процесс, который уже начался и всё ещё длится. Это особое время: человек остаётся внутри связи и одновременно наблюдает, как она слабеет.<sup class=\"fn\">27</sup>",
        "Танцевальная цикличность позволяет задержаться в таком состоянии. Каждый новый оборот ритма продлевает присутствие, которое эмоционально становится всё менее надёжным. Тело удерживает форму близости дольше, чем уверенность в самой близости.",
        "<i>Fade</i> возвращает нас к <i>Low Lights</i>: танцевальная музыка снова оказывается носителем глубоко личного, почти духовного опыта. Освобождение здесь не требует окончательного объяснения себя. Оно на несколько минут возникает в движении.",
    )
    fade_words = "".join(f'<span style="opacity:{1 - i * .27:.2f}">I feel it fade</span>' for i in range(4))
    body = (
        '<div class="scan"></div>'
        + '<div class="k kicker">19 / 20 · Часть IV</div>'
        + f'<h1>{title}</h1>'
        + '<div class="sub">' + typo("Танец, который удерживает ускользающее", False) + '</div>'
        + f'<div class="fade">{fade_words}</div>'
        + f'<div class="seq">{"".join(g)}</div>'
        + '<div class="sl">Условная схема хаус-пульса: бочка на каждую долю</div>'
        + f'<div class="pc">{"".join(c)}</div>'
        + '<div class="mark">прочтение</div>'
        + f'<div class="txt prose cols" style="--fn:#2ef2ff">{text}</div>'
        + f'<div class="meta">{track_meta(tr, color="#f6e9ff", dim="rgba(246,233,255,.2)")}</div>'
        + '<div class="vma">' + typo("Клип с Тейаной Тейлор, танцующей в спортзале, впервые показали на церемонии MTV VMA 28 августа 2016 года. Буквы заголовка набраны шрифтом Climate Crisis: он «тает» от года к году — как чувство в песне.", False) + '</div>'
        + folio(right="19 · Fade", color="#2ef2ff")
    )
    return page("t19", body, css=css)


# =================================================================== 20 SAINT PABLO (a) — the floating stage
def t20a():
    tr = T[20]
    rnd = random.Random(20)
    crowd = []
    for i in range(900):
        y = rnd.uniform(150, 250)
        k = (y - 150) / 100
        x = rnd.uniform(-10, 260)
        r = 0.45 + k * 1.5
        lit = abs(x - 132 - (y - 150) * .1) < 30 + k * 26
        col = "#ffb38a" if lit else "#3a1712"
        op = (0.55 + k * .45) if lit else (0.35 + k * .4)
        crowd.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{col}" opacity="{op:.2f}"/>')
    stage = f"""
<svg class="abs" style="left:0;top:0" width="250mm" height="250mm" viewBox="0 0 250 250">
  <defs>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a3c" stop-opacity=".75"/><stop offset="1" stop-color="#ff4a1c" stop-opacity="0"/></linearGradient>
    <radialGradient id="haze" cx=".52" cy=".42" r=".6"><stop offset="0" stop-color="#ff5a24" stop-opacity=".42"/><stop offset="1" stop-color="#ff5a24" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="250" height="250" fill="url(#haze)"/>
  <line x1="102" y1="0" x2="110" y2="104" stroke="#6b4a40" stroke-width=".35"/>
  <line x1="166" y1="0" x2="158" y2="104" stroke="#6b4a40" stroke-width=".35"/>
  <line x1="120" y1="0" x2="118" y2="102" stroke="#6b4a40" stroke-width=".25"/>
  <line x1="148" y1="0" x2="150" y2="102" stroke="#6b4a40" stroke-width=".25"/>
  <polygon points="104,110 166,110 230,250 40,250" fill="url(#beam)"/>
  <polygon points="100,104 170,104 162,112 108,112" fill="#1a0b08" stroke="#ff7a3c" stroke-width=".6"/>
  <rect x="108" y="112" width="54" height="1.4" fill="#ff7a3c"/>
  <g fill="#ffd2b4"><circle cx="135" cy="96" r="1.6"/><path d="M133 98 L137 98 L138.4 104 L131.6 104 Z"/></g>
  {''.join(crowd)}
</svg>"""
    css = """
#t20a{background:#0a0505;color:#fff1e8}
#t20a .k{position:absolute;left:20mm;top:18mm;color:#ff7a3c}
#t20a h1{position:absolute;left:18mm;top:22mm;margin:0;font:400 60pt/.95 'UnifrakturCook';color:#fff1e8}
#t20a .ru{position:absolute;left:20mm;top:68mm;font:400 24pt/1 'Monomakh';color:#ff7a3c}
#t20a .sub{position:absolute;left:20mm;top:80mm;width:76mm;font:italic 300 15pt/1.2 'Cormorant Garamond';color:#ffd2b4}
#t20a .meta{position:absolute;left:178mm;top:20mm;width:52mm}
#t20a .cap{position:absolute;left:178mm;top:76mm;width:52mm;font:400 6.6pt/1.45 'Arimo';color:#d8b8a8}
#t20a .txt{position:absolute;left:20mm;top:104mm;width:72mm;height:120mm;font-size:10.4pt;color:#fff1e8;text-shadow:0 0 1mm #0a0505}
"""
    text = P(
        "Такой финал оставил бы альбом внутри продолжающегося цикла. <i>Saint Pablo</i> добавляет необходимость заговорить ещё раз.",
        "Её размеренный ритм, материал <i>Where I’m From</i> Jay-Z и протяжённый вокал Самфы создают более устойчивую рамку для речи. После множества резких переключений сама продолжительность внимания становится событием.<sup class=\"fn\">28</sup>",
        "Канье возвращается к публичной реакции, заявленным долгам, просьбам о деньгах и собственной исторической значимости. Но главное признание связано с самооценкой, которую он пытается добыть из чужих комментариев.",
    )
    body = (
        stage
        + '<div class="k kicker">20 / 20 · Часть IV · финал</div>'
        + '<h1>Saint<br>Pablo</h1>'
        + '<div class="ru">Святой Пабло</div>'
        + '<div class="sub">' + typo("Самооценка, собранная толпой", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#ffd2b4", dim="rgba(255,210,180,.2)")}</div>'
        + '<div class="cap">' + typo("Песню добавили в альбом 14 июня 2016 года — через четыре месяца после выхода. В августе начался тур Saint Pablo: сцена-платформа на тросах парила над партером, и артист пел над головами толпы. Иллюстрация — по мотивам.", False) + '</div>'
        + f'<div class="txt prose" style="--fn:#ff7a3c">{text}</div>'
        + folio(right="20 · Saint Pablo", color="#ff7a3c")
    )
    return page("t20a", body, css=css)


# =================================================================== 20 SAINT PABLO (b) — crowdsourced self-esteem
def t20b():
    rnd = random.Random(2016)
    cx, cy = 60, 58
    g = ['<svg width="120mm" height="116mm" viewBox="0 0 120 116">']
    for i in range(170):
        a = rnd.uniform(0, math.pi * 2)
        r = rnd.uniform(30, 56)
        x, y = cx + r * math.cos(a), cy + r * math.sin(a) * .92
        g.append(f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{cx + 7 * math.cos(a):.1f}" y2="{cy + 7 * math.sin(a):.1f}" stroke="#ff7a3c" stroke-width=".15" opacity=".55"/>')
        g.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(.5, 1.1):.2f}" fill="#fff1e8" opacity=".8"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="7" fill="#ff7a3c"/>')
    g.append(f'<text x="{cx}" y="{cy + 1}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="2.6" fill="#0a0505">САМООЦЕНКА</text>')
    g.append("</svg>")
    css = """
#t20b{background:#0a0505;color:#fff1e8}
#t20b .k{position:absolute;left:20mm;top:18mm;color:#ff7a3c}
#t20b .net{position:absolute;left:12mm;top:24mm}
#t20b .q{position:absolute;left:136mm;top:30mm;width:94mm;font:400 23pt/1.05 'Unbounded';letter-spacing:-.02em;color:#fff1e8}
#t20b .q small{display:block;font:italic 300 13pt/1.25 'Cormorant Garamond';letter-spacing:0;margin-top:3mm;color:#ffd2b4}
#t20b .nl{position:absolute;left:20mm;top:140mm;width:104mm;font:700 5.6pt/1.4 'Arimo';letter-spacing:.18em;text-transform:uppercase;color:#ff7a3c}
#t20b .txt{position:absolute;left:136mm;top:82mm;width:94mm;height:148mm;font-size:10.4pt;color:#f6e6dc}
#t20b .epi{position:absolute;left:20mm;top:156mm;width:104mm;font-size:16pt;line-height:1.2;color:#fff1e8}
#t20b .epi .src{color:#ff7a3c}
#t20b .sam{position:absolute;left:20mm;top:196mm;width:104mm;font:italic 400 10.4pt/1.32 'EB Garamond';color:#d8b8a8}
"""
    text = P(
        "Выражение «crowdsource my self-esteem» использует язык цифровой экономики для описания интимной зависимости. Собственное достоинство превращается в задачу, переданную распределённой аудитории. После всех деклараций независимости это почти идеальная формула внутреннего устройства героя.<sup class=\"fn\">29</sup>",
        "Здесь встречаются две линии альбома: человек считает себя исключительным — и нуждается в постоянном внешнем подтверждении этой исключительности. Публичное величие оказывается чрезвычайно уязвимым способом существования.",
        "Но <i>Saint Pablo</i> сохраняет и ограничения его мировоззрения. Рассуждения о деньгах включают этнические и расовые обобщения; искренность исповеди не придаёт им аналитической состоятельности. Песня показывает человека достаточно близко, чтобы слышать и силу его самопонимания, и моменты, когда он снова подменяет понимание удобной схемой.",
        "Самфа расширяет эмоциональное поле. Его длинные фразы не торопятся становиться утверждениями — они хранят ожидание ответа. Адресатом можно услышать Бога, близкого человека или того, кто наконец способен увидеть говорящего.",
        "Именно здесь меняется значение религиозной образности. В начале альбома у молитвы была коллективная опора: хор уже стоял рядом. В финале обращение уходит в пространство, где ответ не гарантирован.",
        "Это завершение не доказывает, что герой преодолел собственные противоречия. Оно позволяет услышать достижение потруднее: признание того, как сильно ему нужен кто-то ещё.",
    )
    body = (
        '<div class="k kicker">Saint Pablo · продолжение</div>'
        + f'<div class="net">{"".join(g)}</div>'
        + '<div class="nl">Краудсорсинг самооценки: сто семьдесят точек, одна задача · прочтение</div>'
        + '<div class="q">crowdsource my self-esteem<small>' + typo("достоинство, переданное на аутсорсинг комментариям", False) + '</small></div>'
        + f'<div class="txt prose" style="--fn:#ff7a3c">{text}</div>'
        + '<div class="epi">' + typo("«…довольно для тебя благодати Моей, ибо сила Моя совершается в немощи».", False) + '<span class="src">2 Кор. 12:9</span></div>'
        + '<div class="sam">' + typo("В <i>Ultralight Beam</i> хор стоял рядом. В <i>Saint Pablo</i> Самфа поёт в пустоту — и ждёт.", False) + '</div>'
        + folio(right="20 · Saint Pablo", color="#ff7a3c")
    )
    return page("t20b", body, css=css)


def pages():
    return [part4(), t15(), t16(), t17a(), t17b(), t18(), t19(), t20a(), t20b()]
