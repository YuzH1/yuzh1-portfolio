'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Mail, Github, Globe, Video, Image, Code, Plus, X } from 'lucide-react'
import { ImageUpload } from './ImageUpload'

interface AboutData {
  name: string
  nickname: string
  teamName: string
  bio: string
  avatar: string
  email: string
  github: string
  bilibili: string
  twitter: string
  website: string
  techStack: string
}

export function ProfileManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [form, setForm] = useState<AboutData>({
    name: '',
    nickname: '',
    teamName: '雨止工作室',
    bio: '',
    avatar: '',
    email: '',
    github: '',
    bilibili: '',
    twitter: '',
    website: '',
    techStack: '[]',
  })

  // 技术栈列表
  const [techList, setTechList] = useState<string[]>([])
  const [newTech, setNewTech] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    setForm({ ...form, techStack: JSON.stringify(techList) })
  }, [techList])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      if (data) {
        setForm({
          name: data.name || '',
          nickname: data.nickname || '',
          teamName: data.teamName || '雨止工作室',
          bio: data.bio || '',
          avatar: data.avatar || '',
          email: data.email || '',
          github: data.github || '',
          bilibili: data.bilibili || '',
          twitter: data.twitter || '',
          website: data.website || '',
          techStack: data.techStack || '[]',
        })
        // 解析技术栈
        try {
          const techs = JSON.parse(data.techStack || '[]')
          setTechList(Array.isArray(techs) ? techs : [])
        } catch {
          setTechList([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTech = () => {
    if (newTech.trim() && !techList.includes(newTech.trim())) {
      setTechList([...techList, newTech.trim()])
      setNewTech('')
    }
  }

  const removeTech = (tech: string) => {
    setTechList(techList.filter(t => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          techStack: JSON.stringify(techList),
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: '个人资料已保存！' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: '保存失败，请重试' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* 工作室信息区块 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          <Image className="w-5 h-5" />
          工作室信息
        </h3>
        
        {/* 工作室头像 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <label className="block text-sm font-medium dark:text-gray-300 mb-3">
            工作室 Logo / 头像
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <ImageUpload
                value={form.avatar}
                onChange={url => setForm({ ...form, avatar: url })}
                placeholder="上传工作室 Logo"
              />
            </div>
            {form.avatar && (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg flex-shrink-0">
                <img src={form.avatar} alt="工作室Logo" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              工作室名称
            </label>
            <input
              type="text"
              value={form.teamName}
              onChange={e => setForm({ ...form, teamName: e.target.value })}
              placeholder="雨止工作室"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              站长昵称
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={e => setForm({ ...form, nickname: e.target.value })}
              placeholder="YuzH1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              真实姓名
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="你的名字"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">
            工作室简介
          </label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="介绍一下工作室..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      {/* 技术栈区块 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          <Code className="w-5 h-5" />
          技术栈
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          添加你掌握的技术，会显示在关于页面
        </p>

        {/* 已添加的技术栈 */}
        <div className="flex flex-wrap gap-2">
          {techList.map(tech => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>

        {/* 添加新技术 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTech}
            onChange={e => setNewTech(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
            placeholder="输入技术名称，如 React、TypeScript"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addTech}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
      </div>

      {/* 联系方式区块 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          联系方式
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              个人网站
            </label>
            <input
              type="url"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* 社交媒体区块 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5" />
          社交媒体
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </label>
            <input
              type="url"
              value={form.github}
              onChange={e => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1 flex items-center gap-2">
              <Video className="w-4 h-4" />
              B站
            </label>
            <input
              type="url"
              value={form.bilibili}
              onChange={e => setForm({ ...form, bilibili: e.target.value })}
              placeholder="https://space.bilibili.com/xxx"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              𝕏 Twitter / X
            </label>
            <input
              type="url"
              value={form.twitter}
              onChange={e => setForm({ ...form, twitter: e.target.value })}
              placeholder="https://twitter.com/username"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end pt-4">
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className={`flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium ${
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
              保存资料
            </>
          )}
        </motion.button>
      </div>
    </form>
  )
}