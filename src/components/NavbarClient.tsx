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
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/projects', label: '项目', icon: '🎮' },
  { href: '/blog', label: '博客', icon: '📝' },
  { href: '/timeline', label: '历程', icon: '⚔️' },
  { href: '/guestbook', label: '留言', icon: '💬' },
  { href: '/about', label: '关于', icon: '👤' },
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
        className="fixed top-0 left-0 right-0 z-50 glass-gaming border-b border-cyan-500/20"
      >
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-12 h-12 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 animate-pulse-glow" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {avatar ? (
                  <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="neon-text">{displayInitial}</span>
                )}
              </div>
              <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-xl" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {displayName}
              </span>
              <div className="text-xs text-cyan-500/60">GAMING PORTFOLIO</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-1.5 ${
                      pathname === item.href
                        ? 'text-cyan-400 neon-text'
                        : 'text-gray-400 hover:text-cyan-400'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-cyan-500/10 rounded-lg border border-cyan-500/30 -z-10"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 ml-2">
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