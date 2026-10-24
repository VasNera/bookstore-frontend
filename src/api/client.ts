const API_URL = import.meta.env.VITE_API_URL

export async function apiGet<T>(path: string):Promise<T> {
    const response = await fetch(`${API_URL}${path}`)
    if(!response.ok){
        throw new Error(`Request failed with status ${response.status}`)
    }
    
    return response.json()
}