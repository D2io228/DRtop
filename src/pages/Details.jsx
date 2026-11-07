import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Bookmark, CalendarDays, Check, ChevronRight, Clock, Globe, MapPin, MessageCircle, Navigation, Phone, Share2, Briefcase, Wifi, BedDouble, Ruler, Layers, PawPrint, Sofa, FileText, ShieldCheck,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, EmptyState, Flag, FloatingBack, Img, LangBadges, PageHeader, Rating, RoundBtn, Sheet, Stars, Tabs, Verified, Chip } from '../components/ui'
import { EventCard, JobCard } from '../components/cards'
import { MiniMap } from '../components/MapView'
import { placeById } from '../data/places'
import { specialistById } from '../data/specialists'
import { housingById } from '../data/market'
import { userById } from '../data/users'
import { COUNTRIES, LANGUAGES, mapCat } from '../data/meta'
import { APP_NAME } from '../config'
import { cx, fmtNum, hoursLabel, isOpenNow, overlap, WEEK } from '../lib/utils'
import { getUser } from '../lib/entities'

function Reviews({ reviews: initial, rating, count }) {
  const { me, showToast } = useApp()
  const [reviews, setReviews] = useState(initial)
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="section-title">Reviews</h2>
        <button onClick={() => setOpen(true)} className="text-sm font-semibold text-accent">Write a review</button>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="text-4xl font-extrabold">{rating.toFixed(1)}</div>
        <div>
          <Stars value={Math.round(rating)} size="h-4 w-4" />
          <div className="muted text-xs">{fmtNum(count + reviews.length - initial.length)} reviews</div>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {reviews.map((r, i) => {
          const u = getUser(r.userId, me)
          return (
            <div key={i} className="flex gap-3 animate-fade-up">
              <Avatar src={u.avatar} size={36} flag={u.country} />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                  <span className="muted text-xs">{r.time}</span>
                </div>
                <p className="mt-0.5 text-[15px] leading-relaxed">{r.text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Your review">
        <div className="space-y-4 px-5 pb-6">
          <Stars value={stars} onChange={setStars} />
          <textarea rows={4} className="input resize-none" placeholder="What did you like? Was it easy to communicate in your language?" value={text} onChange={(e) => setText(e.target.value)} />
          <button
            disabled={!text.trim()}
            className="btn-dark w-full"
            onClick={() => {
              setReviews([{ userId: 'me', rating: stars, text: text.trim(), time: 'now' }, ...reviews])
              setText('')
              setOpen(false)
              showToast('Thanks for your review!', '⭐')
            }}
          >
            Publish review
          </button>
        </div>
      </Sheet>
    </section>
  )
}

function ActionBtn({ icon, label, onClick, href, active }) {
  const cls = cx('flex flex-1 flex-col items-center gap-1 rounded-2xl py-3 text-xs font-semibold transition active:scale-95', active ? 'bg-accent text-white' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800')
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{icon}{label}</a>
  return <button onClick={onClick} className={cls}>{icon}{label}</button>
}

export function PlacePage() {
  const { id } = useParams()
  const p = placeById[id]
  const { me, events, jobs, followedBiz, toggleFollowBiz, findOrCreateChat, saved, toggleSave, showToast, t } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('about')
  if (!p) return <EmptyState emoji="🤷" title="Place not found" />
  const open = isOpenNow(p.hours)
  const placeEvents = events.filter((e) => e.placeId === p.id)
  const placeJobs = jobs.filter((j) => j.placeId === p.id)
  const following = followedBiz.has(p.id)
  const owner = p.ownerId && userById[p.ownerId]
  const speaks = me && overlap(p.languages, me.languages.filter((l) => l !== 'en'))
  const todayIdx = (new Date().getDay() + 6) % 7
  const isOrg = p.kind === 'org'

  const message = () => nav(`/chat/${findOrCreateChat({ kind: 'business', refId: p.id })}`)

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:rounded-b-[32px]">
          {p.photos.map((ph) => (
            <Img key={ph} src={ph} w={1200} className="aspect-[16/10] w-full shrink-0 snap-center md:aspect-[2/1]" />
          ))}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">1/{p.photos.length}</span>
        <FloatingBack
          right={
            <>
              <RoundBtn label="Share" onClick={() => showToast('Link copied', '🔗')}><Share2 className="h-4 w-4" /></RoundBtn>
              <RoundBtn label="Save" onClick={() => toggleSave(`place:${p.id}`)}><Bookmark className={cx('h-4 w-4', saved.has(`place:${p.id}`) && 'fill-current')} /></RoundBtn>
            </>
          }
        />
      </div>
      <div className="px-4">
        <div className="-mt-8 flex items-end justify-between">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-4 ring-white dark:bg-ink-800 dark:ring-black">{p.logo}</div>
          {!isOrg && (
            <button onClick={() => toggleFollowBiz(p.id)} className={cx(following ? 'btn-soft' : 'btn-dark', '!py-2')}>
              {following ? '✓ Following' : t('Follow')}
            </button>
          )}
        </div>
        <h1 className="mt-3 flex items-center gap-2 text-[26px] font-extrabold leading-tight tracking-tight">
          {p.name} {p.verified && <Verified className="!h-5 !w-5" />}
        </h1>
        <div className="muted mt-0.5 flex flex-wrap items-center gap-x-2 text-[15px]">
          <span className="h-2 w-2 rounded-full" style={{ background: mapCat[p.kind].color }} />
          {p.category} · {p.neighborhood} {p.price && `· ${p.price}`}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <Rating value={p.rating} count={p.reviewsCount} />
          <span className={cx('font-semibold', open ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>{open ? `Open · until ${hoursLabel(p.hours[todayIdx]).split('–')[1]}` : 'Closed now'}</span>
          {p.followers > 0 && <span className="muted">{fmtNum(p.followers + (following ? 1 : 0))} followers</span>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <LangBadges langs={p.languages} max={6} />
          {p.ownerCountry && <span className="muted flex items-center gap-1 text-xs"><Flag code={p.ownerCountry} /> {COUNTRIES[p.ownerCountry]}-owned</span>}
        </div>
        {speaks?.length > 0 && <div className="mt-2 inline-block rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 dark:bg-accent/15 dark:text-accent-200">🗣️ Staff speak {speaks.map((l) => LANGUAGES[l]).join(', ')}</div>}

        <div className="mt-5 flex gap-2">
          {!isOrg && <ActionBtn icon={<MessageCircle className="h-5 w-5" />} label={t('Message')} onClick={message} active />}
          <ActionBtn icon={<Phone className="h-5 w-5" />} label={t('Call')} href={p.phone ? `tel:${p.phone.replace(/\s/g, '')}` : undefined} onClick={() => showToast('No phone listed', '📵')} />
          <ActionBtn icon={<Navigation className="h-5 w-5" />} label={t('Directions')} href={`https://www.openstreetmap.org/directions?to=${p.lat}%2C${p.lng}#map=17/${p.lat}/${p.lng}`} />
          <ActionBtn icon={<MapPin className="h-5 w-5" />} label="On map" onClick={() => nav(`/?focus=${p.id}`)} />
        </div>
      </div>

      <Tabs
        className="sticky top-0 z-20 mt-6 glass"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'about', label: 'About' },
          { id: 'menu', label: isOrg ? 'Services' : p.kind === 'restaurant' || p.kind === 'cafe' ? 'Menu' : 'Services' },
          { id: 'reviews', label: t('Reviews') },
          ...(placeEvents.length || placeJobs.length ? [{ id: 'more', label: 'Events & jobs' }] : []),
        ]}
      />
      <div className="space-y-8 px-4 pt-5">
        {tab === 'about' && (
          <>
            <p className="text-[15px] leading-relaxed">{p.description}</p>
            {owner && (
              <Link to={`/u/${owner.id}`} className="card flex items-center gap-3 p-3">
                <Avatar src={owner.avatar} size={44} flag={owner.country} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{owner.name}</div>
                  <div className="muted text-xs">Owner · from {COUNTRIES[owner.country]}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </Link>
            )}
            <section>
              <h2 className="section-title mb-3">Hours</h2>
              <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
                {WEEK.map((d, i) => (
                  <div key={d} className={cx('flex justify-between px-4 py-2.5 text-sm', i === todayIdx && 'font-bold')}>
                    <span>{d}{i === todayIdx && ' · today'}</span>
                    <span className={cx(!p.hours[i] && 'text-rose-500')}>{hoursLabel(p.hours[i])}</span>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="section-title mb-1">Location</h2>
              <p className="muted mb-3 text-sm">{p.address}, Belgrade</p>
              <MiniMap lat={p.lat} lng={p.lng} img={p.cover} color={mapCat[p.kind].color} />
            </section>
            <section>
              <h2 className="section-title mb-3">Photos</h2>
              <div className="grid grid-cols-3 gap-1.5">
                {p.photos.map((ph) => <Img key={ph} src={ph} w={400} className="aspect-square w-full rounded-2xl" />)}
              </div>
            </section>
          </>
        )}
        {tab === 'menu' && (
          p.menu.length ? (
            <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
              {p.menu.map((m) => (
                <div key={m.name} className="flex items-center justify-between px-4 py-3.5">
                  <span className="font-medium">{m.name}</span>
                  <span className="font-bold">{m.price ? `€${m.price}` : 'Free'}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState emoji="📋" title="No services listed" text="Contact them directly for details." />
        )}
        {tab === 'reviews' && (p.reviews.length ? <Reviews reviews={p.reviews} rating={p.rating} count={p.reviewsCount} /> : <EmptyState emoji="⭐" title="No reviews yet" />)}
        {tab === 'more' && (
          <>
            {placeEvents.length > 0 && (
              <section>
                <h2 className="section-title mb-3">Upcoming events</h2>
                <div className="grid gap-6 sm:grid-cols-2">{placeEvents.map((e) => <EventCard key={e.id} ev={e} />)}</div>
              </section>
            )}
            {placeJobs.length > 0 && (
              <section>
                <h2 className="section-title mb-3">Open jobs</h2>
                <div className="grid gap-3 sm:grid-cols-2">{placeJobs.map((j) => <JobCard key={j.id} j={j} />)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']
const DAYS = ['Today', 'Tomorrow', 'Mon 9', 'Tue 10', 'Wed 11']

export function SpecialistPage() {
  const { id } = useParams()
  const s = specialistById[id]
  const { me, findOrCreateChat, saved, toggleSave, showToast, pushNotification, t } = useApp()
  const nav = useNavigate()
  const [book, setBook] = useState(false)
  const [svc, setSvc] = useState(0)
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(null)
  if (!s) return <EmptyState emoji="🤷" title="Specialist not found" />
  const user = s.userId && userById[s.userId]
  const speaks = me && overlap(s.languages, me.languages.filter((l) => l !== 'en'))

  const confirm = () => {
    const b = { service: s.services[svc], day: DAYS[day], slot }
    setBooked(b)
    setBook(false)
    showToast(`Booked: ${DAYS[day]} at ${slot}`, '✅')
    pushNotification({ icon: 'event', text: `Booking confirmed with ${s.name} — ${DAYS[day]} ${slot}`, link: `/specialist/${s.id}` })
    findOrCreateChat({ kind: 'specialist', refId: s.id, intro: `Hi! I just booked “${b.service.name}” for ${b.day} at ${b.slot}. See you then!` })
  }

  return (
    <div className="mx-auto max-w-3xl pb-4">
      <PageHeader
        title={s.name}
        subtitle={s.profession}
        right={
          <button className="icon-btn" onClick={() => toggleSave(`specialist:${s.id}`)} aria-label="Save">
            <Bookmark className={cx('h-5 w-5', saved.has(`specialist:${s.id}`) && 'fill-current')} />
          </button>
        }
      />
      <div className="px-4 pt-6 text-center">
        <Avatar src={s.avatar} size={104} flag={s.country} className="mx-auto" />
        <h1 className="mt-4 flex items-center justify-center gap-1.5 text-2xl font-extrabold tracking-tight">
          {s.name} {s.verified && <Verified className="!h-5 !w-5" />}
        </h1>
        <div className="muted">{s.profession} · {s.neighborhood}</div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Rating value={s.rating} count={s.reviewsCount} />
          <LangBadges langs={s.languages} />
        </div>
        {s.verified && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 dark:bg-accent/15 dark:text-accent-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified — license & ID checked by {APP_NAME}
          </div>
        )}
        {speaks?.length > 0 && <div className="mt-2 text-xs font-semibold text-accent">🗣️ Speaks your language: {speaks.map((l) => LANGUAGES[l]).join(', ')}</div>}
        <div className="mx-auto mt-5 flex max-w-sm gap-2">
          <button onClick={() => nav(`/chat/${findOrCreateChat({ kind: 'specialist', refId: s.id })}`)} className="btn-ghost flex-1 py-3">
            <MessageCircle className="h-4 w-4" /> {t('Message')}
          </button>
          <button onClick={() => setBook(true)} className="btn-accent flex-1 py-3">
            <CalendarDays className="h-4 w-4" /> {t('Book')}
          </button>
        </div>
      </div>

      {booked && (
        <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-emerald-50 p-4 animate-fade-up dark:bg-emerald-500/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="h-5 w-5" /></div>
          <div className="text-sm">
            <div className="font-bold">You’re booked!</div>
            <div className="muted">{booked.service.name} · {booked.day} at {booked.slot}</div>
          </div>
        </div>
      )}

      <div className="space-y-8 px-4 pt-8">
        <section>
          <h2 className="section-title mb-2">About</h2>
          <p className="text-[15px] leading-relaxed">{s.about}</p>
          {user && (
            <Link to={`/u/${user.id}`} className="mt-2 inline-block text-sm font-semibold text-accent">View community profile →</Link>
          )}
        </section>
        <section>
          <h2 className="section-title mb-3">Services & prices</h2>
          <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
            {s.services.map((x, i) => (
              <button key={x.name} onClick={() => (setSvc(i), setBook(true))} className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <div>
                  <div className="font-medium">{x.name}</div>
                  {x.duration && <div className="muted flex items-center gap-1 text-xs"><Clock className="h-3 w-3" /> {x.duration}</div>}
                </div>
                <span className="font-bold">{x.price ? `€${x.price}` : 'Free'}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="section-title mb-3">Location</h2>
          <MiniMap lat={s.lat} lng={s.lng} avatar={s.avatar} color="#22C55E" />
        </section>
        <Reviews reviews={s.reviews} rating={s.rating} count={s.reviewsCount} />
      </div>

      <Sheet open={book} onClose={() => setBook(false)} title={`Book with ${s.name.split(' ').slice(-1)[0]}`}>
        <div className="space-y-5 px-5 pb-6">
          <div>
            <div className="label">Service</div>
            <div className="space-y-2">
              {s.services.map((x, i) => (
                <button key={x.name} onClick={() => setSvc(i)} className={cx('flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition', svc === i ? 'border-accent bg-accent-50 dark:bg-accent/10' : 'divider')}>
                  <span className="font-medium">{x.name}</span>
                  <span className="font-bold">{x.price ? `€${x.price}` : 'Free'}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Day</div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {DAYS.map((d, i) => <Chip key={d} active={day === i} onClick={() => (setDay(i), setSlot(null))}>{d}</Chip>)}
            </div>
          </div>
          <div>
            <div className="label">Time</div>
            <div className="grid grid-cols-4 gap-2">
              {SLOTS.map((sl, i) => {
                const taken = (i + day) % 3 === 0
                return (
                  <button key={sl} disabled={taken} onClick={() => setSlot(sl)} className={cx('rounded-xl border py-2.5 text-sm font-semibold transition', slot === sl ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-black' : 'divider', taken && 'line-through opacity-30')}>
                    {sl}
                  </button>
                )
              })}
            </div>
          </div>
          <button disabled={!slot} onClick={confirm} className="btn-accent w-full py-3.5">
            Confirm booking {slot && `· ${DAYS[day]} ${slot}`}
          </button>
          <p className="muted text-center text-xs">Free cancellation up to 24h before. Pay at the appointment.</p>
        </div>
      </Sheet>
    </div>
  )
}

export function JobPage() {
  const { id } = useParams()
  const { jobs, findOrCreateChat, saved, toggleSave, me, t } = useApp()
  const nav = useNavigate()
  const j = jobs.find((x) => x.id === id)
  const [applied, setApplied] = useState(false)
  if (!j) return <EmptyState emoji="🤷" title="Job not found" />
  const place = j.placeId && placeById[j.placeId]
  const apply = () => {
    setApplied(true)
    const chatId = findOrCreateChat({ kind: 'job', refId: j.id, intro: `Hi! I’d like to apply for “${j.title}”. I speak ${me.languages.map((l) => LANGUAGES[l]).join(', ')}. My CV is attached 🙂`, attachment: { name: `CV_${me.name.split(' ')[0]}.pdf`, size: '214 KB' } })
    setTimeout(() => nav(`/chat/${chatId}`), 300)
  }
  const missing = j.languages.filter((l) => !me?.languages.includes(l))
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={j.company} subtitle="Job" right={<button className="icon-btn" onClick={() => toggleSave(`job:${j.id}`)} aria-label="Save"><Bookmark className={cx('h-5 w-5', saved.has(`job:${j.id}`) && 'fill-current')} /></button>} />
      <div className="space-y-7 px-4 pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-neutral-100 text-3xl dark:bg-neutral-800">{j.logo}</div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{j.title}</h1>
            <div className="muted mt-0.5">{place ? <Link to={`/place/${place.id}`} className="hover:underline">{j.company}</Link> : j.company} · {j.neighborhood}</div>
            <div className="muted text-sm">Posted {j.posted} · {j.applicants} applicants</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { icon: <Briefcase className="h-4 w-4" />, label: 'Type', v: j.type },
            { icon: <Wifi className="h-4 w-4" />, label: 'Work mode', v: j.remote },
            { icon: <span className="text-sm">€</span>, label: 'Salary / month', v: `€${fmtNum(j.salaryMin)}–${fmtNum(j.salaryMax)}` },
            { icon: <Globe className="h-4 w-4" />, label: 'Languages', v: j.languages.map((l) => l.toUpperCase()).join(' + ') },
          ].map((x) => (
            <div key={x.label} className="rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-900">
              <div className="muted flex items-center gap-1.5 text-xs">{x.icon} {x.label}</div>
              <div className="mt-1 font-bold">{x.v}</div>
            </div>
          ))}
        </div>
        <div className={cx('rounded-2xl p-3 text-sm font-semibold', missing.length ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300')}>
          {missing.length ? `⚠️ Requires ${missing.map((l) => LANGUAGES[l]).join(', ')} — not in your profile` : '✅ You speak all required languages'}
          {j.niceToHave.length > 0 && <span className="font-normal"> · Nice to have: {j.niceToHave.map((l) => LANGUAGES[l]).join(', ')}</span>}
        </div>
        <section>
          <h2 className="section-title mb-2">About the role</h2>
          <p className="text-[15px] leading-relaxed">{j.description}</p>
        </section>
        {j.perks.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Perks</h2>
            <div className="flex flex-wrap gap-2">{j.perks.map((p) => <span key={p} className="chip">✓ {p}</span>)}</div>
          </section>
        )}
      </div>
      <div className="glass sticky bottom-0 mt-8 flex items-center gap-3 border-t divider px-4 py-3">
        <div className="flex-1 text-sm"><span className="font-bold">€{fmtNum(j.salaryMin)}–{fmtNum(j.salaryMax)}</span><span className="muted"> /month</span></div>
        <button onClick={apply} className={cx(applied ? 'btn-soft' : 'btn-accent', '!px-8 !py-3')}>{applied ? '✓ Applied' : t('Apply')}</button>
      </div>
    </div>
  )
}

export function HousingPage() {
  const { id } = useParams()
  const h = housingById[id]
  const { findOrCreateChat, saved, toggleSave, showToast } = useApp()
  const nav = useNavigate()
  if (!h) return <EmptyState emoji="🤷" title="Listing not found" />
  const owner = h.ownerId ? userById[h.ownerId] : { name: h.ownerName, avatar: h.ownerAvatar }
  const msg = () => nav(`/chat/${findOrCreateChat({ kind: 'housing', refId: h.id, intro: `Hi! Is “${h.title}” still available? I’d love to schedule a viewing.` })}`)
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:rounded-b-[32px]">
          {h.photos.map((p) => <Img key={p} src={p} w={1200} className="aspect-[4/3] w-full shrink-0 snap-center md:aspect-[16/9]" />)}
        </div>
        <FloatingBack right={<><RoundBtn label="Share" onClick={() => showToast('Link copied', '🔗')}><Share2 className="h-4 w-4" /></RoundBtn><RoundBtn label="Save" onClick={() => toggleSave(`housing:${h.id}`)}><Bookmark className={cx('h-4 w-4', saved.has(`housing:${h.id}`) && 'fill-current')} /></RoundBtn></>} />
      </div>
      <div className="space-y-7 px-4 pt-5">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{h.title}</h1>
          <div className="muted mt-1 flex items-center gap-1"><MapPin className="h-4 w-4" /> {h.address}, {h.neighborhood}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { icon: <BedDouble className="h-5 w-5" />, v: h.rooms === 1 && h.area < 20 ? 'Room' : `${h.rooms} rooms` },
            { icon: <Ruler className="h-5 w-5" />, v: `${h.area} m²` },
            { icon: <Layers className="h-5 w-5" />, v: h.floor },
            { icon: <PawPrint className="h-5 w-5" />, v: h.pets ? 'Pets OK' : 'No pets' },
          ].map((x, i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-2xl bg-neutral-100 py-3 text-xs font-semibold dark:bg-neutral-900">{x.icon}{x.v}</div>
          ))}
        </div>
        <section>
          <h2 className="section-title mb-2">Description</h2>
          <p className="text-[15px] leading-relaxed">{h.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {h.furnished && <span className="chip"><Sofa className="h-4 w-4" /> Furnished</span>}
            {h.features.map((f) => <span key={f} className="chip">✓ {f}</span>)}
          </div>
        </section>
        <section>
          <h2 className="section-title mb-3">Owner</h2>
          <div className="card flex items-center gap-3 p-3">
            <Avatar src={owner.avatar} size={48} flag={owner.country} />
            <div className="flex-1">
              <div className="font-semibold">{owner.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5"><span className="muted text-xs">Speaks</span><LangBadges langs={h.ownerLanguages} /></div>
            </div>
            {h.ownerId && <Link to={`/u/${h.ownerId}`} className="text-sm font-semibold text-accent">Profile</Link>}
          </div>
          <div className="muted mt-2 flex items-center gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" /> Owner can register your white card · Contract in English available</div>
        </section>
        <section>
          <h2 className="section-title mb-3">Location</h2>
          <MiniMap lat={h.lat} lng={h.lng} img={h.photos[0]} color="#F59E0B" />
        </section>
      </div>
      <div className="glass sticky bottom-0 mt-8 flex items-center gap-3 border-t divider px-4 py-3">
        <div className="flex-1">
          <div className="text-lg font-extrabold">€{h.price}<span className="text-sm font-medium text-neutral-400"> /month</span></div>
          <div className="muted text-xs">{h.available === 'Now' ? 'Available now' : `Available from ${h.available}`}</div>
        </div>
        <button onClick={msg} className="btn-accent !px-6 !py-3"><MessageCircle className="h-4 w-4" /> Message owner</button>
      </div>
    </div>
  )
}
