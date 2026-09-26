import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = Object.fromEntries(searchParams.entries())

  const setFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
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

  return { filters, setFilter, clearFilters }
}
