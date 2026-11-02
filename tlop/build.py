#!/usr/bin/env python3
"""Assemble the TLOP booklet into build/tlop.html and render it to PDF.

usage: python3 build.py [--no-pdf] [--shots] [--pages id1,id2]
"""
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import pages_front  # noqa: E402
import pages_part1  # noqa: E402
import pages_part2  # noqa: E402
import pages_part3  # noqa: E402
import pages_part4  # noqa: E402
import pages_back  # noqa: E402

USED_FONTS = {
    "EB Garamond", "Cormorant Garamond", "Arimo", "Inter Tight", "IBM Plex Mono",
    "UnifrakturCook", "UnifrakturMaguntia", "Monomakh", "Ponomar", "Caveat",
    "Playfair", "Rubik Glitch", "Rubik Broken Fax", "Climate Crisis", "Overpass",
    "Ledger", "Tenor Sans", "Dela Gothic One", "Press Start 2P", "Tiny5",
    "Sofia Sans Extra Condensed", "Yeseva One", "Unbounded", "Handjet", "Oswald",
    "Bodoni Moda", "Golos Text", "Alice", "Rubik Dirt", "Rubik Wet Paint", "Ysabeau", "Grenze Gotisch",
}


def font_css():
    css = open(os.path.join(HERE, "fonts", "fonts.css"), encoding="utf-8").read()
    blocks = re.findall(r"@font-face\s*{[^}]*}", css)
    keep = []
    for b in blocks:
        fam = re.search(r"font-family:\s*'([^']+)'", b).group(1)
        if fam in USED_FONTS:
            keep.append(b.replace("url(files/", "url(../fonts/files/"))
    # symbol glyphs (arrows, ≈, ∞, ○) are missing from the Google subsets:
    # add a sibling face with IDENTICAL descriptors to every real face so the
    # browser treats it as part of the same composite font (unicode-range).
    sym = []
    seen = set()
    for b in keep:
        fam = re.search(r"font-family:\s*'([^']+)'", b).group(1)
        style = re.search(r"font-style:\s*([a-z]+)", b).group(1)
        weight = re.search(r"font-weight:\s*([0-9 ]+);", b).group(1).strip()
        stretch = re.search(r"font-stretch:\s*([0-9.% ]+);", b)
        stretch = stretch.group(1).strip() if stretch else ""
        key = (fam, style, weight, stretch)
        if key in seen:
            continue
        seen.add(key)
        heavy = int(weight.split()[0]) >= 600 if " " not in weight else False
        src = "sym_inter700.woff2" if heavy else "sym_inter400.woff2"
        sym.append(
            f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};"
            + (f"font-stretch:{stretch};" if stretch else "")
            + f"src:url(../fonts/files/{src}) format('woff2');"
            f"unicode-range:U+2190-21FF,U+221E,U+2248,U+25CB;}}")
    return "\n".join(keep + sym)


def main():
    args = sys.argv[1:]
    only = None
    if "--pages" in args:
        only = set(args[args.index("--pages") + 1].split(","))
    pages = []
    for mod in (pages_front, pages_part1, pages_part2, pages_part3, pages_part4, pages_back):
        pages.extend(mod.pages())
    ids = [re.search(r'id="([^"]+)"', p).group(1) for p in pages]
    index = {pid: i + 1 for i, pid in enumerate(ids)}
    pages = [p.replace("{{N}}", f"{i + 1:02d}") for i, p in enumerate(pages)]
    pages = [re.sub(r"\{\{P:([\w-]+)\}\}", lambda m: str(index.get(m.group(1), "??")), p) for p in pages]
    if only:
        pages = [p for p, pid in zip(pages, ids) if pid in only]
    base = open(os.path.join(HERE, "css", "base.css"), encoding="utf-8").read()
    doc = f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>The Life of Pablo — Автопортрет, который невозможно закончить</title>
<style>{font_css()}</style>
<style>{base}</style>
</head><body>
{''.join(pages)}
</body></html>"""
    os.makedirs(os.path.join(HERE, "build"), exist_ok=True)
    out_html = os.path.join(HERE, "build", "tlop.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(doc)
    print("html:", out_html, len(doc) // 1024, "KB,", len(pages), "pages")
    if "--no-pdf" in args:
        return
    cmd = ["node", os.path.join(HERE, "tools", "render.js"), out_html,
           os.path.join(HERE, "build", "tlop_raw.pdf")]
    if "--shots" in args:
        cmd += ["--shots", os.path.join(HERE, "build", "shots")]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    main()
