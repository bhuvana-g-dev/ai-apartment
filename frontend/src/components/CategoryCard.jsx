import { Link } from 'react-router-dom'

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
}

export default function CategoryCard({ category }) {
  const icon = CATEGORY_ICONS[category.slug] || '🏠'
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all text-center group"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 leading-tight">
        {category.name}
      </span>
    </Link>
  )
}
