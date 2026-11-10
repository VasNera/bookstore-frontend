import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { ApiError } from '../api/client'
import { createReview } from '../api/reviews'
import { useAuth } from '../auth/auth-context'

interface ReviewFormProps {
  productId: string
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const mutation = useMutation({
    mutationFn: () => createReview(productId, { rating, comment: comment.trim() }),
    onSuccess: () => {
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  if (!user) {
    return (
      <p className="text-brown">
        <Link to="/login" className="font-medium text-olive hover:underline">Συνδέσου</Link>{' '}
        για να γράψεις κριτική.
      </p>
    )
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate()
  }

  const error =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Κάτι πήγε στραβά.'
        : null

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg border border-brown/20 bg-white/60 p-4">
      <h3 className="font-bold text-brown">Γράψε μια κριτική</h3>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            aria-label={`${star} αστέρια`}
            className={`text-3xl ${star <= rating ? 'text-olive' : 'text-brown/30'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Τι σου άρεσε (ή όχι);"
        className="w-full rounded border border-brown/30 bg-white px-3 py-2"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}
      {mutation.isSuccess && <p className="text-sm text-olive">Η κριτική σου προστέθηκε.</p>}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-olive px-5 py-2 font-medium text-white disabled:opacity-60"
      >
        {mutation.isPending ? 'Αποστολή...' : 'Υποβολή'}
      </button>
    </form>
  )
}