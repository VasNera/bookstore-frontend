import { useNavigate } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useAuth } from '../auth/auth-context'
import { useFavourites, useToggleFavourite } from '../hooks/useFavourites'

interface FavouriteButtonProps {
  productId: number
}

export function FavouriteButton({ productId }: FavouriteButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const favourites = useFavourites()
  const { add, remove } = useToggleFavourite()

  const isFavourite = favourites.data?.some((p) => p.id === productId) ?? false
  const isBusy = add.isPending || remove.isPending

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate({ to: '/login' })
      return
    }
    if (isFavourite) remove.mutate(productId)
    else add.mutate(productId)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isBusy}
      aria-label={isFavourite ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
      className="rounded-full bg-white/90 p-2 text-brown shadow hover:text-olive disabled:opacity-60"
    >
      <Heart size={20} className={isFavourite ? 'fill-olive text-olive' : ''} />
    </button>
  )
}