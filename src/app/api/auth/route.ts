import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash, compare } from 'crypto'

// 简单的密码哈希函数
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'yuzh1-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 生成随机 token
const generateToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// GET - 获取当前用户
export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true, name: true, nickname: true, avatar: true, role: true, bio: true } } },
    })

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}

// POST - 登录/注册
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, email, password, name } = body

  try {
    if (action === 'register') {
      // 注册
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
      }

      const hashedPassword = await hashPassword(password)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
          role: 'user',
        },
      })

      // 创建会话
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
      
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      })

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, nickname: user.nickname, avatar: user.avatar, role: user.role },
      })
      
      response.cookies.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return response
    } else {
      // 登录
      const user = await prisma.user.findUnique({ where: { email } })
      
      if (!user) {
        return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
      }

      const hashedPassword = await hashPassword(password)
      if (user.password !== hashedPassword) {
        return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
      }

      // 创建会话
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      })

      const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, nickname: user.nickname, avatar: user.avatar, role: user.role, bio: user.bio },
      })
      
      response.cookies.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return response
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: '操作失败，请重试' }, { status: 500 })
  }
}

// DELETE - 登出
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (token) {
    try {
      await prisma.session.delete({ where: { token } }).catch(() => {})
    } catch {}
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete('session')
  return response
}