import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedProducts } from '../api/products'
import { fetchLatestReviews } from '../api/reviews'
import { ProductCard } from '../components/ProductCard'
import { ReviewCarousel } from '../components/ReviewCarousel'
import { ShopLayout } from '../components/ShopLayout'
import type { ProductFilters } from '../types/productFilters'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()

  const products = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
  })
  const reviews = useQuery({
    queryKey: ['reviews', 'latest'],
    queryFn: fetchLatestReviews,
  })

  function goToProducts(changes: Partial<ProductFilters>) {
    navigate({ to: '/products', search: { page: 0, ...changes } })
  }

  return (
    <ShopLayout filters={{}} onChange={goToProducts}>
      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-olive">Προτάσεις</h2>
          {products.isPending && <p>Φόρτωση...</p>}
          {products.error && <p>Σφάλμα: {products.error.message}</p>}
          {products.data && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.data.content.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-center text-2xl font-bold text-olive">Κριτικές</h2>
          {reviews.isPending && <p>Φόρτωση...</p>}
          {reviews.error && <p>Σφάλμα: {reviews.error.message}</p>}
          {reviews.data && <ReviewCarousel reviews={reviews.data.content} />}
        </section>
      </div>
    </ShopLayout>
  )
}