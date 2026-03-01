import { prisma } from '@/lib/prisma'
import { ProjectsContent } from '@/components/ProjectsContent'

export const revalidate = 60

export default async function ProjectsPage() {
  let projects: any[] = []

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'desc' }, { createdAt: 'desc' }],
    })
  } catch {
    console.log('Database not initialized yet')
  }

  return <ProjectsContent projects={projects} />
}