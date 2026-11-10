export type OrderDocumentType = "RECEIPT" | "INVOICE"
export type PaymentMethod = "CASH_ON_DELIVERY" | "CARD" | "PAYPAL" |"BANK_TRANSFER"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface OrderRequest {
  documentType: OrderDocumentType
  paymentMethod: PaymentMethod
  billingBusinessName?: string
  billingTaxNumber?: string
  billingStreet?: string
  billingProfession?: string
  billingTaxOffice?: string
  shippingStreet: string
  shippingCity: string
  shippingPostalCode: string
  notes?: string
}

export interface OrderItem {
  productId: number
  productTitle: string
  priceAtPurchase: number
  quantity: number
  subtotal: number
}

export interface Order {
  orderNumber: string
  createdAt: string
  documentType: OrderDocumentType
  orderStatus: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  billingBusinessName: string | null
  billingTaxNumber: string | null
  billingStreet: string | null
  billingProfession: string | null
  billingTaxOffice: string | null
  shippingStreet: string
  shippingCity: string
  shippingPostalCode: string
  notes: string | null
  totalAmount: number
  items: OrderItem[]
}

export interface OrderSummary {
  orderNumber: string
  createdAt: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
}
