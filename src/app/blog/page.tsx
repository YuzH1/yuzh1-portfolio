import { prisma } from '@/lib/prisma'
import { BlogList } from '@/components/BlogList'

export const revalidate = 60

export default async function BlogPage() {
  let blogs: any[] = []

  try {
    blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    console.log('Database not initialized yet')
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            博客
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            文章、教程与分享
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <a href="/blog" className="px-4 py-2 bg-primary-500 text-white rounded-full font-medium">
            全部
          </a>
          <a href="/blog?category=article" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            文章
          </a>
          <a href="/blog?category=tutorial" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            教程
          </a>
          <a href="/blog?category=share" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            分享
          </a>
        </div>

        {/* Blog List */}
        <BlogList blogs={blogs} />
      </div>
    </div>
  )
}