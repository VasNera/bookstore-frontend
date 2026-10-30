import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { Link } from '@tanstack/react-router'

export function CategoryMenu() {
    
    const { data, isPending, error } = useCategories()


  const [openId, setOpenId] = useState<number | null>(null)

  if (isPending) return <p className="px-4 py-3">Φόρτωση...</p>
  if (error) return <p className="px-4 py-3">Σφάλμα: {error.message}</p>

  return (
    <nav className="mx-auto flex max-w-7xl gap-6 px-4">
      {data.map((category) => (
        <div key={category.id} className="relative">
            <button
            onClick={()=> setOpenId(openId === category.id ? null: category.id)}
            className="block cursor-pointer py-3 font-medium text-brown"
            >
                {category.name}
            </button>
            {openId === category.id && (
         
          <ul className="absolute left-0 top-full z-10 min-w-48 bg-cream shadow-lg">
            {category.subCategories.map((sub) => (
            <li key={sub.id}>
  <Link
    to="/products"
    search={{ categoryId: sub.id }}
    onClick={() => setOpenId(null)}
    className="block px-4 py-2 text-brown hover:bg-white/60"
  >
    {sub.name}
  </Link>
</li>
            ))}
          </ul>
          )}
        </div>
      ))}
    </nav>
  )
}