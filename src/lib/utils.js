import { TODAY } from '../config'

export const cx = (...a) => a.filter(Boolean).join(' ')

export const fmtNum = (n) => {
  if (n == null) return ''
  if (n >= 10000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`
  return String(n)
}

// minutes-ago → short label
export const timeAgo = (min) => {
  if (typeof min === 'string') return min
  if (min < 1) return 'now'
  if (min < 60) return `${Math.round(min)}m`
  if (min < 60 * 24) return `${Math.round(min / 60)}h`
  if (min < 60 * 24 * 7) return `${Math.round(min / 1440)}d`
  return `${Math.round(min / 10080)}w`
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const parseDate = (iso) => new Date(iso)
export const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export const fmtDay = (iso) => {
  const d = new Date(iso)
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}
export const fmtDateTime = (iso) => `${fmtDay(iso)} · ${fmtTime(iso)}`
export const monthShort = (iso) => MONTHS[new Date(iso).getMonth()].toUpperCase()
export const dayNum = (iso) => new Date(iso).getDate()
export const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const relativeDay = (iso) => {
  const d = new Date(iso)
  const t = new Date(TODAY)
  const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 1 && diff < 7) return DAYS[d.getDay()]
  return fmtDay(iso)
}

// hours: array of 7 entries (Mon..Sun) => [open, close] | null
const hh = (h) => {
  const H = Math.floor(h) % 24
  const M = Math.round((h % 1) * 60)
  return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`
}
export const hoursLabel = (slot) => (slot ? `${hh(slot[0])} – ${hh(slot[1])}` : 'Closed')
export const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const isOpenNow = (hours, now = new Date()) => {
  if (!hours) return false
  const idx = (now.getDay() + 6) % 7
  const slot = hours[idx]
  if (!slot) return false
  const h = now.getHours() + now.getMinutes() / 60
  const [o, c] = slot
  return c > o ? h >= o && h < c : h >= o || h < c
}

export const overlap = (a = [], b = []) => a.filter((x) => b.includes(x))

// Personalization score based on onboarding answers
export const matchScore = (item, me) => {
  if (!me) return 0
  let s = 0
  s += overlap(item.languages || [], me.languages).filter((l) => l !== 'en').length * 3
  s += overlap(item.languages || [], me.languages).length
  s += overlap(item.tags || item.interests || [], me.interests).length * 2
  if (item.country && item.country === me.country) s += 4
  if (item.ownerCountry && item.ownerCountry === me.country) s += 4
  return s
}
export const sortByMatch = (arr, me) =>
  [...arr].map((x, i) => [x, matchScore(x, me), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]).map((x) => x[0])

export const flagUrl = (code) => `https://flagcdn.com/w40/${code}.png`

export const nowTime = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const distanceKm = (a, b) => {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
export const fmtKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`)
