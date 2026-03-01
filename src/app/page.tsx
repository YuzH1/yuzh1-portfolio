import { prisma } from '@/lib/prisma'
import { HomeContent } from '@/components/HomeContent'

export const revalidate = 60 // ISR: 每60秒重新验证

export default async function HomePage() {
  let projects: any[] = []
  let about = null

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'desc' }, { createdAt: 'desc' }],
    })
    about = await prisma.about.findUnique({ where: { id: 'about' } })
  } catch (error) {
    // 数据库未初始化时使用空数据
    console.log('Database not initialized yet')
  }

  return <HomeContent projects={projects} about={about} />
}