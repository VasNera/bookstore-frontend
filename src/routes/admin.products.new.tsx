import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createProduct } from '../api/adminProducts'
import { ProductForm } from '../components/ProductForm'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/adminProduct'

export const Route = createFileRoute('/admin/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [type, setType] = useState<ProductType>('BOOK')

  const mutation = useMutation({
    mutationFn: (payload: Record<string, string | number | boolean | undefined>) =>
      createProduct(type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-featured-ids'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/admin/products' })
    },
  })

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/admin/products" className="text-sm text-brown hover:text-olive">← Όλα τα προϊόντα</Link>
      <h1 className="text-2xl font-bold text-olive">Νέο προϊόν</h1>

      <div>
        <label htmlFor="type" className="mb-1 block text-brown">Τύπος προϊόντος</label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as ProductType)
            mutation.reset()
          }}
          className="w-full rounded border border-brown/30 bg-white px-3 py-2"
        >
          {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
            <option key={t} value={t}>{PRODUCT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* το key ξαναφτιάχνει τη φόρμα (άδεια πεδία) όταν αλλάζει ο τύπος */}
      <ProductForm
        key={type}
        type={type}
        submitLabel="Δημιουργία"
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={(payload) => mutation.mutate(payload)}
      />
    </div>
  )
}
