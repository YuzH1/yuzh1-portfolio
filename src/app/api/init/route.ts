import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// 简单的密码哈希函数
const hashPassword = (password: string): string => {
  return crypto
    .createHash('sha256')
    .update(password + 'yuzh1-salt')
    .digest('hex')
}

// GET - 初始化数据库（只能调用一次）
export async function GET() {
  try {
    // 检查是否已经初始化
    const existingAbout = await prisma.about.findUnique({
      where: { id: 'about' },
    })

    if (existingAbout) {
      return NextResponse.json({ 
        message: '数据库已经初始化过了',
        about: existingAbout,
      })
    }

    // 创建默认 About 记录
    const about = await prisma.about.create({
      data: {
        id: 'about',
        name: 'YuzH1',
        nickname: 'YuzH1',
        teamName: '雨止工作室',
        bio: '一个热爱创造的开发者，专注于将想法变成现实',
        techStack: JSON.stringify(['TypeScript', 'React', 'Next.js', 'Node.js']),
      },
    })

    // 创建管理员账户
    const hashedPassword = hashPassword('123456')
    const admin = await prisma.user.create({
      data: {
        email: 'admin@yuzh1.com',
        password: hashedPassword,
        name: 'YuzH1',
        nickname: 'YuzH1',
        role: 'admin',
      },
    })

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功！',
      about,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      loginInfo: {
        email: 'admin@yuzh1.com',
        password: '123456',
      },
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({
      success: false,
      error: '初始化失败，请查看日志',
      details: String(error),
    }, { status: 500 })
  }
}