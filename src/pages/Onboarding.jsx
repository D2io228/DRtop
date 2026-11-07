import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Search } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { COUNTRIES, LANGUAGES, INTERESTS, ROLES } from '../data/meta'
import { Avatar, Img } from '../components/ui'
import { Logo } from '../components/Layout'
import { APP_NAME, APP_TAGLINE } from '../config'
import { cx, flagUrl } from '../lib/utils'

const AVATARS = ['pv33', 'pv5', 'pv12', 'pv25', 'pv57', 'pv41']

export default function Onboarding() {
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [country, setCountry] = useState(null)
  const [languages, setLanguages] = useState(['en'])
  const [role, setRole] = useState(null)
  const [interests, setInterests] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const countries = useMemo(
    () => Object.entries(COUNTRIES).filter(([c, n]) => c !== 'rs' && n.toLowerCase().includes(q.toLowerCase())),
    [q],
  )
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const finish = (profile) => {
    setLoading(true)
    setTimeout(() => completeOnboarding(profile), 1300)
  }

  const demo = () =>
    finish({ name: 'Alex Morozov', avatar: 'pv33', country: 'ru', languages: ['ru', 'en'], role: 'newcomer', interests: ['coffee', 'it', 'language', 'outdoors', 'food'], neighborhood: 'Vračar', since: '2026-09', bio: 'Product designer. Just moved from Moscow with my partner 🧳' })

  const canNext = [true, name.trim() && country && languages.length > 0, !!role, interests.length >= 2][step]

  if (loading)
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-white px-8 text-center dark:bg-black">
        <div className="relative">
          <div className="h-24 w-24 animate-ping rounded-full bg-accent/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold">Personalizing Belgrade for you…</div>
          <p className="muted mt-1 text-sm">Finding people who speak your language, places you’ll love and your next steps.</p>
        </div>
      </div>
    )

  if (step === 0)
    return (
      <div className="relative flex h-dvh flex-col overflow-hidden bg-black text-white">
        <div className="absolute inset-0 grid grid-cols-3 gap-1.5 p-1.5 opacity-70">
          {['friendsGroup', 'coffee', 'city', 'foodSpread', 'p1', 'concert', 'p16', 'streetCafe', 'p7', 'bread', 'friendsSunset', 'p2'].map((p, i) => (
            <Img key={p} src={p} w={400} className="h-full w-full rounded-2xl animate-fade-in" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        <div className="relative mt-auto px-6 pb-10 md:mx-auto md:max-w-md md:pb-16">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M15.5 8.5l-2 5-5 2 2-5z" fill="white" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight">
            Welcome to {APP_NAME}.
            <br />
            <span className="text-accent-200">Belgrade</span> feels like home faster here.
          </h1>
          <p className="mt-3 text-[15px] text-white/70">{APP_TAGLINE} Friends, places, events, specialists, jobs and housing — for every nationality, in one app.</p>
          <div className="mt-5 flex items-center gap-1.5">
            {['ru', 'ua', 'tr', 'cn', 'in', 'de', 'us', 'ir', 'br'].map((c) => (
              <img key={c} src={flagUrl(c)} alt="" className="h-4 w-6 rounded-[3px] object-cover" />
            ))}
            <span className="ml-1 text-xs text-white/60">+40 nationalities</span>
          </div>
          <button onClick={() => setStep(1)} className="btn mt-7 w-full bg-white py-3.5 text-base text-black hover:bg-neutral-200">
            Get started
          </button>
          <button onClick={demo} className="mt-3 w-full py-2 text-sm font-semibold text-white/70 hover:text-white">
            Skip — explore with a demo profile
          </button>
        </div>
      </div>
    )

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-black">
      <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 pt-4">
        <button className="icon-btn -ml-2" onClick={() => setStep(step - 1)} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: step >= i ? '100%' : '0%' }} />
            </div>
          ))}
        </div>
        <span className="muted w-10 text-right text-sm font-semibold">{step}/3</span>
      </div>

      <div key={step} className="mx-auto w-full max-w-xl flex-1 overflow-y-auto px-5 pb-6 pt-6 animate-fade-up">
        {step === 1 && (
          <>
            <h1 className="h-title">Where are you from?</h1>
            <p className="muted mt-1">We’ll connect you with people who share your language and background.</p>

            <label className="label mt-6">Your name</label>
            <input className="input" placeholder="e.g. Alex" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="mt-3 flex gap-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setAvatar(a)} className={cx('rounded-full p-0.5 transition active:scale-90', avatar === a ? 'ring-2 ring-accent' : 'opacity-60')}>
                  <Avatar src={a} size={40} />
                </button>
              ))}
            </div>

            <label className="label mt-6">Country of origin</label>
            <div className="mb-2 flex items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5 dark:bg-neutral-900">
              <Search className="h-4 w-4 text-neutral-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {countries.map(([code, n]) => (
                <button
                  key={code}
                  onClick={() => setCountry(code)}
                  className={cx('flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition active:scale-95', country === code ? 'border-accent bg-accent-50 dark:bg-accent/15' : 'divider')}
                >
                  <img src={flagUrl(code)} alt="" className="h-4 w-6 rounded-[3px] object-cover" />
                  <span className="truncate">{n}</span>
                  {country === code && <Check className="ml-auto h-4 w-4 text-accent" />}
                </button>
              ))}
            </div>

            <label className="label mt-6">Languages you speak</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LANGUAGES).map(([code, n]) => (
                <button key={code} onClick={() => toggle(languages, setLanguages, code)} className={cx('chip', languages.includes(code) && 'chip-accent')}>
                  {languages.includes(code) && <Check className="h-3.5 w-3.5" />}
                  {n}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="h-title">Who are you?</h1>
            <p className="muted mt-1">This helps us show the right things first.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cx('flex items-center gap-4 rounded-3xl border-2 p-4 text-left transition active:scale-[.98] sm:flex-col sm:items-start', role === r.id ? 'border-accent bg-accent-50 dark:bg-accent/15' : 'divider')}
                >
                  <span className="text-4xl">{r.emoji}</span>
                  <div>
                    <div className="font-bold">{r.label}</div>
                    <div className="muted text-sm">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="h-title">What are you into?</h1>
            <p className="muted mt-1">Pick at least 2 — we’ll tailor your feed, events and people.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {INTERESTS.map((i) => (
                <button key={i.id} onClick={() => toggle(interests, setInterests, i.id)} className={cx('chip !px-4 !py-2.5 !text-[15px]', interests.includes(i.id) && 'chip-accent')}>
                  <span>{i.emoji}</span> {i.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mx-auto w-full max-w-xl px-5 pb-6 pb-safe">
        <button
          disabled={!canNext}
          onClick={() =>
            step < 3
              ? setStep(step + 1)
              : finish({ name: name.trim(), avatar, country, languages, role, interests, neighborhood: 'Vračar', since: role === 'newcomer' ? '2026-10' : '2023-05', bio: '' })
          }
          className="btn-dark w-full py-3.5 text-base"
        >
          {step < 3 ? 'Continue' : 'Start exploring'}
        </button>
      </div>
    </div>
  )
}
