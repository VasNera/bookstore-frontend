import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { fetchProducts } from '../api/products'
import { CATEGORY_IMAGES } from '../data/categoryImages'
import type { Category } from '../types/category'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Η γονική κατηγορία δεν έχει προϊόντα απευθείας, οπότε δανειζόμαστε από την πρώτη υποκατηγορία
  const sourceId = category.subCategories[0]?.id ?? category.id
  const staticImage = CATEGORY_IMAGES[category.name]

  const sample = useQuery({
    queryKey: ['products', 'sample', sourceId],
    queryFn: () => fetchProducts({ categoryId: sourceId, size: 1, page: 0 }),
    enabled: !staticImage,
    staleTime: 5 * 60 * 1000,
  })

  const productImage = sample.data?.content[0]?.imageUrl
  const image =
    staticImage ?? (productImage && !productImage.includes('placehold.co') ? productImage : null)

  return (
    <Link
      to="/products"
      search={{ categoryId: category.id, page: 0 }}
      className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg border border-brown/20 bg-olive/10 p-4 text-center"
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <span className={`relative text-lg font-bold ${image ? 'text-white' : 'text-olive'}`}>
        {category.name}
      </span>
    </Link>
  )
}
