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
      <div className="order-last lg:order-none">
        <FiltersSidebar filters={filters} onChange={onChange} />
      </div>
      <div>{children}</div>
    </div>
  )
}
