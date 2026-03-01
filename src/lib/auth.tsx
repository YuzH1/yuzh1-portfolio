'use client'

import { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  email: string
  name: string
  nickname?: string
  avatar?: string
  role: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth')
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      })
      const data = await res.json()
      if (data.error) return { error: data.error }
      setUser(data.user)
      return {}
    } catch {
      return { error: '登录失败，请重试' }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name }),
      })
      const data = await res.json()
      if (data.error) return { error: data.error }
      setUser(data.user)
      return {}
    } catch {
      return { error: '注册失败，请重试' }
    }
  }

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setUser(null)
  }

  const refresh = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}