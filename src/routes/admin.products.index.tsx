import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Star, Trash2 } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'
import {
  deleteProduct,
  fetchAdminProducts,
  fetchFeaturedIds,
  toggleFeatured,
} from '../api/adminProducts'
import { ApiError } from '../api/client'
import { Pagination } from '../components/Pagination'
import type { Availability } from '../types/product'

export const Route = createFileRoute('/admin/products/')({
  component: AdminProductsPage,
})

const AVAILABILITY_LABELS: Record<Availability, string> = {
  IN_STOCK: 'Διαθέσιμο',
  LOW_STOCK: 'Μικρό απόθεμα',
  OUT_OF_STOCK: 'Εξαντλημένο',
}

function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')

  const products = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => fetchAdminProducts(page, search || undefined),
  })

  const featured = useQuery({
    queryKey: ['admin-featured-ids'],
    queryFn: fetchFeaturedIds,
  })

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    queryClient.invalidateQueries({ queryKey: ['admin-featured-ids'] })
    // η δημόσια βιτρίνα (αρχική, λίστες) πρέπει να ενημερωθεί κι αυτή
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const featuredMutation = useMutation({ mutationFn: toggleFeatured, onSuccess: refresh })
  const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: refresh })

  function handleSearch(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setSearch(text.trim())
    setPage(0)
  }

  const actionError = featuredMutation.error ?? deleteMutation.error
  const errorMessage =
    actionError instanceof ApiError ? actionError.message : actionError ? 'Κάτι πήγε στραβά.' : null
  const featuredIds = new Set(featured.data ?? [])
  const busy = featuredMutation.isPending || deleteMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">Προϊόντα</h1>
        <Link
          to="/admin/products/new"
          className="rounded bg-olive px-4 py-2 font-medium text-white"
        >
          + Νέο προϊόν
        </Link>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Αναζήτηση..."
            className="rounded border border-brown/30 bg-white px-3 py-2"
          />
          <button type="submit" className="rounded bg-olive px-4 py-2 font-medium text-white">
            Αναζήτηση
          </button>
        </form>
      </div>

      {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}
      {products.isPending && <p>Φόρτωση...</p>}
      {products.error && <p>Δεν ήταν δυνατή η φόρτωση των προϊόντων.</p>}

      {products.data && products.data.content.length === 0 && (
        <p className="py-6 text-center text-brown">Δεν βρέθηκαν προϊόντα.</p>
      )}

      {products.data && products.data.content.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-brown/20 bg-white/60">
            <table className="w-full text-left text-brown">
              <thead className="border-b border-brown/20 text-sm">
                <tr>
                  <th className="p-3">Προϊόν</th>
                  <th className="p-3">Τιμή</th>
                  <th className="p-3">Διαθεσιμότητα</th>
                  <th className="p-3 text-center">Προτεινόμενο</th>
                  <th className="p-3 text-center">Διαγραφή</th>
                </tr>
              </thead>
              <tbody>
                {products.data.content.map((p) => {
                  const isFeatured = featuredIds.has(p.id)
                  return (
                    <tr key={p.id} className="border-b border-brown/10">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt="" className="h-14 w-10 rounded object-cover" />
                          <Link
                            to="/admin/products/$productId"
                            params={{ productId: String(p.id) }}
                            className="font-medium text-olive hover:underline"
                          >
                            {p.title}
                          </Link>
                        </div>
                      </td>
                      <td className="p-3">
                        {(p.discountPrice ?? p.price).toFixed(2)} €
                      </td>
                      <td className="p-3">{AVAILABILITY_LABELS[p.availability]}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => featuredMutation.mutate(p.id)}
                          disabled={busy}
                          aria-label={isFeatured ? 'Αφαίρεση από προτεινόμενα' : 'Προσθήκη στα προτεινόμενα'}
                          className="disabled:opacity-60"
                        >
                          <Star
                            size={22}
                            className={isFeatured ? 'fill-olive text-olive' : 'text-brown/40'}
                          />
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`Διαγραφή του «${p.title}»;`)) deleteMutation.mutate(p.id)
                          }}
                          disabled={busy}
                          aria-label="Διαγραφή"
                          className="text-brown/60 hover:text-red-700 disabled:opacity-60"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={products.data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
