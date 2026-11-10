import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { fetchMyOrders } from '../api/orders'
import { useAuth } from '../auth/auth-context'
import { Pagination } from '../components/Pagination'
import { ORDER_STATUS_LABELS } from '../utils/orderLabels' 

export const Route = createFileRoute('/orders/')({
  component: OrdersPage,
})

function OrdersPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(0)

  const orders = useQuery({
    queryKey: ['orders', page],
    queryFn: () => fetchMyOrders(page),
    enabled: user != null,
  })

  if (!user) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Συνδέσου για να δεις τις παραγγελίες σου.</p>
        <Link to="/login" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Σύνδεση
        </Link>
      </div>
    )
  }

  if (orders.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (orders.error) return <p>Δεν ήταν δυνατή η φόρτωση των παραγγελιών.</p>

  const { content, totalPages } = orders.data

  if (content.length === 0) {
    return <p className="py-10 text-center text-brown">Δεν έχεις κάνει ακόμα παραγγελίες.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-olive">Οι παραγγελίες μου</h1>

      <ul className="divide-y divide-brown/20 rounded-lg border border-brown/20 bg-white/60">
        {content.map((order) => (
          <li key={order.orderNumber}>
            <Link
              to="/orders/$orderNumber"
              params={{ orderNumber: order.orderNumber }}
              className="flex items-center justify-between gap-4 p-4 text-brown hover:bg-olive/5"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-brown/70">
                  {new Date(order.createdAt).toLocaleDateString('el-GR')}
                </p>
              </div>
              <p className="text-sm">{ORDER_STATUS_LABELS[order.orderStatus]}</p>
              <p className="font-bold text-olive">{order.totalAmount.toFixed(2)} €</p>
            </Link>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
