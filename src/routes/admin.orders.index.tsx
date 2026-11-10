import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { fetchAdminOrders } from '../api/adminOrders'
import { Pagination } from '../components/Pagination'
import type { OrderStatus } from '../types/order'
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../utils/orderLabels'

export const Route = createFileRoute('/admin/orders/')({
  component: AdminOrdersPage,
})

function AdminOrdersPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<OrderStatus | ''>('')

  const orders = useQuery({
    queryKey: ['admin-orders', page, status],
    queryFn: () => fetchAdminOrders(page, status || undefined),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-olive">Παραγγελίες</h1>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | '')
            setPage(0)
          }}
          className="rounded border border-brown/30 bg-white px-3 py-2"
        >
          <option value="">Όλες οι καταστάσεις</option>
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {orders.isPending && <p>Φόρτωση...</p>}
      {orders.error && <p>Δεν ήταν δυνατή η φόρτωση των παραγγελιών.</p>}

      {orders.data && orders.data.content.length === 0 && (
        <p className="py-6 text-center text-brown">Δεν βρέθηκαν παραγγελίες.</p>
      )}

      {orders.data && orders.data.content.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-brown/20 bg-white/60">
            <table className="w-full text-left text-brown">
              <thead className="border-b border-brown/20 text-sm">
                <tr>
                  <th className="p-3">Αριθμός</th>
                  <th className="p-3">Ημερομηνία</th>
                  <th className="p-3">Κατάσταση</th>
                  <th className="p-3">Πληρωμή</th>
                  <th className="p-3 text-right">Σύνολο</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.content.map((order) => (
                  <tr key={order.orderNumber} className="border-b border-brown/10 hover:bg-olive/5">
                    <td className="p-3">
                      <Link
                        to="/admin/orders/$orderNumber"
                        params={{ orderNumber: order.orderNumber }}
                        className="font-medium text-olive hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString('el-GR')}</td>
                    <td className="p-3">{ORDER_STATUS_LABELS[order.orderStatus]}</td>
                    <td className="p-3">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</td>
                    <td className="p-3 text-right font-bold">{order.totalAmount.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={orders.data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
