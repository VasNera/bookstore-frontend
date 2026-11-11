import type { Page } from '../types/page'
import type { ProductSummary } from '../types/product'
import { PRODUCT_TYPE_PATH, type ProductType } from '../types/adminProduct'
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './client'

export function createProduct(type: ProductType, payload: unknown) {
  return apiPost<ProductSummary>(`/admin/${PRODUCT_TYPE_PATH[type]}`, payload)
}

export function updateProduct(type: ProductType, id: number, payload: unknown) {
  return apiPut<ProductSummary>(`/admin/${PRODUCT_TYPE_PATH[type]}/${id}`, payload)
}

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
