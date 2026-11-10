import type { Order, OrderRequest, OrderSummary } from '../types/order'
import { apiGet,apiPatch ,apiPost } from './client'
import type { Page } from '../types/page'

export function createOrder(data: OrderRequest) {
  return apiPost<Order>('/orders', data)
}

export function fetchMyOrders(page: number) {
  return apiGet<Page<OrderSummary>>(`/orders?page=${page}&sort=createdAt,desc`)
}

export function fetchOrder(orderNumber: string) {
  return apiGet<Order>(`/orders/${orderNumber}`)
}

export function cancelOrder(orderNumber: string) {
  return apiPatch<Order>(`/orders/${orderNumber}/cancel`)
}