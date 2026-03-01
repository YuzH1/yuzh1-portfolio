'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Play } from 'lucide-react'
import { getBilibiliEmbedUrl } from '@/lib/utils'

interface ProjectCardProps {
  project: {
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
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const techStack = JSON.parse(project.techStack || '[]')
  const embedUrl = getBilibiliEmbedUrl(project.videoBvid)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* 封面图/视频预览 */}
      <div className="relative aspect-video overflow-hidden">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Play className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        {/* 悬浮播放按钮 */}
        {embedUrl && (
          <motion.a
            href={`/projects/${project.id}`}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
            </div>
          </motion.a>
        )}

        {/* 精选标签 */}
        {project.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-full font-medium">
            精选
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* 技术栈 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 链接 */}
        <div className="flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">源码</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">演示</span>
            </a>
          )}
        </div>
      </div>

      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary-500/50 transition-colors pointer-events-none" />
    </motion.div>
  )
}