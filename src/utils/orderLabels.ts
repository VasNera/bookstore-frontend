import type { OrderStatus, PaymentStatus } from '../types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Σε αναμονή',
  CONFIRMED: 'Επιβεβαιωμένη',
  SHIPPED: 'Απεστάλη',
  DELIVERED: 'Παραδόθηκε',
  CANCELLED: 'Ακυρώθηκε',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Εκκρεμεί',
  PAID: 'Πληρώθηκε',
  FAILED: 'Απέτυχε',
  REFUNDED: 'Επιστράφηκε',
}

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ['PAID', 'FAILED'],
  PAID: ['REFUNDED'],
  FAILED: [],
  REFUNDED: [],
}