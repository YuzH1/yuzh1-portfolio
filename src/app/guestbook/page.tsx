import { prisma } from '@/lib/prisma'
import { MessageBoard } from '@/components/MessageBoard'

export const revalidate = 60

export default async function GuestbookPage() {
  let messages: any[] = []

  try {
    messages = await prisma.message.findMany({
      where: {
        projectId: null,
        blogId: null,
      },
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch {
    console.log('Database not initialized yet')
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            留言板
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            欢迎留下你的足迹 📝
          </p>
        </div>

        {/* Message Board */}
        <MessageBoard title="访客留言" />
      </div>
    </div>
  )
}