'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Trash2, MapPin, Reply, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'

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
  replies?: Message[]
}

interface MessageBoardProps {
  projectId?: string
  blogId?: string
  title?: string
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) {
    return formatDateTime(date)
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else if (seconds > 0) {
    return `${seconds}秒前`
  }
  return '刚刚'
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function MessageBoard({ projectId, blogId, title = '留言板' }: MessageBoardProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [showExactTime, setShowExactTime] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContents, setReplyContents] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMessages()
  }, [projectId, blogId])

  const fetchMessages = async () => {
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
  }

  const handleSubmit = async (e: React.FormEvent, isReply = false, parentId?: string) => {
    e.preventDefault()
    const text = isReply ? (replyContents[parentId!] || '') : content
    if (!text.trim()) return
    if (!user && !guestName.trim()) return

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
        // 等待一下再刷新，确保数据库已保存
        setTimeout(() => fetchMessages(), 500)
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

  const MessageItem = ({ msg, isReply = false }: { msg: Message; isReply?: boolean }) => {
    const isReplying = replyingTo === msg.id
    const replyValue = replyContents[msg.id] || ''
    
    return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${isReply ? 'ml-12 mt-2' : ''}`}
    >
      {/* 头像 */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium flex-shrink-0 overflow-hidden">
        {msg.user?.avatar ? (
          <img src={msg.user.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          (msg.user?.nickname || msg.user?.name || msg.guestName || '?')[0].toUpperCase()
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {msg.user?.nickname || msg.user?.name || msg.guestName}
          </span>
          
          {/* 角色标签 */}
          {msg.user?.role === 'admin' ? (
            <span className="tag-admin">管理员</span>
          ) : msg.user ? (
            <span className="tag-user">用户</span>
          ) : (
            <span className="tag-guest">游客</span>
          )}
          
          {/* IP 属地 - 如果有 location 或 ip 就显示 */}
          {(msg.location || msg.ip) && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded">
              <MapPin className="w-3 h-3" />
              {msg.location || msg.ip}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-1">
          {msg.content}
        </p>
        
        {/* 时间和操作 */}
        <div className="flex items-center gap-3">
          <div 
            className="text-xs text-gray-400 cursor-pointer hover:text-gray-500"
            onClick={() => setShowExactTime(showExactTime === msg.id ? null : msg.id)}
          >
            {showExactTime === msg.id 
              ? formatDateTime(new Date(msg.createdAt))
              : formatRelativeTime(new Date(msg.createdAt))
            }
          </div>
          
          {/* 回复按钮 */}
          {!isReply && user && (
            <button
              onClick={() => setReplyingTo(isReplying ? null : msg.id)}
              className="text-xs text-primary-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Reply className="w-3 h-3" />
              回复
            </button>
          )}
        </div>

        {/* 回复框 */}
        {isReplying && !isReply && (
          <form onSubmit={(e) => handleSubmit(e, true, msg.id)} className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyValue}
                onChange={e => setReplyContents(prev => ({ ...prev, [msg.id]: e.target.value }))}
                placeholder="写下你的回复..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                disabled={submitting || !replyValue.trim()}
                className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 disabled:opacity-50"
              >
                发送
              </button>
              <button
                type="button"
                onClick={() => { setReplyingTo(null); setReplyContents(prev => { const next = { ...prev }; delete next[msg.id]; return next }) }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 子回复 */}
        {msg.replies && msg.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.replies.map(reply => (
              <MessageItem key={reply.id} msg={reply} isReply />
            ))}
          </div>
        )}
      </div>

      {/* 删除按钮（管理员） */}
      {user?.role === 'admin' && (
        <button
          onClick={() => handleDelete(msg.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )}

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
          messages.map(msg => <MessageItem key={msg.id} msg={msg} />)
        )}
      </div>
    </div>
  )
}