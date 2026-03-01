import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - 更新时间线
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const item = await prisma.timeline.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        date: body.date,
        type: body.type,
        icon: body.icon || null,
        link: body.link || null,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 })
  }
}

// DELETE - 删除时间线
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.timeline.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timeline' }, { status: 500 })
  }
}