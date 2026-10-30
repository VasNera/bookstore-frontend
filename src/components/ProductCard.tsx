import type { ProductSummary } from "../types/product";

interface ProductCardProps { 
    product: ProductSummary
}

export function ProductCard({product}: ProductCardProps){
    
    return(
        <div className="overflow-hidden rounded-lg border border-brown/20 bg-white/60">
            <img src={product.imageUrl} alt={product.title} 
            className="aspect-[2/3] w-full object-cover"/>
            <div className="p-3">
                <h3 className="line-clamp-2 font-medium text-brown">{product.title}</h3>
                <div className="mt-2 flex items-baseline gap-2">{product.discountPrice != null ? (
                    <>
                    <span className="font-bold text-olive">{product.discountPrice.toFixed(2)} €</span>
                    <span className="text-sm text-brown/60 line-through">{product.price.toFixed(2)} €</span>
                    </>
                    ): (
                        <span className="font-bold text-brown">{product.price.toFixed(2)} €</span>
                    )}
                </div>
              
              </div>

        </div>
    )
}

