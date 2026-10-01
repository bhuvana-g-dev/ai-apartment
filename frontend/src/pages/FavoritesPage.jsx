import { useEffect, useState } from 'react'
import { getToolById } from '../services/toolsService.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { useCompare } from '../context/CompareContext.jsx'
import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import BackButton from '../components/BackButton.jsx'

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { compareSet } = useCompare()
  const [toolData, setToolData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setToolData([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.allSettled(
      favorites.map(id =>
        getToolById(id)
          .then(tool => ({ id, tool, missing: false }))
          .catch(() => ({ id, tool: null, missing: true }))
      )
    )
      .then(results => setToolData(results.map(r => r.value)))
      .finally(() => setLoading(false))
  }, [favorites.join(',')])

  if (loading) return <LoadingSpinner label="Loading favorites..." />

  if (favorites.length === 0) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-center py-12">
        <div className="flex justify-start">
          <BackButton fallback="/" label="Home" />
        </div>
        <div className="text-5xl">🤍</div>
        <h1 className="text-2xl font-bold text-gray-900">No favorites yet</h1>
        <p className="text-gray-400 text-sm">
          Click the heart icon on any tool to save it here. Your favorites persist across sessions.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/tools" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            Explore tools
          </Link>
          <Link to="/finder" className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
            🔍 Use AI Finder
          </Link>
        </div>
      </div>
    )
  }

  const activeFavorites = toolData.filter(d => d && !d.missing && d.tool)
  const missingFavorites = toolData.filter(d => d && d.missing)

  return (
    <div className="space-y-6">
      <BackButton fallback="/" label="Home" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Favorites
            <span className="text-gray-400 font-normal text-lg ml-2">({favorites.length})</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Saved in your browser — persists across sessions</p>
        </div>
        <div className="flex items-center gap-3">
          {compareSet.length >= 2 && (
            <Link
              to="/compare"
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              ⊕ Compare ({compareSet.length})
            </Link>
          )}
          {favorites.length > 1 && (
            <button
              onClick={() => { if (window.confirm('Clear all favorites?')) clearFavorites() }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Missing tools notice */}
      {missingFavorites.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
          {missingFavorites.length} saved tool{missingFavorites.length > 1 ? 's are' : ' is'} no longer available.
          <button
            onClick={() => missingFavorites.forEach(d => removeFavorite(d.id))}
            className="ml-2 underline hover:no-underline"
          >
            Remove {missingFavorites.length > 1 ? 'them' : 'it'}
          </button>
        </div>
      )}

      {/* Tool grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {toolData.map(({ id, tool, missing }) => {
          if (missing) return (
            <div key={id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 opacity-50">
              <p className="text-sm text-gray-400 italic">No longer available</p>
              <button
                onClick={() => removeFavorite(id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors text-left"
              >
                Remove
              </button>
            </div>
          )
          if (!tool) return null
          return <ToolCard key={id} tool={tool} />
        })}
      </div>

      {/* Bottom CTA */}
      {activeFavorites.length > 1 && compareSet.length < 2 && (
        <div className="text-center text-xs text-gray-400 py-2">
          Click ⊕ Compare on tools to compare them side by side
        </div>
      )}
    </div>
  )
}
