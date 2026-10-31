export type Availability = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface ProductSummary{
    id: number
    title: string
    price: number
    discountPrice: number | null
    availability: Availability
    imageUrl: string
}

export interface productDetail{
    id: number
    title: string
    sku: string
    price: number
    discountPrice: number | null
    stock: number
    availability: Availability
    imageUrl: string
    description: string | null
    categoryName: string
    dimensions?: string | null
    isbn?: string
    pages?: number | null
    author?: string
    releaseYear?: number | null
    publisher?: string 
    artist?: string
    productionCompany?: string
    ageRange?: string
    company?: string
}