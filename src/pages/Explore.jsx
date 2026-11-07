import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Bookmark, ChevronRight, Eye, LocateFixed, Navigation, Play, Search, SlidersHorizontal, Users, X, Clock, Star } from 'lucide-react'
import MapView from '../components/MapView'
import MomentViewer from '../components/MomentViewer'
import { Avatar, Chip, ChipRow, Flag, Img, LangBadges, ProgressRing, Rating, Sheet, Verified } from '../components/ui'
import { JoinButton } from '../components/cards'
import { useApp } from '../store/AppContext'
import { places } from '../data/places'
import { specialists } from '../data/specialists'
import { communities, moments } from '../data/social'
import { userById } from '../data/users'
import { goals } from '../data/guides'
import { LANGUAGES, MAP_CATEGORIES, mapCat } from '../data/meta'
import { cx, distanceKm, fmtKm, fmtNum, fmtTime, isOpenNow, overlap, relativeDay } from '../lib/utils'

const ME = [44.8065, 20.4689]

export default function Explore() {
  const { me, t, events, done, saved, toggleSave, joinedEvents, toggleEvent, joinedCommunities, toggleCommunity } = useApp()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState(params.get('cat') || 'all')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [fly, setFly] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [langs, setLangs] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [openNow, setOpenNow] = useState(false)
  const [myLangs, setMyLangs] = useState(false)
  const [moment, setMoment] = useState(null)

  const totalSteps = goals.reduce((a, g) => a + g.steps.length, 0)
  const progress = done.size / totalSteps

  // Build all map items
  const all = useMemo(() => {
    const items = []
    places.forEach((p) =>
      items.push({ id: p.id, type: p.kind, ref: p, name: p.name, sub: p.category, lat: p.lat, lng: p.lng, img: p.cover, languages: p.languages, rating: p.rating, open: isOpenNow(p.hours), color: mapCat[p.kind].color }),
    )
    specialists.forEach((s) => items.push({ id: s.id, type: 'service', ref: s, name: s.name, sub: s.profession, lat: s.lat, lng: s.lng, avatar: s.avatar, languages: s.languages, rating: s.rating, open: true, color: mapCat.service.color }))
    communities.forEach((c) => items.push({ id: c.id, type: 'community', ref: c, name: c.name, sub: 'Community', lat: c.lat, lng: c.lng, img: c.avatar, languages: c.languages, rating: 5, open: true, color: mapCat.community.color, badge: fmtNum(c.members) }))
    events.forEach((e) => items.push({ id: e.id, type: 'event', ref: e, name: e.title, sub: e.venue, lat: e.lat, lng: e.lng, img: e.cover, languages: e.languages, rating: 5, open: true, color: mapCat.event.color, badge: new Date(e.date).getDate() }))
    return items
  }, [events])

  const filtered = all.filter((it) => {
    if (cat !== 'all' && it.type !== cat) return false
    if (q && !`${it.name} ${it.sub}`.toLowerCase().includes(q.toLowerCase())) return false
    if (langs.length && !overlap(langs, it.languages).length) return false
    if (myLangs && me && !overlap(me.languages.filter((l) => l !== 'en').length ? me.languages.filter((l) => l !== 'en') : me.languages, it.languages).length) return false
    if (minRating && it.rating < minRating) return false
    if (openNow && !it.open) return false
    return true
  })

  // deep-link focus (?focus=b4)
  useEffect(() => {
    const f = params.get('focus')
    if (f) {
      const it = all.find((x) => x.id === f)
      if (it) {
        setSelected(it)
        setFly([it.lat, it.lng])
      }
    }
  }, [params.get('focus')]) // eslint-disable-line

  const select = (it) => {
    setSelected(it)
    setFly([it.lat - 0.004, it.lng])
  }
  const close = () => {
    setSelected(null)
    if (params.get('focus')) setParams({})
  }

  const mapItems = filtered.map((it) => ({ ...it, active: selected?.id === it.id }))
  const filterCount = langs.length + (minRating ? 1 : 0) + (openNow ? 1 : 0)

  return (
    <div className="absolute inset-0 isolate overflow-hidden">
      <MapView items={mapItems} onSelect={select} flyTarget={fly} showMe />

      {/* Top overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] space-y-2.5 p-3 md:max-w-xl">
        <Link to="/guides" className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,.15)] backdrop-blur transition active:scale-[.98] dark:bg-ink-800/95">
          <ProgressRing value={progress} size={38} stroke={4.5}>
            <span className="text-[10px] font-extrabold">{Math.round(progress * 100)}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold leading-tight">
              {t('Your settling-in progress')} {Math.round(progress * 100)}%
            </div>
            <div className="muted truncate text-xs">Next: {nextStep(done)?.title}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        </Link>

        <div className="pointer-events-auto flex gap-2">
          <div className="flex h-12 flex-1 items-center gap-2 rounded-full bg-white px-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,.15)] dark:bg-ink-800">
            <Search className="h-[18px] w-[18px] text-neutral-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search places, people, events…')} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-neutral-400" />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear">
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            )}
          </div>
          <button onClick={() => setFilterOpen(true)} className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,.15)] transition active:scale-90 dark:bg-ink-800" aria-label="Filters">
            <SlidersHorizontal className="h-5 w-5" />
            {filterCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">{filterCount}</span>}
          </button>
        </div>

        <ChipRow className="pointer-events-auto !mx-0 !px-0 pb-1">
          <Chip active={myLangs} accent onClick={() => setMyLangs(!myLangs)} className="shadow-sm">
            🗣️ Speaks my language
          </Chip>
          <Chip active={cat === 'all'} onClick={() => setCat('all')} className="shadow-sm">
            All
          </Chip>
          {MAP_CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? 'all' : c.id)} className="shadow-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      {/* Locate */}
      <button
        onClick={() => setFly([...ME])}
        className="absolute right-3 z-[500] flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,.2)] transition active:scale-90 dark:bg-ink-800"
        style={{ bottom: selected ? 300 : 222 }}
        aria-label="My location"
      >
        <LocateFixed className="h-5 w-5 text-accent" />
      </button>

      {/* Bottom: moments or preview */}
      {!selected && (
        <div className="absolute inset-x-0 bottom-0 z-[500] pb-3 animate-fade-up">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-bold shadow-sm backdrop-blur dark:bg-ink-800/95">
              ✨ {t('Moments around you')}
            </span>
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur dark:bg-ink-800/95">{filtered.length} places on map</span>
          </div>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-3">
            {moments.map((m, i) => {
              const u = userById[m.userId]
              return (
                <button key={m.id} onClick={() => setMoment(i)} className="relative h-[156px] w-[108px] shrink-0 overflow-hidden rounded-2xl shadow-md transition active:scale-95">
                  <Img src={m.photo} w={300} className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
                  <div className="absolute left-2 top-2 rounded-full bg-gradient-to-tr from-accent via-fuchsia-500 to-amber-400 p-[2px]">
                    <Avatar src={u.avatar} size={30} className="rounded-full ring-2 ring-black/20" />
                  </div>
                  {m.type === 'video' && <Play className="absolute right-2 top-2.5 h-4 w-4 fill-white text-white" />}
                  <div className="absolute inset-x-2 bottom-2 text-left text-white">
                    <div className="line-clamp-2 text-[11px] font-semibold leading-tight">{m.caption}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-white/80">
                      <Eye className="h-3 w-3" /> {fmtNum(m.views)}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selected && <Preview it={selected} onClose={close} nav={nav} me={me} saved={saved} toggleSave={toggleSave} joinedEvents={joinedEvents} toggleEvent={toggleEvent} joinedCommunities={joinedCommunities} toggleCommunity={toggleCommunity} t={t} />}

      {moment != null && <MomentViewer list={moments} index={moment} onClose={() => setMoment(null)} />}

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title={t('Filters')}>
        <div className="space-y-6 px-5 pb-6">
          <div>
            <div className="label">City</div>
            <div className="flex gap-2">
              <Chip active>📍 Belgrade</Chip>
              <Chip className="opacity-50">Novi Sad · soon</Chip>
            </div>
          </div>
          <div>
            <div className="label">Category</div>
            <div className="flex flex-wrap gap-2">
              <Chip active={cat === 'all'} onClick={() => setCat('all')}>
                All
              </Chip>
              {MAP_CATEGORIES.map((c) => (
                <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                  {c.emoji} {c.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Language spoken</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LANGUAGES).map(([code, n]) => (
                <Chip key={code} active={langs.includes(code)} accent onClick={() => setLangs(langs.includes(code) ? langs.filter((l) => l !== code) : [...langs, code])}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Minimum rating</div>
            <div className="flex gap-2">
              {[0, 4, 4.5, 4.8].map((r) => (
                <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>
                  {r === 0 ? 'Any' : (
                    <>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r}+
                    </>
                  )}
                </Chip>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between">
            <span className="font-semibold">Open now</span>
            <Toggle on={openNow} onChange={setOpenNow} />
          </label>
          <div className="flex gap-3 pt-2">
            <button
              className="btn-ghost flex-1"
              onClick={() => {
                setLangs([])
                setMinRating(0)
                setOpenNow(false)
                setCat('all')
                setMyLangs(false)
              }}
            >
              Reset
            </button>
            <button className="btn-dark flex-1" onClick={() => setFilterOpen(false)}>
              {t('Show results')} ({filtered.length})
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

export function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} className={cx('relative h-7 w-12 rounded-full transition', on ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700')} aria-pressed={on}>
      <span className={cx('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function nextStep(done) {
  for (const g of goals) for (const s of g.steps) if (!done.has(s.id)) return s
  return { title: 'All done — you’re a local now! 🎉' }
}

function Preview({ it, onClose, nav, me, saved, toggleSave, joinedEvents, toggleEvent, joinedCommunities, toggleCommunity, t }) {
  const r = it.ref
  const dist = fmtKm(distanceKm(ME, [it.lat, it.lng]))
  const cat = mapCat[it.type]
  const speaksMine = me && overlap(it.languages, me.languages.filter((l) => l !== 'en'))
  const link = { event: `/event/${r.id}`, community: `/community/c/${r.id}`, service: r.profession ? `/specialist/${r.id}` : `/place/${r.id}` }[it.type] || `/place/${r.id}`
  const saveKey = `${it.type === 'event' ? 'event' : it.type === 'community' ? 'community' : r.profession ? 'specialist' : 'place'}:${r.id}`

  return (
    <div className="absolute inset-x-0 bottom-0 z-[600] p-3 animate-sheet-up md:left-3 md:right-auto md:w-[400px]">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-ink-800">
        <div className="relative cursor-pointer" onClick={() => nav(link)}>
          {r.profession ? (
            <div className="flex items-center gap-3 p-4 pb-0">
              <Avatar src={r.avatar} size={64} flag={r.country} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-lg font-bold">
                  <span className="truncate">{r.name}</span> {r.verified && <Verified />}
                </div>
                <div className="muted text-sm">{r.profession}</div>
              </div>
            </div>
          ) : (
            <div className="no-scrollbar flex gap-1 overflow-x-auto">
              {(r.photos || [r.cover || r.avatar]).slice(0, 3).map((p, i) => (
                <Img key={i} src={p} w={500} className={cx('h-36 shrink-0', (r.photos?.length || 1) > 1 ? 'w-[70%]' : 'w-full')} />
              ))}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          {!r.profession && (
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-lg font-bold leading-tight">
                  {r.logo && <span>{r.logo}</span>}
                  {r.emoji && <span>{r.emoji}</span>}
                  <span className="truncate">{it.name}</span>
                  {r.verified && <Verified />}
                </div>
                <div className="muted mt-0.5 flex items-center gap-1.5 text-sm">
                  <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                  {it.type === 'event' ? `${relativeDay(r.date)} · ${fmtTime(r.date)}` : it.type === 'community' ? `${fmtNum(r.members)} members` : `${r.category} · ${r.neighborhood}`}
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {(it.type !== 'community' && it.type !== 'event') && <Rating value={r.rating} count={r.reviewsCount} small />}
            {r.hours && <span className={cx('text-xs font-semibold', it.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400')}>{it.open ? `● ${t('Open')}` : `○ ${t('Closed')}`}</span>}
            {it.type === 'event' && (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Users className="h-3.5 w-3.5" /> {r.joined} going
              </span>
            )}
            <span className="muted flex items-center gap-1 text-xs">
              <Navigation className="h-3 w-3" /> {dist}
            </span>
            <LangBadges langs={it.languages} />
          </div>
          {speaksMine?.length > 0 && <div className="mt-2 text-xs font-semibold text-accent">🗣️ Speaks {speaksMine.map((l) => LANGUAGES[l]).join(', ')}</div>}
          <div className="mt-4 flex gap-2">
            {it.type === 'event' ? (
              <JoinButton joined={joinedEvents.has(r.id)} onClick={() => toggleEvent(r.id)} className="flex-1" />
            ) : it.type === 'community' ? (
              <JoinButton joined={joinedCommunities.has(r.id)} onClick={() => toggleCommunity(r.id)} className="flex-1" />
            ) : (
              <a href={`https://www.openstreetmap.org/directions?to=${it.lat}%2C${it.lng}#map=16/${it.lat}/${it.lng}`} target="_blank" rel="noreferrer" className="btn-soft flex-1">
                <Navigation className="h-4 w-4" /> {t('Directions')}
              </a>
            )}
            <button onClick={() => toggleSave(saveKey)} className="btn-soft !px-3" aria-label="Save">
              <Bookmark className={cx('h-4 w-4', saved.has(saveKey) && 'fill-current')} />
            </button>
            <button onClick={() => nav(link)} className="btn-dark flex-1">
              Open <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
