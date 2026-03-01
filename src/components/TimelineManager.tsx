'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, Calendar } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  type: string
  icon: string | null
  link: string | null
}

interface TimelineManagerProps {
  items: TimelineItem[]
  onUpdate: () => void
}

export function TimelineManager({ items, onUpdate }: TimelineManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    content: '',
    date: '',
    type: 'milestone',
    icon: '',
    link: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await fetch(`/api/timeline/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }

      setForm({ title: '', content: '', date: '', type: 'milestone', icon: '', link: '' })
      setShowForm(false)
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error('Failed to save timeline:', error)
    }
  }

  const handleEdit = (item: TimelineItem) => {
    setForm({
      title: item.title,
      content: item.content,
      date: item.date,
      type: item.type,
      icon: item.icon || '',
      link: item.link || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条时间线吗？')) return

    try {
      await fetch(`/api/timeline/${id}`, { method: 'DELETE' })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete timeline:', error)
    }
  }

  const typeOptions = [
    { value: 'milestone', label: '里程碑', emoji: '🏆' },
    { value: 'project', label: '项目', emoji: '🚀' },
    { value: 'award', label: '奖项', emoji: '🎖️' },
    { value: 'other', label: '其他', emoji: '⭐' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold dark:text-white">时间线管理</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setForm({ title: '', content: '', date: '', type: 'milestone', icon: '', link: '' })
            setEditingId(null)
            setShowForm(true)
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          添加事件
        </motion.button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold dark:text-white">
                {editingId ? '编辑事件' : '添加事件'}
              </h4>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">日期 *</label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    placeholder="2024-01"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">类型</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.emoji} {opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 mb-1">标题 *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 mb-1">内容</label>
                <textarea
                  rows={2}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">图标 (emoji)</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="🎉"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">相关链接</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  取消
                </button>
                <button type="submit" className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg">
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-4">暂无时间线事件</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-lg">{item.icon || (typeOptions.find(t => t.value === item.type)?.emoji || '📌')}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white text-sm truncate">{item.title}</div>
                <div className="text-xs text-gray-500">{item.date}</div>
              </div>
              <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}