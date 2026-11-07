import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Clock, Globe, ImagePlus, List, MapPin, MessageCircle, Plus, Share2, Ticket, Users, Bookmark } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Chip, ChipRow, EmptyState, FloatingBack, Img, LangBadges, PageHeader, RoundBtn, Segmented, SectionHeader, Flag } from '../components/ui'
import { EventCard, JoinButton } from '../components/cards'
import MapView, { MiniMap } from '../components/MapView'
import { EVENT_CATEGORIES, LANGUAGES } from '../data/meta'
import { placeById } from '../data/places'
import { TODAY } from '../config'
import { cx, fmtDateTime, fmtTime, MONTHS_LONG, relativeDay, sameDay, sortByMatch } from '../lib/utils'
import { getUser } from '../lib/entities'

export default function Events() {
  const { events, me, t, joinedEvents } = useApp()
  const nav = useNavigate()
  const [view, setView] = useState('list')
  const [cat, setCat] = useState('all')
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))

  const list = events
    .filter((e) => cat === 'all' || e.category === cat)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const forYou = sortByMatch(events, me).slice(0, 5)
  const mine = events.filter((e) => joinedEvents.has(e.id))

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <h1 className="h-title">{t('Events')}</h1>
        <div className="flex items-center gap-2">
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { id: 'list', label: <span className="hidden sm:inline">{t('List')}</span>, icon: <List className="h-4 w-4" /> },
              { id: 'calendar', label: <span className="hidden sm:inline">{t('Calendar')}</span>, icon: <CalendarDays className="h-4 w-4" /> },
            ]}
          />
          <button onClick={() => nav('/events/new')} className="btn-accent !px-3.5 !py-2">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">{t('Create event')}</span>
          </button>
        </div>
      </div>
      <ChipRow className="pb-4">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>
          All
        </Chip>
        {EVENT_CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.emoji} {c.label}
          </Chip>
        ))}
      </ChipRow>

      {view === 'list' ? (
        <>
          {cat === 'all' && (
            <section className="mb-8">
              <SectionHeader title="✨ Picked for you" />
              <div className="no-scrollbar flex gap-4 overflow-x-auto px-4">
                {forYou.map((e) => (
                  <EventCard key={e.id} ev={e} wide />
                ))}
              </div>
            </section>
          )}
          {cat === 'all' && mine.length > 0 && (
            <section className="mb-8 px-4">
              <h2 className="section-title mb-3">You’re going</h2>
              <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
                {mine.map((e) => (
                  <Link key={e.id} to={`/event/${e.id}`} className="card flex w-72 shrink-0 items-center gap-3 p-2.5">
                    <Img src={e.cover} w={200} className="h-14 w-14 rounded-2xl" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{e.title}</div>
                      <div className="muted text-xs">
                        {relativeDay(e.date)} · {fmtTime(e.date)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <SectionHeader title={cat === 'all' ? 'Upcoming in Belgrade' : EVENT_CATEGORIES.find((c) => c.id === cat)?.label} />
          {list.length === 0 ? (
            <EmptyState emoji="📅" title="No events here yet" text="Why not host the first one?" action={<button onClick={() => nav('/events/new')} className="btn-accent">Create event</button>} />
          ) : (
            <div className="grid gap-x-5 gap-y-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <EventCard key={e.id} ev={e} />
              ))}
            </div>
          )}
        </>
      ) : (
        <CalendarView events={list} month={month} setMonth={setMonth} day={day} setDay={setDay} />
      )}
    </div>
  )
}

function CalendarView({ events, month, setMonth, day, setDay }) {
  const first = new Date(month)
  const startPad = (first.getDay() + 6) % 7
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysIn }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  const startToday = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())
  const firstUpcoming = events.map((e) => new Date(e.date)).filter((d) => d >= startToday).sort((a, b) => a - b)[0]
  const selected = day || firstUpcoming || TODAY
  const dayEvents = events.filter((e) => sameDay(new Date(e.date), selected))
  return (
    <div className="px-4 md:grid md:grid-cols-[minmax(0,380px)_1fr] md:gap-8">
      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="font-bold">
            {MONTHS_LONG[month.getMonth()]} {month.getFullYear()}
          </div>
          <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="muted grid grid-cols-7 text-center text-xs font-semibold">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const has = events.filter((e) => sameDay(new Date(e.date), d))
            const isSel = sameDay(d, selected)
            const isToday = sameDay(d, TODAY)
            return (
              <button
                key={i}
                onClick={() => setDay(d)}
                className={cx(
                  'relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-semibold transition active:scale-90',
                  isSel ? 'bg-ink-900 text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  isToday && !isSel && 'text-accent',
                  d < new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()) && !isSel && 'opacity-40',
                )}
              >
                {d.getDate()}
                {has.length > 0 && (
                  <span className="absolute bottom-1.5 flex gap-0.5">
                    {has.slice(0, 3).map((e) => (
                      <span key={e.id} className={cx('h-1 w-1 rounded-full', isSel ? 'bg-accent-200' : 'bg-accent')} />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-6 md:mt-0">
        <h2 className="section-title mb-3">{relativeDay(selected.toISOString())}</h2>
        {dayEvents.length === 0 ? (
          <EmptyState emoji="🌙" title="A quiet day" text="No events on this day — pick a day with a purple dot." />
        ) : (
          <div className="space-y-3">
            {dayEvents.map((e) => (
              <Link key={e.id} to={`/event/${e.id}`} className="card flex gap-3 p-3 transition hover:-translate-y-0.5">
                <Img src={e.cover} w={300} className="h-24 w-24 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-accent">{fmtTime(e.date)}</div>
                  <div className="font-bold leading-snug">{e.title}</div>
                  <div className="muted mt-0.5 truncate text-sm">{e.venue}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs">
                    <span className="font-semibold">{e.joined} going</span>
                    <LangBadges langs={e.languages} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function EventPage() {
  const { id } = useParams()
  const { events, me, joinedEvents, toggleEvent, findOrCreateChat, saved, toggleSave, showToast } = useApp()
  const nav = useNavigate()
  const ev = events.find((e) => e.id === id)
  if (!ev) return <EmptyState emoji="🤷" title="Event not found" />
  const joined = joinedEvents.has(ev.id)
  const host = getUser(ev.hostId, me)
  const cat = EVENT_CATEGORIES.find((c) => c.id === ev.category)
  const place = ev.placeId && placeById[ev.placeId]
  const attendees = [...(joined ? ['me'] : []), ...(ev.attendees || []).filter((a) => a !== 'me')]
  const pct = Math.min(1, ev.joined / ev.capacity)
  const openChat = () => nav(`/chat/${findOrCreateChat({ kind: 'event', refId: ev.id, type: 'group' })}`)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Img src={ev.cover} w={1400} className="aspect-[16/10] w-full md:aspect-[2/1] md:rounded-b-[32px]" />
        <FloatingBack
          right={
            <>
              <RoundBtn label="Share" onClick={() => showToast('Event link copied', '🔗')}>
                <Share2 className="h-4 w-4" />
              </RoundBtn>
              <RoundBtn label="Save" onClick={() => toggleSave(`event:${ev.id}`)}>
                <Bookmark className={cx('h-4 w-4', saved.has(`event:${ev.id}`) && 'fill-current')} />
              </RoundBtn>
            </>
          }
        />
      </div>
      <div className="px-4 pt-5">
        <span className="chip !py-1 text-xs">
          {cat?.emoji} {cat?.label}
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight">{ev.title}</h1>

        <div className="mt-4 space-y-3">
          <Row icon={<CalendarDays className="h-5 w-5" />} title={fmtDateTime(ev.date)} sub={`${ev.durationH}h · ${relativeDay(ev.date)}`}>
            <button onClick={() => showToast('Added to your calendar', '📆')} className="text-sm font-semibold text-accent">
              <CalendarPlus className="h-5 w-5" />
            </button>
          </Row>
          <Row icon={<MapPin className="h-5 w-5" />} title={ev.venue} sub={ev.neighborhood} onClick={place ? () => nav(`/place/${place.id}`) : undefined} />
          <Row icon={<Globe className="h-5 w-5" />} title={ev.languages.map((l) => LANGUAGES[l]).join(' · ')} sub="Languages spoken" />
          <Row icon={<Ticket className="h-5 w-5" />} title={ev.price ? `€${ev.price}` : 'Free'} sub={ev.price ? 'Pay at the door' : 'Registration required'} />
        </div>

        <div className="card mt-5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">
              {ev.joined} / {ev.capacity} spots taken
            </span>
            <span className={cx('font-semibold', pct > 0.85 ? 'text-rose-500' : 'text-emerald-600')}>{pct > 0.85 ? 'Almost full!' : `${ev.capacity - ev.joined} left`}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${pct * 100}%` }} />
          </div>
        </div>

        <h2 className="section-title mt-7">About</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{ev.description}</p>

        <h2 className="section-title mt-7">Host</h2>
        <Link to={ev.hostId === 'me' ? '/profile' : `/u/${ev.hostId}`} className="mt-3 flex items-center gap-3">
          <Avatar src={host?.avatar} size={48} flag={host?.country} />
          <div className="flex-1">
            <div className="font-semibold">{host?.name}</div>
            <div className="muted text-sm">Hosted 12 events · ★ 4.9</div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </Link>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="section-title">Who’s going</h2>
          <span className="muted text-sm">{ev.joined} people</span>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4">
          {attendees.map((a) => {
            const u = getUser(a, me)
            return (
              <Link key={a} to={a === 'me' ? '/profile' : `/u/${a}`} className="flex w-16 shrink-0 flex-col items-center gap-1">
                <Avatar src={u?.avatar} size={56} flag={u?.country} />
                <span className="w-full truncate text-center text-xs">{a === 'me' ? 'You' : u?.name.split(' ')[0]}</span>
              </Link>
            )
          })}
          <div className="flex w-16 shrink-0 flex-col items-center gap-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold dark:bg-neutral-800">+{Math.max(0, ev.joined - attendees.length)}</div>
          </div>
        </div>

        <button onClick={openChat} className="card mt-6 flex w-full items-center gap-3 p-4 text-left transition active:scale-[.99]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 text-accent dark:bg-accent/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Event group chat</div>
            <div className="muted text-sm">{joined ? 'Say hi to other attendees' : 'Join the event to chat with attendees'}</div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>

        <h2 className="section-title mt-7 mb-3">Location</h2>
        <MiniMap lat={ev.lat} lng={ev.lng} img={ev.cover} color="#EC4899" height={200} />
        <a href={`https://www.openstreetmap.org/directions?to=${ev.lat}%2C${ev.lng}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-accent">
          Get directions →
        </a>
      </div>

      <div className="glass sticky bottom-0 z-30 mt-8 border-t divider px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex-1">
            <div className="font-bold">{ev.price ? `€${ev.price}` : 'Free'}</div>
            <div className="muted text-xs">
              {relativeDay(ev.date)} · {fmtTime(ev.date)}
            </div>
          </div>
          <JoinButton joined={joined} onClick={() => toggleEvent(ev.id)} className="!px-8 !py-3" />
        </div>
      </div>
    </div>
  )
}

function Row({ icon, title, sub, children, onClick }) {
  return (
    <div onClick={onClick} className={cx('flex items-center gap-3', onClick && 'cursor-pointer')}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{title}</div>
        <div className="muted truncate text-sm">{sub}</div>
      </div>
      {children}
    </div>
  )
}

const COVERS = ['friendsGroup', 'friendsSunset', 'party', 'lecture', 'running', 'concert', 'foodSpread', 'design', 'city', 'coworkLounge']

export function CreateEvent() {
  const { addEvent, me } = useApp()
  const nav = useNavigate()
  const fileRef = useRef()
  const [f, setF] = useState({
    title: '', category: 'meetup', cover: 'friendsGroup', date: '2026-11-20', time: '19:00', venue: '', pick: null, languages: me?.languages.slice(0, 2) || ['en'], capacity: 30, description: '', price: 0,
  })
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const valid = f.title.trim() && f.venue.trim() && f.pick

  const submit = () => {
    const id = addEvent({
      title: f.title.trim(), category: f.category, cover: f.cover, date: `${f.date}T${f.time}`, venue: f.venue.trim(), neighborhood: 'Belgrade',
      lat: f.pick[0], lng: f.pick[1], languages: f.languages, capacity: Number(f.capacity), description: f.description || 'Join us!', price: Number(f.price) || 0, attendees: [],
    })
    nav(`/event/${id}`, { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl pb-12">
      <PageHeader title="Create event" right={<button disabled={!valid} onClick={submit} className="btn-accent mr-1 !py-2">Publish</button>} />
      <div className="space-y-6 p-4">
        <div>
          <label className="label">Cover photo</label>
          <div className="relative overflow-hidden rounded-3xl">
            <Img src={f.cover} w={900} className="aspect-[16/9] w-full" />
            <button onClick={() => fileRef.current.click()} className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-ink-900 backdrop-blur">
              <ImagePlus className="h-4 w-4" /> Upload
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files[0] && set('cover', URL.createObjectURL(e.target.files[0]))}
          />
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            {COVERS.map((c) => (
              <button key={c} onClick={() => set('cover', c)} className={cx('shrink-0 rounded-xl p-0.5 transition', f.cover === c ? 'ring-2 ring-accent' : 'opacity-70')}>
                <Img src={c} w={160} className="h-12 w-16 rounded-lg" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Title</label>
          <input className="input" placeholder="e.g. Board games night at Dorćol" value={f.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label className="label">Category</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_CATEGORIES.map((c) => (
              <Chip key={c.id} active={f.category === c.id} onClick={() => set('category', c.id)}>
                {c.emoji} {c.label}
              </Chip>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={f.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div>
            <label className="label">Time</label>
            <input type="time" className="input" value={f.time} onChange={(e) => set('time', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Place</label>
          <input className="input mb-2" placeholder="Venue name or address" value={f.venue} onChange={(e) => set('venue', e.target.value)} />
          <div className="relative h-56 overflow-hidden rounded-3xl border divider">
            <MapView pick={f.pick} onMapClick={(ll) => set('pick', ll)} zoom={13} />
            {!f.pick && (
              <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] mx-auto w-fit rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white">👆 Tap the map to drop a pin</div>
            )}
          </div>
        </div>
        <div>
          <label className="label">Languages</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LANGUAGES).map(([c, n]) => (
              <Chip key={c} accent active={f.languages.includes(c)} onClick={() => set('languages', f.languages.includes(c) ? f.languages.filter((x) => x !== c) : [...f.languages, c])}>
                {n}
              </Chip>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Capacity</label>
            <input type="number" min={2} className="input" value={f.capacity} onChange={(e) => set('capacity', e.target.value)} />
          </div>
          <div>
            <label className="label">Price (€, 0 = free)</label>
            <input type="number" min={0} className="input" value={f.price} onChange={(e) => set('price', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={4} className="input resize-none" placeholder="What should people expect?" value={f.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <button disabled={!valid} onClick={submit} className="btn-accent w-full py-3.5 text-base">
          Publish event
        </button>
        {!valid && <p className="muted -mt-3 text-center text-xs">Add a title, venue and drop a pin on the map.</p>}
      </div>
    </div>
  )
}
