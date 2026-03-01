'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 强制使用深色模式（游戏风格）
    document.documentElement.classList.add('dark')
  }, [])

  // 隐藏主题切换按钮，游戏风格固定深色
  return null

  // 如果你想保留切换按钮，取消上面的 return null，使用下面的代码：
  /*
  if (!mounted) return null

  return (
    <motion.button
      onClick={() => {}}
      className="relative p-2 rounded-full bg-gray-800 text-cyan-400 border border-cyan-500/30"
      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
      whileTap={{ scale: 0.9 }}
      aria-label="游戏模式"
    >
      <Moon className="w-5 h-5" />
    </motion.button>
  )
  */
}