import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

// Keys that are pagination/routing params, not real filters
const NON_FILTER_KEYS = new Set(['offset', 'limit', 'q'])

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  const activeCount = useMemo(() =>
    Object.entries(filters).filter(([k, v]) => !NON_FILTER_KEYS.has(k) && v !== '' && v != null).length,
  [filters])

  const hasFilters = activeCount > 0

  const setFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('offset') // always reset pagination on filter change
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
      return next
    })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  return { filters, setFilter, clearFilters, activeCount, hasFilters }
}
