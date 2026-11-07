import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Star, X } from 'lucide-react'
import { photo, avatar as avatarUrl } from '../data/photos'
import { COUNTRIES, LANGUAGES } from '../data/meta'
import { cx, flagUrl } from '../lib/utils'
import { useApp } from '../store/AppContext'

export function Img({ src, w = 800, alt = '', className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  const url = failed ? `https://picsum.photos/seed/${encodeURIComponent(src)}/${w}/${Math.round(w * 0.75)}` : photo(src, w)
  return <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cx('bg-neutral-200 object-cover dark:bg-neutral-800', className)} {...rest} />
}

export function Flag({ code, className = '' }) {
  if (!code) return null
  return (
    <img
      src={flagUrl(code)}
      alt={COUNTRIES[code]}
      title={COUNTRIES[code]}
      className={cx('inline-block h-3 w-[18px] shrink-0 rounded-[3px] object-cover ring-1 ring-black/10', className)}
    />
  )
}

export function Avatar({ src, size = 40, flag, ring, className = '', emoji, onClick }) {
  return (
    <div className={cx('relative shrink-0', className)} style={{ width: size, height: size }} onClick={onClick}>
      {emoji ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800" style={{ fontSize: size * 0.45 }}>
          {emoji}
        </div>
      ) : (
        <img
          src={src?.startsWith?.('blob:') || src?.startsWith?.('http') ? src : avatarUrl(src)}
          alt=""
          className={cx('h-full w-full rounded-full bg-neutral-200 object-cover dark:bg-neutral-800', ring && 'ring-2 ring-white dark:ring-black')}
        />
      )}
      {flag && (
        <img
          src={flagUrl(flag)}
          alt=""
          className="absolute -bottom-0.5 -right-0.5 rounded-full object-cover ring-2 ring-white dark:ring-black"
          style={{ width: Math.max(14, size * 0.36), height: Math.max(14, size * 0.36) }}
        />
      )}
    </div>
  )
}

export function AvatarStack({ ids = [], resolve, size = 24, max = 4 }) {
  return (
    <div className="flex -space-x-2">
      {ids.slice(0, max).map((id) => {
        const u = resolve(id)
        return u ? <Avatar key={id} src={u.avatar} size={size} ring /> : null
      })}
    </div>
  )
}

export function LangBadge({ code, highlight }) {
  return (
    <span
      title={LANGUAGES[code]}
      className={cx(
        'inline-flex h-5 items-center rounded-md px-1.5 text-[10px] font-bold uppercase tracking-wide',
        highlight ? 'bg-accent-100 text-accent-700 dark:bg-accent/25 dark:text-accent-200' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
      )}
    >
      {code}
    </span>
  )
}

export function LangBadges({ langs = [], max = 4 }) {
  const { me } = useApp()
  const sorted = [...langs].sort((a, b) => (me?.languages.includes(b) ? 1 : 0) - (me?.languages.includes(a) ? 1 : 0))
  return (
    <div className="flex flex-wrap items-center gap-1">
      {sorted.slice(0, max).map((l) => (
        <LangBadge key={l} code={l} highlight={me?.languages.includes(l) && l !== 'en'} />
      ))}
      {langs.length > max && <span className="text-[10px] font-semibold text-neutral-400">+{langs.length - max}</span>}
    </div>
  )
}

export function Rating({ value, count, small }) {
  return (
    <span className={cx('inline-flex items-center gap-1 font-semibold', small ? 'text-xs' : 'text-sm')}>
      <Star className={cx('fill-current text-amber-400', small ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {value.toFixed(1)}
      {count != null && <span className="font-normal text-neutral-400">({count})</span>}
    </span>
  )
}

export function Verified({ className = '' }) {
  return <BadgeCheck className={cx('inline h-4 w-4 shrink-0 fill-accent text-white dark:text-black', className)} />
}

export function Chip({ active, onClick, children, className = '', accent }) {
  return (
    <button onClick={onClick} className={cx('chip', active && (accent ? 'chip-accent' : 'chip-active'), className)}>
      {children}
    </button>
  )
}

export function ChipRow({ children, className = '' }) {
  return <div className={cx('no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4', className)}>{children}</div>
}

export function ProgressRing({ value, size = 56, stroke = 6, color = '#6C47FF', children, track }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track || 'currentColor'} strokeWidth={stroke} fill="none" className="text-neutral-200 dark:text-neutral-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export function EmptyState({ emoji = '🌱', title, text, action }) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center animate-fade-up">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-4xl animate-bounce1 dark:bg-neutral-900">{emoji}</div>
      <div className="text-lg font-bold">{title}</div>
      {text && <p className="muted mt-1 max-w-xs text-sm">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Sheet({ open, onClose, children, title, className = '' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className={cx(
          'relative max-h-[90dvh] w-full overflow-y-auto rounded-t-[28px] bg-white pb-safe animate-sheet-up dark:bg-ink-800 md:max-w-lg md:rounded-[28px] md:animate-fade-up',
          className,
        )}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-ink-800/95">
          <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700 md:hidden" />
          {title && (
            <div className="flex items-center justify-between px-5 pb-2 pt-3">
              <div className="text-lg font-bold">{title}</div>
              <button className="icon-btn -mr-2" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div
      key={toast.id}
      className="fixed bottom-24 left-1/2 z-[1300] flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg animate-toast-in dark:bg-white dark:text-black md:bottom-8"
    >
      <span>{toast.icon}</span>
      {toast.text}
    </div>
  )
}

export function PageHeader({ title, subtitle, right, back = true, transparent }) {
  const nav = useNavigate()
  return (
    <div className={cx('sticky top-0 z-30 flex h-14 items-center gap-2 px-2', transparent ? '' : 'glass border-b divider')}>
      {back && (
        <button className="icon-btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className={cx('min-w-0 flex-1', !back && 'pl-2')}>
        {title && <div className="truncate text-base font-bold leading-tight">{title}</div>}
        {subtitle && <div className="muted truncate text-xs">{subtitle}</div>}
      </div>
      {right}
    </div>
  )
}

export function FloatingBack({ right }) {
  const nav = useNavigate()
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3">
      <button
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 backdrop-blur transition active:scale-90 dark:bg-black/70 dark:text-white"
        onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="pointer-events-auto flex gap-2">{right}</div>
    </div>
  )
}

export function RoundBtn({ children, onClick, label, active }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cx(
        'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition active:scale-90',
        active ? 'bg-accent text-white' : 'bg-white/90 text-ink-900 dark:bg-black/70 dark:text-white',
      )}
    >
      {children}
    </button>
  )
}

export function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={cx('no-scrollbar flex gap-6 overflow-x-auto border-b divider px-4', className)}>
      {tabs.map((t) => {
        const id = t.id ?? t
        const label = t.label ?? t
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cx('relative shrink-0 py-3 text-[15px] font-semibold transition', active ? 'text-ink-900 dark:text-white' : 'text-neutral-400')}
          >
            {label}
            {t.count ? <span className="ml-1 rounded-full bg-accent px-1.5 text-[10px] text-white">{t.count}</span> : null}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink-900 dark:bg-white" />}
          </button>
        )
      })}
    </div>
  )
}

export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={cx('inline-flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-900', className)}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cx(
            'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
            value === o.id ? 'bg-white text-ink-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-neutral-500',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SectionHeader({ title, action, onAction, className = '' }) {
  return (
    <div className={cx('mb-3 flex items-end justify-between px-4', className)}>
      <h2 className="section-title">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-sm font-semibold text-accent">
          {action}
        </button>
      )}
    </div>
  )
}

export function Stars({ value, onChange, size = 'h-7 w-7' }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange?.(n)} className="transition active:scale-90">
          <Star className={cx(size, n <= value ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700')} />
        </button>
      ))}
    </div>
  )
}
