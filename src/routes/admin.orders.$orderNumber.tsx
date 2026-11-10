import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ApiError } from '../api/client'
import { fetchAdminOrder, updateOrderStatus, updatePaymentStatus } from '../api/adminOrders'
import type { Order } from '../types/order'
import {
  ORDER_STATUS_LABELS,
  ORDER_TRANSITIONS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TRANSITIONS,
} from '../utils/orderLabels'

export const Route = createFileRoute('/admin/orders/$orderNumber')({
  component: AdminOrderDetailPage,
})

function AdminOrderDetailPage() {
  const { orderNumber } = Route.useParams()
  const queryClient = useQueryClient()

  const order = useQuery({
    queryKey: ['admin-order', orderNumber],
    queryFn: () => fetchAdminOrder(orderNumber),
  })

  function onSuccess(updated: Order) {
    queryClient.setQueryData(['admin-order', orderNumber], updated)
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
  }

  const statusMutation = useMutation({
    mutationFn: (status: Order['orderStatus']) => updateOrderStatus(orderNumber, status),
    onSuccess,
  })
  const paymentMutation = useMutation({
    mutationFn: (status: Order['paymentStatus']) => updatePaymentStatus(orderNumber, status),
    onSuccess,
  })

  if (order.isPending) return <p>Φόρτωση...</p>
  if (order.error) return <p>Δεν βρέθηκε η παραγγελία.</p>

  const o = order.data
  const actionError = statusMutation.error ?? paymentMutation.error
  const errorMessage =
    actionError instanceof ApiError ? actionError.message : actionError ? 'Κάτι πήγε στραβά.' : null

  const nextStatuses = ORDER_TRANSITIONS[o.orderStatus]
  // Σε ακυρωμένη παραγγελία το backend δεν επιτρέπει αλλαγή πληρωμής
  const nextPayments = o.orderStatus === 'CANCELLED' ? [] : PAYMENT_TRANSITIONS[o.paymentStatus]
  const busy = statusMutation.isPending || paymentMutation.isPending

  return (
    <div className="space-y-6 text-brown">
      <Link to="/admin/orders" className="text-sm hover:text-olive">← Όλες οι παραγγελίες</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-olive">Παραγγελία {o.orderNumber}</h1>
        <p>{new Date(o.createdAt).toLocaleDateString('el-GR')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <p>Κατάσταση: <b>{ORDER_STATUS_LABELS[o.orderStatus]}</b></p>
        <p>Πληρωμή: <b>{PAYMENT_STATUS_LABELS[o.paymentStatus]}</b></p>
        <p>Αποστολή: {o.shippingStreet}, {o.shippingCity} {o.shippingPostalCode}</p>
        <p>Παραστατικό: {o.documentType === 'INVOICE' ? 'Τιμολόγιο' : 'Απόδειξη'}</p>
        {o.documentType === 'INVOICE' && (
          <p className="sm:col-span-2">
            {o.billingBusinessName} · ΑΦΜ {o.billingTaxNumber} · {o.billingTaxOffice} · {o.billingProfession} · {o.billingStreet}
          </p>
        )}
        {o.notes && <p className="sm:col-span-2">Σημειώσεις: {o.notes}</p>}
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

      {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

      <section className="space-y-2">
        <h2 className="font-bold">Αλλαγή κατάστασης παραγγελίας</h2>
        {nextStatuses.length === 0 ? (
          <p className="text-sm text-brown/70">Η παραγγελία είναι σε τελική κατάσταση.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => statusMutation.mutate(s)}
                className={`rounded px-4 py-2 font-medium disabled:opacity-60 ${
                  s === 'CANCELLED' ? 'border border-red-700 text-red-700' : 'bg-olive text-white'
                }`}
              >
                → {ORDER_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">Αλλαγή κατάστασης πληρωμής</h2>
        {nextPayments.length === 0 ? (
          <p className="text-sm text-brown/70">Δεν υπάρχουν διαθέσιμες αλλαγές.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {nextPayments.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => paymentMutation.mutate(s)}
                className="rounded bg-olive px-4 py-2 font-medium text-white disabled:opacity-60"
              >
                → {PAYMENT_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}