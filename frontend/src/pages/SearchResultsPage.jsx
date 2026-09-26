import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
    searchTools(q)
      .then(r => setTools(r.data || []))
      .catch(e => setError(e.message || 'Search failed.'))
      .finally(() => setLoading(false))
  }, [q])

  function handleSearch(newQ) {
    navigate(`/search?q=${encodeURIComponent(newQ)}`)
  }

  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <SearchBar onSubmit={handleSearch} initialValue={q} />
      </div>

      {q && (
        <p className="text-sm text-gray-500">
          Results for: <strong className="text-gray-800">{q}</strong>
        </p>
      )}

      {loading && <LoadingSpinner label="Searching..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && q && tools.length === 0 && (
        <EmptyState
          message={`No tools found for "${q}". Try a different keyword.`}
          cta={{ label: 'Browse all tools', to: '/tools' }}
        />
      )}

      {!loading && !error && !q && (
        <EmptyState message="Enter a search term above to find AI tools." />
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
