export type Availability = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface ProductSummary{
    id: number
    title: string
    price: number
    discountPrice: number | null
    availability: Availability
    imageUrl: string
}