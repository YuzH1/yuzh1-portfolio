'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, ExternalLink, Video } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string | null
  videoUrl: string | null
  videoBvid: string | null
  githubUrl: string | null
  demoUrl: string | null
  techStack: string
  featured: boolean
  order: number
}

export function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const emptyForm = {
    title: '',
    description: '',
    coverImage: '',
    videoUrl: '',
    githubUrl: '',
    demoUrl: '',
    techStack: '',
    featured: false,
  }

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const techStackArray = form.techStack.split(',').map(t => t.trim()).filter(Boolean)
    
    const payload = {
      ...form,
      techStack: JSON.stringify(techStackArray),
    }

    try {
      if (editingId) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      
      setForm(emptyForm)
      setShowForm(false)
      setEditingId(null)
      fetchProjects()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    const techStackArray = JSON.parse(project.techStack || '[]')
    setForm({
      title: project.title,
      description: project.description,
      coverImage: project.coverImage || '',
      videoUrl: project.videoUrl || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      techStack: techStackArray.join(', '),
      featured: project.featured,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) return
    
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      fetchProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">项目管理</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setForm(emptyForm)
            setEditingId(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加项目
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? '编辑项目' : '添加项目'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  项目名称 *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  项目描述 *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  封面图 URL
                </label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={e => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  B站视频链接
                </label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.bilibili.com/video/BV..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                    GitHub 链接
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                    演示链接
                  </label>
                  <input
                    type="url"
                    value={form.demoUrl}
                    onChange={e => setForm({ ...form, demoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  技术栈（逗号分隔）
                </label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={e => setForm({ ...form, techStack: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <label htmlFor="featured" className="text-sm dark:text-gray-300">
                  设为精选项目
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无项目，点击上方按钮添加
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-20 h-14 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold dark:text-white truncate">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                      精选
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}