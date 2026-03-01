import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 从B站URL提取BV号
export function extractBvid(url: string): string | null {
  if (!url) return null
  const match = url.match(/BV[\w]+/)
  return match ? match[0] : null
}

// 生成B站嵌入URL
export function getBilibiliEmbedUrl(bvid: string | null): string | null {
  if (!bvid) return null
  return `//player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0`
}

// 格式化日期
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}