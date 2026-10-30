import type { ReactNode } from "react";
import { FiltersSidebar } from "./FiltersSidebar";
import type { ProductFilters } from "../types/productFilters";

interface ShopLayoutProps{
    filters: ProductFilters
    onChange: (changes: Partial<ProductFilters>) =>void
    children: ReactNode
}

export function ShopLayout({filters, onChange, children}: ShopLayoutProps){

return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <FiltersSidebar filters={filters} onChange={onChange} />
      <div>{children}</div>
    </div>
  )
}
