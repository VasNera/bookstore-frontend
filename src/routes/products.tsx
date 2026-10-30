import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import type { ProductFilters } from '../types/productFilters'


export const Route = createFileRoute('/products') ({
    validateSearch: (search: Record<string, unknown>):ProductFilters => ({
        categoryId: search.categoryId ? Number (search.categoryId):undefined,
        page: search.page ? Number(search.page): 0,
    }),
    component: ProductsPage
})

function ProductsPage(){
    const filters = Route.useSearch()
    const products = useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
    })

    return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-olive">Προϊόντα</h1>
      {products.isPending && <p>Φόρτωση...</p>}
      {products.error && <p>Σφάλμα: {products.error.message}</p>}
      {products.data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {products.data.content.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

