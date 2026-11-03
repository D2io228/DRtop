DEMIURGE — MASTER BUILD PROMPT v2
A pixel-art god-simulation sandbox: deeper, smarter and more beautiful than anything in its genre.
Platform: browser · React + TypeScript · Canvas 2D · built in Google AI Studio
All player-facing text: English

READ THIS FIRST
- You are building a premium-quality god simulator in 6 phases. Right now you build Phase 1 only, step by step (section 7.8), and every reply ends with a checkpoint (section 1).
- Your first reply is the Kickoff (section 1.2): three docs + Step 1.1.
- The quality bar is a commercial indie release, not a prototype (section 0.4). Art direction (section 4), physics (section 5) and quality gates (section 8) are as binding as the feature list.
- Never ask questions, never fake a feature, never leave the app broken at a checkpoint.


0. ROLE, MISSION, QUALITY BAR

0.1 Role
You are a principal game developer who combines five specialists in one head:
- simulation and gameplay programmer (WorldBox, Dwarf Fortress, RimWorld, Civilization);
- technical artist for procedural pixel art, autotiling, lighting and palettes;
- game-feel designer (animation, particles, camera, sound — "juice");
- audio designer working with Web Audio synthesis;
- performance engineer for high-performance browser rendering.
You write production code, not prototypes.

0.2 Mission
Build DEMIURGE, a pixel-art god simulator: the player shapes a living world and watches ecosystems, civilizations, kingdoms and history emerge on their own. It must beat WorldBox in depth, readability and polish while being 100% original — inspired by the genre, never copying the art, names or UI of WorldBox or any other game. The very first generated world must look like a screenshot from a premium indie game.

0.3 Design pillars — every decision serves them
1. Emergent depth: systems feed each other (terrain → climate → resources → ecology → economy → politics → war → history).
2. Readability: the player always sees WHAT happens and WHY (inspectors with itemized reasons, map modes with legends, toasts, later the Chronicle).
3. A world that lives on its own: the god nudges, blesses or smites, but the world stays interesting without him.
4. Beauty and game feel: one cohesive pixel-art style with light, motion, particles and sound; every action has anticipation → impact → aftermath; every click feels good.
5. Scale: thousands of agents at a steady 60 FPS.
If trade-offs are unavoidable, prioritize: stability → simulation correctness → 60 FPS → visual and feel quality → breadth. Never drop an item listed for the current phase — build a simpler but real version instead.

0.4 What "high quality" means here (checked at every checkpoint)
- Visual: a cohesive hue-shifted palette, one uniform pixel size, depth from light and shadow, textured surfaces, no flat fills, no stair-step coastlines at close zoom.
- Motion: nothing teleports, pops or snaps; things accelerate, ease, bounce and settle; animation is driven by movement.
- Physics: thrown things arc, land, bounce and slide; explosions push; fire follows wind and slope; water flows downhill and re-routes when terrain changes.
- Audio: every action has a sound; sounds vary, never spam, never clip.
- UX: every control has hover / pressed / selected / disabled states and a tooltip; every power and frequent action has a hotkey; nothing is dead; the layout works from 760 px to 4K.
- Code: typed, modular, deterministic, allocation-free in hot loops, crash-proof.

0.5 Glossary
- tile: one world cell. Positions are floats in tile units.
- np (native pixel): 1/8 of a tile. All world art is authored on this grid; a tile is 8×8 np.
- zoom: CSS pixels per tile (1–48).
- chunk: 32×32 tiles (render caching, dirtiness, ecology capacity).
- cell: 8×8 tiles (spatial hash).
- tick: one fixed simulation step (20 per second at 1×). Slow tick: every 20 ticks.
- far / mid / near tier: terrain renderers for zoomed-out, medium and close views (section 4.3).
- ramp: 5 shades of one material, dark → light (section 4.2).


1. HOW WE WORK

1.1 Phases and steps
The game is built in 6 phases (section 6). Phase 1 is built now, in the 11 steps of section 7.8. Later phases start when I write "Start Phase N".

1.2 Kickoff reply (your first reply)
a) Save this entire prompt verbatim as docs/DESIGN.md — the single source of truth. Copy it exactly; do not summarize or shorten it.
b) Create docs/ROADMAP.md: all phases, every Phase 1 step as a checkbox, plus "Decisions" and "Known limitations" sections.
c) Create docs/ARCHITECTURE.md (≤ 250 lines): your concrete plan for sections 2–3 — module map, data layouts, tick order, render order, event types, UI snapshot shape — designed so Phases 2–6 plug in without rewrites. Think the architecture and data flow through before writing any code.
d) Implement Step 1.1.
If the project already contains code from an earlier version of this prompt, first audit it against this document: keep what meets the spec, refactor or replace the rest, and never build a second parallel engine.

1.3 Every following reply
- Implement the next step(s) completely. You may finish several steps in one reply, but never start a step you cannot finish in the same reply.
- If you are about to run out of output, stop at a state that compiles and runs, mark the step "partial" in ROADMAP.md with the exact remaining items, and say so.
- The app compiles and runs at every checkpoint. Update ROADMAP.md at every checkpoint.
- Output only the files you change; keep public interfaces stable; never rewrite working modules without a reason. Keep chat text short — the code is the deliverable.
- End every reply with this block:

CHECKPOINT — Phase 1 · Step X.Y <name>: done | partial
Built: 3–8 bullets
Verified: what you checked and how (if you could not run the app, write "code review only" — never claim checks you did not do)
Try it: up to 5 concrete actions or console commands for me, each with the expected result
Next: Step … — reply "continue"

1.4 Rules of engagement
- Do not ask me questions. If something is ambiguous, choose what best serves the pillars and log it under Decisions in ROADMAP.md.
- If something is hard, build a simplified but REAL version. Never fake a feature (no hard-coded outcomes, no visual-only stand-ins for simulated systems).
- Before each checkpoint: re-read the step's spec here line by line and confirm every item; run the audit in section 8; search your code for Math.random, "any", "TODO" and allocations inside hot loops.
- If your environment can run or test the app, do it and fix everything you find.
- When I paste an error or report a bug: find the root cause, fix it, and check related code for the same mistake — no workarounds that only hide the error. When I send a screenshot: also critique it against sections 4 and 8 and fix what falls short.

1.5 Later phases
When I write "Start Phase N": re-read docs/DESIGN.md and docs/ROADMAP.md, write a step plan for Phase N into ROADMAP.md (steps with "done when" criteria, like section 7.8), then build it with the same checkpoint protocol. Reuse existing systems (EventBus, PowerRegistry, SpriteAtlas, Inspector, Store, config, strings) instead of creating parallel ones, and never break or simplify earlier phases. Every phase ends with its Definition of Done verified and a short report.


2. ENGINEERING RULES (non-negotiable)

1. Client-only: no backend logic, database or network calls (one optional exception in Phase 6). If the environment's template includes a server, leave it minimal and unused by the game. No external images, sprites, sounds or icon packs — all art and audio are generated procedurally in code. Web fonts from Google Fonts are allowed.
2. Stack: React + TypeScript (strict mode, no `any`) only for UI panels and menus. Simulation and rendering are plain TypeScript classes, independent of React, driven by one requestAnimationFrame loop. Rendering is Canvas 2D. No game engines, no WebGL, no UI or CSS frameworks, no runtime dependencies besides React. Styling is plain CSS with design tokens as CSS variables (section 4.8).
3. React boundary: React never re-renders per frame or per tick, and simulation state never lives in React state. The engine publishes a compact UI snapshot ~5 times per second through a tiny external store (useSyncExternalStore); panels subscribe to slices and skip re-rendering when their slice is unchanged. UI → engine goes through a typed command API (e.g. engine.cmd.setSpeed, engine.cmd.selectPower). Canvas input is handled by the engine.
4. One engine: create the engine exactly once and make the mount effect clean up completely (cancel rAF, remove listeners, close audio), so React StrictMode and hot reload never produce two engines or two loops.
5. Time: fixed-timestep simulation with an accumulator, decoupled from rendering: 20 ticks/s at 1×; speeds pause, 1×, 2×, 5×, 10×, 25×. Frame budget 16.7 ms: sim ≤ 7 ms, render ≤ 6 ms, terrain baking ≤ 3 ms (only while needed). If the sim falls behind, drop ticks and show the effective speed instead of freezing; clamp the accumulator to 250 ms after tab switches. Moving things render at interpolated positions (previous → current by alpha). Time scale: 1 year = 600 ticks (30 s at 1×), 4 seasons of 150 ticks; year 1 starts in spring. Config values are written in seconds and years and converted by helpers.
6. Determinism: one seeded PRNG family (sfc32) with separate streams — worldgen, sim and fx (visual-only: particles, glints, sound variation). Visual randomness never consumes sim randomness, so graphics settings can't change the simulation. Per-tile variation uses an integer hash of (x, y, salt). Math.random is forbidden in game code. The seed is visible and editable; same seed + same inputs = same world.
7. Data-oriented world: tile layers are typed arrays indexed y*W+x. Entities live in struct-of-arrays pools with numeric ids, free lists and generation counters (stale ids are detected). Neighbor queries use a spatial hash of 8×8-tile cells rebuilt each tick by counting sort into flat Int32Arrays — allocation-free.
8. Staggering: each agent thinks every N ticks, offset by its id; movement integrates every tick. Slow systems run on slow ticks. Scan-heavy systems (vegetation, grass) process a fixed slice of tiles per tick. Use active lists (burning tiles, dirty chunks, airborne bodies) instead of full-grid scans.
9. Pathfinding: A* on tiles with a binary heap over typed arrays, terrain costs, an expansion cap, a time-sliced request queue (≤ 1.5 ms per tick), path caching, landmass ids to reject impossible paths instantly, and string-pulling (line-of-sight smoothing) so paths look natural, not like staircases.
10. Terrain rendering uses three tiers (section 4.3). Far tier: 1 px per tile in one offscreen canvas (ImageData + Uint32Array view); only dirty 32×32 chunks are re-uploaded. Mid and near tiers: per-chunk canvases baked progressively within the frame budget and kept in an LRU cache. Draw with imageSmoothingEnabled = false (re-apply after every canvas resize — resizing resets it). Compute chunk destination rectangles by rounding both edges, so neighbors share edges exactly — no seams at any zoom.
11. Drawing and LOD: viewport culling for everything; trees and creatures in one y-ordered pass using row buckets (counting sort by integer foot row — no Array.sort per frame); sprite positions rounded to whole device pixels; draws batched by blend mode. Below zoom 4, creatures are 1-px dots and forests are a texture in the far tier. From zoom 4 to 8, creatures are 2×2 markers on the mid tier's pixel grid (half a tile) in species colors with a dark outline, and trees are baked into the mid tier. From zoom 8 up, everything is drawn as full animated sprites.
12. Forbidden: setInterval/setTimeout game loops; fillRect per tile per frame; O(n²) neighbor searches; allocations, closures, forEach or destructuring inside hot per-tick and per-frame loops; building color strings per draw call (use pre-baked sprites or cached styles); one giant App file; Math.random.
13. Configuration: all tunables (balance, speeds, colors, thresholds, budgets) live in config (config.ts re-exporting config/*.ts by domain); all player-facing text lives in strings (same pattern). No magic numbers in systems.
14. Robustness: every system tick and every render layer runs inside try/catch; a system that throws 3 times in a row is suspended and reported while the game keeps running. Errors appear in an on-screen Dev Console (Backquote key) with a "Copy error" button (Clipboard API with a textarea fallback for iframes). React panels have error boundaries. The game never white-screens. Zero console errors or warnings (including React key warnings), zero TypeScript errors.
15. Code quality: modules ≤ ~400 lines, typed, clear names, short comments on non-obvious algorithms naming the technique. No TODOs, no placeholders, no dead buttons — every visible control works, and features of future steps or phases do not appear in the UI.
16. Browser details: non-passive wheel listener with preventDefault over the canvas; no context menu on the canvas; pointer events with setPointerCapture for strokes and drags; correct devicePixelRatio and resize handling (ResizeObserver); hotkeys use KeyboardEvent.code so they work on any layout (e.g. Russian) and are ignored while typing in inputs; audio is created on the first user gesture; wait for document.fonts before baking text; localStorage (settings only) wrapped in try/catch.
17. Fullscreen: Fullscreen API on the app root; if refused (sandboxed iframe), fall back to an in-page maximized mode and show a toast that explains it.
18. Responsive: the layout must look good from 760 px wide (AI Studio preview pane) to 4K: panels become drawers or bottom sheets, the power bar scrolls horizontally with fade edges, touch targets are ≥ 32 px.
19. Performance: Phase 1 — a 512×512 world with 1,500 animals stays ≥ 55 FPS at 10× on a mid-range laptop; generating 512×512 takes < 2 s and shows progress. By Phase 6 — 5,000 agents. Adaptive quality: if frames exceed the budget for 3 s, step particle density and decorative animation down one level, and restore them when headroom returns; show the current level in the performance overlay.
20. Accessibility: visible keyboard focus, aria-labels on icon buttons, "Reduce motion" honored everywhere (section 4.6).


3. ARCHITECTURE

3.1 Folder map (adapt names to the environment's conventions; keep its entry points and replace its demo content)
engine/ — Game (owns systems, loop, command API), Loop, Scheduler, Rng (sfc32 streams + integer hash), Noise (own seeded 2D simplex, fBm, ridged, domain warp — no library), EventBus (typed events; will feed the Chronicle), Store (UI snapshot), Input (keyboard, pointer, wheel, touch), config/, strings/
world/ — World (tile layers + helpers), WorldGen (async staged pipeline), Erosion, Climate, Hydrology, Biomes, Landmass, Names
sim/ — SpatialHash, Pathfinding, Steering, Bodies (z-axis physics), Wind, Vegetation, Grass, Animals (+ species definitions), Ecology (capacity, stats), Fire, Rain (later: Units, Cities, Kingdoms, Diplomacy, War, Culture, Religion, Climate, Weather, History)
powers/ — PowerRegistry, Brush (stroke interpolation), power definitions by category
render/ — Renderer (layer order), Camera, Palette (OKLCH ramps), FarTerrain, ChunkTerrain (mid/near tiers, autotiling, LRU), Water (animated overlay), SpriteAtlas (ASCII + procedural sprites, outlines, swaps), EntityLayer, Particles, Effects (shake, flash, hit-stop, floating labels), Overlays (map modes, brush preview, selection), Minimap
audio/ — AudioEngine (buses, compressor, reverb), Synth (voices), Sfx, Ambience, Music
ui/ — App, TopBar, PowerBar, BrushPanel, Inspector, MapModeMenu + Legend, PopulationPopover, WorldCreator, GenerationOverlay, Settings, ControlsOverlay, DevConsole, PerfOverlay, Toasts, Tooltip, theme.css
docs/ — DESIGN.md, ROADMAP.md, ARCHITECTURE.md

3.2 Core contracts (shapes; adapt names, keep the ideas)
```ts
interface System { id: string; every: number; init(g: Game): void; tick(g: Game): void; onRegionEdited?(r: Rect): void }

interface GameEvent { type: EventType; tick: number; importance: 0 | 1 | 2 | 3; x?: number; y?: number; data?: Record<string, number | string> }

interface PowerDef {
  id: string; category: PowerCategory; icon: SpriteId; nameKey: StrKey; descKey: StrKey;
  input: 'paint' | 'click' | 'hold' | 'grab';
  brush?: { min: number; max: number; shapes: Array<'circle' | 'square'>; strength?: boolean };
  cursor: CursorId; sfx?: SfxId;
  canApply?(ctx: PowerCtx, x: number, y: number): boolean;   // invalid targets get a red preview
  preview(ctx: PreviewCtx): void;
  apply(ctx: PowerCtx, sample: StrokeSample): void;
  end?(ctx: PowerCtx): void;
}

interface InspectorModel {
  title: string; subtitle?: string; icon?: SpriteId;
  sections: Array<{ label: string; rows: Array<{ label: string; value: string; bar?: number; why?: string }> }>;
  actions: Array<{ id: string; labelKey: StrKey }>;
}
```
- Every inspectable thing (tile and creature now; unit, building, city, kingdom, religion later) provides inspect(id): InspectorModel. The Inspector UI renders any model generically, so later phases add content, not UI rewrites.
- Every power is one PowerDef in PowerRegistry; the power bar, tooltips, hotkey hints and brush panel are generated from the registry.
- Events carry an importance level so the Phase 4 Chronicle can filter them. High-volume facts (births, deaths) go to counters, not events.

3.3 Order of work in each tick and each frame
Tick: queued commands → powers → bodies (physics) → animals think (staggered) → animals move (steering) → vegetation slice → grass slice → fire → rain → ecology stats (slow tick) → event flush → UI snapshot (~5 per second, time-based).
Frame: terrain (far/mid/near with crossfades) → animated water → ground decals → shadows → y-sorted trees and creatures (airborne bodies at y − z) → normal particles → additive particles and glows → birds and clouds → overlays (map mode, brush preview, selection) → floating labels → screen flash. The DOM UI sits on top.

3.4 Data layouts (Phase 1; extend later without breaking)
- Tile layers (W×H): height Float32 (0..1), temperature Float32 (°C), moisture Float32 (0..1), fertility Float32 (0..1), biome Uint8, biomeOverride Uint8 (0 = climate-derived), water Uint8 (none/ocean/lake/river), flowDir Uint8 (D8), flow Float32, grass Uint8, treeSpecies Uint8, treeStage Uint8, treeAge Uint16, resource Uint8, resourceAmount Uint8, fish Uint8, fire Uint8, fuel Uint8, ash Uint8, scorch Uint8, landmass Int32. Reserved for later: owner Int16, traffic Uint16, building Int32.
- Creature pool (SoA, growable): x, y, z, prevX, prevY, prevZ, vx, vy, vz, hunger, energy, health, age, animPhase (Float32); species, state, flags, variant (Uint8); target, group, mate, cooldown (Int32); generation (Uint16).
- Particle pool: a separate SoA with capacity 6,000 (the density setting scales spawn counts).


4. ART DIRECTION

4.1 Style and pixel grid
- "Cozy-epic" pixel art: crisp, readable silhouettes, a harmonious hue-shifted palette, depth through light and shadow. Modern premium pixel art — neither retro-crude nor flat vector.
- One pixel grid: all world graphics (terrain detail, creatures, trees, particles, effects) are authored in np and drawn at the same scale. Never mix pixel sizes, never scale one sprite differently from the world, never blur or smooth pixel art.
- Light comes from the north-west everywhere: hillshading, sprite shading, and shadows cast to the south-east.
- No pure black or pure white: darkest ink #141220, brightest highlight #fff6e0.

4.2 Palette and ramps
- Base colors (the middle step of each ramp): deep ocean #173a5e, ocean #1f4e79, shallow #3b8fb8, foam #cfe9f2, beach #e3cf9a, desert #dcb96a, savanna #b5b04f, grassland #6fae4a, forest floor #3f7d3a, jungle #2a6a3c, swamp #4a6b45, taiga #3d6b52, tundra #9aa98a, snow #eef3f7, hills #8a9a5b, rock #7a7470, peaks #a8a29c, soil #8b6a43, ash #3a3433, lava #ff6a1a, ember #ffb347, bark #6e4b32, wool #efe9dc, fur brown #8a5a3a, fur grey #7d808c.
- render/Palette.ts builds a 5-step ramp for every color in OKLCH (implement the OKLab conversion yourself): for step k ∈ {−2, −1, 0, +1, +2}: L = L0 + 0.075·k; chroma × (1 − 0.12·|k|); hue rotates toward 265° (cool) by 7° per shadow step and toward 85° (warm) by 5° per highlight step; clamp results to the sRGB gamut. Hue shifting is what makes pixel art look painted rather than muddy.
- Shading inside world art is always quantized to ramp steps, with 4×4 Bayer dithering only along band edges — no smooth gradients in world art.
- Kingdom colors (Phase 2+): golden-angle hues, OKLCH chroma 0.13–0.16, lightness 0.62–0.70, each with its own ramp.

4.3 Terrain look (three tiers)
Far tier (zoom < 4): 1 px per tile. Color = the biome ramp step selected by hillshade (height gradient vs. NW light, 5 steps) ± a rare one-step hash variation, ambient occlusion (tiles below their 5×5 mean get darker), forests as hash-mottled canopy greens, rivers and lakes. Water uses a 6-step depth ramp from shallow to deep ocean with dithered boundaries.
Mid tier (4 ≤ zoom < 8): the chunk renderer at 4 np per tile (128×128 per chunk) — the same algorithm as the near tier at half resolution, with trees baked in as small static procedural sprites.
Near tier (zoom ≥ 8): the chunk renderer at 8 np per tile (256×256 per chunk):
1. Materials in precedence order (lowest first): deep water < water < shallow < sand < soil < grass < forest floor < rock < snow. Ash, scorch and ore specks are overlays.
2. Dual-grid autotiling: the render grid is offset by half a tile, so each render cell has its 4 corners on 4 tile centers. Fill the cell with the lowest corner material, then for each higher material M present, draw M's texture through mask[c], where c is the 4-bit set of corners whose material ≥ M. Masks: 16 cases × 4 variants, generated once: a pixel is on when bilinear(cornerBits, u, v) + (valueNoise − 0.5) × 0.35 > 0.5 — organic rounded edges, never stair-steps. The variant is picked by tile hash. Water → sand → grass transitions then appear naturally.
3. Material textures are procedural and world-aligned (sampled at world np coordinates from 32×32-np tiles, so no grid repetition is visible): grass (tufts in 3 shades; sparse flowers on fertile land), sand (specks; wind ripples in deserts), soil (clods), rock (cracks and facets), snow (soft drifts, sparkle pixels), forest floor (leaf litter, moss), swamp (puddles), ash (grey with ember specks while fresh).
4. Within one material, biome color is blended bilinearly between tile centers (dithered), so grassland fades into savanna smoothly.
5. Edges: a 1-np darker rim on the lower side of every higher material (fake thickness), darker wet sand along water, a dark-green grass edge over sand.
6. Light: per-np hillshade from bilinearly interpolated height, quantized to ramp steps with dithering. Cliffs: where a tile is higher than its southern neighbor by more than cliffStep, draw a 2–3 np cliff face in the dark rock ramp with a 1-np light lip.
7. Decals by hash and biome: pebbles, small rocks, twigs, flowers, ore specks on deposits (rusty iron, teal copper, gold glints that twinkle, gem sparkles).
8. Grazing is visible: the grass value (4 levels) blends grass toward soil; a chunk re-bakes only when a tile changes level.
9. Baking: nearest-to-center first, within the frame budget; until a chunk is ready, the lower tier shows through — never holes. LRU capacity = max(config default 128, 1.5 × visible chunks). A re-baked chunk crossfades from its old image over 250 ms, so terrain changes never pop.
Tier transitions crossfade over ±0.5 zoom around 4 and 8.

4.4 Water, rivers and coasts
- Shore foam: an animated 1–2 np foam line that breathes in and out along every shore (sin(time × 0.8 + hash phase)), drawn from per-chunk precomputed shore-edge lists, plus a fainter second line farther out every ~3 s. Mid and near tiers only.
- Wave glints: sparse 2–4 np highlight dashes that appear and fade along a slowly scrolling noise field, more in deep water, aligned with the wind. All tiers (cheap at far zoom).
- Rivers: smooth curves (Catmull-Rom through tile centers in flow order, slight hash jitter), width 2–12 np by √flow, darker banks, light flow dashes drifting downstream so rivers visibly flow; river mouths fan out with a lighter sediment plume.
- Lakes: calmer water, fewer and slower glints, a lighter band along north shores.
- Shallow water near coasts lets the sand tint show through.

4.5 Sprites and animation
- Creatures and icons are hand-authored ASCII pixel maps; trees, bushes, rocks and clouds are generated procedurally. Everything is baked at startup into one atlas canvas, with cached palette-swap and white-flash variants.
- ASCII syntax (example of the format only):
```ts
// '.' transparent · '1'–'5' primary ramp (dark → light) · 'A'–'E' secondary ramp
// 'x' darkest ink (eyes) · 'w' highlight · 'k','l','m' swap ramp (variant / kingdom color)
// Outlines are generated at bake time — never draw them by hand.
const sheepIdle0: Frame = { w: 8, h: 7, anchor: [4, 7], primary: 'wool', secondary: 'skinDark', rows: [/* 7 strings × 8 chars */] };
```
- Auto-outline (selective outline): every transparent pixel touching an opaque one becomes the darkest step of that neighbor's ramp — never black.
- Sizes in np before outline: rabbit 6×5, sheep 8×7, deer 8×9, wolf 9×6, bear 11×8, fish 5×3, bird 5×4, butterfly 3×2. Young animals have their own smaller frames (never scaled). Trees: sapling 5×6, mature 10–12×14, old 12–14×16; berry bush 7×5; cactus 5×9; rocks 4×3 to 7×5. Icons 16×16. Buildings (Phase 2) 16×16 to 32×32.
- Frames per creature: idle 2, walk 4, eat 2, sleep 1 (+ floating "z" particles). Run = walk frames at 1.6× cadence with the upper body shifted 1 np forward. Lying/dead and airborne tumbling use 90° rotations of the idle frame (90° steps are pixel-exact; never rotate pixel art by other angles).
- Animation rules: the walk phase advances with distance traveled (a stride length per species), so feet never skate; facing flips only when |vx| > 0.15 tiles/s (hysteresis); an idle breathing bob of 1 np every ~1.2 s with a per-entity phase; head-down eating frames; a hit flashes white for 2 frames; death = lying frame, a small fur puff, fade over 1.2 s.
- Procedural trees: canopy = union of 3–6 jittered discs shaded with the species ramp by a fake normal (NW light) quantized to 4 shades, plus outline and rim highlight; trunk 2 np wide in the bark ramp; 4 variants per species and stage. Species: oak, birch (white trunk), pine (stacked tiers), palm (curved trunk, fronds), jungle tree (broad, vines), swamp tree (hanging moss), snowy pine (snow caps), cactus (ASCII), berry bush (berries visible when ripe).
- Trees sway: 2 canopy frames offset 1 np along the wind, with a per-tree phase and the traveling gust wave (section 5.9). Burnt trees: a charred variant with flickering ember pixels; dead snags stand ~1 year. Uprooted or felled: 2 lean frames → fallen log + leaves and dust.
- Shadows: pre-baked soft ellipses (3 sizes, #0b0a14 at 28% alpha) offset 1 np south-east under every creature and tree at zoom ≥ 8; for airborne bodies the shadow stays on the ground and shrinks and fades with height.
- Hover: a 1-np light outline on the creature under the cursor. Selection: animated corner brackets.
- Spawn: a 3-frame sparkle-in, a dust puff and a soft sound. Eraser: a poof cloud.

4.6 Effects, particles and light
- One pooled particle system (SoA, ≤ 6,000; density Low/Medium/High scales spawn counts). Particles are square pixels of 1–2 np, never smaller than 1 device pixel, never anti-aliased circles. Below zoom 8, fire is drawn as glowing per-tile pixels and smoke as larger puffs per fire cluster.
- Each particle type defines curves over life (size, alpha, color through a ramp), physics (gravity, drag, wind factor, bounce with restitution) and a blend mode. Types: fire (additive: #fff6e0 → #ffb347 → #ff6a1a → transparent; rises, flickers), smoke (normal blend; rises, grows, drifts with the wind with curl-noise wobble), embers (additive, wind-driven, blinking), sparks (additive, fast, gravity, bounce), debris (rock ramp, ballistic, restitution 0.4, settles), dust (puffs and rings), splash (droplets + an expanding ring), rain (wind-slanted streaks + ground splash dots), leaves, fur, steam (rain on fire), sparkles (Bloom, spawns), hearts (mating, rare), dizzy stars.
- Fake light: pre-baked radial glow sprites drawn additively around fire, embers, lava, lightning and meteors; the ground under a large fire gets a warm tint.
- Screen shake: trauma model — events add trauma (0..1), offset = trauma² × 10 px from smooth noise, trauma decays at 1.6/s. Offset only, no rotation.
- Hit-stop: big impacts freeze simulation and particles for 60–90 ms; the camera punch-zooms +3% and eases back over 250 ms.
- Flash: lightning and meteor impacts flash the screen (white, ≤ 25% alpha, 2 frames, then a 120 ms fade).
- Shockwave: an expanding 2-np ring fading out, plus a dust ring.
- Floating labels: cached pixel-font bitmaps that rise 12 px and fade over 1.5 s ("Wildfire!", "+8 Sheep"); at most 12 at once.
- Reduce motion: no shake, no hit-stop, no punch-zoom, flashes at 30%, calmer ambient motion, instant camera moves.

4.7 Camera feel
- Zoom 1–48 px per tile, anchored under the cursor. Each wheel notch multiplies the target zoom by 1.15 (trackpad pinch / ctrl+wheel proportionally); the real zoom approaches the target exponentially (time constant 80 ms). Equal/Minus keys zoom around the screen center.
- Pan with WASD/arrows (speed ∝ 1/zoom, accelerating over 150 ms) and right- or middle-drag with inertia (release velocity, friction 6/s). Soft clamp: the world edge may enter at most 30% of the viewport; overshoot springs back.
- Fly-to (minimap, toasts, "Go to"): ease-in-out cubic over 600 ms, zooming out and back in for long distances. Home frames the whole world.
- Follow: a critically damped spring toward the target's interpolated position; manual panning cancels follow.
- Pixel-perfect settle (Settings toggle, on by default): 150 ms after zoom input stops, if zoom ≥ 8, ease to the nearest zoom where zoom × devicePixelRatio is a multiple of 8, if it is within ±12% — crisp, uniform pixels at rest.
- Touch: pinch zoom, two-finger pan, long-press = inspect.

4.8 UI design system (ui/theme.css)
- Panels: rgba(18,20,28,0.88) with backdrop-filter: blur(10px) (fallback: 0.96 opacity), 1 px border rgba(255,255,255,0.08), inner top highlight rgba(255,255,255,0.05), radius 6 px (10 px for large panels), shadow 0 8px 24px rgba(0,0,0,0.35). Major panels get small 3×3 px gold pixel corner ornaments.
- Text: primary #ece8df, secondary #a4a8b4, faint #6c7080. Accent gold #f2c14e (hover #ffd36b, pressed #c99a2e, glow rgba(242,193,78,0.35)); danger #e5534b; success #5fc77a; info #58a6ff.
- Type: titles and numbers in "Pixelify Sans" (Google Fonts; monospace fallback), body text in system-ui. Sizes 11/12/13/15/18/24/36 px. Counters use fixed-width digits (tabular-nums or fixed-width spans) so they don't jitter.
- Spacing on a 4 px grid (4/8/12/16/24). Buttons ≥ 32 px tall; power buttons 44×44 with 32×32 icons (16×16 pixel art at 2×).
- States: hover (+6% background lightness; icon buttons lift 1 px), pressed (scale 0.96, 60 ms), selected (1 px gold border + inner glow), disabled (40% opacity, no hover), focus-visible (2 px gold ring).
- Motion: hovers 120 ms ease-out; panels open and close in 200 ms cubic-bezier(0.2, 0.8, 0.2, 1) with an 8 px slide and fade; toasts slide in from the right with a slight overshoot; counters tween over 400 ms; the category underline slides between tabs.
- Icons: pixel art from the SpriteAtlas, converted once into cached data URLs at 2× and 3× and displayed with image-rendering: pixelated. No emoji, no icon fonts.
- Cursors: pixel-art cursors from the atlas (pointer, paint, open hand, closed hand, inspect, not-allowed) as CSS data-URL cursors.
- Tooltips: appear after 350 ms and fade in over 120 ms; name in the title font, a one-line description, the hotkey as a keycap chip; they never cover the hovered control.
- Text drawn on the canvas uses the pixel font with a 1 px dark outline, pre-rendered and cached.

4.9 Audio and music (Web Audio synthesis only)
- Graph: buses (music, sfx, ambience, ui) → master → DynamicsCompressor → destination; a generated convolution reverb (exponentially decaying noise, ~1.8 s) on a send bus.
- Every sound: small pitch and gain randomization (±4%, ±1.5 dB), per-type voice limits (e.g. 4 fire crackles, 6 thuds) and cooldowns; stereo pan from screen x; gain by distance from the screen center and by zoom; off-screen events are quiet or silent.
- Ambience layers, re-mixed every 0.5 s from what is on screen (water share, forest share, burning tiles, zoom) with 1 s crossfades: wind (filtered brown noise, slow LFO), ocean (pink-noise swells, 6–9 s cycles), forest (sparse synthesized bird chirps), fire roar, rain.
- SFX: UI hover tick (very quiet), click, power-select chime, invalid action (soft low blip), brush loops per material (earth rumble, water slosh, sand hiss), spawn pop, fire ignite and crackle, lightning crack with thunder delayed by distance from the screen center (light before sound), meteor (incoming whistle with falling pitch → boom: 45 Hz sine drop + noise burst + reverb → rumble tail), splash, thud (pitch by creature size), throw whoosh (by speed), creature voices (sheep bleat, wolf howl when a pack gathers, bird chirps) — close zoom only, and rare.
- Music: a generative ambient score — soft detuned pads through a low-pass filter on a slow 4-chord modal progression (~60 bpm, 8–16 s per chord), sparse plucked notes from a pentatonic scale, long reverb; never busy, never repetitive. A low tension layer fades in during disasters and out afterwards. Defaults: music 35%, everything else 70%.


5. PHYSICS AND MOTION MODEL

5.1 Units: positions in tiles, velocities in tiles/s, time in seconds (converted to ticks). Terrain height 0..1, shown to the player in meters (sea level = 0 m, top = +4,800 m, bottom = −6,000 m). A body's z = height above the ground in tiles. Integration: semi-implicit Euler at the fixed tick.
5.2 Bodies (creatures, debris, thrown things): gravity 30 tiles/s², air drag 0.4/s, ground friction 6/s while sliding, restitution 0.3 for creatures and 0.4 for debris, speed cap 40 tiles/s. Airborne bodies render at (x, y − z) with their shadow at (x, y).
5.3 Divine Hand: hovering highlights the creature under the cursor; grabbing lifts it 1.5 tiles; while held it hangs from the cursor on a critically damped spring (stiffness ≈ 120), so it lags and swings naturally, and it struggles (alternating frames, squeaks). Release velocity = the cursor velocity averaged over the last 100 ms (clamped) plus an upward toss vz = 4 + 0.2·|v|. Fast throws leave a short motion streak.
5.4 Landing: impact speed v = |vz| at contact. Damage = max(0, v − 9) × 9% of max health (lethal around 20 tiles/s). Bounce with restitution until |vz| < 1.5, slide with friction, then a 0.6 s dizzy state (orbiting stars) before normal behavior. Into water: splash, no damage, and the creature swims to the nearest shore (land animals lose health slowly after 3 s in deep water). Onto fire: it catches fire, takes burn damage and flees. A thrown body hitting another creature faster than 8 tiles/s knocks it back with 50% of the momentum; both tumble.
5.5 Explosions (meteor now; volcano and siege weapons later): bodies within blast radius B get an impulse J = J0 × (1 − d/B)² outward plus upward (vz = 0.6·J); trees within 0.6B are uprooted and fall away from the center; trees within B sway hard for 1 s; debris flies ballistically.
5.6 Locomotion (steering): each species has max speed, max acceleration and max turn rate. Behaviors are weighted and blended: path following (lookahead 1 tile), arrive (slow down near the target), seek, flee (weighted by threat distance), wander (Reynolds wander circle), separation (radius 0.6 tile via the spatial hash), and for groups cohesion + alignment (herds, packs, fish shoals and bird flocks are boids). Terrain speed multipliers: forest 0.8, swamp 0.6, hills 0.75, mountains 0.5, snow 0.7, shallow water 0.5 (wading species only). Land animals never path into deep water; fish never leave water.
5.7 Terrain physics: after any height edit, thermal settling moves material downhill wherever the slope to a neighbor exceeds the material's talus (sand 0.012, soil 0.02, rock 0.045 height units per tile — starting values), over ~1 s, time-sliced inside the edited region, with dust where material moves. Painted mountains slump into natural shapes; sand piles spread.
5.8 Water physics: hydrology (section 7.2) is recomputed after terrain edits — debounced 400 ms after the stroke ends, time-sliced (≤ 3 ms per frame), finished within about a second on 512². Rivers re-route; lakes fill or drain (the chunk crossfade makes it smooth). Digging a channel with Lower redirects a river; damming a valley creates a lake; a crater below sea level next to the sea floods. Ocean = below-sea-level water connected to the main ocean; enclosed basins are handled by hydrology as lakes.
5.9 Wind: one global wind (sim/Wind.ts) whose direction and strength drift slowly over time, with gusts that travel across the map as a visible wave through trees, grass tufts and particles. Fire, smoke, embers, rain, sway, glints and foam all read from it — one source of truth.
5.10 Fire (cellular automaton over an active list): each burning tile has intensity and remaining fuel (from tree stage and grass). Every 2 ticks it tries to ignite each of its 8 neighbors with p = base × fuel × (1 − 0.8 × moisture) × seasonal dryness × (1 + 1.2 × windStrength × cos θ) × (1.4 uphill | 0.7 downhill). Burning forest can throw embers that start spot fires 2–5 tiles downwind (rare). Burn time: grass 2–3 s, forest 6–10 s at 1×. Water, sand, rock, snow and ash never burn; jungles and swamps rarely do; fires weaken in wet seasons. Tune so typical wildfires burn 50–800 tiles, not whole continents. Aftermath: trees become charred snags, grass → 0, ash covers the tile and fades as grass returns (1–2 years), and ash gives +10% fertility for 3 years. Creatures on burning tiles take damage, can catch fire, and flee; fire is a fear source within 4 tiles. Rain extinguishes fire and wets tiles (the moisture boost decays over a season). Natural ignition: dry lightning in summer, more likely in dry, forested regions — wildfires happen without the player.


6. FULL GAME VISION BY PHASE

Phase 1 — Foundation and living nature (build now; section 7)

Phase 2 — Civilizations
- Races with distinct mechanics, preferred biomes, building styles, silhouettes and naming phonemes:
  - Humans: adaptable and balanced, fast tech and trade; grassland and temperate forest; timber houses, later stone with red roofs.
  - Elves: live ~300 years, breed slowly, superb archers, replant instead of clear-cutting; forest and jungle; living-wood halls; dislike deforesters.
  - Dwarves: hills and mountains, mining and smithing bonuses, carved stone halls and mine gates, love gold, hold long grudges.
  - Orcs: breed fast, strong in melee, raiding culture; savanna, steppe, desert; hide huts, spiked palisades, bone totems.
  Each race has its own body sprites (elves tall and slim with pointed ears, dwarves stocky and bearded, orcs broad), skin and hair variants, clothing in the kingdom ramp, and tools and weapons as overlay sprites by job and era.
- Agents: needs (hunger, rest, safety, social); jobs assigned by their city according to shortages (farmer, woodcutter, miner, builder, hunter, fisher, smith, soldier); utility-AI decisions with a readable current thought and the top-3 options with reasons. Work animations per job with particles (wood chips, stone sparks, soil clods, hammer dust); visible carried loads; people enter buildings (chimney smoke while inside).
- Settlements grow camp → village → town → city → metropolis with visible changes. Buildings: town hall, houses, farms on fertile land (fields with crop stages), lumber camp, quarry, mine, storehouse, smithy, barracks, temple, market, docks; walls and towers in later eras. Construction is visible: marked foundation → scaffolding with builders hammering → finished with a dust puff and a chime. Layouts grow organically along roads around a plaza — never grid-stamped. Crowded cities send settlers to found new cities on the best unclaimed sites (fertile land, fresh water, resources); a "Settlement suitability" map mode shows the score.
- Economy: food (grain, meat, fish, berries), wood, stone, ore, gold, tools and weapons; production chains, storage, starvation; growth needs a food surplus and free housing. The city inspector shows itemized blockers ("No free housing", "Food −12/yr").
- Desire paths: a traffic layer with decay; heavily walked tiles become dirt paths, then roads, later stone roads — autotiled, emerging on their own, never placed.
- Territory from city influence; cities belong to kingdoms; capitals. Borders: smooth dashed lines in the kingdom color with a soft 3-tile inner tint. City names on the map (pixel font with outline, size by rank, collision-avoided). Political map mode.
- Tech eras per kingdom: Stone → Bronze → Iron → Medieval → Renaissance. Knowledge comes from population, scholars, trade and contact; eras unlock buildings, visible equipment, walls, ships and new building looks.
- Powers: spawn Humans / Elves / Dwarves / Orcs, Fertility, Bless / Curse (area buffs and debuffs with visible auras), Gift of Knowledge.
- Done when: two humans placed on a default world grow into a kingdom with ≥ 3 cities within 60 years; roads emerge on their own; all four races play differently; 2,500 agents stay ≥ 55 FPS at 5×.

Phase 3 — Kingdoms, diplomacy and war
- Rulers with personality traits; an opinion matrix with itemized, decaying modifiers (shared border, race, religion, trade, past wars, insults, alliances), shown as breakdowns in tooltips.
- Relations: peace, trade pact, alliance, vassal/overlord, truce, war. Low stability causes rebellions; disputed successions cause civil wars; kingdoms split and merge. A Kingdoms panel lists everything with "Why?" breakdowns.
- War: casus belli and war goals, recruitment by culture, generals, armies marching in formation along roads (flow fields for groups), sieges against walls and towers (structure HP with visible damage states; rams and catapults with ballistic projectiles), battles with morale and retreat (routing units visibly flee), arrows as physics projectiles with arcs and shadows, melee with knockback, capture or razing of cities (fire spreads through buildings), refugees, war score, peace treaties (cities, tribute), war exhaustion, allies' calls to arms. No gore — dust, sparks and fading bodies.
- Powers: Madness, Discord, Force Peace, Force War, Inspire, Spawn Hero, Spawn Dragon (a flying world boss: wing animation, a ground shadow, a fire-breath cone that feeds the fire automaton, a lair, a kill record).
- Done when: on a default world with four races, wars start for itemized reasons, armies march and besiege, treaties transfer cities, and a dragon visibly reshapes a region.

Phase 4 — Characters, culture and history
- Every person has a culture-based name, age, race, gender, traits (Brave, Coward, Strong, Clever, Greedy, Generous, Kind, Cruel, Ambitious, Pious, Lucky, Sickly, Charismatic, Paranoid…) with real effects on stats and AI, skills that grow with use, kills, renown and relationships (parents, spouse, children, friends, rivals).
- Families and dynasties, succession laws by culture, trait inheritance with mutation; heroes earn titles ("the Bold", "Dragonslayer").
- Cultures: values (martial, mercantile, scholarly, spiritual, expansionist, isolationist), generated languages (a consistent syllable set per culture for people, cities and kingdoms), cultural drift that creates new cultures.
- Religions: founded by prophets or by the god's Revelation power; tenets, temples, missionaries, conversion, schisms, holy wars; Religion map mode.
- Plague (contact spread, immunity, a visible sickly tint) and an undead-outbreak variant with its own sprites.
- History: EventBus → Chronicle (structured events → varied template sentences, importance filter, icons, click to fly the camera there), Legends (notable people with portraits built from their sprites), per-kingdom histories, procedurally named eras, statistics (population per kingdom over time as stacked area charts, wars, deaths).
- "Why?" everywhere — e.g. "Declared war: border dispute +30, ambitious ruler +20, rival faith +15".
- Done when: after 200 years the Chronicle tells a coherent, readable story with clickable events, and any person or kingdom can be traced through its history.

Phase 5 — Living planet
- Seasons: seasonal palette remaps (spring blossoms, autumn reds and golds on deciduous trees, winter snow spreading by temperature with a soft snowline, snow on trees and roofs) and crop yields.
- Day/night: an ambient color-grading curve (dawn pink, neutral noon, amber dusk, deep-blue night) and additive point lights (windows, torches, fires, lava) that switch on with a stagger at dusk.
- Clouds with ground shadows drifting with the wind; weather fronts that move across the map: rain, thunderstorms (lightning hits high points), snow, fog in valleys at dawn.
- Climate: a global temperature slider plus Ice Age and Heatwave powers — biomes shift gradually; droughts, famines, river floods.
- Disasters: earthquake (shake, fissures, buildings damaged with debris), volcano (eruption; lava as a downhill cellular automaton with viscosity that cools into basalt and builds new land; lava bombs as ballistic projectiles; an ash cloud drifting downwind that cools the climate), tornado (wanders, lifts creatures and debris on orbital paths and flings them), blizzard.
- Naval: docks, fishing boats, trade ships, warships, transports for invasions across the sea; boats bob on waves with foam wakes and animated sails.
- Trade routes (caravans and ships) that create wealth, improve relations and spread tech, religion and disease; Trade map mode.
- Done when: a full year visibly cycles through seasons and day/night with moving weather while 3,000 agents stay ≥ 55 FPS.

Phase 6 — Polish and persistence
- Save/Load: versioned format, typed arrays as base64, gzip via CompressionStream; autosave + 5 slots in IndexedDB with thumbnails (if storage is blocked, fall back to file export); export/import as a file.
- World Laws (no wars, no aging, no disasters, infinite resources…), Photo mode (hide UI, free camera, color-grading filters, PNG export at 1×/2×/4× with crisp scaling), settings (graphics quality presets, particle density, day/night, names and borders, colorblind-safe palette, UI scale, reduce motion), contextual first-run hints.
- Final audio mix and juice pass; performance pass (profiling, pooling, optional Web Worker simulation with transferable typed arrays if it measurably helps).
- Optional "AI Bard": a Chronicle button that turns a kingdom's or hero's events into a short saga via the Gemini API, using the environment's recommended integration. The game must work 100% without it.
- Done when: a 5,000-agent world saves and loads to an identical state, and every setting works.


7. PHASE 1 — DETAILED SPECIFICATION

7.1 World Creator (start screen)
- Layout: the "DEMIURGE" logotype (pixel font, gold ramp, dark outline, slow shimmer) with the tagline "Shape a world. Watch it live."; left — a settings card; right — a large square live preview (crisp pixels, animated glints). Background: the current preview enlarged, blurred and darkened. Below 900 px wide the columns stack.
- Controls: world name (generated from the seed, editable); a seed field with a dice button (a short roll animation) — seeds can be numbers or words (hashed to 32 bits); sizes S 256², M 384², L 512²; presets Continents, Pangaea, Archipelago, Inland Sea, Highlands as cards with 64×64 mini previews for the current seed; sliders for sea level, temperature, moisture, mountains and rivers (value readouts; double-click resets); stats under the preview (land %, mountains %, rivers, lakes).
- Live preview at 128×128: the same pipeline without erosion, debounced 150 ms. Noise coordinates are normalized by map size, so one seed gives the same shapes at every size and in the preview.
- Buttons: "Generate & Play" (primary, gold); "Blank Ocean" (an empty ocean world to build from scratch); "Flat Grassland" (flat temperate land with an ocean border, full grass, no trees or animals).
- Generation overlay: a progress bar with stage names ("Raising continents…", "Weathering mountains…", "Carving rivers…", "Painting biomes…", "Planting forests…", "Releasing animals…"); the page never freezes (yield between stages and inside long stages).
- World reveal: the camera starts on the whole world and glides (2 s, ease-in-out) to zoom 12 on a "beauty spot" chosen by scoring candidate views (coast, river mouth, forest, mountains, animals). Chunks around it are pre-baked during generation. With Reduce motion the camera jumps there.
- "New World" (in Settings) returns here after a custom confirm dialog.

7.2 World generation (async staged pipeline; per-stage timings logged to the Dev Console)
- Height: simplex fBm (6 octaves, lacunarity 2.0, gain 0.5) with two layers of domain warping for organic coasts. Preset continent masks: Continents — 2–4 low-frequency blobs; Pangaea — one central mass; Archipelago — many islands, higher sea level; Inland Sea — a ring of land around a central sea; Highlands — higher elevation, more mountains and lakes. Every preset fades to ocean in an 8% border margin. Ridged noise multiplied by low-frequency "mountain belt" masks makes ranges, not blobs. Normalize to the target land fraction via a histogram; lightly smooth lowlands.
- Hydraulic erosion: droplet-based (Hans Theobald Beyer, 2015): ~0.25 droplets per tile (≈65k on L), lifetime 30, inertia 0.05, capacity 4, erosion 0.3, deposition 0.3, evaporation 0.01, radius 2 with precomputed brush weights — it carves dendritic valleys and sharp ridges. Then 2 passes of thermal erosion. Budget ≤ 500 ms on L: scale droplets down rather than exceed the total budget.
- Cleanup: remove islands and lakes smaller than 3 tiles.
- Temperature (°C): latitude (+30 at the equator in the middle row, −25 at the top and bottom edges) − 6.5 °C per 1,000 m of elevation + noise (±3) + the global offset slider (±10).
- Moisture: noise + a distance-to-water term (BFS distance field from oceans, lakes and rivers with exponential falloff) + a wind-driven rain shadow: sweep every row west → east carrying air moisture that refills over water and rains out on rising slopes (deposit ∝ height gained), so the leeward sides of ranges are dry.
- Hydrology: priority-flood depression filling (Barnes et al. 2014, with epsilon so every cell drains), D8 flow directions, flow accumulation; rivers where flow passes a threshold scaled by map size and the rivers slider, width by flow; lakes in filled depressions with enough area and depth; rivers carve slightly lower valleys; rivers and lakes raise nearby moisture and fertility. Every river ends in the sea or a lake.
- Biomes: height bands first, using landHeight = (h − sea) / (1 − sea) and depth = sea − h: deep ocean (depth > 0.12), ocean (0.035–0.12), shallow water (< 0.035), beach (land within 2 tiles of the ocean with landHeight < 0.03), hills (landHeight > 0.35), mountains (> 0.6), snowy peaks (> 0.8, or mountains colder than −10 °C). Then the lowland climate table:
  T < −10 °C: snow/ice
  −10 to 2 °C: tundra (moisture < 40%) · taiga (≥ 40%)
  2 to 14 °C: grassland (< 40%) · temperate forest (40–80%) · swamp (> 80% and flat)
  14 to 24 °C: desert (< 20%) · savanna (20–40%) · grassland (40–60%) · temperate forest (60–80%) · swamp (> 80% and flat)
  > 24 °C: desert (< 30%) · savanna (30–55%) · jungle (> 55%)
  Swamps also form on flat, wet floodplains near lakes and river mouths.
- Resources: clustered deposits (thresholded noise) in hills and mountains — iron and copper common, gold rare, gems very rare and high; an amount per tile. Fertility map: floodplains high, deserts low. Fish density in shallow coastal water, highest near river mouths.
- Vegetation: species by biome (oak and birch in temperate forest, pine and snowy pine in taiga, palms on warm beaches, jungle trees, swamp trees, cacti in deserts, berry bushes at forest edges and in grassland); blue-noise placement (hash-jittered grid) modulated by a density noise that forms groves and clearings; initial ages spread across all stages.
- Animals: initial populations per biome (section 7.4); herds and packs placed together.
- Landmass ids by flood fill; recomputed (debounced) after terrain edits.
- Names: the world name from seed-driven syllables (e.g. "Velmora", "Kharun Deep"); new lakes get names from the same generator.
- Target: L generates in < 2 s in total.

7.3 Rendering and camera
- Terrain per sections 4.3–4.4 and LOD per rule 11; trees and creatures as atlas sprites with sway, walk cycles and shadows at close zoom; birds fly above everything with ground shadows.
- Camera per section 4.7.
- Minimap (bottom-right, 180 px, collapsible): the whole world (far tier, downscaled) plus the viewport rectangle; click or drag to move the camera, double-click to fly there; updates after edits.
- Map modes with a legend (bottom-left) and a 200 ms crossfade: Terrain, Biomes (flat colors + names), Elevation (m), Temperature (°C), Moisture (%), Fertility (%), Resources (deposit markers + fish density), Life (smoothed animal-density heatmap, refreshed every 0.5 s; added in Step 1.7). Continuous fields are drawn smoothed, categorical ones crisp. M cycles forward, Shift+M backward.

7.4 Living nature
Vegetation
- Trees: sapling → mature → old → dead snag → fallen log decal → gone (returns fertility). Species timings live in config (sapling stage 2–4 years; mature 20–60 years).
- Seeding: once a year each mature or old tree tries to seed tiles within its radius (pine and birch 3 with a downwind bias, oak 2, palm 1 along coasts); success depends on biome suitability, fertility, moisture and crowding (≤ 4 tree neighbors).
- Succession: on burnt or cleared land grass returns first (1–2 years), then pioneer birch or pine, later slow species like oak — forests visibly heal after fires.
- Grass (0–255 per tile): grazed by herbivores, regrows with fertility × moisture × season (no growth in winter in cold biomes). Overgrazing shows as bare soil (section 4.3).
- Berry bushes ripen in summer and autumn (red pixels), are eaten by bears and rabbits, and regrow the next year.
- Deer browse saplings: without wolves, deer slow forest spread; with wolves, forests expand — a trophic cascade the player can watch.

Animals (starting values in config; tune with ecotest)
Species · habitat · group · diet · walk/run (tiles/s) · vision (tiles) · litter / breeding cooldown · maturity · lifespan
- Rabbit · grassland, forest edge, savanna · loose groups · grass, berries · 1.2/3.6 · 6 · 2–5 / 0.4 yr · 0.3 yr · 3–5 yr
- Sheep · grassland, hills · herd 4–12 · grass · 0.8/2.6 · 7 · 1–2 / 1 yr · 1 yr · 8–12 yr
- Deer · forest, taiga, grassland edges · herd 3–8 · grass, saplings · 1.0/4.2 · 9 · 1–2 / 1 yr · 1.5 yr · 10–15 yr
- Wolf · forest, taiga, tundra, grassland · pack 3–7 · rabbits, sheep, deer, carcasses · 1.3/4.6 · 10 · 2–4 / 1.5 yr · 1.5 yr · 9–13 yr
- Bear · forest, taiga, hills · solitary · berries, fish, carcasses, rarely sheep or deer · 1.0/3.8 · 8 · 1–2 / 2.5 yr · 3 yr · 20–30 yr
- Fish · rivers, lakes, shallow sea · shoal 5–15 · the fish-density layer · 0.8/2.5 (swim) · 4 · 3–8 / 0.5 yr · 0.5 yr · 3–6 yr
- Birds · above land · flocks of 6–20 · visual only, not counted · perch in trees, scatter from disturbances
- Butterflies · over flowering grassland in spring and summer · visual-only particles at close zoom
Variants: white arctic wolves and pale bears in tundra, taiga and snow; cream or brown sheep with a rare black sheep; deer tone variants. Each creature gets a deterministic nickname from its id ("Thistle the Sheep").
- Needs: hunger, energy, health, age. A readable state machine per creature: Wander, Graze/Forage, Hunt (stalk → chase → attack), Eat, Flee, Sleep, Hibernate (bears in winter in cold biomes), Mate, Follow (young follow their mother; herds follow a leader), Swim, Airborne, Dizzy, Dead.
- Decisions: utility scoring every think tick (every 10 ticks, offset by id): candidate actions are scored by curves over needs and perception; the current action gets +0.1 hysteresis so creatures don't flip-flop. The Inspector shows the thought — "Hungry (72%) → grazing 6 tiles north", "Fleeing → wolf 3 tiles away", "Hunting a deer with the pack (4)", "Hibernating until spring" — and the top-3 scores with reasons.
- Perception via the spatial hash. Herd alarm: when one flees, members within 4 tiles flee too (stampedes emerge). Refuges: rabbits on forest tiles are detected at half range. Stamina: predators give up a chase after 4–6 s of running; prey stamina is a bit longer, so prey sometimes escapes.
- Pack hunting: one shared target; members approach from offset angles (flanking); the carcass feeds the whole pack (food value by prey size). Prey fights back when cornered; bears hurt wolves.
- Breeding needs low hunger, an adult mate nearby, an elapsed cooldown, the right season (spring–summer for sheep, deer, wolves and bears; spring–autumn for rabbits) and local density below capacity. Young follow their mother and grow up at maturity.
- Death: old age (probability rising near the lifespan), starvation, predators, fire, drowning, falls, meteor, lightning, eraser. Except for the eraser, death leaves a carcass (lying sprite, fades over ~0.5 years) that predators and bears eat and that enriches fertility.
- Ecology: a soft carrying capacity per chunk for herbivores derived from its grass; birth probability × max(0, 1 − density / capacity); predators breed only after recent meals; global hard caps in config. Initial populations on L: ~500 rabbits, 300 sheep, 250 deer, 60 wolves (12 packs), 25 bears, 400 fish — scaled by area for S and M.
- Required: a default world shows predator–prey cycles for ≥ 100 years with no extinction and no explosion. ecotest PASS = for every seed: no species extinct at the end; total animals stay between 0.4× and 3× the initial count; wolves and rabbits each swing at least ±20% around their mean (cycles exist). Toasts announce when a species dies out or returns.
- Ambient life: fish occasionally leap out of the water (arc + splash ring) near real shoals at close zoom; birds perch, take off, and scatter from lightning, meteors and the Divine Hand; butterflies flutter over flowers.
Fire
- Per section 5.10. A toast when a connected fire grows past 60 tiles ("Wildfire in …"), another when it ends ("… burned 340 tiles").

7.5 God powers
- All powers are PowerDefs. Brush: size 1–20, circle or square, strength 1–5 for height tools; stroke samples are interpolated with spacing max(1, size / 4) tiles, so fast drags leave no gaps. Preview: an animated dashed outline (light with a dark edge, readable on any terrain), a tint over affected tiles, a ghost sprite for spawns; invalid targets show a red tint and the not-allowed cursor, and clicking them plays a soft blip.
- Hotkeys: Q / E switch category; slot keys select the n-th power of the active category in this order: Z X C V B N R T Y U H J K. Tools also have global keys: I Inspect, G Divine Hand, Delete/Backspace Eraser. Every button shows its key as a small keycap and in its tooltip.
Terrain (paint)
- Deep Ocean, Shallow Water: push height to the deep or just-below-sea-level band with a smooth falloff (splashes, slosh).
- Sand: lift to just above sea level if needed; beach near water, desert elsewhere (sand puffs).
- Grass: make land if needed and set grassland with full grass (grass sparkles).
- Soil: bare fertile earth (+20% fertility); grass regrows naturally (clods).
- Hills: raise toward the hills band with noise texture (dust).
- Mountain: raise toward the mountain band with ridged-noise detail — never flat plateaus; peaks get snow by temperature (rock debris, rumble).
- Snow: set snow (snow sparkles).
- River: place springs; water flows downhill along D8 from them, carving a channel; basins on the way fill into lakes and overflow onward to the sea.
- Raise / Lower: smooth cosine falloff by strength, then thermal settling.
- Flatten: blend toward the height under the stroke's first sample.
- Smooth: Gaussian blur of heights inside the brush.
Every edit updates biomes (material brushes set an override; height edits re-derive the biome from climate — e.g. sea floor raised into land becomes beach or grassland by climate), overlays, the minimap, mid/near chunks, landmass ids (debounced) and hydrology (debounced, section 5.8).
Nature
- Plant Forest (paint): biome-appropriate species with blue-noise spacing; saplings pop up with leaf particles and grow to mature over ~3 s, then age normally.
- Bloom (paint): +fertility, +grass, flower decals, sparkles, a soft chime.
- Rain Cloud (hold and drag): a procedural pixel cloud forms at the cursor (puffs grow in), follows with lag and casts a shadow; rain starts after 300 ms, slanted by the wind; it extinguishes fire (steam + hiss), adds moisture and speeds grass growth; the cloud dissipates on release.
Life (paint)
- Sheep, Deer, Rabbit, Wolf, Bear, Fish: spawn rate by stroke distance; only on suitable tiles (fish on water, the rest on land); creatures painted close together form a herd or pack; spawn animation and voice.
Disasters
- Fire (paint): ignites flammable tiles (small poof, ignition sound).
- Lightning (click): an 80 ms darkening flicker → a procedural branching bolt (midpoint displacement, 3 frames, additive glow) that strikes the highest object near the cursor (tree > creature > ground); flash and crack, thunder delayed by distance; kills or badly hurts creatures within 1 tile, ignites fuel, leaves a scorch decal, scatters birds.
- Meteor (click; radius R = 2 + 0.6 × brush size tiles, max 14): anticipation — a pulsing red target ring, a growing shadow, the incoming whistle; the meteor streaks in diagonally over 0.8 s with a fiery trail and smoke. Impact — flash, hit-stop, boom, trauma 0.6–1.0, shockwave ring, a debris burst (ballistic, bouncing), the crater carved over 250 ms (parabolic bowl, rocky rim at 1.0–1.3R, rock and ash ejecta), a ring of fire around ~1.3R, knockback and uprooting with blast radius B = 2.5R (5.5), kills inside R. Aftermath — a dust cloud drifting downwind for ~3 s, smoldering embers, a toast with casualties; a crater below sea level next to water becomes a lake.
Tools
- Inspect (I): click a creature or tile → selection brackets + Inspector.
- Divine Hand (G): grab, carry and throw (5.3–5.4) with open/closed hand cursors.
- Eraser (Delete/Backspace): removes creatures and trees under the brush with poof clouds.

7.6 UI
- Top bar (44 px): left — world name (click to rename) and seed (click to copy); center — date ("Year 12 · Spring" with a season icon) and speed buttons (pause, 1×, 2×, 5×, 10×, 25×; when ticks are dropped, show the effective speed, e.g. "25× → 18×"); right — counters (animals, trees; clicking animals opens the Population popover), map mode menu, settings, controls (?), fullscreen. Below 900 px the labels collapse into icons.
- Bottom center: the power bar — category tabs (icon + name) with a sliding underline, power buttons with keycap hints, horizontal scrolling on narrow screens; the brush panel attached to it shows only the controls the selected power uses (size slider with readout, shape toggle, strength).
- Right: the Inspector (320 px; a drawer below 1100 px, a bottom sheet below 800 px).
  Tile: biome with reasons (e.g. "Grassland · 14 °C · moisture 52% (river 3 tiles away)"), elevation (m), temperature (°C), moisture, fertility, grass, tree (species, stage, age), resource, fire state, landmass.
  Creature: nickname and species, age and life stage, sex, health / hunger / energy bars, state and current thought, top-3 decision scores with reasons, group size, kills (predators); actions Follow and Fly to. Values refresh with the snapshot.
- Toasts (top-right, max 4, 6 s, hover pauses, similar events merge — "3 meteor impacts"): icon, text, "Go to" button. Events: meteor impact (with casualties), large wildfire started / ended, a species died out or returned, a new lake formed (with its generated name).
- Population popover: per-species counts with trend arrows and 100-year sparklines (sampled every season).
- Settings: volumes (master, music, effects, ambience), mute, reduce motion, particle density, pixel-perfect zoom, performance overlay, New World. Each option appears when its feature exists. Persisted in localStorage (guarded).
- Controls overlay (? key = Shift+Slash, and a button): all hotkeys, grouped.
- Hotkeys: Space pause · 1–5 speeds (1×, 2×, 5×, 10×, 25×) · WASD/arrows pan · wheel and Equal/Minus zoom · Home frame the world · [ and ] brush size · Shift+[ and Shift+] strength · \ brush shape · Q/E category · Z X C V B N R T Y U H J K power slots · M / Shift+M map mode · I inspect · G Divine Hand · Delete/Backspace eraser · F follow · Esc cancel / close · F3 performance · Backquote console · ? controls.

7.7 Dev tools
- F3: performance overlay (FPS average and 1% low, frame-time sparkline, sim ms, render ms, bake ms, ticks per frame, effective speed, entities by type, particles, chunks baked per frame, cache size, adaptive quality level).
- Backquote: Dev Console (input with history, an error list with "Copy error"). Commands: help · seed · stats · ff <years> (headless fast-forward without rendering, time-sliced with a progress bar, Esc cancels; 100 years on L in ≤ 60 s) · ecotest [seeds=3] [years=100] (runs ff on fresh default worlds and prints per-species min/max/mean, extinctions and PASS/FAIL per section 7.4) · spawn <species> <n> · kill <species> · events [n] · gallery (Sprite Gallery: every sprite, animation and ramp at 1×, 4× and 8× over grass, sand, snow and water swatches) · crashtest (throws inside a system to prove error isolation) · clear.

7.8 Step plan (each step ends with a checkpoint; its "done when" must be true)
1.1 Engine core & app shell — Loop, Scheduler, Rng/hash, Noise, EventBus, Store, Input, config and strings with real values, theme.css tokens, fonts, layout shell, top bar with working date and speed controls, the toast system, the Settings panel (options appear with their features), fullscreen with fallback, Dev Console (help, seed, stats, crashtest, clear), performance overlay, error isolation. Done when: the loop runs at 60 FPS, speeds and pause work, F3 and Backquote work on a Russian layout, and crashtest shows the error in the console without a white screen.
1.2 World generation — layers and the full pipeline of 7.2 with progress and timings, names, landmass ids, the beauty-spot finder. Done when: L generates in < 2 s (timings in the console); every river ends in the sea or a lake; no islands or lakes under 3 tiles ("stats" prints the counts).
1.3 Palette, terrain rendering, camera, minimap, map modes — OKLCH ramps; far/mid/near tiers with autotiling, water, foam, glints, rivers, cliffs and decals; progressive baking with crossfades; camera feel; minimap; map modes with legends (except Life). Trees appear in Step 1.5. Done when: zoom 1 → 48 is smooth with no seams, holes or shimmering; coasts are rounded at close zoom; climate bands look coherent in the map modes; panning holds 60 FPS.
1.4 World Creator & world flow — 7.1 complete with the generation overlay, world reveal and New World. Done when: DoD 1 passes.
1.5 Sprites, atlas, trees on the map, gallery — ASCII sprites for every species (adult and young), procedural trees, bushes, rocks and clouds, auto-outlines, shadows, swaps, flash variants, icons for every Phase 1 power, cursors; trees drawn in the mid and near tiers; the gallery command. Done when: every sprite reads clearly at 1×, species are distinguishable by silhouette alone, and forests look lush at every zoom.
1.6 Wind, vegetation, fire, particles, effects — 5.9–5.10, the vegetation part of 7.4, the particle system and effects module, natural lightning, tree sway, wildfire toasts. Done when: forests spread, burn and regrow during ff.
1.7 Animals, steering, bodies, ecology — species, utility AI, steering, pathfinding, breeding, death, carcasses, body physics, birds and ambient life, the Life map mode, the Population popover, ff and ecotest. Done when: ecotest passes on 3 seeds.
1.8 God powers & Inspector — registry, brush, power bar, brush panel, every power of 7.5 with preview, feedback and hotkeys; terrain edits with settling and hydrology updates; the Inspector for tiles and creatures with reasons and Follow. Done when: DoD 4, 6 and 7 pass.
1.9 UI completion — controls overlay, tooltips everywhere, cursors, focus states, responsive drawers and bottom sheets, top-bar collapse, a layout pass at 760 px, 1080p and 4K. Done when: DoD 8 passes.
1.10 Audio & music — section 4.9 complete, with sounds wired to every existing action. Done when: every action has a sound, the ambience follows the view, nothing clips or spams.
1.11 Polish, performance, verification — a juice pass against sections 4 and 8, a performance pass against rule 19, the full DoD check, the ROADMAP update and the final report.

7.9 Definition of Done (verify every item)
1. The app opens on the World Creator; the preview updates live; "Generate & Play" at size L finishes in < 2 s with stage progress, then glides to a beautiful spot.
2. Worlds look natural and beautiful at every zoom: organic coasts, eroded mountain ranges, rivers flowing from highlands to the sea, lakes, coherent climate bands, beaches, groves and clearings. Close zoom shows rounded autotiled coasts, textured ground, animated foam and flowing rivers — no stair-steps, no flat fills, no seams.
3. Pan and zoom are smooth at 60 FPS; zoom stays anchored under the cursor; inertia, fly-to and follow feel smooth; minimap navigation works.
4. Every power works with its preview; fast strokes leave no gaps; edits update biomes, rivers, lakes and the minimap immediately; painted mountains settle naturally; digging a channel re-routes a river.
5. "ff 100" on a default world: animals persist and fluctuate in predator–prey cycles, forests spread, wildfires happen, burnt land regrows; "ecotest" prints PASS.
6. The meteor shows anticipation, crater, debris physics, shockwave knockback, uprooted trees, shake, hit-stop and sound; fire spreads with the wind and uphill; rain puts it out with steam; the Divine Hand can grab a wolf (it swings), throw it in an arc, and it bounces and gets dizzy or hurt; a creature thrown into the sea swims to shore.
7. Inspector values are correct and explain themselves; Follow keeps a moving creature smoothly centered.
8. The layout works at 760 px wide, 1080p, 4K and in fullscreen (or the in-page fallback); hotkeys work on a Russian keyboard layout.
9. Audio: the ambience follows the view, music plays softly, every action has a sound; volume sliders and mute work.
10. Performance: 512² with 1,500 animals ≥ 55 FPS at 10× (visible in F3).
11. No console errors or warnings, no TypeScript errors, no Math.random, no dead UI; all text in strings, all tunables in config.
12. docs/DESIGN.md, ROADMAP.md (Phase 1 checked, Decisions, Known limitations) and ARCHITECTURE.md exist and are current.


8. QUALITY GATES, ANTI-PATTERNS AND PITFALLS
Check every checkpoint against this list. Never ship:
- stair-step coastlines or hard biome edges at close zoom; flat single-color areas; color banding instead of dithered ramps;
- pure black outlines or shadows, pure white highlights, oversaturated colors (except fire, lava and magic);
- mixed pixel sizes, blurry scaling, sprites jittering by sub-pixels, pixel art rotated by non-90° angles;
- sliding feet, teleporting, popping in or out without a transition (everything appears and disappears with animation or particles);
- tile-snapped robotic movement, instant direction flips, a camera without easing;
- trees on a uniform random grid (use blue noise + density noise);
- smooth circular particles; effects without anticipation or aftermath;
- emoji or system icons; text over the map without an outline or a panel;
- sounds without variation, identical sounds stacking, clipping;
- simulation data in React state, per-frame allocations, full-grid scans where an active list works;
- placeholders, TODOs, buttons that do nothing, features of later steps visible in the UI.
Known pitfalls in this environment:
- React StrictMode or hot reload creating a second engine or a second rAF loop.
- imageSmoothingEnabled resetting after a canvas resize.
- Seams between chunk canvases at fractional zoom (round both edges of every destination rectangle).
- An AudioContext created before a user gesture (console warning).
- Fonts not loaded before text bitmaps are baked.
- Clipboard, Fullscreen and localStorage blocked inside the preview iframe (use the fallbacks).
- Hotkeys firing while typing, or keys read by `key` instead of `code`.


9. OUTPUT
Start now with the Kickoff reply (section 1.2). When Phase 1 is complete (Step 1.11), finish with a short report: what was built, the controls, how to check each Definition-of-Done item, known limitations, and the extension points Phase 2 will plug into.
