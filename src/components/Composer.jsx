import { useEffect, useRef, useState } from 'react'
import { ImagePlus, MapPin, Users, X, Search } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, Flag, Img, Sheet } from './ui'
import { POST_TYPES } from '../data/meta'
import { places } from '../data/places'
import { communities } from '../data/social'
import { cx } from '../lib/utils'

const SAMPLE_PHOTOS = ['coffee', 'city', 'streetCafe', 'tree', 'friendsGroup', 'foodSpread']

const PLACEHOLDER = {
  post: 'What’s new?',
  question: 'Ask anything — the community will help 🙌',
  recommendation: 'Recommend a place, a specialist, a hack…',
  guide: 'Share what you’ve learned, step by step…',
}

export default function Composer() {
  const { composer, setComposer, me, addPost, joinedCommunities } = useApp()
  const [type, setType] = useState('post')
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState([])
  const [placeId, setPlaceId] = useState(null)
  const [communityId, setCommunityId] = useState(null)
  const [picker, setPicker] = useState(null) // 'place' | 'community' | 'photo'
  const [q, setQ] = useState('')
  const fileRef = useRef()
  const taRef = useRef()

  useEffect(() => {
    if (composer) {
      setType(composer.type || 'post')
      setText(composer.text || '')
      setPhotos([])
      setPlaceId(composer.placeId || null)
      setCommunityId(composer.communityId || null)
      setPicker(null)
      setTimeout(() => taRef.current?.focus(), 250)
    }
  }, [composer])

  if (!composer || !me) return null
  const close = () => setComposer(null)
  const place = places.find((p) => p.id === placeId)
  const community = communities.find((c) => c.id === communityId)

  const onFiles = (e) => {
    const files = [...e.target.files].slice(0, 4 - photos.length)
    setPhotos((p) => [...p, ...files.map((f) => URL.createObjectURL(f))])
    e.target.value = ''
  }

  const publish = () => {
    addPost({ type, text: text.trim(), photos, placeId, communityId })
    close()
  }

  return (
    <Sheet open onClose={close} title="New post">
      <div className="px-5 pb-5">
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {POST_TYPES.map((pt) => (
            <button key={pt.id} onClick={() => setType(pt.id)} className={cx('chip', type === pt.id && 'chip-active')}>
              {pt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Avatar src={me.avatar} size={40} flag={me.country} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[15px] font-semibold">
              {me.name} <Flag code={me.country} />
            </div>
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={PLACEHOLDER[type]}
              className="mt-1 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-neutral-400"
            />
            {photos.length > 0 && (
              <div className="no-scrollbar -mr-5 mt-2 flex gap-2 overflow-x-auto pr-5">
                {photos.map((p, i) => (
                  <div key={i} className="relative shrink-0">
                    <Img src={p} w={300} className="h-36 w-28 rounded-2xl" />
                    <button onClick={() => setPhotos((ph) => ph.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {place && (
                <span className="chip !py-1 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> {place.name}
                  <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => setPlaceId(null)} />
                </span>
              )}
              {community && (
                <span className="chip !py-1 text-xs">
                  {community.emoji} {community.name}
                  <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => setCommunityId(null)} />
                </span>
              )}
            </div>
          </div>
        </div>

        {picker === 'photo' && (
          <div className="mt-4 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              Add photos
              <button className="text-accent" onClick={() => fileRef.current.click()}>
                Upload from device
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {SAMPLE_PHOTOS.map((p) => (
                <button key={p} onClick={() => photos.length < 4 && setPhotos((ph) => [...ph, p])} className="transition active:scale-90">
                  <Img src={p} w={160} className="aspect-square w-full rounded-xl" />
                </button>
              ))}
            </div>
          </div>
        )}
        {picker === 'place' && (
          <div className="mt-4 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2 dark:bg-ink-800">
              <Search className="h-4 w-4 text-neutral-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tag a place…" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {places
                .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
                .map((p) => (
                  <button key={p.id} onClick={() => (setPlaceId(p.id), setPicker(null), setQ(''))} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white dark:hover:bg-ink-800">
                    <span className="text-xl">{p.logo}</span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.name}</div>
                      <div className="muted truncate text-xs">
                        {p.category} · {p.neighborhood}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
        {picker === 'community' && (
          <div className="mt-4 rounded-2xl bg-neutral-50 p-2 dark:bg-neutral-900">
            {communities.map((c) => (
              <button key={c.id} onClick={() => (setCommunityId(c.id), setPicker(null))} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white dark:hover:bg-ink-800">
                <span className="text-xl">{c.emoji}</span>
                <span className="flex-1 text-sm font-semibold">{c.name}</span>
                {joinedCommunities.has(c.id) && <span className="text-xs text-accent">Joined</span>}
              </button>
            ))}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
        <div className="mt-4 flex items-center gap-1 border-t divider pt-3">
          <button className={cx('icon-btn', picker === 'photo' && 'bg-neutral-100 dark:bg-neutral-800')} onClick={() => setPicker(picker === 'photo' ? null : 'photo')} aria-label="Add photo">
            <ImagePlus className="h-5 w-5" />
          </button>
          <button className={cx('icon-btn', picker === 'place' && 'bg-neutral-100 dark:bg-neutral-800')} onClick={() => setPicker(picker === 'place' ? null : 'place')} aria-label="Tag place">
            <MapPin className="h-5 w-5" />
          </button>
          <button className={cx('icon-btn', picker === 'community' && 'bg-neutral-100 dark:bg-neutral-800')} onClick={() => setPicker(picker === 'community' ? null : 'community')} aria-label="Post to community">
            <Users className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <span className="muted mr-2 text-xs">{text.length}/500</span>
          <button disabled={!text.trim() && photos.length === 0} onClick={publish} className="btn-dark px-5">
            {type === 'question' ? 'Ask' : 'Post'}
          </button>
        </div>
      </div>
    </Sheet>
  )
}
