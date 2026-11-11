import type { Category } from '../types/category'
import { apiDelete, apiPost, apiPut } from './client'

export interface CategoryRequest {
  name: string
  parentCategoryId?: number
}

export function createCategory(data: CategoryRequest) {
  return apiPost<Category>('/admin/categories', data)
}

export function updateCategory(id: number, data: CategoryRequest) {
  return apiPut<Category>(`/admin/categories/${id}`, data)
}

export function deleteCategory(id: number) {
  return apiDelete<void>(`/admin/categories/${id}`)
}
