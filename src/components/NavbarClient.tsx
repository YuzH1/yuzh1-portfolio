'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { useState } from 'react'
import { AuthModal } from './AuthModal'

interface AboutData {
  name: string
  nickname: string | null
  teamName: string | null
  avatar: string | null
}

const navItems = [
  { href: '/', label: '首页' },
  { href: '/projects', label: '项目' },
  { href: '/blog', label: '博客' },
  { href: '/timeline', label: '历程' },
  { href: '/guestbook', label: '留言' },
  { href: '/about', label: '关于' },
]

export function NavbarClient({ about }: { about: AboutData | null }) {
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)

  const displayName = about?.teamName || about?.nickname || about?.name || '雨止工作室'
  const displayInitial = displayName[0]
  const avatar = about?.avatar

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800"
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              {avatar ? (
                <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                displayInitial
              )}
            </motion.div>
            <span className="font-bold text-lg hidden sm:block dark:text-white">
              {displayName}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 rounded-lg transition-colors text-sm ${
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-lg -z-10"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu onLogin={() => setShowAuth(true)} />
            </div>
          </div>
        </nav>
      </motion.header>

      {showAuth && (
        <AuthModal
          mode="login"
          onClose={() => setShowAuth(false)}
        />
      )}
    </>
  )
}