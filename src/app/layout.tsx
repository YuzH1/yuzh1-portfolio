import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '雨止工作室 | YuzH1 Portfolio',
  description: 'YuzH1 的个人项目展示空间 - 探索创意与技术',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let about = null
  try {
    about = await prisma.about.findUnique({ where: { id: 'about' } })
  } catch {
    // 数据库未初始化时忽略错误
  }

  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-950`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-950 transition-colors duration-300">
            <Navbar />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer about={about} />
          </div>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 游戏风格固定深色模式
              document.documentElement.classList.add('dark');
            `,
          }}
        />
      </body>
    </html>
  )
}