import type { Page } from "../types/page";
import type { ProductSummary } from "../types/product";
import type { ProductFilters } from "../types/productFilters";


interface ResultsToolbarProps {
    filters: ProductFilters
    result: Page<ProductSummary>
    onChange: (changes:Partial<ProductFilters>) => void

}

export function ResultsToolbar({filters, result, onChange}:ResultsToolbarProps){
    const first = result.totalElements === 0 ? 0:result.number * result.size + 1
    const last = result.number * result.size + result.content.length

 return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 text-brown">
      <p className="font-medium">
        Είδη {first}-{last} από {result.totalElements}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          Ταξινόμηση
          <select
            value={filters.sort ?? 'createdAt,desc'}
            onChange={(e) => onChange({ sort: e.target.value })}
            className="rounded border border-brown/30 bg-white/60 px-2 py-1"
          >
            <option value="createdAt,desc">Νεότερα</option>
            <option value="price,asc">Τιμή: χαμηλότερη πρώτα</option>
            <option value="price,desc">Τιμή: υψηλότερη πρώτα</option>
            <option value="title,asc">Τίτλος Α-Ω</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Εμφάνιση
          <select
            value={filters.size ?? 20}
            onChange={(e) => onChange({ size: Number(e.target.value) })}
            className="rounded border border-brown/30 bg-white/60 px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
          ανά σελίδα
        </label>
      </div>
    </div>
  )
}