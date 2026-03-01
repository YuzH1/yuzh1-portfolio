'use client'

import { motion } from 'framer-motion'
import { Github, Mail, ExternalLink } from 'lucide-react'

interface FooterProps {
  about?: {
    name: string
    nickname?: string | null
    teamName?: string | null
    avatar?: string | null
    email?: string | null
    github?: string | null
    bilibili?: string | null
  } | null
}

export function Footer({ about }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const displayName = about?.teamName || about?.nickname || about?.name || '雨止工作室'
  const displayInitial = displayName[0]
  const avatar = about?.avatar

  return (
    <footer className="relative py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  displayInitial
                )}
              </div>
              <span className="font-bold text-lg dark:text-white">
                {displayName}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {about?.name || 'YuzH1'} 的个人项目展示空间
            </p>
          </div>

          {/* 链接 */}
          <div>
            <h4 className="font-semibold dark:text-white mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-primary-600 transition-colors">首页</a>
              </li>
              <li>
                <a href="/projects" className="hover:text-primary-600 transition-colors">项目</a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary-600 transition-colors">关于</a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="font-semibold dark:text-white mb-4">联系我</h4>
            <div className="flex items-center gap-4">
              {about?.github && (
                <a
                  href={about.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {about?.email && (
                <a
                  href={`mailto:${about.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {about?.bilibili && (
                <a
                  href={about.bilibili}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.764-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 版权 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {currentYear} {displayName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}