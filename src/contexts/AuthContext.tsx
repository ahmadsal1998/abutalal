import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'abu-talal:auth-session'

/** Demo credentials — replace with real API auth later. */
export const MOCK_ADMIN_EMAIL = 'admin@abutalal.mobile'
export const MOCK_ADMIN_PASSWORD = 'demo123'

export interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (parsed?.email && parsed?.name) return parsed
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const login = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase()
    await new Promise((r) => setTimeout(r, 450))
    if (
      trimmed === MOCK_ADMIN_EMAIL.toLowerCase() &&
      password === MOCK_ADMIN_PASSWORD
    ) {
      const next: AuthUser = {
        email: MOCK_ADMIN_EMAIL,
        name: 'مدير المتجر',
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setUser(next)
      return { ok: true }
    }
    return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user != null,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('يجب استخدام useAuth داخل AuthProvider')
  return ctx
}
