export const COUNTRIES = {
  ru: 'Russia',
  ua: 'Ukraine',
  by: 'Belarus',
  tr: 'Turkey',
  cn: 'China',
  in: 'India',
  de: 'Germany',
  us: 'USA',
  ir: 'Iran',
  kz: 'Kazakhstan',
  gb: 'United Kingdom',
  fr: 'France',
  it: 'Italy',
  br: 'Brazil',
  il: 'Israel',
  am: 'Armenia',
  ge: 'Georgia',
  es: 'Spain',
  pl: 'Poland',
  rs: 'Serbia',
}

export const LANGUAGES = {
  en: 'English',
  sr: 'Serbian',
  ru: 'Russian',
  uk: 'Ukrainian',
  tr: 'Turkish',
  zh: 'Chinese',
  hi: 'Hindi',
  de: 'German',
  fa: 'Persian',
  fr: 'French',
  it: 'Italian',
  es: 'Spanish',
  pt: 'Portuguese',
  he: 'Hebrew',
  ar: 'Arabic',
}

export const INTERESTS = [
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { id: 'sports', label: 'Sports', emoji: '🏃' },
  { id: 'family', label: 'Family & kids', emoji: '👶' },
  { id: 'it', label: 'IT & tech', emoji: '💻' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'language', label: 'Language exchange', emoji: '🗣️' },
  { id: 'music', label: 'Music', emoji: '🎧' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🌿' },
  { id: 'nomad', label: 'Digital nomads', emoji: '🧳' },
  { id: 'business', label: 'Business', emoji: '📈' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'pets', label: 'Pets', emoji: '🐶' },
  { id: 'volunteering', label: 'Volunteering', emoji: '🤝' },
]
export const interestById = Object.fromEntries(INTERESTS.map((i) => [i.id, i]))

export const ROLES = [
  { id: 'newcomer', label: 'Newcomer', desc: 'I just moved or I’m about to', emoji: '🧳' },
  { id: 'settled', label: 'Living here a while', desc: 'I know the ropes and like to help', emoji: '🏡' },
  { id: 'business', label: 'Business', desc: 'Café, shop, agency, school…', emoji: '🏪' },
  { id: 'specialist', label: 'Specialist', desc: 'Doctor, tutor, lawyer, stylist…', emoji: '🩺' },
]

export const NEIGHBORHOODS = ['Vračar', 'Dorćol', 'Savamala', 'Novi Beograd', 'Zemun', 'Stari Grad', 'Palilula', 'Senjak']

// Map categories (Explore chips) — color-coded pins
export const MAP_CATEGORIES = [
  { id: 'cafe', label: 'Cafés', emoji: '☕', color: '#F59E0B' },
  { id: 'restaurant', label: 'Restaurants', emoji: '🍽️', color: '#EF4444' },
  { id: 'shop', label: 'Shops', emoji: '🛍️', color: '#14B8A6' },
  { id: 'community', label: 'Communities', emoji: '👥', color: '#6C47FF' },
  { id: 'event', label: 'Events', emoji: '🎉', color: '#EC4899' },
  { id: 'org', label: 'Useful orgs', emoji: '🏛️', color: '#3B82F6' },
  { id: 'service', label: 'Services', emoji: '🛠️', color: '#22C55E' },
]
export const mapCat = Object.fromEntries(MAP_CATEGORIES.map((c) => [c.id, c]))

export const EVENT_CATEGORIES = [
  { id: 'meetup', label: 'Meetups', emoji: '👋' },
  { id: 'party', label: 'Parties', emoji: '🪩' },
  { id: 'language', label: 'Language clubs', emoji: '🗣️' },
  { id: 'lecture', label: 'Lectures', emoji: '🎤' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
]

export const POST_TYPES = [
  { id: 'post', label: 'Post' },
  { id: 'question', label: 'Question' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'guide', label: 'Guide' },
]
