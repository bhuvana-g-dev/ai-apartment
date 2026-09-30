import { Link } from 'react-router-dom'
import PricingBadge from './PricingBadge.jsx'
import CompareToggleButton from './CompareToggleButton.jsx'
import FavoriteToggleButton from './FavoriteToggleButton.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

const CATEGORY_ICONS = {
  'chat-ai': '💬',
  'writing-ai': '✍️',
  'research-ai': '🔬',
  'image-generation': '🎨',
  'video-generation': '🎬',
  'voice-audio': '🎤',
  'music-generation': '🎵',
  'coding-ai': '💻',
  'design-ai': '🖌️',
  'productivity-ai': '⚡',
  'document-ai': '📄',
  'translation-ai': '🌐',
  'ai-agents': '🤖',
  'ai-api-providers': '⚙️',
}

export default function ToolCard({ tool, showCompare = true, showFavorite = true }) {
  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const inCompare = isInCompare(tool.id)
  const compareDisabled = compareSet.length >= 4
  const favd = isFavorite(tool.id)
  const icon = CATEGORY_ICONS[tool.category_id] || '🤖'

  function handleCompareToggle() {
    if (inCompare) removeFromCompare(tool.id)
    else addToCompare(tool.id)
  }

  function handleFavoriteToggle() {
    if (favd) removeFavorite(tool.id)
    else addFavorite(tool.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <Link
              to={`/tools/${tool.id}`}
              className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 block"
            >
              {tool.name}
            </Link>
            <p className="text-xs text-gray-400 capitalize">
              {tool.category_id?.replace(/-/g, ' ')}
            </p>
          </div>
        </div>
        {showFavorite && (
          <FavoriteToggleButton toolId={tool.id} isFavorite={favd} onToggle={handleFavoriteToggle} />
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{tool.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <PricingBadge pricingType={tool.pricing_type} />
        {tool.api_available && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200">
            API
          </span>
        )}
        {tool.free_tier_details?.has_watermark === true && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
            Watermark
          </span>
        )}
      </div>

      {/* Actions */}
      {showCompare && (
        <div className="mt-auto pt-1">
          <CompareToggleButton
            toolId={tool.id}
            inSet={inCompare}
            disabled={compareDisabled}
            onToggle={handleCompareToggle}
          />
        </div>
      )}
    </div>
  )
}
