import { useEffect, useState } from "react";
import type { Review } from "../types/review";

interface ReviewCarouselProps {
    reviews: Review[]
}

export function ReviewCarousel({reviews}: ReviewCarouselProps){
    const [index, setIndex] = useState(0)

    useEffect (()=>{
        if(reviews.length < 2) return
        const timer = setInterval(()=>{
            setIndex((current) => (current + 1 ) % reviews.length)
        },4000)
        return() => clearInterval(timer)
    },[reviews.length])
    
    if(reviews.length === 0 ) return null

    const review = reviews [index % reviews.length]

    return (
    <div className="mx-auto max-w-2xl rounded-lg border border-brown/20 bg-white/60 p-8 text-center">
      <p className="text-xl text-brown">«{review.comment}»</p>
      <p className="mt-4 text-sm text-brown/70">
        {review.authorName} · για «{review.productTitle}»
      </p>
      <p className="mt-2 text-olive">{'★'.repeat(review.rating)}</p>

      <div className="mt-4 flex justify-center gap-2">
        {reviews.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setIndex(i)}
            aria-label={`Κριτική ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-olive' : 'bg-brown/30'}`}
          />
        ))}
      </div>
    </div>
  )
}