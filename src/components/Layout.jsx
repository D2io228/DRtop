import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, BookOpen, Briefcase, CalendarDays, ChevronDown, Compass, Globe, MapPin, MessageCircle, Moon, Plus, Search, Store, Sun, User, Users, Check,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { APP_NAME } from '../config'
import { Avatar, Sheet, Toast } from './ui'
import { cx } from '../lib/utils'
import Composer from './Composer'

export const NAV = [
  { to: '/', label: 'Explore', icon: Compass, end: true },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/services', label: 'Services', icon: Store },
  { to: '/connect', label: 'Connect', icon: MessageCircle },
]

export function Logo({ small }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cx('flex items-center justify-center rounded-xl bg-accent text-white', small ? 'h-7 w-7' : 'h-9 w-9')}>
        <Compass className={small ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2.5} />
      </div>
      <span className={cx('font-extrabold tracking-tight', small ? 'text-lg' : 'text-xl')}>{APP_NAME.toLowerCase()}</span>
    </div>
  )
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
      <button onClick={() => setOpen((o) => !o)} aria-label="Language" className="flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <Globe className="h-4 w-4" />
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
    { name: 'Belgrade', country: 'Serbia', live: true, emoji: '🇷🇸' },
    { name: 'Novi Sad', country: 'Serbia', live: false, emoji: '🇷🇸' },
    { name: 'Budva', country: 'Montenegro', live: false, emoji: '🇲🇪' },
    { name: 'Tbilisi', country: 'Georgia', live: false, emoji: '🇬🇪' },
    { name: 'Istanbul', country: 'Turkey', live: false, emoji: '🇹🇷' },
  ]
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-full py-1.5 pl-1 pr-2 text-[15px] font-bold transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <MapPin className="h-4 w-4 text-accent" strokeWidth={2.5} />
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
              <span className="text-2xl">{c.emoji}</span>
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

function TopBar() {
  const { me, notifications } = useApp()
  const nav = useNavigate()
  const unread = notifications.filter((n) => !n.read).length
  return (
    <header className="glass z-40 flex h-14 shrink-0 items-center gap-1 border-b divider px-2 md:px-4">
      <CitySelector />
      <button onClick={() => nav('/search')} className="ml-3 hidden h-10 max-w-md flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm text-neutral-400 md:flex dark:bg-neutral-900">
        <Search className="h-4 w-4" /> Search places, people, events…
      </button>
      <div className="flex-1" />
      <LangSwitcher />
      <button className="icon-btn md:hidden" onClick={() => nav('/search')} aria-label="Search">
        <Search className="h-[22px] w-[22px]" />
      </button>
      <button className="icon-btn relative" onClick={() => nav('/notifications')} aria-label="Notifications">
        <Bell className="h-[22px] w-[22px]" />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-black">{unread}</span>}
      </button>
      <button className="icon-btn md:hidden" onClick={() => nav('/guides')} aria-label="Guides">
        <BookOpen className="h-[22px] w-[22px]" />
      </button>
      <button className="ml-1 rounded-full transition active:scale-90 md:hidden" onClick={() => nav('/profile')} aria-label="Profile">
        <Avatar src={me?.avatar} size={32} />
      </button>
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
                <Icon className={cx('h-[26px] w-[26px] transition', isActive ? 'scale-110 text-ink-900 dark:text-white' : 'text-neutral-400')} strokeWidth={isActive ? 2.6 : 1.8} />
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
  ]
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r divider px-3 py-5 md:flex lg:w-[272px]">
      <div className="px-3 pb-6">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx('flex items-center gap-3.5 rounded-2xl px-3 py-3 text-[15px] transition hover:bg-neutral-100 dark:hover:bg-neutral-900', isActive ? 'font-bold' : 'font-medium text-neutral-600 dark:text-neutral-300')
            }
          >
            {({ isActive }) => (
              <>
                {to === '/profile' ? <Avatar src={me?.avatar} size={26} className={isActive ? 'ring-2 ring-accent rounded-full' : ''} /> : <Icon className="h-[26px] w-[26px]" strokeWidth={isActive ? 2.5 : 1.8} />}
                <span className="flex-1">{t(label)}</span>
                {to === '/connect' && unread > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{unread}</span>}
              </>
            )}
          </NavLink>
        ))}
        {business && (
          <NavLink
            to="/business"
            className={({ isActive }) => cx('flex items-center gap-3.5 rounded-2xl px-3 py-3 text-[15px] transition hover:bg-neutral-100 dark:hover:bg-neutral-900', isActive ? 'font-bold' : 'font-medium text-neutral-600 dark:text-neutral-300')}
          >
            <Briefcase className="h-[26px] w-[26px]" strokeWidth={1.8} />
            Business
          </NavLink>
        )}
      </nav>
      <button onClick={() => setComposer({ type: 'post' })} className="btn-accent mt-6 w-full py-3">
        <Plus className="h-5 w-5" /> Create post
      </button>
      <div className="flex-1" />
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center gap-3.5 rounded-2xl px-3 py-3 text-[15px] font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
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
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
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
