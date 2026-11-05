import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/auth-context'
import { useCartActions } from '../hooks/useCart'


interface AddToCartProps{
    productId: number
    stock: number
}

export function AddToCart({productId, stock}: AddToCartProps){
    const { user } = useAuth()
    const { add } = useCartActions()
    const [ quantity, setQuantity] = useState(1)

    if( stock <=0) {
        return <p className="font-medium text-red-700">Εξαντλημένο</p>
    }

    if(!user) {
        return(
          <Link
        to="/login"
        className="inline-block rounded bg-olive px-5 py-2 font-medium text-white"
      >
        Συνδέσου για να το προσθέσεις στο καλάθι
      </Link>
        )
    }

    let error: string | null = null
    if(add.error instanceof ApiError) error = add.error.message
     else if (add.error) error = 'Κάτι πήγε στραβά. Δοκίμασε ξανά.'

     return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 rounded border border-brown/30 bg-white px-3 py-2"
        />
        <button
          onClick={() => add.mutate({ productId, quantity })}
          disabled={add.isPending || quantity < 1}
          className="rounded bg-olive px-5 py-2 font-medium text-white disabled:opacity-60"
        >
          {add.isPending ? 'Προσθήκη...' : 'Προσθήκη στο καλάθι'}
        </button>
      </div>
      {add.isSuccess && <p className="text-sm text-olive">Προστέθηκε στο καλάθι.</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  )
}

