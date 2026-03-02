'use client'

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

interface MessageItemProps {
  msg: Message
  isReply?: boolean
  user: any
  onReply: (msgId: string | null) => void
  isReplyingTo: string | null
  replyContents: Record<string, string>
  onReplyContentChange: (msgId: string, value: string) => void
  onSubmitReply: (e: React.FormEvent, parentId: string) => void
  submitting: boolean
  onDelete: (id: string) => void
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

export function MessageItem({
  msg,
  isReply = false,
  user,
  onReply,
  isReplyingTo,
  replyContents,
  onReplyContentChange,
  onSubmitReply,
  submitting,
  onDelete,
}: MessageItemProps) {
  const isReplying = isReplyingTo === msg.id
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
          
          {/* IP 属地 */}
          {msg.location && msg.location !== '未知' && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded">
              <MapPin className="w-3 h-3" />
              {msg.location}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-1">
          {msg.content}
        </p>
        
        {/* 时间和操作 */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {formatRelativeTime(new Date(msg.createdAt))}
          </span>
          
          {/* 回复按钮 - 所有留言都可以回复 */}
          {user && (
            <button
              onClick={() => onReply(msg.id)}
              className="text-xs text-primary-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Reply className="w-3 h-3" />
              回复
            </button>
          )}
        </div>

        {/* 回复框 */}
        {isReplying && (
          <form onSubmit={(e) => onSubmitReply(e, msg.id)} className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyValue}
                onChange={e => onReplyContentChange(msg.id, e.target.value)}
                placeholder={`@${msg.user?.nickname || msg.user?.name || msg.guestName} 写下你的回复...`}
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
                onClick={() => onReply(null)}
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
              <MessageItem
                key={reply.id}
                msg={reply}
                isReply
                user={user}
                onReply={onReply}
                isReplyingTo={isReplyingTo}
                replyContents={replyContents}
                onReplyContentChange={onReplyContentChange}
                onSubmitReply={onSubmitReply}
                submitting={submitting}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 删除按钮（管理员） */}
      {user?.role === 'admin' && (
        <button
          onClick={() => onDelete(msg.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}
