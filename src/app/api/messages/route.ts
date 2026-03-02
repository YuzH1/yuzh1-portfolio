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

    // 获取顶级留言和第一层回复（包含回复的回复）
    const messages = await prisma.message.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('GET /api/messages error:', error)
    console.error('Error details:', error?.message, error?.meta, error?.code)
    return NextResponse.json({ 
      error: '获取留言失败',
      details: error?.message || String(error)
    }, { status: 500 })
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

    if (!userId && !body.guestName?.trim()) {
      return NextResponse.json({ error: '请输入您的名字' }, { status: 400 })
    }

    if (!body.content || typeof body.content !== 'string' || !body.content.trim()) {
      return NextResponse.json({ error: '请输入留言内容' }, { status: 400 })
    }

    // 获取 IP 地址（Vercel 环境）
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               null

    // IP 属地查询（暂时禁用，避免 HTTPS 问题）
    const location = null

    // 创建留言
    const message = await prisma.message.create({
      data: {
        userId,
        guestName: userId ? null : body.guestName,
        content: body.content.trim(),
        projectId: body.projectId || null,
        blogId: body.blogId || null,
        parentId: body.parentId || null,
        ip: ip || null,
        location: location || null,
      },
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
    })

    // 创建通知
    try {
      // 如果是回复，通知被回复的人
      if (body.parentId) {
        const parentMessage = await prisma.message.findUnique({
          where: { id: body.parentId },
          include: { user: true },
        })

        if (parentMessage) {
          // 通知父留言的作者
          if (parentMessage.userId) {
            await prisma.notification.create({
              data: {
                userId: parentMessage.userId,
                type: 'reply',
                title: '新回复',
                content: `${userName} 回复了你的留言`,
                messageId: message.id,
                fromUserId: userId || undefined,
                fromName: userName,
              },
            })
          }
          // 如果是回复游客，且有邮箱，可以发送邮件通知（待实现）
        }
      } else {
        // 新留言，通知所有管理员
        const admins = await prisma.user.findMany({
          where: { role: 'admin' },
          select: { id: true },
        })

        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              type: 'message',
              title: '新留言',
              content: `${userName} 发表了新留言`,
              messageId: message.id,
              fromUserId: userId || undefined,
              fromName: userName,
            },
          })
        }
      }
    } catch (e) {
      console.error('创建通知失败:', e)
      // 通知失败不影响留言
    }

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