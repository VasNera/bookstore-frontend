import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import type { ProductFilters } from "../types/productFilters";

interface FiltersSidebarProps{
    filters: ProductFilters
    onChange: (changes: Partial<ProductFilters>) => void
}

export function FiltersSidebar({filters, onChange}: FiltersSidebarProps){
    const categories = useCategories()
    const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '')
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '')

    function applyPrice(){
        onChange({
            minPrice: minPrice === '' ? undefined: Number(minPrice),
            maxPrice: maxPrice === '' ? undefined: Number(maxPrice)
        })
    }

    function clearAll(){
        setMinPrice('')
        setMaxPrice('')
        onChange({categoryId: undefined, minPrice: undefined, maxPrice: undefined})
    }
    
     return (
    <aside className="space-y-8">
      <h2 className="text-xl font-bold text-olive">Φίλτρα αναζήτησης</h2>

      <div>
        <h3 className="mb-2 font-semibold text-brown">Τιμή</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Από"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 rounded border border-brown/30 bg-white/60 px-2 py-1"
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            placeholder="Έως"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 rounded border border-brown/30 bg-white/60 px-2 py-1"
          />
        </div>
        <button onClick={applyPrice} className="mt-2 rounded bg-olive px-3 py-1 text-white">
          Εφαρμογή
        </button>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-brown">Κατηγορία</h3>
        {categories.data?.map((parent) => (
          <div key={parent.id} className="mb-3">
            <p className="font-medium text-brown">{parent.name}</p>
            <ul className="ml-3">
              {parent.subCategories.map((sub) => (
                <li key={sub.id}>
                  <button
                    onClick={() => onChange({ categoryId: sub.id })}
                    className={filters.categoryId === sub.id ? 'font-bold text-olive' : 'text-brown'}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button onClick={clearAll} className="text-sm text-brown underline">
        Καθαρισμός φίλτρων
      </button>
    </aside>
  )
}
