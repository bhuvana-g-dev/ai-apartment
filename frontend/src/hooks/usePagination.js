import { useState, useCallback } from 'react'

export function usePagination(total = 0, limit = 20) {
  const [offset, setOffset] = useState(0)

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const currentPage = Math.floor(offset / limit) + 1

  const goToPage = useCallback((page) => {
    const clamped = Math.max(1, Math.min(page, totalPages))
    setOffset((clamped - 1) * limit)
  }, [limit, totalPages])

  const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage])

  return { offset, currentPage, totalPages, goToPage, nextPage, prevPage }
}
