'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react'
import { getBilibiliEmbedUrl, formatDate } from '@/lib/utils'

interface ProjectDetailProps {
  project: {
    id: string
    title: string
    description: string
    coverImage: string | null
    videoUrl: string | null
    videoBvid: string | null
    githubUrl: string | null
    demoUrl: string | null
    techStack: string
    createdAt: Date
  }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const techStack = JSON.parse(project.techStack || '[]')
  const embedUrl = getBilibiliEmbedUrl(project.videoBvid)

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回项目列表
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(new Date(project.createdAt))}</span>
            </div>
            
            <div className="flex gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>源码</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>演示</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Video */}
        {embedUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
          >
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </motion.div>
        )}

        {/* Cover Image (if no video) */}
        {!embedUrl && project.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 aspect-video w-full rounded-2xl overflow-hidden"
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold dark:text-white mb-4">项目简介</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold dark:text-white mb-4">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech: string) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}