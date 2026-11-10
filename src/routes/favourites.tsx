import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import { ProductCard } from '../components/ProductCard'
import { useFavourites } from '../hooks/useFavourites'

export const Route = createFileRoute('/favourites')({
  component: FavouritesPage,
})

function FavouritesPage() {
  const { user } = useAuth()
  const favourites = useFavourites()

  if (!user) {
    return (
      <div className="py-10 text-center text-brown">
        <p className="mb-4">Συνδέσου για να δεις τα αγαπημένα σου.</p>
        <Link to="/login" className="rounded bg-olive px-5 py-2 font-medium text-white">
          Σύνδεση
        </Link>
      </div>
    )
  }

  if (favourites.isPending) return <div className="min-h-[50vh]"><p>Φόρτωση...</p></div>
  if (favourites.error) return <p>Δεν ήταν δυνατή η φόρτωση των αγαπημένων.</p>

  if (favourites.data.length === 0) {
    return <p className="py-10 text-center text-brown">Δεν έχεις αγαπημένα ακόμα.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-olive">Τα αγαπημένα μου</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {favourites.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}