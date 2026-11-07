import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Heart, MessageCircle, Repeat2, Send, MapPin, Clock, Users, Briefcase, Wifi, Home, BedDouble, Ruler, CalendarDays, ChevronRight, BookOpen } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, AvatarStack, Flag, Img, LangBadges, Rating, Verified } from './ui'
import { cx, fmtNum, timeAgo, fmtTime, relativeDay, monthShort, dayNum, isOpenNow, overlap } from '../lib/utils'
import { getUser } from '../lib/entities'
import { placeById } from '../data/places'
import { communityById, translations } from '../data/social'
import { COUNTRIES, LANGUAGES, interestById, EVENT_CATEGORIES } from '../data/meta'
import { guideById } from '../data/guides'

const TYPE_STYLES = {
  question: { label: 'Question', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  recommendation: { label: 'Recommendation', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  guide: { label: 'Guide', cls: 'bg-accent-100 text-accent-700 dark:bg-accent/20 dark:text-accent-200' },
}

export function TypePill({ type }) {
  const s = TYPE_STYLES[type]
  if (!s) return null
  return <span className={cx('rounded-full px-2 py-0.5 text-[11px] font-bold', s.cls)}>{s.label}</span>
}

function DoubleTapPhoto({ src, onDoubleTap, className }) {
  const last = useRef(0)
  const [hearts, setHearts] = useState([])
  const handle = (e) => {
    const now = Date.now()
    if (now - last.current < 300) {
      const rect = e.currentTarget.getBoundingClientRect()
      const id = now
      setHearts((h) => [...h, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 900)
      onDoubleTap()
      last.current = 0
    } else last.current = now
  }
  return (
    <div className={cx('relative shrink-0 cursor-pointer select-none overflow-hidden', className)} onClick={handle}>
      <Img src={src} w={900} className="h-full w-full" draggable={false} />
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="pointer-events-none absolute h-24 w-24 fill-white text-white drop-shadow-xl animate-heart-pop"
          style={{ left: (h.x || 0) - 48, top: (h.y || 0) - 48 }}
        />
      ))}
    </div>
  )
}

export function PostCard({ post, compact }) {
  const { me, liked, toggleLike, reposted, toggleRepost, saved, toggleSave, showToast, events } = useApp()
  const nav = useNavigate()
  const author = getUser(post.authorId, me)
  const [showTr, setShowTr] = useState(false)
  const [bump, setBump] = useState(0)
  if (!author) return null
  const isLiked = liked.has(post.id)
  const likeCount = post.likes + (isLiked ? 1 : 0)
  const isRe = reposted.has(post.id)
  const place = post.placeId && placeById[post.placeId]
  const community = post.communityId && communityById[post.communityId]
  const event = post.eventId && events.find((e) => e.id === post.eventId)
  const guide = post.guideId && guideById[post.guideId]
  const like = () => {
    if (!isLiked) toggleLike(post.id)
    setBump((b) => b + 1)
  }
  const authorLink = post.authorId === 'me' ? '/profile' : `/u/${post.authorId}`

  return (
    <article className="flex gap-3 border-b divider px-4 py-4">
      <Link to={authorLink} className="shrink-0">
        <Avatar src={author.avatar} size={40} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Link to={authorLink} className="truncate text-[15px] font-semibold hover:underline">
            {author.name}
          </Link>
          <Flag code={author.country} />
          <span className="muted shrink-0 text-sm">· {timeAgo(post.time)}</span>
          <div className="flex-1" />
          <TypePill type={post.type} />
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <LangBadges langs={author.languages} max={3} />
          {community && (
            <Link to={`/community/c/${community.id}`} className="muted truncate text-xs hover:underline">
              in {community.emoji} {community.name}
            </Link>
          )}
        </div>
        <Link to={`/post/${post.id}`} className="mt-1.5 block whitespace-pre-line text-[15px] leading-relaxed">
          {post.text}
        </Link>
        {post.lang !== 'en' && translations[post.id] && (
          <div className="mt-1">
            <button onClick={() => setShowTr((s) => !s)} className="text-xs font-semibold text-neutral-500 hover:text-accent">
              {showTr ? 'Hide translation' : `See translation · ${LANGUAGES[post.lang] ?? post.lang}`}
            </button>
            {showTr && <p className="mt-1 border-l-2 border-accent pl-3 text-[14px] italic text-neutral-600 animate-fade-in dark:text-neutral-300">{translations[post.id]}</p>}
          </div>
        )}
        {post.photos?.length > 0 && (
          <div className={cx('no-scrollbar mt-3 flex gap-2 overflow-x-auto', post.photos.length > 1 && '-mr-4 pr-4')}>
            {post.photos.map((p, i) => (
              <DoubleTapPhoto key={i} src={p} onDoubleTap={like} className={cx('rounded-2xl', post.photos.length > 1 ? 'h-64 w-52' : 'aspect-[4/3] w-full max-w-md')} />
            ))}
          </div>
        )}
        {place && (
          <Link to={`/place/${place.id}`} className="mt-3 flex items-center gap-2.5 rounded-2xl border divider p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-lg dark:bg-neutral-800">{place.logo}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{place.name}</div>
              <div className="muted flex items-center gap-1 truncate text-xs">
                <MapPin className="h-3 w-3" /> {place.category} · {place.neighborhood}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </Link>
        )}
        {event && (
          <Link to={`/event/${event.id}`} className="mt-3 flex items-center gap-2.5 rounded-2xl border divider p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <Img src={event.cover} w={120} className="h-10 w-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{event.title}</div>
              <div className="muted truncate text-xs">
                {relativeDay(event.date)} · {fmtTime(event.date)} · {event.joined} going
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </Link>
        )}
        {guide && (
          <Link to={`/guide/${guide.id}`} className="mt-3 flex items-center gap-2.5 rounded-2xl border divider p-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent dark:bg-accent/20">
              <BookOpen className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{guide.title}</div>
              <div className="muted text-xs">Guide · {guide.readMin} min read</div>
            </div>
          </Link>
        )}
        {post.jobId && (
          <Link to={`/job/${post.jobId}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            <Briefcase className="h-4 w-4" /> View job
          </Link>
        )}
        <div className="-ml-2 mt-2 flex items-center gap-1 text-neutral-500">
          <button onClick={() => (toggleLike(post.id), setBump((b) => b + 1))} className={cx('flex items-center gap-1 rounded-full px-2 py-1.5 transition hover:bg-rose-50 dark:hover:bg-rose-500/10', isLiked && 'text-rose-500')} aria-label="Like">
            <Heart key={bump} className={cx('h-[19px] w-[19px]', isLiked && 'fill-current', bump > 0 && 'animate-like-bump')} />
            <span className="text-[13px] tabular-nums">{fmtNum(likeCount)}</span>
          </button>
          <button onClick={() => nav(`/post/${post.id}`)} className="flex items-center gap-1 rounded-full px-2 py-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Comment">
            <MessageCircle className="h-[19px] w-[19px]" />
            <span className="text-[13px] tabular-nums">{post.comments.length || ''}</span>
          </button>
          <button onClick={() => toggleRepost(post.id)} className={cx('flex items-center gap-1 rounded-full px-2 py-1.5 transition hover:bg-emerald-50 dark:hover:bg-emerald-500/10', isRe && 'text-emerald-500')} aria-label="Repost">
            <Repeat2 className="h-[19px] w-[19px]" />
            <span className="text-[13px] tabular-nums">{fmtNum(post.reposts + (isRe ? 1 : 0)) || ''}</span>
          </button>
          <button onClick={() => showToast('Link copied', '🔗')} className="rounded-full px-2 py-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Share">
            <Send className="h-[18px] w-[18px]" />
          </button>
          <div className="flex-1" />
          <button onClick={() => toggleSave(`post:${post.id}`)} className={cx('rounded-full px-2 py-1.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800', saved.has(`post:${post.id}`) && 'text-ink-900 dark:text-white')} aria-label="Save">
            <Bookmark className={cx('h-[19px] w-[19px]', saved.has(`post:${post.id}`) && 'fill-current')} />
          </button>
        </div>
      </div>
    </article>
  )
}

export function JoinButton({ joined, onClick, className = '', size = '' }) {
  const { t } = useApp()
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className={cx(joined ? 'btn-soft' : 'btn-accent', size, className)}
    >
      {joined ? `✓ ${t('Joined')}` : t('Join')}
    </button>
  )
}

export function EventCard({ ev, wide }) {
  const { joinedEvents, toggleEvent, saved, toggleSave, me, t } = useApp()
  const joined = joinedEvents.has(ev.id)
  const cat = EVENT_CATEGORIES.find((c) => c.id === ev.category)
  const attendees = [...(joined && me ? ['me'] : []), ...(ev.attendees || [])]
  return (
    <Link to={`/event/${ev.id}`} className={cx('group block', wide && 'w-[300px] shrink-0 sm:w-[340px]')}>
      <div className="relative overflow-hidden rounded-3xl">
        <Img src={ev.cover} w={900} className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex w-12 flex-col items-center rounded-2xl bg-white py-1.5 text-ink-900 shadow-sm">
          <span className="text-[10px] font-bold text-accent">{monthShort(ev.date)}</span>
          <span className="text-lg font-extrabold leading-none">{dayNum(ev.date)}</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSave(`event:${ev.id}`)
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-900 backdrop-blur transition active:scale-90"
          aria-label="Save"
        >
          <Bookmark className={cx('h-4 w-4', saved.has(`event:${ev.id}`) && 'fill-current')} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-ink-900 backdrop-blur">
            {cat?.emoji} {cat?.label}
          </span>
          {ev.price > 0 ? (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">€{ev.price}</span>
          ) : (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">Free</span>
          )}
        </div>
      </div>
      <div className="px-1 pt-3">
        <div className="text-[17px] font-bold leading-snug tracking-tight">{ev.title}</div>
        <div className="muted mt-1 flex items-center gap-1.5 text-sm">
          <Clock className="h-3.5 w-3.5" /> {relativeDay(ev.date)} · {fmtTime(ev.date)}
        </div>
        <div className="muted mt-0.5 flex items-center gap-1.5 truncate text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{ev.venue}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <AvatarStack ids={attendees} resolve={(id) => getUser(id, me)} size={26} />
          <div className="min-w-0 flex-1 text-xs">
            <div className="font-semibold">
              {ev.joined} {t('people joined')}
            </div>
            <LangBadges langs={ev.languages} max={3} />
          </div>
          <JoinButton joined={joined} onClick={() => toggleEvent(ev.id)} size="!py-2 !px-4" />
        </div>
      </div>
    </Link>
  )
}

export function PlaceCard({ p }) {
  const { saved, toggleSave } = useApp()
  const open = isOpenNow(p.hours)
  return (
    <Link to={`/place/${p.id}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl">
        <Img src={p.cover} w={600} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.04]" />
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSave(`place:${p.id}`)
          }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 backdrop-blur transition active:scale-90"
          aria-label="Save"
        >
          <Bookmark className={cx('h-4 w-4', saved.has(`place:${p.id}`) && 'fill-current')} />
        </button>
        <div className="absolute -bottom-0 left-2.5 translate-y-1/2" />
      </div>
      <div className="px-0.5 pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{p.logo}</span>
          <span className="truncate text-[15px] font-semibold">{p.name}</span>
          {p.verified && <Verified />}
        </div>
        <div className="muted truncate text-[13px]">
          {p.category} · {p.neighborhood}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[13px]">
          <Rating value={p.rating} small />
          {p.priceFrom != null && <span className="font-semibold">from €{p.priceFrom}</span>}
          <span className={cx('text-xs font-semibold', open ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400')}>{open ? '● Open' : '○ Closed'}</span>
        </div>
        <div className="mt-1.5">
          <LangBadges langs={p.languages} />
        </div>
      </div>
    </Link>
  )
}

const AVAIL = { today: 'Available today', tomorrow: 'Tomorrow', 'this week': 'This week' }

export function SpecialistCard({ s }) {
  return (
    <Link to={`/specialist/${s.id}`} className="card block p-4 transition hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <Avatar src={s.avatar} size={56} flag={s.country} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[15px] font-semibold">{s.name}</span>
            {s.verified && <Verified />}
          </div>
          <div className="muted truncate text-[13px]">{s.profession}</div>
          <div className="mt-1 flex items-center gap-2">
            <Rating value={s.rating} count={s.reviewsCount} small />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <LangBadges langs={s.languages} />
        <span className="text-sm font-bold">{s.priceFrom ? `from €${s.priceFrom}` : 'Free consult'}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
        <span className={cx('h-2 w-2 rounded-full', s.availability === 'today' ? 'bg-emerald-500' : 'bg-amber-400')} />
        {AVAIL[s.availability]} · {s.neighborhood}
      </div>
    </Link>
  )
}

export function JobCard({ j }) {
  const { saved, toggleSave } = useApp()
  return (
    <Link to={`/job/${j.id}`} className="card block p-4 transition hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-2xl dark:bg-neutral-800">{j.logo}</div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug">{j.title}</div>
          <div className="muted text-[13px]">
            {j.company} · {j.neighborhood}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSave(`job:${j.id}`)
          }}
          className="icon-btn -mr-2 -mt-2 h-9 w-9"
          aria-label="Save"
        >
          <Bookmark className={cx('h-4 w-4', saved.has(`job:${j.id}`) && 'fill-current')} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">{j.type}</span>
        <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
          {j.remote === 'Remote' && <Wifi className="h-3 w-3" />}
          {j.remote}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          €{fmtNum(j.salaryMin)}–{fmtNum(j.salaryMax)}/mo
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="muted">Requires</span>
          <LangBadges langs={j.languages} />
        </div>
        <span className="muted text-xs">{j.posted}</span>
      </div>
    </Link>
  )
}

export function HousingCard({ h }) {
  const { saved, toggleSave } = useApp()
  const [idx, setIdx] = useState(0)
  const ref = useRef()
  const onScroll = () => {
    const el = ref.current
    setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }
  return (
    <Link to={`/housing/${h.id}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl">
        <div ref={ref} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {h.photos.map((p) => (
            <Img key={p} src={p} w={700} className="aspect-[4/3] w-full shrink-0 snap-center" />
          ))}
        </div>
        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
          {h.photos.map((_, i) => (
            <span key={i} className={cx('h-1.5 rounded-full bg-white transition-all', i === idx ? 'w-4' : 'w-1.5 opacity-60')} />
          ))}
        </div>
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-ink-900 backdrop-blur">{h.available === 'Now' ? 'Available now' : `From ${h.available}`}</span>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSave(`housing:${h.id}`)
          }}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 backdrop-blur transition active:scale-90"
          aria-label="Save"
        >
          <Bookmark className={cx('h-4 w-4', saved.has(`housing:${h.id}`) && 'fill-current')} />
        </button>
      </div>
      <div className="px-0.5 pt-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px] font-semibold">{h.title}</span>
          <span className="shrink-0 text-[15px] font-extrabold">
            €{h.price}
            <span className="text-xs font-medium text-neutral-400">/mo</span>
          </span>
        </div>
        <div className="muted mt-0.5 flex items-center gap-3 text-[13px]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {h.neighborhood}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {h.rooms === 1 && h.area < 20 ? 'Room' : `${h.rooms} rm`}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" /> {h.area} m²
          </span>
        </div>
      </div>
    </Link>
  )
}

export function PersonCard({ u, onHi }) {
  const { me, t } = useApp()
  const shared = overlap(u.interests, me?.interests || [])
  const sharedLangs = overlap(u.languages, me?.languages || []).filter((l) => l !== 'en')
  return (
    <div className="card flex flex-col p-4">
      <Link to={`/u/${u.id}`} className="flex items-start gap-3">
        <Avatar src={u.avatar} size={60} flag={u.country} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">{u.name}</div>
          <div className="muted truncate text-[13px]">
            From {COUNTRIES[u.country]} · {u.neighborhood}
          </div>
          <div className="muted text-[13px]">In Belgrade since {u.since.slice(0, 4)}</div>
        </div>
      </Link>
      <div className="mt-3 flex items-center gap-1.5">
        <LangBadges langs={u.languages} />
      </div>
      <div className="mt-2.5 flex min-h-[28px] flex-wrap gap-1">
        {u.interests.slice(0, 4).map((i) => (
          <span key={i} className={cx('rounded-full px-2 py-0.5 text-xs', shared.includes(i) ? 'bg-accent-100 font-semibold text-accent-700 dark:bg-accent/20 dark:text-accent-200' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300')}>
            {interestById[i]?.emoji} {interestById[i]?.label}
          </span>
        ))}
      </div>
      {(shared.length > 0 || sharedLangs.length > 0 || u.country === me?.country) && (
        <div className="mt-2 text-xs font-semibold text-accent">
          ✨ {[u.country === me?.country && 'Same country', sharedLangs.length > 0 && `Speaks ${sharedLangs.map((l) => LANGUAGES[l]).join(', ')}`, shared.length > 0 && `${shared.length} shared interest${shared.length > 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
        </div>
      )}
      <div className="flex-1" />
      <button onClick={() => onHi(u)} className="btn-dark mt-4 w-full">
        {t('Say hi')}
      </button>
    </div>
  )
}

export function CommunityCircle({ c, joined, size = 68 }) {
  return (
    <Link to={`/community/c/${c.id}`} className="flex w-[76px] shrink-0 flex-col items-center gap-1.5 text-center">
      <div className={cx('rounded-full p-[2.5px]', joined ? 'bg-gradient-to-tr from-accent via-fuchsia-500 to-amber-400' : 'bg-neutral-200 dark:bg-neutral-800')}>
        <div className="rounded-full bg-white p-[2px] dark:bg-black">
          <div className="relative overflow-hidden rounded-full" style={{ width: size - 9, height: size - 9 }}>
            <Img src={c.avatar} w={200} className="h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-2xl">{c.emoji}</span>
          </div>
        </div>
      </div>
      <span className="line-clamp-2 text-[11px] font-medium leading-tight">{c.name}</span>
    </Link>
  )
}

export function CommunityRow({ c }) {
  const { joinedCommunities, toggleCommunity } = useApp()
  return (
    <Link to={`/community/c/${c.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-900">
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
        <Img src={c.avatar} w={150} className="h-full w-full" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-xl">{c.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate font-semibold">
          {c.name} {c.country && <Flag code={c.country} />}
        </div>
        <div className="muted flex items-center gap-1 text-xs">
          <Users className="h-3 w-3" /> {fmtNum(c.members)} members
        </div>
      </div>
      <JoinButton joined={joinedCommunities.has(c.id)} onClick={() => toggleCommunity(c.id)} size="!py-1.5 !px-3.5 text-xs" />
    </Link>
  )
}


