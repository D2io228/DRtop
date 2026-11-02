#!/usr/bin/env python3
"""Download Google Fonts (all unicode subsets) as local woff2 + a fonts.css.

Usage: python3 fetch_fonts.py OUT_DIR "Family:spec" ...
"""
import hashlib
import os
import re
import sys
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    out = sys.argv[1]
    specs = sys.argv[2:]
    os.makedirs(os.path.join(out, "files"), exist_ok=True)
    css_all = []
    for spec in specs:
        q = urllib.parse.quote(spec, safe=":,;@.")
        url = f"https://fonts.googleapis.com/css2?family={q}&display=block"
        try:
            css = get(url).decode("utf-8")
        except Exception as e:  # noqa: BLE001
            print(f"FAIL {spec}: {e}")
            continue
        def repl(m):
            src = m.group(1)
            ext = os.path.splitext(urllib.parse.urlparse(src).path)[1] or ".woff2"
            name = hashlib.sha1(src.encode()).hexdigest()[:16] + ext
            path = os.path.join(out, "files", name)
            if not os.path.exists(path):
                with open(path, "wb") as f:
                    f.write(get(src))
            return f"url(files/{name})"
        css = re.sub(r"url\((https://[^)]+)\)", repl, css)
        css_all.append(f"/* ===== {spec} ===== */\n{css}")
        n = css.count("@font-face")
        print(f"ok   {spec}  ({n} faces)")
    with open(os.path.join(out, "fonts.css"), "w") as f:
        f.write("\n".join(css_all))


if __name__ == "__main__":
    main()
