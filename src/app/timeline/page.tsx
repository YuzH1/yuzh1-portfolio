import { prisma } from '@/lib/prisma'
import { Timeline } from '@/components/Timeline'
import { GitHubActivity } from '@/components/GitHubActivity'

export const revalidate = 60

export default async function TimelinePage() {
  let timeline: any[] = []
  let about = null

  try {
    timeline = await prisma.timeline.findMany({
      orderBy: [{ order: 'desc' }, { createdAt: 'desc' }],
    })
    about = await prisma.about.findUnique({ where: { id: 'about' } })
  } catch {
    console.log('Database not initialized yet')
  }

  // 从 GitHub URL 提取用户名
  const githubUsername = about?.github?.split('/').filter(Boolean).pop() || 'YuzH1'

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            成长历程
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            记录每一个重要时刻
          </p>
        </div>

        {/* GitHub Activity */}
        <div className="mb-12">
          <GitHubActivity username={githubUsername} />
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white mb-6">时间线</h2>
          <Timeline items={timeline} />
        </div>
      </div>
    </div>
  )
}