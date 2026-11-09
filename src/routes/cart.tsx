import { createFileRoute, Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/auth-context'
import { useCart, useCartActions } from '../hooks/useCart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage(){
    const { user } = useAuth()
    const cart = useCart()
    const {update ,remove} = useCartActions()

    if (!user) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Συνδέσου για να δεις το καλάθι σου.</p>
        <Link to="/login" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Σύνδεση
        </Link>
      </div>
    )
  }

  if (cart.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (cart.error) return <p>Δεν ήταν δυνατή η φόρτωση του καλαθιού.</p>

  const { items, totalAmount } = cart.data

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Το καλάθι σου είναι άδειο.</p>
        <Link to="/products" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Δες τα προϊόντα
        </Link>
      </div>
    )
  }

  const actionError = update.error ?? remove.error
  const errorMessage =
    actionError instanceof ApiError ? actionError.message : actionError ? 'Κάτι πήγε στραβά.' : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-olive">Το καλάθι μου</h1>

      <ul className="divide-y divide-brown/20 rounded-lg border border-brown/20 bg-white/60">
        {items.map((item) => {
          const unitPrice = item.product.discountPrice ?? item.product.price
          return (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="h-24 w-16 rounded object-cover"
              />

              <div className="flex-1">
                <Link
                  to="/products/$productId"
                  params={{ productId: String(item.product.id) }}
                  className="font-medium text-brown hover:text-olive"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-brown/70">{unitPrice.toFixed(2)} € το τεμάχιο</p>
              </div>

              <div className="flex items-center gap-2 text-brown">
                <button
                  disabled={item.quantity <= 1 || update.isPending}
                  onClick={() =>
                    update.mutate({ productId: item.product.id, quantity: item.quantity - 1 })
                  }
                  className="h-8 w-8 rounded border border-brown/30 disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  disabled={update.isPending}
                  onClick={() =>
                    update.mutate({ productId: item.product.id, quantity: item.quantity + 1 })
                  }
                  className="h-8 w-8 rounded border border-brown/30 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-bold text-olive">{item.subtotal.toFixed(2)} €</p>

              <button
               onClick={() => remove.mutate({ productId: item.product.id })}
                disabled={remove.isPending}
                aria-label="Αφαίρεση"
                className="text-brown/60 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </li>
          )
        })}
      </ul>

      {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

      <div className="flex items-center justify-between">
        <p className="text-xl text-brown">
          Σύνολο: <span className="font-bold text-olive">{totalAmount.toFixed(2)} €</span>
        </p>
        <button
          disabled
          className="rounded bg-olive px-6 py-2 font-medium text-white disabled:opacity-60"
        >
          Ολοκλήρωση παραγγελίας
        </button>
      </div>
    </div>
  )
}

