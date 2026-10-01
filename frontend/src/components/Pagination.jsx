import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ total, limit, offset, onChange }) {
  if (!total || total <= limit) return null

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  // Generate page numbers to show (up to 5)
  const pages = []
  let start = Math.max(1, currentPage - 2)
  let end = Math.min(totalPages, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onChange((currentPage - 2) * limit)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(0)} className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-50">1</button>
          {start > 2 && <span className="w-9 text-center text-gray-300 text-sm">…</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onChange((page - 1) * limit)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
            page === currentPage
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="w-9 text-center text-gray-300 text-sm">…</span>}
          <button onClick={() => onChange((totalPages - 1) * limit)} className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-50">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onChange(currentPage * limit)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>

      <span className="ml-3 text-xs text-gray-400">{total} total</span>
    </div>
  )
}
