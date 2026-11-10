import type { ProductSummary } from '../types/product'
import { apiDelete, apiGet, apiPost } from './client'

export function fetchFavourites() {
  return apiGet<ProductSummary[]>('/favourites')
}

export function addFavourite(productId: number) {
  return apiPost<void>(`/favourites/${productId}`)
}

export function removeFavourite(productId: number) {
  return apiDelete<void>(`/favourites/${productId}`)
}