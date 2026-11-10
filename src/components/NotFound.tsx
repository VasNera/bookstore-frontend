import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="py-16 text-center text-brown">
      <p className="mb-2 text-6xl font-bold text-olive">404</p>
      <p className="mb-6">Η σελίδα που ψάχνεις δεν βρέθηκε.</p>
      <Link to="/" className="rounded bg-olive px-5 py-2 font-medium text-white">
        Επιστροφή στην αρχική
      </Link>
    </div>
  )
}