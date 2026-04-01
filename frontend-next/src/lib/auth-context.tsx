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
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  login: () => {},
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem("cvfit_access_token")
    if (!token) {
      setLoading(false)
      return
    }

    fetch("/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("invalid")
        return r.json()
      })
      .then((data) => {
        setUser(data.user)
        setProfile(data.profile)
        localStorage.setItem("cvfit_user_name", data.user.full_name || "")
        // After setting user/profile, claim any anonymous draft
        const sessionToken = localStorage.getItem("cvfit_session_token")
        if (sessionToken) {
          fetch(`${API_URL}/api/cv/claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: sessionToken, access_token: token }),
          }).catch(() => {})
        }
      })
      .catch(() => {
        // Token invalid — clear
        localStorage.removeItem("cvfit_access_token")
        localStorage.removeItem("cvfit_refresh_token")
        localStorage.removeItem("cvfit_user_name")
      })
      .finally(() => setLoading(false))
  }, [])

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
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
