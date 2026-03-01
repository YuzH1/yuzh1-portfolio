import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractBvid } from '@/lib/utils'

// GET - 获取单个项目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PUT - 更新项目
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const videoBvid = extractBvid(body.videoUrl)
    
    const project = await prisma.project.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - 删除项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}