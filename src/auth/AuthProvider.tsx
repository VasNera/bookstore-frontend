import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AUTH_EXPIRED_EVENT, tokenStorage } from '../api/client'
import type { AuthResponse } from '../types/auth'
import { AuthContext, type AuthUser } from './auth-context'

const USER_KEY = 'user'

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw || !tokenStorage.get()) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)
  const queryClient = useQueryClient()

  function signIn(response: AuthResponse) {
    tokenStorage.set(response.token)
    const nextUser = { username: response.username, role: response.role }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const signOut = useCallback(() => {
    tokenStorage.clear()
    localStorage.removeItem(USER_KEY)
    queryClient.removeQueries({ queryKey: ['cart'] })
    queryClient.removeQueries({ queryKey: ['favourites'] })
    queryClient.removeQueries({ queryKey: ['profile'] })
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['order'] })
    setUser(null)
  }, [queryClient])

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, signOut)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, signOut)
  }, [signOut])

  return <AuthContext value={{ user, signIn, signOut }}>{children}</AuthContext>
}