import { createContext, useContext } from "react";
import type{ AuthResponse } from "../types/auth";

export interface AuthUser {
    username: string 
     role: string
}

export interface AuthContextValue {
    user: AuthUser | null
    signIn: (response: AuthResponse) => void
    signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(){
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
        return context
}
