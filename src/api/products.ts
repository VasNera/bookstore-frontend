import type { Page } from "../types/page"
import type { productDetail, ProductSummary } from "../types/product";
import { apiGet } from "./client";
import type { ProductFilters } from "../types/productFilters";

export function fetchFeaturedProducts(){
    return apiGet<Page<ProductSummary>>('/products?featured=true')
}

export function fetchProducts(filters: ProductFilters){
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) =>{
        if( value !== undefined)params.set(key, String(value))
    })
return apiGet<Page<ProductSummary>>(`/products?${params}`)
}

export function fetchProduct(id: string){
    return apiGet<productDetail>(`/products/${id}`)
}


