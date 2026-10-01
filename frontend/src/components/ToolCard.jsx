import { Link } from 'react-router-dom'
import PricingBadge from './PricingBadge.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import CategoryIcon from './CategoryIcon.jsx'

export default function ToolCard({ tool, showCompare = true, showFavorite = true }) {
  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const inCompare = isInCompare(tool.id)
  const compareDisabled = compareSet.length >= 4
  const favd = isFavorite(tool.id)
  const staggerClass = tool._index !== undefined ? `stagger-${Math.min((tool._index || 0) + 1, 8)}` : ''

  function handleCompareToggle(e) {
    e.preventDefault()
    if (inCompare) removeFromCompare(tool.id)
    else if (!compareDisabled) addToCompare(tool.id)
  }

  function handleFavoriteToggle(e) {
    e.preventDefault()
    if (favd) removeFavorite(tool.id)
    else addFavorite(tool.id)
  }

  return (
    <div className={`bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:border-indigo-200 transition-all group hover-lift animate-slide-up ${staggerClass || ''}`}>
      {/* Card header */}
      <div className="p-4 pb-3 flex items-start gap-3">
        {/* Category icon */}
        <div className="shrink-0">
          <CategoryIcon slug={tool.category_id} size={20} className="block" />
        </div>
        {/* Name + category */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/tools/${tool.id}`}
            className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 block text-sm"
          >
            {tool.name}
          </Link>
          <p className="text-xs text-gray-400 capitalize mt-0.5">
            {tool.category_id?.replace(/-/g, ' ')}
          </p>
        </div>
        {/* Favorite */}
        {showFavorite && (
          <button
            onClick={handleFavoriteToggle}
            className="shrink-0 text-gray-300 hover:text-red-400 transition-colors p-0.5"
            title={favd ? 'Remove from favorites' : 'Save'}
          >
            <svg viewBox="0 0 24 24" fill={favd ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${favd ? 'text-red-500' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tool.description}</p>
      </div>

      {/* Free tier indicator */}
      {tool.free_availability && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
            Free tier available
          </span>
        </div>
      )}

      {/* Badges */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <PricingBadge pricingType={tool.pricing_type} />
        {tool.api_available && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">API</span>
        )}
        {tool.free_tier_details?.has_watermark === true && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-100">Watermark</span>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-auto px-4 pb-4 pt-1 flex gap-2 border-t border-gray-50">
        <Link
          to={`/tools/${tool.id}`}
          className="flex-1 text-center py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View Details →
        </Link>
        {showCompare && (
          <button
            onClick={handleCompareToggle}
            disabled={compareDisabled && !inCompare}
            title={compareDisabled && !inCompare ? 'Max 4 tools' : inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              inCompare
                ? 'bg-indigo-600 text-white border-indigo-600'
                : compareDisabled
                  ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                  : 'text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {inCompare ? '✓' : '+'}
          </button>
        )}
      </div>
    </div>
  )
}
