import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronDown, ChevronRight, HelpCircle, MapPin, MessageCircle, PenLine, Search, ThumbsUp, BookOpen } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Chip, ChipRow, EmptyState, Flag, FloatingBack, Img, PageHeader, ProgressRing, RoundBtn } from '../components/ui'
import { faq, goals, guideById, guides, GUIDE_TOPICS } from '../data/guides'
import { specialistById } from '../data/specialists'
import { placeById } from '../data/places'
import { userById } from '../data/users'
import { cx, fmtNum } from '../lib/utils'
import { getUser } from '../lib/entities'

const goalRelevant = (g, me) => g.id !== 'kids' || me?.interests.includes('family')

export default function Guides() {
  const { me, done, setComposer, t, helpful } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState('all')
  const [openFaq, setOpenFaq] = useState(0)

  const visibleGoals = [...goals].sort((a, b) => (goalRelevant(b, me) ? 1 : 0) - (goalRelevant(a, me) ? 1 : 0))
  const total = goals.reduce((a, g) => a + g.steps.length, 0)
  const doneCount = goals.reduce((a, g) => a + g.steps.filter((s) => done.has(s.id)).length, 0)
  const pct = doneCount / total
  const list = guides.filter((g) => (topic === 'all' || g.topic === topic) && `${g.title} ${g.body.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
  const faqs = faq.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <div className="px-4 pt-5">
        <h1 className="h-title">{t('Guides')}</h1>
        <p className="muted mt-1">Everything you need to settle into Belgrade — written by people who’ve done it.</p>
      </div>

      {/* Overall progress */}
      <div className="mx-4 mt-5 flex items-center gap-5 rounded-[28px] bg-ink-900 p-5 text-white dark:bg-ink-800">
        <ProgressRing value={pct} size={88} stroke={9} color="#8F72FF" track="rgba(255,255,255,.15)">
          <span className="text-xl font-extrabold">{Math.round(pct * 100)}%</span>
        </ProgressRing>
        <div className="flex-1">
          <div className="text-lg font-extrabold leading-tight">{pct < 0.5 ? 'Great start!' : pct < 1 ? 'You’re getting there 💪' : 'You’re a local now 🎉'}</div>
          <div className="mt-1 text-sm text-white/70">
            {doneCount} of {total} steps done. {pct < 1 && 'Tick steps off as you go — we’ll suggest what’s next.'}
          </div>
        </div>
      </div>

      <h2 className="section-title mb-3 mt-8 px-4">{t('Settling-in checklist')}</h2>
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleGoals.map((g) => {
          const d = g.steps.filter((s) => done.has(s.id)).length
          const v = d / g.steps.length
          return (
            <Link key={g.id} to={`/guides/goal/${g.id}`} className={cx('card flex flex-col items-start gap-3 p-4 transition hover:-translate-y-0.5 active:scale-[.98]', !goalRelevant(g, me) && 'opacity-60')}>
              <ProgressRing value={v} size={54} stroke={5} color={g.color}>
                <span className="text-xl">{g.emoji}</span>
              </ProgressRing>
              <div>
                <div className="text-[15px] font-bold leading-snug">{g.title}</div>
                <div className="muted mt-0.5 text-xs">{v === 1 ? '✓ Complete' : `${d}/${g.steps.length} steps`}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 flex items-center gap-2 px-4">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 dark:bg-neutral-900">
          <Search className="h-4 w-4 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides & FAQ…" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </div>
        <button onClick={() => setComposer({ type: 'guide' })} className="btn-ghost !py-2.5">
          <PenLine className="h-4 w-4" /> <span className="hidden sm:inline">Write a guide</span>
        </button>
      </div>
      <ChipRow className="py-4">
        <Chip active={topic === 'all'} onClick={() => setTopic('all')}>All topics</Chip>
        {GUIDE_TOPICS.map((tp) => <Chip key={tp} active={topic === tp} onClick={() => setTopic(tp)}>{tp}</Chip>)}
      </ChipRow>

      {list.length === 0 ? (
        <EmptyState emoji="📚" title="No guides yet" text="Nobody has written about this yet — be the first!" action={<button className="btn-accent" onClick={() => setComposer({ type: 'guide', text: q })}>Write a guide</button>} />
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
          {list.map((g) => {
            const a = userById[g.authorId]
            return (
              <Link key={g.id} to={`/guide/${g.id}`} className="flex gap-4 px-4 py-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-950">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wide text-accent">{g.topic}</div>
                  <div className="mt-1 text-[16px] font-bold leading-snug">{g.title}</div>
                  <div className="muted mt-2 flex items-center gap-2 text-xs">
                    <Avatar src={a.avatar} size={20} />
                    <span className="font-medium text-ink-900 dark:text-neutral-200">{a.name}</span>
                    <Flag code={a.country} />
                    <span>· {g.readMin} min</span>
                  </div>
                  <div className="muted mt-2 flex items-center gap-3 text-xs">
                    <span className={cx('flex items-center gap-1', helpful.has(g.id) && 'font-semibold text-accent')}><ThumbsUp className="h-3.5 w-3.5" /> {fmtNum(g.helpful + (helpful.has(g.id) ? 1 : 0))} helpful</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {g.comments.length}</span>
                  </div>
                </div>
                <Img src={g.cover} w={300} className="h-24 w-24 shrink-0 rounded-2xl sm:h-28 sm:w-36" />
              </Link>
            )
          })}
        </div>
      )}

      <h2 className="section-title mb-3 mt-10 px-4">FAQ</h2>
      <div className="mx-4 card divide-y divide-neutral-100 dark:divide-neutral-800">
        {faqs.map((f, i) => (
          <button key={f.q} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="block w-full px-4 py-4 text-left">
            <div className="flex items-center justify-between gap-3 font-semibold">
              {f.q}
              <ChevronDown className={cx('h-5 w-5 shrink-0 text-neutral-400 transition', openFaq === i && 'rotate-180')} />
            </div>
            {openFaq === i && <p className="muted mt-2 text-[15px] leading-relaxed animate-fade-in">{f.a}</p>}
          </button>
        ))}
        {faqs.length === 0 && <div className="muted p-4 text-sm">No FAQ matches “{q}”.</div>}
      </div>

      <div className="mx-4 mt-8 flex flex-col items-center rounded-[28px] bg-accent-50 p-6 text-center dark:bg-accent/10">
        <HelpCircle className="h-10 w-10 text-accent" />
        <div className="mt-2 text-lg font-extrabold">Didn’t find your answer?</div>
        <p className="muted mt-1 text-sm">Thousands of people in Belgrade have been through it. Ask in any language.</p>
        <button onClick={() => (setComposer({ type: 'question', text: q }), nav('/community'))} className="btn-accent mt-4">
          {t('Ask the community')}
        </button>
      </div>
    </div>
  )
}

export function GoalPage() {
  const { id } = useParams()
  const g = goals.find((x) => x.id === id)
  const { done, toggleStep, showToast, setComposer } = useApp()
  const nav = useNavigate()
  const [open, setOpen] = useState(null)
  if (!g) return <EmptyState emoji="🤷" title="Goal not found" />
  const d = g.steps.filter((s) => done.has(s.id)).length
  const toggle = (s) => {
    const was = done.has(s.id)
    toggleStep(s.id)
    if (!was) {
      showToast(d + 1 === g.steps.length ? `${g.title}: complete! 🎉` : 'Step done — nice!', '✅')
    }
  }
  return (
    <div className="mx-auto max-w-2xl pb-12">
      <PageHeader title={g.title} subtitle={`${d}/${g.steps.length} steps done`} />
      <div className="flex flex-col items-center px-4 pt-6 text-center">
        <ProgressRing value={d / g.steps.length} size={112} stroke={10} color={g.color}>
          <span className="text-4xl">{g.emoji}</span>
        </ProgressRing>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{g.title}</h1>
        <p className="muted text-sm">{d === g.steps.length ? 'All done. You’re a pro!' : 'Tap a step to see guides, specialists and places that help.'}</p>
      </div>
      <div className="mt-6 space-y-2.5 px-4">
        {g.steps.map((s, i) => {
          const isDone = done.has(s.id)
          const isOpen = open === s.id
          return (
            <div key={s.id} className={cx('card overflow-hidden transition', isOpen && 'ring-2 ring-accent/30')}>
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggle(s)}
                  className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-75', isDone ? 'border-transparent text-white' : 'border-neutral-300 dark:border-neutral-600')}
                  style={isDone ? { background: g.color } : {}}
                  aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
                >
                  {isDone ? <Check className="h-4 w-4 animate-like-bump" strokeWidth={3} /> : <span className="text-xs font-bold text-neutral-400">{i + 1}</span>}
                </button>
                <button onClick={() => setOpen(isOpen ? null : s.id)} className="min-w-0 flex-1 text-left">
                  <div className={cx('font-semibold', isDone && 'text-neutral-400 line-through')}>{s.title}</div>
                  {s.hint && <div className="muted text-xs">{s.hint}</div>}
                </button>
                <ChevronDown onClick={() => setOpen(isOpen ? null : s.id)} className={cx('h-5 w-5 shrink-0 cursor-pointer text-neutral-400 transition', isOpen && 'rotate-180')} />
              </div>
              {isOpen && (
                <div className="space-y-3 border-t divider bg-neutral-50/60 p-4 animate-fade-in dark:bg-neutral-950">
                  {s.guides.map((gid) => {
                    const gd = guideById[gid]
                    return (
                      <Link key={gid} to={`/guide/${gid}`} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent dark:bg-accent/20"><BookOpen className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{gd.title}</div><div className="muted text-xs">Guide · {gd.readMin} min</div></div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    )
                  })}
                  {s.specialists.map((sid) => {
                    const sp = specialistById[sid]
                    return (
                      <Link key={sid} to={`/specialist/${sid}`} className="flex items-center gap-3">
                        <Avatar src={sp.avatar} size={36} />
                        <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{sp.name}</div><div className="muted text-xs">{sp.profession} · from €{sp.priceFrom}</div></div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    )
                  })}
                  {s.places.map((pid) => {
                    const p = placeById[pid]
                    return (
                      <Link key={pid} to={`/?focus=${pid}`} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-lg dark:bg-neutral-800">{p.logo}</span>
                        <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{p.name}</div><div className="muted flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" /> Show on map</div></div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    )
                  })}
                  <button onClick={() => (setComposer({ type: 'question', text: `${s.title}: ` }), nav('/community'))} className="flex items-center gap-2 pt-1 text-sm font-semibold text-accent">
                    <HelpCircle className="h-4 w-4" /> Ask the community about this
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function GuideArticle() {
  const { id } = useParams()
  const g = guideById[id]
  const { me, helpful, toggleHelpful, saved, toggleSave, showToast } = useApp()
  const [comments, setComments] = useState(g?.comments || [])
  const [text, setText] = useState('')
  if (!g) return <EmptyState emoji="🤷" title="Guide not found" />
  const a = userById[g.authorId]
  const isHelpful = helpful.has(g.id)
  const renderPara = (p) =>
    p.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => (chunk.startsWith('**') ? <strong key={i}>{chunk.slice(2, -2)}</strong> : chunk))
  return (
    <div className="mx-auto max-w-2xl pb-12">
      <div className="relative">
        <Img src={g.cover} w={1200} className="aspect-[16/9] w-full md:rounded-b-[32px]" />
        <FloatingBack right={<RoundBtn label="Save" onClick={() => toggleSave(`guide:${g.id}`)}><BookOpen className={cx('h-4 w-4', saved.has(`guide:${g.id}`) && 'fill-current')} /></RoundBtn>} />
      </div>
      <div className="px-4 pt-5">
        <div className="text-xs font-bold uppercase tracking-wide text-accent">{g.topic}</div>
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">{g.title}</h1>
        <Link to={`/u/${a.id}`} className="mt-4 flex items-center gap-3">
          <Avatar src={a.avatar} size={40} flag={a.country} />
          <div>
            <div className="text-sm font-semibold">{a.name}</div>
            <div className="muted text-xs">{g.time} ago · {g.readMin} min read · in Belgrade since {a.since.slice(0, 4)}</div>
          </div>
        </Link>
        <div className="mt-6 space-y-4 text-[16px] leading-[1.7]">
          {g.body.map((p, i) => <p key={i}>{renderPara(p)}</p>)}
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-3xl bg-neutral-100 p-4 dark:bg-neutral-900">
          <div className="flex-1 text-sm font-semibold">Was this guide helpful?</div>
          <button
            onClick={() => {
              toggleHelpful(g.id)
              if (!isHelpful) showToast('Thanks! Marked as helpful', '👍')
            }}
            className={cx(isHelpful ? 'btn-accent' : 'btn-ghost', '!py-2')}
          >
            <ThumbsUp className={cx('h-4 w-4', isHelpful && 'animate-like-bump')} /> {fmtNum(g.helpful + (isHelpful ? 1 : 0))}
          </button>
        </div>

        <h2 className="section-title mb-3 mt-8">Comments ({comments.length})</h2>
        <div className="space-y-4">
          {comments.map((c, i) => {
            const u = getUser(c.userId, me)
            return (
              <div key={i} className="flex gap-3 animate-fade-up">
                <Avatar src={u.avatar} size={34} />
                <div>
                  <div className="text-sm"><span className="font-semibold">{u.name}</span> <span className="muted">· {c.time}</span></div>
                  <p className="text-[15px]">{c.text}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Avatar src={me?.avatar} size={32} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && text.trim()) {
                setComments([...comments, { userId: 'me', text: text.trim(), time: 'now' }])
                setText('')
              }
            }}
            placeholder="Add a comment or tip…"
            className="h-10 flex-1 rounded-full bg-neutral-100 px-4 text-[15px] outline-none dark:bg-neutral-900"
          />
        </div>
      </div>
    </div>
  )
}
