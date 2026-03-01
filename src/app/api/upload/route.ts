import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST - 上传图片（Vercel 兼容版本 - 使用 base64 存储）
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '没有选择文件' }, { status: 400 })
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '只支持 JPG、PNG、GIF、WebP 格式' }, { status: 400 })
    }

    // 检查文件大小 (最大 2MB，因为 base64 会更大)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 2MB' }, { status: 400 })
    }

    // 将文件转换为 base64 data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
      fileName: file.name 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 })
  }
}