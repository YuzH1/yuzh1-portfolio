'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageBoard } from '@/components/MessageBoard'

function GuestbookContent() {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (highlightId && !scrolled) {
      // 等待 DOM 渲染后滚动到高亮元素
      const timer = setTimeout(() => {
        const element = document.getElementById(`message-${highlightId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setScrolled(true)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [highlightId, scrolled])

  return (
    <MessageBoard title="访客留言" highlightId={highlightId || undefined} />
  )
}

export default function GuestbookPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">
            留言板
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            欢迎留下你的足迹 📝
          </p>
        </div>

        {/* Message Board with Suspense */}
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <GuestbookContent />
        </Suspense>
      </div>
    </div>
  )
}
