"""Part I — «Хор и сигнал»: Ultralight Beam, Pt. 1, Pt. 2, Famous, Feedback."""
import math
import random

from data import TRACKS
from lib import P, esc, folio, page, track_meta, typo, fmt_dur

T = {t["n"]: t for t in TRACKS}


# =================================================================== PART I OPENER
def part1():
    # choir dots that straighten into a waveform, then into a hard feedback square wave
    rnd = random.Random(7)
    g = []
    W, H = 250, 70
    for col in range(64):
        x = 6 + col * 3.75
        t = col / 63
        for row in range(5):
            if t < 0.38:   # choir: loose rows of heads
                y = 14 + row * 10 + rnd.uniform(-2.2, 2.2) * (1 - t * 2)
                r = 1.55
            elif t < 0.72:  # voices align into a sine
                k = (t - 0.38) / 0.34
                base = 14 + row * 10
                y = base * (1 - k) + (35 + 22 * math.sin(col * 0.55)) * k
                r = 1.55 - k * 0.6
            else:           # clipped signal: drawn below as one hard line
                continue
            g.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="#15110e"/>')
    # the hard, clipped "feedback" square wave
    xs = 6 + 46 * 3.75
    sq = [f"M{xs:.1f},35"]
    x = xs
    hi = True
    while x < 244:
        y = 11 if hi else 59
        sq.append(f"L{x:.1f},{y} L{min(x + 5.6, 244):.1f},{y}")
        x += 5.6
        hi = not hi
    g.append(f'<path d="{" ".join(sq)}" fill="none" stroke="#15110e" stroke-width="1.6" stroke-linejoin="miter"/>')
    g.append('<text x="6" y="68" font-family="Arimo" font-weight="700" font-size="2.6" letter-spacing=".8">ХОР</text>')
    g.append('<text x="110" y="68" font-family="Arimo" font-weight="700" font-size="2.6" letter-spacing=".8">ГОЛОСА ВЫСТРАИВАЮТСЯ</text>')
    g.append('<text x="244" y="68" text-anchor="end" font-family="Arimo" font-weight="700" font-size="2.6" letter-spacing=".8">СИГНАЛ</text>')
    graphic = f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">{"".join(g)}</svg>'
    lst = "".join(
        f'<div class="it"><span>{n:02d}</span><b>{esc(T[n]["t"])}</b><em>{fmt_dur(T[n]["sec"])}</em></div>'
        for n in range(1, 6))
    css = """
#part1{background-color:#f28a55;color:#15110e}
#part1 .k{position:absolute;left:20mm;top:18mm}
#part1 .num{position:absolute;left:16mm;top:20mm;font:900 150pt/1 'Playfair';letter-spacing:-.02em}
#part1 h2{position:absolute;left:96mm;top:34mm;margin:0;font:italic 300 46pt/.98 'Cormorant Garamond'}
#part1 .lead{position:absolute;left:97mm;top:84mm;width:120mm;font:italic 400 13.5pt/1.3 'EB Garamond'}
#part1 .g{position:absolute;left:0;top:104mm}
#part1 .list{position:absolute;left:20mm;top:184mm;width:110mm}
#part1 .it{display:flex;gap:3mm;align-items:baseline;border-top:.3mm solid #15110e;padding:1.5mm 0;font:400 8pt/1.2 'Arimo'}
#part1 .it span{font-weight:700;width:6mm}
#part1 .it b{flex:1;font-weight:700}
#part1 .it em{font-style:normal}
#part1 .epi{position:absolute;left:146mm;top:184mm;width:84mm;font-size:12.6pt;line-height:1.24}
"""
    body = (
        '<div class="k kicker">Часть первая</div>'
        + '<div class="num">I</div>'
        + '<h2>Хор<br>и сигнал</h2>'
        + '<div class="lead">' + typo("От общей молитвы, в которой хватает места всем, — к сигналу, который слышит только себя.", False) + '</div>'
        + f'<div class="g">{graphic}</div>'
        + f'<div class="list">{lst}</div>'
        + '<div class="epi">' + typo("«Когда же он шёл и приближался к Дамаску, внезапно осиял его свет с неба».", False)
        + '<span class="src">Деяния апостолов, 9:3</span></div>'
        + folio(right="Часть I", color="#15110e")
    )
    return page("part1", body, cls="tex", css=css)


# =================================================================== 01 ULTRALIGHT BEAM (a)
def t01a():
    tr = T[1]
    # light falls diagonally from the upper right, like Caravaggio's
    top_l, top_r = 196, 236
    bot_l, bot_r = 44, 168

    def inside(x, y):
        k = y / 250
        lx = top_l + (bot_l - top_l) * k
        rx = top_r + (bot_r - top_r) * k
        return lx <= x <= rx, (x - lx) / max(rx - lx, 1)

    rnd = random.Random(3)
    heads = []
    tiers = [(170, 3.0, 20), (182, 3.3, 18), (195, 3.6, 16), (209, 3.9, 15), (224, 4.3, 13)]
    for ty, r, n in tiers:
        span = n * r * 2.9
        x0 = 125 - span / 2
        for i in range(n):
            x = x0 + i * r * 2.9 + rnd.uniform(-.6, .6) + (r if (ty // 10) % 2 else 0)
            y = ty + rnd.uniform(-1, 1)
            lit, pos = inside(x, y)
            if lit:
                c = "#fff3d2"
                op = 0.95
            else:
                c = "#3a322c"
                op = 1
            heads.append(f'<g opacity="{op}"><circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{c}"/>'
                         f'<path d="M{x - r * 1.45:.1f} {y + r * 2.6:.1f} Q{x:.1f} {y + r * .65:.1f} {x + r * 1.45:.1f} {y + r * 2.6:.1f} Z" fill="{c}"/></g>')
    rays = "".join(
        f'<line x1="{top_l + (top_r - top_l) * f:.1f}" y1="0" x2="{bot_l + (bot_r - bot_l) * f:.1f}" y2="250" stroke="#fff6dc" stroke-width=".25" opacity="{0.25 + 0.2 * math.sin(f * 9):.2f}"/>'
        for f in [i / 14 for i in range(15)])
    svg = f"""
<svg class="abs" style="left:0;top:0" width="250mm" height="250mm" viewBox="0 0 250 250">
  <defs>
    <linearGradient id="ubg" x1="1" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#fffaf0" stop-opacity=".96"/>
      <stop offset=".45" stop-color="#ffe9b8" stop-opacity=".55"/>
      <stop offset="1" stop-color="#e8c47a" stop-opacity=".16"/>
    </linearGradient>
    <radialGradient id="ubglow" cx="0.86" cy="0" r="0.6">
      <stop offset="0" stop-color="#fff7e2" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff7e2" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="250" height="250" fill="url(#ubglow)"/>
  <polygon points="{top_l},0 {top_r},0 {bot_r},250 {bot_l},250" fill="url(#ubg)"/>
  {rays}
  {''.join(heads)}
</svg>"""
    css = """
#t01a{background:#0f0c0a;color:#f4efe6}
#t01a .k{position:absolute;left:20mm;top:18mm;color:#c9a24a}
#t01a h1{position:absolute;left:18mm;top:24mm;margin:0;font:400 58pt/.92 'UnifrakturCook';color:#f4efe6}
#t01a .sub{position:absolute;left:20mm;top:76mm;width:110mm;font:italic 300 18pt/1.2 'Cormorant Garamond';color:#e8c47a}
#t01a .meta{position:absolute;left:20mm;top:96mm;width:84mm}
#t01a .lead{position:absolute;left:20mm;top:132mm;width:92mm;font:italic 400 13.2pt/1.38 'EB Garamond';color:#efe6d4;text-align:left}
"""
    lead = typo("<i>Ultralight Beam</i> открывает альбом коллективным обращением. Детская молитва, протяжённые аккорды, отдельные вокальные линии и хор понемногу выстраивают пространство, в котором можно почувствовать себя принятым — как в церкви, где на входе ни о чём не спрашивают.", True)
    body = (
        svg
        + '<div class="k kicker">01 / 20 · Часть I</div>'
        + '<h1>Ultralight<br>Beam</h1>'
        + '<div class="sub">' + typo("Луч, в котором хватает места всем", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#c9a24a", dim="rgba(201,162,74,.25)")}</div>'
        + f'<div class="lead">{lead}</div>'
        + folio(right="Ultralight Beam", color="#c9a24a")
    )
    return page("t01a", body, css=css)


# =================================================================== 01 ULTRALIGHT BEAM (b)
def t01b():
    secs = [
        ("интро", ["Натали и Самория Грин"], 2),
        ("припев", ["Канье"], 3),
        ("куплет", ["Канье"], 3),
        ("припев", ["Канье", "хор"], 4),
        ("рефрен", ["The-Dream", "хор"], 5),
        ("куплет", ["Келли Прайс", "хор"], 6),
        ("куплет", ["Chance the Rapper"], 7),
        ("припев", ["Канье"], 7),
        ("рефрен", ["The-Dream", "Натали", "хор"], 7),
        ("аутро", ["Кирк Франклин", "хор"], 8),
    ]
    new = {0: "Натали и Самория Грин", 1: "Канье", 3: "хор", 4: "The-Dream", 5: "Келли Прайс", 6: "Chance the Rapper", 9: "Кирк Франклин"}
    W, H = 150, 66
    cw = W / len(secs)
    mid = 33
    unit = 3.1
    s = [f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">',
         '<defs><linearGradient id="bm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8c47a" stop-opacity=".35"/><stop offset="1" stop-color="#c9a24a" stop-opacity=".95"/></linearGradient></defs>']
    pts_top, pts_bot = [], []
    for i, (_, _, cum) in enumerate(secs):
        x0, x1 = i * cw, (i + 1) * cw
        hh = cum * unit
        pts_top += [(x0, mid - hh), (x1, mid - hh)]
        pts_bot += [(x0, mid + hh), (x1, mid + hh)]
    poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts_top + pts_bot[::-1])
    s.append(f'<polygon points="{poly}" fill="url(#bm)"/>')
    for i, (lab, who, cum) in enumerate(secs):
        x = i * cw + cw / 2
        s.append(f'<line x1="{i * cw:.1f}" y1="{mid - 26}" x2="{i * cw:.1f}" y2="{mid + 26}" stroke="#15110e" stroke-width=".15" opacity=".4"/>')
        s.append(f'<text x="{x:.1f}" y="{mid + 31}" text-anchor="middle" font-family="Arimo" font-size="2.5" font-weight="700" letter-spacing=".3">{lab.upper()}</text>')
        if i in new:
            ty = mid - cum * unit
            k = list(new).index(i)
            lift = 2.4 + (k % 3) * 4.0
            s.append(f'<circle cx="{x:.1f}" cy="{ty:.1f}" r=".9" fill="#15110e"/>')
            s.append(f'<line x1="{x:.1f}" y1="{ty:.1f}" x2="{x:.1f}" y2="{ty - lift + 1:.1f}" stroke="#15110e" stroke-width=".2"/>')
            s.append(f'<text x="{x:.1f}" y="{ty - lift:.1f}" text-anchor="middle" font-family="EB Garamond" font-style="italic" font-size="3.1">+ {esc(new[i])}</text>')
        s.append(f'<text x="{x:.1f}" y="{mid + 1.1:.1f}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="3" fill="#15110e">{cum}</text>')
    s.append("</svg>")
    chart = "".join(s)
    css = """
#t01b{background-color:#fbf8f1}
#t01b .ck{position:absolute;left:20mm;top:18mm}
#t01b .chart{position:absolute;left:20mm;top:30mm}
#t01b .cn{position:absolute;left:20mm;top:96mm;width:150mm;font:400 6.3pt/1.4 'Arimo';opacity:.75}
#t01b .side{position:absolute;left:180mm;top:22mm;width:50mm}
#t01b .side .q{font:italic 400 12pt/1.22 'Cormorant Garamond'}
#t01b .side .src{display:block;font:700 5.6pt/1.3 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin:2mm 0 3mm;color:#a8822f}
#t01b .side .vs{font:700 22pt/1 'Cormorant Garamond';color:#c9a24a;margin:1mm 0}
#t01b .side p{font:400 8.4pt/1.38 'EB Garamond';margin:0;hyphens:manual}
#t01b .txt{position:absolute;left:20mm;top:108mm;width:210mm;height:120mm}
"""
    side = (
        '<div class="q">' + typo("«Подвигом добрым я подвизался, течение совершил, веру сохранил».", False) + '</div>'
        + '<span class="src">2 Тим. 4:7</span>'
        + '<div class="vs">vs</div>'
        + '<div class="q">I’m tryna keep my faith</div>'
        + '<span class="src">Ultralight Beam</span>'
        + '<p>' + typo("Павел подводит итог: веру — сохранил. Песня поёт в настоящем продолженном: пытаюсь сохранить. Между этими временами и живёт альбом.") + '</p>'
    )
    text = P(
        "Главный способ музыкального развития здесь — изменение плотности. Долгие звуки дают опору, паузы позволяют расслышать отдельного человека, вступление новых голосов раздвигает стены. Ударные придают движению вес, но оставляют вокалу свободу разворачивать фразу. Эмоциональный подъём складывается из постепенного накопления присутствия: сначала один голос, потом несколько, потом — все.",
        "При этом в тексте куда больше неуверенности, чем обещает торжественная аранжировка. Формула «I’m tryna keep my faith» держится на усилии: веру пытаются сохранить — а значит, её можно и потерять.",
        "Келли Прайс поёт о страдании и несправедливости; The-Dream ищет безопасность; финальная молитва Кирка Франклина обращена к тем, кому кажется, что они слишком испорчены и слишком часто просили прощения. Вера обретает смысл возможности вернуться после очередного падения.<sup class=\"fn\">5</sup>",
        "Для всего альбома это существенно. Первая песня заранее готовит место для человека, который не сможет соответствовать собственным обещаниям. Её милосердие распространяется и на того Канье, которого мы ещё только услышим.",
        "Chance the Rapper приносит другую разновидность движения. Его куплет сплетает религиозные образы, семейные подробности, юмор и чистое удовольствие от рэпа. Он свободно переходит от личной истории к библейской образности, не теряя разговорной живости, — и духовный подъём не застывает в безличной торжественности.",
        "Особенно выразительно положение самого Канье: на альбоме о собственной жизни он начинает с готовности уступить другим значительную часть пространства. <i>Ultralight Beam</i> достигает полноты через участие многих. Позже герой не раз попытается убедить себя, что управляет всем в одиночку.",
    )
    body = (
        '<div class="ck kicker">Накопление присутствия · сколько голосов уже прозвучало</div>'
        + f'<div class="chart">{chart}</div>'
        + '<div class="cn">' + typo("Порядок частей — по разметке текста песни; ширина луча — число разных голосов, прозвучавших к этому моменту. Длительности частей условны.", False) + '</div>'
        + f'<div class="side">{side}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="Ultralight Beam")
    )
    return page("t01b", body, cls="tex", css=css)


# =================================================================== 02 FATHER STRETCH MY HANDS PT. 1
def t02():
    tr = T[2]
    # bathos: register line (interpretive)
    pts = [(4, 10, "молитва, 1976"), (30, 20, "тег Metro"), (56, 7, "утро Кади"), (80, 9, ""), (90, 42, "шутка"), (110, 44, "футболка")]
    s = ['<svg width="62mm" height="58mm" viewBox="0 0 116 58">']
    s.append('<text x="0" y="5" font-family="Arimo" font-size="3.4" font-weight="700" letter-spacing=".6">ВОЗВЫШЕННОЕ</text>')
    s.append('<text x="0" y="56" font-family="Arimo" font-size="3.4" font-weight="700" letter-spacing=".6">БЫТОВОЕ</text>')
    s.append('<line x1="0" y1="8" x2="116" y2="8" stroke="#15110e" stroke-width=".2" stroke-dasharray="1 1"/>')
    s.append('<line x1="0" y1="50" x2="116" y2="50" stroke="#15110e" stroke-width=".2" stroke-dasharray="1 1"/>')
    d = "M" + " L".join(f"{x},{y + 2}" for x, y, _ in pts)
    s.append(f'<path d="{d}" fill="none" stroke="#b5481c" stroke-width="1.4" stroke-linejoin="round"/>')
    for x, y, lab in pts:
        if lab:
            s.append(f'<circle cx="{x}" cy="{y + 2}" r="1.3" fill="#15110e"/>')
            anchor = "start" if x < 100 else "end"
            s.append(f'<text x="{x + (2 if anchor == "start" else -2)}" y="{y + (8 if y < 30 else -3)}" text-anchor="{anchor}" font-family="EB Garamond" font-style="italic" font-size="4.2">{lab}</text>')
    s.append('<path d="M84 16 L88 30" stroke="#b5481c" stroke-width=".5" marker-end=""/>')
    s.append('<text x="62" y="34" font-family="Arimo" font-weight="700" font-size="3.6" fill="#b5481c" letter-spacing=".5">БАТОС ↓</text>')
    s.append("</svg>")
    chart = "".join(s)
    css = """
#t02{background-color:#f3eadb}
#t02 .band{position:absolute;left:0;top:0;width:250mm;height:100mm;overflow:hidden;background:#15110e}
#t02 .band img{width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block}
#t02 .imgcap{position:absolute;left:20mm;top:88mm;background:#15110e;color:#f6c66b;font:700 5.4pt/1.35 'Arimo';letter-spacing:.14em;text-transform:uppercase;padding:1.2mm 2mm}
#t02 .card{position:absolute;right:16mm;top:12mm;width:70mm;background:#f3eadb;padding:4mm 4mm 3mm;box-shadow:1.2mm 1.2mm 0 #15110e}
#t02 .card .ck{font:700 5.6pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase;margin-bottom:2mm}
#t02 .card .mark{display:inline-block;margin-top:1mm;font:700 5.2pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #15110e;padding:.7mm 1.3mm}
#t02 h1{position:absolute;left:19mm;top:104mm;margin:0;font:800 italic 30pt/1 'Playfair';letter-spacing:-.01em;color:#15110e}
#t02 h1 b{font-weight:900;color:#b5481c;font-size:40pt;margin-left:2mm}
#t02 .sub{position:absolute;right:20mm;top:107mm;width:70mm;text-align:right;font:italic 400 12pt/1.2 'Cormorant Garamond'}
#t02 .meta{position:absolute;left:20mm;top:122mm;width:210mm}
#t02 .meta .tmeta{display:grid;grid-template-columns:1.2fr 1.4fr 2.2fr 1.3fr;column-gap:4mm}
#t02 .meta .tmeta .pindex{border-top:.25mm solid currentColor;padding-top:1.1mm;align-self:start}
#t02 .txt{position:absolute;left:20mm;top:136mm;width:210mm;height:94mm;font-size:10.7pt;line-height:1.42}
#t02 .txt.cols{column-count:3;column-gap:6mm}
"""
    text = P(
        "В <i>Father Stretch My Hands Pt. 1</i> это противоречие становится почти физически ощутимым. Запись пастора T. L. Barrett приносит фактуру уже существовавшего религиозного исполнения: возраст голоса, общинную интонацию, ощущение просьбы о помощи. Затем продюсерский тег Metro Boomin — голосом Future — отмечает переход, вступает бит, и Kid Cudi превращает музыку в переживание утреннего облегчения.<sup class=\"fn\">6</sup>",
        "Здесь сшиты два времени: архивная молитва 1976 года и современное, почти мгновенное удовольствие от мощного вступления. Голос Кади связывает их мелодически. Он звучит открыто и тепло, и подъём можно принять сразу за влюблённость, освобождение и духовное озарение.",
        "На этом фоне первая сексуальная шутка Канье работает как намеренное — или просто случившееся — падение регистра. У приёма есть имя: <i>батос</i>, резкий спуск от возвышенного к низкому, бытовому, нелепому.",
        "Шутка устроена показательно. Грубое слово сначала описывает тело, затем становится оценкой самого рассказчика. На мгновение мелькает возможность морального самоузнавания — и тут же внимание переключается на испачканную футболку. Огромное духовное желание сталкивается с мелким неудобством для собственного комфорта.",
        "Из этого столкновения и рождается характер песни. Стремление к освобождению остаётся настоящим, но герой продолжает мыслить через удовольствие, внешний вид и реакцию окружающих. Музыка дарит ему переживание, до которого его речь пока не дотягивается.",
        "Это не обязывает считать куплет хорошим: концептуальная уместность и литературное качество — разные вопросы. Песня выдерживает слабость отдельных строк благодаря исключительной силе музыкального жеста.",
    )
    body = (
        '<div class="band"><img src="../img/caravaggio_arms_gold.png" alt=""></div>'
        + '<div class="imgcap">Караваджо. Обращение Савла, 1601 · руки, протянутые к свету</div>'
        + f'<div class="card"><div class="ck">Анатомия батоса</div>{chart}<span class="mark">прочтение</span></div>'
        + '<h1>Father Stretch My Hands<b>Pt. 1</b></h1>'
        + '<div class="sub">' + typo("Утро, футболка и падение регистра", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#15110e", dim="rgba(21,17,14,.18)")}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="02 · Pt. 1")
    )
    return page("t02", body, cls="tex", css=css)


# =================================================================== 03 PT. 2
def t03():
    tr = T[3]
    words = ["ОТЕЦ", "ДЕНЬГИ", "ПОТЕРИ", "СМЕРТЬ МАТЕРИ", "АВАРИЯ"]
    strip = "·".join(words)
    struct = [("КАНЬЕ", "#15110e", "#f2f0ea"), ("PANDA", "#f2f0ea", "#15110e"), ("КАНЬЕ", "#15110e", "#f2f0ea"),
              ("PANDA", "#f2f0ea", "#15110e"), ("КЭРОЛАЙН ШОУ", "#9a9a94", "#15110e"), ("Т. Л. БАРРЕТТ", "#c9a24a", "#15110e")]
    st = "".join(f'<div style="background:{b};color:{c}">{n}</div>' for n, b, c in struct)
    css = """
#t03{background-color:#f2f0ea;color:#0d0d0d}
#t03 h1{position:absolute;left:16mm;top:10mm;margin:0;font:900 150pt/.86 'Sofia Sans Extra Condensed';letter-spacing:-.02em}
#t03 .sub{position:absolute;left:104mm;top:22mm;width:126mm;font:italic 300 21pt/1.12 'Cormorant Garamond'}
#t03 .meta{position:absolute;left:104mm;top:52mm;width:126mm}
#t03 .strip{position:absolute;left:0;top:94mm;width:250mm;height:21mm;background:#0d0d0d;color:#f2f0ea;overflow:hidden;white-space:nowrap;font:900 31pt/21mm 'Sofia Sans Extra Condensed';letter-spacing:-.01em}
#t03 .strip span{opacity:.32}
#t03 .static{position:absolute;left:166mm;top:94mm;width:84mm;height:21mm;background:url(../img/static.png) center/cover;mix-blend-mode:normal}
#t03 .chan{position:absolute;left:170mm;top:98mm;font:700 7pt/1 'Arimo';letter-spacing:.2em;background:#0d0d0d;color:#f2f0ea;padding:1.4mm 2mm}
#t03 .chan b{color:#ff3b2f}
#t03 .lab{position:absolute;left:20mm;top:118mm;font:700 5.6pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#t03 .st{position:absolute;left:20mm;top:123mm;width:210mm;height:8mm;display:grid;grid-template-columns:repeat(6,1fr);gap:1mm}
#t03 .st div{font:700 6.4pt/8mm 'Arimo';letter-spacing:.14em;text-align:center;border:.3mm solid #0d0d0d}
#t03 .txt{position:absolute;left:20mm;top:138mm;width:210mm;height:90mm;font-size:11.2pt}
"""
    text = P(
        "<i>Pt. 2</i> меняет характер движения. Вместо раскрывающейся мелодии — торопливое перечисление: отец, деньги, семейные потери, смерть матери, автомобильная авария. События не получают пространства, соразмерного своей тяжести.",
        "Такой синтаксис называют паратактическим: факты поставлены рядом, а связи между ними приходится восстанавливать слушателю. В исполнении это превращается в поток воспоминаний, который опережает возможность спокойно рассказать собственную историю.",
        "Меняет значение и само слово <i>father</i>. В предыдущей песне отец принадлежал прежде всего языку молитвы. Здесь появляется конкретный отец — с его трудом, потерями и нехваткой времени. Религиозная просьба обрастает семейной биографией.",
        "Затем рассказ поглощает фрагмент <i>Panda</i> Дезайнера. Важно, что это включение уже существовавшей записи, а не обычный гостевой куплет: частная история оказывается внутри куда более громкой энергии потребления, машин и успеха. Финальное участие Caroline Shaw снова возвращает хрупкость.<sup class=\"fn\">7</sup>",
        "Смена материала действует почти как переключение канала: личная боль остаётся без завершения, потому что внимание уже захвачено другим. В этом есть выразительность современного монтажа — и потеря глубины. <i>Pt. 2</i> показывает травматический материал, который сама композиция не успевает развить.",
    )
    body = (
        '<h1>PT. 2</h1>'
        + '<div class="sub">' + typo("Список, в котором нет места для пауз", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#0d0d0d", dim="rgba(0,0,0,.15)")}</div>'
        + f'<div class="strip">{strip}·{strip}<span>·{strip}</span></div>'
        + '<div class="static"></div><div class="chan">КАНАЛ 02 → <b>PANDA</b></div>'
        + '<div class="lab">Порядок голосов · по разметке текста, без хронометража</div>'
        + f'<div class="st">{st}</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="03 · Pt. 2", color="#0d0d0d")
    )
    return page("t03", body, cls="tex", css=css)


# =================================================================== 04 FAMOUS (a)
def t04a():
    tr = T[4]
    css = """
#t04a{background-color:#ece5d3;color:#111}
#t04a .dots{position:absolute;inset:0;background:url(../img/newsdots.png);background-size:42mm;opacity:.9}
#t04a .mast{position:absolute;left:14mm;right:14mm;top:12mm;height:46mm;background:#d7261e;color:#fff;overflow:hidden}
#t04a .mast h1{margin:0;position:absolute;left:4mm;top:4mm;font:400 84pt/1 'Dela Gothic One';letter-spacing:-.01em;white-space:nowrap}
#t04a .mast .ed{position:absolute;right:4mm;top:4mm;text-align:right;font:700 6.4pt/1.5 'Arimo';letter-spacing:.18em;text-transform:uppercase}
#t04a .rule{position:absolute;left:14mm;right:14mm;top:60mm;border-top:.6mm solid #111;border-bottom:.25mm solid #111;height:2mm}
#t04a .gram{position:absolute;left:14mm;top:67mm;width:222mm}
#t04a .sent{display:flex;gap:6mm;align-items:flex-start}
#t04a .cell{display:flex;flex-direction:column}
#t04a .cell .w{font:800 50pt/1 'Bodoni Moda';letter-spacing:-.01em;white-space:nowrap}
#t04a .cell .w.red{background:#111;color:#ece5d3;font:700 7pt/1 'Arimo';letter-spacing:.2em;text-transform:uppercase;height:15.5mm;width:44mm;display:flex;align-items:center;justify-content:center;margin-top:2.6mm}
#t04a .cell .br{height:2.2mm;border:.5mm solid #d7261e;border-top:none;margin:2mm 0 1.6mm}
#t04a .cell .lb{font:700 6.2pt/1 'Arimo';letter-spacing:.2em;text-transform:uppercase;color:#d7261e}
#t04a .cell .sb{font:italic 400 9pt/1.2 'EB Garamond';margin-top:1mm;max-width:46mm}
#t04a .arrow{margin-top:5mm;font:700 5.8pt/1 'Arimo';letter-spacing:.18em;text-transform:uppercase;border-top:.3mm solid #111;padding-top:2mm}
#t04a .sub{position:absolute;left:14mm;top:118mm;width:222mm;font:italic 400 15pt/1.2 'Playfair';border-bottom:.25mm solid #111;padding-bottom:2mm}
#t04a .txt{position:absolute;left:14mm;top:131mm;width:160mm;height:98mm;font-size:11.2pt}
#t04a .meta{position:absolute;left:180mm;top:131mm;width:56mm}
"""
    # sentence diagram: I made that ▇▇▇ famous  (HTML so the words space themselves)
    words = [("I", "субъект", "тот, кто создаёт"), ("made", "действие", "сделал"), ("that", "", ""),
             ("", "объект", "человек, сведённый к результату"), ("famous", "результат", "присвоенная история")]
    cells = []
    for w, lab, sub in words:
        word = f'<span class="w">{w}</span>' if w else '<span class="w red">зачёркнуто</span>'
        cap = f'<span class="br"></span><span class="lb">{lab}</span><span class="sb">{sub}</span>' if lab else ""
        cells.append(f'<div class="cell{" x" if not w else ""}">{word}{cap}</div>')
    gram = ('<div class="sent">' + "".join(cells) + '</div>'
            + '<div class="arrow">грамматика присвоения: вся история другого — следствие глагола рассказчика</div>')
    text = P(
        "В <i>Famous</i> герой пытается восстановить контроль самым простым способом — объявляет себя причиной чужой известности.",
        "Знаменитая строка интересна не только грубостью. Её грамматика сводит другого человека к результату действия рассказчика: он — субъект, который создаёт; женщина — объект, чью историю можно присвоить. Заявление о Тейлор Свифт стоит воспринимать именно как притязание героя, а не как достоверное объяснение её карьеры.<sup class=\"fn\">8</sup>",
        "Но музыкальная форма расшатывает этот монолог. Рианна заново исполняет <i>Do What You Gotta Do</i> — песню, связанную здесь с записью Нины Симон; позднее вступает <i>Bam Bam</i> Sister Nancy. Под куплетом движется жёстко нарезанная сэмпловая основа, в создании которой участвовал Havoc.<sup class=\"fn\">6</sup>",
        "Мягкая мелодическая речь женского голоса допускает сложность отношений и возможность ухода. Канье отвечает демонстрацией власти. Эти эмоциональные позиции сохраняют самостоятельность: музыка не позволяет свести песню к его версии событий.",
    )
    body = (
        '<div class="dots"></div>'
        + '<div class="mast"><h1>FAMOUS</h1><div class="ed">трек 04 · 3:16<br>выпуск 14.02.2016<br>обновлён 13.03.2016</div></div>'
        + '<div class="rule"></div>'
        + f'<div class="gram">{gram}</div>'
        + '<div class="sub">' + typo("Один глагол против чужих голосов", False) + '</div>'
        + f'<div class="txt prose cols">{text}</div>'
        + f'<div class="meta">{track_meta(tr, color="#111", dim="rgba(0,0,0,.15)")}</div>'
        + folio(right="04 · Famous", color="#111")
    )
    return page("t04a", body, css=css)


# =================================================================== 04 FAMOUS (b)
def t04b():
    strips = [
        ("NINA SIMONE · 1968", "#111", "#ece5d3", "Bodoni Moda", -3, 20, 30),
        ("RIHANNA", "#d7261e", "#fff", "Dela Gothic One", 2, 112, 26),
        ("SISTER NANCY · 1982", "#f2c230", "#111", "Arimo", -1.5, 30, 54),
        ("SWIZZ BEATZ", "#fff", "#111", "Rubik Dirt", 3, 128, 52),
        ("IL ROVESCIO DELLA MEDAGLIA · 1973", "#ece5d3", "#111", "Playfair", -2, 18, 76),
        ("HAVOC · бит", "#111", "#f2c230", "Arimo", 1.5, 150, 78),
    ]
    sh = "".join(
        f'<div class="strip" style="left:{x}mm;top:{y}mm;background:{bg};color:{fg};font-family:\'{ff}\';transform:rotate({rot}deg)">{t}</div>'
        for t, bg, fg, ff, rot, x, y in strips)
    struct = [("Рианна + Канье", 1), ("Канье + Swizz", 1.6), ("Рианна + Swizz", 1), ("Канье + Swizz", 1.6), ("Рианна", .7),
              ("Sister Nancy + Swizz", 2.4), ("Нина Симон", 1.2)]
    tot = sum(w for _, w in struct)
    cols = ["#111", "#d7261e", "#111", "#d7261e", "#111", "#f2c230", "#5b5146"]
    stv = "".join(
        f'<div style="flex:{w};background:{c};color:{"#111" if c == "#f2c230" else "#fff"}">{n}</div>'
        for (n, w), c in zip(struct, cols))
    del tot
    css = """
#t04b{background-color:#ece5d3;color:#111}
#t04b .dots{position:absolute;inset:0;background:url(../img/newsdots.png);background-size:42mm;opacity:.9}
#t04b .k{position:absolute;left:14mm;top:13mm}
#t04b .strip{position:absolute;padding:2mm 3.6mm;font-size:15pt;font-weight:700;letter-spacing:.02em;white-space:nowrap;box-shadow:.8mm .8mm 0 rgba(0,0,0,.25)}
#t04b .lab{position:absolute;left:14mm;top:100mm;font:700 5.6pt/1.2 'Arimo';letter-spacing:.2em;text-transform:uppercase}
#t04b .struct{position:absolute;left:14mm;top:105mm;width:222mm;height:9mm;display:flex;gap:.8mm}
#t04b .struct div{font:700 5.6pt/9mm 'Arimo';letter-spacing:.06em;text-align:center;white-space:nowrap;overflow:hidden}
#t04b .halves{position:absolute;left:14mm;top:116mm;width:222mm;display:flex;font:italic 400 9.6pt/1.2 'EB Garamond'}
#t04b .halves div{flex:1;border-top:.3mm solid #111;padding-top:1mm}
#t04b .txt{position:absolute;left:14mm;top:128mm;width:150mm;height:100mm;font-size:10.9pt}
#t04b .side{position:absolute;left:172mm;top:128mm;width:64mm}
#t04b .eliot{background:#111;color:#ece5d3;padding:4mm}
#t04b .eliot .q{font:italic 400 11pt/1.25 'Playfair'}
#t04b .eliot .src{display:block;margin-top:2mm;font:700 5.4pt/1.3 'Arimo';letter-spacing:.18em;text-transform:uppercase;color:#f2c230}
#t04b .fact{font:400 7.2pt/1.42 'Arimo';border-top:.3mm solid #111;padding:1.6mm 0 0;margin-top:2.6mm}
#t04b .fact b{font-weight:700}
"""
    text = P(
        "Во второй части монтаж меняет источник удовольствия. Фигура рассказчика отступает, ритмический фрагмент Sister Nancy начинает организовывать общее движение, реплики Swizz Beatz усиливают ощущение публичного праздника. Песня набирает энергию, которая уже превосходит и личную обиду, и хвастовство.",
        "Здесь особенно хорошо слышна двойственность сэмплирования. Чужую запись можно пустить в дело как материал собственной империи. Но её голос способен сохранить достаточно характера, чтобы изменить значение всей композиции.",
    )
    side = (
        '<div class="eliot"><div class="q">' + typo("«Незрелые поэты подражают, зрелые — крадут; плохие поэты портят взятое, а хорошие превращают его в нечто лучшее или хотя бы иное».", False)
        + '</div><span class="src">Т. С. Элиот, 1920</span></div>'
        + '<div class="fact"><b>Nina Chop</b> — ' + typo("так песня называлась в январском рукописном треклисте: по имени голоса, который её держит. Последнее слово в ней тоже за Ниной Симон.") + '</div>'
        + '<div class="fact"><b>Ещё один телефон</b> — ' + typo("разговор, в котором обсуждалась знаменитая строка, позже стал отдельным публичным сюжетом и спором на годы.") + '</div>'
    )
    body = (
        '<div class="dots"></div>'
        + '<div class="k kicker">Famous · чужие голоса, вклеенные в монолог</div>'
        + sh
        + '<div class="lab">Устройство песни · по разметке текста, длительности условны</div>'
        + f'<div class="struct">{stv}</div>'
        + '<div class="halves"><div>' + typo("первая половина: рассказчик и его версия", False) + '</div><div style="flex:1.3">' + typo("вторая: Sister Nancy, Swizz — общий праздник", False) + '</div></div>'
        + f'<div class="txt prose cols">{text}</div>'
        + f'<div class="side">{side}</div>'
        + folio(right="04 · Famous", color="#111")
    )
    return page("t04b", body, css=css)


# =================================================================== 05 FEEDBACK
def t05():
    tr = T[5]
    # positive-feedback spiral
    pts = []
    for i in range(0, 721):
        a = math.radians(i * 1.25)
        r = 4 + i * 0.062
        pts.append((60 + r * math.cos(a), 60 + r * math.sin(a)))
    d = "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts)
    labels = [(60, 49, "критика"), (88, 70, "«гениальность»"), (32, 82, "громче"), (100, 22, "ещё громче"), (8, 30, "ответ не слышен")]
    lab = "".join(f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="3.6" letter-spacing=".6" fill="#d4ff3a">{t.upper()}</text>' for x, y, t in labels)
    spiral = (f'<svg width="120mm" height="120mm" viewBox="0 0 120 120"><path d="{d}" fill="none" stroke="#d4ff3a" stroke-width=".9"/>'
              f'<circle cx="60" cy="60" r="2" fill="#d4ff3a"/>{lab}</svg>')
    css = """
#t05{background:#0b0b0b;color:#efeee8}
#t05 .k{position:absolute;left:20mm;top:18mm;color:#d4ff3a}
#t05 h1{position:absolute;left:16mm;top:22mm;margin:0;font:400 66pt/1 'Rubik Glitch';color:#d4ff3a;letter-spacing:.01em}
#t05 .sub{position:absolute;left:20mm;top:52mm;font:italic 300 19pt/1.2 'Cormorant Garamond'}
#t05 .sp{position:absolute;left:126mm;top:66mm}
#t05 .spl{position:absolute;left:130mm;top:186mm;width:100mm;font:700 5.6pt/1.4 'Arimo';letter-spacing:.18em;text-transform:uppercase;color:#d4ff3a}
#t05 .meta{position:absolute;left:20mm;top:66mm;width:96mm}
#t05 .txt{position:absolute;left:20mm;top:104mm;width:96mm;height:124mm;color:#efeee8;font-size:11pt}
#t05 .epi{position:absolute;left:130mm;top:198mm;width:100mm;font-size:12.6pt;line-height:1.22;color:#efeee8}
#t05 .epi .src{color:#d4ff3a}
#t05 .quote{position:absolute;left:130mm;top:30mm;width:100mm;text-align:right;font:400 15pt/1.1 'Rubik Glitch';color:#efeee8;opacity:.9}
"""
    text = P(
        "<i>Feedback</i> сжимает эту многоголосность до режима наступления. Колючий электронный звук, повторяемость и жёсткая артикуляция создают впечатление сигнала, который с каждым возвращением становится громче.",
        "Название подсказывает точную метафору. Обратная связь должна помогать системе исправлять поведение. В мире героя критика легко превращается в очередное подтверждение исключительности.",
        "Формула «Name one genius that ain’t crazy» заранее связывает несогласие окружающих с масштабом личности. Позиция рассказчика становится почти неопровержимой: странность поведения можно предъявить как доказательство гениальности.<sup class=\"fn\">9</sup>",
        "Музыкальная агрессия воплощает эту логику убедительнее, чем её разворачивает текст. Звук давит, возвращается и занимает всё пространство. Песня демонстрирует, как эффективна такая позиция, — и как она не способна услышать ответ.",
    )
    body = (
        '<div class="k kicker">05 / 20 · Часть I</div>'
        + '<h1>FEEDBACK</h1>'
        + '<div class="sub">' + typo("Петля, которая слышит только себя", False) + '</div>'
        + '<div class="quote">NAME ONE GENIUS<br>THAT AIN’T CRAZY</div>'
        + f'<div class="meta">{track_meta(tr, color="#d4ff3a", dim="rgba(212,255,58,.2)")}</div>'
        + f'<div class="txt prose" style="--fn:#d4ff3a">{text}</div>'
        + f'<div class="sp">{spiral}</div>'
        + '<div class="spl">Положительная обратная связь: сигнал усиливает сам себя, пока не превратится в вой</div>'
        + '<div class="epi">' + typo("«Если я говорю языками человеческими и ангельскими, а любви не имею, то я — медь звенящая или кимвал звучащий».", False)
        + '<span class="src">1 Кор. 13:1</span></div>'
        + folio(right="05 · Feedback", color="#d4ff3a")
    )
    return page("t05", body, css=css)


def pages():
    return [part1(), t01a(), t01b(), t02(), t03(), t04a(), t04b(), t05()]
