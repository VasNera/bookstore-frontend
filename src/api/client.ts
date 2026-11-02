const API_URL = import.meta.env.VITE_API_URL

const TOKEN_KEY = 'token'

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token:string) => localStorage.setItem(TOKEN_KEY,token),
    clear: () => localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
    status: number
    code: string
    errors?: Record<string, string> 


 constructor(status: number, code: string, message: string, errors?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.errors = errors
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = tokenStorage.get()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      data?.code ?? 'UNKNOWN',
      data?.message ?? `Request failed with status ${response.status}`,
      data?.errors,
    )
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export function apiGet<T>(path: string) {
  return request<T>('GET', path)
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>('POST', path, body)
}

export function apiPatch<T>(path: string, body?: unknown){
  return request<T>('PATCH',path, body)
}

export function apiDelete<T>(path: string){
  return request<T>('DELETE',path)
}