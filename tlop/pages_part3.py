"""Part III — «Свет без тепла»: FML, Real Friends, Wolves, Frank’s Track."""
import math

from data import TRACKS
from lib import P, esc, folio, page, track_meta, typo, fmt_dur

T = {t["n"]: t for t in TRACKS}


# =================================================================== PART III OPENER
def part3():
    lst = "".join(
        f'<div class="it"><span>{n:02d}</span><b>{esc(T[n]["t"])}</b><em>{fmt_dur(T[n]["sec"])}</em></div>'
        for n in range(11, 15))
    css = """
#part3{background:#13223a;color:#dce6f0}
#part3 .img{position:absolute;right:0;top:0;width:132mm;height:232mm;overflow:hidden}
#part3 .img img{width:100%;height:100%;object-fit:cover;object-position:60% 40%;display:block}
#part3 .k{position:absolute;left:20mm;top:18mm;color:#8fb4d9}
#part3 .num{position:absolute;left:16mm;top:20mm;font:900 120pt/1 'Playfair';color:#dce6f0;letter-spacing:-.02em}
#part3 h2{position:absolute;left:19mm;top:76mm;margin:0;width:96mm;font:italic 300 40pt/1 'Cormorant Garamond'}
#part3 .lead{position:absolute;left:20mm;top:112mm;width:92mm;font:italic 400 12pt/1.32 'EB Garamond';color:#b9cbe0}
#part3 .list{position:absolute;left:20mm;top:150mm;width:92mm}
#part3 .it{display:flex;gap:3mm;align-items:baseline;border-top:.3mm solid #8fb4d9;padding:1.5mm 0;font:400 8pt/1.2 'Arimo'}
#part3 .it span{font-weight:700;width:6mm}
#part3 .it b{flex:1;font-weight:700}
#part3 .it em{font-style:normal}
#part3 .epi{position:absolute;left:20mm;top:186mm;width:92mm;font-size:13pt;line-height:1.24}
#part3 .epi .src{color:#8fb4d9}
#part3 .cap{position:absolute;right:4mm;bottom:22mm;width:110mm;text-align:right;font:700 5pt/1.4 'Arimo';letter-spacing:.14em;text-transform:uppercase;color:#dce6f0;background:#13223a;padding:1.2mm 2mm}
"""
    body = (
        '<div class="img"><img src="../img/picart_prison_cyan.png" alt=""></div>'
        + '<div class="cap">Этьен Пикар по Чиро Ферри. Святые Пётр и Павел в темнице. Гравюра, рубеж XVII–XVIII вв. · The Met, CC0</div>'
        + '<div class="k kicker">Часть третья</div>'
        + '<div class="num">III</div>'
        + '<h2>Свет без тепла</h2>'
        + '<div class="lead">' + typo("Цена близости: обещания, пропущенные звонки, волки у дверей — и свет, который больше не греет.", False) + '</div>'
        + f'<div class="list">{lst}</div>'
        + '<div class="epi">' + typo("«Бедный я человек! кто избавит меня от сего тела смерти?»", False)
        + '<span class="src">Рим. 7:24</span></div>'
        + folio(right="Часть III", color="#8fb4d9")
    )
    return page("part3", body, css=css)


# =================================================================== 11 FML
def t11():
    tr = T[11]
    css = """
#t11{background-color:#eef0e2;color:#1d2a1f}
#t11 .rules{position:absolute;inset:0;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 5.7mm,rgba(110,150,110,.38) 5.7mm,rgba(110,150,110,.38) 6mm);background-position:0 3mm}
#t11 .vr{position:absolute;top:0;bottom:0;width:.3mm;background:rgba(179,38,30,.55)}
#t11 .k{position:absolute;left:20mm;top:15.5mm;color:#b3261e}
#t11 h1{position:absolute;left:18mm;top:20mm;margin:0;font:700 74pt/1 'IBM Plex Mono';letter-spacing:-.04em}
#t11 .sub{position:absolute;left:96mm;top:26mm;width:80mm;font:italic 400 15pt/1.2 'EB Garamond'}
#t11 .stamp{position:absolute;left:96mm;top:44mm;transform:rotate(-4deg);border:.7mm solid #b3261e;color:#b3261e;font:700 9pt/1.25 'IBM Plex Mono';letter-spacing:.06em;padding:1.6mm 3mm;opacity:.88;background:rgba(238,240,226,.6)}
#t11 .epi{position:absolute;left:184mm;top:20mm;width:46mm;font-size:11pt;line-height:1.24}
#t11 .epi .src{color:#b3261e}
#t11 table.led{position:absolute;left:20mm;top:66mm;width:140mm;border-collapse:collapse;font:400 8.6pt/1.2 'IBM Plex Mono'}
#t11 .led th{font:700 6.2pt/1.2 'IBM Plex Mono';letter-spacing:.14em;text-transform:uppercase;text-align:left;border-bottom:.5mm double #1d2a1f;padding:1.4mm 1mm;color:#b3261e}
#t11 .led td{height:6mm;padding:0 1mm;border-bottom:.2mm solid rgba(29,42,31,.35)}
#t11 .led td.v{text-align:left;color:#6c7d6c;font-style:italic}
#t11 .led tr.tot td{border-top:.5mm double #1d2a1f;font-weight:700}
#t11 .meta{position:absolute;left:168mm;top:66mm;width:62mm}
#t11 .glitch{position:absolute;left:0;top:219mm}
#t11 .txt{position:absolute;left:20mm;top:116mm;width:210mm;height:102mm;font-size:10.5pt;line-height:1.4}
#t11 .txt.cols{column-count:3;column-gap:6mm;text-align:left}
"""
    rows = [("дети", "любовь", "страх потерять имущество"), ("жена", "преданность", "ожидание враждебной публики"),
            ("миссия", "призвание", "собственные срывы")]
    led = ('<table class="led"><colgroup><col style="width:20mm"><col style="width:24mm"><col><col style="width:16mm"></colgroup>'
           '<tr><th colspan="2">актив · ради чего держаться</th><th colspan="2">пассив · чего боится</th></tr>'
           + "".join(f'<tr><td>{a}</td><td class="v">{b}</td><td>{c}</td><td class="v">—</td></tr>' for a, b, c in rows)
           + '<tr class="tot"><td colspan="3">сальдо: «I’m the only one that’s in control»</td><td class="v">не&nbsp;сходится</td></tr></table>')
    # ledger lines that lose control at the bottom (Section 25 "Hit" outro)
    g = ['<svg width="250mm" height="22mm" viewBox="0 0 250 22">']
    for k in range(4):
        pts = []
        for x in range(0, 251, 2):
            amp = (x / 250) ** 2 * (2 + k * .8)
            y = 3 + k * 4.5 + amp * math.sin(x * 0.42 + k * 1.3) + (0.8 * math.sin(x * 2.1) if x > 160 else 0)
            pts.append(f"{x},{y:.2f}")
        g.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="#6e966e" stroke-width=".35"/>')
    g.append('<text x="230" y="-1.5" text-anchor="end" font-family="IBM Plex Mono" font-size="2.6" fill="#b3261e">→ Section 25, «Hit» (1981): форма теряет контроль вместе с героем</text>')
    g.append("</svg>")
    text = P(
        "В <i>FML</i> появляется цена возможной потери этой близости. Начальная аранжировка оставляет много воздуха между голосом, басом и ударными. Канье приходится удерживать внимание собственной фразой; сдержанность делает каждую попытку объясниться заметнее.",
        "Его «I’m the only one that’s in control» звучит как центральное убеждение, которое песня понемногу подвергает испытанию. Он обещает сохранить отношения и отказаться от разрушительного поведения, но в мотивировке соединяет любовь к детям, преданность жене, собственную миссию — и страх потерять имущество.<sup class=\"fn\">16</sup>",
        "Литературно это существенно: возвышенная декларация опять соприкасается с бухгалтерией. Чувство существует, но язык собственности вмешивается в способ его выразить.",
        "Припев The Weeknd добавляет ещё одно противоречие. Герой ощущает ожидание враждебной публики — и одновременно признаёт собственное участие в возможной катастрофе. Внешний враг больше не объясняет всего происходящего.",
        "Дальше само исполнение делает обещание контроля всё менее убедительным. Речь становится раздражённее, появляются конфликтные реплики, стремление взять верх в споре. Текст разыгрывает расхождение между намерением и поведением.",
        "Финальная интерполяция <i>Hit</i> группы Section 25 меняет фактуру: искажённые голоса, повтор и тембровая неустойчивость словно размывают границы исходной композиции. Структура песни переживает то же ослабление контроля, о котором рассказывает герой.<sup class=\"fn\">6</sup>",
        "В этом глубокая точность <i>FML</i>. Самопонимание присутствует, но волшебной силы не имеет. Человек способен назвать то, чем дорожит, — и продолжать действовать против этого.",
    )
    body = (
        '<div class="rules"></div><div class="vr" style="left:16mm"></div><div class="vr" style="left:17mm"></div>'
        + '<div class="k kicker">11 / 20 · Часть III</div>'
        + '<h1>FML</h1>'
        + '<div class="sub">' + typo("Бухгалтерия обета", False) + '</div>'
        + '<div class="stamp">I’M THE ONLY ONE<br>THAT’S IN CONTROL</div>'
        + '<div class="epi">' + typo("«Доброго, которого хочу, не делаю, а злое, которого не хочу, делаю».", False) + '<span class="src">Рим. 7:19</span></div>'
        + led
        + f'<div class="meta">{track_meta(tr, color="#1d2a1f", dim="rgba(29,42,31,.15)")}</div>'
        + f'<div class="txt prose cols" style="--fn:#b3261e">{text}</div>'
        + f'<div class="glitch">{"".join(g)}</div>'
        + folio(right="11 · FML", color="#1d2a1f")
    )
    return page("t11", body, css=css)


# =================================================================== 12 REAL FRIENDS (a)
def t12a():
    tr = T[12]
    calls = [("Родные", "пропущенный ×3"), ("Друзья", "пропущенный ×2"), ("Двоюродный брат", "пропущенный"),
             ("FaceTime", "не отвечено"), ("День рождения", "забыто")]
    ph = "".join(f'<div class="c"><span class="i">↙</span><span class="n">{a}</span><span class="d">{b}</span></div>' for a, b in calls)
    # calendar of a month, Thursday column marked
    days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    cal = ['<div class="cal"><div class="hd">' + "".join(f"<span>{d}</span>" for d in days) + "</div><div class=\"gd\">"]
    start = 4  # month starts on Friday
    for i in range(35):
        dnum = i - start + 1
        txt = str(dnum) if 1 <= dnum <= 31 else ""
        cls = []
        if i % 7 == 3:
            cls.append("thu")
        if dnum in (9, 22):
            cls.append("bd")
        cal.append(f'<span class="{" ".join(cls)}">{txt}</span>')
    cal.append('</div><div class="cn">' + typo("○ — забытые дни рождения · столбец «чт»: «думал, сегодня четверг»", False) + "</div></div>")
    css = """
#t12a{background:#dce4ec;color:#1c2e4a}
#t12a .k{position:absolute;left:20mm;top:18mm}
#t12a h1{position:absolute;left:18mm;top:23mm;margin:0;font:400 60pt/1 'Alice';letter-spacing:-.01em}
#t12a .sub{position:absolute;left:20mm;top:47mm;font:italic 400 15pt/1.2 'EB Garamond'}
#t12a .phone{position:absolute;left:150mm;top:18mm;width:80mm;height:86mm;border-radius:7mm;background:#1c2e4a;color:#dce4ec;padding:9mm 5mm 5mm;box-shadow:inset 0 0 0 1mm #3f5a7a}
#t12a .phone .t{font:700 6pt/1 'Arimo';letter-spacing:.22em;text-transform:uppercase;color:#8fa6bf;margin-bottom:3mm}
#t12a .phone .c{display:flex;gap:2mm;align-items:baseline;border-top:.25mm solid #3f5a7a;padding:2.3mm 0;font:400 8.6pt/1.2 'Arimo'}
#t12a .phone .c .i{color:#ff6b5b;width:4mm}
#t12a .phone .c .n{flex:1;font-weight:700}
#t12a .phone .c .d{font-size:7pt;color:#8fa6bf}
#t12a .phone .q{margin-top:4mm;font:italic 400 10pt/1.3 'EB Garamond';color:#dce4ec}
#t12a .cal{position:absolute;left:20mm;top:62mm;width:118mm}
#t12a .cal .hd,#t12a .cal .gd{display:grid;grid-template-columns:repeat(7,1fr)}
#t12a .cal .hd span{font:700 6pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;padding:0 0 1.6mm 1mm}
#t12a .cal .gd span{height:9.4mm;border-top:.25mm solid #3f5a7a;border-left:.25mm solid rgba(63,90,122,.35);font:400 8pt/1 'Arimo';padding:1mm;position:relative}
#t12a .cal .gd span.thu{background:rgba(63,90,122,.16)}
#t12a .cal .gd span.bd::after{content:"";position:absolute;left:-.2mm;top:-.4mm;width:5.4mm;height:5.4mm;border:.45mm solid #c0392b;border-radius:50%}
#t12a .cal .cn{font:400 6.4pt/1.4 'Arimo';margin-top:1.8mm;opacity:.8}
#t12a .meta{position:absolute;left:150mm;top:112mm;width:80mm}
#t12a .txt{position:absolute;left:20mm;top:126mm;width:122mm;height:104mm;font-size:10.8pt}
#t12a .txt2{position:absolute;left:150mm;top:148mm;width:80mm;height:80mm;font-size:10.8pt}
"""
    t1 = P(
        "<i>Real Friends</i> переносит проблему из области обещаний в область повседневного внимания.",
        "Короткий фортепианный рисунок и тяжёлые ударные создают устойчивую, утомлённую цикличность. Музыка почти не предлагает выхода из этого состояния. Голос Ty Dolla $ign подхватывает и поддерживает отдельные фразы — и разговор начинает звучать как разделённая усталость.",
        "Вклад Havoc в ударные важен для этого эффекта: мягкость гармонического фона всё время натыкается на жёсткое ритмическое основание. Песня сохраняет вес, обходясь без большой драматической кульминации.<sup class=\"fn\">17</sup>",
        "В тексте происходит одно из самых значимых движений альбома. Вопрос о ненадёжности друзей разворачивается фразой «you not the problem». Рассказчик вспоминает собственные пропущенные звонки, забытые дни рождения, незнание жизни родственников.<sup class=\"fn\">18</sup>",
    )
    t2 = P(
        "Этот поворот делает его более надёжным рассказчиком — именно в тот момент, когда он отказывается от удобного самооправдания и обнаруживает границы собственной версии событий.",
    )
    body = (
        '<div class="k kicker">12 / 20 · Часть III</div>'
        + '<h1>Real Friends</h1>'
        + '<div class="sub">' + typo("Пропущенные звонки", False) + '</div>'
        + "".join(cal)
        + '<div class="phone"><div class="t">недавние · пропущенные</div>' + ph
        + '<div class="q">' + typo("Схема, а не распечатка: так выглядит отсутствие, о котором поёт рассказчик.", False) + '</div></div>'
        + f'<div class="txt prose" style="--fn:#c0392b">{t1}</div>'
        + f'<div class="meta">{track_meta(tr, color="#1c2e4a", dim="rgba(28,46,74,.18)")}</div>'
        + f'<div class="txt2 prose" style="--fn:#c0392b">{t2}</div>'
        + folio(right="12 · Real Friends", color="#1c2e4a")
    )
    return page("t12a", body, css=css)


# =================================================================== 12 REAL FRIENDS (b)
def t12b():
    laptop = """
<svg width="92mm" height="64mm" viewBox="0 0 92 64">
  <rect x="14" y="4" width="64" height="40" rx="2.5" fill="#1c2e4a"/>
  <rect x="18" y="8" width="56" height="32" fill="#3f5a7a"/>
  <path d="M6 46 H86 L90 52 H2 Z" fill="#1c2e4a"/>
  <rect x="38" y="14" width="16" height="12" rx="1.5" fill="none" stroke="#dce4ec" stroke-width="1.2"/>
  <path d="M41 14 V10.5 A5 5 0 0 1 51 10.5 V14" fill="none" stroke="#dce4ec" stroke-width="1.2"/>
  <circle cx="46" cy="20" r="1.4" fill="#dce4ec"/>
  <g transform="rotate(-8 70 58)"><rect x="52" y="52" width="38" height="11" fill="#c0392b"/>
  <text x="71" y="59.6" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="5.4" fill="#fff">$250 000</text></g>
</svg>"""
    tux = """
<svg width="40mm" height="46mm" viewBox="0 0 40 46">
  <path d="M4 44 L8 10 L16 4 L20 12 L24 4 L32 10 L36 44 Z" fill="#1c2e4a"/>
  <path d="M16 4 L20 22 L24 4 L20 12 Z" fill="#dce4ec"/>
  <path d="M14 9 L20 12 L26 9 L26 15 L20 12 L14 15 Z" fill="#0f1a2c"/>
  <path d="M21 24 C 26 22, 30 27, 27 31 C 30 35, 24 38, 22 35 C 18 38, 15 33, 18 30 C 15 27, 18 22, 21 24 Z" fill="#8e1b2f" opacity=".92"/>
  <circle cx="25" cy="38" r="1.1" fill="#8e1b2f"/><circle cx="17" cy="39" r=".8" fill="#8e1b2f"/>
</svg>"""
    css = """
#t12b{background:#dce4ec;color:#1c2e4a}
#t12b .k{position:absolute;left:20mm;top:18mm}
#t12b .epi{position:absolute;left:20mm;top:24mm;width:120mm;font-size:17pt;line-height:1.2}
#t12b .epi .src{color:#3f5a7a}
#t12b .rec{position:absolute;left:150mm;top:20mm;width:80mm;font:italic 300 20pt/1.15 'Cormorant Garamond';text-align:right}
#t12b .rec b{display:block;font:700 6pt/1.2 'Arimo';font-style:normal;letter-spacing:.2em;text-transform:uppercase;margin-top:2mm;color:#3f5a7a}
#t12b .txt{position:absolute;left:20mm;top:62mm;width:118mm;height:166mm;font-size:12.2pt;line-height:1.5}
#t12b .lap{position:absolute;left:146mm;top:66mm}
#t12b .lapc{position:absolute;left:150mm;top:132mm;width:80mm;font:400 7.2pt/1.42 'Arimo'}
#t12b .tux{position:absolute;left:150mm;top:160mm}
#t12b .tuxc{position:absolute;left:194mm;top:166mm;width:36mm;font:400 7.2pt/1.42 'Arimo'}
#t12b .money{position:absolute;left:150mm;top:212mm;width:80mm;font:italic 400 11pt/1.25 'EB Garamond';border-top:.3mm solid #1c2e4a;padding-top:2mm}
"""
    text = P(
        "Песня показывает, что близость требует времени, которое нельзя заменить деньгами. Можно оплачивать чужие нужды и почти не знать человека. Можно считать себя щедрым — и оставаться эмоционально отсутствующим.",
        "Здесь же проступает небольшой, но выразительный мотив одежды. В <i>Father Stretch My Hands</i> сексуальный эпизод угрожает футболке. В <i>Real Friends</i> на причастии проливается вино — и испорчен смокинг. В обоих случаях рассказчик стоит на пороге опыта, который мог бы иметь большое телесное или духовное значение, — и замечает ущерб собственной одежде. Материальная поверхность принимает на себя то, о чём ему труднее говорить прямо.",
        "История украденного ноутбука доводит отчуждение до предела. Родство становится возможностью давления; интимность — содержимым устройства; деньги — способом вернуть контроль над приватностью. В одном бытовом предмете пересекаются почти все главные тревоги альбома.",
        "А главное движение песни остаётся грамматическим. Вопрос «кто из вас настоящий друг?» оборачивается к спрашивающему. Местоимение меняет направление — и вместе с ним меняется ответственность.",
    )
    body = (
        '<div class="k kicker">Real Friends · продолжение</div>'
        + '<div class="epi">' + typo("«И тотчас как бы чешуя отпала от глаз его, и вдруг он прозрел…»", False) + '<span class="src">Деян. 9:18</span></div>'
        + '<div class="rec">you not the problem<b>момент, когда вопрос обращается к спрашивающему</b></div>'
        + f'<div class="txt prose" style="--fn:#c0392b">{text}</div>'
        + f'<div class="lap">{laptop}</div>'
        + '<div class="lapc">' + typo("<b>Ноутбук.</b> Кузен украл компьютер с личными записями; вернуть его стоило, как сказано в песне, четверть миллиона долларов. В <i>No More Parties in LA</i> эта история вернётся.", False) + '</div>'
        + f'<div class="tux">{tux}</div>'
        + '<div class="tuxc">' + typo("<b>Смокинг.</b> Вино причастия — на ткани. Ущерб замечен раньше смысла.", False) + '</div>'
        + '<div class="money">' + typo("Близость требует времени, которое нельзя оплатить.", False) + '</div>'
        + folio(right="12 · Real Friends", color="#1c2e4a")
    )
    return page("t12b", body, css=css)


# =================================================================== 13 WOLVES — wolf in five states
WOLF = [(4, 24), (8, 21), (16, 19), (22, 15), (25, 12), (28, 3), (32, 11), (36, 14), (42, 17), (50, 18),
        (62, 19), (74, 20), (82, 22), (86, 23), (94, 30), (99, 42), (95, 44), (88, 33), (85, 32), (86, 40),
        (88, 50), (89, 60), (84, 61), (83, 52), (78, 42), (72, 38), (60, 38), (50, 37), (46, 40), (46, 52),
        (47, 61), (41, 61), (41, 50), (38, 38), (34, 32), (28, 29), (16, 27), (10, 26)]
INNER = [(30, 22), (46, 28), (62, 28), (77, 30), (86, 52), (44, 52), (92, 38)]


def _wolf_states(cold="#c9d6e3", ink="#e9f0f7"):
    poly = " ".join(f"{x},{y}" for x, y in WOLF)
    out = []
    # state 1: full silhouette with fur
    fur = []
    for i in range(46):
        x = 10 + (i * 37) % 84
        y = 18 + (i * 13) % 34
        fur.append(f'<line x1="{x}" y1="{y}" x2="{x + 3}" y2="{y + 1.2}" stroke="#13223a" stroke-width=".35" opacity=".6"/>')
    out.append(f'<defs><clipPath id="wclip"><polygon points="{poly}"/></clipPath></defs>'
               f'<g><polygon points="{poly}" fill="{cold}"/><g clip-path="url(#wclip)">{"".join(fur)}</g>'
               f'<circle cx="17" cy="21.5" r=".9" fill="#13223a"/></g>')
    # state 2: facets
    tris = []
    shades = ["#9fb4ca", "#c9d6e3", "#7f97b1", "#b4c5d8", "#e1e9f2"]
    for i in range(len(WOLF)):
        a, b = WOLF[i], WOLF[(i + 1) % len(WOLF)]
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        c = min(INNER, key=lambda p: (p[0] - mx) ** 2 + (p[1] - my) ** 2)
        tris.append(f'<polygon points="{a[0]},{a[1]} {b[0]},{b[1]} {c[0]},{c[1]}" fill="{shades[i % 5]}" stroke="#13223a" stroke-width=".2"/>')
    for i in range(len(INNER) - 1):
        a, b = INNER[i], INNER[i + 1]
        tris.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="#13223a" stroke-width=".2"/>')
    out.append(f'<g clip-path="url(#wclip)">{"".join(tris)}</g>')
    # state 3: outline
    out.append(f'<polygon points="{poly}" fill="none" stroke="{ink}" stroke-width=".7" stroke-linejoin="round"/>')
    # state 4: a few strokes
    st = [[(22, 15), (50, 18), (86, 23), (99, 42)], [(4, 24), (22, 15), (28, 3), (32, 11)],
          [(4, 24), (16, 27), (34, 32), (38, 38)], [(44, 38), (44, 61)], [(80, 38), (86, 48), (86, 61)], [(38, 38), (78, 40)]]
    out.append("".join(
        f'<polyline points="{" ".join(f"{x},{y}" for x, y in seg)}" fill="none" stroke="{ink}" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>'
        for seg in st))
    # state 5: a single line (Catmull-Rom through key points)
    key = [(99, 42), (86, 23), (50, 18), (32, 11), (28, 3), (22, 15), (4, 24), (16, 27), (38, 38), (44, 61)]
    d = f"M{key[0][0]},{key[0][1]}"
    for i in range(len(key) - 1):
        p0 = key[i - 1] if i > 0 else key[i]
        p1, p2 = key[i], key[i + 1]
        p3 = key[i + 2] if i + 2 < len(key) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]},{p2[1]}"
    out.append(f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="1" stroke-linecap="round"/>')
    return out


def t13a():
    tr = T[13]
    states = _wolf_states()
    cells = []
    labels = ["I · всё", "II · плоскости", "III · контур", "IV · несколько линий", "V · одна линия"]
    for i, (st, lab) in enumerate(zip(states, labels)):
        defs = ""
        if i in (1,):
            defs = f'<defs><clipPath id="wclip2"><polygon points="{" ".join(f"{x},{y}" for x, y in WOLF)}"/></clipPath></defs>'
            st = st.replace('url(#wclip)', 'url(#wclip2)')
        cells.append(f'<div class="st"><svg width="44mm" height="30mm" viewBox="0 0 100 64">{defs}{st}</svg><span>{lab}</span></div>')
    css = """
#t13a{background:#070b12;color:#dfe8f1}
#t13a .k{position:absolute;left:20mm;top:18mm;color:#8fb4d9}
#t13a h1{position:absolute;left:18mm;top:22mm;margin:0;font:400 66pt/1 'Tenor Sans';letter-spacing:.32em;color:#e9f0f7}
#t13a .sub{position:absolute;left:20mm;top:50mm;font:italic 300 17pt/1.2 'Cormorant Garamond';color:#b9cbe0}
#t13a .states{position:absolute;left:12mm;top:66mm;width:226mm;display:flex;justify-content:space-between}
#t13a .st{display:flex;flex-direction:column;align-items:center;gap:2mm;font:700 5.6pt/1 'Arimo';letter-spacing:.18em;text-transform:uppercase;color:#8fb4d9}
#t13a .bull{position:absolute;left:20mm;top:106mm;width:210mm;font:italic 400 10.5pt/1.3 'EB Garamond';color:#b9cbe0;border-top:.25mm solid #3f5a7a;padding-top:2mm}
#t13a .txt{position:absolute;left:20mm;top:124mm;width:150mm;height:72mm;font-size:11pt;color:#dfe8f1}
#t13a .bigwolf{position:absolute;left:150mm;top:196mm;opacity:.9}
#t13a .meta{position:absolute;left:178mm;top:124mm;width:52mm}
"""
    text = P(
        "<i>Wolves</i> превращает эти тревоги в пространство. Cashmere Cat и Sinjin Hawke построили основу песни из аккордов и синтетических хоровых тембров — а затем убирали лишнее. Hawke описывал результат как печальный минималистичный бит. Эта история важна: ощущение пустоты здесь создано отбором и сокращением.<sup class=\"fn\">19</sup>",
        "Высокий вокальный мотив занимает огромное пространство, хотя звуков совсем немного. Низкие частоты придают ему тяжесть, дистанция между элементами — холод. Голос кажется одновременно человеческим и оторванным от тела.",
        "В <i>Ultralight Beam</i> хор давал ощущение людей, стоящих рядом. В <i>Wolves</i> похожая по происхождению вокальная материя означает отсутствие, одиночество, угрозу. Духовная окраска тембра сама по себе больше не гарантирует утешения.",
    )
    body = (
        '<div class="k kicker">13 / 20 · Часть III</div>'
        + '<h1>WOLVES</h1>'
        + '<div class="sub">' + typo("Пустота, вырезанная вручную", False) + '</div>'
        + f'<div class="states">{"".join(cells)}</div>'
        + '<div class="bull">' + typo("Зимой 1945–1946 года Пикассо за одиннадцать состояний литографии «Бык» свёл животное к нескольким линиям. <i>Wolves</i> сделан тем же жестом — вычитанием. Рисунок волка здесь — оригинальная иллюстрация по этому принципу.", False) + '</div>'
        + f'<div class="txt prose cols" style="--fn:#8fb4d9">{text}</div>'
        + f'<div class="meta">{track_meta(tr, color="#b9cbe0", dim="rgba(185,203,224,.2)")}</div>'
        + f'<div class="bigwolf"><svg width="74mm" height="44mm" viewBox="-2 0 104 66">{_wolf_states(ink="#5f7fa3")[4].replace("stroke-width=\"1\"", "stroke-width=\".45\"")}</svg></div>'
        + folio(right="13 · Wolves", color="#8fb4d9")
    )
    return page("t13a", body, css=css)


def t13b():
    halo = """
<svg width="96mm" height="96mm" viewBox="0 0 96 96">
  <defs><radialGradient id="hg" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#c8a44d" stop-opacity="0"/><stop offset=".78" stop-color="#e9cf86" stop-opacity=".5"/><stop offset=".86" stop-color="#c8a44d" stop-opacity="0"/></radialGradient></defs>
  <circle cx="48" cy="48" r="46" fill="url(#hg)"/>
  <circle cx="48" cy="48" r="36" fill="none" stroke="#c8a44d" stroke-width="2.4"/>
  <circle cx="48" cy="48" r="32" fill="none" stroke="#c8a44d" stroke-width=".4" stroke-dasharray="1 1.4"/>
  <text x="48" y="45" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="7" fill="#e9f0f7">What if Mary</text>
  <text x="48" y="54" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="7" fill="#e9f0f7">was in the club</text>
</svg>"""
    vers = [("12.02.2015", "премьера на показе Yeezy Season 1 в Нью-Йорке, в версии с Vic Mensa и Sia; песню называли будущим началом альбома"),
            ("14.02.2016", "версия на Tidal в день выхода альбома"),
            ("16.03.2016", "переработанная Wolves; финал Фрэнка Оушена выделен в отдельный трек")]
    vh = "".join(f'<div class="v"><b>{d}</b><span>{typo(t, False)}</span></div>' for d, t in vers)
    css = """
#t13b{background:#070b12;color:#dfe8f1}
#t13b .k{position:absolute;left:20mm;top:18mm;color:#8fb4d9}
#t13b .halo{position:absolute;left:20mm;top:26mm}
#t13b .epi{position:absolute;left:126mm;top:30mm;width:104mm;font-size:16pt;line-height:1.2;color:#e9f0f7}
#t13b .epi .src{color:#c8a44d}
#t13b .vers{position:absolute;left:126mm;top:80mm;width:104mm}
#t13b .vers .t{font:700 5.8pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#8fb4d9;margin-bottom:2mm}
#t13b .vers .v{display:flex;gap:3mm;border-top:.25mm solid #3f5a7a;padding:1.8mm 0;font:400 9pt/1.3 'EB Garamond'}
#t13b .vers .v b{font:700 6.6pt/1.5 'Arimo';width:19mm;flex:none;color:#c8a44d}
#t13b .txt{position:absolute;left:20mm;top:128mm;width:210mm;height:100mm;font-size:12pt;line-height:1.5;color:#dfe8f1}
"""
    text = P(
        "Текст поднимает семейную историю до библейского масштаба. Вопрос «What if Mary was in the club» предлагает представить священную фигуру в пространстве, которое общество привыкло связывать с сексуальной стигмой. В этом жесте — попытка защитить любимую женщину от окончательного определения через её прошлое.<sup class=\"fn\">20</sup>",
        "Но собственный язык героя мешает этому намерению. В песне остаются грубые сексуальные оценки и реплики, воспроизводящие ту же систему унижения. Текст пытается освободить женщину от осуждения — и продолжает пользоваться словами, на которых это осуждение держится.",
        "Поэтому <i>Wolves</i> сложнее простой песни о внешних врагах. Граница между угрозой снаружи и агрессией самого защитника оказывается проницаемой. Желание укрыть детей действительно трогает; представление о собственной семье как священном исключении одновременно обнаруживает масштаб самомифологизации.",
    )
    body = (
        '<div class="k kicker">Wolves · продолжение</div>'
        + f'<div class="halo">{halo}</div>'
        + '<div class="epi">' + typo("«Ибо я знаю, что по отшествии моем войдут к вам лютые волки, не щадящие стада».", False) + '<span class="src">Деян. 20:29 — прощальная речь Павла</span></div>'
        + f'<div class="vers"><div class="t">три жизни одной песни</div>{vh}</div>'
        + f'<div class="txt prose cols" style="--fn:#c8a44d">{text}</div>'
        + folio(right="13 · Wolves", color="#8fb4d9")
    )
    return page("t13b", body, css=css)


# =================================================================== 14 FRANK'S TRACK
def t14():
    tr = T[14]
    pts = ["Ultralight Beam", "Pt. 1", "Low Lights", "Highlights", "Frank’s Track"]
    light = [3, 3, 1, 3, 3]
    heat = [3, 3, 3, 1, 0]
    W, H = 120, 50
    xs = [8 + i * 26 for i in range(5)]
    yv = lambda v: 40 - v * 11  # noqa: E731
    s = [f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">']
    s.append('<line x1="0" y1="40" x2="120" y2="40" stroke="#9aa9b8" stroke-width=".2"/>')
    s.append(f'<polyline points="{" ".join(f"{x},{yv(v)}" for x, v in zip(xs, light))}" fill="none" stroke="#9fc6e8" stroke-width="1.3"/>')
    s.append(f'<polyline points="{" ".join(f"{x},{yv(v)}" for x, v in zip(xs, heat))}" fill="none" stroke="#e0a07a" stroke-width="1.3" stroke-dasharray="2 1.2"/>')
    for x, a, b, lab in zip(xs, light, heat, pts):
        s.append(f'<circle cx="{x}" cy="{yv(a)}" r="1.3" fill="#9fc6e8"/><circle cx="{x}" cy="{yv(b)}" r="1.3" fill="#e0a07a"/>')
        s.append(f'<text x="{x}" y="47" text-anchor="middle" font-family="Arimo" font-size="2.6" fill="#7d8c9b">{lab}</text>')
    s.append('<text x="0" y="3" font-family="Arimo" font-size="2.7" fill="#7aa6cc" font-weight="700">— СВЕТ</text>')
    s.append('<text x="18" y="3" font-family="Arimo" font-size="2.7" fill="#d98c62" font-weight="700">- - ТЕПЛО</text>')
    s.append("</svg>")
    css = """
#t14{background:radial-gradient(circle at 70% 34%,#ffffff 0,#f6f9fc 34%,#e8eff6 100%);color:#5d6b79}
#t14 .k{position:absolute;left:20mm;top:18mm}
#t14 h1{position:absolute;left:19mm;top:24mm;margin:0;font:300 30pt/1 'Cormorant Garamond';color:#3c4a58;letter-spacing:.02em}
#t14 .sec{position:absolute;left:150mm;top:58mm;font:300 120pt/1 'Cormorant Garamond';color:#cfdeec;letter-spacing:-.02em}
#t14 .sec small{font-size:14pt;letter-spacing:.2em;margin-left:2mm;color:#9aa9b8}
#t14 .lp{position:absolute;left:20mm;top:42mm;font:italic 300 13pt/1.3 'Cormorant Garamond';color:#7d8c9b}
#t14 .chart{position:absolute;left:20mm;top:70mm}
#t14 .mark{position:absolute;left:20mm;top:124mm;font:700 5.2pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #9aa9b8;padding:.7mm 1.3mm;color:#7d8c9b}
#t14 .txt{position:absolute;left:20mm;top:136mm;width:150mm;height:94mm;font-size:10.4pt;line-height:1.48;color:#3c4a58}
#t14 .meta{position:absolute;left:178mm;top:136mm;width:52mm}
#t14 .prec{position:absolute;left:178mm;top:206mm;width:52mm;font:italic 300 15pt/1.2 'Cormorant Garamond';color:#9aa9b8;text-align:right}
"""
    text = P(
        "<i>Frank’s Track</i> после этого звучит почти как смена самого способа думать. За считанные секунды Фрэнк Оушен проходит через образы выгорания, обрушения и остывания. Особенно важна формула «light with no heat». Свет сохраняется, но перестаёт означать поддержку: видимость и тепло расходятся.",
        "На протяжении альбома свет уже успел побыть религиозным обещанием, прекрасным утром и публичной эффектностью. Теперь появляется возможность сиять — и не согревать. Точный образ существования, в котором внешнее присутствие ничего не гарантирует близости.",
        "Фраза «Life is precious» возникает после этих утрат и потому сохраняет хрупкость: она похожа на знание, полученное слишком дорогой ценой.<sup class=\"fn\">21</sup>",
        "Выделение фрагмента из <i>Wolves</i> в отдельную дорожку усиливает его самостоятельность. Другой голос получает собственную границу и собственное время. Канье позволяет короткому чужому высказыванию поставить эмоциональную точку там, где его собственная речь продолжала кружить.",
    )
    body = (
        '<div class="k kicker">14 / 20 · Часть III</div>'
        + '<h1>Frank’s Track</h1>'
        + '<div class="lp">' + typo("Свет без тепла", False) + '</div>'
        + '<div class="sec">38<small>сек</small></div>'
        + f'<div class="chart">{"".join(s)}</div>'
        + '<div class="mark">прочтение · свет и тепло в образах альбома</div>'
        + f'<div class="txt prose cols" style="--fn:#7aa6cc">{text}</div>'
        + f'<div class="meta">{track_meta(tr, color="#5d6b79", dim="rgba(93,107,121,.18)", feat_label="голос")}</div>'
        + '<div class="prec">life is precious</div>'
        + folio(right="14 · Frank’s Track", color="#9aa9b8")
    )
    return page("t14", body, css=css)


def pages():
    return [part3(), t11(), t12a(), t12b(), t13a(), t13b(), t14()]
