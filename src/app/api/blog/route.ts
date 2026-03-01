import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有博客
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')
  
  try {
    const where = published === 'true' ? { published: true } : {}
    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// POST - 创建博客
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || null,
        coverImage: body.coverImage || null,
        tags: body.tags || '[]',
        category: body.category || 'article',
        published: body.published || false,
      },
    })
    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}