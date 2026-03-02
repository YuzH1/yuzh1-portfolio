'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, MessageCircle } from 'lucide-react'

interface MessageDetail {
  id: string
  content: string
  createdAt: string
  location?: string | null
  user?: {
    id: string
    name: string
    nickname?: string
    avatar?: string
    role: string
  } | null
  guestName?: string | null
  replies?: MessageDetail[]
}

interface MessageDetailModalProps {
  messageId: string
  onClose: () => void
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function MessageDetailModal({ messageId, onClose }: MessageDetailModalProps) {
  const [message, setMessage] = useState<MessageDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取留言详情
    const fetchMessage = async () => {
      try {
        // 这里需要根据实际情况调整 API
        const res = await fetch(`/api/messages/${messageId}`)
        if (res.ok) {
          const data = await res.json()
          setMessage(data)
        }
      } catch (error) {
        console.error('Fetch message error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()

    // 点击 ESC 关闭
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [messageId, onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* 弹窗内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-500 dark:text-cyan-400" />
              留言详情
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : message ? (
              <div className="space-y-4">
                {/* 留言内容 */}
                <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {message.user?.avatar ? (
                      <img src={message.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      (message.user?.nickname || message.user?.name || message.guestName || '?')[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {message.user?.nickname || message.user?.name || message.guestName}
                      </span>
                      {message.user?.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                          管理员
                        </span>
                      )}
                      {message.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {message.location}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDateTime(new Date(message.createdAt))}
                    </p>
                  </div>
                </div>

                {/* 回复列表 */}
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      回复（{message.replies.length}）
                    </h4>
                    <div className="space-y-2">
                      {message.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {reply.user?.avatar ? (
                              <img src={reply.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              (reply.user?.nickname || reply.user?.name || reply.guestName || '?')[0].toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {reply.user?.nickname || reply.user?.name || reply.guestName}
                              </span>
                              {reply.user?.role === 'admin' && (
                                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                                  管理员
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                              {reply.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateTime(new Date(reply.createdAt))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>留言不存在或已被删除</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
