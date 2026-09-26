import { useEffect, useState } from 'react'
import { getToolById } from '../services/toolsService.js'
import { useFavorites } from '../hooks/useFavorites.js'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <EmptyState
          message="You haven't saved any favorites yet. Start exploring to find tools you love."
          cta={{ label: 'Explore AI tools', to: '/tools' }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Favorites <span className="text-gray-400 font-normal text-lg">({favorites.length})</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {toolData.map(({ id, tool, missing }) => {
          if (missing) {
            return (
              <div
                key={id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 opacity-60"
              >
                <p className="text-sm text-gray-400 italic">This tool is no longer available.</p>
                <button
                  onClick={() => removeFavorite(id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors text-left"
                >
                  Remove from favorites
                </button>
              </div>
            )
          }
          if (!tool) return null
          return <ToolCard key={id} tool={tool} />
        })}
      </div>
    </div>
  )
}
