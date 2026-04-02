"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
}

interface Profile {
  id: string
  plan: string
  free_credits: number
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  login: () => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refresh: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

  const verify = useCallback(async (token: string) => {
    const response = await fetch("/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    })

    if (!response.ok) {
      throw new Error("invalid")
    }

    const data = await response.json()
    setUser(data.user)
    setProfile(data.profile)
    localStorage.setItem("cvfit_user_name", data.user.full_name || "")

    const sessionToken = localStorage.getItem("cvfit_session_token")
    if (sessionToken) {
      fetch(`${API_URL}/api/cv/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: sessionToken, access_token: token }),
      }).catch(() => {})
    }
  }, [API_URL])

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem("cvfit_access_token")

    void (async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        await verify(token)
      } catch {
        localStorage.removeItem("cvfit_access_token")
        localStorage.removeItem("cvfit_refresh_token")
        localStorage.removeItem("cvfit_user_name")
      } finally {
        setLoading(false)
      }
    })()
  }, [verify])

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("cvfit_access_token")
    if (!token) {
      setUser(null)
      setProfile(null)
      return
    }

    try {
      await verify(token)
    } catch {
      localStorage.removeItem("cvfit_access_token")
      localStorage.removeItem("cvfit_refresh_token")
      localStorage.removeItem("cvfit_user_name")
      setUser(null)
      setProfile(null)
    }
  }, [verify])

  const login = useCallback(() => {
    window.location.href = "/auth/google"
  }, [])

  const logout = useCallback(async () => {
    const token = localStorage.getItem("cvfit_access_token")
    try {
      await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch {
      // ignore
    }
    localStorage.removeItem("cvfit_access_token")
    localStorage.removeItem("cvfit_refresh_token")
    localStorage.removeItem("cvfit_user_name")
    setUser(null)
    setProfile(null)
    window.location.href = "/"
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
