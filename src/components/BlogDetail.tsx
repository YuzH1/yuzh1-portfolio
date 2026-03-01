'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface BlogDetailProps {
  blog: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    tags: string
    category: string | null
    viewCount: number
    createdAt: Date
  }
}

const categoryLabels: Record<string, string> = {
  article: '文章',
  tutorial: '教程',
  share: '分享',
}

export function BlogDetail({ blog }: BlogDetailProps) {
  const tags = JSON.parse(blog.tags || '[]')
  
  // 简单的 Markdown 渲染
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map(line => {
        // 标题
        if (line.startsWith('### ')) {
          return `<h3 class="text-xl font-bold mt-6 mb-3 dark:text-white">${line.slice(4)}</h3>`
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-2xl font-bold mt-8 mb-4 dark:text-white">${line.slice(3)}</h2>`
        }
        if (line.startsWith('# ')) {
          return `<h1 class="text-3xl font-bold mt-8 mb-4 dark:text-white">${line.slice(2)}</h1>`
        }
        
        // 代码块
        if (line.startsWith('```')) {
          return ''
        }
        
        // 列表
        if (line.startsWith('- ')) {
          return `<li class="ml-4 text-gray-700 dark:text-gray-300">${line.slice(2)}</li>`
        }
        
        // 空行
        if (line.trim() === '') {
          return '<br/>'
        }
        
        // 普通段落
        return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed my-2">${line}</p>`
      })
      .join('')
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <article className="max-w-4xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {blog.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full mb-4">
              {categoryLabels[blog.category] || blog.category}
            </span>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(new Date(blog.createdAt))}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.viewCount} 次阅读
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              约 {Math.ceil(blog.content.length / 500)} 分钟
            </span>
          </div>
        </motion.header>

        {/* Cover */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full aspect-video object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
        />

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  )
}