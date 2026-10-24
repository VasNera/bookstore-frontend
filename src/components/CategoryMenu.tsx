import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../api/categories'
import { useState } from 'react'

export function CategoryMenu() {
    
    const { data, isPending, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })


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
              <li key={sub.id} className="cursor-pointer px-4 py-2 text-brown hover:bg-gray/60">
                {sub.name}
              </li>
            ))}
          </ul>
          )}
        </div>
      ))}
    </nav>
  )
}