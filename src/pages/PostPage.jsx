import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar, EmptyState, Flag, PageHeader } from '../components/ui'
import { PostCard } from '../components/cards'
import { getUser } from '../lib/entities'
import { timeAgo } from '../lib/utils'

export default function PostPage() {
  const { id } = useParams()
  const { posts, me, addComment } = useApp()
  const [text, setText] = useState('')
  const post = posts.find((p) => p.id === id)
  if (!post) return <EmptyState emoji="🤷" title="Post not found" />
  const submit = () => {
    if (!text.trim()) return
    addComment(post.id, text.trim())
    setText('')
  }
  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col md:border-x divider">
      <PageHeader title={post.type === 'question' ? 'Question' : 'Thread'} />
      <PostCard post={post} />
      <div className="flex-1">
        {post.comments.length === 0 && <EmptyState emoji="💬" title="No replies yet" text={post.type === 'question' ? 'Know the answer? Help a newcomer out!' : 'Start the conversation.'} />}
        {post.comments.map((c, i) => {
          const u = getUser(c.userId, me)
          return (
            <div key={i} className="flex gap-3 border-b divider px-4 py-3.5 animate-fade-up">
              <Link to={c.userId === 'me' ? '/profile' : `/u/${c.userId}`}>
                <Avatar src={u.avatar} size={34} />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-semibold">{u.name}</span>
                  <Flag code={u.country} />
                  <span className="muted">· {timeAgo(c.time)}</span>
                </div>
                <p className="mt-0.5 text-[15px] leading-relaxed">{c.text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="glass sticky bottom-0 flex items-center gap-2 border-t divider px-3 py-2.5">
        <Avatar src={me?.avatar} size={32} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={`Reply to ${getUser(post.authorId, me)?.name.split(' ')[0]}…`}
          className="h-10 flex-1 rounded-full bg-neutral-100 px-4 text-[15px] outline-none dark:bg-neutral-900"
        />
        <button onClick={submit} disabled={!text.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition active:scale-90 disabled:opacity-30" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
