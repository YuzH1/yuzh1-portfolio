'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  tags: string
  category: string | null
  viewCount: number
  createdAt: Date
}

interface BlogListProps {
  blogs: Blog[]
  category?: string
}

const categoryLabels: Record<string, string> = {
  article: '文章',
  tutorial: '教程',
  share: '分享',
}

const categoryColors: Record<string, string> = {
  article: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  tutorial: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  share: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export function BlogList({ blogs, category }: BlogListProps) {
  const filteredBlogs = category 
    ? blogs.filter(b => b.category === category)
    : blogs

  if (filteredBlogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        暂无文章
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBlogs.map((blog, index) => {
        const tags = JSON.parse(blog.tags || '[]')
        
        return (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
          >
            {/* Cover */}
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative aspect-[16/9] overflow-hidden">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                
                {blog.category && (
                  <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${categoryColors[blog.category] || 'bg-gray-100 text-gray-700'}`}>
                    {categoryLabels[blog.category] || blog.category}
                  </span>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-5">
              <Link href={`/blog/${blog.slug}`}>
                <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
              </Link>
              
              {blog.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(new Date(blog.createdAt))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.viewCount}
                  </span>
                </div>
                
                <Link
                  href={`/blog/${blog.slug}`}
                  className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  阅读
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}