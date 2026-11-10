export interface Review{
    id: number
    comment: string
    rating: number
    authorName: string
    createdAt: string
    productTitle: string

}

export interface ReviewRequest {
    rating: number
    comment: string
}