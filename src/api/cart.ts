import type { Cart } from '../types/cart'
import { apiDelete, apiGet, apiPatch, apiPost } from './client'

export function fetchCart(){
    return apiGet<Cart>('/cart')
}

export function addToCart(productId: number, quantity: number){
    return apiPost<Cart>('/cart/items', {productId, quantity})
}

export function updateCartItem(productId: number, quantity: number){
    return apiPatch<Cart>('/cart/items/${productId}', {quantity})
}

export function removeCartItem(productId: number){
    return apiDelete<Cart>('/cart/items/${productId')
}

export function clearCart(){
    return apiDelete<void>('/cart')
}