"""Part II — «Приглушённый свет / Лучшие моменты»:
Low Lights, Highlights, Freestyle 4, I Love Kanye, Waves."""
import math
import random

from data import TRACKS
from lib import P, esc, folio, jitter_ellipse, page, track_meta, typo, fmt_dur

T = {t["n"]: t for t in TRACKS}


# =================================================================== PART II OPENER
def part2():
    lst = "".join(
        f'<div class="it"><span>{n:02d}</span><b>{esc(T[n]["t"])}</b><em>{fmt_dur(T[n]["sec"])}</em></div>'
        for n in range(6, 11))
    css = """
#part2{background:#fbfaf6;color:#15110e}
#part2 .dim{position:absolute;left:0;top:0;width:118mm;height:250mm;background:radial-gradient(circle at 62mm 150mm,#3b3350 0,#1a1d38 38%,#0d1024 75%)}
#part2 .k{position:absolute;left:20mm;top:18mm;color:#e9b46a}
#part2 .num{position:absolute;left:0;width:250mm;top:22mm;text-align:center;font:900 150pt/1 'Playfair';letter-spacing:-.02em}
#part2 .num .l{color:#e9b46a}
#part2 .num .r{color:#15110e}
#part2 .t1{position:absolute;left:20mm;top:96mm;width:96mm;font:italic 300 34pt/1.02 'Cormorant Garamond';color:#efe2c8}
#part2 .t2{position:absolute;left:134mm;top:96mm;width:100mm;font:900 30pt/1.02 'Inter Tight';letter-spacing:-.02em}
#part2 .t2 span{background:linear-gradient(transparent 52%, #f7f33a 52%, #f7f33a 92%, transparent 92%)}
#part2 .l1{position:absolute;left:20mm;top:142mm;width:92mm;font:italic 400 12pt/1.3 'EB Garamond';color:#cfc4b0}
#part2 .l2{position:absolute;left:134mm;top:142mm;width:96mm;font:400 11pt/1.3 'Inter Tight'}
#part2 .glow{position:absolute;left:52mm;top:170mm;width:20mm;height:20mm;border-radius:50%;background:radial-gradient(circle,#ffe2a8 0,#e9b46a 30%,rgba(233,180,106,0) 70%)}
#part2 .list{position:absolute;left:134mm;top:170mm;width:96mm}
#part2 .it{display:flex;gap:3mm;align-items:baseline;border-top:.3mm solid #15110e;padding:1.5mm 0;font:400 8pt/1.2 'Arimo'}
#part2 .it span{font-weight:700;width:6mm}
#part2 .it b{flex:1;font-weight:700}
#part2 .it em{font-style:normal}
#part2 .epi{position:absolute;left:20mm;top:202mm;width:92mm;font-size:11.6pt;line-height:1.24;color:#efe2c8}
#part2 .epi .src{color:#e9b46a}
"""
    body = (
        '<div class="dim"></div><div class="glow"></div>'
        + '<div class="k kicker">Часть вторая</div>'
        + '<div class="num"><span class="l">I</span><span class="r">I</span></div>'
        + '<div class="t1">Приглушённый свет</div>'
        + '<div class="t2"><span>Лучшие</span><br><span>моменты</span></div>'
        + '<div class="l1">' + typo("Свидетельство: жизнь, рассказанная тихо и без расчёта на эффект.", False) + '</div>'
        + '<div class="l2">' + typo("Витрина: жизнь, смонтированная для зрителей.", False) + '</div>'
        + f'<div class="list">{lst}</div>'
        + '<div class="epi">' + typo("«Всё мне позволительно, но не всё полезно; всё мне позволительно, но ничто не должно обладать мною».", False)
        + '<span class="src">1 Кор. 6:12</span></div>'
        + folio(right="Часть II", color="#15110e")
        + '<style>#part2 .folio span:first-child{color:#e9b46a}</style>'
    )
    return page("part2", body, css=css)


# =================================================================== 06 LOW LIGHTS
def t06():
    tr = T[6]
    tri = """
<svg width="96mm" height="86mm" viewBox="0 0 96 86">
  <defs><radialGradient id="llg" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffe2a8" stop-opacity=".95"/><stop offset=".35" stop-color="#e9b46a" stop-opacity=".5"/>
    <stop offset="1" stop-color="#e9b46a" stop-opacity="0"/></radialGradient></defs>
  <polygon points="48,6 90,76 6,76" fill="none" stroke="#e9b46a" stroke-width=".5" stroke-dasharray="1.2 1"/>
  <circle cx="48" cy="52" r="20" fill="url(#llg)"/>
  <circle cx="48" cy="52" r="1.6" fill="#fff4dc"/>
  <text x="48" y="3" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="3.2" letter-spacing=".8" fill="#efe2c8">ЦЕРКОВЬ · СВИДЕТЕЛЬСТВО</text>
  <text x="2" y="83" font-family="Arimo" font-weight="700" font-size="3.2" letter-spacing=".8" fill="#efe2c8">КЛУБ · ХАУС</text>
  <text x="94" y="83" text-anchor="end" font-family="Arimo" font-weight="700" font-size="3.2" letter-spacing=".8" fill="#efe2c8">АЛЬБОМ · ХИП-ХОП</text>
  <text x="48" y="61.5" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="4.6" fill="#15110e">Low Lights</text>
</svg>"""
    css = """
#t06{background:radial-gradient(circle at 168mm 92mm,#2a2540 0,#141a33 34%,#0b0e1f 80%);color:#efe2c8}
#t06 .k{position:absolute;left:20mm;top:18mm;color:#e9b46a}
#t06 h1{position:absolute;left:18mm;top:24mm;margin:0;font:italic 300 70pt/.92 'Cormorant Garamond';color:#f4e6c8;letter-spacing:-.01em}
#t06 .sub{position:absolute;left:20mm;top:58mm;width:110mm;font:italic 400 15pt/1.2 'EB Garamond';color:#e9b46a}
#t06 .meta{position:absolute;left:20mm;top:72mm;width:96mm}
#t06 .tri{position:absolute;left:132mm;top:40mm}
#t06 .silent{position:absolute;left:132mm;top:132mm;width:98mm;font:italic 400 11pt/1.32 'EB Garamond';color:#efe2c8;border-left:.6mm solid #e9b46a;padding-left:3.6mm}
#t06 .silent b{display:block;font:700 5.8pt/1.3 'Arimo';font-style:normal;letter-spacing:.2em;text-transform:uppercase;color:#e9b46a;margin-bottom:1.4mm}
#t06 .txt{position:absolute;left:20mm;top:108mm;width:100mm;height:122mm;font-size:10.9pt;color:#efe2c8}
#t06 .txt2{position:absolute;left:132mm;top:156mm;width:98mm;height:74mm;font-size:10.9pt;color:#efe2c8}
"""
    t1 = P(
        "После <i>Feedback</i> <i>Low Lights</i> меняет сам способ присутствия человека в музыке. Вместо доказательств собственной значимости — свидетельство о поддержке.",
        "Монолог взят из <i>So Alive (Acapella)</i> Kings of Tomorrow. Танцевальное происхождение здесь важно: религиозная интонация свободно переходит между церковным свидетельством, хаус-записью и хип-хоп-альбомом. Границы жанров оказываются менее прочными, чем границы между душевными состояниями.<sup class=\"fn\">6</sup>",
        "Скромное сопровождение оставляет голосу возможность говорить. Протяжённость монолога требует другого внимания: слушатель должен выдержать чужую речь, не ожидая немедленного эффекта.",
    )
    t2 = P(
        "Если <i>Ultralight Beam</i> создавала общее пространство молитвы, <i>Low Lights</i> предлагает единичный рассказ о том, как любовь поддерживает человека в тяжёлых обстоятельствах. Духовность связывается с возможностью пережить один конкретный день.",
        "Келли Прайс называла TLOP «уличной притчей» и объясняла его религиозность через стыд, страх, сострадание и возможность подняться после падения.<sup class=\"fn\">10</sup> Её слова помогают понять, почему бытовые и неприглядные эпизоды вообще входят в такой замысел.",
    )
    body = (
        '<div class="k kicker">06 / 20 · Часть II</div>'
        + '<h1>Low Lights</h1>'
        + '<div class="sub">' + typo("Свидетельство при приглушённом свете", False) + '</div>'
        + f'<div class="meta">{track_meta(tr, color="#e9b46a", dim="rgba(233,180,106,.22)")}</div>'
        + f'<div class="tri">{tri}</div>'
        + '<div class="silent"><b>тишина рассказчика</b>' + typo("На этом треке Канье не произносит ни слова. Весь текст — чужое свидетельство: альбом о себе впервые целиком отдаёт микрофон.", False) + '</div>'
        + f'<div class="txt prose" style="--fn:#e9b46a">{t1}</div>'
        + f'<div class="txt2 prose" style="--fn:#e9b46a">{t2}</div>'
        + folio(right="06 · Low Lights", color="#e9b46a")
    )
    return page("t06", body, css=css)


# =================================================================== 07 HIGHLIGHTS
def t07():
    tr = T[7]
    sel = ["деньги", "секс", "имена", "тело", "эффект", "успех"]
    rej = ["будни", "звонок родным", "тишина", "ожидание", "усталость", "день рождения"]
    order = [sel[0], rej[0], sel[1], rej[1], sel[2], sel[3], rej[2], rej[3], sel[4], rej[4], sel[5], rej[5]]
    fw, fh, gx, gy = 34, 24, 3, 9
    x0, y0 = 4, 6
    s = [f'<svg width="160mm" height="108mm" viewBox="0 0 160 108">']
    s.append('<rect x="0" y="0" width="160" height="108" fill="#161414"/>')
    for i in range(4):
        for j in range(3):
            idx = j * 4 + i
            x = x0 + i * (fw + gx + 1.5)
            y = y0 + j * (fh + gy)
            word = order[idx]
            chosen = word in sel
            s.append(f'<rect x="{x}" y="{y}" width="{fw}" height="{fh}" fill="{"#d9d5cc" if chosen else "#8f8a82"}"/>')
            # halftone suggestion
            for k in range(28):
                cx = x + 3 + (k % 7) * 4.6
                cy = y + 4 + (k // 7) * 5.2
                rr = 0.5 + 0.9 * abs(math.sin(idx * 1.7 + k * 0.6))
                s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rr:.2f}" fill="#161414" opacity=".35"/>')
            s.append(f'<rect x="{x + 2}" y="{y + fh - 7.5}" width="{fw - 4}" height="5.5" fill="#fbfaf6"/>')
            s.append(f'<text x="{x + fw / 2}" y="{y + fh - 3.4}" text-anchor="middle" font-family="Inter Tight" font-weight="700" font-size="3.4" fill="#161414">{word}</text>')
            s.append(f'<text x="{x}" y="{y - 1.6}" font-family="Arimo" font-weight="700" font-size="2.2" fill="#f2b33a" letter-spacing=".4">{14 + idx}{"A" if idx % 2 else ""}  ›  PABLO 400</text>')
            if chosen:
                s.append(f'<path d="{jitter_ellipse(x + fw / 2, y + fh / 2, fw / 2 + 2.6, fh / 2 + 2.6, seed=idx + 3)}" fill="none" stroke="#e0312b" stroke-width="1.1" stroke-linecap="round"/>')
            else:
                s.append(f'<path d="M{x + 2} {y + 2} L{x + fw - 2} {y + fh - 2} M{x + fw - 2} {y + 2} L{x + 2} {y + fh - 2}" stroke="#e0312b" stroke-width=".7" opacity=".85"/>')
    s.append("</svg>")
    sheet = "".join(s)
    css = """
#t07{background:#fbfaf6;color:#161414}
#t07 .k{position:absolute;left:20mm;top:18mm}
#t07 h1{position:absolute;left:18mm;top:22mm;margin:0;font:900 64pt/1 'Inter Tight';letter-spacing:-.04em}
#t07 h1 span{background:linear-gradient(transparent 55%, #f7f33a 55%, #f7f33a 90%, transparent 90%)}
#t07 .sub{position:absolute;left:20mm;top:50mm;font:italic 400 15pt/1.2 'EB Garamond'}
#t07 .sheet{position:absolute;left:20mm;top:62mm;box-shadow:1.4mm 1.4mm 0 rgba(0,0,0,.12)}
#t07 .cap{position:absolute;left:20mm;top:172mm;width:160mm;font:700 5.6pt/1.4 'Arimo';letter-spacing:.18em;text-transform:uppercase}
#t07 .cap b{color:#e0312b}
#t07 .meta{position:absolute;left:186mm;top:62mm;width:44mm}
#t07 .gopro{position:absolute;left:186mm;top:126mm;width:44mm;height:44mm;border-radius:50%;background:radial-gradient(circle at 40% 38%,#ffffff 0,#dcdad4 30%,#4a4744 72%,#161414 74%);box-shadow:inset 0 0 0 1.2mm #161414}
#t07 .gopro span{position:absolute;left:0;right:0;top:19mm;text-align:center;font:700 5.6pt/1.3 'Arimo';letter-spacing:.2em;color:#161414}
#t07 .txt{position:absolute;left:20mm;top:180mm;width:210mm;height:50mm;font-size:10.4pt;line-height:1.38}
#t07 .txt.cols{column-count:3;column-gap:6mm;text-align:left}
"""
    text = P(
        "<i>Highlights</i> немедленно возвращают нас к публичному представлению жизни. Название указывает на отбор: подборка лучших моментов всегда подразумевает то, что осталось за кадром. На первый план выходят сексуальный успех, деньги, физическая привлекательность, громкие имена и умение производить впечатление.",
        "Музыка работает как привлекательная поверхность: мелодические линии легко перетекают друг в друга, вставки Young Thug, The-Dream и других участников делают композицию подвижной и праздничной.<sup class=\"fn\">11</sup>",
        "Интимная жизнь в тексте всё время стремится стать видимой. Шутка о камере GoPro доводит это до буквальности: переживание заранее воображается материалом для съёмки. Выпад в адрес Ray J переводит человеческие отношения в соревнование состояний и статусов.<sup class=\"fn\">12</sup>",
        "За этим слышна особая бедность внимания. Герой умеет оценивать событие по эффектности, но куда хуже удерживает то, что не превращается в яркий эпизод. Позже <i>Real Friends</i> покажет цену такого устройства жизни.",
    )
    body = (
        '<div class="k kicker">07 / 20 · Часть II</div>'
        + '<h1><span>Highlights</span></h1>'
        + '<div class="sub">' + typo("Монтаж лучших моментов", False) + '</div>'
        + f'<div class="sheet">{sheet}</div>'
        + '<div class="cap">Контактный лист · <b>обведено</b> — в нарезку; <b>перечёркнуто</b> — за кадром · прочтение</div>'
        + f'<div class="meta">{track_meta(tr, color="#161414", dim="rgba(0,0,0,.15)")}</div>'
        + '<div class="gopro"><span>ВЗГЛЯД<br>КАМЕРЫ</span></div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="07 · Highlights", color="#161414")
    )
    return page("t07", body, css=css)


# =================================================================== 08 FREESTYLE 4
def t08():
    tr = T[8]
    rnd = random.Random(4)
    # spectators around a long table, all gazes converging on one point
    s = ['<svg width="100mm" height="66mm" viewBox="0 0 100 66">']
    s.append('<rect x="14" y="26" width="72" height="18" fill="none" stroke="#e8dcc8" stroke-width=".6"/>')
    fx, fy = 58, 35
    seats = []
    for i in range(10):
        seats.append((18 + i * 7.2, 21))
        seats.append((18 + i * 7.2, 49))
    seats += [(9, 30), (9, 40), (91, 30), (91, 40)]
    for x, y in seats:
        s.append(f'<line x1="{x}" y1="{y}" x2="{fx}" y2="{fy}" stroke="#c1121f" stroke-width=".25" opacity=".85"/>')
        s.append(f'<circle cx="{x}" cy="{y}" r="2.1" fill="#e8dcc8"/>')
    s.append(f'<circle cx="{fx}" cy="{fy}" r="3.2" fill="#c1121f"/>')
    s.append('<text x="50" y="60" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="3" letter-spacing=".8" fill="#e8dcc8">ВСЕ ПРИСУТСТВУЮЩИЕ — ЗРИТЕЛИ</text>')
    s.append("</svg>")
    table = "".join(s)
    del rnd
    whatif = "".join(f'<div style="opacity:{1 - i * 0.12:.2f}">WHAT IF</div>' for i in range(6))
    css = """
#t08{background:#3a0a0e;color:#e8dcc8}
#t08 .strings{position:absolute;inset:0}
#t08 .k{position:absolute;left:20mm;top:18mm;color:#e8dcc8}
#t08 h1{position:absolute;left:18mm;top:22mm;margin:0;font:900 italic 88pt/.86 'Sofia Sans Extra Condensed';letter-spacing:-.01em;color:#e8dcc8}
#t08 h1 b{color:#c1121f;font-weight:900}
#t08 .sub{position:absolute;left:20mm;top:100mm;width:90mm;font:italic 300 17pt/1.18 'Cormorant Garamond'}
#t08 .wi{position:absolute;left:130mm;top:20mm;font:900 34pt/.95 'Sofia Sans Extra Condensed';color:transparent;-webkit-text-stroke:.35mm #e8dcc8;letter-spacing:.02em}
#t08 .rn{position:absolute;left:150mm;top:58mm;transform:rotate(-8deg);font:900 58pt/.9 'Sofia Sans Extra Condensed';color:#c1121f;letter-spacing:-.01em}
#t08 .tbl{position:absolute;left:130mm;top:92mm}
#t08 .meta{position:absolute;left:20mm;top:122mm;width:96mm}
#t08 .txt{position:absolute;left:20mm;top:160mm;width:210mm;height:70mm;font-size:10.9pt;color:#efe5d4}
#t08 .mark{position:absolute;left:130mm;top:178mm;font:700 5.2pt/1 'Arimo';letter-spacing:.14em;text-transform:uppercase;border:.3mm solid #e8dcc8;padding:.7mm 1.3mm}
"""
    strings = '<svg class="strings" width="250mm" height="250mm" viewBox="0 0 250 250">' + "".join(
        f'<line x1="{-20 + i * 23}" y1="250" x2="{60 + i * 23}" y2="0" stroke="#e8dcc8" stroke-width="{0.15 + (i % 3) * 0.12:.2f}" opacity=".12"/>'
        for i in range(14)) + "</svg>"
    text = P(
        "В <i>Freestyle 4</i> стремление к эффекту становится навязчивым. Угрожающий струнный фрагмент из <i>Human</i> Goldfrapp, бас и резкие вокальные вмешательства превращают сексуальную фантазию в тревожную сцену.<sup class=\"fn\">13</sup>",
        "Речь строится на повторяемых «what if» и «right now». Условность и немедленность существуют одновременно: герой воображает нарушение правил — и требует, чтобы желание было удовлетворено без промедления.",
        "Публичное место здесь принципиально. Фантазия касается не только секса, но и способности остановить мероприятие, вызвать реакцию, изменить поведение всех присутствующих. Окружающие становятся зрителями предполагаемого поступка.",
        "Музыкально эта мысль выражена отказом от устойчивого комфорта. Струнный жест тревожит, фразы звучат отрывисто, повтор не успокаивает. Желание принимает форму давления. Песня даёт почувствовать, как далеко удовольствие может уйти от близости.",
    )
    body = (
        strings
        + '<div class="k kicker">08 / 20 · Часть II</div>'
        + '<h1>FREE<br>STYLE<br><b>4</b></h1>'
        + '<div class="sub">' + typo("Что, если — прямо сейчас", False) + '</div>'
        + f'<div class="wi">{whatif}</div>'
        + '<div class="rn">RIGHT<br>NOW</div>'
        + f'<div class="tbl">{table}</div>'
        + f'<div class="meta">{track_meta(tr, color="#e8dcc8", dim="rgba(232,220,200,.2)")}</div>'
        + f'<div class="txt prose cols" style="--fn:#ff6b5b">{text}</div>'
        + folio(right="08 · Freestyle 4", color="#e8dcc8")
    )
    return page("t08", body, css=css)


# =================================================================== 09 I LOVE KANYE
def t09():
    tr = T[9]
    n = 23
    R = 62
    circ = 2 * math.pi * R
    ring_text = "KANYE · " * n
    svg = f"""
<svg width="150mm" height="150mm" viewBox="0 0 150 150">
  <defs><path id="ring" d="M75,{75 - R} a{R},{R} 0 1,1 -0.01,0"/></defs>
  <text font-family="Arimo" font-weight="700" font-size="4.15" textLength="{circ - 0.6:.1f}" lengthAdjust="spacing">
    <textPath href="#ring">{ring_text}</textPath></text>
  <circle cx="75" cy="75" r="{R - 8}" fill="none" stroke="#111" stroke-width=".25"/>
  <text x="75" y="70" text-anchor="middle" font-family="Arimo" font-weight="700" font-size="22">0:44</text>
  <text x="75" y="81" text-anchor="middle" font-family="Arimo" font-size="3.8" letter-spacing="1.2">БЕЗ БИТА</text>
  <text x="75" y="90" text-anchor="middle" font-family="EB Garamond" font-style="italic" font-size="5">имя звучит {n} раза</text>
</svg>"""
    css = """
#t09{background:#ffffff;color:#111}
#t09 .k{position:absolute;left:20mm;top:18mm}
#t09 h1{position:absolute;left:19mm;top:22mm;margin:0;font:700 26pt/1.1 'Arimo';letter-spacing:-.01em}
#t09 .mir{position:absolute;left:19mm;top:33mm;font:700 26pt/1.1 'Arimo';letter-spacing:-.01em;transform:scaleY(-1);opacity:.14}
#t09 .sub{position:absolute;left:20mm;top:50mm;width:80mm;font:italic 400 13pt/1.25 'EB Garamond'}
#t09 .ring{position:absolute;left:88mm;top:14mm}
#t09 .meta{position:absolute;left:20mm;top:66mm;width:56mm}
#t09 .note{position:absolute;left:20mm;top:104mm;width:56mm;font:400 6.4pt/1.45 'Arimo';opacity:.7}
#t09 .epi{position:absolute;left:20mm;top:124mm;width:58mm;font-size:11pt;line-height:1.25}
#t09 .txt{position:absolute;left:20mm;top:172mm;width:210mm;height:58mm;font-size:10.6pt;line-height:1.4}
#t09 .txt.cols{column-count:3;column-gap:6mm;text-align:left}
"""
    text = P(
        "Затем <i>I Love Kanye</i> снимает почти всю звуковую декорацию. После насыщенных аранжировок голос без бита особенно заметен. Канье воспроизводит жалобы на собственные перемены — «I miss the old Kanye» — и превращает своё имя в главный материал текста.",
        "С литературной точки зрения это маленькая сцена раздвоения. Канье говорит о Канье так, как о нём говорят поклонники: человек становится персонажем чужой речи, а потом присваивает эту речь себе.",
        "Повторение имени создаёт почти замкнутую языковую систему: любовь, раздражение, ностальгия и самооценка возвращаются к одному обозначению — оно принадлежит и человеку, и музыкальному прошлому, и торговой марке.",
        "Самоирония здесь точна, но её возможности ограничены. Узнать собственную карикатуру ещё не значит выйти из неё. Интерлюдия обнаруживает дистанцию между человеком и образом — и оставляет открытым вопрос, сумеет ли он этой дистанцией воспользоваться.",
    )
    body = (
        '<div class="k kicker">09 / 20 · Часть II</div>'
        + '<h1>I Love Kanye</h1><div class="mir">I Love Kanye</div>'
        + '<div class="sub">' + typo("Имя как замкнутый круг", False) + '</div>'
        + f'<div class="ring">{svg}</div>'
        + f'<div class="meta">{track_meta(tr, color="#111", dim="rgba(0,0,0,.12)")}</div>'
        + '<div class="note">' + typo("Подсчёт — по расшифровке текста: 23 «Kanye» за 44 секунды, примерно каждые две секунды.", False) + '</div>'
        + '<div class="epi">' + typo("«…забывая заднее и простираясь вперёд».", False) + '<span class="src">Флп. 3:13</span></div>'
        + f'<div class="txt prose cols">{text}</div>'
        + folio(right="09 · I Love Kanye", color="#111")
    )
    return page("t09", body, css=css)


# =================================================================== 10 WAVES
def t10():
    tr = T[10]
    # chopped pulses vs one long line
    W, H = 210, 46
    s = [f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">']
    rnd = random.Random(10)
    for i in range(84):
        x = 2 + i * 2.48
        h = 3 + 9 * abs(math.sin(i * 0.37)) * (0.6 + 0.4 * rnd.random())
        s.append(f'<rect x="{x:.1f}" y="{34 - h:.1f}" width="1.3" height="{h:.1f}" fill="#e8f4f1" opacity=".75"/>')
    d = "M" + " L".join(f"{x:.1f},{14 + 7 * math.sin(x / 210 * math.pi * 2.2):.2f}" for x in range(0, 211, 2))
    s.append(f'<path d="{d}" fill="none" stroke="#ffd59a" stroke-width="1.5"/>')
    d2 = "M" + " L".join(f"{x:.1f},{22 + 5 * math.sin(x / 210 * math.pi * 1.4 + 1):.2f}" for x in range(0, 211, 2))
    s.append(f'<path d="{d2}" fill="none" stroke="#f2a07b" stroke-width="3.4" opacity=".35"/>')
    s.append('<text x="0" y="44" font-family="Arimo" font-weight="700" font-size="2.8" letter-spacing=".6" fill="#e8f4f1">КОРОТКИЕ ВОКАЛЬНЫЕ ЭЛЕМЕНТЫ — ПУЛЬС</text>')
    s.append('<text x="210" y="5" text-anchor="end" font-family="Arimo" font-weight="700" font-size="2.8" letter-spacing=".6" fill="#ffd59a">CHRIS BROWN — ДЛИННАЯ ЛИНИЯ</text>')
    s.append('<text x="210" y="44" text-anchor="end" font-family="Arimo" font-weight="700" font-size="2.8" letter-spacing=".6" fill="#f2a07b">KID CUDI — ТЁПЛЫЙ СЛОЙ</text>')
    s.append("</svg>")
    chart = "".join(s)
    title = """
<svg width="230mm" height="74mm" viewBox="0 0 230 74">
  <defs><path id="wv" d="M0,50 C 45,18 85,18 120,42 S 195,66 236,34"/></defs>
  <text font-family="Playfair" font-weight="900" font-style="italic" font-size="31" fill="#f4fbf9" letter-spacing=".5">
    <textPath href="#wv" startOffset="2">Waves don’t die</textPath></text>
</svg>"""
    css = """
#t10{background:linear-gradient(180deg,#0b2f3c 0%,#11505f 42%,#2e8c99 78%,#9fd2cf 100%);color:#e8f4f1}
#t10 .k{position:absolute;left:20mm;top:18mm;color:#ffd59a}
#t10 .ttl{position:absolute;left:10mm;top:20mm}
#t10 .sub{position:absolute;left:20mm;top:92mm;font:italic 300 16pt/1.2 'Cormorant Garamond';color:#ffd59a}
#t10 .chart{position:absolute;left:20mm;top:102mm}
#t10 .meta{position:absolute;left:178mm;top:150mm;width:52mm}
#t10 .dict{position:absolute;left:178mm;top:196mm;width:52mm;font:400 8pt/1.35 'EB Garamond';color:#0b2f3c;background:#f4fbf9;padding:3mm}
#t10 .dict b{font:700 13pt/1 'Playfair';font-style:italic;display:block;margin-bottom:1mm}
#t10 .dict i{font-style:italic;opacity:.75}
#t10 .txt{position:absolute;left:20mm;top:152mm;width:150mm;height:78mm;font-size:10.8pt;color:#f1faf8}
"""
    text = P(
        "В <i>Waves</i> голос снова превращается в музыкальное пространство. Короткие вокальные элементы образуют пульсирующий фон; поверх этой дробности тянется длинная линия Chris Brown; Kid Cudi добавляет более тёплый, телесный оттенок. Напряжение между нарезанным и протяжённым создаёт ощущение накатывания.<sup class=\"fn\">14</sup>",
        "Метафору волны поддерживает сама фактура. Отдельные элементы исчезают и возвращаются, а переживание будто продолжается за пределами конкретной фразы.",
        "Обещание «Waves don’t die» можно услышать как надежду на сохранение эмоционального следа. Рядом удивительно точно работает слово <i>crash</i>: в нём и удар разбивающейся волны, и разговорная просьба ненадолго остаться у другого человека. Огромная природная метафора прячет очень простую потребность в убежище.<sup class=\"fn\">15</sup>",
        "<i>Waves</i> достигает редкого для этого альбома состояния: желание на несколько минут перестаёт звучать как требование власти. Подъём позволяет пережить близость, не превращая её немедленно в конфликт. Неслучайно 26 января 2016 года <i>WAVES</i> назывался весь альбом.",
    )
    body = (
        '<div class="k kicker">10 / 20 · Часть II</div>'
        + f'<div class="ttl">{title}</div>'
        + '<div class="sub">' + typo("Волны не умирают", False) + '</div>'
        + f'<div class="chart">{chart}</div>'
        + f'<div class="txt prose cols" style="--fn:#ffd59a">{text}</div>'
        + f'<div class="meta">{track_meta(tr, color="#e8f4f1", dim="rgba(232,244,241,.25)")}</div>'
        + '<div class="dict"><b>crash</b><i>англ., гл.</i><br>1. ' + typo("разбиться — о волне, налетевшей на берег;", False) + '<br>2. <i>разг.</i> ' + typo("переночевать у кого-то, остаться ненадолго.", False) + '</div>'
        + folio(right="10 · Waves", color="#e8f4f1")
    )
    return page("t10", body, css=css)


def pages():
    return [part2(), t06(), t07(), t08(), t09(), t10()]
