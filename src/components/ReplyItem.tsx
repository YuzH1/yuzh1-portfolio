'use client'

import { useState } from 'react'
import { Send, Trash2, Reply, X } from 'lucide-react'

interface Message {
  id: string
  content: string
  createdAt: string
  user?: {
    id: string
    name: string
    nickname?: string
    avatar?: string
    role: string
  } | null
  guestName?: string | null
  replies?: Message[]
}

interface ReplyItemProps {
  reply: Message
  user: any
  onReply: (msgId: string | null) => void
  isReplyingTo: string | null
  replyContents: Record<string, string>
  onReplyContentChange: (msgId: string, value: string) => void
  onSubmitReply: (e: React.FormEvent, parentId: string) => void
  submitting: boolean
  onDelete: (id: string) => void
  highlightId?: string
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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

export function ReplyItem({
  reply,
  user,
  onReply,
  isReplyingTo,
  replyContents,
  onReplyContentChange,
  onSubmitReply,
  submitting,
  onDelete,
  highlightId,
}: ReplyItemProps) {
  const [showReplyReplies, setShowReplyReplies] = useState(false)
  const replyReplyCount = reply.replies?.length || 0
  
  // 检查是否需要高亮
  const isHighlighted = highlightId === reply.id
  const isReplyingToThisReply = isReplyingTo === reply.id
  const replyInputValue = replyContents[reply.id] || ''

  return (
    <div className="mt-2 ml-10">
      {/* 一级回复 */}
      <div
        id={`message-${reply.id}`}
        className={`flex gap-2 p-2 rounded-lg transition-all duration-500 mb-2 ${
          isHighlighted
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-500 shadow-lg scale-[1.02]'
            : 'bg-gray-100 dark:bg-gray-900/50'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 overflow-hidden">
          {reply.user?.avatar ? (
            <img src={reply.user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            (reply.user?.nickname || reply.user?.name || reply.guestName || '?')[0].toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {reply.user?.nickname || reply.user?.name || reply.guestName}
            </span>
            {reply.user?.role === 'admin' && (
              <span className="tag-admin text-xs">管理员</span>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
            {reply.content}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400">
              {formatRelativeTime(new Date(reply.createdAt))}
            </span>
            {/* 回复按钮 */}
            {user && (
              <button
                onClick={() => onReply(reply.id)}
                className="text-xs text-primary-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                回复
              </button>
            )}
          </div>
          {/* 回复框 */}
          {isReplyingToThisReply && (
            <form onSubmit={(e) => onSubmitReply(e, reply.id)} className="mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyInputValue}
                  onChange={e => onReplyContentChange(reply.id, e.target.value)}
                  placeholder={`@${reply.user?.nickname || reply.user?.name || reply.guestName} 写下你的回复...`}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={submitting || !replyInputValue.trim()}
                  className="px-2 py-1.5 bg-primary-500 text-white rounded text-xs hover:bg-primary-600 disabled:opacity-50"
                >
                  发送
                </button>
                <button
                  type="button"
                  onClick={() => onReply(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>
        {/* 删除按钮（管理员） */}
        {user?.role === 'admin' && (
          <button
            onClick={() => onDelete(reply.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* 二级回复展开/收起按钮 */}
      {replyReplyCount > 0 && (
        <button
          onClick={() => setShowReplyReplies(!showReplyReplies)}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-cyan-400 transition-colors mb-2 ml-10"
        >
          {showReplyReplies ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              收起回复（{replyReplyCount}）
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              收起回复（{replyReplyCount}）
            </>
          )}
        </button>
      )}
      
      {/* 二级回复列表 */}
      {showReplyReplies && reply.replies && reply.replies.length > 0 && (
        <div className="space-y-2 ml-8">
          {reply.replies.map(replyReply => {
            const isReplyingToThisReplyReply = isReplyingTo === replyReply.id
            const replyReplyInputValue = replyContents[replyReply.id] || ''
            const isReplyHighlighted = highlightId === replyReply.id
            return (
              <div
                key={replyReply.id}
                id={`message-${replyReply.id}`}
                className={`flex gap-2 p-2 rounded-lg transition-all duration-500 ${
                  isReplyHighlighted
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-500 shadow-lg scale-[1.02]'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 overflow-hidden">
                  {replyReply.user?.avatar ? (
                    <img src={replyReply.user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (replyReply.user?.nickname || replyReply.user?.name || replyReply.guestName || '?')[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white text-xs">
                      {replyReply.user?.nickname || replyReply.user?.name || replyReply.guestName}
                    </span>
                    {replyReply.user?.role === 'admin' && (
                      <span className="tag-admin text-xs">管理员</span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap">
                    {replyReply.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(new Date(replyReply.createdAt))}
                    </span>
                    {/* 回复按钮 */}
                    {user && (
                      <button
                        onClick={() => onReply(replyReply.id)}
                        className="text-xs text-primary-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Reply className="w-3 h-3" />
                        回复
                      </button>
                    )}
                  </div>
                  {/* 回复框 */}
                  {isReplyingToThisReplyReply && (
                    <form onSubmit={(e) => onSubmitReply(e, replyReply.id)} className="mt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyReplyInputValue}
                          onChange={e => onReplyContentChange(replyReply.id, e.target.value)}
                          placeholder={`@${replyReply.user?.nickname || replyReply.user?.name || replyReply.guestName} 写下你的回复...`}
                          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={submitting || !replyReplyInputValue.trim()}
                          className="px-2 py-1.5 bg-primary-500 text-white rounded text-xs hover:bg-primary-600 disabled:opacity-50"
                        >
                          发送
                        </button>
                        <button
                          type="button"
                          onClick={() => onReply(null)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                {/* 删除按钮（管理员） */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onDelete(replyReply.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
