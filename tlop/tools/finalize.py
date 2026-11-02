#!/usr/bin/env python3
"""Add metadata, bookmarks and viewer preferences to the rendered PDF."""
import re
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import BooleanObject, DictionaryObject, NameObject

src, html, dst = sys.argv[1], sys.argv[2], sys.argv[3]
ids = re.findall(r'<section class="page[^"]*" id="([^"]+)"', open(html, encoding="utf-8").read())
idx = {pid: i for i, pid in enumerate(ids)}

reader = PdfReader(src)
assert len(reader.pages) == len(ids), (len(reader.pages), len(ids))
w = PdfWriter(clone_from=reader)
w.add_metadata({
    "/Title": "The Life of Pablo — автопортрет, который невозможно закончить",
    "/Subject": "Эссе об альбоме Канье Уэста The Life of Pablo (2016): двадцать треков, три Пабло и один телефонный звонок",
    "/Keywords": "The Life of Pablo, Kanye West, TLOP, Павел, Пикассо, Эскобар, эссе, буклет",
    "/Creator": "HTML · CSS · SVG → Chromium",
})
top = [
    ("Обложка", "cover"), ("Как читать", "inside"), ("Содержание", "contents"),
    ("Пролог · Звонок", "pro-call"), ("Три Пабло", "pablos-a"), ("Обложка альбома · Which / One", "cover-anat"),
    ("Тертий, писавший сие послание", "authorship"),
]
for title, pid in top:
    w.add_outline_item(title, idx[pid])
parts = [
    ("I · Хор и сигнал", "part1", [(1, "t01a"), (2, "t02"), (3, "t03"), (4, "t04a"), (5, "t05")]),
    ("II · Приглушённый свет", "part2", [(6, "t06"), (7, "t07"), (8, "t08"), (9, "t09"), (10, "t10")]),
    ("III · Свет без тепла", "part3", [(11, "t11"), (12, "t12a"), (13, "t13a"), (14, "t14")]),
    ("IV · Запись ещё идёт", "part4", [(15, "t15"), (16, "t16"), (17, "t17a"), (18, "t18"), (19, "t19"), (20, "t20a")]),
]
names = {1: "Ultralight Beam", 2: "Father Stretch My Hands Pt. 1", 3: "Pt. 2", 4: "Famous", 5: "Feedback",
         6: "Low Lights", 7: "Highlights", 8: "Freestyle 4", 9: "I Love Kanye", 10: "Waves", 11: "FML",
         12: "Real Friends", 13: "Wolves", 14: "Frank’s Track", 15: "Siiiiiiiiilver Surffffeeeeer Intermission",
         16: "30 Hours", 17: "No More Parties in LA", 18: "Facts (Charlie Heat Version)", 19: "Fade", 20: "Saint Pablo"}
for title, pid, kids in parts:
    parent = w.add_outline_item(title, idx[pid])
    for n, kid in kids:
        w.add_outline_item(f"{n:02d} · {names[n]}", idx[kid], parent=parent)
for title, pid in [("Эпилог · Шов", "epi-a"), ("Эпилог · Телефон звонит", "epi-c"),
                   ("Источники и колофон", "sources"), ("Задняя обложка", "back")]:
    w.add_outline_item(title, idx[pid])
w.page_mode = "/UseOutlines"
vp = DictionaryObject()
vp[NameObject("/DisplayDocTitle")] = BooleanObject(True)
w._root_object[NameObject("/ViewerPreferences")] = vp
w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
with open(dst, "wb") as f:
    w.write(f)
print("final:", dst, len(w.pages), "pages")
