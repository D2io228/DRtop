import numpy as np
from PIL import Image, ImageFilter
W, H = 1240, 1754  # A4 @150dpi
rng = np.random.default_rng(2013)
def vnoise(w, h, scale, oct=5, pers=.55):
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(oct):
        gw, gh = max(2, int(w / scale) + 2), max(2, int(h / scale) + 2)
        g = rng.random((gh, gw))
        img = Image.fromarray((g * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
        out += np.asarray(img).astype(float) / 255 * amp; tot += amp
        amp *= pers; scale /= 2
    return out / tot
def save(arr, name, q=86):
    arr = np.clip(arr, 0, 255).astype('uint8')
    Image.fromarray(arr, 'RGB').save('assets/' + name, quality=q, optimize=True, progressive=True)
def grad(h, w, stops):
    ys = np.linspace(0, 1, h)[:, None]
    out = np.zeros((h, w, 3))
    for i in range(len(stops) - 1):
        (a, ca), (b, cb) = stops[i], stops[i + 1]
        m = (ys >= a) & (ys <= b)
        t = np.where(m, (ys - a) / (b - a + 1e-9), 0)
        for c in range(3): out[..., c] += np.where(m, ca[c] + (cb[c] - ca[c]) * t, 0)
    return out
yy, xx = np.mgrid[0:H, 0:W] / W

# --- t1: acid static (top 198mm only, but render full) ---
n = rng.random((H // 2, W // 2)); n = np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((W, H), Image.NEAREST)).astype(float) / 255
rows = rng.random(H)[:, None]
band = vnoise(W, H, 300, 3)
v = n * 0.55 + rows * 0.25 + band * 0.3
v = np.clip((v - 0.35) * 1.8, 0, 1) ** 2.2
tear = (rng.random(H) < 0.02)[:, None] * rng.random((H, 1)) * 0.9
img = np.zeros((H, W, 3))
img[..., 0] = 10 + v * 225 + tear[:, :1] * 120
img[..., 1] = 8 + v * 28 + tear[:, :1] * 60
img[..., 2] = 8 + v * 22 + tear[:, :1] * 50
# horizontal shift glitch
for _ in range(40):
    y0 = rng.integers(0, H - 40); h = rng.integers(3, 40); s = rng.integers(-120, 120)
    img[y0:y0 + h] = np.roll(img[y0:y0 + h], s, axis=1)
vign = 1 - 0.55 * ((xx - .5) ** 2 + (yy * W / H - .45) ** 2 * 1.2)
img *= vign[..., None]
save(img, 't1-static.jpg', 80)

# --- t5: smoky amber night with bokeh ---
f = vnoise(W, H, 500, 6)
img = grad(H, W, [(0, (24, 15, 9)), (.55, (16, 10, 7)), (1, (9, 6, 4))])
img += (f[..., None] - .45) * np.array([60, 36, 18])
def blob(cx, cy, r, col, k=1.0):
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    return np.exp(-d ** 2 * 2.2)[..., None] * np.array(col) * k
img += blob(.80, .14, .09, (255, 190, 110), .9) + blob(.92, .17, .07, (255, 200, 130), .8)
img += blob(.86, .155, .25, (160, 90, 30), .35)
for _ in range(26):
    cx, cy, r = rng.random(), rng.random() * .5, rng.uniform(.008, .03)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    m = np.clip((r - d) / (r * .18), 0, 1)
    img += m[..., None] * np.array([230, 150, 70]) * rng.uniform(.05, .22)
save(img, 't5-smoke.jpg')

# --- t6: red heat haze ---
f = vnoise(W, H, 420, 6); f2 = vnoise(W, H, 160, 4)
cx, cy = .52, .47 * W / W
d = np.sqrt((xx - .515) ** 2 + (yy - .67) ** 2)
img = np.zeros((H, W, 3))
core = np.exp(-d ** 2 * 6)
img[..., 0] = 18 + core * 150 + f * 70 + f2 * 25
img[..., 1] = 3 + core * 20 + f * 8
img[..., 2] = 4 + core * 18 + f * 10
save(img, 't6-heat.jpg')

# --- t8: blue mist ---
f = vnoise(W, H, 600, 6)
img = grad(H, W, [(0, (5, 8, 18)), (.5, (8, 14, 30)), (.8, (22, 34, 58)), (1, (10, 16, 30))])
mist = np.clip((f - .42) * 2.2, 0, 1) * np.clip((yy * W / H - .45) * 2.2, 0, 1)
img += mist[..., None] * np.array([70, 90, 130])
img += (vnoise(W, H, 90, 3)[..., None] - .5) * 10
save(img, 't8-mist.jpg')
print('ok')
