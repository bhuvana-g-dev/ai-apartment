import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTools } from '../services/toolsService.js'
import { getCategories } from '../services/categoriesService.js'
import ToolCard from '../components/ToolCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import Pagination from '../components/Pagination.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

const LIMIT = 20

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tools, setTools] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  // Load categories once for the filter panel
  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {})
  }, [])

  // Reload tools whenever filters/pagination change
  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = { limit: LIMIT }
    for (const [k, v] of searchParams.entries()) {
      params[k] = v
    }
    getTools(params)
      .then(r => {
        setTools(r.data || [])
        setTotal(r.total || 0)
      })
      .catch(e => setError(e.message || 'Failed to load tools.'))
      .finally(() => setLoading(false))
  }, [searchParams.toString()])

  function handleFilterChange(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('offset') // reset page on filter change
      if (value === null || value === '' || value === undefined) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
      return next
    })
  }

  function handleClear() {
    setSearchParams({})
  }

  function handlePageChange(newOffset) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('offset', String(newOffset))
      return next
    })
  }

  const filters = Object.fromEntries(searchParams.entries())
  const offset = parseInt(filters.offset || '0', 10)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">All AI Tools</h1>

      <div className="flex gap-6 items-start">
        {/* Sidebar filters */}
        <div className="shrink-0">
          <FilterPanel
            filters={filters}
            options={{ categories }}
            onChange={handleFilterChange}
            onClear={handleClear}
          />
        </div>

        {/* Tool grid */}
        <div className="flex-1 min-w-0 space-y-4">
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={() => setSearchParams(searchParams)} />}

          {!loading && !error && tools.length === 0 && (
            <EmptyState
              message="No tools match the selected filters."
              cta={{ label: 'Clear filters', to: '/tools' }}
            />
          )}

          {!loading && !error && tools.length > 0 && (
            <>
              <p className="text-sm text-gray-400">
                {total} tool{total !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
              <Pagination
                total={total}
                limit={LIMIT}
                offset={offset}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
