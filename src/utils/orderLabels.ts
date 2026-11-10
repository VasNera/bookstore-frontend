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