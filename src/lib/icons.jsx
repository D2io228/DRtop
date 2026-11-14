// Line icons + brand monograms used across the UI (replaces emoji in interface chrome).
import {
  Baby, BriefcaseBusiness, Coffee, CreditCard, Disc3, Drama, Dumbbell, FileText, Flower2, Hand, HandHeart, House, IdCard, Landmark, Languages,
  Laptop, Luggage, Mic, Moon, Music, Palette, PawPrint, School, ShoppingBag, Smartphone, Stethoscope, Store, TramFront, Trees, TrendingUp, Users,
  UtensilsCrossed, Wrench, PartyPopper,
} from 'lucide-react'
import { cx } from './utils'

export const INTEREST_ICON = {
  food: UtensilsCrossed, coffee: Coffee, nightlife: Moon, sports: Dumbbell, family: Baby, it: Laptop, art: Palette, language: Languages,
  music: Music, outdoors: Trees, nomad: Luggage, business: TrendingUp, wellness: Flower2, culture: Landmark, pets: PawPrint, volunteering: HandHeart,
}
export const EVENT_ICON = { meetup: Hand, party: Disc3, language: Languages, lecture: Mic, sports: Dumbbell, culture: Drama }
export const GOAL_ICON = { documents: IdCard, housing: House, banking: CreditCard, sim: Smartphone, health: Stethoscope, kids: School, transport: TramFront }
export const ROLE_ICON = { newcomer: Luggage, settled: House, business: Store, specialist: BriefcaseBusiness }
export const KIND_ICON = { cafe: Coffee, restaurant: UtensilsCrossed, shop: ShoppingBag, service: Wrench, community: Users, event: PartyPopper, org: Landmark }
const ORG_ICON = { o1: IdCard, o2: Landmark, o3: Landmark, o4: FileText, o5: Smartphone, o6: Stethoscope }

const BRAND = {
  b1: '#B4232A', b2: '#E2721B', b3: '#B8860B', b4: '#0EA5E9', b5: '#DB2777', b6: '#D97706', b7: '#111111', b8: '#7A4A2B',
  b9: '#0F766E', b10: '#1D4ED8', b11: '#DC2626', b12: '#6D28D9', b13: '#9F1239', b14: '#16A34A', b15: '#0F172A', b16: '#C026D3',
}
const PALETTE = ['#6C47FF', '#0EA5E9', '#16A34A', '#D97706', '#DB2777', '#0F766E', '#1D4ED8', '#9F1239']
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

export const monogram = (name = '') => {
  const words = name.replace(/[—–-].*$/, '').split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w) && !/^(co\.?|the|of|and|&)$/i.test(w))
  return ((words[0]?.[0] || '') + (words[1]?.[0] || '')).toUpperCase()
}

export const brandOf = (place) => ({
  mono: monogram(place.name),
  color: place.kind === 'org' ? '#3B82F6' : BRAND[place.id] || PALETTE[hash(place.name) % PALETTE.length],
  Icon: place.kind === 'org' ? ORG_ICON[place.id] || Landmark : null,
})
export const brandOfName = (name) => ({ mono: monogram(name), color: PALETTE[hash(name) % PALETTE.length] })

export function BrandLogo({ brand, size = 40, className = '', round }) {
  const { mono, color, Icon } = brand
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center font-extrabold tracking-tight text-white', round ? 'rounded-full' : 'rounded-[28%]', className)}
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {Icon ? <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} /> : mono}
    </span>
  )
}

export function IconFor({ map, id, className = 'h-4 w-4', strokeWidth = 2 }) {
  const I = map[id]
  return I ? <I className={className} strokeWidth={strokeWidth} /> : null
}

export const brandOfJob = (job, placeById) => (job.placeId && placeById[job.placeId] ? brandOf(placeById[job.placeId]) : brandOfName(job.company))
