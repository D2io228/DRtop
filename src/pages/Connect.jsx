import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Paperclip, Search, Send, SlidersHorizontal, Smile, FileText, Users, ImagePlus, Info } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Chip, ChipRow, EmptyState, Flag, Img, PageHeader, Sheet, Tabs } from '../components/ui'
import { PersonCard } from '../components/cards'
import { users } from '../data/users'
import { COUNTRIES, INTERESTS, LANGUAGES, NEIGHBORHOODS } from '../data/meta'
import { chatMeta, senderMeta } from '../lib/entities'
import { cx, sortByMatch } from '../lib/utils'

export default function Connect() {
  const { t, chats } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'people'
  const unread = chats.reduce((a, c) => a + (c.unread || 0), 0)
  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="px-4 pb-2 pt-5">
        <h1 className="h-title">{t('Connect')}</h1>
      </div>
      <Tabs
        className="sticky top-0 z-20 glass"
        value={tab}
        onChange={(x) => setParams({ tab: x }, { replace: true })}
        tabs={[
          { id: 'people', label: t('People') },
          { id: 'chats', label: t('Chats'), count: unread },
        ]}
      />
      {tab === 'people' ? <People /> : <ChatList />}
    </div>
  )
}

function People() {
  const { me, findOrCreateChat, showToast } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [interest, setInterest] = useState([])
  const [langs, setLangs] = useState([])
  const [country, setCountry] = useState('all')
  const [hood, setHood] = useState('all')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(null)
  const [hiText, setHiText] = useState('')

  const list = sortByMatch(users, me).filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) &&
      (!interest.length || interest.some((i) => u.interests.includes(i))) &&
      (!langs.length || langs.some((l) => u.languages.includes(l))) &&
      (country === 'all' || u.country === country) &&
      (hood === 'all' || u.neighborhood === hood),
  )
  const filterCount = interest.length + langs.length + (country !== 'all' ? 1 : 0) + (hood !== 'all' ? 1 : 0)
  const openHi = (u) => {
    setHi(u)
    const shared = u.languages.find((l) => me.languages.includes(l) && l !== 'en')
    setHiText(shared === 'ru' ? `Привет, ${u.name.split(' ')[0]}! 👋 Я тоже недавно в Белграде.` : shared === 'tr' ? `Merhaba ${u.name.split(' ')[0]}! 👋` : `Hi ${u.name.split(' ')[0]}! 👋 I saw we have a few things in common — want to grab a coffee sometime?`)
  }
  const send = () => {
    const id = findOrCreateChat({ kind: 'user', refId: hi.id, intro: hiText.trim() })
    setHi(null)
    showToast('Message sent 👋', '💬')
    nav(`/chat/${id}`)
  }
  const reset = () => (setInterest([]), setLangs([]), setCountry('all'), setHood('all'))

  return (
    <>
      <div className="flex gap-2 px-4 pt-4">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 dark:bg-neutral-900">
          <Search className="h-4 w-4 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </div>
        <button onClick={() => setOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900" aria-label="Filters">
          <SlidersHorizontal className="h-[18px] w-[18px]" />
          {filterCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">{filterCount}</span>}
        </button>
      </div>
      <ChipRow className="py-4">
        {me.languages.filter((l) => l !== 'en').map((l) => (
          <Chip key={l} accent active={langs.includes(l)} onClick={() => setLangs(langs.includes(l) ? langs.filter((x) => x !== l) : [...langs, l])}>
            🗣️ Speaks {LANGUAGES[l]}
          </Chip>
        ))}
        <Chip active={country === me.country} onClick={() => setCountry(country === me.country ? 'all' : me.country)}>
          <Flag code={me.country} /> From {COUNTRIES[me.country]}
        </Chip>
        {me.interests.slice(0, 4).map((i) => {
          const it = INTERESTS.find((x) => x.id === i)
          return (
            <Chip key={i} active={interest.includes(i)} onClick={() => setInterest(interest.includes(i) ? interest.filter((x) => x !== i) : [...interest, i])}>
              {it.emoji} {it.label}
            </Chip>
          )
        })}
      </ChipRow>
      {list.length === 0 ? (
        <EmptyState emoji="🔭" title="No one matches yet" text="Try fewer filters — Belgrade is full of friendly people!" action={<button className="btn-ghost" onClick={reset}>Reset filters</button>} />
      ) : (
        <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u) => <PersonCard key={u.id} u={u} onHi={openHi} />)}
        </div>
      )}

      <Sheet open={!!hi} onClose={() => setHi(null)} title="Say hi 👋">
        {hi && (
          <div className="px-5 pb-6">
            <div className="flex items-center gap-3">
              <Avatar src={hi.avatar} size={48} flag={hi.country} />
              <div>
                <div className="font-semibold">{hi.name}</div>
                <div className="muted text-xs">{hi.bio}</div>
              </div>
            </div>
            <textarea rows={3} value={hiText} onChange={(e) => setHiText(e.target.value)} className="input mt-4 resize-none" />
            <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
              {['Coffee this week? ☕', 'Any tips for a newcomer?', 'Want to practise languages?'].map((s) => (
                <button key={s} onClick={() => setHiText(s)} className="chip text-xs">{s}</button>
              ))}
            </div>
            <button disabled={!hiText.trim()} onClick={send} className="btn-accent mt-4 w-full py-3">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        )}
      </Sheet>

      <Sheet open={open} onClose={() => setOpen(false)} title="Filter people">
        <div className="space-y-6 px-5 pb-6">
          <div>
            <div className="label">Interests</div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => <Chip key={i.id} active={interest.includes(i.id)} onClick={() => setInterest(interest.includes(i.id) ? interest.filter((x) => x !== i.id) : [...interest, i.id])}>{i.emoji} {i.label}</Chip>)}
            </div>
          </div>
          <div>
            <div className="label">Languages</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LANGUAGES).map(([c, n]) => <Chip key={c} accent active={langs.includes(c)} onClick={() => setLangs(langs.includes(c) ? langs.filter((x) => x !== c) : [...langs, c])}>{n}</Chip>)}
            </div>
          </div>
          <div>
            <div className="label">Country of origin</div>
            <div className="flex flex-wrap gap-2">
              <Chip active={country === 'all'} onClick={() => setCountry('all')}>Any</Chip>
              {[...new Set(users.map((u) => u.country))].map((c) => <Chip key={c} active={country === c} onClick={() => setCountry(c)}><Flag code={c} /> {COUNTRIES[c]}</Chip>)}
            </div>
          </div>
          <div>
            <div className="label">Neighborhood</div>
            <div className="flex flex-wrap gap-2">
              <Chip active={hood === 'all'} onClick={() => setHood('all')}>Anywhere</Chip>
              {NEIGHBORHOODS.map((n) => <Chip key={n} active={hood === n} onClick={() => setHood(n)}>{n}</Chip>)}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-ghost flex-1" onClick={reset}>Reset</button>
            <button className="btn-dark flex-1" onClick={() => setOpen(false)}>Show {list.length} people</button>
          </div>
        </div>
      </Sheet>
    </>
  )
}

function ChatList() {
  const { chats, me, events, jobs, t, typing } = useApp()
  const [f, setF] = useState('all')
  const list = chats.filter((c) => f === 'all' || c.type === (f === 'groups' ? 'group' : 'private'))
  return (
    <>
      <ChipRow className="py-4">
        {[['all', t('All')], ['groups', t('Groups')], ['private', t('Private')]].map(([id, l]) => <Chip key={id} active={f === id} onClick={() => setF(id)}>{l}</Chip>)}
      </ChipRow>
      {list.length === 0 && <EmptyState emoji="💬" title="No chats yet" text="Say hi to someone in People — conversations show up here." />}
      <div>
        {list.map((c) => {
          const m = chatMeta(c, { me, events, jobs })
          const last = c.messages[c.messages.length - 1]
          const sender = last && last.from !== 'me' && m.group ? senderMeta(last.from, c, { me, events, jobs }).name?.split(' ')[0] + ': ' : last?.from === 'me' ? 'You: ' : ''
          return (
            <Link key={c.id} to={`/chat/${c.id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-950">
              {m.photo ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                  <Img src={m.avatar} w={150} className="h-full w-full" />
                  <span className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-ink-900 dark:bg-black dark:text-white"><Users className="h-3 w-3" /></span>
                </div>
              ) : (
                <Avatar src={m.avatar} emoji={m.emoji} size={56} flag={m.flag} />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cx('truncate text-[15px]', c.unread ? 'font-bold' : 'font-semibold')}>{m.title}</span>
                  <span className={cx('shrink-0 text-xs', c.unread ? 'font-semibold text-accent' : 'text-neutral-400')}>{last?.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cx('truncate text-sm', c.unread ? 'font-medium text-ink-900 dark:text-white' : 'text-neutral-500')}>
                    {typing[c.id] ? <span className="text-accent">typing…</span> : last ? `${sender}${last.attachment ? '📎 ' : ''}${last.text}` : m.subtitle}
                  </span>
                  {c.unread > 0 && <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">{c.unread}</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export function ChatPage() {
  const { id } = useParams()
  const { chats, me, events, jobs, sendMessage, markChatRead, typing, showToast } = useApp()
  const [text, setText] = useState('')
  const endRef = useRef()
  const fileRef = useRef()
  const chat = chats.find((c) => c.id === id)
  useEffect(() => {
    if (chat?.unread) markChatRead(id)
  }, [id, chat?.unread]) // eslint-disable-line
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chat?.messages.length, typing[id]]) // eslint-disable-line
  if (!chat) return <EmptyState emoji="💬" title="Chat not found" />
  const ctx = { me, events, jobs }
  const m = chatMeta(chat, ctx)
  const send = () => {
    if (!text.trim()) return
    sendMessage(chat.id, text.trim())
    setText('')
  }
  const typer = typing[id] && senderMeta(typing[id], chat, ctx)

  return (
    <div className="flex h-full min-h-full flex-col md:mx-auto md:max-w-3xl md:border-x divider" style={{ height: '100%' }}>
      <PageHeader
        title={
          <Link to={m.link || '#'} className="flex items-center gap-2.5">
            {m.photo ? <Img src={m.avatar} w={100} className="h-9 w-9 rounded-xl" /> : <Avatar src={m.avatar} emoji={m.emoji} size={36} />}
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold leading-tight">{m.title}</span>
              <span className="muted block truncate text-xs font-normal">{typer ? 'typing…' : m.subtitle}</span>
            </span>
          </Link>
        }
        right={
          <Link to={m.link || '#'} className="icon-btn" aria-label="Info">
            <Info className="h-5 w-5" />
          </Link>
        }
      />
      <div className="flex-1 space-y-1 px-3 py-4">
        <div className="muted mb-4 text-center text-xs">
          {m.group ? '🔒 Group chat · be kind and helpful' : '🔒 Messages are private between you two'}
        </div>
        {chat.messages.map((msg, i) => {
          const mine = msg.from === 'me'
          const prev = chat.messages[i - 1]
          const first = !prev || prev.from !== msg.from
          const s = !mine && senderMeta(msg.from, chat, ctx)
          return (
            <div key={msg.id} className={cx('flex items-end gap-2 animate-fade-up', mine ? 'justify-end' : 'justify-start', first && 'pt-2')}>
              {!mine && <div className="w-7 shrink-0">{first && <Avatar src={s.avatar} emoji={s.emoji} size={28} />}</div>}
              <div className={cx('max-w-[78%]')}>
                {!mine && first && m.group && <div className="mb-0.5 ml-3 text-xs font-semibold text-neutral-500">{s.name} {s.flag && <Flag code={s.flag} className="ml-0.5" />}</div>}
                {msg.attachment && (
                  <div className={cx('mb-1 flex items-center gap-2 rounded-2xl px-3 py-2.5', mine ? 'bg-accent-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800')}>
                    <FileText className="h-5 w-5" />
                    <div className="text-sm">
                      <div className="font-semibold">{msg.attachment.name}</div>
                      <div className="text-xs opacity-70">{msg.attachment.size}</div>
                    </div>
                  </div>
                )}
                {msg.text && (
                  <div className={cx('rounded-[20px] px-3.5 py-2 text-[15px] leading-snug', mine ? 'bg-accent text-white' : 'bg-neutral-100 dark:bg-neutral-800', mine ? 'rounded-br-md' : 'rounded-bl-md')}>
                    {msg.text}
                    <span className={cx('ml-2 inline-block translate-y-0.5 text-[10px]', mine ? 'text-white/70' : 'text-neutral-400')}>{msg.time}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {typer && (
          <div className="flex items-end gap-2 pt-2">
            <Avatar src={typer.avatar} emoji={typer.emoji} size={28} />
            <div className="flex gap-1 rounded-[20px] rounded-bl-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
              {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="glass sticky bottom-0 flex items-center gap-2 border-t divider px-3 py-2.5">
        <button className="icon-btn text-neutral-500" onClick={() => fileRef.current.click()} aria-label="Attach">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => {
            const f = e.target.files[0]
            if (f) {
              sendMessage(chat.id, '', { name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB` })
              showToast('File sent', '📎')
            }
            e.target.value = ''
          }}
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Message…"
          className="h-10 flex-1 rounded-full bg-neutral-100 px-4 text-[15px] outline-none dark:bg-neutral-900"
          autoFocus
        />
        <button onClick={send} disabled={!text.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition active:scale-90 disabled:opacity-30" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
