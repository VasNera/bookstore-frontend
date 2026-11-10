import type { Order, OrderStatus, OrderSummary, PaymentStatus } from '../types/order'
import type { Page } from '../types/page'
import { apiGet, apiPatch } from './client'

export function fetchAdminOrders(page: number, status?: OrderStatus) {
  const params = new URLSearchParams({ page: String(page), sort: 'createdAt,desc' })
  if (status) params.set('status', status)
  return apiGet<Page<OrderSummary>>(`/admin/orders?${params}`)
}

export function fetchAdminOrder(orderNumber: string) {
  return apiGet<Order>(`/admin/orders/${orderNumber}`)
}

export function updateOrderStatus(orderNumber: string, orderStatus: OrderStatus) {
  return apiPatch<Order>(`/admin/orders/${orderNumber}/status`, { orderStatus })
}

export function updatePaymentStatus(orderNumber: string, paymentStatus: PaymentStatus) {
  return apiPatch<Order>(`/admin/orders/${orderNumber}/payment-status`, { paymentStatus })
}