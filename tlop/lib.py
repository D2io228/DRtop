"""Shared helpers for the TLOP booklet: Russian typography, page shells,
recurring components (folio, Pablo index, track meta) and small SVG tools."""
import html
import math
import re

import pyphen

_RU = pyphen.Pyphen(lang="ru_RU", left=2, right=2)

NB = " "   # no-break space
SHY = "­"  # soft hyphen
THIN = " "

# words that should stick to the following word
_STICK = (
    "а|в|во|и|к|ко|о|об|обо|с|со|у|я|"
    "но|да|не|ни|на|по|за|из|от|до|"
    "под|над|при|про|для|без|изо|ото"
)
_STICK_RE = re.compile(r"(?<![\w\-­])(" + _STICK + r") ", re.I)
_PARTICLE_RE = re.compile(r" (же|ли|бы|ль|б)(?=[\s.,;:!?…»)]|$)")
_TAG = re.compile(r"(<[^>]+>)")
_CYR_WORD = re.compile(r"[А-Яа-яЁё]{5,}")


def _hyph(word):
    if word[0].isupper():
        return word
    return _RU.inserted(word, hyphen=SHY)


def typo(s, hyph=True):
    """Apply Russian typographic rules to an HTML snippet (text nodes only)."""
    parts = _TAG.split(s)
    out = []
    skip = 0
    for p in parts:
        if p.startswith("<"):
            low = p.lower()
            if low.startswith(("<style", "<script", "<svg")):
                skip += 1
            elif low.startswith(("</style", "</script", "</svg")):
                skip = max(0, skip - 1)
            out.append(p)
            continue
        if skip:
            out.append(p)
            continue
        t = p
        t = t.replace(" — ", NB + "— ").replace(" – ", NB + "– ")
        t = re.sub(r"(\d) (?=[а-яё%])", r"\1" + NB, t)
        t = re.sub(r"\b([A-ZА-Я])\. (?=[A-ZА-Я])", r"\1." + NB, t)  # initials
        for _ in range(2):
            t = _STICK_RE.sub(lambda m: m.group(1) + NB, t)
        t = _PARTICLE_RE.sub(lambda m: NB + m.group(1), t)
        if hyph:
            t = _CYR_WORD.sub(lambda m: _hyph(m.group(0)), t)
        out.append(t)
    return "".join(out)


def P(*paras, cls="", hyph=True, first=""):
    """Paragraphs -> <p> list with typography. `first` = class for 1st para."""
    out = []
    for i, para in enumerate(paras):
        c = " ".join(x for x in (cls, first if i == 0 else "") if x)
        out.append(f'<p class="{c}">{typo(para, hyph)}</p>' if c else f"<p>{typo(para, hyph)}</p>")
    return "\n".join(out)


def esc(s):
    return html.escape(s, quote=True)


# ----------------------------------------------------------------- page shell

def page(pid, body, cls="", style="", css=""):
    st = f' style="{style}"' if style else ""
    css_block = f"<style>{css}</style>" if css else ""
    return f'<section class="page {cls}" id="{pid}"{st}>{css_block}{body}</section>'


def folio(left="THE LIFE OF PABLO", right="", color="currentColor", pos="bottom"):
    """Running foot: left label · page number · right label."""
    return (
        f'<div class="folio folio-{pos}" style="color:{color}">'
        f'<span>{left}</span><span class="fnum">{{{{N}}}}</span><span>{right}</span></div>'
    )


# ----------------------------------------------------------------- Pablo index

def icon_paul(c="currentColor", s=10):
    # sword of the Word (Eph 6:17)
    return (
        f'<svg class="ico" width="{s}mm" height="{s}mm" viewBox="0 0 20 20">'
        f'<path d="M10 1.5 L11.3 4 L11.3 13 L8.7 13 L8.7 4 Z" fill="{c}"/>'
        f'<rect x="5.5" y="13" width="9" height="1.6" fill="{c}"/>'
        f'<rect x="9.2" y="14.6" width="1.6" height="3" fill="{c}"/>'
        f'<circle cx="10" cy="18.4" r="1.1" fill="{c}"/></svg>'
    )


def icon_picasso(c="currentColor", s=10):
    # cubist eye: frontal almond + profile plane
    return (
        f'<svg class="ico" width="{s}mm" height="{s}mm" viewBox="0 0 20 20">'
        f'<path d="M2 10 Q8 3.5 14 10 Q8 16.5 2 10 Z" fill="none" stroke="{c}" stroke-width="1.5"/>'
        f'<circle cx="8" cy="10" r="2.2" fill="{c}"/>'
        f'<path d="M12 4 L18.5 8 L15 16 Z" fill="{c}" opacity=".85"/></svg>'
    )


def icon_escobar(c="currentColor", s=10):
    # parcel / product with distribution arrows
    return (
        f'<svg class="ico" width="{s}mm" height="{s}mm" viewBox="0 0 20 20">'
        f'<path d="M10 3 L16 6 L16 13 L10 16 L4 13 L4 6 Z" fill="none" stroke="{c}" stroke-width="1.5"/>'
        f'<path d="M4 6 L10 9 L16 6 M10 9 L10 16" fill="none" stroke="{c}" stroke-width="1.2"/>'
        f'<path d="M17.5 15.5 l2 2 M2.5 15.5 l-2 2 M10 17.5 v2.3" stroke="{c}" stroke-width="1.2"/></svg>'
    )


def pablo_index(p, pi, e, color="currentColor", dim="rgba(0,0,0,.18)", label=True):
    """Three tiny meters: Paul / Picasso / Escobar, values 0..3 (interpretive)."""
    def bars(v):
        cells = "".join(
            f'<i style="background:{color if k < v else dim}"></i>' for k in range(3)
        )
        return f'<span class="pbars">{cells}</span>'
    lab = '<span class="plab">индекс Пабло</span>' if label else ""
    return (
        f'<div class="pindex" style="color:{color}">{lab}'
        f'<span class="pcell">{icon_paul(color, 3.4)}{bars(p)}</span>'
        f'<span class="pcell">{icon_picasso(color, 3.4)}{bars(pi)}</span>'
        f'<span class="pcell">{icon_escobar(color, 3.4)}{bars(e)}</span></div>'
    )


# ----------------------------------------------------------------- misc svg

def jitter_ellipse(cx, cy, rx, ry, seed=1, turns=1.15, wob=0.06, n=90):
    """Hand-drawn grease-pencil ellipse path (slightly overshooting)."""
    import random
    r = random.Random(seed)
    pts = []
    a0 = r.uniform(0, math.pi * 2)
    for k in range(n + 1):
        t = a0 + (math.pi * 2 * turns) * k / n
        f = 1 + r.uniform(-wob, wob) * 0.5 + 0.04 * math.sin(3 * t + seed)
        pts.append((cx + rx * f * math.cos(t), cy + ry * f * math.sin(t)))
    d = f"M{pts[0][0]:.2f},{pts[0][1]:.2f} " + " ".join(f"L{x:.2f},{y:.2f}" for x, y in pts[1:])
    return d


def fmt_dur(s):
    return f"{s // 60}:{s % 60:02d}"


# ----------------------------------------------------------------- track meta

def track_meta(tr, color="currentColor", dim="rgba(0,0,0,.2)", extra="", feat_label="голоса",
               show_samples=True, width=None):
    """Compact factual block: number, duration, credited voices, samples, Pablo index."""
    from data import TRACKS  # noqa: F401
    rows = [f'<div class="mr"><span class="mk">трек</span><b>{tr["n"]:02d}</b> / 20 · {fmt_dur(tr["sec"])}</div>']
    if tr["feat"]:
        rows.append(f'<div class="mr"><span class="mk">{feat_label}</span>{esc(", ".join(tr["feat"]))}</div>')
    if show_samples and tr["samples"]:
        sm = "; ".join(
            f'{esc(a)} — <i>{esc(t)}</i>' + (f" ({y})" if y else "") for a, t, y in tr["samples"])
        rows.append(f'<div class="mr"><span class="mk">сэмплы</span>{sm}</div>')
    if extra:
        rows.append(extra)
    st = f"width:{width}mm;" if width else ""
    return (f'<div class="tmeta" style="{st}color:{color}">' + "".join(rows)
            + pablo_index(*tr["pablo"], color=color, dim=dim) + "</div>")
