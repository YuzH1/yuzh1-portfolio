import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 简单的密码哈希
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'yuzh1-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// PUT - 更新用户资料
export async function PUT(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 })
    }

    const body = await request.json()
    const { name, nickname, avatar, bio, password } = body

    const updateData: any = {
      name,
      nickname,
      avatar,
      bio,
    }

    // 如果提供了新密码
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, email: true, name: true, nickname: true, avatar: true, role: true, bio: true },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}