import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有时间线
export async function GET() {
  try {
    const timeline = await prisma.timeline.findMany({
      orderBy: [{ order: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(timeline)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 })
  }
}

// POST - 创建时间线事件
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await prisma.timeline.create({
      data: {
        title: body.title,
        content: body.content,
        date: body.date,
        type: body.type || 'other',
        icon: body.icon || null,
        link: body.link || null,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create timeline' }, { status: 500 })
  }
}