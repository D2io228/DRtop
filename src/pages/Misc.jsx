import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CalendarDays, Heart, MessageCircle, Search as SearchIcon, UserPlus, Users, X } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, EmptyState, Flag, Img, PageHeader, Tabs } from '../components/ui'
import { userById, users } from '../data/users'
import { places } from '../data/places'
import { specialists } from '../data/specialists'
import { communities } from '../data/social'
import { guides } from '../data/guides'
import { housing } from '../data/market'
import { cx, fmtTime, relativeDay } from '../lib/utils'

const ICONS = {
  heart: <Heart className="h-3.5 w-3.5 fill-white" />,
  follow: <UserPlus className="h-3.5 w-3.5" />,
  comment: <MessageCircle className="h-3.5 w-3.5" />,
  event: <CalendarDays className="h-3.5 w-3.5" />,
  guide: <BookOpen className="h-3.5 w-3.5" />,
  community: <Users className="h-3.5 w-3.5" />,
}
const COLORS = { heart: 'bg-rose-500', follow: 'bg-accent', comment: 'bg-sky-500', event: 'bg-pink-500', guide: 'bg-emerald-500', community: 'bg-amber-500' }

export function Notifications() {
  const { notifications, markAllRead, t } = useApp()
  useEffect(() => () => markAllRead(), []) // eslint-disable-line
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('Notifications')} right={<button onClick={markAllRead} className="mr-2 text-sm font-semibold text-accent">Mark all read</button>} />
      {notifications.length === 0 && <EmptyState emoji="🔔" title="All quiet" text="We’ll let you know when something happens." />}
      {notifications.map((n) => {
        const u = n.userId && userById[n.userId]
        return (
          <Link key={n.id} to={n.link} className={cx('flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-950', !n.read && 'bg-accent-50/60 dark:bg-accent/5')}>
            <div className="relative">
              {u ? <Avatar src={u.avatar} size={44} /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800">{n.icon === 'event' ? '📅' : n.icon === 'guide' ? '🧭' : '👥'}</div>}
              <span className={cx('absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white ring-2 ring-white dark:ring-black', COLORS[n.icon])}>{ICONS[n.icon]}</span>
            </div>
            <div className="min-w-0 flex-1 text-[15px] leading-snug">
              {u && <span className="font-semibold">{u.name} </span>}
              {n.text}
              <span className="muted"> · {n.time}</span>
            </div>
            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
          </Link>
        )
      })}
    </div>
  )
}

export function Search() {
  const { posts, events } = useApp()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const s = q.toLowerCase().trim()
  const m = (str) => str.toLowerCase().includes(s)
  const res = s
    ? {
        places: places.filter((p) => m(`${p.name} ${p.category} ${p.neighborhood} ${p.description}`)),
        people: users.filter((u) => m(`${u.name} ${u.handle} ${u.bio} ${u.neighborhood}`)),
        specialists: specialists.filter((x) => m(`${x.name} ${x.profession} ${x.category}`)),
        events: events.filter((e) => m(`${e.title} ${e.venue} ${e.description}`)),
        communities: communities.filter((c) => m(`${c.name} ${c.nativeName || ''} ${c.description}`)),
        guides: guides.filter((g) => m(`${g.title} ${g.topic}`)),
        posts: posts.filter((p) => m(p.text)),
        housing: housing.filter((h) => m(`${h.title} ${h.neighborhood}`)),
      }
    : null
  const total = res ? Object.values(res).reduce((a, x) => a + x.length, 0) : 0
  const show = (k) => tab === 'all' || tab === k
  const TRENDING = ['residence permit', 'dentist', 'Dorćol', 'language exchange', 'kindergarten', 'simit', 'coworking', 'apartment']

  const Row = ({ to, img, avatar, emoji, title, sub }) => (
    <Link to={to} className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-950">
      {avatar ? <Avatar src={avatar} size={44} /> : img ? <Img src={img} w={120} className="h-11 w-11 rounded-xl" /> : <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-xl dark:bg-neutral-800">{emoji}</div>}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{title}</div>
        <div className="muted truncate text-sm">{sub}</div>
      </div>
    </Link>
  )
  const Group = ({ k, title, children, n }) => (n && show(k) ? <section className="py-2"><div className="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-neutral-400">{title}</div>{children}</section> : null)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="glass sticky top-0 z-20 flex items-center gap-2 px-4 py-3">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 dark:bg-neutral-900">
          <SearchIcon className="h-4 w-4 text-neutral-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places, people, events…" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
          {q && <X className="h-4 w-4 cursor-pointer text-neutral-400" onClick={() => setQ('')} />}
        </div>
      </div>
      {!s ? (
        <div className="px-4 pt-4">
          <div className="text-sm font-bold">Trending in Belgrade</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRENDING.map((x) => <button key={x} onClick={() => setQ(x)} className="chip">🔥 {x}</button>)}
          </div>
        </div>
      ) : (
        <>
          <Tabs value={tab} onChange={setTab} tabs={[{ id: 'all', label: `All ${total}` }, ...Object.entries(res).filter(([, v]) => v.length).map(([k, v]) => ({ id: k, label: `${k[0].toUpperCase()}${k.slice(1)} ${v.length}` }))]} />
          {total === 0 && <EmptyState emoji="🧐" title={`Nothing for “${q}”`} text="Try another word — or ask the community!" />}
          <Group k="places" title="Places" n={res.places.length}>{res.places.map((p) => <Row key={p.id} to={`/place/${p.id}`} img={p.cover} title={`${p.logo} ${p.name}`} sub={`${p.category} · ${p.neighborhood}`} />)}</Group>
          <Group k="specialists" title="Specialists" n={res.specialists.length}>{res.specialists.map((x) => <Row key={x.id} to={`/specialist/${x.id}`} avatar={x.avatar} title={x.name} sub={x.profession} />)}</Group>
          <Group k="people" title="People" n={res.people.length}>{res.people.map((u) => <Row key={u.id} to={`/u/${u.id}`} avatar={u.avatar} title={u.name} sub={`@${u.handle} · ${u.neighborhood}`} />)}</Group>
          <Group k="events" title="Events" n={res.events.length}>{res.events.map((e) => <Row key={e.id} to={`/event/${e.id}`} img={e.cover} title={e.title} sub={`${relativeDay(e.date)} · ${fmtTime(e.date)} · ${e.venue}`} />)}</Group>
          <Group k="communities" title="Communities" n={res.communities.length}>{res.communities.map((c) => <Row key={c.id} to={`/community/c/${c.id}`} img={c.avatar} title={`${c.emoji} ${c.name}`} sub={`${c.members.toLocaleString()} members`} />)}</Group>
          <Group k="guides" title="Guides" n={res.guides.length}>{res.guides.map((g) => <Row key={g.id} to={`/guide/${g.id}`} img={g.cover} title={g.title} sub={g.topic} />)}</Group>
          <Group k="housing" title="Housing" n={res.housing.length}>{res.housing.map((h) => <Row key={h.id} to={`/housing/${h.id}`} img={h.photos[0]} title={h.title} sub={`€${h.price}/mo · ${h.neighborhood}`} />)}</Group>
          <Group k="posts" title="Posts" n={res.posts.length}>{res.posts.map((p) => { const u = userById[p.authorId]; return <Row key={p.id} to={`/post/${p.id}`} avatar={u?.avatar} title={u?.name || 'You'} sub={p.text} /> })}</Group>
        </>
      )}
    </div>
  )
}
