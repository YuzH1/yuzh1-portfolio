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
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    
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
  
  const ip = getClientIP(request)

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

    // 构建留言数据
    const messageData: any = {
      userId,
      guestName: userId ? null : body.guestName,
      guestEmail: body.guestEmail || null,
      content: body.content.trim(),
      projectId: body.projectId || null,
      blogId: body.blogId || null,
    }

    // 尝试添加可选字段
    const location = await getIPLocation(ip)
    
    // 使用 $executeRaw 来避免 Prisma Client 的字段检查
    // 这样即使数据库缺少某些字段也能正常工作
    try {
      // 先尝试使用完整字段
      const result = await prisma.$queryRaw`
        INSERT INTO Message (id, userId, guestName, guestEmail, content, projectId, blogId, ip, location, createdAt)
        VALUES (
          LOWER(HEX(RANDOMBLOB(25))),
          ${userId},
          ${userId ? null : body.guestName},
          ${body.guestEmail || null},
          ${body.content.trim()},
          ${body.projectId || null},
          ${body.blogId || null},
          ${ip},
          ${location},
          CURRENT_TIMESTAMP
        ) RETURNING id
      `
      
      const newId = (result as any[])?.[0]?.id
      
      if (newId) {
        const message = await prisma.message.findUnique({
          where: { id: newId },
          include: {
            user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
          },
        })
        
        return NextResponse.json(message)
      }
    } catch (rawError: any) {
      console.log('Raw query failed, trying basic insert:', rawError?.message)
    }

    // 如果上面的方法失败，使用基本的 Prisma create
    try {
      const message = await prisma.message.create({
        data: messageData,
        include: {
          user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        },
      })
      
      return NextResponse.json(message)
    } catch (createError: any) {
      console.error('Prisma create error:', createError?.message)
      
      // 最后尝试：不包含任何可选字段
      const basicMessage = await prisma.message.create({
        data: {
          userId,
          guestName: userId ? null : body.guestName,
          content: body.content.trim(),
        },
        include: {
          user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        },
      })
      
      return NextResponse.json(basicMessage)
    }
  } catch (error: any) {
    console.error('Create message error:', error?.message || error)
    return NextResponse.json({ 
      error: '留言失败，请稍后重试',
      details: error?.message 
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