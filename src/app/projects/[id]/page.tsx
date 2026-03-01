import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProjectDetail } from '@/components/ProjectDetail'
import { MessageBoard } from '@/components/MessageBoard'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany()
    return projects.map((project) => ({ id: project.id }))
  } catch {
    return []
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  let project = null

  try {
    project = await prisma.project.findUnique({ where: { id: params.id } })
  } catch {
    console.log('Database not initialized yet')
  }

  if (!project) {
    notFound()
  }

  return (
    <>
      <ProjectDetail project={project} />
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <MessageBoard projectId={project.id} title="项目评论" />
      </div>
    </>
  )
}