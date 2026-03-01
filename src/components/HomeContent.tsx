'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Play, Zap, Star } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'

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
        {/* 动态背景 */}
        <div className="absolute inset-0 -z-10">
          {/* 浅色模式背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:hidden" />
          
          {/* 深色模式背景 */}
          <div className="hidden dark:block absolute inset-0">
            <div className="absolute inset-0 grid-bg-gaming" />
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
              animate={{
                x: [0, -50, 0],
                y: [0, 50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <div className="relative text-center px-6 max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-gray-800 dark:border dark:border-cyan-500/30 text-primary-700 dark:text-cyan-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span className="dark:text-flicker">WELCOME TO</span>
              <Star className="w-4 h-4 text-amber-500 dark:text-yellow-400" />
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gray-900 dark:text-gray-100">嗨，我是</span>
            <span className="text-primary-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent dark:animate-gradient-x"> {about?.nickname || about?.name || 'YuzH1'}</span>
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
                className="game-btn px-8 py-4 rounded-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                查看项目
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 dark:border dark:border-cyan-500/30 text-gray-700 dark:text-cyan-400 font-semibold hover:bg-gray-200 dark:hover:border-cyan-400/50 transition-all"
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
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-cyan-500/50 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-gray-400 dark:bg-cyan-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                ⭐ 精选项目
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
      <section className="py-20 px-6 bg-gray-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              🎮 所有项目
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
                  className="px-8 py-4 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-cyan-400 font-semibold border border-gray-200 dark:border-cyan-500/30 hover:border-primary-300 dark:hover:border-cyan-400/50 transition-all"
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
            className="relative p-8 md:p-12 rounded-3xl bg-primary-50 dark:bg-gray-900 dark:border dark:border-cyan-500/30"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              有想法？一起聊聊！
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              无论是项目合作还是单纯交流，我都很乐意倾听你的想法
            </p>
            <Link href="/guestbook">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="game-btn px-8 py-4 rounded-xl"
              >
                留言板见 💬
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}