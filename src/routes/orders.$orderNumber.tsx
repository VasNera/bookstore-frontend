import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ApiError } from '../api/client'
import { cancelOrder, fetchOrder } from '../api/orders'
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../utils/orderLabels'

export const Route = createFileRoute('/orders/$orderNumber')({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderNumber } = Route.useParams()
  const queryClient = useQueryClient()

  const order = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => fetchOrder(orderNumber),
  })

  const cancel = useMutation({
    mutationFn: () => cancelOrder(orderNumber),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', orderNumber], updated)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (order.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (order.error) return <p>Δεν βρέθηκε η παραγγελία.</p>

  const o = order.data
  const cancelError =
    cancel.error instanceof ApiError ? cancel.error.message : cancel.error ? 'Κάτι πήγε στραβά.' : null

  return (
    <div className="space-y-6 text-brown">
      <Link to="/orders" className="text-sm hover:text-olive">← Όλες οι παραγγελίες</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-olive">Παραγγελία {o.orderNumber}</h1>
        <p>{new Date(o.createdAt).toLocaleDateString('el-GR')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <p>Κατάσταση: <b>{ORDER_STATUS_LABELS[o.orderStatus]}</b></p>
        <p>Πληρωμή: <b>{PAYMENT_STATUS_LABELS[o.paymentStatus]}</b></p>
        <p>Αποστολή: {o.shippingStreet}, {o.shippingCity} {o.shippingPostalCode}</p>
        <p>Παραστατικό: {o.documentType === 'INVOICE' ? 'Τιμολόγιο' : 'Απόδειξη'}</p>
      </div>

      <ul className="divide-y divide-brown/20 rounded-lg border border-brown/20 bg-white/60">
        {o.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 p-4">
            <span>{item.quantity} × {item.productTitle}</span>
            <span>{item.subtotal.toFixed(2)} €</span>
          </li>
        ))}
      </ul>

      <p className="text-right text-xl">
        Σύνολο: <span className="font-bold text-olive">{o.totalAmount.toFixed(2)} €</span>
      </p>

      {cancelError && <p className="text-sm text-red-700">{cancelError}</p>}

      {o.orderStatus === 'PENDING' && (
        <button
          onClick={() => {
            if (window.confirm('Θέλεις σίγουρα να ακυρώσεις την παραγγελία;')) cancel.mutate()
          }}
          disabled={cancel.isPending}
          className="rounded border border-red-700 px-5 py-2 text-red-700 disabled:opacity-60"
        >
          {cancel.isPending ? 'Ακύρωση...' : 'Ακύρωση παραγγελίας'}
        </button>
      )}
    </div>
  )
}