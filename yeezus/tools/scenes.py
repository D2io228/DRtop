"""Generate all atmospheric raster scenes. Run from the yeezus/ folder:
   python3 tools/scenes.py [name ...]"""
import sys, math
sys.path.insert(0, 'tools')
from atmos import *
from PIL import ImageDraw

def poly_mask(pts, ss=2):
    im = Image.new('L', (W * ss, H * ss), 0); d = ImageDraw.Draw(im)
    d.polygon([(x * MM * ss, y * MM * ss) for x, y in pts], fill=255)
    return np.asarray(im.resize((W, H), Image.LANCZOS), np.float32) / 255

def shapes_mask(draw_fn, ss=3):
    im = Image.new('L', (W * ss, H * ss), 0); d = ImageDraw.Draw(im)
    draw_fn(d, MM * ss)
    return np.asarray(im.resize((W, H), Image.LANCZOS), np.float32) / 255

def over(img, mask, col, k=1.0):
    m = (mask * k)[..., None]; img[:] = img * (1 - m) + C(col) * m if isinstance(col, str) else img * (1 - m) + col * m

def mountain_pts(peak, base=297, seed=1, crater=False, jag=3.0):
    r = np.random.default_rng(seed); pts = [(-8, base), (-8, base - 10)]; x = -8
    while x < 105:
        x += r.uniform(3, 8); t = min(1, (x + 8) / 113); y = base - 10 + (peak - base + 10) * t ** 1.15 + r.uniform(-jag, jag)
        pts.append((min(x, 105 - (8 if crater else 0)), y))
    if crater: pts += [(97, peak + 2), (113, peak + 2)]; x = 113
    else: pts.append((105, peak)); x = 105
    while x < 218:
        x += r.uniform(3, 8); t = min(1, (x - 105) / 113); y = peak + (base - 8 - peak) * t ** .9 + r.uniform(-jag, jag); pts.append((x, y))
    pts.append((218, base)); return pts

S = {}
def scene(f): S[f.__name__] = f; return f

# ------------------------------------------------------------------ cover / back
def studio(flip=False):
    img = vgrad([(0, '#F2F1EE'), (.55, '#E6E5E1'), (1, '#CBCAC6')])
    glow(img, 40 if not flip else 170, 30, 160, '#FFFFFF', .18)
    x0, y0, w, h = 31, 50, 148, 131
    sh = poly_mask([(x0 + 4, y0 + 10), (x0 + w + 6, y0 + 10), (x0 + w + 6, y0 + h + 12), (x0 + 4, y0 + h + 12)])
    img *= (1 - blur(sh, 6) * .30)[..., None]
    img *= (1 - blur(poly_mask([(x0 + 1, y0 + h - 2), (x0 + w + 1, y0 + h - 2), (x0 + w + 2, y0 + h + 3), (x0, y0 + h + 3)]), 1.5) * .25)[..., None]
    # rainbow caustic thrown by the disc
    cx, cy = (172, 214) if not flip else (40, 214)
    ang = -.35 if not flip else .35
    for i, col in enumerate(['#ff4d4d', '#ffb347', '#fff275', '#7dff9a', '#6ec6ff', '#a98bff']):
        off = (i - 2.5) * 1.6
        beam(img, (cx - 34 * math.cos(ang) + off * math.sin(ang), cy - 34 * math.sin(ang) - off * math.cos(ang)), (cx + 30 * math.cos(ang) + off * math.sin(ang), cy + 30 * math.sin(ang) - off * math.cos(ang)), 1.2, 1.6, col, .10, soft=3)
    glow(img, cx, cy, 30, '#FFFFFF', .06)
    grain(img, .012); return img

@scene
def cover(): save(studio(False), 'cover-bg.jpg', 90)
@scene
def back(): save(studio(True), 'back-bg.jpg', 90)

# ------------------------------------------------------------------ title: the mountain in the fog
@scene
def title():
    img = canvas('#070707')
    fog = noise(80, 5, seed=11)
    beam(img, (150, -20), (128, 196), 4, 26, '#ffffff', .55, mod=.6 + .6 * fog)
    glow(img, 128, 190, 40, '#ffffff', .16)
    m = poly_mask([(p[0] * .9 + 34, p[1] * .55 + 120) for p in mountain_pts(130, 297, seed=4)])
    shade = np.clip(1 - (XX - 128) / 120, .2, 1)
    mount = np.stack([.09 * shade, .09 * shade, .09 * shade], -1)
    img[:] = img * (1 - m[..., None]) + mount * m[..., None]
    rim = np.clip(m - blur(m, .8), 0, 1) * np.exp(-((YY - 205) / 40) ** 2)
    img += rim[..., None] * C('#ffffff') * 1.6
    band = np.exp(-((YY - 262) / 26) ** 2) * (.4 + .8 * fog)
    img += band[..., None] * C('#9a9a9a') * .18
    dust(img, 900, 60, 0, 200, 297, '#ffffff', .9, .18, seed=5)
    vignette(img, .5); grain(img, .02); save(img, 'title-bg.jpg')

# ------------------------------------------------------------------ prologue CRT
@scene
def prologue():
    img = canvas('#060606')
    fog = noise(30, 4, seed=21)
    band = np.exp(-((YY - 114) / 26) ** 2) * (.5 + .7 * fog) * np.clip((XX - 30) / 30, 0, 1)
    img += band[..., None] * C('#E0201B') * .35
    glow(img, 140, 114, 70, '#ff3b2e', .12)
    scr = np.clip(1 - (np.abs(XX - 105) / 108) ** 6 - (np.abs(YY - 114) / 62) ** 6, 0, 1)
    img += scr[..., None] * C('#1a0f0e') * .5
    vignette(img, .6, 105, 114); grain(img, .025); save(img, 'prologue-bg.jpg')

# ------------------------------------------------------------------ context: palace in daylight, lamp at night
@scene
def context():
    img = canvas('#ECE7DF')
    paper = noise(6, 3, seed=31); img += (paper[..., None] - .5) * .04
    glow(img, 50, 120, 120, '#FFF6E6', .12)
    panel = poly_mask([(108, 66), (196, 66), (196, 214), (108, 214)])
    night = canvas('#0E0D0C')
    fog = noise(40, 4, seed=32)
    beam(night, (149.5, 114.5), (152, 202), 4.5, 34, '#FFD7A0', .62, mod=.75 + .5 * fog)
    glow(night, 149, 114, 9, '#FFE7C2', 1.3)
    glow(night, 150, 120, 60, '#C98A45', .16)
    glow(night, 152, 202, 34, '#FFD7A0', .35, p=2.4)
    dust(night, 260, 125, 115, 180, 200, '#FFE3B8', .7, .2, seed=33, weight=lambda x, y: math.exp(-((x - 151) / (10 + (y - 115) * .3)) ** 2))
    img[:] = img * (1 - panel[..., None]) + night * panel[..., None]
    grain(img, .015); save(img, 'context-bg.jpg')

# ------------------------------------------------------------------ sound: spectrogram
@scene
def sound():
    w_mm, h_mm = 174, 100; dpi = 200; w, h = int(w_mm / 25.4 * dpi), int(h_mm / 25.4 * dpi)
    t = np.linspace(0, 1, w)[None, :]; f = np.linspace(1, 0, h)[:, None]  # f=1 top (high)
    r = np.random.default_rng(41)
    A = (t < .45); B = (t >= .45) & (t < .68); Cc = t >= .68
    base = np.zeros((h, w), np.float32)
    # harsh section: saw harmonics with sweeping cutoff + broadband noise
    f0 = .022; cutoff = .35 + .25 * np.sin(t * 40) ** 2
    harm = np.zeros((h, w), np.float32)
    for k in range(1, 40):
        line = np.exp(-((f - k * f0 * (1 + .02 * np.sin(t * 30))) / .0035) ** 2) / k ** .35
        harm += line
    harm *= np.exp(-np.clip(f - cutoff, 0, None) * 6)
    noiseb = r.random((h, w)).astype(np.float32) ** 3 * np.exp(-f * 2.2)
    stut = (np.floor(t * 60) % 2) * .3 + .7
    harsh = (harm * .9 + noiseb * 1.2) * stut
    base += harsh * A + harsh * Cc * 1.05
    # gospel: voices with vibrato, formant stacks, smooth
    g = np.zeros((h, w), np.float32)
    for v, f1 in enumerate([.05, .065, .08, .1]):
        for k in range(1, 14):
            fk = f1 * k * (1 + .006 * np.sin(t * 160 + v))
            amp = np.exp(-((fk - .18) / .12) ** 2) + .6 * np.exp(-((fk - .45) / .1) ** 2)
            g += np.exp(-((f - fk) / .0028) ** 2) * amp * .55
    env = np.sin(np.clip((t - .45) / .23, 0, 1) * np.pi) ** .4
    base += g * B * env
    base += (r.random((h, w)).astype(np.float32) * .05) * np.exp(-f * 3)
    v = np.clip(np.log1p(base * 6) / np.log1p(8), 0, 1)
    v = np.asarray(Image.fromarray((v * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)), np.float32) / 255
    # colormap: black -> deep red -> red -> orange -> cream (gospel area tinted gold)
    stops = [(0, (8, 6, 6)), (.25, (70, 6, 8)), (.5, (200, 28, 22)), (.75, (255, 140, 60)), (1, (255, 240, 210))]
    out = np.zeros((h, w, 3), np.float32)
    for (a, ca), (b, cb) in zip(stops[:-1], stops[1:]):
        m = (v >= a) & (v <= b); tt = np.clip((v - a) / (b - a), 0, 1)
        out += m[..., None] * (np.array(ca) * (1 - tt[..., None]) + np.array(cb) * tt[..., None])
    gold = np.array([1.0, .86, .55])
    out = out * (1 - B[..., None] * .55) + (out.mean(-1, keepdims=True) * gold * 1.15) * (B[..., None] * .55)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save('assets/sound-spec.jpg', quality=90)
    print('   sound-spec.jpg')

# ------------------------------------------------------------------ chapters
def dancers(img, pts, n, seed, col='#F4F1EA', k=1.0):
    r = np.random.default_rng(seed)
    path = [p for p in pts if 0 < p[0] < 210]
    def draw(d, s):
        for _ in range(n):
            i = r.integers(1, len(path) - 1); a, b = path[i - 1], path[i]; t = r.random()
            x = a[0] + (b[0] - a[0]) * t; y = a[1] + (b[1] - a[1]) * t + r.uniform(2, 14)
            hgt = r.uniform(2.2, 3.2) * (.7 + (y - 200) / 300)
            d.polygon([((x - hgt * .22) * s, (y - hgt) * s), ((x + hgt * .22) * s, (y - hgt) * s), ((x + hgt * .38) * s, y * s), ((x - hgt * .38) * s, y * s)], fill=255)
            rr = hgt * .14; d.ellipse([(x - rr) * s, (y - hgt - rr * 2.1) * s, (x + rr) * s, (y - hgt) * s], fill=255)
    m = shapes_mask(draw); over(img, m, col, k)

CH = [dict(peak=228, sc='#2a1410', glow='#E0201B'), dict(peak=212, sc='#151515', glow='#ffffff'), dict(peak=232, sc='#2a0d08', glow='#ff5a1f'),
      dict(peak=220, sc='#141c24', glow='#9fc3ff'), dict(peak=226, sc='#3a3a38', glow='#ffffff')]
def chapter(i):
    c = CH[i]; img = canvas('#060606'); fog = noise(60, 5, seed=50 + i); fog2 = noise(20, 4, seed=60 + i)
    cx, cy, r = 105, 106, 72
    if i == 0:
        for k in range(16):
            a = math.radians(-170 + k * (160 / 15)); beam(img, (105, 226), (105 + math.cos(a) * 330, 226 + math.sin(a) * 330), .5, 2.2, '#ff2a1f', .45, mod=.6 + .6 * fog, soft=3)
    if i == 1:
        for k in range(7):
            a = math.radians(-90 + (k - 3) * 9); beam(img, (105, 205), (105 + math.cos(a) * 300, 205 + math.sin(a) * 300), 1.5, 22, '#ffffff', .22, mod=.5 + .8 * fog)
    if i == 3:
        dust(img, 600, 0, 0, 210, 297, '#ffffff', 1.2, .25, seed=70)
    if i == 4:
        for k in range(11):
            a = math.radians(55 + k * 7); beam(img, (105, -10), (105 + math.cos(a) * 340, -10 + math.sin(a) * 340), 2, 30, '#ffffff', .2, mod=.5 + .8 * fog)
        glow(img, 105, 20, 110, '#ffffff', .35)
    # screen glow
    d = np.sqrt((XX - cx) ** 2 + (YY - cy) ** 2)
    screen = (d < r).astype(np.float32)
    inner = np.exp(-(d / r) ** 2 * 1.6) * screen
    img[:] = img * (1 - screen[..., None] * .85) + (C(c['sc']) * (.6 + .7 * inner[..., None])) * screen[..., None] * .85
    ring = np.exp(-((d - r) / 1.2) ** 2); img += ring[..., None] * C(c['glow']) * .25
    halo = np.exp(-((d - r) / 10) ** 2) * (d > r); img += halo[..., None] * C(c['glow']) * .06
    # mountain
    pts = mountain_pts(c['peak'], seed=80 + i, crater=(i == 2))
    m = poly_mask(pts)
    if i == 3: mcol = vgrad([(0, '#d7e1ea'), (.75, '#c3cfdb'), (1, '#46525e')])
    else: mcol = vgrad([(0, '#202020'), (.7, '#151515'), (1, '#0a0a0a')])
    sh = np.clip(.75 + (XX - 105) / 260 * (-1 if i != 3 else 1) + (fog2 - .5) * .35, .3, 1.2)
    mcol = mcol * sh[..., None]
    img[:] = img * (1 - m[..., None]) + mcol * m[..., None]
    rim = np.clip(m - blur(m, .6), 0, 1)
    img += rim[..., None] * C(c['glow']) * (.9 if i in (0, 2) else .6)
    if i == 2:
        glow(img, 105, c['peak'] + 2, 10, '#ff8a3a', 1.2); glow(img, 105, c['peak'] - 10, 40, '#ff3b1f', .35)
        dust(img, 300, 80, 150, 130, c['peak'], '#ff8a3a', 1.6, .2, seed=91)
        dust(img, 700, 0, 0, 210, 297, '#ffffff', .8, .2, seed=92)
    if i == 4: dancers(img, pts, 46, 101, '#ffffff', .95); glow(img, 105, c['peak'], 30, '#ffffff', .25)
    elif i in (0, 1): dancers(img, pts, 22, 100 + i, '#EDE8DE', .8)
    # base fog over mountain
    fogband = np.clip((YY - 248) / 50, 0, 1) * (.4 + .9 * fog)
    img += fogband[..., None] * (C('#9fb3c8') if i == 3 else C('#8a8a8a')) * (.22 if i != 2 else .12)
    if i == 2: img += fogband[..., None] * C('#ff3b1f') * .08
    vignette(img, .5); grain(img, .02)
    save(img, f'ch{i}-bg.jpg')
for _i in range(5):
    S[f'ch{_i}'] = (lambda i=_i: chapter(i))

# ------------------------------------------------------------------ t1: static top / church light bottom
@scene
def t1():
    img = vgrad([(0, '#120c07'), (.66, '#0e0a06'), (1, '#20160c')])
    fog = noise(30, 5, seed=111)
    for k in range(9):
        x = 18 + k * 22; beam(img, (x + 8, 190), (x - 6, 300), 3, 14, '#FFD9A0', .30, mod=.55 + .8 * fog)
    glow(img, 105, 262, 70, '#F7C77A', .38, p=2.2)
    glow(img, 105, 300, 90, '#FFE8C0', .25)
    dust(img, 900, 0, 196, 210, 297, '#FFE3B0', 1.0, .18, seed=112)
    vignette(img, .35, 105, 260); grain(img, .02)
    save(img, 't1-church.jpg')
    # top: re-tinted static with phosphor glow along the saw wave
    st = np.asarray(Image.open('assets/t1-static.jpg').resize((W, H)), np.float32) / 255
    band = np.exp(-((YY - 96) / 28) ** 2)
    st += band[..., None] * C('#ff2a1f') * .25
    bloom(st, .55, 3, .5); chroma(st, 3); save(st, 't1-top.jpg', 84)

# ------------------------------------------------------------------ t2: point-cloud body under surveillance
def body_points(n=None, seed=7, res=.0045):
    """organic body: smooth union of capsules/ellipsoids sampled on a voxel grid"""
    xs = np.arange(-.45, .45, res, dtype=np.float32); ys = np.arange(-.02, 1.82, res, dtype=np.float32); zs = np.arange(-.2, .24, res, dtype=np.float32)
    Xg, Yg, Zg = np.meshgrid(xs, ys, zs, indexing='ij')
    def cap(a, b, r0, r1):
        a = np.array(a, np.float32); b = np.array(b, np.float32); ba = b - a
        pax, pay, paz = Xg - a[0], Yg - a[1], Zg - a[2]
        h = np.clip((pax * ba[0] + pay * ba[1] + paz * ba[2]) / float(ba @ ba), 0, 1)
        dx, dy, dz = pax - ba[0] * h, pay - ba[1] * h, paz - ba[2] * h
        return np.sqrt(dx * dx + dy * dy + dz * dz) - (r0 + (r1 - r0) * h)
    def ell(c, r):
        qx, qy, qz = (Xg - c[0]) / r[0], (Yg - c[1]) / r[1], (Zg - c[2]) / r[2]
        return (np.sqrt(qx * qx + qy * qy + qz * qz) - 1) * min(r)
    def smin(a, b, k=.045):
        h = np.clip(.5 + .5 * (b - a) / k, 0, 1); return b * (1 - h) + a * h - k * h * (1 - h)
    d = ell((0, 1.655, .01), (.09, .115, .1))
    d = smin(d, cap((0, 1.47, 0), (0, 1.58, .01), .055, .05), .03)
    torso = smin(ell((0, 1.35, 0), (.18, .19, .115)), ell((0, 1.15, .0), (.145, .15, .1)), .07)
    torso = smin(torso, ell((0, .98, 0), (.165, .11, .105)), .06)
    d = smin(d, torso, .05)
    for sg in (-1, 1):
        d = smin(d, ell((sg * .19, 1.44, 0), (.07, .06, .07)), .04)
        d = smin(d, cap((sg * .2, 1.43, 0), (sg * .255, 1.16, .01), .052, .042), .03)
        d = smin(d, cap((sg * .255, 1.16, .01), (sg * .295, .93, .05), .042, .032), .02)
        d = smin(d, ell((sg * .305, .86, .06), (.03, .068, .02)), .02)
        d = smin(d, cap((sg * .085, .97, 0), (sg * .105, .52, .01), .085, .056), .05)
        d = smin(d, cap((sg * .105, .52, .01), (sg * .11, .09, -.01), .055, .036), .025)
        d = smin(d, ell((sg * .112, .04, .05), (.042, .03, .105)), .02)
    band = np.abs(d) < res * .75
    gx, gy, gz = np.gradient(d, res)
    P = np.stack([Xg[band], Yg[band], Zg[band]], 1); N = np.stack([gx[band], gy[band], gz[band]], 1)
    N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-6
    r = np.random.default_rng(seed); P = P + r.uniform(-res / 2, res / 2, P.shape).astype(np.float32)
    P2 = P + r.uniform(-res / 2, res / 2, P.shape).astype(np.float32)
    return np.concatenate([P, P2]), np.concatenate([N, N])

@scene
def t2():
    img = canvas('#050505'); fog = noise(50, 5, seed=121)
    beam(img, (-20, 310), (140, 60), 3, 30, '#ffffff', .22, mod=.4 + .9 * fog)
    beam(img, (240, 300), (138, 70), 3, 26, '#ffffff', .18, mod=.4 + .9 * fog)
    beam(img, (90, 330), (140, 120), 2, 16, '#ffffff', .1, mod=.4 + .9 * fog)
    # floor
    fl = np.clip((YY - 262) / 30, 0, 1) * (.3 + .5 * fog); img += fl[..., None] * C('#6a6a6a') * .2
    P, N = body_points(170000)
    yaw = math.radians(28); cy_, sy_ = math.cos(yaw), math.sin(yaw)
    X = P[:, 0] * cy_ + P[:, 2] * sy_; Z = -P[:, 0] * sy_ + P[:, 2] * cy_; Y = P[:, 1]
    NX = N[:, 0] * cy_ + N[:, 2] * sy_; NZ = -N[:, 0] * sy_ + N[:, 2] * cy_; NY = N[:, 1]
    sc = 205 / 1.78; px = 138 + X * sc; py = 262 - Y * sc
    light = np.array([-.5, .45, .75]); light /= np.linalg.norm(light)
    lam = np.clip(NX * light[0] + NY * light[1] + NZ * light[2], 0, 1)
    rim = np.clip(1 - np.abs(NZ), 0, 1) ** 3
    ix0 = (px * MM).astype(int); iy0 = (py * MM).astype(int)
    cs = 5; gx, gy = np.clip(ix0 // cs, 0, W // cs), np.clip(iy0 // cs, 0, H // cs)
    zb = np.full((H // cs + 2, W // cs + 2), -9.0, np.float32); np.maximum.at(zb, (gy, gx), Z.astype(np.float32))
    zd = zb.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1): zd = np.maximum(zd, np.roll(np.roll(zb, dy, 0), dx, 1))
    vis = Z >= zd[gy, gx] - .045
    inten = (.22 + .95 * lam + .35 * rim) * (.6 + .4 * np.clip((Z + .25) / .5, 0, 1))
    acc = np.zeros((H, W), np.float32); red = np.zeros((H, W), np.float32)
    scanY = 1.30; band = np.abs(Y - scanY) < .012
    ix = (px * MM).astype(int); iy = (py * MM).astype(int); ok = (ix >= 0) & (ix < W) & (iy >= 0) & (iy < H) & vis
    np.add.at(acc, (iy[ok & ~band], ix[ok & ~band]), inten[ok & ~band] * .55)
    np.add.at(red, (iy[ok & band], ix[ok & band]), 3.0)
    acc = np.clip(acc, 0, 2.2)
    img += acc[..., None] * C('#f2f2f2') * .55
    img += blur(acc, .9)[..., None] * C('#ffffff') * .55
    img += red[..., None] * C('#ff3b2e') * .6 + blur(red, 1.2)[..., None] * C('#ff2a1f') * 1.4
    # scanning plane: thin red sheet across the page at scan height
    sy = 262 - scanY * sc
    sheet = np.exp(-((YY - sy) / .35) ** 2) * np.clip(1 - np.abs(XX - 138) / 120, 0, 1)
    img += sheet[..., None] * C('#ff2a1f') * .5
    # floor dot grid
    def grid(d, s):
        for gz in range(0, 14):
            for gx in range(-12, 13):
                zz = 1 + gz * .35; x = 138 + gx * 9 / zz * 1.6; y = 264 + 26 / zz * .0 + gz * 2.4
                rr = .35 / zz * 1.5
                d.ellipse([(x - rr) * s, (y - rr) * s, (x + rr) * s, (y + rr) * s], fill=255)
    img += shapes_mask(grid)[..., None] * C('#ffffff') * .25
    vignette(img, .45, 130, 160); grain(img, .025)
    save(img, 't2-body.jpg', 88)

# ------------------------------------------------------------------ t3: cold spotlight
@scene
def t3():
    img = vgrad([(0, '#C6C9CD'), (.6, '#D3D5D8'), (1, '#BABEC3')])
    fog = noise(50, 5, seed=131)
    beam(img, (105, -20), (105, 300), 24, 56, '#ffffff', .22, mod=.6 + .6 * fog, soft=1.8)
    glow(img, 105, 124, 80, '#ffffff', .08)
    d = np.sqrt((XX - 105) ** 2 + (YY - 124) ** 2); ring = np.exp(-((d - 57) / 5) ** 2)
    img += ring[..., None] * C('#ffffff') * .14
    mist = np.clip((YY - 250) / 47, 0, 1) * (.4 + .8 * fog); img += mist[..., None] * C('#ffffff') * .25
    dust(img, 700, 60, 0, 150, 297, '#ffffff', 1.4, .2, seed=132, weight=lambda x, y: math.exp(-((x - 105) / 34) ** 2))
    vignette(img, .25); grain(img, .012); save(img, 't3-cold.jpg')

# ------------------------------------------------------------------ t4: night facade, projector, dawn horizon
@scene
def t4():
    img = vgrad([(0, '#141414'), (.5, '#181716'), (.6, '#1d1a17')])
    conc = noise(8, 4, seed=141); img += (conc[..., None] - .5) * .06
    def wins(d, s):
        for yy in range(6, 150, 14):
            for xx in range(4, 210, 12): d.rectangle([xx * s, yy * s, (xx + 8) * s, (yy + 9) * s], outline=255, width=max(1, int(.3 * s)))
    img += shapes_mask(wins)[..., None] * C('#ffffff') * .035
    fog = noise(40, 5, seed=142)
    beam(img, (-15, 290), (108, 64), 2, 62, '#F4F1E8', .30, mod=.35 + .9 * fog, soft=1.4)
    glow(img, 108, 64, 70, '#EDEAE2', .25)
    dust(img, 700, 0, 60, 120, 297, '#ffffff', 1.0, .2, seed=143, weight=lambda x, y: math.exp(-(((y - 64) - (x - 108) * (-226 / 123)) / (6 + (290 - y) * .25 + 1e-3)) ** 2 * .5))
    # dawn
    hz = 262
    sky = vgrad([(0, '#141414'), (.5, '#1d1a17'), (.68, '#5b3a2a'), (.8, '#d98a4a'), (.882, '#ffd59a'), (1, '#ffd59a')])
    mask = np.clip((YY - 150) / 30, 0, 1)
    img[:] = img * (1 - mask[..., None]) + sky * mask[..., None]
    glow(img, 132, hz, 46, '#FFE2AE', .8, p=1.8); glow(img, 132, hz, 10, '#FFF6E2', 1.5)
    ground = (YY > hz).astype(np.float32); img[:] = img * (1 - ground[..., None]) + C('#2a2119') * ground[..., None]
    refl = np.exp(-((XX - 132) / 18) ** 2) * np.exp(-((YY - hz) / 18) ** 2) * ground; img += refl[..., None] * C('#FFC27A') * .7
    for k in range(10):
        line = np.exp(-((YY - hz - 1 - k * 3.8) / .25) ** 2) * ground; img += line[..., None] * C('#ffd59a') * (.25 - k * .02)
    vignette(img, .35); grain(img, .02); save(img, 't4-night.jpg')

# ------------------------------------------------------------------ t5: smoky bar
@scene
def t5():
    img = np.asarray(Image.open('assets/t5-smoke.jpg').resize((W, H)), np.float32) / 255
    counter = np.clip((YY - 190) / 2, 0, 1); img *= (1 - counter * .55)[..., None]
    img += (np.exp(-((YY - 190.5) / .5) ** 2))[..., None] * C('#E8B26A') * .35
    refl = np.exp(-((XX - 101) / 20) ** 2) * np.exp(-((YY - 205) / 12) ** 2) * counter; img += refl[..., None] * C('#D9822A') * .35
    glow(img, 104, 156, 36, '#E0962F', .30)
    band = np.exp(-((YY - 226) / 7) ** 2) * np.clip(np.sin(np.clip(XX / 210 * 1.35, 0, 1) * np.pi), 0, 1); img += band[..., None] * C('#E0962F') * .22
    bloom(img, .55, 4, .5); vignette(img, .4); grain(img, .02); save(img, 't5-bar.jpg')

# ------------------------------------------------------------------ t6: red tunnel
@scene
def t6():
    img = np.asarray(Image.open('assets/t6-heat.jpg').resize((W, H)), np.float32) / 255 * .85
    cx, cy = 108, 176
    ang = np.arctan2(YY - cy, XX - cx); d = np.sqrt((XX - cx) ** 2 + (YY - cy) ** 2)
    streak = (np.sin(ang * 46) * .5 + .5) ** 8 * np.clip(d / 140, 0, 1) * .12
    img += streak[..., None] * C('#ff3b2e')
    glow(img, cx, cy, 16, '#ffffff', .9); glow(img, cx, cy, 50, '#ff3b2e', .5); glow(img, cx, cy, 120, '#a3120c', .25)
    bloom(img, .6, 5, .6); vignette(img, .5, cx, cy); grain(img, .02); save(img, 't6-tunnel.jpg')

# ------------------------------------------------------------------ t7: crimson night
@scene
def t7():
    img = canvas('#050404'); fog = noise(60, 5, seed=171)
    glow(img, 168, 52, 22, '#E8E1D6', .22); glow(img, 168, 52, 7, '#F4EEE4', .7)
    low = np.clip((YY - 150) / 147, 0, 1) ** 1.4 * (.4 + .8 * fog); img += low[..., None] * C('#8E0A0E') * .55
    glow(img, 105, 340, 130, '#B3141A', .5)
    dust(img, 400, 0, 0, 210, 297, '#E8E1D6', .6, .18, seed=172)
    vignette(img, .45); grain(img, .02); save(img, 't7-night.jpg')

# ------------------------------------------------------------------ t8: guilt trip road (taillights)
@scene
def t8():
    img = np.asarray(Image.open('assets/t8-mist.jpg').resize((W, H)), np.float32) / 255
    glow(img, 104.2, 243, 1.2, '#ff3030', 2.4); glow(img, 105.8, 243, 1.2, '#ff3030', 2.4); glow(img, 105, 244, 9, '#ff2020', .25)
    beam(img, (105, 300), (105, 236), 50, 3, '#9fb6e0', .12)
    glow(img, 64, 70, 70, '#8FB0EA', .08)
    vignette(img, .4); grain(img, .02); save(img, 't8-road.jpg')

# ------------------------------------------------------------------ t9: siren haze
@scene
def t9():
    img = canvas('#070707'); fog = noise(45, 5, seed=191)
    beam(img, (105, 50), (-120, 110), 3, 70, '#ff2a1f', .5, mod=.35 + .9 * fog)
    beam(img, (105, 50), (330, -30), 3, 50, '#ff2a1f', .35, mod=.35 + .9 * fog)
    for k, x in enumerate([30, 75, 140, 185]): beam(img, (x, -10), (x + (k - 1.5) * 18, 240), 1.5, 16, '#ffffff', .10, mod=.3 + .9 * fog)
    glow(img, 105, 50, 10, '#ffd2c8', 1.4); glow(img, 105, 50, 45, '#ff2a1f', .55)
    back = np.exp(-((YY - 205) / 18) ** 2) * (.5 + .7 * fog); img += back[..., None] * C('#ff2a1f') * .30
    bloom(img, .6, 4, .5); vignette(img, .45); grain(img, .02); save(img, 't9-haze.jpg')

# ------------------------------------------------------------------ t10: phony sunset window + room light
@scene
def t10():
    img = vgrad([(0, '#EADCC6'), (.6, '#F1E4D1'), (1, '#E7D5BC')])
    x0, x1, ytop, ybot = 46, 164, 32, 196; rA = (x1 - x0) / 2; cxw = (x0 + x1) / 2; ya = ytop + rA
    win = ((XX >= x0 + 5) & (XX <= x1 - 5) & (YY <= ybot - 5) & ((YY >= ya) | (((XX - cxw) ** 2 + (YY - ya) ** 2) <= (rA - 5) ** 2))).astype(np.float32)
    sky = vgrad([(0, '#F9D9B2'), (.12, '#F9D9B2'), (.3, '#F6A877'), (.45, '#EE7448'), (.55, '#D2552C'), (.7, '#9B3B26'), (1, '#9B3B26')])
    cl = noise(48, 3, seed=201); cl2 = noise(30, 3, seed=202)
    from atmos import _box
    cl = _box(_box(cl, int(18 * MM), 1), int(1.2 * MM), 0)
    clouds = np.clip((cl - .5) * 5, 0, 1) * np.clip(1 - (YY - 120) / 40, 0, 1) * (YY < 150)
    clouds = blur(clouds, .7)
    sky += clouds[..., None] * C('#FFE9D6') * .55
    streaks = np.clip((cl2 - .6) * 5, 0, 1) * np.exp(-((YY - 96) / 26) ** 2); streaks = blur(streaks, 1.5)
    sky += streaks[..., None] * C('#FFD1B0') * .35
    glow(sky, 120, 160, 34, '#FFE2AE', .8); glow(sky, 120, 160, 11, '#FFF4DA', 1.6)
    m1 = poly_mask([(x0, 170), (60, 170), (64, 150), (70, 148), (84, 148), (88, 152), (92, 170), (124, 170), (128, 158), (131, 156), (138, 156), (141, 162), (146, 170), (x1, 170), (x1, 200), (x0, 200)])
    m2 = poly_mask([(x0, 178), (74, 178), (78, 160), (80, 132), (86, 130), (92, 131), (96, 158), (100, 178), (140, 178), (143, 166), (150, 164), (154, 178), (x1, 178), (x1, 200), (x0, 200)])
    m3 = poly_mask([(x0, 186), (x1, 183), (x1, 200), (x0, 200)])
    over(sky, m1, C('#B8634A')); over(sky, m2, C('#7A3022')); over(sky, m3, C('#4B1C14'))
    haze = np.exp(-((YY - 172) / 8) ** 2); sky += haze[..., None] * C('#FFB07A') * .25
    img[:] = img * (1 - win[..., None]) + sky * win[..., None]
    fog = noise(30, 4, seed=203)
    beam(img, (105, 120), (150, 270), 40, 70, '#FFE3BF', .28, mod=.6 + .6 * fog, soft=1.5)
    fy0 = 214
    def patch(d, s):
        sk = lambda x, y: ((x + (y - fy0) * .9 + 18) * s, y * s)
        pts = [sk(cxw + math.cos(math.radians(a)) * (rA - 5), fy0 + (math.sin(math.radians(a)) + 1) * 14) for a in range(180, 361, 6)] + [sk(x1 - 5, 286), sk(x0 + 5, 286)]
        d.polygon(pts, fill=255)
    pm = shapes_mask(patch); pm = blur(pm, .6)
    def bars(d, s):
        sk = lambda x, y: ((x + (y - fy0) * .9 + 18) * s, y * s)
        d.polygon([sk(cxw - 1.6, fy0), sk(cxw + 1.6, fy0), sk(cxw + 1.6, 286), sk(cxw - 1.6, 286)], fill=255)
        d.polygon([sk(x0 + 5, 247), sk(x1 - 5, 247), sk(x1 - 5, 251), sk(x0 + 5, 251)], fill=255)
    pm = np.clip(pm - blur(shapes_mask(bars), .4), 0, 1)
    img += pm[..., None] * C('#FFD9A0') * .45
    dust(img, 500, 90, 110, 200, 280, '#FFF3DE', 1.2, .2, seed=204, weight=lambda x, y: 1.0)
    vignette(img, .25); grain(img, .015); save(img, 't10-room.jpg')

# ------------------------------------------------------------------ text-page atmospheres
TX = {'prologue': ('#0B0B0B', '#E0201B', 'dark'), 'context': ('#ECE7DF', '#D61E17', 'bone'), 'sound': ('#E4E2DE', '#D61E17', 'bone'),
      't1': ('#0A0A0A', '#E0201B', 'dark'), 't2': ('#070707', '#E3231C', 'dark'), 't3': ('#F1F1EE', '#9aa6b5', 'bone'), 't4': ('#DCD8D1', '#E8A35A', 'bone'),
      't5': ('#0E0A07', '#E0962F', 'dark'), 't6': ('#140404', '#FF3B2E', 'dark'), 't7': ('#070505', '#B3141A', 'dark'), 't8': ('#060A14', '#8FB0EA', 'dark'),
      't9': ('#090909', '#FF2A1F', 'dark'), 't10': ('#F3E8D8', '#F0A060', 'bone'), 'whole': ('#ECE7DF', '#D61E17', 'bone'), 'limit': ('#0B0B0B', '#E0201B', 'dark')}
def textpage(key):
    bg, acc, th = TX[key]; img = canvas(bg); n = noise(70, 5, seed=hash(key) % 1000)
    if th == 'dark':
        img += (n[..., None] - .5) * .05
        glow(img, 205, -5, 95, acc, .16); glow(img, 0, 300, 120, acc, .07)
        img += (np.clip((YY - 255) / 42, 0, 1) * (.3 + .8 * n))[..., None] * C(acc) * .06
        vignette(img, .35)
    else:
        fib = noise(5, 3, seed=7); img += ((fib - .5) * .035 + (n - .5) * .04)[..., None]
        glow(img, 210, 0, 110, acc, .07); glow(img, 0, 297, 100, '#ffffff', .12)
        vignette(img, .12)
    save(img, f'tx-{key}.jpg', 82)
for _k in TX:
    S['tx_' + _k] = (lambda k=_k: textpage(k))

@scene
def coda():
    img = canvas('#080808'); fog = noise(60, 5, seed=301)
    glow(img, 168, 250, 110, '#F6E7CF', .30); glow(img, 168, 250, 30, '#FFF3DE', .25)
    beam(img, (200, -20), (168, 250), 10, 60, '#F6E7CF', .10, mod=.5 + .8 * fog)
    dust(img, 400, 90, 120, 210, 297, '#F6E7CF', .8, .2, seed=302)
    vignette(img, .45); grain(img, .02); save(img, 'coda-bg.jpg')

if __name__ == '__main__':
    names = sys.argv[1:] or list(S.keys())
    for nm in names:
        print(nm); S[nm]()
