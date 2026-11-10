import type { ProductSummary } from "../types/product";
import { Link } from "@tanstack/react-router";
import { FavouriteButton } from "./FavouriteButton";

interface ProductCardProps { 
    product: ProductSummary
}

export function ProductCard({product}: ProductCardProps){
    
    return(
        <Link
  to="/products/$productId"
  params={{ productId: String(product.id) }}
  className="relative block overflow-hidden rounded-lg border border-brown/20 bg-white/60 transition hover:shadow-md">
            <div className="absolute right-2 top-2">
                <FavouriteButton productId={product.id} />
            </div>
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

        </Link>
    )
}