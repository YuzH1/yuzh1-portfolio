'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { MessageItem } from './MessageItem'

interface Message {
  id: string
  content: string
  createdAt: string
  ip?: string | null
  location?: string | null
  user?: {
    id: string
    name: string
    nickname?: string
    avatar?: string
    role: string
  } | null
  guestName?: string | null
  guestEmail?: string | null
  replies?: Message[]  // 只有一层回复
}

interface MessageBoardProps {
  projectId?: string
  blogId?: string
  title?: string
  highlightId?: string  // 要高亮的留言 ID
}

export function MessageBoard({ projectId, blogId, title = '留言板', highlightId }: MessageBoardProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContents, setReplyContents] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMessages()
  }, [projectId, blogId])

  const fetchMessages = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (projectId) params.set('projectId', projectId)
      if (blogId) params.set('blogId', blogId)

      const res = await fetch(`/api/messages?${params}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [projectId, blogId])

  const handleSubmit = async (e: React.FormEvent, isReply = false, parentId?: string) => {
    e.preventDefault()
    let text = isReply ? (replyContents[parentId!] || '') : content
    if (!text.trim()) return
    if (!user && !guestName.trim()) return

    // 如果是回复，自动添加@提及
    if (isReply && parentId) {
      const parentMsg = messages.flatMap(m => [m, ...(m.replies || [])]).find(m => m.id === parentId)
      if (parentMsg) {
        const parentName = parentMsg.user?.nickname || parentMsg.user?.name || parentMsg.guestName || '对方'
        if (!text.startsWith(`@${parentName}`)) {
          text = `@${parentName} ${text}`
        }
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          guestName: user ? null : guestName,
          projectId: projectId || null,
          blogId: blogId || null,
          parentId: parentId || null,
        }),
      })

      if (res.ok) {
        if (isReply && parentId) {
          setReplyContents(prev => {
            const next = { ...prev }
            delete next[parentId]
            return next
          })
          setReplyingTo(null)
        } else {
          setContent('')
          setGuestName('')
        }
        // 等待数据库保存后刷新
        setTimeout(() => fetchMessages(), 300)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条留言？')) return
    try {
      await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
      fetchMessages()
    } catch {}
  }

  const handleReply = useCallback((msgId: string | null) => {
    setReplyingTo(msgId)
  }, [])

  const handleReplyContentChange = useCallback((msgId: string, value: string) => {
    setReplyContents(prev => ({ ...prev, [msgId]: value }))
  }, [])

  const handleSubmitReply = useCallback((e: React.FormEvent, parentId: string) => {
    handleSubmit(e, true, parentId)
  }, [replyContents, submitting])

  return (
    <div className="bg-white dark:bg-gray-900 dark:border dark:border-cyan-500/30 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-500 dark:text-cyan-400" />
        {title}
        <span className="text-sm font-normal text-gray-500">({messages.length})</span>
      </h3>

      {/* 留言表单 */}
      <form onSubmit={(e) => handleSubmit(e)} className="mb-6">
        {!user && (
          <input
            type="text"
            required
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            placeholder="你的名字"
            className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        )}
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={user ? "写下你的留言..." : "写下你的留言..."}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none text-sm"
            rows={2}
          />
          <button
            type="submit"
            disabled={submitting || !content.trim() || (!user && !guestName.trim())}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* 留言列表 */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary-500 dark:border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            还没有留言，来抢个沙发吧~
          </p>
        ) : (
          messages.map(msg => (
            <MessageItem
              key={msg.id}
              msg={msg}
              user={user}
              onReply={handleReply}
              isReplyingTo={replyingTo}
              replyContents={replyContents}
              onReplyContentChange={handleReplyContentChange}
              onSubmitReply={handleSubmitReply}
              submitting={submitting}
              onDelete={handleDelete}
              highlightId={highlightId}
            />
          ))
        )}
      </div>
    </div>
  )
}
