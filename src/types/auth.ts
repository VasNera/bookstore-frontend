export interface AuthRequest {
    username: string
    password: string
}

export interface AuthResponse {
    username: string 
    role: string
    token: string
}

export interface RegisterRequest {
    username: string
    password: string
    firstname: string
    lastname: string
    phone: string
    email: string
}