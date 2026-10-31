import re, sys, os, urllib.request
out = sys.argv[1]
families = sys.argv[2:]
css_all = []
for fam in families:
    url = "https://fonts.googleapis.com/css2?family=" + fam + "&display=block"
    css = urllib.request.urlopen(url).read().decode()
    def repl(m):
        u = m.group(1)
        name = u.split('/')[-3] + '_' + u.split('/')[-1]
        p = os.path.join(out, name)
        if not os.path.exists(p):
            urllib.request.urlretrieve(u, p)
        return "url(fonts/%s)" % name
    css = re.sub(r"url\((https://fonts\.gstatic\.com[^)]+)\)", repl, css)
    css_all.append(css)
open(os.path.join(out, '..', 'fonts.css'), 'w').write("\n".join(css_all))
print("ok")
