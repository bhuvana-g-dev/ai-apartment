import { Link } from 'react-router-dom'
import PricingBadge from './PricingBadge.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import CategoryIcon from './CategoryIcon.jsx'

// Top accent stripe color per category
const ACCENT_COLORS = {
  'chat-ai':          'from-blue-400 to-blue-500',
  'writing-ai':       'from-violet-400 to-violet-500',
  'research-ai':      'from-cyan-400 to-cyan-500',
  'image-generation': 'from-pink-400 to-pink-500',
  'video-generation': 'from-red-400 to-orange-400',
  'voice-audio':      'from-orange-400 to-amber-400',
  'music-generation': 'from-green-400 to-emerald-500',
  'coding-ai':        'from-slate-400 to-slate-500',
  'design-ai':        'from-fuchsia-400 to-pink-400',
  'productivity-ai':  'from-yellow-400 to-amber-400',
  'document-ai':      'from-teal-400 to-teal-500',
  'translation-ai':   'from-indigo-400 to-indigo-500',
  'ai-agents':        'from-gray-400 to-gray-500',
  'ai-api-providers': 'from-emerald-400 to-green-500',
}

const ICON_BG = {
  'chat-ai':          'bg-blue-50 text-blue-600',
  'writing-ai':       'bg-violet-50 text-violet-600',
  'research-ai':      'bg-cyan-50 text-cyan-600',
  'image-generation': 'bg-pink-50 text-pink-600',
  'video-generation': 'bg-red-50 text-red-600',
  'voice-audio':      'bg-orange-50 text-orange-600',
  'music-generation': 'bg-green-50 text-green-600',
  'coding-ai':        'bg-slate-50 text-slate-600',
  'design-ai':        'bg-fuchsia-50 text-fuchsia-600',
  'productivity-ai':  'bg-yellow-50 text-yellow-600',
  'document-ai':      'bg-teal-50 text-teal-600',
  'translation-ai':   'bg-indigo-50 text-indigo-600',
  'ai-agents':        'bg-gray-50 text-gray-600',
  'ai-api-providers': 'bg-emerald-50 text-emerald-600',
}

export default function ToolCard({ tool, showCompare = true, showFavorite = true }) {
  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const inCompare = isInCompare(tool.id)
  const compareDisabled = compareSet.length >= 4
  const favd = isFavorite(tool.id)
  const staggerClass = tool._index !== undefined ? `stagger-${Math.min((tool._index || 0) + 1, 8)}` : ''
  const accent = ACCENT_COLORS[tool.category_id] || 'from-indigo-400 to-indigo-500'
  const iconBg = ICON_BG[tool.category_id] || 'bg-indigo-50 text-indigo-600'

  function handleCompareToggle(e) {
    e.preventDefault()
    if (inCompare) removeFromCompare(tool.id)
    else if (!compareDisabled) addToCompare(tool.id, tool.name)
  }

  function handleFavoriteToggle(e) {
    e.preventDefault()
    if (favd) removeFavorite(tool.id)
    else addFavorite(tool.id)
  }

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-slide-up ${staggerClass}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Gradient accent top stripe */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      {/* Card header */}
      <div className="p-4 pb-3 flex items-start gap-3">
        {/* Category icon */}
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
          <CategoryIcon slug={tool.category_id} size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <Link
            to={`/tools/${tool.id}`}
            className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 block text-sm"
          >
            {tool.name}
          </Link>
          <p className="text-xs text-gray-400 capitalize mt-0.5">
            {tool.category_id?.replace(/-/g, ' ')}
          </p>
        </div>

        {showFavorite && (
          <button
            onClick={handleFavoriteToggle}
            className="shrink-0 transition-transform hover:scale-125 focus:outline-none"
            title={favd ? 'Remove from favorites' : 'Save'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={favd ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className={`w-4 h-4 ${favd ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tool.description}</p>
      </div>

      {/* Free tier badge */}
      {tool.free_availability && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 font-medium">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            Free tier available
          </span>
        </div>
      )}

      {/* Pricing + extra badges */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <PricingBadge pricingType={tool.pricing_type} />
        {tool.api_available && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">API</span>
        )}
        {tool.free_tier_details?.has_watermark === true && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-100">Watermark</span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pb-4 pt-1 flex gap-2 border-t border-gray-50">
        <Link
          to={`/tools/${tool.id}`}
          className="flex-1 text-center py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View Details →
        </Link>
        {showCompare && (
          <button
            onClick={handleCompareToggle}
            disabled={compareDisabled && !inCompare}
            title={compareDisabled && !inCompare ? 'Max 4 tools' : inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              inCompare
                ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-red-500 hover:border-red-500'
                : compareDisabled
                  ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                  : 'text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {inCompare ? '✓' : '+'}
          </button>
        )}
      </div>
    </div>
  )
}
