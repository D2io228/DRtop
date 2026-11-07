import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, X, Rocket } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Chip, ChipRow, EmptyState, Sheet, Tabs } from '../components/ui'
import { HousingCard, JobCard, PlaceCard, SpecialistCard } from '../components/cards'
import { Toggle } from './Explore'
import { places } from '../data/places'
import { specialists, SPECIALIST_CATEGORIES } from '../data/specialists'
import { housing } from '../data/market'
import { LANGUAGES, NEIGHBORHOODS } from '../data/meta'
import { APP_NAME } from '../config'
import { isOpenNow, overlap, sortByMatch } from '../lib/utils'

const BIZ_CATS = [
  { id: 'cafe', label: '☕ Cafés' },
  { id: 'restaurant', label: '🍽️ Restaurants' },
  { id: 'shop', label: '🛍️ Shops' },
  { id: 'service', label: '🛠️ Services' },
]

export default function Services() {
  const { me, t, jobs, switchToBusiness, business } = useApp()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'places'
  const setTab = (x) => {
    setParams({ tab: x }, { replace: true })
    resetFilters()
  }
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [langs, setLangs] = useState([])
  const [maxPrice, setMaxPrice] = useState(0)
  const [minRating, setMinRating] = useState(0)
  const [avail, setAvail] = useState(false)
  const [jobType, setJobType] = useState('all')
  const [remote, setRemote] = useState(false)
  const [minSalary, setMinSalary] = useState(0)
  const [district, setDistrict] = useState('all')
  const [open, setOpen] = useState(false)

  const resetFilters = () => {
    setQ(''); setCat('all'); setLangs([]); setMaxPrice(0); setMinRating(0); setAvail(false); setJobType('all'); setRemote(false); setMinSalary(0); setDistrict('all')
  }
  const text = (s) => s.toLowerCase().includes(q.toLowerCase())
  const langOk = (l) => !langs.length || overlap(langs, l).length

  const biz = sortByMatch(places.filter((p) => p.kind !== 'org'), me).filter(
    (p) => (cat === 'all' || p.kind === cat) && text(`${p.name} ${p.category} ${p.neighborhood}`) && langOk(p.languages) && (!maxPrice || p.priceFrom <= maxPrice) && p.rating >= minRating && (!avail || isOpenNow(p.hours)),
  )
  const specs = sortByMatch(specialists, me).filter(
    (s) => (cat === 'all' || s.category === cat) && text(`${s.name} ${s.profession}`) && langOk(s.languages) && (!maxPrice || s.priceFrom <= maxPrice) && s.rating >= minRating && (!avail || s.availability === 'today'),
  )
  const jobList = sortByMatch(jobs, me).filter(
    (j) => text(`${j.title} ${j.company}`) && langOk(j.languages) && (jobType === 'all' || j.type === jobType) && (!remote || j.remote === 'Remote') && j.salaryMax >= minSalary,
  )
  const homes = housing.filter((h) => text(`${h.title} ${h.neighborhood}`) && (district === 'all' || h.neighborhood === district) && (!maxPrice || h.price <= maxPrice) && langOk(h.ownerLanguages))

  const filterCount = langs.length + (maxPrice ? 1 : 0) + (minRating ? 1 : 0) + (avail ? 1 : 0) + (remote ? 1 : 0) + (minSalary ? 1 : 0)
  const priceSteps = tab === 'housing' ? [0, 400, 700, 1000] : [0, 10, 30, 60]

  const Banner = () => (
    <div className="mx-4 mb-6 flex items-center gap-4 overflow-hidden rounded-3xl bg-ink-900 p-5 text-white dark:bg-ink-800">
      <div className="flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-accent-200">For businesses & specialists</div>
        <div className="mt-1 text-lg font-extrabold leading-tight">List your business on {APP_NAME}</div>
        <p className="mt-1 text-sm text-white/70">Get discovered by 40,000+ newcomers who speak your language.</p>
        <button
          onClick={() => {
            switchToBusiness()
            nav('/business')
          }}
          className="btn mt-3 bg-white !py-2 text-black hover:bg-neutral-200"
        >
          {business ? 'Open dashboard' : 'Get started — free'}
        </button>
      </div>
      <Rocket className="hidden h-20 w-20 shrink-0 text-accent-400 sm:block" strokeWidth={1.2} />
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl pb-10">
      <div className="px-4 pb-2 pt-5">
        <h1 className="h-title">{t('Services')}</h1>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        className="sticky top-0 z-20 glass"
        tabs={[
          { id: 'places', label: t('Places & Businesses') },
          { id: 'specialists', label: t('Specialists') },
          { id: 'jobs', label: t('Jobs') },
          { id: 'housing', label: t('Housing') },
        ]}
      />
      <div className="flex gap-2 px-4 pt-4">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 dark:bg-neutral-900">
          <Search className="h-4 w-4 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={{ places: 'Cafés, shops, dentists…', specialists: 'Doctor, lawyer, tutor…', jobs: 'Job title or company', housing: 'District or keyword' }[tab]} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
          {q && <X className="h-4 w-4 cursor-pointer text-neutral-400" onClick={() => setQ('')} />}
        </div>
        <button onClick={() => setOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900" aria-label="Filters">
          <SlidersHorizontal className="h-[18px] w-[18px]" />
          {filterCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">{filterCount}</span>}
        </button>
      </div>

      <ChipRow className="py-4">
        {tab === 'places' && (
          <>
            <Chip active={cat === 'all'} onClick={() => setCat('all')}>All</Chip>
            {BIZ_CATS.map((c) => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Chip>)}
          </>
        )}
        {tab === 'specialists' && (
          <>
            <Chip active={cat === 'all'} onClick={() => setCat('all')}>All</Chip>
            {SPECIALIST_CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
          </>
        )}
        {tab === 'jobs' && (
          <>
            {['all', 'Full-time', 'Part-time'].map((x) => <Chip key={x} active={jobType === x} onClick={() => setJobType(x)}>{x === 'all' ? 'All jobs' : x}</Chip>)}
            <Chip active={remote} onClick={() => setRemote(!remote)}>🌍 Remote</Chip>
            {[1000, 2000].map((s) => <Chip key={s} active={minSalary === s} onClick={() => setMinSalary(minSalary === s ? 0 : s)}>€{s / 1000}k+</Chip>)}
          </>
        )}
        {tab === 'housing' && (
          <>
            <Chip active={district === 'all'} onClick={() => setDistrict('all')}>All districts</Chip>
            {['Dorćol', 'Vračar', 'Novi Beograd', 'Savamala', 'Zemun'].map((d) => <Chip key={d} active={district === d} onClick={() => setDistrict(d)}>{d}</Chip>)}
          </>
        )}
        {me && me.languages.filter((l) => l !== 'en').slice(0, 2).map((l) => (
          <Chip key={l} accent active={langs.includes(l)} onClick={() => setLangs(langs.includes(l) ? langs.filter((x) => x !== l) : [...langs, l])}>
            🗣️ {LANGUAGES[l]}
          </Chip>
        ))}
      </ChipRow>

      {tab === 'places' && (
        <>
          {biz.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3 lg:grid-cols-4">
              {biz.map((p) => <PlaceCard key={p.id} p={p} />)}
            </div>
          ) : <EmptyState emoji="🔍" title="Nothing matches" text="Try removing a filter." action={<button className="btn-ghost" onClick={resetFilters}>Reset filters</button>} />}
          <div className="mt-8"><Banner /></div>
        </>
      )}
      {tab === 'specialists' && (
        <>
          {specs.length ? (
            <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((s) => <SpecialistCard key={s.id} s={s} />)}
            </div>
          ) : <EmptyState emoji="🩺" title="No specialists found" text="Try another category or language." action={<button className="btn-ghost" onClick={resetFilters}>Reset filters</button>} />}
          <div className="mt-8"><Banner /></div>
        </>
      )}
      {tab === 'jobs' && (
        <>
          {jobList.length ? (
            <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobList.map((j) => <JobCard key={j.id} j={j} />)}
            </div>
          ) : <EmptyState emoji="💼" title="No jobs match" text="Try a different language or remove the salary filter." action={<button className="btn-ghost" onClick={resetFilters}>Reset filters</button>} />}
          <div className="mt-8"><Banner /></div>
        </>
      )}
      {tab === 'housing' && (
        homes.length ? (
          <div className="grid gap-x-4 gap-y-7 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {homes.map((h) => <HousingCard key={h.id} h={h} />)}
          </div>
        ) : <EmptyState emoji="🏠" title="No listings here (yet)" text="New apartments are added every day." action={<button className="btn-ghost" onClick={resetFilters}>Reset filters</button>} />
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title={t('Filters')}>
        <div className="space-y-6 px-5 pb-6">
          <div>
            <div className="label">Language spoken</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LANGUAGES).map(([c, n]) => (
                <Chip key={c} accent active={langs.includes(c)} onClick={() => setLangs(langs.includes(c) ? langs.filter((x) => x !== c) : [...langs, c])}>{n}</Chip>
              ))}
            </div>
          </div>
          {tab !== 'jobs' && (
            <div>
              <div className="label">{tab === 'housing' ? 'Max rent / month' : 'Max starting price'}</div>
              <div className="flex gap-2">
                {priceSteps.map((p) => <Chip key={p} active={maxPrice === p} onClick={() => setMaxPrice(p)}>{p === 0 ? 'Any' : `≤ €${p}`}</Chip>)}
              </div>
            </div>
          )}
          {(tab === 'places' || tab === 'specialists') && (
            <>
              <div>
                <div className="label">Rating</div>
                <div className="flex gap-2">
                  {[0, 4.5, 4.8].map((r) => <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r ? <><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r}+</> : 'Any'}</Chip>)}
                </div>
              </div>
              <label className="flex items-center justify-between">
                <span className="font-semibold">{tab === 'places' ? 'Open now' : 'Available today'}</span>
                <Toggle on={avail} onChange={setAvail} />
              </label>
            </>
          )}
          {tab === 'jobs' && (
            <>
              <label className="flex items-center justify-between"><span className="font-semibold">Remote only</span><Toggle on={remote} onChange={setRemote} /></label>
              <div>
                <div className="label">Minimum salary</div>
                <div className="flex gap-2">{[0, 500, 1000, 2000].map((s) => <Chip key={s} active={minSalary === s} onClick={() => setMinSalary(s)}>{s ? `€${s}+` : 'Any'}</Chip>)}</div>
              </div>
            </>
          )}
          {tab === 'housing' && (
            <div>
              <div className="label">District</div>
              <div className="flex flex-wrap gap-2">
                <Chip active={district === 'all'} onClick={() => setDistrict('all')}>All</Chip>
                {NEIGHBORHOODS.map((d) => <Chip key={d} active={district === d} onClick={() => setDistrict(d)}>{d}</Chip>)}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button className="btn-ghost flex-1" onClick={resetFilters}>Reset</button>
            <button className="btn-dark flex-1" onClick={() => setOpen(false)}>{t('Show results')}</button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
