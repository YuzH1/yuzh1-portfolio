'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, User, Mail, Lock, Image, FileText } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ImageUpload } from '@/components/ImageUpload'

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    avatar: '',
    bio: '',
    password: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    if (user) {
      setForm({
        name: user.name || '',
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        password: '',
      })
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: '资料已更新！' })
        setForm(f => ({ ...f, password: '' }))
        refresh()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败' })
      }
    } catch {
      setMessage({ type: 'error', text: '更新失败，请重试' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold dark:text-white mb-8">个人设置</h1>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (user.nickname || user.name)[0].toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">
                {user.nickname || user.name}
              </h2>
              <p className="text-gray-500">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  管理员
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 编辑表单 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 space-y-6"
        >
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-1">
                <User className="w-4 h-4" />
                用户名
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                昵称
              </label>
              <input
                type="text"
                value={form.nickname}
                onChange={e => setForm({ ...form, nickname: e.target.value })}
                placeholder="显示名称"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-1">
              <Image className="w-4 h-4" />
              头像
            </label>
            <ImageUpload
              value={form.avatar}
              onChange={url => setForm({ ...form, avatar: url })}
              placeholder="上传头像"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              个人简介
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="介绍一下自己..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              新密码（留空不修改）
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="至少6位"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium ${
                saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
              } transition-colors`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存更改
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}