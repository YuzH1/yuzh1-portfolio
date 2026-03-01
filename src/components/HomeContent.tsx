'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'

// 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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

interface HomePageProps {
  projects: Project[]
  about: {
    name: string
    nickname?: string | null
    teamName?: string | null
    bio?: string | null
  } | null
}

export function HomeContent({ projects, about }: HomePageProps) {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3)
  const recentProjects = projects.slice(0, 6)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-mesh-light dark:bg-gradient-mesh-dark opacity-50" />
          <div className="absolute inset-0 grid-bg" />
          
          {/* 动态光球 */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              欢迎来到雨止工作室
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="dark:text-white">嗨，我是</span>
            <span className="gradient-text"> {about?.nickname || about?.name || 'YuzH1'}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            {about?.bio || '一个热爱创造的开发者，专注于将想法变成现实'}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                查看项目
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                了解我
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* 滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
                精选项目
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                这些是我最引以为豪的作品，每一个都代表着我对技术与创意的追求
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="py-20 px-6 bg-gray-100/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
              所有项目
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              探索我的项目集合，每一个都是学习与成长的见证
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {projects.length > 6 && (
            <motion.div variants={itemVariants} className="text-center mt-12">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                >
                  查看更多项目
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-200 dark:border-primary-800"
          >
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white mb-4">
              有想法？一起聊聊！
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              无论是项目合作还是单纯交流，我都很乐意倾听你的想法
            </p>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold shadow-lg"
              >
                联系我
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}