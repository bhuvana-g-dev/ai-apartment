import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { searchTools } from '../services/searchService.js'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SearchBar from '../components/SearchBar.jsx'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''

  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setTools([])
    searchTools(q)
      .then(r => setTools(r.data || []))
      .catch(e => setError(e.message || 'Search failed.'))
      .finally(() => setLoading(false))
  }, [q])

  function handleSearch(newQ) {
    navigate(`/search?q=${encodeURIComponent(newQ)}`)
  }

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="max-w-xl">
        <SearchBar onSubmit={handleSearch} initialValue={q} />
      </div>

      {/* Result summary */}
      {q && !loading && !error && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500">
            {tools.length > 0
              ? <><strong className="text-gray-900">{tools.length}</strong> result{tools.length !== 1 ? 's' : ''} for <strong className="text-gray-900">"{q}"</strong></>
              : <>No results for <strong className="text-gray-900">"{q}"</strong></>
            }
          </p>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/tools" className="text-gray-400 hover:text-indigo-600 transition-colors">
              Browse all tools →
            </Link>
            <Link to="/finder" className="text-indigo-600 hover:underline">
              🔍 Try AI Finder
            </Link>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner label="Searching..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && q && tools.length === 0 && (
        <div className="space-y-4">
          <EmptyState
            message={`No tools found for "${q}".`}
            cta={{ label: 'Browse all tools', to: '/tools' }}
          />
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">Try searching with different keywords, or:</p>
            <div className="flex justify-center gap-3">
              <Link
                to="/finder"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
              >
                🔍 Describe your task instead
              </Link>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !q && (
        <div className="space-y-4">
          <EmptyState message="Enter a search term above to find AI tools." />
          <div className="text-center">
            <Link to="/finder" className="text-indigo-600 text-sm hover:underline">
              🔍 Or try the guided AI Finder
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && tools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
