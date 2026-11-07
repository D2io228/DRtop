import { userById } from '../data/users'
import { placeById } from '../data/places'
import { specialistById } from '../data/specialists'
import { communityById } from '../data/social'
import { jobById, housingById } from '../data/market'

export const getUser = (id, me) => {
  if (id === 'me') return me ? { id: 'me', ...me } : null
  return userById[id] || null
}

// Who is "talking" in a message / what does a chat look like
export const chatMeta = (chat, { me, events, jobs }) => {
  const ev = events?.find((e) => e.id === chat.refId)
  switch (chat.kind) {
    case 'user': {
      const u = userById[chat.refId]
      return { title: u?.name, avatar: u?.avatar, flag: u?.country, subtitle: `@${u?.handle}`, link: `/u/${u?.id}` }
    }
    case 'business': {
      const p = placeById[chat.refId]
      return { title: p?.name, emoji: p?.logo, subtitle: p?.category, link: `/place/${p?.id}` }
    }
    case 'specialist': {
      const s = specialistById[chat.refId]
      return { title: s?.name, avatar: s?.avatar, flag: s?.country, subtitle: s?.profession, link: `/specialist/${s?.id}` }
    }
    case 'community': {
      const c = communityById[chat.refId]
      return { title: c?.name, avatar: c?.avatar, photo: true, subtitle: `${c?.members.toLocaleString()} members`, link: `/community/c/${c?.id}`, group: true }
    }
    case 'event':
      return { title: ev?.title, avatar: ev?.cover, photo: true, subtitle: 'Event group chat', link: `/event/${ev?.id}`, group: true }
    case 'job': {
      const j = jobs?.find((x) => x.id === chat.refId) || jobById[chat.refId]
      return { title: j?.company, emoji: j?.logo, subtitle: `Re: ${j?.title}`, link: `/job/${j?.id}` }
    }
    case 'housing': {
      const h = housingById[chat.refId]
      const owner = h?.ownerId ? userById[h.ownerId] : null
      return { title: owner?.name || h?.ownerName, avatar: owner?.avatar || h?.ownerAvatar, flag: owner?.country, subtitle: `Re: ${h?.title}`, link: `/housing/${h?.id}` }
    }
    default:
      return { title: 'Chat' }
  }
}

export const senderMeta = (from, chat, ctx) => {
  if (from === 'me') return { name: 'You', avatar: ctx.me?.avatar }
  if (from === 'contact' || from === chat.refId) {
    const m = chatMeta(chat, ctx)
    return { name: m.title, avatar: m.avatar, emoji: m.emoji }
  }
  const p = placeById[from]
  if (p) return { name: p.name, emoji: p.logo }
  const u = userById[from]
  return { name: u?.name, avatar: u?.avatar, flag: u?.country }
}
