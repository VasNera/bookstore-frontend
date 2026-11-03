import type { ProductSummary} from './product'


export interface CartItem {
    id: number
    product: ProductSummary
    quantity: number
    subtotal: number
}

export interface Cart{
    id: number
    items: CartItem[]
    totalAmount: number
}