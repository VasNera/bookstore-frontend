import type { Page } from "../types/page"
import type { Review } from "../types/review"
import { apiGet } from "./client"

export function fetchLatestReviews(){
    return apiGet<Page<Review>>('/reviews/latest')
}