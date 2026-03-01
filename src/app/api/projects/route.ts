import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractBvid } from '@/lib/utils'

// GET - 获取所有项目
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const videoBvid = extractBvid(body.videoUrl)
    
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        coverImage: body.coverImage || null,
        videoUrl: body.videoUrl || null,
        videoBvid: videoBvid,
        githubUrl: body.githubUrl || null,
        demoUrl: body.demoUrl || null,
        techStack: body.techStack || '[]',
        featured: body.featured || false,
      },
    })
    
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}