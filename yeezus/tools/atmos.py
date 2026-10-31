"""Atmospheric raster layers (light, fog, bloom, dust) for the Yeezus book.
Coordinates are given in millimetres on an A4 page (210 x 297)."""
import numpy as np, sys, os
from PIL import Image, ImageFilter

DPI = 150
W, H = int(round(210 / 25.4 * DPI)), int(round(297 / 25.4 * DPI))
MM = W / 210.0
OUT = 'assets'
rng = np.random.default_rng(7)
YY, XX = np.mgrid[0:H, 0:W].astype(np.float32) / MM  # mm grid


def C(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def canvas(col): return np.ones((H, W, 3), np.float32) * C(col)


def vgrad(stops):
    out = np.zeros((H, W, 3), np.float32); y = YY / 297
    for (a, ca), (b, cb) in zip(stops[:-1], stops[1:]):
        m = (y >= a) & (y <= b); t = np.clip((y - a) / (b - a + 1e-6), 0, 1)
        out += m[..., None] * (C(ca) * (1 - t[..., None]) + C(cb) * t[..., None])
    return out


def noise(scale_mm, octaves=5, pers=.55, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    out = np.zeros((H, W), np.float32); amp = 1; tot = 0; sc = scale_mm * MM
    for _ in range(octaves):
        gw, gh = max(2, int(W / sc) + 3), max(2, int(H / sc) + 3)
        g = (r.random((gh, gw)) * 255).astype(np.uint8)
        img = np.asarray(Image.fromarray(g).resize((W, H), Image.BICUBIC), np.float32) / 255
        out += img * amp; tot += amp; amp *= pers; sc /= 2
    return out / tot


def _box(a, r, axis):
    if r < 1: return a
    pad = [(0, 0)] * a.ndim; pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(a, pad, mode='edge'), axis=axis, dtype=np.float64)
    n = a.shape[axis]
    hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis); lo = np.take(c, np.arange(0, n), axis=axis)
    return ((hi - lo) / (2 * r + 1)).astype(np.float32)


def blur(a, r_mm):
    """approximate gaussian via 3 box passes (sigma = r_mm)"""
    s = max(.5, r_mm * MM); r = max(1, int(round(np.sqrt(12 * s * s / 3 + 1) / 2 - .5)))
    out = a.astype(np.float32)
    for _ in range(3):
        out = _box(out, r, 0); out = _box(out, r, 1)
    return out


def glow(img, cx, cy, r, col, k=1.0, p=2.0):
    d = np.sqrt((XX - cx) ** 2 + (YY - cy) ** 2) / r
    img += np.exp(-d ** p * 2.0)[..., None] * C(col) * k


def beam(img, a, b, w0, w1, col, k=1.0, fade=(0.0, 1.0), soft=2.2, mod=None):
    ax, ay = a; bx, by = b; dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy
    t = ((XX - ax) * dx + (YY - ay) * dy) / L2
    px, py = ax + t * dx, ay + t * dy
    dist = np.sqrt((XX - px) ** 2 + (YY - py) ** 2)
    w = w0 + (w1 - w0) * np.clip(t, 0, 1)
    f = np.exp(-(dist / w) ** 2 * soft) * ((t > 0) & (t < 1.05))
    f *= np.clip(1 - np.abs(t - (fade[0] + fade[1]) / 2) / ((fade[1] - fade[0]) / 2 + 1e-6), 0, 1) ** .6 if fade != (0.0, 1.0) else (1 - np.clip(t, 0, 1) * .55)
    if mod is not None: f *= mod
    img += f[..., None] * C(col) * k


def dust(img, n, x0, y0, x1, y1, col, k=1.0, size=.25, seed=1, weight=None):
    r = np.random.default_rng(seed); layer = np.zeros((H, W), np.float32)
    xs = r.uniform(x0, x1, n); ys = r.uniform(y0, y1, n); vs = r.uniform(.3, 1, n)
    for x, y, v in zip(xs, ys, vs):
        if weight is not None and r.random() > weight(x, y): continue
        ix, iy = int(x * MM), int(y * MM)
        if 0 <= ix < W and 0 <= iy < H: layer[iy, ix] += v
    layer = blur(layer, size) * (size * MM) ** 2 * 3
    img += np.clip(layer, 0, 3)[..., None] * C(col) * k


def bloom(img, thr=.7, r=6, k=.6):
    bright = np.clip(img - thr, 0, None)
    img += blur(bright, r) * k + blur(bright, r * 3) * k * .5


def vignette(img, k=.45, cx=105, cy=148):
    d = np.sqrt(((XX - cx) / 150) ** 2 + ((YY - cy) / 190) ** 2)
    img *= (1 - k * np.clip(d, 0, 1.4) ** 2)[..., None]


def grain(img, k=.035, seed=3):
    r = np.random.default_rng(seed); img += (r.standard_normal((H, W, 1)).astype(np.float32)) * k


def chroma(img, px=2):
    img[..., 0] = np.roll(img[..., 0], px, 1); img[..., 2] = np.roll(img[..., 2], -px, 1)


def save(img, name, q=88):
    a = np.clip(img, 0, 1) ** (1 / 1.0)
    Image.fromarray((a * 255 + .5).astype(np.uint8), 'RGB').save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)
    print('  ', name)


def pts_on_ellipse_mask(cx, cy, rx, ry):
    return (((XX - cx) / rx) ** 2 + ((YY - cy) / ry) ** 2) <= 1
