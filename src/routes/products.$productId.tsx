import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '../api/products'
import { fetchProductReviews } from '../api/reviews'
import { ReviewList } from '../components/ReviewList'
import type { Availability } from '../types/product'

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
})

const availabilityLabel:Record<Availability, string> = {

  IN_STOCK: 'Διαθέσιμο',
  LOW_STOCK: 'Μικρό Απόθεμα',
  OUT_OF_STOCK: 'Εξαντλημένο'
}

function ProductPage(){
  const { productId } = Route.useParams()

  const product = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  })

  const reviews = useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn:() => fetchProductReviews(productId)
  })

  if(product.isPending) return <p>Φόρτωση...</p>
  if(product.error) return <p>Δεν βρέθηκε το προιόν</p>

  const p = product.data

  const specs: [string, string | number | null | undefined][] = [
    ['Συγγραφέας', p.author],
    ['Εκδότης', p.publisher],
    ['ISBN', p.isbn],
    ['Σελίδες', p.pages],
    ['Έτος έκδοσης', p.releaseYear],
    ['Καλλιτέχνης', p.artist],
    ['Δισκογραφική', p.productionCompany],
    ['Ήλικίες', p.ageRange],
    ['Εταρεία', p.company],
    ['Διαστάσεις', p.dimensions],
    ['Κωδικός', p.sku]
  ]

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-[20rem_1fr]">
        <img src={p.imageUrl} alt={p.title} className="w-full rounded-lg object-cover" />

        <div>
          <p className="text-sm text-brown/70">{p.categoryName}</p>
          <h1 className="mb-4 text-3xl font-bold text-olive">{p.title}</h1>

          <div className="mb-2 flex items-baseline gap-3">
            {p.discountPrice !== null ? (
              <>
                <span className="text-3xl font-bold text-olive">{p.discountPrice.toFixed(2)} €</span>
                <span className="text-lg text-brown/60 line-through">{p.price.toFixed(2)} €</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-brown">{p.price.toFixed(2)} €</span>
            )}
          </div>

          <p className="mb-6 text-brown">
            {availabilityLabel[p.availability]} · {p.stock} τεμάχια
          </p>

          {p.description && <p className="mb-6 text-brown">{p.description}</p>}

          <dl className="grid grid-cols-[10rem_1fr] gap-y-1 text-brown">
            {specs
              .filter(([, value]) => value != null)
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="font-medium">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-olive">Κριτικές</h2>
        {reviews.isPending && <p>Φόρτωση...</p>}
        {reviews.data && reviews.data.content.length === 0 && (
          <p className="text-brown">Δεν υπάρχουν ακόμα κριτικές για αυτό το προϊόν.</p>
        )}
        {reviews.data && reviews.data.content.length > 0 && (
          <ReviewList reviews={reviews.data.content} />
        )}
      </section>
    </div>
  )
}

