import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToCart, fetchCart, removeCartItem, updateCartItem } from '../api/cart'
import { useAuth } from '../auth/auth-context'
import type { Cart } from '../types/cart'


export function useCart(){
    const { user } = useAuth()
    return useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: user != null,
    })
}


export function useCartActions(){
    const queryClient = useQueryClient()
    const onSuccess = (cart:Cart) => queryClient.setQueryData(['cart'], cart)


const add = useMutation({
    mutationFn: (vars:{productId: number, quantity:number}) =>
        addToCart(vars.productId, vars.quantity),
    onSuccess,
})

const update = useMutation({
    mutationFn: (vars: {productId: number, quantity:number}) =>
        updateCartItem(vars.productId,vars.quantity),
    onSuccess,
})

const remove = useMutation({
    mutationFn:(vars: { productId:number}) =>
        removeCartItem(vars.productId),
    onSuccess,
  })

  return {add, update, remove}
}
