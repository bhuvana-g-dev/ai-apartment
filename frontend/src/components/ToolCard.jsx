import { Link } from 'react-router-dom'
import PricingBadge from './PricingBadge.jsx'
import CompareToggleButton from './CompareToggleButton.jsx'
import FavoriteToggleButton from './FavoriteToggleButton.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

export default function ToolCard({ tool, showCompare = true, showFavorite = true }) {
  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const inCompare = isInCompare(tool.id)
  const compareDisabled = compareSet.length >= 4

  function handleCompareToggle() {
    if (inCompare) removeFromCompare(tool.id)
    else addToCompare(tool.id)
  }

  function handleFavoriteToggle() {
    if (isFavorite(tool.id)) removeFavorite(tool.id)
    else addFavorite(tool.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/tools/${tool.id}`} className="font-semibold text-gray-900 hover:text-indigo-700 transition-colors line-clamp-1">
            {tool.name}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{tool.category_id?.replace(/-/g, ' ')}</p>
        </div>
        {showFavorite && (
          <FavoriteToggleButton toolId={tool.id} isFavorite={isFavorite(tool.id)} onToggle={handleFavoriteToggle} />
        )}
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <PricingBadge pricingType={tool.pricing_type} />
        {showCompare && (
          <CompareToggleButton
            toolId={tool.id}
            inSet={inCompare}
            disabled={compareDisabled}
            onToggle={handleCompareToggle}
          />
        )}
      </div>
    </div>
  )
}
