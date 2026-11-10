import type { Page } from "../types/page"
import type { Review, ReviewRequest } from "../types/review"
import { apiGet,apiPost } from "./client"

export function fetchLatestReviews(){
    return apiGet<Page<Review>>('/reviews/latest')
}

export function fetchProductReviews(productId:string){
    return apiGet<Page<Review>>(`/products/${productId}/reviews`)
}

export function createReview(productId: string, data: ReviewRequest){
    return apiPost<Review>(`/products/${productId}/reviews`, data)
}