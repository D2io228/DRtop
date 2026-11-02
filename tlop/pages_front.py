"""Front matter: cover, inside cover, contents, prologue, three Pablos,
cover anatomy, collective authorship."""
import math

from data import RELEASE, TRACKS
from lib import (NB, P, folio, icon_escobar, icon_paul, icon_picasso, jitter_ellipse,
                 page, typo, fmt_dur)

ORANGE = "#f28a55"


# =================================================================== COVER
def cover():
    offs = [124, 104, 132, 98, 118, 108]   # PABLO wanders (left offset from 19mm)
    lines = []
    for i, x in enumerate(offs):
        top = 17 + i * 14.4
        lines.append(
            f'<div class="cv-l" style="top:{top}mm"><span>THE LIFE OF</span>'
            f'<span class="pb" style="left:{x}mm">PABLO</span></div>')
    top = 17 + 6 * 14.4
    lines.append(
        f'<div class="cv-l" style="top:{top}mm"><span>THE LIFE OF</span>'
        f'<span class="pb" style="left:81mm">PA<i class="cur"></i></span></div>')
    which = "".join(
        '<div>КАКОЙ / ИЗ ТРЁХ</div>' for _ in range(8))
    css = """
#cover{background:#f28a55;color:#0d0b0a}
#cover .cv-l{position:absolute;left:19mm;right:0;height:13mm;font:700 34.5pt/1 'Arimo';letter-spacing:-.012em;white-space:nowrap}
#cover .cv-l .pb{position:absolute;top:0}
#cover .cur{display:inline-block;width:4.2mm;height:10.6mm;background:#0d0b0a;margin-left:1.6mm;vertical-align:-1.2mm}
#cover .ph{position:absolute;left:134mm;top:58mm;width:77mm;height:77mm;box-shadow:0 0 0 1.4mm #0d0b0a}
#cover .ph img{width:100%;height:100%;display:block}
#cover .phcap{position:absolute;left:134mm;top:138.5mm;width:77mm;font:700 5.2pt/1.35 'Arimo';letter-spacing:.14em;text-transform:uppercase}
#cover .ttl{position:absolute;left:19mm;top:133mm;font:700 25pt/1.06 'Arimo';letter-spacing:-.01em}
#cover .which{position:absolute;top:176mm;font:700 9.2pt/1 'Arimo';letter-spacing:.01em}
#cover .which div{height:6.2mm}
#cover .sub{position:absolute;left:74mm;top:177mm;width:88mm;font:italic 400 13.4pt/1.28 'EB Garamond';text-align:center}
#cover .sub b{font-style:normal;font-weight:600;font-family:'Arimo';font-size:7pt;letter-spacing:.22em;display:block;margin-top:5mm}
#cover .rule{position:absolute;left:19mm;right:19mm;top:168mm;border-top:.5mm solid #0d0b0a}
"""
    body = (
        "".join(lines)
        + '<div class="ph"><img src="../img/rembrandt_face_orange.png" alt=""></div>'
        + '<div class="phcap">Рембрандт. Автопортрет в образе<br>апостола Павла. 1661</div>'
        + '<div class="ttl">АВТОПОРТРЕТ,<br>КОТОРЫЙ НЕВОЗМОЖНО<br>ЗАКОНЧИТЬ</div>'
        + '<div class="rule"></div>'
        + f'<div class="which" style="left:19mm">{which}</div>'
        + f'<div class="which" style="right:19mm;text-align:right">{which}</div>'
        + '<div class="sub">' + typo("Эссе об альбоме Канье Уэста <i>The Life of Pablo</i> — в двадцати треках, трёх Пабло и одном телефонном звонке", False)
        + '<b>14 · 02 · 2016 — ∞</b></div>'
    )
    return page("cover", body, css=css)


# =================================================================== INSIDE COVER
def inside():
    css = """
#inside{background:#15110e;color:#f4efe6}
#inside .ep{position:absolute;left:20mm;width:128mm;display:flex;gap:5mm}
#inside .ep .ic{flex:none;width:9mm;padding-top:1.6mm}
#inside .ep .q{font:italic 300 21pt/1.18 'Cormorant Garamond';letter-spacing:-.005em}
#inside .ep.s .q{font-size:16.5pt;line-height:1.2}
#inside .ep .src{font:700 5.8pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-top:2.6mm;display:block;color:#f28a55}
#inside .num{position:absolute;left:20mm;font:700 6pt/1 'Arimo';letter-spacing:.3em;color:#f28a55}
#inside .bar{position:absolute;left:158mm;top:20mm;bottom:20mm;width:.3mm;background:#f28a55}
#inside .how{position:absolute;left:166mm;top:20mm;width:64mm}
#inside .how h3{font:700 6.4pt/1.2 'Arimo';letter-spacing:.24em;text-transform:uppercase;margin:0 0 3mm;color:#f28a55}
#inside .how p{font:400 9pt/1.45 'EB Garamond';margin:0 0 2.2mm;text-align:left;hyphens:manual;color:#e9e1d3}
#inside .lg{display:flex;align-items:center;gap:2.6mm;margin:2.4mm 0;font:400 8.8pt/1.25 'EB Garamond';color:#e9e1d3}
#inside .lg b{font:700 5.8pt/1 'Arimo';letter-spacing:.18em;text-transform:uppercase;display:block;margin-bottom:.9mm;color:#f4efe6}
#inside .mark{font:700 5.8pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #f28a55;color:#f28a55;padding:.9mm 1.6mm;display:inline-block}
#inside .big{position:absolute;left:18mm;bottom:16mm;font:400 52pt/.9 'Monomakh';color:#f28a55;letter-spacing:.01em}
#inside .big small{display:block;font:700 6pt/1.3 'Arimo';letter-spacing:.3em;color:#f4efe6;margin-top:3mm;text-transform:uppercase}
"""
    eps = [
        (22, "", icon_paul("#f28a55", 8), "«Теперь мы видим как бы сквозь тусклое стекло, гадательно… теперь знаю я отчасти».",
         "Первое послание к Коринфянам, 13:12"),
        (78, "s", '<svg width="8mm" height="8mm" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" fill="#f28a55"/></svg>',
         "«Это госпел-альбом, на котором очень много мата, — но это всё равно госпел-альбом».",
         "Канье Уэст, радио Big Boy, 2016"),
        (122, "s", icon_picasso("#f28a55", 8), "«Мы все знаем, что искусство — не истина. Искусство — это ложь, которая помогает нам постичь истину».",
         "Пабло Пикассо, интервью 1923 года"),
    ]
    eph = "".join(
        f'<div class="ep {c}" style="top:{t}mm"><div class="ic">{ic}</div><div><div class="q">{typo(q, False)}</div><span class="src">{src}</span></div></div>'
        for t, c, ic, q, src in eps)
    how = (
        '<h3>Как читать этот буклет</h3>'
        + P("Двадцать треков — двадцать комнат. У каждой свой свет, свой шрифт и своя температура: где-то госпел, где-то бухгалтерская книга, где-то телефонная трубка.",
            "Схемы на полях бывают двух родов. Одни построены на данных — длительностях, датах, титрах, сэмплах. Другие — способы прочтения: они не измеряют альбом, а показывают, как его слышит этот текст. Такие схемы помечены знаком")
        + '<p><span class="mark">прочтение</span></p>'
        + '<h3 style="margin-top:6mm">Индекс Пабло</h3>'
        + P("В шапке каждого трека — три шкалы от 0 до 3: чей голос в песне слышнее.")
        + f'<div class="lg">{icon_paul("#f28a55", 7)}<div><b>Павел</b>послание, вера, исповедь</div></div>'
        + f'<div class="lg">{icon_picasso("#f28a55", 7)}<div><b>Пикассо</b>форма, коллаж, автопортрет</div></div>'
        + f'<div class="lg">{icon_escobar("#f28a55", 7)}<div><b>Эскобар</b>продукт, деньги, власть</div></div>'
        + '<p style="margin-top:6mm;font-size:8pt;line-height:1.45;opacity:.85">'
        + typo("Библия цитируется в синодальном переводе. Строки песен — короткими фрагментами в оригинале. Разбор следует двадцатитрековой версии альбома, с <i>Saint Pablo</i> в финале. Номера на полях отсылают к источникам в конце.")
        + "</p>"
    )
    body = (eph + '<div class="bar"></div>' + f'<div class="how">{how}</div>'
            + '<div class="big">Пабло · Павел<small>Pablo — испанская форма имени Paulus</small></div>')
    return page("inside", body, css=css)


# =================================================================== CONTENTS
def contents():
    rule = 6.95
    top0 = 55
    css = f"""
#contents{{background-color:#f6e889;color:#1c2a5a}}
#contents .lines{{position:absolute;inset:0;
  background-image:repeating-linear-gradient(to bottom, transparent 0, transparent {rule - .25}mm, rgba(70,120,190,.45) {rule - .25}mm, rgba(70,120,190,.45) {rule}mm);
  background-position:0 {top0 + 1.2}mm}}
#contents .marg{{position:absolute;top:0;bottom:0;left:31mm;width:.35mm;background:rgba(214,72,72,.75)}}
#contents .marg2{{position:absolute;top:0;bottom:0;left:32.3mm;width:.2mm;background:rgba(214,72,72,.55)}}
#contents .head{{position:absolute;left:0;right:0;top:0;height:{top0 - 6}mm;background:#f6e889}}
#contents .hand{{font-family:'Caveat';font-weight:600;color:#1c2a5a}}
#contents .x{{position:absolute;font:600 17pt/1 'Caveat';color:#1c2a5a}}
#contents .x s{{text-decoration:none;position:relative}}
#contents .x s::after{{content:"";position:absolute;left:-1mm;right:-1mm;top:52%;height:.55mm;background:#1c2a5a;transform:rotate(-2deg)}}
#contents .row{{position:absolute;left:36mm;right:18mm;height:{rule}mm;display:flex;align-items:flex-end;font:600 13pt/1 'Caveat'}}
#contents .row .n{{width:9mm;font-size:11pt;opacity:.8}}
#contents .row .t{{flex:1;white-space:nowrap}}
#contents .row .d{{width:46mm;display:flex;align-items:center;gap:2mm;font-size:10pt;margin-bottom:.6mm}}
#contents .row .d i{{display:block;height:1.6mm;background:#1c2a5a;border-radius:.8mm;opacity:.85}}
#contents .row .pg{{width:9mm;text-align:right;font-size:13pt}}
#contents .row.sec .t{{font-size:14.5pt;color:#b3261e}}
#contents .row.sec .n{{color:#b3261e}}
#contents a{{color:inherit;text-decoration:none}}
#contents .tot{{position:absolute;right:18mm;top:43mm;font:600 11pt/1 'Caveat';opacity:.75}}
"""
    secs = {1: ("I", "Хор и сигнал", "part1"), 6: ("II", "Приглушённый свет", "part2"),
            11: ("III", "Свет без тепла", "part3"), 15: ("IV", "Запись ещё идёт", "part4")}
    pid = {1: "t01a", 2: "t02", 3: "t03", 4: "t04a", 5: "t05", 6: "t06", 7: "t07", 8: "t08",
           9: "t09", 10: "t10", 11: "t11", 12: "t12a", 13: "t13a", 14: "t14", 15: "t15",
           16: "t16", 17: "t17a", 18: "t18", 19: "t19", 20: "t20a"}
    rows = []
    k = 0

    def row(n, t, d, target, cls=""):
        nonlocal k
        top = top0 + k * rule
        k += 1
        dd = f'<i style="width:{d / 374 * 30:.1f}mm"></i><span>{fmt_dur(d)}</span>' if d else ""
        rows.append(
            f'<a href="#{target}"><div class="row {cls}" style="top:{top}mm"><span class="n">{n}</span>'
            f'<span class="t">{t}</span><span class="d">{dd}</span><span class="pg">{{{{P:{target}}}}}</span></div></a>')

    row("", "Пролог: Звонок", 0, "pro-call", "sec")
    row("", "Три Пабло · Which / One · Тертий", 0, "pablos-a", "sec")
    for tr in TRACKS:
        if tr["n"] in secs:
            r, name, tgt = secs[tr["n"]]
            row(r, name, 0, tgt, "sec")
        row(f'{tr["n"]:02d}', tr["t"].replace("Siiiiiiiiilver Surffffeeeeer Intermission", "Siiiiiiiiilver Surffffeeeeer"), tr["sec"], pid[tr["n"]])
    row("", "Эпилог: Телефон звонит", 0, "epi-a", "sec")
    xs = (
        '<div class="x" style="left:36mm;top:10mm"><s>SO HELP ME GOD</s></div>'
        '<div class="x" style="left:104mm;top:10mm"><s>SWISH</s></div>'
        '<div class="x" style="left:142mm;top:10mm"><s>WAVES</s></div>'
        '<div class="x" style="left:36mm;top:21mm;font-size:29pt;color:#b3261e">The Life of Pablo</div>'
        '<svg class="abs" style="left:34mm;top:34mm" width="120mm" height="6mm" viewBox="0 0 120 6">'
        '<path d="M2 3 C 30 1.2, 70 4.6, 118 2.2" stroke="#b3261e" stroke-width="1" fill="none"/>'
        '<path d="M6 5 C 40 3.6, 80 5.6, 110 4.4" stroke="#b3261e" stroke-width=".6" fill="none"/></svg>'
        '<div class="x" style="left:176mm;top:12mm;font-size:11pt;line-height:1.05;transform:rotate(-4deg)">ноябрь 2013 →<br>2015 →<br>26 января 2016 →<br>9 февраля 2016</div>'
        '<div class="x" style="left:36mm;top:43mm;font-size:11pt;opacity:.75">содержание · длительность · страница</div>'
    )
    body = ('<div class="lines"></div><div class="head"></div><div class="marg"></div><div class="marg2"></div>'
            + xs + "".join(rows)
            + '<div class="tot">≈ 66 минут · 20 треков · версия с Saint Pablo</div>')
    return page("contents", body, css=css)


# =================================================================== PROLOGUE 1: the call
def pro_call():
    css = """
#pro-call{background-color:#f4efe6}
#pro-call .top{position:absolute;left:0;right:0;top:0;height:112mm;background:#f28a55}
#pro-call .rings{position:absolute;left:0;top:0}
#pro-call .k{position:absolute;left:20mm;top:20mm}
#pro-call h1{position:absolute;left:19mm;top:27mm;margin:0;font:italic 300 76pt/.9 'Cormorant Garamond';letter-spacing:-.02em}
#pro-call .tl{position:absolute;left:20mm;top:80mm;width:210mm}
#pro-call .txt{position:absolute;left:20mm;top:124mm;width:210mm;height:100mm;font-size:12.6pt;line-height:1.44}
"""
    # concentric "ringing" arcs emanating from the end of a track timeline
    cx, cy = 196, 50
    arcs = []
    for i in range(9):
        r = 6 + i * 6.2
        op = max(0.12, 1 - i * 0.1)
        arcs.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#15110e" stroke-width="{0.9 - i * .06:.2f}" opacity="{op:.2f}"/>')
    rings = (f'<svg class="rings" width="250mm" height="112mm" viewBox="0 0 250 112">{"".join(arcs)}'
             f'<circle cx="{cx}" cy="{cy}" r="3.2" fill="#15110e"/></svg>')
    # schematic of 30 Hours: story -> outro -> call (not a measured waveform)
    tl = """
<svg width="210mm" height="26mm" viewBox="0 0 210 26">
  <line x1="0" y1="10" x2="210" y2="10" stroke="#15110e" stroke-width=".35"/>
  <rect x="0" y="7" width="118" height="6" fill="#15110e"/>
  <rect x="118" y="8.4" width="80" height="3.2" fill="none" stroke="#15110e" stroke-width=".5" stroke-dasharray="1.2 1"/>
  <circle cx="198" cy="10" r="2.6" fill="#f4efe6" stroke="#15110e" stroke-width=".7"/>
  <text x="0" y="20" font-family="Arimo" font-size="3" font-weight="700" letter-spacing=".5">30 HOURS · 5:23</text>
  <text x="0" y="24.2" font-family="Arimo" font-size="2.7">рассказ</text>
  <text x="118" y="20" font-family="Arimo" font-size="3" font-weight="700" letter-spacing=".5">АУТРО</text>
  <text x="118" y="24.2" font-family="Arimo" font-size="2.7">«бонус-трек», благодарности, адлибы</text>
  <text x="210" y="20" text-anchor="end" font-family="Arimo" font-size="3" font-weight="700" letter-spacing=".5">ЗВОНОК</text>
  <text x="210" y="4" text-anchor="end" font-family="Arimo" font-size="2.6" opacity=".8">схема, не хронометраж</text>
</svg>"""
    text = P(
        "Ближе к концу <i>30 Hours</i> у Канье Уэста звонит телефон. К этой минуте песня уже почти перестала быть песней: рассказ закончился, а бит всё вращается, как пластинка, которую забыли снять с проигрывателя. André 3000 повторяет короткий рефрен, Канье благодарит знакомых, примеряет отдельные фразы — и вдруг отвечает на звонок: записываю, мол, адлибы. Рабочая минута так и остаётся внутри готовой вещи, как отпечаток пальца на непросохшем лаке.",
        "В этом эпизоде спрятана одна из главных особенностей <i>The Life of Pablo</i>. Обычно альбом скрывает труд, сомнения и случайности, из которых он сделан. Слушателю выдают результат: автор закончил работу и отвечает теперь за каждую её секунду. На TLOP граница между работой и результатом всё время смещается. Исполнитель выходит из роли, произведение показывает собственные швы, жизнь вмешивается в запись — без стука.",
        "История релиза придала этому свойству буквальный смысл. Выйдя 14 февраля 2016 года, альбом продолжал меняться — как картина, которую художник тайком дописывает уже на стене музея. Перерабатывались миксы и аранжировки; из <i>Wolves</i> выделилась <i>Frank’s Track</i>; в июне появилась <i>Saint Pablo</i> и сдвинула смысл финала. Разбор ниже следует двадцатитрековой версии с этой заключительной песней.<sup class=\"fn\">1</sup>",
        first="dc")
    body = (
        '<div class="top tex" style="background-color:#f28a55"></div>' + rings
        + '<div class="k kicker">Пролог</div><h1>Звонок</h1>'
        + f'<div class="tl">{tl}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="Пролог")
    )
    return page("pro-call", body, cls="tex", css=css)


# =================================================================== PROLOGUE 2: the moving release
def pro_release():
    from datetime import date
    d0, d1 = date(2016, 2, 1), date(2016, 6, 30)
    span = (d1 - d0).days
    W = 210

    def x(ds):
        y, m, d = map(int, ds.split("-"))
        return (date(y, m, d) - d0).days / span * W

    months = [("ФЕВРАЛЬ", "2016-02-01"), ("МАРТ", "2016-03-01"), ("АПРЕЛЬ", "2016-04-01"), ("МАЙ", "2016-05-01"), ("ИЮНЬ", "2016-06-01")]
    AX = 40
    svg = ['<svg width="210mm" height="52mm" viewBox="0 0 210 52">']
    # month bands
    for i, (name, ds) in enumerate(months):
        xx = x(ds)
        nx = x(months[i + 1][1]) if i + 1 < len(months) else W
        if i % 2 == 0:
            svg.append(f'<rect x="{xx:.1f}" y="{AX - 30}" width="{nx - xx:.1f}" height="30" fill="#15110e" opacity=".045"/>')
        svg.append(f'<text x="{xx + 1.2:.1f}" y="{AX + 6.5}" font-family="Arimo" font-size="2.8" font-weight="700" letter-spacing=".8">{name}</text>')
    svg.append(f'<line x1="0" y1="{AX}" x2="210" y2="{AX}" stroke="#15110e" stroke-width=".6"/>')
    levels = []
    for i, (ds, _) in enumerate(RELEASE):
        xx = x(ds)
        lvl = 0
        while any(abs(xx - px) < 6.2 and pl == lvl for px, pl in levels):
            lvl += 1
        levels.append((xx, lvl))
        big = ds in ("2016-02-14", "2016-06-14")
        col = "#d9662c" if big else "#15110e"
        cy = AX - 7 - lvl * 6.6
        svg.append(f'<line x1="{xx:.1f}" y1="{AX}" x2="{xx:.1f}" y2="{cy + 2.4:.1f}" stroke="{col}" stroke-width=".3"/>')
        svg.append(f'<circle cx="{xx:.1f}" cy="{AX}" r="{1.9 if big else 1.2}" fill="{col}"/>')
        svg.append(f'<circle cx="{xx:.1f}" cy="{cy:.1f}" r="2.45" fill="{col}"/>')
        svg.append(f'<text x="{xx:.1f}" y="{cy + 1.05:.1f}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="2.9" fill="#f4efe6">{i + 1}</text>')
    gap0, gap1 = x("2016-04-02"), x("2016-06-14")
    svg.append(f'<path d="M{gap0 + 4:.1f} {AX + 14} L{gap1 - 4:.1f} {AX + 14}" stroke="#15110e" stroke-width=".3" stroke-dasharray="1 1"/>')
    svg.append(f'<text x="{(gap0 + gap1) / 2:.1f}" y="{AX + 12.6}" text-anchor="middle" font-family="EB Garamond" font-style="italic" font-size="3.6">73 дня тишины — и новая последняя песня</text>')
    svg.append("</svg>")
    labels = [
        ("11.02", "Премьера в Madison Square Garden, показ Yeezy Season 3"),
        ("14.02", "Выход на Tidal (и пару дней — продажа за $20)"),
        ("13.03", "Новая версия Famous"),
        ("16.03", "Переделана Wolves; Frank’s Track выделена отдельно"),
        ("30.03", "Крупное обновление: изменены минимум 12 треков"),
        ("01.04", "Spotify, Apple Music, Google Play"),
        ("02.04", "Поправлено аутро 30 Hours"),
        ("14.06", "Добавлена Saint Pablo с Самфой"),
    ]
    leg = "".join(
        f'<div class="ev{" hot" if d in ("14.02", "14.06") else ""}"><span class="no">{i + 1}</span><span class="d">{d}</span><span class="t">{typo(t, False)}</span></div>'
        for i, (d, t) in enumerate(labels))
    css = """
#pro-release .k{position:absolute;left:20mm;top:18mm}
#pro-release h2{position:absolute;left:19mm;top:23mm;width:170mm;margin:0;font:italic 300 34pt/1.02 'Cormorant Garamond';letter-spacing:-.01em}
#pro-release .chart{position:absolute;left:20mm;top:58mm}
#pro-release .leg{position:absolute;left:20mm;top:114mm;width:210mm;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,auto);grid-auto-flow:column;column-gap:8mm;row-gap:1.4mm}
#pro-release .ev{display:flex;gap:2.2mm;align-items:baseline;font:400 9.4pt/1.25 'EB Garamond';border-top:.25mm solid rgba(21,17,14,.35);padding-top:1.3mm}
#pro-release .ev .no{font:700 6.4pt/1 'Arimo';width:3.6mm;height:3.6mm;border-radius:50%;background:#15110e;color:#f4efe6;display:inline-flex;align-items:center;justify-content:center;flex:none;transform:translateY(-.4mm)}
#pro-release .ev .d{font:700 7pt/1 'Arimo';letter-spacing:.06em;width:10mm;flex:none}
#pro-release .ev.hot .no{background:#d9662c}
#pro-release .ev.hot .d{color:#d9662c}
#pro-release .cl{position:absolute;left:20mm;top:52mm;font:700 5.8pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#pro-release .src{position:absolute;right:20mm;top:52mm;font:400 5.8pt/1.3 'Arimo';opacity:.7}
#pro-release .txt{position:absolute;left:20mm;top:150mm;width:210mm;height:58mm;font-size:12pt;line-height:1.42}
#pro-release .names{position:absolute;left:20mm;top:212mm;width:210mm;border-top:.35mm solid #15110e;padding-top:2.4mm;display:flex;align-items:baseline;gap:3mm;flex-wrap:wrap;font:italic 400 10.5pt/1.3 'EB Garamond'}
#pro-release .names s{font:700 8pt/1 'Arimo';letter-spacing:.06em;text-decoration-thickness:.35mm}
#pro-release .names b{font:700 8pt/1 'Arimo';letter-spacing:.06em;color:#d9662c}
"""
    text = P(
        "Но незавершённость интересна здесь прежде всего как художественная задача. Лирический герой альбома хочет раз и навсегда определить, кто он такой: великий художник, верный муж, заботливый отец, свободный человек, предприниматель, верующий. Каждое определение оказывается тесным. Следующая песня приносит обстоятельство, признание или поступок — и предыдущая версия себя идёт трещинами.",
        "Так возникает автопортрет, единство которого держится на повторяющихся противоречиях. Канье заявляет о независимости — музыка окружает его чужими голосами. Обещает самоконтроль — его речь теряет равновесие. Требует доверия — и тут же вспоминает собственную невнимательность. Подходит к исповеди вплотную — и сворачивает к деньгам, сексу или одежде.",
    )
    body = (
        '<div class="k kicker">Пролог · 2</div>'
        + '<h2>' + typo("Картина, которую дописывают на стене музея", False) + '</h2>'
        + '<div class="cl">Альбом после выхода · хроника изменений, 2016</div>'
        + '<div class="src">данные: Wikipedia, «The Life of Pablo» — история релиза</div>'
        + f'<div class="chart">{"".join(svg)}</div>'
        + f'<div class="leg">{leg}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + '<div class="names"><span>' + typo("Имя меняют, когда меняется жизнь: Савл стал Павлом. Альбом за два с лишним года сменил четыре имени —", False) + '</span><span style="white-space:nowrap;display:flex;gap:3mm;align-items:baseline"><s>SO HELP ME GOD</s><span>→</span><s>SWISH</s><span>→</span><s>WAVES</s><span>→</span><b>THE LIFE OF PABLO</b></span></div>'
        + folio(right="Пролог")
    )
    return page("pro-release", body, cls="tex", css=css)


# =================================================================== PROLOGUE 3: portrait of contradictions
def cubist_face():
    return """
<svg width="104mm" height="132mm" viewBox="0 0 104 132">
  <defs>
    <pattern id="hatch" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="2.2" stroke="#15110e" stroke-width=".7"/></pattern>
    <pattern id="dots" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r=".55" fill="#15110e"/></pattern>
  </defs>
  <path d="M8 40 A44 44 0 0 1 96 34" fill="none" stroke="#c9a24a" stroke-width="1.6"/>
  <path d="M14 46 A38 38 0 0 1 90 40" fill="none" stroke="#c9a24a" stroke-width=".5"/>
  <polygon points="50,8 78,14 94,36 98,66 90,96 74,118 50,128 30,120 16,98 10,66 14,36 28,16" fill="#efe6d4" stroke="#15110e" stroke-width=".8"/>
  <polygon points="50,8 78,14 94,36 66,30 52,24" fill="#15110e"/>
  <polygon points="28,16 50,8 52,24 30,34 14,36" fill="url(#hatch)"/>
  <polygon points="52,24 66,30 94,36 98,66 90,96 74,118 52,128" fill="#f28a55"/>
  <polygon points="90,52 104,76 92,82" fill="#f28a55" stroke="#15110e" stroke-width=".8"/>
  <polyline points="90,52 104,76 92,82" fill="none" stroke="#15110e" stroke-width=".8"/>
  <polygon points="16,98 40,86 34,120" fill="#f2b49a"/>
  <polygon points="52,66 70,72 64,100 52,104" fill="url(#dots)" opacity=".65"/>
  <path d="M20 58 Q31 49 42 58 Q31 67 20 58 Z" fill="#fff" stroke="#15110e" stroke-width=".9"/>
  <circle cx="32" cy="58" r="3.1" fill="#15110e"/>
  <path d="M19 50 L43 47" stroke="#15110e" stroke-width="1.3"/>
  <path d="M70 56 L82 60 L70 64 Z" fill="#fff" stroke="#15110e" stroke-width=".8"/>
  <circle cx="74" cy="60" r="1.7" fill="#15110e"/>
  <path d="M30 101 Q40 106 50 101" fill="none" stroke="#15110e" stroke-width="1.2"/>
  <path d="M76 98 L90 96" stroke="#15110e" stroke-width="1.2"/>
  <line x1="51" y1="8" x2="52" y2="128" stroke="#15110e" stroke-width=".8" stroke-dasharray="2 1.4"/>
  <polygon points="40,126 62,126 60,132 42,132" fill="#15110e"/>
</svg>"""


def pro_portrait():
    css = """
#pro-portrait{background-color:#15110e;color:#f4efe6}
#pro-portrait .k{position:absolute;left:20mm;top:18mm;color:#f28a55}
#pro-portrait .face{position:absolute;left:24mm;top:52mm}
#pro-portrait .lab{position:absolute;font:700 6.2pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#f4efe6;white-space:nowrap}
#pro-portrait .lab i{display:block;font:italic 400 8.6pt/1.2 'Cormorant Garamond';letter-spacing:0;text-transform:none;opacity:.8;margin-top:.8mm}
#pro-portrait .thesis{position:absolute;left:142mm;top:22mm;width:88mm;font:italic 400 17.4pt/1.22 'Cormorant Garamond'}
#pro-portrait .thesis b{font-style:normal;font-weight:600;color:#f28a55}
#pro-portrait table{position:absolute;left:142mm;top:118mm;width:88mm;border-collapse:collapse}
#pro-portrait th{font:700 5.8pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;text-align:left;color:#f28a55;padding:0 0 2mm}
#pro-portrait td{font:400 9.6pt/1.25 'EB Garamond';padding:2.2mm 0;border-top:.25mm solid rgba(244,239,230,.35);vertical-align:top}
#pro-portrait td:first-child{width:42%;font-family:'Arimo';font-size:7.4pt;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding-right:3mm}
#pro-portrait td.arr{width:6mm;color:#f28a55;font-family:'Arimo'}
#pro-portrait .note{position:absolute;left:142mm;top:196mm;width:88mm;font:400 6.4pt/1.4 'Arimo';opacity:.65}
"""
    labs = [
        (8, 46, "художник", "смотрит анфас"),
        (133, 95, "предприниматель", "профиль на продажу"),
        (6, 156, "отец", "розовая щека"),
        (104, 165, "муж", "рот в профиль"),
        (110, 44, "верующий", "нимб не сходится"),
        (40, 184, "свободный человек", "тень под подбородком"),
    ]
    lab_html = "".join(
        f'<div class="lab" style="left:{x}mm;top:{y}mm">{a}<i>{b}</i></div>' for x, y, a, b in labs)
    rows = [
        ("независимость", "его окружают чужие голоса"),
        ("самоконтроль", "речь теряет равновесие"),
        ("доверие", "вспоминает собственную невнимательность"),
        ("исповедь", "сворачивает к деньгам, сексу, одежде"),
    ]
    tbl = '<table><tr><th>Заявляет</th><th></th><th>На деле</th></tr>' + "".join(
        f'<tr><td>{a}</td><td class="arr">→</td><td>{typo(b)}</td></tr>' for a, b in rows) + "</table>"
    thesis = typo("<b>Главный конфликт TLOP</b> проходит между желанием безраздельно владеть собственной жизнью — и необходимостью признать, что ты зависишь от других. Он разворачивается одновременно в словах и в самом устройстве музыки.", False)
    body = (
        '<div class="k kicker">Пролог · 3 — портрет из противоречий</div>'
        + f'<div class="face">{cubist_face()}</div>' + lab_html
        + f'<div class="thesis">{thesis}</div>' + tbl
        + '<div class="note">' + typo("Лицо разобрано на плоскости, как у кубистов: шесть ролей, которые герой примеряет на себя, не складываются в одно изображение. Иллюстрация — прочтение, не портрет.") + '</div>'
        + folio(right="Пролог", color="#f4efe6")
    )
    return page("pro-portrait", body, css=css)


# =================================================================== THREE PABLOS (A): text + triptych
def pablos_a():
    css = """
#pablos-a .k{position:absolute;left:20mm;top:18mm}
#pablos-a h2{position:absolute;left:18mm;top:22mm;margin:0;font:400 62pt/.9 'Monomakh';letter-spacing:-.005em}
#pablos-a .epi{position:absolute;left:150mm;top:25mm;width:80mm;font-size:12.4pt;line-height:1.25}
#pablos-a .txt{position:absolute;left:20mm;top:56mm;width:210mm;height:58mm;font-size:11.8pt}
#pablos-a .tri{position:absolute;left:20mm;top:118mm;width:210mm;height:108mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm}
#pablos-a .col{border-top:1.2mm solid #15110e;padding-top:3mm;position:relative;overflow:hidden}
#pablos-a .col .nm{font:700 14pt/1 'Arimo';letter-spacing:.08em;text-transform:uppercase;margin:2mm 0 1mm}
#pablos-a .col .dt{font:700 5.8pt/1.3 'Arimo';letter-spacing:.18em;text-transform:uppercase;opacity:.7}
#pablos-a .col .w{font:italic 400 17pt/1 'Cormorant Garamond';color:#d9662c;margin:2.4mm 0 2.4mm}
#pablos-a .col p{font:400 9.5pt/1.4 'EB Garamond';margin:0 0 2.2mm;text-align:left;hyphens:manual;position:relative;z-index:1}
#pablos-a .col .in{font:400 8.6pt/1.38 'EB Garamond';border-top:.25mm solid #15110e;padding-top:1.8mm;margin-top:1mm}
#pablos-a .col .in b{font:700 5.6pt/1 'Arimo';letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:1mm}
#pablos-a .col .ico{position:absolute;right:0;top:3mm}
#pablos-a .col .wm{position:absolute;right:-6mm;bottom:-8mm;opacity:.07}
"""
    text = P(
        "Название предлагает этому конфликту трёх свидетелей. Канье объяснял своего Pablo через апостола Павла, Пабло Пикассо и Пабло Эскобара: послание, искусство, распространение продукта.<sup class=\"fn\">2</sup> Самоопределение почти неприличной амбициозности: в одном имени должны ужиться духовный авторитет, художественная революция и коммерческая власть.",
        "Но альбом заставляет услышать и то, как плохо эти притязания уживаются друг с другом. Деньги дают влияние, однако не покупают доверия. Художественная исключительность позволяет ломать правила формы, однако не освобождает от ответственности перед близкими. Публичное обращение к Богу может быть искренним — и одновременно работать на строительство собственного величественного образа.",
    )
    cols = [
        ("Павел", "Савл из Тарса · ок. 5 — ок. 65", "послание", icon_paul,
         "Гонитель, ослеплённый светом на дороге в Дамаск, — и автор посланий, которые читают уже две тысячи лет. Сменил имя, когда сменилась жизнь. Признавался: «не то делаю, что хочу, а что ненавижу, то делаю» (Рим. 7:15).",
         "На иконах — меч и книга.",
         "молитва и хор, вера как усилие, <i>Saint Pablo</i>"),
        ("Пикассо", "Малага · 1881 — 1973", "искусство", icon_picasso,
         "Разобрал лицо на плоскости и показал его сразу с нескольких сторон. В 1912 году вклеил в натюрморт кусок клеёнки — и чужой готовый материал стал языком живописи. Писал себя всю жизнь, от «голубого периода» до последних лет.",
         "Метод — кубизм и коллаж.",
         "коллаж сэмплов, лицо из плоскостей, вычитание в <i>Wolves</i>"),
        ("Эскобар", "Медельин · 1949 — 1993", "продукт", icon_escobar,
         "Глава Медельинского картеля; империя на кокаине, подкупе и терроре. Логистика, превращённая во власть. Бегемоты, которых он завёз в своё поместье, пережили хозяина и расплодились на воле — наследство, которое больше никому не подчиняется.",
         "Формула — <i>plata o plomo</i>: «серебро или свинец».",
         "бренды и долги, <i>I feel like Pablo</i>, власть денег"),
    ]
    tri = "".join(
        f'<div class="col">{ic("#15110e", 9)}<div class="wm">{ic("#15110e", 60)}</div><div class="dt">{dt}</div><div class="nm">{nm}</div><div class="w">{w}</div>'
        f'<p>{typo(tx)}</p><p>{typo(attr)}</p><div class="in"><b>в альбоме</b>{typo(inn)}</div></div>'
        for nm, dt, w, ic, tx, attr, inn in cols)
    body = (
        '<div class="k kicker">The Life of Pablo — имя</div>'
        + '<h2>Три Пабло</h2>'
        + '<div class="epi">' + typo("«…для всех я сделался всем, чтобы спасти по крайней мере некоторых».", False)
        + '<span class="src">1 Кор. 9:22</span></div>'
        + f'<div class="txt prose cols">{text}</div>'
        + f'<div class="tri">{tri}</div>'
        + folio(right="Три Пабло")
    )
    return page("pablos-a", body, cls="tex", css=css)


# =================================================================== THREE PABLOS (B): Venn + lifespans
def pablos_b():
    # Venn: Paul top-left, Picasso top-right, Escobar bottom
    R = 37
    C = {"P": (78, 62), "Pi": (126, 62), "E": (102, 103)}
    regions = {
        "P": [1, 6], "Pi": [9, 10, 16], "E": [7, 8, 18],
        "P-Pi": [2, 13, 14, 19], "Pi-E": [3, 4, 5, 17], "P-E": [11, 12], "all": [20], "none": [15],
    }
    anchors = {
        "P": (60, 56), "Pi": (144, 56), "E": (102, 124),
        "P-Pi": (102, 45), "Pi-E": (125, 95), "P-E": (79, 95), "all": (102, 77), "none": (186, 124),
    }
    names = {t["n"]: t["t"] for t in TRACKS}
    short = {1: "Ultralight Beam", 2: "Pt. 1", 3: "Pt. 2", 4: "Famous", 5: "Feedback", 6: "Low Lights",
             7: "Highlights", 8: "Freestyle 4", 9: "I Love Kanye", 10: "Waves", 11: "FML", 12: "Real Friends",
             13: "Wolves", 14: "Frank’s Track", 15: "Silver Surfer", 16: "30 Hours", 17: "No More Parties", 18: "Facts",
             19: "Fade", 20: "Saint Pablo"}
    del names
    s = ['<svg width="210mm" height="150mm" viewBox="0 0 210 150">']
    fills = {"P": "#c9a24a", "Pi": "#f28a55", "E": "#15110e"}
    for k, (cx, cy) in C.items():
        s.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{fills[k]}" fill-opacity=".16" stroke="{fills[k]}" stroke-width=".6"/>')
    s.append(f'<text x="{C["P"][0] - R - 2}" y="{C["P"][1] - R + 4}" text-anchor="end" font-family="Arimo" font-weight="700" font-size="4" letter-spacing="1">ПАВЕЛ</text>')
    s.append(f'<text x="{C["P"][0] - R - 2}" y="{C["P"][1] - R + 9}" text-anchor="end" font-family="EB Garamond" font-style="italic" font-size="4.4">послание</text>')
    s.append(f'<text x="{C["Pi"][0] + R + 2}" y="{C["Pi"][1] - R + 4}" font-family="Arimo" font-weight="700" font-size="4" letter-spacing="1">ПИКАССО</text>')
    s.append(f'<text x="{C["Pi"][0] + R + 2}" y="{C["Pi"][1] - R + 9}" font-family="EB Garamond" font-style="italic" font-size="4.4">искусство</text>')
    s.append(f'<text x="{C["E"][0] - R - 4}" y="{C["E"][1] + R - 6}" text-anchor="end" font-family="Arimo" font-weight="700" font-size="4" letter-spacing="1">ЭСКОБАР</text>')
    s.append(f'<text x="{C["E"][0] - R - 4}" y="{C["E"][1] + R - 1}" text-anchor="end" font-family="EB Garamond" font-style="italic" font-size="4.4">продукт</text>')
    for reg, nums in regions.items():
        ax, ay = anchors[reg]
        for i, n in enumerate(nums):
            yy = ay + (i - (len(nums) - 1) / 2) * 6.3
            big = n == 20
            fill = "#d9662c" if big else "#15110e"
            s.append(f'<text x="{ax}" y="{yy:.1f}" text-anchor="middle" font-family="EB Garamond" font-style="italic" font-size="{4.8 if big else 3.9}" fill="{fill}">'
                     f'<tspan font-family="Arimo" font-style="normal" font-weight="700" font-size="2.7" dy="-0.2">{n:02d} </tspan>{short[n]}</text>')
    s.append('<text x="186" y="131" text-anchor="middle" font-family="Arimo" font-size="2.6" opacity=".75">ни одного Пабло:</text>')
    s.append('<text x="186" y="134.4" text-anchor="middle" font-family="Arimo" font-size="2.6" opacity=".75">территория Max B</text>')
    s.append("</svg>")
    venn = "".join(s)

    # lifespans with a broken axis
    def xa(y):  # 0..100 AD -> 0..34 mm
        return y / 100 * 34

    def xb(y):  # 1870..2020 -> 44..210
        return 44 + (y - 1870) / 150 * 166
    t = ['<svg width="210mm" height="40mm" viewBox="0 0 210 40">']
    t.append('<line x1="0" y1="30" x2="34" y2="30" stroke="#15110e" stroke-width=".4"/>')
    t.append('<line x1="44" y1="30" x2="210" y2="30" stroke="#15110e" stroke-width=".4"/>')
    t.append('<path d="M35.5 27 l2 6 M39 27 l2 6" stroke="#15110e" stroke-width=".4"/>')
    t.append('<text x="39.5" y="38" text-anchor="middle" font-family="Arimo" font-size="2.5" opacity=".7">≈1800 лет</text>')
    for yv in (0, 50, 100):
        t.append(f'<text x="{xa(yv):.1f}" y="35" text-anchor="middle" font-family="Arimo" font-size="2.6">{yv if yv else "0"}</text>')
    for yv in (1880, 1920, 1960, 2000, 2020):
        t.append(f'<text x="{xb(yv):.1f}" y="35" text-anchor="middle" font-family="Arimo" font-size="2.6">{yv}</text>')
    bars = [("Павел", xa(5), xa(65), 6, "#c9a24a", "ок. 5 — ок. 65"),
            ("Пикассо", xb(1881), xb(1973), 6, "#f28a55", "1881 — 1973"),
            ("Эскобар", xb(1949), xb(1993), 13, "#15110e", "1949 — 1993"),
            ("Канье Уэст", xb(1977), xb(2020), 20, "#7a6f66", "род. 1977")]
    for nm, a, b, y, col, lab in bars:
        t.append(f'<rect x="{a:.1f}" y="{y}" width="{b - a:.1f}" height="3.4" fill="{col}"/>')
        t.append(f'<text x="{a:.1f}" y="{y - 1.2}" font-family="Arimo" font-weight="700" font-size="2.9">{nm} <tspan font-weight="400" opacity=".75">{lab}</tspan></text>')
    t.append('<path d="M{0:.1f} 20 l0 0" />'.format(xb(2020)))
    xt = xb(2016)
    t.append(f'<line x1="{xt:.1f}" y1="2" x2="{xt:.1f}" y2="30" stroke="#d9662c" stroke-width=".5" stroke-dasharray="1 .8"/>')
    t.append(f'<text x="{xt - 1:.1f}" y="2.4" text-anchor="end" font-family="Arimo" font-weight="700" font-size="2.7" fill="#d9662c">TLOP · 2016</text>')
    t.append("</svg>")
    life = "".join(t)
    css = """
#pablos-b .k{position:absolute;left:20mm;top:18mm}
#pablos-b .venn{position:absolute;left:20mm;top:36mm}
#pablos-b .mark{position:absolute;right:20mm;top:17mm;font:700 5.8pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #15110e;padding:.9mm 1.6mm}
#pablos-b .life{position:absolute;left:20mm;top:195mm}
#pablos-b .lk{position:absolute;left:20mm;top:190mm;border-top:.35mm solid #15110e;padding-top:2mm;width:210mm}
#pablos-b .vnote{position:absolute;left:20mm;top:26mm;width:72mm;font:italic 400 10pt/1.3 'Cormorant Garamond'}
"""
    body = (
        '<div class="k kicker">Двадцать треков в трёх кругах</div><div class="mark">прочтение</div>'
        + '<div class="vnote">' + typo("Трек попадает в круг, если его «индекс Пабло» по этой оси — два или три. В центре — единственная песня, которая носит имя самого Пабло.", False) + '</div>'
        + f'<div class="venn">{venn}</div>'
        + '<div class="lk kicker">Три жизни и один альбом</div>'
        + f'<div class="life">{life}</div>'
        + folio(right="Три Пабло")
    )
    return page("pablos-b", body, cls="tex", css=css)


# =================================================================== COVER ANATOMY
def cover_anatomy():
    css = """
#cover-anat{background-color:#f28a55}
#cover-anat .k{position:absolute;left:20mm;top:18mm}
#cover-anat h2{position:absolute;left:19mm;top:22mm;margin:0;font:700 50pt/1 'Arimo';letter-spacing:-.02em}
#cover-anat .wire{position:absolute;left:20mm;top:50mm}
#cover-anat .leg{position:absolute;left:20mm;top:190mm;width:120mm;display:grid;grid-template-columns:1fr 1fr;gap:2mm 6mm}
#cover-anat .leg div{display:flex;gap:2mm;font:400 8.6pt/1.25 'EB Garamond'}
#cover-anat .leg b{flex:none;width:4mm;height:4mm;border-radius:50%;background:#15110e;color:#f28a55;font:700 6pt/4mm 'Arimo';text-align:center}
#cover-anat .txt{position:absolute;left:150mm;top:50mm;width:80mm;height:110mm;font-size:12pt;line-height:1.45}
#cover-anat .facts{position:absolute;left:150mm;top:166mm;width:80mm;font:400 7.2pt/1.45 'Arimo'}
#cover-anat .facts b{font-weight:700}
#cover-anat .facts div{border-top:.3mm solid #15110e;padding:1.6mm 0}
#cover-anat .note{position:absolute;left:20mm;top:183mm;font:700 5.6pt/1 'Arimo';letter-spacing:.2em;text-transform:uppercase}
"""
    S = 1.0
    w = [f'<svg width="{120 * S:.0f}mm" height="{120 * S:.0f}mm" viewBox="0 0 120 120">',
         '<rect x="0" y="0" width="120" height="120" fill="#f28a55" stroke="#15110e" stroke-width=".7"/>']
    offs = [66, 58, 61, 55, 63, 57]
    for i in range(6):
        y = 7 + i * 9.6
        w.append(f'<rect x="12" y="{y}" width="38" height="5.6" fill="#15110e"/>')
        w.append(f'<rect x="{offs[i]}" y="{y}" width="27" height="5.6" fill="#15110e"/>')
    w.append('<rect x="12" y="69" width="38" height="5.6" fill="#15110e"/><rect x="60" y="69" width="27" height="5.6" fill="#15110e"/>')
    w.append('<rect x="17" y="33" width="50" height="33" fill="#f2b49a" stroke="#15110e" stroke-width=".6"/>')
    w.append('<path d="M17 33 L67 66 M67 33 L17 66" stroke="#15110e" stroke-width=".3" opacity=".55"/>')
    for i in range(10):
        y = 79 + i * 3.8
        w.append(f'<rect x="10" y="{y}" width="24" height="2.1" fill="#15110e"/>')
        w.append(f'<rect x="78" y="{y}" width="24" height="2.1" fill="#15110e"/>')
    w.append('<rect x="52" y="86" width="42" height="27" fill="#efe6d4" stroke="#15110e" stroke-width=".6"/>')
    w.append('<path d="M52 86 L94 113 M94 86 L52 113" stroke="#15110e" stroke-width=".3" opacity=".55"/>')
    marks = [(1, 102, 12), (2, 44, 72), (3, 28, 49), (4, 85, 99), (5, 22, 84)]
    for n, mx, my in marks:
        w.append(f'<circle cx="{mx}" cy="{my}" r="3.3" fill="#15110e" stroke="#f28a55" stroke-width=".6"/>')
        w.append(f'<text x="{mx}" y="{my + 1.25}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="3.4" fill="#f28a55">{n}</text>')
    w.append("</svg>")
    legend = [
        "Название ×7 — и ни разу одинаково: PABLO каждый раз встаёт на новое место.",
        "Седьмая строка отделена от шести: повтор не складывается в ровный столбец.",
        "Семейный, свадебный снимок — образ рода и верности.",
        "Второй снимок — тело модели: желание рядом с семьёй.",
        "WHICH / ONE ×20 — «который из»: выбор так и не сделан.",
    ]
    leg = "".join(f'<div><b>{i + 1}</b><span>{typo(t, False)}</span></div>' for i, t in enumerate(legend))
    text = P(
        "Повторяющаяся надпись на оранжевой обложке Петера де Поттера хорошо передаёт невозможность закрепить идентичность. Название возникает снова и снова — будто автор продолжает его утверждать, так и не добираясь до окончательной уверенности.",
        "Семейный образ соседствует с сексуализированным; надпись <i>Which / One</i> оставляет выбор открытым. Такое прочтение обложки совпадает с музыкальной формой альбома: элементы сохраняют отдельность, даже собранные в одну композицию.<sup class=\"fn\">3</sup>",
    )
    facts = (
        f'<div><b>11 февраля 2016</b> — {typo("обложку показали в день премьеры; автор — бельгийский художник Петер де Поттер.")}</div>'
        f'<div><b>Шрифт</b> — {typo("гротеск в духе Arial/Helvetica; фон — оранжевый, около #F28A55.")}</div>'
        f'<div><b>Готика мерча</b> — {typo("надписи I Feel Like Pablo нарисовал Кали Торнхилл ДеВитт: блэклеттер на футболках стал вторым лицом альбома.")}</div>'
        f'<div><b>Цензурная версия</b> — {typo("без второго снимка и без Which / One: только повторяющееся название.")}</div>'
    )
    body = (
        '<div class="k kicker">Обложка</div><h2>WHICH / ONE</h2>'
        + f'<div class="wire">{"".join(w)}</div>'
        + '<div class="note">Схема композиции · снимки не воспроизводятся</div>'
        + f'<div class="leg">{leg}</div>'
        + f'<div class="txt prose" style="--fn:#15110e">{text}</div>'
        + f'<div class="facts">{facts}</div>'
        + folio(right="Обложка")
    )
    return page("cover-anat", body, cls="tex", css=css)


# =================================================================== COLLECTIVE AUTHORSHIP
def authorship():
    css = """
#authorship .k{position:absolute;left:20mm;top:18mm}
#authorship h2{position:absolute;left:19mm;top:23mm;width:150mm;margin:0;font:italic 300 31pt/1.02 'Cormorant Garamond'}
#authorship .txt{position:absolute;left:20mm;top:54mm;width:146mm;height:100mm;font-size:11pt}
#authorship .side{position:absolute;left:174mm;top:54mm;width:56mm}
#authorship .side .box{background:#15110e;color:#f4efe6;padding:4.4mm 4.4mm 4mm}
#authorship .side .box .q{font:italic 400 12.4pt/1.22 'Cormorant Garamond'}
#authorship .side .box .src{display:block;font:700 5.6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-top:2.4mm;color:#f28a55}
#authorship .side p{font:400 8.4pt/1.4 'EB Garamond';margin:3mm 0 0;hyphens:manual}
#authorship .bot{position:absolute;left:20mm;top:160mm;width:210mm;height:66mm;border-top:.35mm solid #15110e;padding-top:3.5mm}
#authorship .bot .kk{font:700 5.8pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-bottom:2mm}
"""
    text = P(
        "У TLOP есть и существенное противоречие авторства. Альбом без конца говорит об исключительности одного человека, но его эмоциональный мир соткан коллективно. Хор, продюсеры, приглашённые певцы, архивные записи и короткие голосовые фрагменты обладают собственной выразительной силой.",
        "Fonzworth Bentley, участвовавший в создании <i>Ultralight Beam</i>, особенно выделял способность Канье редактировать: услышать сильную идею, без сожаления отказаться от уже сделанного и собрать материал заново. Havoc описывал работу над <i>Famous</i> похоже: его первоначальная основа превратилась в куда более сложный коллаж, окончательный вид которого он услышал уже потом.<sup class=\"fn\">4</sup>",
        "Поэтому музыкальное авторство Канье здесь стоит искать в выборе, столкновении и расположении элементов. Он создаёт условия, в которых чужие голоса начинают говорить о нём больше, чем способен сообщить его собственный куплет.",
    )
    side = (
        '<div class="box"><div class="q">' + typo("«Приветствую вас в Господе и я, Тертий, писавший сие послание».", False)
        + '</div><span class="src">Послание к Римлянам, 16:22</span></div>'
        + "<p>" + typo("Писец, записывавший за Павлом, оставил в каноническом тексте собственную строчку. Две тысячи лет спустя в альбоме, названном именем Павла, так же говорят продюсеры, хористы и архивные голоса.") + "</p>"
        + "<p>" + typo("А в мае 1912 года Пикассо вклеил в натюрморт кусок клеёнки с узором плетёного стула — и готовый чужой материал вошёл в живопись. Сэмпл — его музыкальный родственник.") + "</p>"
    )
    # voices strip: for each track, black dot = Kanye's voice, orange = credited voices, ring = sampled recordings
    s = ['<svg width="210mm" height="56mm" viewBox="0 0 210 56">']
    cw = 210 / 20
    for i, tr in enumerate(TRACKS):
        x = i * cw + cw / 2
        y = 46
        items = []
        if tr["kanye"]:
            items.append(("k", ""))
        for f in tr["feat"]:
            items.append(("f", f))
        for sm in tr["samples"]:
            items.append(("s", sm[0]))
        base = 0 if tr["kanye"] else 1
        for j, (kind, _) in enumerate(items):
            yy = y - (j + base) * 4.3
            if kind == "k":
                s.append(f'<circle cx="{x:.1f}" cy="{yy:.1f}" r="1.75" fill="#15110e"/>')
            elif kind == "f":
                s.append(f'<circle cx="{x:.1f}" cy="{yy:.1f}" r="1.75" fill="#f28a55"/>')
            else:
                s.append(f'<circle cx="{x:.1f}" cy="{yy:.1f}" r="1.45" fill="none" stroke="#15110e" stroke-width=".5"/>')
        if not tr["kanye"]:
            s.append(f'<circle cx="{x:.1f}" cy="{y + 0:.1f}" r="1.75" fill="none" stroke="#15110e" stroke-width=".35" stroke-dasharray=".6 .5"/>')
        s.append(f'<text x="{x:.1f}" y="53" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="2.6">{tr["n"]:02d}</text>')
    s.append('<circle cx="120" cy="2" r="1.6" fill="#15110e"/><text x="123" y="3" font-family="Arimo" font-size="2.7">голос Канье</text>')
    s.append('<circle cx="146" cy="2" r="1.6" fill="#f28a55"/><text x="149" y="3" font-family="Arimo" font-size="2.7">гости по титрам</text>')
    s.append('<circle cx="176" cy="2" r="1.3" fill="none" stroke="#15110e" stroke-width=".5"/><text x="179" y="3" font-family="Arimo" font-size="2.7">чужие записи</text>')
    s.append('<circle cx="120" cy="7.5" r="1.6" fill="none" stroke="#15110e" stroke-width=".35" stroke-dasharray=".6 .5"/><text x="123" y="8.5" font-family="Arimo" font-size="2.7">Канье молчит: 06 · 14 · 15</text>')
    s.append("</svg>")
    bot = ('<div class="kk">Кто звучит в альбоме, названном именем одного человека · по титрам (Wikipedia)</div>'
           + "".join(s))
    body = (
        '<div class="k kicker">Авторство</div>'
        + '<h2>' + typo("Тертий, писавший сие послание", False) + '</h2>'
        + f'<div class="txt prose cols">{text}</div>'
        + f'<div class="side">{side}</div>'
        + f'<div class="bot">{bot}</div>'
        + folio(right="Авторство")
    )
    return page("authorship", body, cls="tex", css=css)


def pages():
    return [cover(), inside(), contents(), pro_call(), pro_release(), pro_portrait(),
            pablos_a(), pablos_b(), cover_anatomy(), authorship()]
