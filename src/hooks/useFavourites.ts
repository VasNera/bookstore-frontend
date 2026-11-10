import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFavourite, fetchFavourites, removeFavourite } from '../api/favourites'
import { useAuth } from '../auth/auth-context'

export function useFavourites() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['favourites'],
    queryFn: fetchFavourites,
    enabled: user != null,
  })
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['favourites'] })

  const add = useMutation({ mutationFn: addFavourite, onSuccess })
  const remove = useMutation({ mutationFn: removeFavourite, onSuccess })

  return { add, remove }
}