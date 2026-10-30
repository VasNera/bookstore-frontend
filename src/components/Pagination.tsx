interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({page, totalPages, onPageChange}: PaginationProps){
    if(totalPages <= 1) return null

    return (
    <div className="mt-8 flex items-center justify-center gap-4 text-brown">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="rounded border border-brown/30 px-3 py-1 disabled:opacity-40"
      >
        Προηγούμενη
      </button>
      <span>
        Σελίδα {page + 1} από {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="rounded border border-brown/30 px-3 py-1 disabled:opacity-40"
      >
        Επόμενη
      </button>
    </div>
  )
}