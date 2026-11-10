import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const isAdmin = useIsAdmin()
  useDocumentTitle('Διαχείριση')

  if (!isAdmin) {
    return (
      <p className="py-10 text-center text-brown">
        Δεν έχεις πρόσβαση σε αυτή τη σελίδα.
      </p>
    )
  }

  const linkClass = 'rounded px-3 py-2 text-brown hover:bg-olive/10'

  return (
    <div className="grid gap-8 lg:grid-cols-[12rem_1fr]">
      <nav className="flex gap-2 lg:flex-col">
        <Link to="/admin/orders" className={linkClass} activeProps={{ className: `${linkClass} bg-olive/20 font-bold` }}>
          Παραγγελίες
        </Link>
        <Link to="/admin/products" className={linkClass} activeProps={{ className: `${linkClass} bg-olive/20 font-bold` }}>
          Προϊόντα
        </Link>
        <Link to="/admin/categories" className={linkClass} activeProps={{ className: `${linkClass} bg-olive/20 font-bold` }}>
          Κατηγορίες
        </Link>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  )
}