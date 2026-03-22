'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, saveUser, saveTokens, clearTokens, isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [sessionStatus, setSessionStatus] = useState('disconnected')
  const [authLoading, setAuthLoading]     = useState(true)

  useEffect(() => {
    const stored = getUser()
    if (stored && isAuthenticated()) setUser(stored)
    setAuthLoading(false)
  }, [])

  const login = async ({ email, password }) => {
    const data = await api.post('/auth/login', { email, password })
    const { user, accessToken, refreshToken } = data.data
    saveTokens(accessToken, refreshToken)
    saveUser(user)
    setUser(user)
    return user
  }

  const register = async ({ name, email, password }) => {
    return api.post('/auth/register', { name, email, password })
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    clearTokens()
    setUser(null)
  }

  return (
    <AppContext.Provider value={{
      user, authLoading,
      login, register, logout,
      isAuthenticated: !!user,
      sessionStatus, setSessionStatus,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
