"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api } from "./api"

export interface UserData {
  id: number
  nombre: string
  email: string
  nivel: string
  xp: number
  rol: { id: number; nombre: string }
  permisos: string[]
}

interface AuthContextType {
  token: string | null
  user: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
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

  const logout = useCallback(() => {
    localStorage.removeItem("ecoarcade_token")
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
