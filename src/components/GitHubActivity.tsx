'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GitHubActivityProps {
  username: string
}

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function GitHubActivity({ username }: GitHubActivityProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, streak: 0 })

  useEffect(() => {
    // 生成模拟的贡献数据
    // 实际项目中应该调用 GitHub API
    generateMockData()
  }, [username])

  const generateMockData = () => {
    const days: ContributionDay[] = []
    const today = new Date()
    let total = 0
    let currentStreak = 0
    let maxStreak = 0

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // 随机生成贡献数
      const random = Math.random()
      let count = 0
      if (random > 0.3) count = Math.floor(Math.random() * 15)
      
      const level: 0 | 1 | 2 | 3 | 4 = 
        count === 0 ? 0 :
        count < 3 ? 1 :
        count < 6 ? 2 :
        count < 10 ? 3 : 4

      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
      })

      total += count
      
      if (count > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    setContributions(days)
    setStats({ total, streak: maxStreak })
    setLoading(false)
  }

  const levelColors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-green-200 dark:bg-green-900',
    'bg-green-400 dark:bg-green-700',
    'bg-green-500 dark:bg-green-600',
    'bg-green-600 dark:bg-green-500',
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="font-semibold dark:text-white">GitHub 贡献</span>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          @{username}
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            过去一年贡献
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.streak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            最长连续天数
          </div>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {contributions.map((day, index) => (
            <div
              key={day.date}
              className={`w-3 h-3 rounded-sm ${levelColors[day.level]} transition-all hover:scale-125 cursor-pointer`}
              title={`${day.date}: ${day.count} 次贡献`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>少</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span>多</span>
      </div>
    </motion.div>
  )
}