import { useState, type ReactNode} from 'react'
import { tokenStorage } from '../api/client'
import type { AuthResponse } from '../types/auth'
import { AuthContext, type AuthUser } from './auth-context'

const USER_KEY = 'user'

function loadUser(): AuthUser | null{
    const raw = localStorage.getItem(USER_KEY)
    if (!raw || !tokenStorage.get()) return null
    try{ 
        return JSON.parse(raw) as AuthUser
    } catch {
        return null
    }
}

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<AuthUser | null>(loadUser)

    function signIn(response:AuthResponse){
        tokenStorage.set(response.token)
        const nextUser = {username:response.username, role: response.role}
        localStorage.setItem(USER_KEY,JSON.stringify(nextUser))
        setUser(nextUser)
    }

    function signOut(){
        tokenStorage.clear()
        localStorage.removeItem(USER_KEY)
        setUser(null)
    }
     return <AuthContext value={{ user, signIn, signOut }}>{children}</AuthContext>

}
