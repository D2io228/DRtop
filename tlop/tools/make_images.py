#!/usr/bin/env python3
"""Generate print-style derivatives (halftone duotones, photocopies, textures)
from the public-domain source paintings in img/src.

Run from repo root:  python3 -I tlop/tools/make_images.py
"""
import math
import os

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "img", "src")
OUT = os.path.join(ROOT, "img")
RNG = np.random.default_rng(1661)


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def load_gray(name, box=None, size=None, gamma=1.0, lo=0.0, hi=1.0, blur=0.0):
    im = Image.open(os.path.join(SRC, name)).convert("L")
    if box:
        im = im.crop(box)
    if size:
        im = im.resize(size, Image.LANCZOS)
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255.0
    a = np.clip((a - lo) / max(hi - lo, 1e-6), 0, 1) ** gamma
    return a


def dot_screen(h, w, cell, angle_deg):
    """Classic round-dot AM screen: returns threshold map in [0,1]."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = math.radians(angle_deg)
    u = (xx * math.cos(t) + yy * math.sin(t)) / cell
    v = (-xx * math.sin(t) + yy * math.cos(t)) / cell
    fu = u - np.floor(u) - 0.5
    fv = v - np.floor(v) - 0.5
    # euclidean dot: grows as a circle, merges into checker at 50%
    d = np.sqrt(fu * fu + fv * fv) / math.sqrt(0.5)
    return np.clip(d, 0, 1)


def halftone(a, cell=7.0, angle=45, noise=0.06):
    """a: lightness in [0,1] (1 = paper). returns bool ink mask."""
    h, w = a.shape
    scr = dot_screen(h, w, cell, angle)
    darkness = 1.0 - a
    darkness = darkness + RNG.normal(0, noise, a.shape).astype(np.float32) * 0.5
    return darkness > scr


def two_color(mask, ink, paper, out, transparent_paper=False):
    h, w = mask.shape
    if transparent_paper:
        rgba = np.zeros((h, w, 4), np.uint8)
        rgba[mask] = (*hexrgb(ink), 255)
        Image.fromarray(rgba, "RGBA").save(out, optimize=True)
    else:
        pal = Image.fromarray(mask.astype(np.uint8), "P")
        pal.putpalette([*hexrgb(paper), *hexrgb(ink)] + [0] * 762)
        pal.save(out, optimize=True)
    print("wrote", os.path.relpath(out, ROOT), f"{w}x{h}", os.path.getsize(out) // 1024, "KB")


def photocopy(a, thresh=0.5, noise=0.18, grain=1.2):
    """Xerox look: hard threshold with clumpy toner noise."""
    h, w = a.shape
    n = RNG.normal(0, 1, (h // 2 + 1, w // 2 + 1)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)).astype(np.float32)
    n = (n - 128) / 40 * noise
    fine = RNG.normal(0, noise * 0.4, (h, w)).astype(np.float32)
    return (1.0 - a + n + fine) > (1.0 - thresh)


def _periodic_noise(n, sigma_px, rng):
    """Gaussian-filtered white noise via FFT -> seamlessly tileable."""
    w = rng.normal(0, 1, (n, n)).astype(np.float32)
    f = np.fft.fftfreq(n)
    fx, fy = np.meshgrid(f, f)
    k = np.exp(-(fx ** 2 + fy ** 2) * (2 * (math.pi * sigma_px) ** 2))
    out = np.real(np.fft.ifft2(np.fft.fft2(w) * k))
    out /= out.std() + 1e-9
    return out


def paper_texture(out, size=1024, base=248):
    """Fine, seamless paper tile for multiply blending (grayscale, light)."""
    n = size
    grain = _periodic_noise(n, 0.7, RNG)
    mid = _periodic_noise(n, 6, RNG)
    low = _periodic_noise(n, 60, RNG)
    fib = np.zeros((n, n), np.float32)
    for _ in range(700):
        x, y = RNG.uniform(0, n), RNG.uniform(0, n)
        ang = RNG.uniform(0, math.pi)
        ln = RNG.uniform(6, 30)
        amp = RNG.uniform(0.4, 1.0)
        for t in np.linspace(0, ln, int(ln * 2)):
            xi = int(x + t * math.cos(ang)) % n
            yi = int(y + t * math.sin(ang)) % n
            fib[yi, xi] = max(fib[yi, xi], amp)
    v = base + grain * 3.2 + mid * 1.6 + low * 2.4 - fib * 7.0
    v = v.clip(0, 255).astype(np.uint8)
    Image.fromarray(v, "L").save(out, quality=88)
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB", "mean", float(v.mean()))

def grain_texture(out, size=700, alpha=0.22):
    """Transparent dark grain for overlays (PNG with alpha)."""
    a = RNG.random((size, size)).astype(np.float32)
    mask = a > 0.86
    rgba = np.zeros((size, size, 4), np.uint8)
    rgba[mask, 3] = (RNG.random(mask.sum()) * 255 * alpha).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(out, optimize=True)
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")


def main():
    os.makedirs(OUT, exist_ok=True)
    ORANGE, INK, CREAM = "#f28a55", "#120f0d", "#f4efe6"

    # 1. Rembrandt, Self-Portrait as the Apostle Paul (1661) -- face, cover slot
    a = load_gray("rembrandt_paul.jpg", box=(330, 140, 1290, 1100), size=(1300, 1300), gamma=0.85, lo=0.03, hi=0.80)
    two_color(halftone(a, cell=8.5, angle=45), INK, ORANGE, os.path.join(OUT, "rembrandt_face_orange.png"))

    # 2. Caravaggio, Conversion on the Way to Damascus (1601)
    # lower band: Paul on the ground, arms stretched up
    a = load_gray("caravaggio_damascus.jpg", box=(0, 1250, 1920, 2523), size=(2200, 1459), gamma=0.75, lo=0.02, hi=0.82)
    two_color(halftone(a, cell=8.0, angle=45), INK, "#f6c66b", os.path.join(OUT, "caravaggio_arms_gold.png"))

    # 3. textures
    paper_texture(os.path.join(OUT, "paper.jpg"))


if __name__ == "__main__" and len(__import__("sys").argv) == 1:
    main()


def tv_static(out, w=900, h=300):
    """Black-and-white TV static with scanlines (for Pt. 2)."""
    a = RNG.random((h, w)).astype(np.float32)
    rows = RNG.random((h, 1)).astype(np.float32) * 0.35
    a = np.clip(a * 0.85 + rows, 0, 1)
    a[::3, :] *= 0.55
    img = Image.fromarray((a * 255).astype(np.uint8), "L")
    img.save(out, optimize=True)
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")


def newsprint_dots(out, size=600, cell=6, ink=(40, 34, 30), alpha=38):
    """Faint halftone dot screen tile (tabloid paper) with alpha."""
    h = w = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = math.radians(15)
    u = (xx * math.cos(t) + yy * math.sin(t)) / cell
    v = (-xx * math.sin(t) + yy * math.cos(t)) / cell
    fu = u - np.floor(u) - 0.5
    fv = v - np.floor(v) - 0.5
    d = np.sqrt(fu * fu + fv * fv)
    m = d < 0.22
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[m] = (*ink, alpha)
    Image.fromarray(rgba, "RGBA").save(out, optimize=True)
    print("wrote", os.path.relpath(out, ROOT), os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__" and len(__import__("sys").argv) > 1 and __import__("sys").argv[1] == "extra":
    tv_static(os.path.join(OUT, "static.png"))
    newsprint_dots(os.path.join(OUT, "newsdots.png"))


def engraving_threshold(name, box, size, ink, paper, out, thr=0.58, invert=False, blur=0.0):
    a = load_gray(name, box=box, size=size, blur=blur)
    m = a < thr
    if invert:
        two_color(m, ink, paper, out)  # m = line pixels drawn in ink
    else:
        two_color(m, ink, paper, out)


if __name__ == "__main__" and len(__import__("sys").argv) > 1 and __import__("sys").argv[1] == "met":
    # Etienne Picart after Ciro Ferri, Saints Peter and Paul in prison (The Met, CC0)
    engraving_threshold("met_815779.jpg", (235, 1150, 2218, 3330), (1700, 1869),
                        "#dce6f0", "#13223a", os.path.join(OUT, "picart_prison_cyan.png"), thr=0.6, blur=0.4)
