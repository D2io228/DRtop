import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, BookOpen, Briefcase, CalendarDays, ChevronDown, Compass, Globe, MapPin, MessageCircle, Moon, Plus, Search, Store, Sun, User, Users, Check,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { APP_NAME } from '../config'
import { Avatar, Flag, Sheet, Toast } from './ui'
import { cx } from '../lib/utils'
import Composer from './Composer'
import { HavenMark, HavenWordmark } from './HavenLogo'

export const NAV = [
  { to: '/', label: 'Explore', icon: Compass, end: true },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/services', label: 'Services', icon: Store },
  { to: '/connect', label: 'Connect', icon: MessageCircle },
]

export function Logo({ small }) {
  return <HavenWordmark size={small ? 28 : 36} />
}

const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
  { id: 'sr', label: 'Srpski' },
]

function LangSwitcher() {
  const { lang, setLang, showToast } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Language" className="flex h-9 items-center gap-1 rounded-full px-2 text-[11px] font-bold uppercase tracking-wide hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <Globe className="h-[18px] w-[18px]" strokeWidth={1.9} />
        {lang}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-2xl border divider bg-white p-1 shadow-xl animate-fade-in dark:bg-ink-800">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setLang(l.id)
                setOpen(false)
                showToast(`Interface: ${l.label}`, '🌐')
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {l.label}
              {lang === l.id && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CitySelector() {
  const [open, setOpen] = useState(false)
  const { showToast } = useApp()
  const cities = [
    { name: 'Belgrade', country: 'Serbia', live: true, code: 'rs' },
    { name: 'Novi Sad', country: 'Serbia', live: false, code: 'rs' },
    { name: 'Budva', country: 'Montenegro', live: false, code: 'me' },
    { name: 'Tbilisi', country: 'Georgia', live: false, code: 'ge' },
    { name: 'Istanbul', country: 'Turkey', live: false, code: 'tr' },
  ]
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-10 items-center gap-1.5 rounded-full pl-1.5 pr-2 text-[15px] font-bold tracking-tight transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"><MapPin className="h-3.5 w-3.5" strokeWidth={2.6} /></span>
        Belgrade
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Choose your city">
        <div className="space-y-1 px-3 pb-6">
          {cities.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                if (!c.live) return showToast(`${c.name} is coming soon — we’ll let you know!`, '🔔')
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Flag code={c.code} className="!h-5 !w-7 !rounded-md" />
              <div className="flex-1">
                <div className="font-semibold">{c.name}</div>
                <div className="muted text-xs">{c.country}</div>
              </div>
              {c.live ? <Check className="h-5 w-5 text-accent" /> : <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500 dark:bg-neutral-800">Soon</span>}
            </button>
          ))}
        </div>
      </Sheet>
    </>
  )
}

function TopBar({ floating }) {
  const { me, notifications } = useApp()
  const nav = useNavigate()
  const unread = notifications.filter((n) => !n.read).length
  const icons = (
    <>
      <LangSwitcher />
      <button className={cx('icon-btn md:hidden', floating && 'hidden')} onClick={() => nav('/search')} aria-label="Search">
        <Search className="h-[21px] w-[21px]" strokeWidth={1.9} />
      </button>
      <button className="icon-btn relative" onClick={() => nav('/notifications')} aria-label="Notifications">
        <Bell className="h-[21px] w-[21px]" strokeWidth={1.9} />
        {unread > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white dark:ring-ink-800" />}
      </button>
      <button className="icon-btn max-[359px]:hidden md:hidden" onClick={() => nav('/guides')} aria-label="Guides">
        <BookOpen className="h-[21px] w-[21px]" strokeWidth={1.9} />
      </button>
      <button className="ml-0.5 rounded-full transition active:scale-90 md:hidden" onClick={() => nav('/profile')} aria-label="Profile">
        <Avatar src={me?.avatar} size={30} className="rounded-full ring-2 ring-white dark:ring-ink-800" />
      </button>
    </>
  )
  if (floating)
    return (
      <header className="pointer-events-none absolute inset-x-0 top-0 z-[800] flex h-[60px] items-center justify-between gap-2 px-3">
        <div className="float-ui pointer-events-auto rounded-full px-1.5">
          <CitySelector />
        </div>
        <div className="float-ui pointer-events-auto flex items-center rounded-full py-1 pl-1 pr-1.5">{icons}</div>
      </header>
    )
  return (
    <header className="glass z-40 flex h-14 shrink-0 items-center gap-1 border-b divider px-2 md:px-4">
      <CitySelector />
      <button onClick={() => nav('/search')} className="ml-3 hidden h-10 min-w-0 max-w-md flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm text-neutral-400 md:flex dark:bg-neutral-900">
        <Search className="h-4 w-4 shrink-0" /> <span className="truncate">Search places, people, events…</span>
      </button>
      <div className="flex-1" />
      {icons}
    </header>
  )
}

function BottomTabs() {
  const { chats } = useApp()
  const unread = chats.reduce((a, c) => a + (c.unread || 0), 0)
  return (
    <nav className="glass z-40 shrink-0 border-t divider pb-safe md:hidden">
      <div className="flex h-[58px] items-stretch">
        {NAV.map(({ to, icon: Icon, end, label }) => (
          <NavLink key={to} to={to} end={end} aria-label={label} className="flex flex-1 items-center justify-center">
            {({ isActive }) => (
              <div className="relative flex flex-col items-center">
                <Icon className={cx('h-[25px] w-[25px] transition duration-300', isActive ? 'text-ink-900 dark:text-white' : 'text-neutral-400')} strokeWidth={isActive ? 2.4 : 1.7} />
                <span className={cx('mt-1 h-1 w-1 rounded-full transition', isActive ? 'bg-accent' : 'bg-transparent')} />
                {to === '/connect' && unread > 0 && (
                  <span className="absolute -right-2.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-black">{unread}</span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function Sidebar() {
  const { me, t, theme, setTheme, setComposer, business, chats } = useApp()
  const unread = chats.reduce((a, c) => a + (c.unread || 0), 0)
  const items = [
    ...NAV,
    { to: '/guides', label: 'Guides', icon: BookOpen },
    { to: '/profile', label: 'Profile', icon: User },
    ...(business ? [{ to: '/business', label: 'Business', icon: Briefcase }] : []),
  ]
  // Tablets (md): compact icon rail. Laptops and up (lg): full sidebar with labels.
  const row = 'flex items-center justify-center gap-3.5 rounded-2xl p-3 text-[15px] transition hover:bg-neutral-100 dark:hover:bg-neutral-900 lg:justify-start'
  return (
    <aside className="no-scrollbar hidden w-[76px] shrink-0 flex-col overflow-y-auto border-r divider px-2.5 py-4 md:flex lg:w-[264px] lg:px-3 xl:w-[280px]">
      <div className="flex justify-center pb-5 lg:justify-start lg:px-3">
        <span className="lg:hidden">
          <HavenMark size={38} rounded={12} />
        </span>
        <span className="hidden lg:block">
          <Logo />
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} title={t(label)} className={({ isActive }) => cx(row, isActive ? 'font-bold' : 'font-medium text-neutral-600 dark:text-neutral-300')}>
            {({ isActive }) => (
              <>
                <span className="relative shrink-0">
                  {to === '/profile' ? (
                    <Avatar src={me?.avatar} size={26} className={isActive ? 'rounded-full ring-2 ring-accent' : ''} />
                  ) : (
                    <Icon className="h-[26px] w-[26px]" strokeWidth={isActive ? 2.5 : 1.8} />
                  )}
                  {to === '/connect' && unread > 0 && <span className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white dark:ring-black lg:hidden" />}
                </span>
                <span className="hidden flex-1 lg:inline">{t(label)}</span>
                {to === '/connect' && unread > 0 && <span className="hidden rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white lg:inline">{unread}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => setComposer({ type: 'post' })} title="Create post" className="btn-accent mt-5 h-12 w-full !px-0 lg:!px-4">
        <Plus className="h-5 w-5" /> <span className="hidden lg:inline">Create post</span>
      </button>
      <div className="min-h-4 flex-1" />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} className={cx(row, 'font-medium text-neutral-600 dark:text-neutral-300')}>
        {theme === 'dark' ? <Sun className="h-6 w-6 shrink-0" /> : <Moon className="h-6 w-6 shrink-0" />}
        <span className="hidden lg:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </aside>
  )
}

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const mainRef = useRef()
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar floating={pathname === '/'} />
        <main ref={mainRef} id="main" className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div key={pathname} className="page min-h-full">
            {children}
          </div>
        </main>
        <BottomTabs />
      </div>
      <Composer />
      <Toast />
    </div>
  )
}
