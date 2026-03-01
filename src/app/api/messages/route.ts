import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取留言
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const blogId = searchParams.get('blogId')

  try {
    const where: any = {}
    if (projectId) where.projectId = projectId
    if (blogId) where.blogId = blogId

    const messages = await prisma.message.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - 创建留言
export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const body = await request.json()

  try {
    let userId = null

    // 检查登录状态
    if (token) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      })
      if (session && new Date(session.expiresAt) > new Date()) {
        userId = session.userId
      }
    }

    // 未登录用户必须填写名字
    if (!userId && !body.guestName) {
      return NextResponse.json({ error: '请输入您的名字' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        userId,
        guestName: body.guestName || null,
        guestEmail: body.guestEmail || null,
        content: body.content,
        projectId: body.projectId || null,
        blogId: body.blogId || null,
        parentId: body.parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json({ error: '留言失败，请重试' }, { status: 500 })
  }
}

// DELETE - 删除留言（仅管理员）
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!token) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    await prisma.message.delete({ where: { id: id! } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}