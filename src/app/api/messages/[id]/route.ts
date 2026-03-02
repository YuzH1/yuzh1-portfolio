import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取单个留言详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, nickname: true, avatar: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!message) {
      return NextResponse.json({ error: '留言不存在' }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error: any) {
    console.error('GET /api/messages/[id] error:', error)
    return NextResponse.json({ 
      error: '获取留言失败',
      details: error?.message || String(error)
    }, { status: 500 })
  }
}
