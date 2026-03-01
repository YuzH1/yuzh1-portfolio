'use client'

import { motion } from 'framer-motion'
import { Trophy, Rocket, Award, Star, ExternalLink } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  type: string
  icon: string | null
  link: string | null
}

interface TimelineProps {
  items: TimelineItem[]
}

const typeIcons: Record<string, any> = {
  milestone: Trophy,
  project: Rocket,
  award: Award,
  other: Star,
}

const typeColors: Record<string, string> = {
  milestone: 'bg-amber-500',
  project: 'bg-primary-500',
  award: 'bg-purple-500',
  other: 'bg-gray-500',
}

export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        暂无时间线记录
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2" />

      {/* Items */}
      <div className="space-y-8">
        {items.map((item, index) => {
          const Icon = typeIcons[item.type] || Star
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-4 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Icon */}
              <div className={`relative z-10 w-8 h-8 rounded-full ${typeColors[item.type] || 'bg-gray-500'} flex items-center justify-center text-white flex-shrink-0`}>
                {item.icon ? (
                  <span className="text-sm">{item.icon}</span>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex-1 bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-800 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {item.date}
                  </span>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <h3 className="text-lg font-bold dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.content}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}