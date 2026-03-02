'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, MessageCircle, LogOut } from 'lucide-react'

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
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Fetching message:', messageId)
    
    // 获取留言详情
    const fetchMessage = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/messages/${messageId}`)
        console.log('Response status:', res.status)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        console.log('Message data:', data)
        setMessage(data)
      } catch (error: any) {
        console.error('Fetch message error:', error)
        setError(error.message || '获取留言失败')
      } finally {
        setLoading(false)
      }
    }

    if (messageId) {
      fetchMessage()
    }

    // 点击 ESC 关闭
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleRequestClose()
    }
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [messageId])

  const handleRequestClose = () => {
    setShowConfirm(true)
  }

  const handleClose = () => {
    setShowConfirm(false)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleRequestClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* 弹窗内容 - 使用绝对定位确保居中 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            style={{ 
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500/10 to-accent-500/10 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary-500 dark:text-cyan-400" />
                留言详情
              </h3>
              <button
                onClick={handleRequestClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* 内容区域 - 可滚动 */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">正在加载留言...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-red-500 dark:text-red-400">
                  <X className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">加载失败</p>
                  <p className="text-sm mt-2 opacity-70">{error}</p>
                </div>
              ) : message ? (
                <div className="space-y-6">
                  {/* 留言内容 */}
                  <div className="flex gap-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      {message.user?.avatar ? (
                        <img src={message.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        (message.user?.nickname || message.user?.name || message.guestName || '?')[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white text-base">
                          {message.user?.nickname || message.user?.name || message.guestName}
                        </span>
                        {message.user?.role === 'admin' && (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-sm">
                            管理员
                          </span>
                        )}
                        {message.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {message.location}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        发表于 {formatDateTime(new Date(message.createdAt))}
                      </p>
                    </div>
                  </div>

                  {/* 回复列表 */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary-500 dark:text-cyan-400" />
                        全部回复
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-cyan-900/30 text-primary-600 dark:text-cyan-400 text-xs rounded-full font-medium">
                          {message.replies.length}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {message.replies.map((reply, index) => (
                          <div
                            key={reply.id}
                            className={`flex gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                              index === 0
                                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow">
                              {reply.user?.avatar ? (
                                <img src={reply.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                (reply.user?.nickname || reply.user?.name || reply.guestName || '?')[0].toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {reply.user?.nickname || reply.user?.name || reply.guestName}
                                </span>
                                {reply.user?.role === 'admin' && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full">
                                    管理员
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                {reply.content}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {formatDateTime(new Date(reply.createdAt))}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 无回复提示 */}
                  {(!message.replies || message.replies.length === 0) && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-14 h-14 mx-auto mb-4 opacity-20" />
                      <p className="text-base font-medium">暂无回复</p>
                      <p className="text-sm mt-2 opacity-70">快来抢沙发吧~</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">留言不存在</p>
                  <p className="text-sm mt-2 opacity-70">该留言可能已被删除</p>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <button
                onClick={handleRequestClose}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* 确认关闭弹窗 */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    确认关闭
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  确定要关闭留言详情吗？
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    确认关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
