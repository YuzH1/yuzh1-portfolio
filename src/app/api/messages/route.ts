import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return '127.0.0.1'
}

async function getIPLocation(ip: string): Promise<string | null> {
  try {
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return '本地'
    }
    
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city`, {
      signal: AbortSignal.timeout(3000),
    })
    const data = await res.json()
    
    if (data.status === 'success') {
      const parts = [data.country, data.regionName, data.city].filter(Boolean)
      return parts.slice(0, 2).join(' ') || data.country || null
    }
    return null
  } catch {
    return null
  }
}

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
    console.error('GET /api/messages error:', error)
    return NextResponse.json([])
  }
}

// POST - 创建留言
export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const body = await request.json()
  const ip = getClientIP(request)

  try {
    let userId = null
    let userName = body.guestName

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

    const location = await getIPLocation(ip)

    const messageData: any = {
      userId,
      guestName: userId ? null : body.guestName,
      guestEmail: body.guestEmail || null,
      content: body.content,
      projectId: body.projectId || null,
      blogId: body.blogId || null,
      ip,
    }
    
    // 尝试添加 location 字段，如果数据库支持的话
    try {
      messageData.location = location
    } catch {}

    const message = await prisma.message.create({
      data: messageData,
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
      },
    })

    // 如果是回复，尝试创建通知
    if (body.parentId) {
      try {
        const parentMessage = await prisma.message.findUnique({
          where: { id: body.parentId },
          include: { user: true },
        })

        if (parentMessage && parentMessage.userId && parentMessage.userId !== userId) {
          try {
            await prisma.notification.create({
              data: {
                userId: parentMessage.userId,
                type: 'reply',
                title: '有人回复了你的留言',
                content: `${userName} 回复了你：${body.content.substring(0, 50)}...`,
                messageId: message.id,
                fromUserId: userId,
                fromName: userName,
              },
            })
          } catch {
            // Notification 表可能不存在，忽略错误
          }
        }
      } catch {}
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json({ error: '留言失败，请重试' }, { status: 500 })
  }
}

// DELETE - 删除留言
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