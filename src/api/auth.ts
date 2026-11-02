import type { AuthRequest, AuthResponse, RegisterRequest } from "../types/auth";
import { apiPost } from "./client";

export function login(credentials:AuthRequest){
    return apiPost<AuthResponse>('/auth/login', credentials)
}

export function register(data: RegisterRequest){
    return apiPost<unknown>('/auth/register', data)
}