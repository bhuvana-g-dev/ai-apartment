import { Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  'chat-ai': '💬', 'writing-ai': '✍️', 'research-ai': '🔬',
  'image-generation': '🎨', 'video-generation': '🎬', 'voice-audio': '🎤',
  'music-generation': '🎵', 'coding-ai': '💻', 'design-ai': '🖌️',
  'productivity-ai': '⚡', 'document-ai': '📄', 'translation-ai': '🌐',
  'ai-agents': '🤖', 'ai-api-providers': '⚙️',
}

const CATEGORY_COLORS = {
  'chat-ai': 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400',
  'writing-ai': 'from-violet-50 to-violet-100 border-violet-200 hover:border-violet-400',
  'research-ai': 'from-cyan-50 to-cyan-100 border-cyan-200 hover:border-cyan-400',
  'image-generation': 'from-pink-50 to-pink-100 border-pink-200 hover:border-pink-400',
  'video-generation': 'from-red-50 to-red-100 border-red-200 hover:border-red-400',
  'voice-audio': 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400',
  'music-generation': 'from-green-50 to-green-100 border-green-200 hover:border-green-400',
  'coding-ai': 'from-slate-50 to-slate-100 border-slate-300 hover:border-slate-500',
  'design-ai': 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200 hover:border-fuchsia-400',
  'productivity-ai': 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-400',
  'document-ai': 'from-teal-50 to-teal-100 border-teal-200 hover:border-teal-400',
  'translation-ai': 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400',
  'ai-agents': 'from-gray-50 to-gray-100 border-gray-300 hover:border-gray-500',
  'ai-api-providers': 'from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-400',
}

export default function CategoryCard({ category }) {
  const icon = CATEGORY_ICONS[category.slug] || '🏠'
  const color = CATEGORY_COLORS[category.slug] || 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400'

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-b ${color} rounded-xl border transition-all text-center group hover:shadow-md hover:-translate-y-0.5`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight">
        {category.name}
      </span>
    </Link>
  )
}
