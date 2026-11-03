# DEMIURGE — Architecture

The concrete plan for DESIGN.md sections 2–3. Status markers: **[1.1]** exists now, **[1.x]** arrives in
that Phase 1 step, **[P2–P6]** later phases. Every later item plugs into an extension point that exists today.

## 1. Runtime shape

```
index.tsx ─ RootBoundary ─ App ─ GameProvider(getGame())        one Game per page (ui/engineHost.ts)
                                   │ mount(canvas, root) / unmount()
Game ── Loop (rAF) ─┬─ stepTick() × n   fixed 20 Hz accumulator, budgeted, drops ticks when behind
                    ├─ renderFrame(α)   Renderer layers, interpolated by α
                    └─ endFrame()       event flush (paused), toasts, perf, adaptive quality, snapshot 5 Hz
React panels ◀── Store<UiSnapshot> (useSlice) + small stores (ui, settings, toasts, console, errors)
React panels ──▶ game.cmd.*  (typed CommandApi)   ·   canvas input ──▶ Input ──▶ PointerSink (camera/powers)
```

React never re-renders per frame or tick; simulation state never lives in React state (rule 3).

## 2. Module map

| Folder | Module | Responsibility | Step |
|---|---|---|---|
| engine | Game | owns everything below, mount/unmount/destroy, tick + frame host | 1.1 |
| engine | Loop | rAF, fixed timestep, speeds, tick dropping, effective speed, hit-stop `freeze(ms)` | 1.1 |
| engine | Scheduler | ordered `System`s, `every`/`offset` cadence, try/catch, suspend after 3 failures | 1.1 |
| engine | Rng | sfc32 streams `worldgen`/`sim`/`fx`, `hash2(x,y,salt)`, `parseSeed`, `randomSeed` (CSPRNG) | 1.1 |
| engine | Noise | seeded simplex 2D, fBm, ridged multifractal, two-layer domain warp | 1.1 |
| engine | EventBus | typed events (`EventDataMap`), queued → flushed per tick, history ring, counters | 1.1 |
| engine | Store, Snapshot | external store + `UiSnapshot` slices | 1.1 |
| engine | Input | `KeyboardEvent.code` hotkeys from `config/hotkeys`, pointer capture, wheel, pinch | 1.1 |
| engine | CommandApi, Commands | UI → engine API; `SimCommand` queue applied at tick start | 1.1 |
| engine | ErrorLog, Toasts, Settings, UiState, Fullscreen, PerfMonitor, AdaptiveQuality, platform | shell services | 1.1 |
| engine | console/DevConsole, console/commands | command registry; each step registers its commands | 1.1 |
| engine | config/*, strings/* | all tunables and all player-facing text (rule 13) | 1.1 |
| render | Palette, color | OKLab/OKLCH conversion, hue-shifted 5-step ramps, 6-step depth ramp | 1.1 |
| render | AsciiSprite, icons/* | ASCII frame format, bake with selective outline, icon data URLs | 1.1 |
| render | Renderer | canvas, DPR/ResizeObserver, guarded layers, smoothing re-applied on resize | 1.1 |
| render | Backdrop | pre-world "primordial sea" layer; removed when terrain layers land | 1.1→1.3 |
| render | Camera, FarTerrain, ChunkTerrain, Water, Minimap, Overlays | terrain tiers, LRU chunk cache, map modes | 1.3 |
| render | SpriteAtlas, EntityLayer | one atlas canvas, swaps, flash variants, y-sorted row buckets | 1.5 |
| render | Particles, Effects | SoA particle pool (6,000), shake, hit-stop, flash, labels | 1.6 |
| world | World, WorldGen, Erosion, Climate, Hydrology, Biomes, Landmass, Names | layers + async staged pipeline | 1.2 |
| sim | Calendar | season/year events | 1.1 |
| sim | Wind, Vegetation, Grass, Fire, Rain | nature systems | 1.6 |
| sim | SpatialHash, Pathfinding, Steering, Bodies, Animals, Ecology | creatures | 1.7 |
| powers | PowerRegistry, Brush, defs/* | every power is a `PowerDef` | 1.8 |
| audio | AudioEngine, Synth, Sfx, Ambience, Music | Web Audio graph, created on first gesture | 1.10 |
| ui | App, TopBar, SpeedControls, Toasts, SettingsPanel, DevConsole, PerfOverlay, Tooltip, Button, Icon, ErrorBoundary | React panels | 1.1 |
| ui | WorldCreator, GenerationOverlay, PowerBar, BrushPanel, Inspector, MapModeMenu, Legend, PopulationPopover, ControlsOverlay | later panels | 1.3–1.9 |

Entry points follow the AI Studio layout: `index.html`, `index.tsx`, `metadata.json` at the root; no server.

## 3. Lifetime (rule 4)

`getGame()` constructs the engine once per page; constructing has no side effects on the DOM beyond offscreen
canvases. `Shell`'s effect calls `game.mount(canvas, root)` and returns `game.unmount()`, which cancels rAF and
removes every listener/observer. StrictMode's mount → unmount → mount therefore leaves exactly one loop.
`import.meta.hot.dispose` destroys the engine when its module is replaced. `destroy()` will also close the
AudioContext (1.10). `window.demiurge` is a debug handle for the console and automated checks.

## 4. Time (rule 5)

`TICK_MS = 50`. Each frame: `acc += min(dt, 250) × speed`; run ticks while `acc ≥ TICK_MS`, stopping at 40 ticks or
7 ms of sim work; the remainder is dropped and counted. Every second the loop measures `effectiveSpeed` and
`dropping`; the top bar shows "25× → 18×". `alpha = acc / TICK_MS` interpolates rendering. `freeze(ms)` implements
hit-stop. Helpers in `engine/time.ts`: `secondsToTicks`, `yearsToTicks`, `yearOf`, `seasonOf` (600 ticks/year,
150/season, year 1 = spring). `ff` (1.7) bypasses the loop and calls `stepTick()` in time-sliced batches.

## 5. Tick order (section 3.3)

`Game.stepTick()`: `tick++` → `commands.drain()` → `scheduler.run()` → `events.flush()`. Systems are registered in
this order; ids and cadence:

| # | System | every | Step |
|---|---|---|---|
| 1 | powers (applies queued strokes) | 1 | 1.8 |
| 2 | bodies (z-physics, airborne list) | 1 | 1.7 |
| 3 | animals.think (staggered by id, 1/10 per tick) | 1 | 1.7 |
| 4 | animals.move (steering, integration) | 1 | 1.7 |
| 5 | vegetation slice / grass slice | 1 | 1.6 |
| 6 | fire (active list, spreads every 2 ticks) / rain | 1 | 1.6 |
| 7 | wind | 1 | 1.6 |
| 8 | ecology stats | 20 (slow) | 1.7 |
| 9 | calendar | 1 | 1.1 |

Phase 2+ inserts units, cities, economy, kingdoms, diplomacy, war, culture, religion, weather, history as further
systems; slow ones use `every: 20` with distinct `offset`s. Terrain edits call `scheduler.regionEdited(rect)`.
The UI snapshot is time-based (every 200 ms of real time) in `endFrame`, plus immediately after commands.

## 6. Frame order

`Renderer.render()` clears to the deepest water color and draws layers in registration order, each inside
`save()/try/catch/restore()`; 3 consecutive failures suspend a layer. Planned order: terrain (far/mid/near with
crossfades) → water (foam, glints, rivers) → ground decals → shadows → y-sorted trees + creatures (row buckets,
airborne at y − z) → particles (normal) → particles (additive) + glows → birds, clouds → overlays (map mode,
brush preview, selection) → floating labels → screen flash. Shake offsets the whole stack via the camera.
`RenderContext` (reused object) carries dpr, real time, sim time, α, adaptive quality, decor scale, reduce motion.

## 7. Data layouts (section 3.4)

**World [1.2]** `W×H` typed arrays, index `y*W+x`: height/temperature/moisture/fertility/flow `Float32Array`;
biome, biomeOverride, water (0 none/1 ocean/2 lake/3 river), flowDir (D8, 255 = sink), grass, treeSpecies,
treeStage, resource, resourceAmount, fish, fire, fuel, ash, scorch `Uint8Array`; treeAge `Uint16Array`; landmass
`Int32Array`. Reserved: owner `Int16Array`, traffic `Uint16Array`, building `Int32Array` (P2). Chunk metadata
(32×32): dirty flags `Uint8Array`, grass-level hash for re-bake, herbivore capacity `Float32Array`.

**Creature pool [1.7]** SoA with capacity doubling: `x y z prevX prevY prevZ vx vy vz hunger energy health age
animPhase` (Float32), `species state flags variant` (Uint8), `target group mate cooldown` (Int32), `generation`
(Uint16). Ids are `index | generation << 16`; a free list recycles slots; stale ids fail the generation check.
P2 agents (people) get their own pool with the same allocator.

**Spatial hash [1.7]** 8×8-tile cells; each tick: count per cell → prefix sum → scatter ids into one `Int32Array`
(counting sort, no allocation). Queries iterate the cell range.

**Particles [1.6]** SoA, capacity 6,000, swap-remove on death, type table with curves and blend mode.

**Render caches [1.3]** far tier: one `W×H` ImageData + Uint32 view, dirty chunks re-uploaded; mid/near: per-chunk
canvases in an LRU (capacity max(128, 1.5 × visible)), progressive bake queue sorted nearest-first, 250 ms crossfade.

## 8. Events (EventBus)

`emit(type, tick, importance 0–3, data, x?, y?)` queues; `flush()` at tick end (or frame end while paused)
delivers to typed listeners and a 512-entry history ring. Payloads are flat `number | string` records so they can
be saved and phrased by the Chronicle. High-volume facts use `count(key)`.

| Type | Importance | Data | Step |
|---|---|---|---|
| seasonChanged / yearChanged | 0 / 1 | year, season | 1.1 |
| systemSuspended / layerSuspended | 2 | system or layer, message | 1.1 |
| seedChanged | 1 | seed, text | 1.1 |
| worldGenerated | 2 | name, size, preset, ms | 1.2 |
| lakeFormed | 2 | name, area | 1.8 |
| wildfireStarted / wildfireEnded | 2 | region, tiles | 1.6 |
| lightningStrike / meteorImpact | 1 / 3 | casualties, radius | 1.6 / 1.8 |
| speciesExtinct / speciesReturned | 3 | species | 1.7 |
| P2–P4 | 1–3 | cityFounded, eraReached, warDeclared, treatySigned, rulerDied, religionFounded… | P2–P4 |

Toasts subscribe to events (merge keys make "3 meteor impacts"); the Chronicle (P4) reads the history ring.

## 9. UI boundary

```ts
interface UiSnapshot {           // published ≈5×/s and after commands
  rev: number;
  time: { tick; year; season; speedIndex; resumeSpeedIndex; effectiveSpeed; dropping };
  perf: { fpsAvg; fpsLow; frameMs; simMs; renderMs; bakeMs; ticksPerFrame; quality; systemsActive; systemsSuspended; historyRev };
  seed: { text; value };
  errorCount: number;
  // 1.2+: world { name; size; preset; landPct; rivers; lakes }
  // 1.3+: view { zoom; mapMode }   1.7+: population { counts[]; trends[] }   1.8+: power, brush, inspector: InspectorModel | null
}
```

`useSlice(select, isEqual = shallowEqual)` caches the selected slice so panels re-render only on change. Small
stores with immediate updates: `ui` (panel visibility, fullscreen, crash probe), `settings` (persisted, guarded
localStorage), `toasts`, `console.lines`, `errors`. Commands (`game.cmd`): setSpeed, togglePause, set/toggle
console and settings, togglePerfOverlay, setSetting, toggleFullscreen, runConsole, copySeed, copyText, toast
dismiss/pause, clearErrors, escape, hotkey; later selectPower, setBrush, setMapMode, flyTo, follow, inspect, newWorld.

## 10. Powers [1.8]

`PowerRegistry` holds `PowerDef`s (DESIGN 3.2) grouped by category; the power bar, tooltips, keycaps and brush
panel render from it. Input → `Brush` interpolates stroke samples at spacing max(1, size/4) → queued
`SimCommand { kind: 'power', id, x, y, size, shape, strength }` → applied at tick start, so edits stay
deterministic. Height edits call `World.markEdited(rect)` → chunk dirtiness, debounced landmass + hydrology,
`scheduler.regionEdited`. Invalid targets use `canApply` (red preview, not-allowed cursor, blip).

## 11. Inspector [1.8]

Everything inspectable implements `inspect(id): InspectorModel` (title, sections of rows with `bar` and `why`,
actions). The Inspector panel renders any model generically; P2–P4 add providers for units, buildings, cities,
kingdoms and religions without UI changes.

## 12. Art pipeline

`Palette` builds every ramp once (OKLCH, hue shifted toward 265° in shadows and 85° in highlights, clamped between
ink #141220 and highlight #fff6e0). `AsciiSprite.bakeFrame` resolves `1–5 / A–E / x / w / k l m`, adds the
selective outline (darkest step of the neighbor's ramp), and can swap the `klm` ramp. 1.5 extends this into one
`SpriteAtlas` canvas with flash and palette-swap variants; icons and cursors become data URLs (1×/2×/3×).

## 13. Robustness

Systems, render layers, event listeners and console commands are all wrapped; failures go to `ErrorLog`
(deduplicated by source + message, with counts), the Dev Console Errors tab ("Copy error" via Clipboard API or
textarea fallback) and, on suspension, a toast plus a `systemSuspended`/`layerSuspended` event. React panels sit
in `PanelBoundary`s; the root has `RootBoundary`; `window` errors and unhandled rejections are captured.

## 14. Determinism

Simulation randomness only from `rng.sim` (and `rng.worldgen` during generation); visuals and audio only from
`rng.fx` or `hash2`. Commands mutate state only at tick boundaries. Same seed + same command stream = same world;
P6 save/load serializes typed arrays, pools, RNG states (`getState`) and the event history.

## 15. Extension points for Phases 2–6

| Need | Plug into |
|---|---|
| New simulation (cities, economy, war, religion, weather) | a `System` registered at its tick-order slot |
| New entity kind (people, buildings, boats, dragons) | an SoA pool + `EntityLayer` sprite provider + `inspect()` |
| New powers (races, bless, curse, dragon, earthquake) | `PowerDef` in `powers/defs`, icon in `iconArt`, strings |
| New map modes (political, religion, trade, suitability) | `Overlays` map-mode table + legend definition |
| History and Chronicle | EventBus history + new event types + importance |
| New settings (day/night, UI scale, colorblind palette) | `config/settings` + Settings panel row |
| Save/Load, World Laws, Photo mode | Game state serializer over layers/pools/RNG; CommandApi entries |
| AI Bard (optional, P6) | isolated `services/bard` behind a Chronicle button; game works without it |
