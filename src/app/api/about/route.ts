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
    console.error('GET /api/about error:', error)
    return NextResponse.json({ error: 'Failed to fetch about', details: String(error) }, { status: 500 })
  }
}

// PUT - 更新关于信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('PUT /api/about body:', body)
    
    const about = await prisma.about.upsert({
      where: { id: 'about' },
      update: {
        name: body.name || '',
        nickname: body.nickname || null,
        teamName: body.teamName || null,
        bio: body.bio || '',
        avatar: body.avatar || null,
        email: body.email || null,
        github: body.github || null,
        bilibili: body.bilibili || null,
        twitter: body.twitter || null,
        website: body.website || null,
        techStack: body.techStack || null,
      },
      create: {
        id: 'about',
        name: body.name || 'YuzH1',
        nickname: body.nickname || null,
        teamName: body.teamName || '雨止工作室',
        bio: body.bio || '',
        avatar: body.avatar || null,
        email: body.email || null,
        github: body.github || null,
        bilibili: body.bilibili || null,
        twitter: body.twitter || null,
        website: body.website || null,
        techStack: body.techStack || null,
      },
    })
    
    console.log('Upsert result:', about)
    return NextResponse.json({ success: true, data: about })
  } catch (error: any) {
    console.error('PUT /api/about error:', error)
    console.error('Error details:', error?.message, error?.code, error?.meta)
    return NextResponse.json({ 
      error: 'Failed to update about', 
      details: error?.message || String(error)
    }, { status: 500 })
  }
}

// OPTIONS - 处理 CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}