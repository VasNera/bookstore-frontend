import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedProducts } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import { fetchLatestReviews } from '../api/reviews'
import { ReviewList } from '../components/ReviewList'



export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const products = useQuery({
    queryKey: ['products', ' featured'],
    queryFn: fetchFeaturedProducts
  })

  const reviews = useQuery({
    queryKey: ['reviews', 'latest'],
    queryFn: fetchLatestReviews
  }) 

  return (
    <div className='grid gap-8 lg:grid-cols-3'>
    <section className="lg:col-span-2">
      <h2 className='mb-4 text-2xl font-bold text-olive'>Προτάσεις</h2>
      {products.isPending && <p>Φόρτωση...</p>}
      {products.error && <p>Σφάλμα:{products.error.message}</p>}
      {products.data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.data.content.map((product) =>(
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      )}

    </section>

    <aside>
      <h2 className='mb-4 text-2xl font-bold text-olive'>Κριτικές</h2>
      {reviews.isPending && <p>Φόρτωση...</p>}
      {reviews.error && <p>Σφάλμα:{reviews.error.message}</p>}
      {reviews.data && <ReviewList reviews={reviews.data.content}/>}

    </aside>
  
    </div>
  )
}