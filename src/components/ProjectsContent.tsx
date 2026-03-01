'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from '@/components/ProjectCard'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string | null
  videoBvid: string | null
  githubUrl: string | null
  demoUrl: string | null
  techStack: string
  featured: boolean
}

interface ProjectsPageProps {
  projects: Project[]
}

export function ProjectsContent({ projects }: ProjectsPageProps) {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            我的项目
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这里展示了我的所有作品，每一个项目都代表着我的成长与探索
          </p>
        </motion.div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold dark:text-white mb-2">
              还没有项目
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              后台管理添加项目后，这里会显示项目列表
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}