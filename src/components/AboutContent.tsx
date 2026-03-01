'use client'

import { motion } from 'framer-motion'
import { Github, Mail, ExternalLink } from 'lucide-react'

interface AboutPageProps {
  about: {
    name: string
    nickname?: string | null
    teamName?: string | null
    bio?: string | null
    avatar?: string | null
    email?: string | null
    github?: string | null
    bilibili?: string | null
    twitter?: string | null
    website?: string | null
    techStack?: string | null
  } | null
}

export function AboutContent({ about }: AboutPageProps) {
  const techStack = about?.techStack ? JSON.parse(about.techStack) : []

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative w-32 h-32 mx-auto mb-6"
          >
            {about?.avatar ? (
              <img
                src={about.avatar}
                alt={about.name}
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold">
                {about?.name?.[0] || 'Y'}
              </div>
            )}
            <motion.div
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white text-lg">👋</span>
            </motion.div>
          </motion.div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-2">
            {about?.nickname || about?.name || 'YuzH1'}
          </h1>
          {about?.teamName && (
            <p className="text-xl text-primary-600 dark:text-primary-400 mb-4">
              {about.teamName}
            </p>
          )}

          {/* Bio */}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {about?.bio || '一个热爱创造的开发者'}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {/* 关于我 */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold dark:text-white mb-4">关于我</h2>
            <p className="text-gray-600 dark:text-gray-400">
              你好！我是 {about?.nickname || about?.name || 'YuzH1'}，一个对技术和创意充满热情的开发者。
              我喜欢把想法变成现实，用代码创造有趣的东西。
            </p>
          </div>

          {/* 联系方式 */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold dark:text-white mb-4">联系方式</h2>
            <div className="space-y-3">
              {about?.email && (
                <a
                  href={`mailto:${about.email}`}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{about.email}</span>
                </a>
              )}
              {about?.github && (
                <a
                  href={about.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {about?.bilibili && (
                <a
                  href={about.bilibili}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.764-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                  </svg>
                  <span>B站</span>
                </a>
              )}
              {about?.website && (
                <a
                  href={about.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>个人网站</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        {techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold dark:text-white mb-6">技术栈</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech: string, index: number) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-md border border-gray-100 dark:border-gray-700"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}