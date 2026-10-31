# Yeezus — власть, желание и человек внутри машины

Иллюстрированный разбор альбома Kanye West «Yeezus» (2013). Готовый файл — **`Yeezus.pdf`** (A4, 55 страниц).

## Структура
- `src/content.html` — литературная редакция текста (сноски: `<sup data-s="…">`).
- `src/art-*.js` — генеративные иллюстрации (SVG, координаты в миллиметрах).
- `src/book.js` — план книги, страницы, движок вёрстки (перенос абзацев между страницами).
- `src/layouts.js` — типографика разворотов-открывашек.
- `assets/` — зерно и атмосферные текстуры (`tools/textures.py`).

## Сборка
```bash
cd tools && npm install && cd ..
node tools/build.js --pdf            # → Yeezus.pdf
node tools/build.js --png 1-10       # превью страниц в build/png
```
Нужен Chromium через Playwright. Шрифты Cormorant Garamond, IBM Plex Mono и Alumni Sans лежат в `fonts/`; Inter Display ожидается установленным в системе.
