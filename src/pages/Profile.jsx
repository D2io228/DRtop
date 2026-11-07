import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Briefcase, CalendarDays, Eye, Heart, LogOut, MapPin, MessageCircle, Moon, Pencil, Settings, Sun, TrendingUp, Users, Plus, Store, ChevronRight, Globe } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Chip, EmptyState, Flag, Img, LangBadges, PageHeader, Sheet, Tabs } from '../components/ui'
import { CommunityRow, EventCard, HousingCard, JobCard, PlaceCard, PostCard, SpecialistCard } from '../components/cards'
import { userById } from '../data/users'
import { communities, communityById } from '../data/social'
import { placeById } from '../data/places'
import { specialistById } from '../data/specialists'
import { housingById } from '../data/market'
import { guideById } from '../data/guides'
import { COUNTRIES, interestById, INTERESTS, LANGUAGES, NEIGHBORHOODS, ROLES } from '../data/meta'
import { cx, fmtNum, MONTHS_LONG } from '../lib/utils'

const sinceLabel = (s) => {
  const [y, m] = s.split('-')
  return `${MONTHS_LONG[Number(m) - 1]} ${y}`
}

export default function Profile() {
  const { id } = useParams()
  const ctx = useApp()
  const { me, posts, following, toggleFollow, joinedCommunities, findOrCreateChat, saved, theme, setTheme, business, switchToBusiness, reposted, events, jobs, setMe, showToast, t } = ctx
  const nav = useNavigate()
  const isMe = !id || id === 'me'
  const u = isMe ? { id: 'me', followers: 48, following: following.size, ...me } : userById[id]
  const [tab, setTab] = useState('posts')
  const [edit, setEdit] = useState(false)
  if (!u) return <EmptyState emoji="🤷" title="User not found" />

  const userPosts = posts.filter((p) => p.authorId === u.id || (isMe && reposted.has(p.id)))
  const userCommunities = isMe ? communities.filter((c) => joinedCommunities.has(c.id)) : communities.filter((c) => c.memberSample.includes(u.id))
  const isFollowing = following.has(u.id)

  const savedItems = [...saved].map((k) => {
    const [type, sid] = k.split(':')
    return { type, id: sid, key: k }
  })

  return (
    <div className="mx-auto max-w-2xl pb-12 md:border-x divider min-h-full">
      {!isMe && <PageHeader title={u.name} subtitle={`${fmtNum(u.followers)} followers`} />}
      <div className="px-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">{u.name}</h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[15px]">
              <span>@{u.handle || u.name.toLowerCase().replace(/\s+/g, '.')}</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">{ROLES.find((r) => r.id === u.role)?.label}</span>
            </div>
          </div>
          <Avatar src={u.avatar} size={84} flag={u.country} />
        </div>
        {u.bio ? <p className="mt-3 text-[15px] leading-relaxed">{u.bio}</p> : isMe && <button onClick={() => setEdit(true)} className="muted mt-3 text-sm">+ Add a short bio</button>}
        <div className="muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          <span className="flex items-center gap-1.5"><Flag code={u.country} /> From {COUNTRIES[u.country]}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {u.neighborhood}</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> In Belgrade since {sinceLabel(u.since)}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-sm">{u.languages.map((l) => LANGUAGES[l]).join(' · ')}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {u.interests.map((i) => (
            <span key={i} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium dark:bg-neutral-800">{interestById[i]?.emoji} {interestById[i]?.label}</span>
          ))}
        </div>
        <div className="mt-4 flex gap-5 text-sm">
          <span><b>{fmtNum(u.followers + (!isMe && isFollowing ? 1 : 0))}</b> <span className="muted">followers</span></span>
          <span><b>{fmtNum(u.following)}</b> <span className="muted">following</span></span>
          <span><b>{userPosts.length}</b> <span className="muted">posts</span></span>
        </div>

        <div className="mt-5 flex gap-2">
          {isMe ? (
            <>
              <button onClick={() => setEdit(true)} className="btn-ghost flex-1 whitespace-nowrap !px-3"><Pencil className="h-4 w-4" /> Edit profile</button>
              <button onClick={() => (switchToBusiness(), nav('/business'))} className="btn-ghost flex-1 whitespace-nowrap !px-3">
                <Store className="h-4 w-4" /> {business ? 'Dashboard' : 'Switch to business'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => toggleFollow(u.id)} className={cx('flex-1', isFollowing ? 'btn-ghost' : 'btn-dark')}>{isFollowing ? 'Following' : t('Follow')}</button>
              <button onClick={() => nav(`/chat/${findOrCreateChat({ kind: 'user', refId: u.id })}`)} className="btn-ghost flex-1"><MessageCircle className="h-4 w-4" /> {t('Message')}</button>
            </>
          )}
        </div>
      </div>

      <Tabs
        className="sticky top-0 z-20 mt-6 glass"
        value={tab}
        onChange={setTab}
        tabs={[{ id: 'posts', label: 'Posts' }, { id: 'communities', label: 'Communities' }, ...(isMe ? [{ id: 'saved', label: 'Saved' }, { id: 'settings', label: 'Settings' }] : [])]}
      />

      {tab === 'posts' && (userPosts.length ? userPosts.map((p) => <PostCard key={p.id} post={p} />) : (
        <EmptyState emoji="✍️" title={isMe ? 'Share your first post' : 'No posts yet'} text={isMe ? 'Introduce yourself to the community — people love saying hi to newcomers.' : undefined} action={isMe && <button onClick={() => ctx.setComposer({ type: 'post', text: `Hi everyone! I’m ${u.name.split(' ')[0]} from ${COUNTRIES[u.country]} 👋 ` })} className="btn-accent">Introduce yourself</button>} />
      ))}
      {tab === 'communities' && (userCommunities.length ? <div className="py-2">{userCommunities.map((c) => <CommunityRow key={c.id} c={c} />)}</div> : <EmptyState emoji="👥" title="No communities yet" action={<Link to="/community" className="btn-ghost">Discover communities</Link>} />)}
      {tab === 'saved' && (
        savedItems.length === 0 ? <EmptyState emoji="🔖" title="Nothing saved yet" text="Tap the bookmark on places, events, posts and jobs to keep them here." /> : (
          <div className="space-y-6 p-4">
            {['place', 'event', 'specialist', 'job', 'housing', 'guide', 'post', 'community'].map((type) => {
              const items = savedItems.filter((s) => s.type === type)
              if (!items.length) return null
              return (
                <section key={type}>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-400">{type === 'housing' ? 'Housing' : `${type}s`}</h3>
                  <div className={cx(type === 'post' ? '-mx-4' : 'grid gap-4 sm:grid-cols-2')}>
                    {items.map(({ id: sid, key }) => {
                      if (type === 'place') return placeById[sid] && <PlaceCard key={key} p={placeById[sid]} />
                      if (type === 'event') { const e = events.find((x) => x.id === sid); return e && <EventCard key={key} ev={e} /> }
                      if (type === 'specialist') return <SpecialistCard key={key} s={specialistById[sid]} />
                      if (type === 'job') { const j = jobs.find((x) => x.id === sid); return j && <JobCard key={key} j={j} /> }
                      if (type === 'housing') return <HousingCard key={key} h={housingById[sid]} />
                      if (type === 'post') { const p = posts.find((x) => x.id === sid); return p && <PostCard key={key} post={p} /> }
                      if (type === 'community') return <CommunityRow key={key} c={communityById[sid]} />
                      if (type === 'guide') { const g = guideById[sid]; return g && (
                        <Link key={key} to={`/guide/${sid}`} className="card flex items-center gap-3 p-3">
                          <Img src={g.cover} w={150} className="h-14 w-14 rounded-2xl" />
                          <div className="min-w-0"><div className="text-xs font-bold text-accent">{g.topic}</div><div className="line-clamp-2 text-sm font-semibold">{g.title}</div></div>
                        </Link>
                      ) }
                      return null
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )
      )}
      {tab === 'settings' && (
        <div className="divide-y divide-neutral-100 px-4 dark:divide-neutral-900">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex w-full items-center gap-3 py-4 text-left">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="flex-1 font-medium">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <Link to="/notifications" className="flex items-center gap-3 py-4"><Heart className="h-5 w-5" /><span className="flex-1 font-medium">Notifications</span><ChevronRight className="h-4 w-4 text-neutral-400" /></Link>
          <Link to="/guides" className="flex items-center gap-3 py-4"><TrendingUp className="h-5 w-5" /><span className="flex-1 font-medium">Settling-in progress</span><ChevronRight className="h-4 w-4 text-neutral-400" /></Link>
          <button onClick={() => { setMe(null); showToast('Signed out (demo)', '👋') }} className="flex w-full items-center gap-3 py-4 text-left text-rose-500">
            <LogOut className="h-5 w-5" /><span className="flex-1 font-medium">Sign out & restart onboarding</span>
          </button>
        </div>
      )}

      {isMe && <EditProfile open={edit} onClose={() => setEdit(false)} />}
    </div>
  )
}

function EditProfile({ open, onClose }) {
  const { me, setMe, showToast } = useApp()
  const [f, setF] = useState(me)
  if (!open) return null
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const tog = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v])
  return (
    <Sheet open onClose={onClose} title="Edit profile">
      <div className="space-y-5 px-5 pb-6">
        <div><label className="label">Name</label><input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></div>
        <div><label className="label">Bio</label><textarea rows={3} className="input resize-none" value={f.bio} onChange={(e) => set('bio', e.target.value)} placeholder="A few words about you" /></div>
        <div>
          <label className="label">Neighborhood</label>
          <div className="flex flex-wrap gap-2">{NEIGHBORHOODS.map((n) => <Chip key={n} active={f.neighborhood === n} onClick={() => set('neighborhood', n)}>{n}</Chip>)}</div>
        </div>
        <div>
          <label className="label">Languages</label>
          <div className="flex flex-wrap gap-2">{Object.entries(LANGUAGES).map(([c, n]) => <Chip key={c} accent active={f.languages.includes(c)} onClick={() => tog('languages', c)}>{n}</Chip>)}</div>
        </div>
        <div>
          <label className="label">Interests</label>
          <div className="flex flex-wrap gap-2">{INTERESTS.map((i) => <Chip key={i.id} accent active={f.interests.includes(i.id)} onClick={() => tog('interests', i.id)}>{i.emoji} {i.label}</Chip>)}</div>
        </div>
        <button className="btn-dark w-full py-3" onClick={() => { setMe(f); onClose(); showToast('Profile updated', '✨') }}>Save</button>
      </div>
    </Sheet>
  )
}

export function BusinessDashboard() {
  const { business, setBusiness, me, chats, showToast, addJob, switchToBusiness } = useApp()
  const nav = useNavigate()
  const [edit, setEdit] = useState(false)
  const [jobOpen, setJobOpen] = useState(false)
  const [f, setF] = useState(null)
  const [job, setJob] = useState({ title: '', type: 'Full-time', remote: 'On-site', salaryMin: 800, salaryMax: 1200, languages: ['en'], description: '' })
  if (!business) {
    return (
      <EmptyState emoji="🏪" title="Grow with newcomers" text="Create a free business listing to reach people who speak your language." action={<button className="btn-accent" onClick={switchToBusiness}>Create business account</button>} />
    )
  }
  const views = [42, 58, 51, 77, 69, 94, 120]
  const max = Math.max(...views)
  const stats = [
    { icon: <Eye className="h-5 w-5" />, label: 'Profile views', v: '1,284', d: '+18%' },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'Messages', v: '37', d: '+6' },
    { icon: <Users className="h-5 w-5" />, label: 'Followers', v: '412', d: '+24' },
  ]
  const inbox = chats.filter((c) => c.type === 'private').slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <PageHeader title="Business dashboard" subtitle={business.name} />
      <div className="px-4 pt-5">
        <div className="flex items-center gap-4 rounded-[28px] bg-ink-900 p-5 text-white dark:bg-ink-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">🏪</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-extrabold">{business.name}</div>
            <div className="text-sm text-white/70">{business.category} · {business.address}</div>
            <div className="mt-1.5 flex gap-1">{business.languages.map((l) => <span key={l} className="rounded-md bg-white/15 px-1.5 text-[10px] font-bold uppercase">{l}</span>)}</div>
          </div>
          <button onClick={() => (setF(business), setEdit(true))} className="btn bg-white !py-2 text-black"><Pencil className="h-4 w-4" /> Edit</button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <div className="muted flex items-center gap-1.5 text-xs">{s.icon}<span className="hidden sm:inline">{s.label}</span></div>
              <div className="mt-2 text-2xl font-extrabold">{s.v}</div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{s.d} this week</div>
              <div className="muted text-[11px] sm:hidden">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Profile views · last 7 days</div>
            <span className="text-xs font-semibold text-emerald-600">▲ 18%</span>
          </div>
          <div className="mt-4 flex h-36 gap-2">
            {views.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div className={cx('w-full rounded-t-lg transition-all', i === views.length - 1 ? 'bg-accent' : 'bg-accent-200 dark:bg-accent/40')} style={{ height: `${(v / max) * 100}%` }} title={`${v} views`} />
                </div>
                <span className="muted text-[10px]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <div className="muted mt-3 text-xs">Top audiences: 🇷🇺 Russian speakers 41% · 🇺🇸 English 27% · 🇹🇷 Turkish 12%</div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button onClick={() => (setF(business), setEdit(true))} className="card flex items-center gap-3 p-4 text-left transition active:scale-[.98]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 text-accent dark:bg-accent/20"><Store className="h-5 w-5" /></span>
            <div><div className="font-semibold">Edit listing</div><div className="muted text-xs">Photos, hours, languages</div></div>
          </button>
          <button onClick={() => nav('/events/new')} className="card flex items-center gap-3 p-4 text-left transition active:scale-[.98]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-pink-500/20"><CalendarDays className="h-5 w-5" /></span>
            <div><div className="font-semibold">Post an event</div><div className="muted text-xs">Bring people in</div></div>
          </button>
          <button onClick={() => setJobOpen(true)} className="card flex items-center gap-3 p-4 text-left transition active:scale-[.98]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20"><Briefcase className="h-5 w-5" /></span>
            <div><div className="font-semibold">Post a job</div><div className="muted text-xs">Hire multilingual staff</div></div>
          </button>
        </div>

        <h2 className="section-title mb-2 mt-8">Recent messages</h2>
        <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
          {[
            { name: 'Emily Carter', av: 'p5', text: 'Hi! Do you have vegan options?', time: '10:24' },
            { name: 'Dmitry Volkov', av: 'p17', text: 'Здравствуйте, можно забронировать стол на 6?', time: '09:02' },
            { name: 'Elif Demir', av: 'p12', text: 'Are dogs allowed on the terrace? 🐶', time: 'Yesterday' },
          ].map((m) => (
            <button key={m.name} onClick={() => showToast('Inbox opens in the full version', '📬')} className="flex w-full items-center gap-3 p-3 text-left">
              <Avatar src={m.av} size={40} />
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{m.name}</div><div className="muted truncate text-sm">{m.text}</div></div>
              <span className="muted text-xs">{m.time}</span>
            </button>
          ))}
        </div>
        {inbox.length === 0 && null}
      </div>

      <Sheet open={edit} onClose={() => setEdit(false)} title="Edit listing">
        {f && (
          <div className="space-y-4 px-5 pb-6">
            <div><label className="label">Business name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div><label className="label">Category</label><input className="input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
            <div><label className="label">Description</label><textarea rows={3} className="input resize-none" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
            <div><label className="label">Address</label><input className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
            <div><label className="label">Opening hours</label><input className="input" value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} /></div>
            <div>
              <label className="label">Languages spoken by staff</label>
              <div className="flex flex-wrap gap-2">{Object.entries(LANGUAGES).map(([c, n]) => <Chip key={c} accent active={f.languages.includes(c)} onClick={() => setF({ ...f, languages: f.languages.includes(c) ? f.languages.filter((x) => x !== c) : [...f.languages, c] })}>{n}</Chip>)}</div>
            </div>
            <button className="btn-dark w-full py-3" onClick={() => { setBusiness(f); setEdit(false); showToast('Listing updated', '✅') }}>Save changes</button>
          </div>
        )}
      </Sheet>

      <Sheet open={jobOpen} onClose={() => setJobOpen(false)} title="Post a job">
        <div className="space-y-4 px-5 pb-6">
          <div><label className="label">Job title</label><input className="input" placeholder="e.g. Waiter (English + Serbian)" value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} /></div>
          <div className="flex flex-wrap gap-2">
            {['Full-time', 'Part-time'].map((x) => <Chip key={x} active={job.type === x} onClick={() => setJob({ ...job, type: x })}>{x}</Chip>)}
            {['On-site', 'Hybrid', 'Remote'].map((x) => <Chip key={x} active={job.remote === x} onClick={() => setJob({ ...job, remote: x })}>{x}</Chip>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Salary from (€)</label><input type="number" className="input" value={job.salaryMin} onChange={(e) => setJob({ ...job, salaryMin: Number(e.target.value) })} /></div>
            <div><label className="label">to (€)</label><input type="number" className="input" value={job.salaryMax} onChange={(e) => setJob({ ...job, salaryMax: Number(e.target.value) })} /></div>
          </div>
          <div>
            <label className="label">Required languages</label>
            <div className="flex flex-wrap gap-2">{Object.entries(LANGUAGES).map(([c, n]) => <Chip key={c} accent active={job.languages.includes(c)} onClick={() => setJob({ ...job, languages: job.languages.includes(c) ? job.languages.filter((x) => x !== c) : [...job.languages, c] })}>{n}</Chip>)}</div>
          </div>
          <div><label className="label">Description</label><textarea rows={3} className="input resize-none" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} /></div>
          <button
            disabled={!job.title.trim()}
            className="btn-accent w-full py-3"
            onClick={() => {
              addJob({ ...job, company: business.name, neighborhood: business.address.split(',')[0], description: job.description || 'Join our friendly team!' })
              setJobOpen(false)
              setJob({ ...job, title: '', description: '' })
              nav('/services?tab=jobs')
            }}
          >
            Publish job
          </button>
        </div>
      </Sheet>
    </div>
  )
}
