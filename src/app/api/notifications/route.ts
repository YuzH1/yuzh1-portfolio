import { prisma } from '@/lib/prisma'
import { prisma as prismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    
    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    })

    return Response.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return Response.json({ notifications: [], unreadCount: 0 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    if (body.id) {
      await prisma.notification.update({
        where: { id: body.id },
        data: { isRead: true },
      })
    } else if (body.markAll) {
      await prisma.notification.updateMany({
        data: { isRead: true },
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}