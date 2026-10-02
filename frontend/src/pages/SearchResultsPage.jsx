import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { searchTools } from '../services/searchService.js'
import { getCategories } from '../services/categoriesService.js'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SearchBar from '../components/SearchBar.jsx'
import BackButton from '../components/BackButton.jsx'
import { SkeletonToolCard } from '../components/SkeletonCard.jsx'
import { SlidersHorizontal, X } from 'lucide-react'

const PRICING_TYPES = ['Completely Free', 'Freemium', 'Free Trial', 'Paid Only']

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''
  const filterPricing = searchParams.get('pricing_type') || ''
  const filterFree = searchParams.get('free_availability') || ''

  const [allTools, setAllTools] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setAllTools([])
    searchTools(q)
      .then(r => setAllTools(r.data || []))
      .catch(e => setError(e.message || 'Search failed.'))
      .finally(() => setLoading(false))
  }, [q])

  function handleSearch(newQ) {
    navigate(`/search?q=${encodeURIComponent(newQ)}`)
  }

  // Client-side filtering on search results
  const tools = allTools.filter(t => {
    if (filterPricing && t.pricing_type !== filterPricing) return false
    if (filterFree === 'true' && !t.free_availability) return false
    return true
  })

  const activeFilters = [filterPricing, filterFree].filter(Boolean).length

  function setFilter(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (!value) next.delete(key)
      else next.set(key, value)
      return next
    })
  }

  function clearFilters() {
    setSearchParams(prev => {
      const next = new URLSearchParams()
      if (prev.get('q')) next.set('q', prev.get('q'))
      return next
    })
  }

  return (
    <div className="space-y-4">
      <BackButton fallback="/" label="Home" />

      {/* Search bar */}
      <div className="max-w-xl">
        <SearchBar onSubmit={handleSearch} initialValue={q} />
      </div>

      {/* Results header */}
      {q && !loading && !error && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500">
            {tools.length > 0 ? (
              <>
                <strong className="text-gray-900">{tools.length}</strong>{' '}
                result{tools.length !== 1 ? 's' : ''} for{' '}
                <strong className="text-gray-900">"{q}"</strong>
                {activeFilters > 0 ? ' (filtered)' : ''}
              </>
            ) : (
              <>No results for <strong className="text-gray-900">"{q}"</strong></>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                showFilters || activeFilters > 0
                  ? 'border-indigo-300 text-indigo-600 bg-indigo-50'
                  : 'border-gray-200 text-gray-500 hover:border-indigo-200'
              }`}
            >
              <SlidersHorizontal size={12} />
              Filters
              {activeFilters > 0 && (
                <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
            <Link to="/finder" className="text-xs text-indigo-600 hover:underline whitespace-nowrap">
              🔍 Try AI Finder
            </Link>
          </div>
        </div>
      )}

      {/* Inline filter bar */}
      {showFilters && q && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl animate-fade-down">
          <select
            value={filterPricing}
            onChange={e => setFilter('pricing_type', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">Any pricing</option>
            {PRICING_TYPES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filterFree === 'true'}
              onChange={e => setFilter('free_availability', e.target.checked ? 'true' : '')}
              className="rounded text-indigo-600 border-gray-300"
            />
            Has free tier
          </label>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonToolCard key={i} />)}
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && q && tools.length === 0 && allTools.length > 0 && (
        <EmptyState
          message="No tools match the active filters."
          cta={{ label: 'Clear filters', to: `/search?q=${encodeURIComponent(q)}` }}
        />
      )}

      {!loading && !error && q && allTools.length === 0 && (
        <EmptyState
          message={`No tools found for "${q}".`}
          cta={{ label: 'Browse all tools', to: '/tools' }}
          secondaryCta={{ label: 'Try AI Finder', to: '/finder' }}
        />
      )}

      {!loading && !error && !q && (
        <EmptyState message="Enter a search term above to find AI tools." />
      )}

      {!loading && !error && tools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={{ ...tool, _index: i }} />
          ))}
        </div>
      )}
    </div>
  )
}
