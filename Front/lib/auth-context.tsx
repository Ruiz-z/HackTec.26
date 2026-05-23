"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api } from "./api"

export interface UserData {
  id: number
  nombre: string
  email: string
  nivel: string
  nivelNum: number
  xp: number
  puntos: number
  rol: { id: number; nombre: string }
  permisos: string[]
}

interface AuthContextType {
  token: string | null
  user: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("ecoarcade_token")
    if (stored) {
      setToken(stored)
      api.me(stored)
        .then((res) => setUser(res.user))
        .catch(() => localStorage.removeItem("ecoarcade_token"))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password)
    localStorage.setItem("ecoarcade_token", res.token)
    setToken(res.token)
    setUser(res.user)
  }, [])

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem("ecoarcade_token")
    if (!stored) return
    try {
      const res = await api.me(stored)
      setUser(res.user)
    } catch {
      // ignore
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("ecoarcade_token")
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
