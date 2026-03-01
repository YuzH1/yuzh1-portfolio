import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogDetail } from '@/components/BlogDetail'
import { MessageBoard } from '@/components/MessageBoard'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blog.findMany({ where: { published: true } })
    return blogs.map((blog) => ({ slug: blog.slug }))
  } catch {
    return []
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let blog = null

  try {
    blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
    })
  } catch {
    console.log('Database not initialized yet')
  }

  if (!blog || !blog.published) {
    notFound()
  }

  // 增加阅读量
  try {
    await prisma.blog.update({
      where: { id: blog.id },
      data: { viewCount: { increment: 1 } },
    })
  } catch {}

  return (
    <>
      <BlogDetail blog={blog} />
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <MessageBoard blogId={blog.id} title="文章评论" />
      </div>
    </>
  )
}