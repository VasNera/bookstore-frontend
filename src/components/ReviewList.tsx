import type { Review } from "../types/review";

interface ReviewListProps{
    reviews: Review[]
}

export function ReviewList({reviews}: ReviewListProps){
    
    return(
        <ul className="space-y-4">
            {reviews.map((review) =>(
                <li key={review.id} className="rounded-lg border border-brown/20 bg-white/60 p-4">
                    <p className="text-brown">"{review.comment}"</p>
                    <p className="mt-2 text-sm text-brown/70">
                    {review.authorName} · για «{review.productTitle}»</p>
                    <p className="mt-1 text-olive">{'★'.repeat(review.rating)}
                    </p>
                </li>
            ))}
        </ul>

    )
}