'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, User, FileText, Clock } from 'lucide-react'
import { ProjectManager } from './ProjectManager'
import { ProfileManager } from './ProfileManager'
import { BlogManager } from './BlogManager'
import { TimelineManager } from './TimelineManager'

type Tab = 'projects' | 'profile' | 'blog' | 'timeline'

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

interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  type: string
  icon: string | null
  link: string | null
}

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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projectsRes, blogsRes, timelineRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blog'),
        fetch('/api/timeline'),
      ])
      
      const projectsData = await projectsRes.json()
      const blogsData = await blogsRes.json()
      const timelineData = await timelineRes.json()
      
      setProjects(Array.isArray(projectsData) ? projectsData : [])
      setBlogs(Array.isArray(blogsData) ? blogsData : [])
      setTimeline(Array.isArray(timelineData) ? timelineData : [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setProjects([])
      setBlogs([])
      setTimeline([])
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'projects' as Tab, label: '项目管理', icon: Package },
    { id: 'blog' as Tab, label: '博客管理', icon: FileText },
    { id: 'timeline' as Tab, label: '时间线', icon: Clock },
    { id: 'profile' as Tab, label: '个人资料', icon: User },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'projects' && (
          <ProjectManager projects={projects} onUpdate={fetchData} />
        )}
        {activeTab === 'blog' && (
          <BlogManager blogs={blogs} onUpdate={fetchData} />
        )}
        {activeTab === 'timeline' && (
          <TimelineManager items={timeline} onUpdate={fetchData} />
        )}
        {activeTab === 'profile' && <ProfileManager />}
      </motion.div>
    </div>
  )
}