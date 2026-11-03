# DEMIURGE — Roadmap

Source of truth: [DESIGN.md](DESIGN.md) · Plan: [ARCHITECTURE.md](ARCHITECTURE.md)

## Phase 1 — Foundation and living nature (in progress)

- [x] **1.1 Engine core & app shell** — Loop, Scheduler, Rng/hash, Noise, EventBus, Store, Input, config and strings, theme tokens, fonts, layout shell, top bar with date and speed, toasts, Settings, fullscreen with fallback, Dev Console (help, seed, stats, events, crashtest, clear), performance overlay, error isolation.
  *Done when:* loop at 60 FPS, speeds and pause work, F3 and Backquote work on a Russian layout, crashtest shows the error without a white screen. ✔ verified in headless Chromium (see Step log).
- [ ] **1.2 World generation** — layers, full 7.2 pipeline with progress and timings, names, landmass ids, beauty-spot finder.
- [ ] **1.3 Palette, terrain rendering, camera, minimap, map modes** — far/mid/near tiers, autotiling, water, foam, glints, rivers, cliffs, decals, progressive baking, camera feel, minimap, map modes + legends (except Life).
- [ ] **1.4 World Creator & world flow** — 7.1 complete, generation overlay, world reveal, New World.
- [ ] **1.5 Sprites, atlas, trees on the map, gallery** — every species (adult + young), procedural trees/bushes/rocks/clouds, outlines, shadows, swaps, flash variants, power icons, cursors, `gallery`.
- [ ] **1.6 Wind, vegetation, fire, particles, effects** — 5.9–5.10, vegetation of 7.4, particle system, effects, natural lightning, sway, wildfire toasts.
- [ ] **1.7 Animals, steering, bodies, ecology** — species, utility AI, steering, pathfinding, breeding, death, carcasses, body physics, birds, ambient life, Life map mode, Population popover, `ff`, `ecotest`.
- [ ] **1.8 God powers & Inspector** — registry, brush, power bar, brush panel, every power of 7.5, terrain settling + hydrology updates, Inspector with reasons and Follow.
- [ ] **1.9 UI completion** — controls overlay, tooltips everywhere, cursors, focus states, drawers/bottom sheets, layout pass at 760 px / 1080p / 4K.
- [ ] **1.10 Audio & music** — section 4.9 complete, sounds on every action.
- [ ] **1.11 Polish, performance, verification** — juice pass, performance pass (rule 19), full DoD check, final report.

## Phase 2 — Civilizations
Races (humans, elves, dwarves, orcs), agents with needs/jobs/utility AI, settlements and buildings with visible construction, economy, desire paths, territory and kingdoms, tech eras, race and blessing powers. Step plan written on "Start Phase 2".

## Phase 3 — Kingdoms, diplomacy and war
Rulers and opinions, relations, rebellions, armies, sieges, battles, treaties, war powers, the dragon.

## Phase 4 — Characters, culture and history
Named people with traits and families, cultures and languages, religions, plague, Chronicle, Legends, statistics.

## Phase 5 — Living planet
Seasons, day/night, weather fronts, climate, disasters (earthquake, volcano, tornado, blizzard), naval, trade routes.

## Phase 6 — Polish and persistence
Save/Load, World Laws, Photo mode, full settings, audio mix, performance pass, optional AI Bard.

## Step log

**1.1 (done)** — Verified with Playwright in headless Chromium against the Vite dev server: 60 FPS steady at 1× and 25× (p99 frame 16.8 ms, no long tasks); hotkeys 5 / Space change speed and pause (tick frozen while paused); Backquote dispatched as `key: 'ё', code: 'Backquote'` opens and closes the console; F3 toggles the overlay; `crashtest`, `crashtest render`, `crashtest ui` each log errors, suspend after 3 failures with a toast, and the app keeps running; native fullscreen and the refused-fullscreen fallback both work, Esc exits; 760 px layout has no overflow; zero browser console errors or warnings; `tsc` clean; `vite build` succeeds.

## Decisions

- **Project layout:** AI Studio-style root entry points (`index.html`, `index.tsx`, `metadata.json`) with the DESIGN folder map (`engine/`, `render/`, `sim/`, `ui/`, later `world/`, `powers/`, `audio/`) at the root. Vite + React 19 + TypeScript (strict). Dev server on port 3000.
- **Pre-world backdrop:** until terrain rendering exists (Step 1.3), the canvas shows a "primordial sea": domain-warped fBm quantized to the 6-step depth ramp with Bayer dithering on band edges. It drifts with *simulation* time, so pause and speed are visible. It exercises Noise, Palette and the renderer for real; it is removed when the terrain layers land.
- **Palette and icon baking built early:** icons must be pixel art from the atlas (no emoji/icon fonts), so `Palette` (OKLCH ramps) and the ASCII baker with selective outlines were built in 1.1. Step 1.3 reuses the palette; Step 1.5 grows the baker into the full SpriteAtlas.
- **Icon art authoring:** icons are 16×16 ASCII maps. Masks were drawn by hand; ramp digits were assigned with a consistent NW-light rule (edge highlight/shadow plus a diagonal gradient) and then embedded as ASCII.
- **Icon sizes:** buttons use 16×16 art at 2× (32 CSS px); small glyphs (toast close, copy) use 1×. The icon set bakes 1×, 2× and 3× data URLs and picks the one that maps to whole device pixels for the current devicePixelRatio.
- **Panel visibility in the engine:** console/settings open state lives in an engine store (`game.ui`), so hotkeys (handled by the engine's Input) and buttons drive the same state. It is UI state, not simulation state.
- **Toast lifetimes** advance with real frame time inside the engine loop (no timers); hover pauses a toast.
- **Esc order:** close console → close settings → leave fullscreen / maximized view. Later steps put "cancel power" first.
- **Focus:** mouse clicks on buttons do not take keyboard focus (so Space keeps meaning pause); keyboard Tab focus still works with a visible gold ring. Hotkeys are ignored while typing; Space/Enter on a focused button activate that button.
- **Adaptive quality** measures CPU work per frame (sim + render + bake), not the vsync-capped frame interval, so a 60 Hz display never reads as "over budget" by itself. Level changes are logged to the Dev Console and shown in the F3 overlay.
- **Error dedupe:** identical errors (same source and message) merge into one Dev Console entry with a count.
- **Extra console command:** `events [n]` (listed in 7.7) was added in 1.1 because the EventBus already exists.
- **crashtest targets:** `crashtest` (sim, default), `crashtest render` and `crashtest ui` prove isolation for systems, render layers and React panels respectively.
- **Fullscreen fallback:** "maximized" mode pins the app root over the page (`position: fixed; inset: 0`) and shows an explanatory toast.
- **TypeScript 7** (native compiler) is used for type checking; no TS-only runtime features are relied on.

## Known limitations

- The top bar's left side shows the DEMIURGE wordmark and the seed; the editable world name arrives with world generation (1.2) and the World Creator (1.4).
- Settings currently has Reduce motion and Performance overlay (plus a shortcut to the Dev Console); volumes, particle density, pixel-perfect zoom and New World appear with their features.
- Toasts support a "Go to" target, but the button is not rendered until the camera exists (1.3).
- Performance figures were measured in headless Chromium (software rendering); a real GPU-backed browser should do at least as well. Playwright screenshots themselves cause short stalls that show up in the overlay's 1% low.
- The Google Fonts stylesheet could not be reached from the test sandbox, so verification used the monospace fallback; in AI Studio and normal browsers Pixelify Sans loads.
