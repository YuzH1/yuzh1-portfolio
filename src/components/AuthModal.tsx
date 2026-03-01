'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface AuthModalProps {
  mode: 'login' | 'register'
  onClose: () => void
  onSuccess?: () => void
  onSwitchMode?: (mode: 'login' | 'register') => void
}

export function AuthModal({ mode: initialMode, onClose, onSuccess, onSwitchMode }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const result = await login(form.email, form.password)
        if (result.error) {
          setError(result.error)
        } else {
          onSuccess?.()
          onClose()
        }
      } else {
        const result = await register(form.email, form.password, form.name)
        if (result.error) {
          setError(result.error)
        } else {
          onSuccess?.()
          onClose()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError('')
    if (onSwitchMode) {
      onSwitchMode(newMode)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">
            {mode === 'login' ? '登录' : '注册新账户'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="你的名字"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="至少6位"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                登录
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                注册
              </>
            )}
          </button>

          {/* 切换登录/注册 */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {mode === 'login' ? (
              <>
                还没有账户？
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-primary-600 dark:text-primary-400 hover:underline ml-1"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账户？
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary-600 dark:text-primary-400 hover:underline ml-1"
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}