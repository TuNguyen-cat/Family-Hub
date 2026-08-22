import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { api, clearTokens, getAccessToken, saveTokens, tryRefresh } from "@/lib/api"

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: "parent" | "child" | "other"
  family_name: string
}

type Tokens = { access: string; refresh: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (payload: {
    username: string
    email: string
    password: string
    role: string
    family_name: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const applySession = useCallback(
    (data: { user: User; tokens: Tokens }) => {
      saveTokens(data.tokens.access, data.tokens.refresh)
      setUser(data.user)
    },
    [],
  )

  useEffect(() => {
    let active = true
    async function restore() {
      if (!getAccessToken()) {
        setLoading(false)
        return
      }
      if (await tryRefresh()) {
        try {
          const me = await api<User>("/auth/me/")
          if (active) setUser(me)
        } catch {
          clearTokens()
        }
      }
      if (active) setLoading(false)
    }
    restore()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await api<{ user: User; tokens: Tokens }>("/auth/login/", {
        method: "POST",
        body: { username, password },
        auth: false,
      })
      applySession(data)
    },
    [applySession],
  )

  const register = useCallback(
    async (payload: {
      username: string
      email: string
      password: string
      role: string
      family_name: string
    }) => {
      const data = await api<{ user: User; tokens: Tokens }>("/auth/register/", {
        method: "POST",
        body: payload,
        auth: false,
      })
      applySession(data)
    },
    [applySession],
  )

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider")
  return ctx
}