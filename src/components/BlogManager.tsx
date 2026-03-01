'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, FileText, Eye, EyeOff } from 'lucide-react'
import { ImageUpload } from './ImageUpload'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  tags: string
  category: string | null
  published: boolean
  viewCount: number
}

interface BlogManagerProps {
  blogs: Blog[]
  onUpdate: () => void
}

export function BlogManager({ blogs, onUpdate }: BlogManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    category: 'article',
    published: false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const slug = form.slug || generateSlug(form.title)
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    try {
      if (editingId) {
        await fetch(`/api/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug, tags: JSON.stringify(tagsArray) }),
        })
      } else {
        await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug, tags: JSON.stringify(tagsArray) }),
        })
      }

      setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', category: 'article', published: false })
      setShowForm(false)
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error('Failed to save blog:', error)
    }
  }

  const handleEdit = (blog: Blog) => {
    const tags = JSON.parse(blog.tags || '[]')
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      coverImage: blog.coverImage || '',
      tags: tags.join(', '),
      category: blog.category || 'article',
      published: blog.published,
    })
    setEditingId(blog.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const togglePublished = async (blog: Blog) => {
    try {
      await fetch(`/api/blog/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, published: !blog.published }),
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to toggle published:', error)
    }
  }

  const categoryOptions = [
    { value: 'article', label: '文章' },
    { value: 'tutorial', label: '教程' },
    { value: 'share', label: '分享' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold dark:text-white">博客管理</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', category: 'article', published: false })
            setEditingId(null)
            setShowForm(true)
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          写文章
        </motion.button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-3xl my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold dark:text-white">
                {editingId ? '编辑文章' : '写文章'}
              </h4>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">标题 *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => {
                      setForm({ ...form, title: e.target.value })
                      if (!editingId && !form.slug) {
                        setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 mb-1">摘要</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 mb-1">封面图</label>
                <ImageUpload
                  value={form.coverImage}
                  onChange={url => setForm({ ...form, coverImage: url })}
                  placeholder="上传文章封面图"
                />
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 mb-1">内容 (Markdown) *</label>
                <textarea
                  required
                  rows={10}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="# 标题&#10;&#10;正文内容..."
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">分类</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm dark:text-gray-300 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    placeholder="React, TypeScript"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm dark:text-gray-300">
                  立即发布
                </label>
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

      {/* Blogs List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-4">暂无文章</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileText className={`w-5 h-5 ${blog.published ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium dark:text-white text-sm truncate">{blog.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{blog.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.viewCount}</span>
                </div>
              </div>
              <button
                onClick={() => togglePublished(blog)}
                className={`p-1.5 rounded ${blog.published ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                title={blog.published ? '取消发布' : '发布'}
              >
                {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => handleEdit(blog)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(blog.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}