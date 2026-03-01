import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取关于信息
export async function GET() {
  try {
    const about = await prisma.about.findUnique({
      where: { id: 'about' },
    })
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 })
  }
}

// PUT - 更新关于信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const about = await prisma.about.upsert({
      where: { id: 'about' },
      update: {
        name: body.name,
        nickname: body.nickname,
        teamName: body.teamName,
        bio: body.bio,
        avatar: body.avatar,
        email: body.email,
        github: body.github,
        bilibili: body.bilibili,
        twitter: body.twitter,
        website: body.website,
        techStack: body.techStack,
      },
      create: {
        id: 'about',
        name: body.name || 'YuzH1',
        nickname: body.nickname,
        teamName: body.teamName || '雨止工作室',
        bio: body.bio || '',
        avatar: body.avatar,
        email: body.email,
        github: body.github,
        bilibili: body.bilibili,
        twitter: body.twitter,
        website: body.website,
        techStack: body.techStack,
      },
    })
    
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about' }, { status: 500 })
  }
}