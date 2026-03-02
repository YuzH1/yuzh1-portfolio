import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      include: {
        message: {
          select: {
            id: true,
            projectId: true,
            blogId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // 为每个通知生成跳转 URL
    const notificationsWithUrl = notifications.map(n => {
      let url = '/'
      if (n.message) {
        if (n.message.projectId) {
          url = `/projects/${n.message.projectId}`
        } else if (n.message.blogId) {
          url = `/blog/${n.message.blogId}`
        } else {
          url = '/guestbook'
        }
      }
      return {
        ...n,
        url,
      }
    })

    return NextResponse.json({ notifications: notificationsWithUrl, unreadCount })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }
}

// PUT - 标记通知为已读
export async function PUT(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const body = await request.json()

  if (!token) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 })
    }

    if (body.markAll) {
      await prisma.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      })
    } else if (body.id) {
      await prisma.notification.update({
        where: { id: body.id },
        data: { isRead: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}