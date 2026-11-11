import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { fetchFeaturedIds, updateProduct } from '../api/adminProducts'
import { fetchProduct } from '../api/products'
import { ProductForm } from '../components/ProductForm'
import { useCategories } from '../hooks/useCategories'
import {
  detectType,
  PRODUCT_TYPE_LABELS,
  toFormValues,
} from '../types/adminProduct'

export const Route = createFileRoute('/admin/products/$productId')({
  component: EditProductPage,
})

function EditProductPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const product = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => fetchProduct(productId),
  })
  const categories = useCategories()
  const featured = useQuery({ queryKey: ['admin-featured-ids'], queryFn: fetchFeaturedIds })

  const mutation = useMutation({
    mutationFn: (vars: {
      type: ReturnType<typeof detectType>
      payload: Record<string, string | number | boolean | undefined>
    }) => updateProduct(vars.type, Number(productId), vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] })
      queryClient.invalidateQueries({ queryKey: ['admin-featured-ids'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      navigate({ to: '/admin/products' })
    },
  })

  if (product.isPending || categories.isPending || featured.isPending) return <p>Φόρτωση...</p>
  if (product.error || categories.error || featured.error) {
    return <p>Δεν βρέθηκε το προϊόν.</p>
  }

  const p = product.data
  const type = detectType(p)

  // Το backend δίνει μόνο το όνομα της κατηγορίας, οπότε βρίσκουμε το id από τη λίστα κατηγοριών
  const categoryId = categories.data
    .flatMap((parent) => parent.subCategories)
    .find((sub) => sub.name === p.categoryName)?.id

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/admin/products" className="text-sm text-brown hover:text-olive">← Όλα τα προϊόντα</Link>
      <h1 className="text-2xl font-bold text-olive">
        Επεξεργασία: {p.title}
        <span className="ml-2 text-sm font-normal text-brown/70">({PRODUCT_TYPE_LABELS[type]})</span>
      </h1>

      <ProductForm
        type={type}
        initialValues={toFormValues(p, categoryId)}
        initialFeatured={featured.data.includes(Number(productId))}
        submitLabel="Αποθήκευση"
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={(payload) => mutation.mutate({ type, payload })}
      />
    </div>
  )
}
