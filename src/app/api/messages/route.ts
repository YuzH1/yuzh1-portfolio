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
    // 只获取顶级留言（没有parentId的）
    where.parentId = null

    const messages = await prisma.message.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('GET /api/messages error:', error?.message || error)
    return NextResponse.json([])
  }
}

// POST - 创建留言
export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '无效的请求数据' }, { status: 400 })
  }

  try {
    let userId = null
    let userName = body.guestName || '游客'

    // 检查登录状态
    if (token) {
      try {
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        })
        if (session && new Date(session.expiresAt) > new Date()) {
          userId = session.userId
          userName = session.user.nickname || session.user.name
        }
      } catch {}
    }

    if (!userId && !body.guestName) {
      return NextResponse.json({ error: '请输入您的名字' }, { status: 400 })
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json({ error: '请输入留言内容' }, { status: 400 })
    }

    // 最简单的留言数据
    const message = await prisma.message.create({
      data: {
        userId,
        guestName: userId ? null : body.guestName,
        content: body.content.trim(),
        projectId: body.projectId || null,
        blogId: body.blogId || null,
        parentId: body.parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
    })

    return NextResponse.json(message)
  } catch (error: any) {
    console.error('Create message error:', error)
    return NextResponse.json({ 
      error: '留言失败，请稍后重试',
      details: error?.message || String(error)
    }, { status: 500 })
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