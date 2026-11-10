import type { Page } from '../types/page'
import type { ProductSummary } from '../types/product'
import { apiDelete, apiGet, apiPatch } from './client'

export function fetchAdminProducts(page: number, search?: string) {
  const params = new URLSearchParams({ page: String(page), size: '10' })
  if (search) params.set('search', search)
  return apiGet<Page<ProductSummary>>(`/products?${params}`)
}

// Το ProductSummary δεν έχει πεδίο featured, οπότε φέρνουμε τη λίστα των προτεινόμενων
export function fetchFeaturedIds() {
  return apiGet<Page<ProductSummary>>('/products?featured=true&size=100').then((page) =>
    page.content.map((p) => p.id),
  )
}

export function toggleFeatured(productId: number) {
  return apiPatch<void>(`/admin/products/${productId}/featured`)
}

export function deleteProduct(productId: number) {
  return apiDelete<void>(`/admin/products/${productId}`)
}
