import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImagePlus, MapPin, MessageCircle, Plus, Users, HelpCircle, Share2 } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, AvatarStack, EmptyState, Flag, Img, LangBadges, PageHeader, Tabs, FloatingBack, RoundBtn } from '../components/ui'
import { CommunityCircle, CommunityRow, JoinButton, PostCard } from '../components/cards'
import { communities, communityById } from '../data/social'
import { userById } from '../data/users'
import { cx, fmtNum, matchScore, sortByMatch } from '../lib/utils'
import { getUser } from '../lib/entities'

export function ComposerPrompt({ communityId }) {
  const { me, setComposer, t } = useApp()
  return (
    <div className="flex items-center gap-3 border-b divider px-4 py-3">
      <Avatar src={me?.avatar} size={40} />
      <button onClick={() => setComposer({ type: 'post', communityId })} className="flex-1 text-left text-[15px] text-neutral-400">
        {t('What’s new?')}
      </button>
      <button onClick={() => setComposer({ type: 'post', communityId })} className="icon-btn text-neutral-400" aria-label="Add photo">
        <ImagePlus className="h-5 w-5" />
      </button>
      <button onClick={() => setComposer({ type: 'question', communityId })} className="icon-btn text-neutral-400" aria-label="Ask">
        <HelpCircle className="h-5 w-5" />
      </button>
      <button onClick={() => setComposer({ type: 'post', communityId })} className="btn-dark !py-1.5 !px-4 text-sm">
        {t('Post')}
      </button>
    </div>
  )
}

export default function Community() {
  const { me, posts, following, joinedCommunities, t, setComposer } = useApp()
  const [tab, setTab] = useState('foryou')

  const feed = useMemo(() => {
    switch (tab) {
      case 'following':
        return posts.filter((p) => following.has(p.authorId) || p.authorId === 'me')
      case 'mine':
        return posts.filter((p) => p.communityId && joinedCommunities.has(p.communityId))
      case 'questions':
        return posts.filter((p) => p.type === 'question')
      default: {
        // personalised: score by author language/country/interest match + recency
        const scored = posts.map((p, i) => {
          const a = getUser(p.authorId, me) || {}
          const s = p.authorId === 'me' ? 999 : matchScore({ languages: [...(a.languages || []), p.lang], tags: a.interests, country: a.country }, me) * 1.5 - i * 0.6 + Math.log10(p.likes + 1)
          return [p, s]
        })
        return scored.sort((a, b) => b[1] - a[1]).map((x) => x[0])
      }
    }
  }, [tab, posts, following, joinedCommunities, me])

  const sortedCommunities = sortByMatch(communities, me).sort((a, b) => (joinedCommunities.has(b.id) ? 1 : 0) - (joinedCommunities.has(a.id) ? 1 : 0))

  return (
    <div className="mx-auto max-w-2xl md:border-x divider min-h-full">
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 pt-4">
        <button onClick={() => setComposer({ type: 'post' })} className="flex w-[76px] shrink-0 flex-col items-center gap-1.5">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-[11px] font-medium">New post</span>
        </button>
        {sortedCommunities.map((c) => (
          <CommunityCircle key={c.id} c={c} joined={joinedCommunities.has(c.id)} />
        ))}
      </div>
      <Tabs
        className="sticky top-0 z-20 glass"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'foryou', label: t('For you') },
          { id: 'following', label: t('Following') },
          { id: 'mine', label: t('My communities') },
          { id: 'questions', label: t('Questions') },
        ]}
      />
      <ComposerPrompt />
      {tab === 'mine' && joinedCommunities.size === 0 ? (
        <EmptyState emoji="👥" title="No communities yet" text="Join a community to see its posts here." />
      ) : feed.length === 0 ? (
        <EmptyState emoji="🫶" title="Nothing here yet" text="Follow people or join communities to fill your feed." />
      ) : (
        <>
          {feed.map((p, i) => (
            <div key={p.id}>
              <PostCard post={p} />
              {i === 3 && tab === 'foryou' && <SuggestedCommunities />}
            </div>
          ))}
          <div className="muted py-10 text-center text-sm">You’re all caught up ✨</div>
        </>
      )}
    </div>
  )
}

function SuggestedCommunities() {
  const { me, joinedCommunities } = useApp()
  const list = sortByMatch(communities, me).filter((c) => !joinedCommunities.has(c.id)).slice(0, 3)
  if (!list.length) return null
  return (
    <div className="border-b divider py-3">
      <div className="px-4 pb-1 text-sm font-bold">Communities for you</div>
      {list.map((c) => (
        <CommunityRow key={c.id} c={c} />
      ))}
    </div>
  )
}

export function CommunityPage() {
  const { id } = useParams()
  const c = communityById[id]
  const { posts, joinedCommunities, toggleCommunity, findOrCreateChat, showToast, me } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('feed')
  if (!c) return <EmptyState emoji="🤷" title="Community not found" />
  const joined = joinedCommunities.has(c.id)
  const feed = posts.filter((p) => p.communityId === c.id)
  const members = [...(joined ? ['me'] : []), ...c.memberSample]

  return (
    <div className="mx-auto max-w-2xl min-h-full md:border-x divider">
      <div className="relative">
        <Img src={c.cover} w={1200} className="h-44 w-full md:h-56" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <FloatingBack right={<RoundBtn label="Share" onClick={() => showToast('Invite link copied', '🔗')}><Share2 className="h-4 w-4" /></RoundBtn>} />
      </div>
      <div className="px-4">
        <div className="-mt-10 flex items-end justify-between">
          <div className="relative h-20 w-20 overflow-hidden rounded-3xl ring-4 ring-white dark:ring-black">
            <Img src={c.avatar} w={200} className="h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-3xl">{c.emoji}</span>
          </div>
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => nav(`/chat/${findOrCreateChat({ kind: 'community', refId: c.id, type: 'group' })}`)}
              className="btn-ghost !px-3"
              aria-label="Group chat"
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
            <JoinButton joined={joined} onClick={() => toggleCommunity(c.id)} />
          </div>
        </div>
        <h1 className="mt-3 flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          {c.name} {c.country && <Flag code={c.country} className="!h-4 !w-6" />}
        </h1>
        {c.nativeName && <div className="muted text-sm">{c.nativeName}</div>}
        <p className="mt-2 text-[15px] leading-relaxed">{c.description}</p>
        <div className="mt-3 flex items-center gap-3">
          <AvatarStack ids={members} resolve={(x) => getUser(x, me)} size={28} max={5} />
          <span className="text-sm font-semibold">{fmtNum(c.members + (joined ? 1 : 0))} members</span>
          <LangBadges langs={c.languages} />
        </div>
      </div>
      <Tabs className="mt-4" value={tab} onChange={setTab} tabs={[{ id: 'feed', label: 'Feed' }, { id: 'members', label: 'Members' }, { id: 'about', label: 'About' }]} />
      {tab === 'feed' && (
        <>
          {joined && <ComposerPrompt communityId={c.id} />}
          {feed.length ? feed.map((p) => <PostCard key={p.id} post={p} />) : <EmptyState emoji="✍️" title="No posts yet" text="Be the first to start a conversation." />}
        </>
      )}
      {tab === 'members' && (
        <div className="py-2">
          {members.map((uid) => {
            const u = getUser(uid, me)
            return (
              <button key={uid} onClick={() => nav(uid === 'me' ? '/profile' : `/u/${uid}`)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <Avatar src={u.avatar} size={44} flag={u.country} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">
                    {u.name} {c.admins.includes(uid) && <span className="ml-1 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-700 dark:bg-accent/20 dark:text-accent-200">ADMIN</span>}
                  </div>
                  <div className="muted text-xs">{u.neighborhood}</div>
                </div>
                <LangBadges langs={u.languages} max={3} />
              </button>
            )
          })}
          <div className="muted px-4 py-4 text-center text-sm">+ {fmtNum(c.members - members.length)} more members</div>
        </div>
      )}
      {tab === 'about' && (
        <div className="space-y-4 p-4 text-[15px]">
          <div>
            <div className="label">Rules</div>
            <ul className="muted list-inside list-disc space-y-1">
              <li>Be kind — everyone was new once.</li>
              <li>No spam or unsolicited ads (use Services for that).</li>
              <li>Questions are welcome in any language.</li>
            </ul>
          </div>
          <div>
            <div className="label">Admins</div>
            <div className="flex gap-3">
              {c.admins.map((a) => (
                <button key={a} onClick={() => nav(`/u/${a}`)} className="flex items-center gap-2">
                  <Avatar src={userById[a].avatar} size={32} />
                  <span className="text-sm font-semibold">{userById[a].name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="muted flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" /> Usually meets around {c.id === 'c1' ? 'Vračar' : c.id === 'c5' || c.id === 'c7' ? 'Zemun' : 'Dorćol'}
          </div>
        </div>
      )}
    </div>
  )
}

export function CommunitiesList() {
  const { me } = useApp()
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="All communities" />
      {sortByMatch(communities, me).map((c) => (
        <CommunityRow key={c.id} c={c} />
      ))}
    </div>
  )
}
