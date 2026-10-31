import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import { ResultsToolbar } from '../components/ResultsToolbar'
import { Pagination } from '../components/Pagination'
import type { ProductFilters } from '../types/productFilters'
import { ShopLayout } from '../components/ShopLayout'

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductFilters => ({
    categoryId: search.categoryId ? Number(search.categoryId) : undefined,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: typeof search.sort === 'string' ? search.sort : undefined,
    size: search.size ? Number(search.size) : undefined,
    page: search.page ? Number(search.page) : 0,
    search: search.search != null && search.search != '' ? String(search.search): undefined,
  }),
  component: ProductsPage,
})

function ProductsPage() {
  const filters = Route.useSearch()
  const navigate = Route.useNavigate()

  const products = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  })

  function updateFilters(changes: Partial<ProductFilters>) {
    navigate({ search: (prev) => ({ ...prev, page: 0, ...changes }) })
  }

  return (
     <ShopLayout filters={filters} onChange={updateFilters}>
    <section>
      <h1 className="mb-4 text-2xl font-bold text-olive">{filters.search ? `Αποτελέσματα για «${filters.search}»` : 'Προϊόντα'}</h1>
      {products.isPending && <p>Φόρτωση...</p>}
      {products.error && <p>Σφάλμα: {products.error.message}</p>}
      {products.data && (
        <>
          <ResultsToolbar filters={filters} result={products.data} onChange={updateFilters} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.data.content.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              page={products.data.number}
              totalPages={products.data.totalPages}
              onPageChange={(page) => updateFilters({ page })}
            />
          </>
        )}
      </section>
    </ShopLayout>
  )
}