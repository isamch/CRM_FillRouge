'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getUser, saveUser, saveTokens, clearTokens, isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [sessionStatus, setSessionStatus] = useState('disconnected')
  const [authLoading, setAuthLoading]     = useState(true)
  const pollRef = useRef(null)

  useEffect(() => {
    const stored = getUser()
    if (stored && isAuthenticated()) setUser(stored)
    setAuthLoading(false)
  }, [])

  // poll WhatsApp status globally every 10s when user is logged in
  useEffect(() => {
    if (!user) { clearInterval(pollRef.current); return }

    const fetchStatus = () => {
      api.get('/whatsapp/status')
        .then(res => { if (res.data?.status) setSessionStatus(res.data.status) })
        .catch(() => {})
    }

    fetchStatus()
    pollRef.current = setInterval(fetchStatus, 10000)
    return () => clearInterval(pollRef.current)
  }, [user])

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
