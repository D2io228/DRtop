import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { posts as seedPosts } from '../data/social'
import { events as seedEvents } from '../data/events'
import { chats as seedChats, notifications as seedNotifs } from '../data/chats'
import { jobs as seedJobs } from '../data/market'
import { defaultDoneFor } from '../data/guides'
import { translate } from '../lib/i18n'
import { nowTime } from '../lib/utils'
import { userById } from '../data/users'
import { placeById } from '../data/places'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const toggleIn = (set, id) => {
  const n = new Set(set)
  n.has(id) ? n.delete(id) : n.add(id)
  return n
}

const AUTO_REPLIES = [
  'Hey! 😊 Thanks for the message.',
  'Sounds great, let’s do it!',
  'Sure — when works for you?',
  'Haha yes, Belgrade is like that 😄',
  'Let me check and get back to you in a bit 👍',
]

export function AppProvider({ children }) {
  const [me, setMe] = useState(null) // set after onboarding
  const [theme, setTheme] = useState(() => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [lang, setLang] = useState('en')
  const [posts, setPosts] = useState(seedPosts)
  const [events, setEvents] = useState(seedEvents)
  const [chats, setChats] = useState(seedChats)
  const [jobs, setJobs] = useState(seedJobs)
  const [notifications, setNotifications] = useState(seedNotifs)
  const [liked, setLiked] = useState(new Set(['p9']))
  const [reposted, setReposted] = useState(new Set())
  const [saved, setSaved] = useState(new Set(['place:b1', 'event:e2', 'guide:g1']))
  const [following, setFollowing] = useState(new Set(['u6', 'u10', 'u5']))
  const [followedBiz, setFollowedBiz] = useState(new Set(['b2']))
  const [joinedCommunities, setJoinedCommunities] = useState(new Set(['c4']))
  const [joinedEvents, setJoinedEvents] = useState(new Set(['e2']))
  const [done, setDone] = useState(new Set())
  const [helpful, setHelpful] = useState(new Set())
  const [business, setBusiness] = useState(null) // business account profile
  const [toast, setToast] = useState(null)
  const [composer, setComposer] = useState(null) // { type, text, placeId, communityId }
  const [typing, setTyping] = useState({}) // chatId -> userId
  const toastTimer = useRef()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff')
  }, [theme])

  const t = useCallback((k) => translate(lang, k), [lang])

  const showToast = useCallback((text, icon = '✓') => {
    clearTimeout(toastTimer.current)
    setToast({ text, icon, id: Math.random() })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const completeOnboarding = (profile) => {
    setMe(profile)
    setDone(new Set(defaultDoneFor(profile.role)))
    // communities matching origin get pre-joined
    const pre = new Set(['c4'])
    if (profile.country === 'ru' || profile.country === 'by' || profile.country === 'kz') pre.add('c1')
    if (profile.country === 'ua') pre.add('c7')
    if (profile.country === 'tr') pre.add('c5')
    if (profile.interests.includes('it')) pre.add('c2')
    if (profile.interests.includes('family')) pre.add('c3')
    if (profile.interests.includes('nomad')) pre.add('c6')
    setJoinedCommunities(pre)
    if (profile.role === 'business' || profile.role === 'specialist') {
      setBusiness(makeBusiness(profile))
    }
  }

  const makeBusiness = (profile) => ({
    name: profile.role === 'specialist' ? `${profile.name} — Consulting` : `${profile.name.split(' ')[0]}’s Place`,
    category: profile.role === 'specialist' ? 'Specialist' : 'Café',
    description: 'Tell newcomers what makes your place special.',
    languages: profile.languages,
    hours: '09:00 – 21:00',
    address: 'Vračar, Belgrade',
  })

  const switchToBusiness = () => {
    setBusiness((b) => b || makeBusiness(me))
  }

  const toggleSave = (key, label = 'Saved') => {
    setSaved((s) => {
      const had = s.has(key)
      showToast(had ? 'Removed from saved' : label, had ? '↩' : '🔖')
      return toggleIn(s, key)
    })
  }

  const toggleLike = (id) => setLiked((s) => toggleIn(s, id))
  const toggleRepost = (id) =>
    setReposted((s) => {
      showToast(s.has(id) ? 'Repost removed' : 'Reposted to your profile', '🔁')
      return toggleIn(s, id)
    })
  const toggleFollow = (id) =>
    setFollowing((s) => {
      showToast(s.has(id) ? 'Unfollowed' : `Following ${userById[id]?.name.split(' ')[0] ?? ''}`, s.has(id) ? '↩' : '✨')
      return toggleIn(s, id)
    })
  const toggleFollowBiz = (id) =>
    setFollowedBiz((s) => {
      showToast(s.has(id) ? 'Unfollowed' : `Following ${placeById[id]?.name ?? ''}`, s.has(id) ? '↩' : '✨')
      return toggleIn(s, id)
    })
  const toggleCommunity = (id) =>
    setJoinedCommunities((s) => {
      showToast(s.has(id) ? 'You left the community' : 'Welcome to the community! 🎉', s.has(id) ? '↩' : '👥')
      return toggleIn(s, id)
    })
  const toggleEvent = (id) => {
    const wasJoined = joinedEvents.has(id)
    setJoinedEvents((s) => toggleIn(s, id))
    setEvents((evs) => evs.map((e) => (e.id === id ? { ...e, joined: e.joined + (wasJoined ? -1 : 1) } : e)))
    showToast(wasJoined ? 'You left the event' : 'You’re going! 🎉', wasJoined ? '↩' : '🎟️')
  }
  const toggleStep = (id) => setDone((s) => toggleIn(s, id))
  const toggleHelpful = (id) => setHelpful((s) => toggleIn(s, id))

  const addPost = (post) => {
    setPosts((p) => [{ id: `p${Date.now()}`, authorId: 'me', likes: 0, reposts: 0, comments: [], time: 0, lang: 'en', ...post }, ...p])
    showToast(post.type === 'question' ? 'Question posted — the community will help!' : 'Posted!', '🚀')
  }
  const addComment = (postId, text) =>
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, comments: [...x.comments, { userId: 'me', text, time: 0 }] } : x)))

  const addEvent = (ev) => {
    const id = `e${Date.now()}`
    setEvents((e) => [{ id, joined: 1, attendees: [], hostId: 'me', price: 0, durationH: 2, tags: [], ...ev }, ...e])
    setJoinedEvents((s) => new Set(s).add(id))
    showToast('Event published! 🎉', '📅')
    return id
  }
  const addJob = (job) => {
    setJobs((j) => [{ id: `j${Date.now()}`, posted: 'now', applicants: 0, niceToHave: [], perks: [], tags: [], logo: '🏪', ...job }, ...j])
    showToast('Job posted', '💼')
  }

  // ---- chats ----
  const chatsRef = useRef(chats)
  chatsRef.current = chats

  const findOrCreateChat = ({ kind, refId, type = 'private', intro, attachment }) => {
    const existing = chatsRef.current.find((c) => c.kind === kind && c.refId === refId)
    if (existing) {
      if (intro) sendMessage(existing.id, intro, attachment, existing)
      return existing.id
    }
    const id = `ch${Date.now()}`
    const chat = { id, type, kind, refId, unread: 0, messages: [] }
    chatsRef.current = [chat, ...chatsRef.current]
    setChats((c) => [chat, ...c])
    if (intro) sendMessage(id, intro, attachment, chat)
    return id
  }

  const sendMessage = (chatId, text, attachment, chatHint) => {
    const msg = { id: Date.now() + Math.random(), from: 'me', text, time: nowTime(), attachment }
    setChats((cs) => {
      const chat = cs.find((c) => c.id === chatId)
      if (!chat) return cs
      const rest = cs.filter((c) => c.id !== chatId)
      return [{ ...chat, unread: 0, messages: [...chat.messages, msg] }, ...rest]
    })
    // mock auto-reply
    const chat = chatHint || chatsRef.current.find((c) => c.id === chatId)
    if (!chat) return
    const direct = ['user', 'business', 'specialist', 'job', 'housing'].includes(chat.kind)
    const responder = direct
      ? chat.kind === 'job' || chat.kind === 'housing' ? 'contact' : chat.refId
      : chat.messages.filter((m) => m.from !== 'me').slice(-1)[0]?.from || 'u10'
    setTimeout(() => setTyping((t) => ({ ...t, [chatId]: responder })), 700)
    setTimeout(() => {
      setTyping((t) => ({ ...t, [chatId]: null }))
      setChats((cs) =>
        cs.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now() + Math.random(), from: responder, text: replyFor(chat, text), time: nowTime() }] } : c)),
      )
    }, 2300)
  }

  const markChatRead = (id) => setChats((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  const pushNotification = (n) => setNotifications((ns) => [{ id: `n${Date.now()}`, time: 'now', read: false, ...n }, ...ns])

  const value = {
    me, setMe, completeOnboarding, theme, setTheme, lang, setLang, t,
    posts, addPost, addComment, events, addEvent, chats, setChats, findOrCreateChat, sendMessage, markChatRead, typing,
    jobs, addJob, notifications, markAllRead, pushNotification,
    liked, toggleLike, reposted, toggleRepost, saved, toggleSave, following, toggleFollow, followedBiz, toggleFollowBiz,
    joinedCommunities, toggleCommunity, joinedEvents, toggleEvent, done, toggleStep, helpful, toggleHelpful,
    business, setBusiness, switchToBusiness, toast, showToast, composer, setComposer,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function replyFor(chat, text) {
  const lower = text.toLowerCase()
  if (chat.kind === 'job') return 'Thanks for applying! 🙌 We’ve received your CV and will get back to you within 3 working days.'
  if (chat.kind === 'housing') return 'Hi! Yes, it’s still available. Would you like to come for a viewing this weekend?'
  if (chat.kind === 'specialist' || /book|appointment|slot/.test(lower)) return 'Thank you! I’ve noted your request — see you then. Let me know if you need to reschedule.'
  if (chat.kind === 'business') return 'Hello! Thanks for reaching out 😊 How can we help?'
  if (/привет|здравствуй/.test(lower)) return 'Привет! 😊 Рада знакомству!'
  if (/merhaba|selam/.test(lower)) return 'Merhaba! 😊 Hoş geldin!'
  if (/zdravo|ćao|cao/.test(lower)) return 'Zdravo! 😊 Kako si?'
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
}
