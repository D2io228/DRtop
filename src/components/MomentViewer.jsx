import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Eye, Heart, MapPin, Send, X, Play } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Flag, Img } from './ui'
import { userById } from '../data/users'
import { placeById } from '../data/places'
import { cx, fmtNum } from '../lib/utils'

const DURATION = 5000

export default function MomentViewer({ list, index, onClose }) {
  const [i, setI] = useState(index)
  const [paused, setPaused] = useState(false)
  const [liked, setLiked] = useState({})
  const [reply, setReply] = useState('')
  const nav = useNavigate()
  const { findOrCreateChat, showToast } = useApp()
  const m = list[i]

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => (i < list.length - 1 ? setI(i + 1) : onClose()), DURATION)
    return () => clearTimeout(t)
  }, [i, paused]) // eslint-disable-line

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, list.length - 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, []) // eslint-disable-line

  if (!m) return null
  const u = userById[m.userId]
  const p = m.placeId ? placeById[m.placeId] : null

  const send = () => {
    if (!reply.trim()) return
    findOrCreateChat({ kind: 'user', refId: u.id, intro: `Replied to your moment: ${reply.trim()}` })
    setReply('')
    showToast('Reply sent', '💬')
  }

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black animate-fade-in">
      <div className="relative h-full w-full overflow-hidden md:h-[92vh] md:max-w-[440px] md:rounded-3xl">
        <Img key={m.id} src={m.photo} w={1000} className={cx('h-full w-full animate-fade-in', m.type === 'video' && 'scale-105 transition-transform duration-[5000ms]')} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* progress bars */}
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {list.map((x, j) => (
            <div key={x.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                key={`${i}-${j}`}
                className="h-full bg-white"
                style={{
                  width: j < i ? '100%' : j > i ? '0%' : undefined,
                  animation: j === i ? `progress ${DURATION}ms linear forwards` : 'none',
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-7 flex items-center gap-2.5 text-white">
          <Avatar src={u.avatar} size={36} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              {u.name} <Flag code={u.country} /> <span className="font-normal text-white/60">{m.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3 w-3" /> {p?.name || m.placeName}
            </div>
          </div>
          {m.type === 'video' && <Play className="h-5 w-5 fill-white" />}
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* tap zones */}
        <button className="absolute bottom-32 left-0 top-20 w-1/3" onClick={() => setI(Math.max(0, i - 1))} onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} aria-label="Previous" />
        <button className="absolute bottom-32 right-0 top-20 w-2/3" onClick={() => (i < list.length - 1 ? setI(i + 1) : onClose())} onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} aria-label="Next" />

        <div className="absolute inset-x-0 bottom-0 p-4 text-white pb-safe">
          <p className="text-[17px] font-semibold leading-snug">{m.caption}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {fmtNum(m.views)} views
            </span>
            {p && (
              <button onClick={() => (onClose(), nav(`/place/${p.id}`))} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-white/30">
                {p.logo} Visit {p.name} →
              </button>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={`Reply to ${u.name.split(' ')[0]}…`}
              className="h-11 flex-1 rounded-full border border-white/40 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/60"
            />
            <button onClick={() => setLiked((l) => ({ ...l, [m.id]: !l[m.id] }))} className="flex h-11 w-11 items-center justify-center" aria-label="Like">
              <Heart className={cx('h-7 w-7 transition', liked[m.id] && 'scale-110 fill-rose-500 text-rose-500 animate-like-bump')} />
            </button>
            <button onClick={send} className="flex h-11 w-11 items-center justify-center" aria-label="Send">
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
