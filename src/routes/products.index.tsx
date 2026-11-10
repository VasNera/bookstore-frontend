import { createFileRoute } from '@tanstack/react-router'
import { CategoryCard } from '../components/CategoryCard'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import { ProductCard } from '../components/ProductCard'
import { ResultsToolbar } from '../components/ResultsToolbar'
import { Pagination } from '../components/Pagination'
import { ShopLayout } from '../components/ShopLayout'
import { useCategories } from '../hooks/useCategories'
import type { ProductFilters } from '../types/productFilters'

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductFilters => ({
    categoryId: search.categoryId ? Number(search.categoryId) : undefined,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: typeof search.sort === 'string' ? search.sort : undefined,
    size: search.size ? Number(search.size) : undefined,
    page: search.page ? Number(search.page) : 0,
    search: search.search != null && search.search != '' ? String(search.search) : undefined,
  }),
  component: ProductsPage,
})

function ProductsPage() {
  const filters = Route.useSearch()
  const navigate = Route.useNavigate()
  const categories = useCategories()

  const selectedCategory = categories.data?.find((c) => c.id === filters.categoryId)
  const showSubcategories =
    selectedCategory != null && selectedCategory.subCategories.length > 0 && !filters.search

  const products = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    enabled: !showSubcategories,
  })

  function updateFilters(changes: Partial<ProductFilters>) {
    navigate({ search: (prev) => ({ ...prev, page: 0, ...changes }) })
  }

  if (showSubcategories) {
    return (
      <ShopLayout filters={filters} onChange={updateFilters}>
        <section>
          <h1 className="mb-4 text-2xl font-bold text-olive">{selectedCategory.name}</h1>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {selectedCategory.subCategories.map((sub) => (
              <CategoryCard key={sub.id} category={sub} />
            ))}
          </div>
        </section>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout filters={filters} onChange={updateFilters}>
      <section>
        <h1 className="mb-4 text-2xl font-bold text-olive">
          {filters.search ? `Αποτελέσματα για «${filters.search}»` : 'Προϊόντα'}
        </h1>
        {products.isPending && <p>Φόρτωση...</p>}
        {products.error && <p>Σφάλμα: {products.error.message}</p>}
        {products.data && (
          <>
            <ResultsToolbar filters={filters} result={products.data} onChange={updateFilters} />
            {products.data.content.length === 0 ? (
              <p className="py-10 text-center text-brown">
                Δεν βρέθηκαν προϊόντα. Δοκίμασε άλλα φίλτρα ή άλλη αναζήτηση.
              </p>
            ) : (
              <>
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
          </>
        )}
      </section>
    </ShopLayout>
  )
}