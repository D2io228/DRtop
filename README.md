# Kompas — settle into Belgrade

A clickable, mobile-first prototype of an all-in-one platform that helps immigrants settle into a new country. The launch city is **Belgrade, Serbia**.

People find community, places, events, guides, jobs, housing and specialists. Businesses and self-employed specialists get discovered by clients who speak their language. Everything is connected by **languages spoken** and **country of origin**.

> The product name is a placeholder. To rename it, change `APP_NAME` in [`src/config.js`](src/config.js).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static build in dist/ (works from any sub-path, uses hash routing)
npm run preview
```

There's no backend and no auth. All data is local mock data in `src/data/`, and all state lives in memory, so a refresh restarts onboarding. On the welcome screen, tap **"Skip — explore with a demo profile"** to jump straight in.

### Self-contained build (for sharing as a single hosted page)

```bash
OFFLINE_ASSETS=/path/to/assets VITE_OFFLINE=1 npm run build   # → dist-offline/
```

This build loads no remote images or tiles. Photos, avatars and flags are read from `OFFLINE_ASSETS` (`img/<key>.jpg`, `av/pv<N>.jpg`, `flags/<cc>.png`). Instead of raster tiles, the map is drawn on a canvas from bundled OpenStreetMap data (`src/data/basemap-belgrade.json`: water, parks and main streets of central Belgrade, © OpenStreetMap contributors, ODbL). Routing stays in memory, so the page works inside sandboxed iframes.

## Tech

- React 18 + Vite
- Tailwind CSS (light and dark mode via the `class` strategy, one accent colour `#6C47FF`)
- Leaflet + react-leaflet with **OpenStreetMap** tiles (no API key). Dark mode inverts the tiles with a CSS filter.
- lucide-react icons, Inter font, flag images from flagcdn.com, photos from Unsplash (with a fallback image if one fails), avatars from pravatar.cc

## What's inside

| Section | Highlights |
|---|---|
| **Onboarding** | 3 steps: country + languages, "Who are you?" (Newcomer / Living here a while / Business / Specialist), interest chips. Every section is personalised from these answers. |
| **Explore** (home) | Full-screen map with colour-coded pins (round photo/avatar bubbles that drop in with a bounce), category chips, a "Speaks my language" toggle, a filter sheet (language, category, rating, open now, city), a bottom-sheet preview that opens the full page, a "Your settling-in progress" card, and a **Moments around you** carousel with an Instagram-style story viewer. |
| **Community** | A Threads-style feed: like (double-tap a photo for the heart animation), comment, repost, save, share, and "See translation" on non-English posts. Tabs: For you / Following / My communities / Questions. Community circles open community pages (cover, members, feed, Join, group chat). The composer supports Post / Question / Recommendation / Guide, photos and a tagged place. |
| **Events** | Category chips, large image cards with "N people joined" and a Join button, list and calendar views. Event pages have a description, map, host, attendees, a capacity bar and a group chat. **Create event** lets you pick a cover, date and time, drop a pin on the map, set language and capacity. |
| **Services** | Places & Businesses · Specialists · Jobs · Housing. Grid cards with language badges and filters (category, language, price, rating, availability, job type, remote, salary, district). Business pages (gallery, hours, open-now status, mini-map, menu, reviews, events, jobs; Message / Call / Directions / Follow). Specialist profiles with a Verified badge and a **booking flow**. Jobs: **Apply** opens a chat with a CV attached. Housing: "Message owner". Includes a "List your business" banner. |
| **Guides** | A settling-in checklist with progress rings for 7 goals. Steps link to guides, specialists and places on the map. Community-written guides with helpful votes and comments, topic filters, search, FAQ, and **Ask the community**, which opens a Question post. |
| **Connect** | Discover people with filters (interests, languages, country, neighbourhood), "shared interests" hints, and **Say hi**. Chats: All / Groups / Private, with mock auto-replies and a typing indicator. |
| **Profile** | Avatar, flag, languages, "in Belgrade since…", interests, posts, communities, saved items, settings (dark mode, sign out). Other people's profiles have Follow and Message. **Switch to business** opens the **Business Dashboard**: edit listing, post an event, post a job, stats. |
| **Top bar** | City selector, EN / RU / SR interface switcher (navigation and key labels are translated), search across everything, notifications, Guides, avatar. On desktop, a left sidebar replaces the bottom tabs. |

## Mock data (Belgrade)

16 businesses across Vračar, Dorćol, Savamala, Novi Beograd, Zemun, Stari Grad and Senjak (a Russian café, Turkish bakery, Chinese supermarket, English-speaking dentist, Ukrainian beauty salon, Indian restaurant, coworking space, and more), 6 useful organisations (foreigners' office, bank, embassy district, tax office, SIM store, health insurance), 10 specialists, 10 events, 7 communities, 9 moments, 7 jobs, 5 housing listings, 23 posts (in English, Russian, Ukrainian, Turkish, Chinese, Serbian, Persian, Italian and German), 9 guides, 5 chats and 24 users from 20 countries. All names are fictional.

## Project structure

```
src/
  config.js            app name, city, "today" for the prototype
  data/                mock data (places, users, events, posts, guides, chats…)
  store/AppContext.jsx in-memory state + actions (likes, joins, chats, posts…)
  lib/                 utils (dates, personalisation scoring), i18n, entity helpers
  components/          Layout (top bar, tabs, sidebar), MapView, cards, UI kit, Composer, MomentViewer
  pages/               Onboarding, Explore, Community, Events, Services, Details, Guides, Connect, Profile, Misc
```
