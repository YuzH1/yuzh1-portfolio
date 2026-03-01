import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 简单的 IP 属地查询（使用免费 API）
async function getIPLocation(ip: string): Promise<string | null> {
  try {
    // 本地 IP 不查询
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

// 获取客户端 IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return '127.0.0.1'
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
    // 返回空数组而不是错误
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

    // 获取 IP 属地
    const location = await getIPLocation(ip)

    // 尝试创建带 IP 和 location 的留言，如果失败则创建不带这些字段的
    try {
      const message = await prisma.message.create({
        data: {
          userId,
          guestName: body.guestName || null,
          guestEmail: body.guestEmail || null,
          content: body.content,
          projectId: body.projectId || null,
          blogId: body.blogId || null,
          parentId: body.parentId || null,
          ip,
          location,
        },
        include: {
          user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        },
      })
      return NextResponse.json(message)
    } catch (createError: any) {
      // 如果是因为 ip/location 字段不存在，尝试不带这些字段
      if (createError.code === 'P2021' || createError.message?.includes('column') || createError.message?.includes('does not exist')) {
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
      }
      throw createError
    }
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