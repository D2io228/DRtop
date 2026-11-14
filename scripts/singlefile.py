"""Turn dist-offline/ into ONE self-contained HTML file (JS, CSS and images inlined).

Usage: python3 scripts/singlefile.py dist-offline Haven.html
Images (WebP as-is, JPEG re-encoded smaller) are embedded as data URIs in window.__ASSETS.
"""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image

src, out = Path(sys.argv[1]), Path(sys.argv[2])
html = (src / 'index.html').read_text()

assets = {}
for f in sorted(src.rglob('*')):
    rel = f.relative_to(src).as_posix()
    if f.suffix == '.png' and rel.startswith('flags/'):
        assets[rel] = 'data:image/png;base64,' + base64.b64encode(f.read_bytes()).decode()
    elif f.suffix == '.webp':
        assets[rel] = 'data:image/webp;base64,' + base64.b64encode(f.read_bytes()).decode()
    elif f.suffix == '.jpg':
        im = Image.open(f).convert('RGB')
        small = rel.startswith('av/') or re.fullmatch(r'img/p\d+\.jpg', rel)
        im.thumbnail((180, 180) if small else (620, 620))
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=64, optimize=True, progressive=True)
        assets[rel] = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

def inline_css(m):
    return '<style>' + (src / m.group(1).lstrip('./')).read_text() + '</style>'

def inline_js(m):
    js = (src / m.group(1).lstrip('./')).read_text().replace('</script', '<\\/script')
    return '<script>window.__ASSETS=' + json.dumps(assets) + '</script>\n<script type="module">' + js + '</script>'

html = re.sub(r'<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', inline_css, html)
html = re.sub(r'<script type="module"[^>]*src="([^"]+)"[^>]*></script>', inline_js, html)
assert 'src="./assets' not in html and 'href="./assets' not in html
out.write_text(html)
print(f'{out}: {out.stat().st_size / 1e6:.1f} MB, {len(assets)} images embedded')
