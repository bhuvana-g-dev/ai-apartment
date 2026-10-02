import { Link } from 'react-router-dom'
import CategoryIcon from './CategoryIcon.jsx'

// Per-category gradient backgrounds and accent colors
const CARD_STYLES = {
  'chat-ai':          { bg: 'bg-gradient-to-br from-blue-50 to-blue-100/60',     icon: 'bg-blue-100 text-blue-600',    border: 'border-blue-100',  arrow: 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white' },
  'writing-ai':       { bg: 'bg-gradient-to-br from-violet-50 to-violet-100/60', icon: 'bg-violet-100 text-violet-600', border: 'border-violet-100', arrow: 'bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white' },
  'research-ai':      { bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/60',     icon: 'bg-cyan-100 text-cyan-600',    border: 'border-cyan-100',  arrow: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white' },
  'image-generation': { bg: 'bg-gradient-to-br from-pink-50 to-pink-100/60',     icon: 'bg-pink-100 text-pink-600',    border: 'border-pink-100',  arrow: 'bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white' },
  'video-generation': { bg: 'bg-gradient-to-br from-red-50 to-orange-100/60',    icon: 'bg-red-100 text-red-600',      border: 'border-red-100',   arrow: 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white' },
  'voice-audio':      { bg: 'bg-gradient-to-br from-orange-50 to-amber-100/60',  icon: 'bg-orange-100 text-orange-600', border: 'border-orange-100', arrow: 'bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white' },
  'music-generation': { bg: 'bg-gradient-to-br from-green-50 to-emerald-100/60', icon: 'bg-green-100 text-green-600',  border: 'border-green-100', arrow: 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white' },
  'coding-ai':        { bg: 'bg-gradient-to-br from-slate-50 to-slate-100/60',   icon: 'bg-slate-100 text-slate-600',  border: 'border-slate-100', arrow: 'bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white' },
  'design-ai':        { bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-100/60',  icon: 'bg-fuchsia-100 text-fuchsia-600', border: 'border-fuchsia-100', arrow: 'bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-600 hover:text-white' },
  'productivity-ai':  { bg: 'bg-gradient-to-br from-yellow-50 to-amber-100/60',  icon: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-100', arrow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white' },
  'document-ai':      { bg: 'bg-gradient-to-br from-teal-50 to-teal-100/60',     icon: 'bg-teal-100 text-teal-600',    border: 'border-teal-100',  arrow: 'bg-teal-100 text-teal-600 hover:bg-teal-600 hover:text-white' },
  'translation-ai':   { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/60', icon: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-100', arrow: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white' },
  'ai-agents':        { bg: 'bg-gradient-to-br from-gray-50 to-gray-100/60',     icon: 'bg-gray-100 text-gray-600',    border: 'border-gray-200',  arrow: 'bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white' },
  'ai-api-providers': { bg: 'bg-gradient-to-br from-emerald-50 to-green-100/60', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-100', arrow: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white' },
}

const DEFAULT_STYLE = {
  bg: 'bg-gradient-to-br from-gray-50 to-gray-100/60',
  icon: 'bg-gray-100 text-gray-600',
  border: 'border-gray-200',
  arrow: 'bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white',
}

export default function CategoryCard({ category, index = 0 }) {
  const style = CARD_STYLES[category.slug] || DEFAULT_STYLE
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`group flex items-start gap-4 p-5 ${style.bg} rounded-2xl border ${style.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-stagger-in ${staggerClass} backdrop-blur-sm`}
    >
      {/* Icon circle */}
      <div className={`w-12 h-12 rounded-2xl ${style.icon} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
        <CategoryIcon slug={category.slug} size={24} />
      </div>

      {/* Text + arrow */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-gray-700">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
              {category.description || `AI tools for ${category.name.toLowerCase()}`}
            </p>
          </div>
          {/* Arrow button */}
          <div className={`shrink-0 w-7 h-7 rounded-full ${style.arrow} flex items-center justify-center transition-all text-xs font-bold`}>
            →
          </div>
        </div>
      </div>
    </Link>
  )
}
