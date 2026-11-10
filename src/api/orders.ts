import type { Order, OrderRequest } from '../types/order'
import { apiPost } from './client'

export function createOrder(data: OrderRequest) {
  return apiPost<Order>('/orders', data)
}