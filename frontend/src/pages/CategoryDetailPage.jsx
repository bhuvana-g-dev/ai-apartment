import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoryBySlug } from '../services/categoriesService.js'
import { getToolsByCategory } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import BackButton from '../components/BackButton.jsx'

const CATEGORY_ICONS = {
  'chat-ai':'💬','writing-ai':'✍️','research-ai':'🔬','image-generation':'🎨',
  'video-generation':'🎬','voice-audio':'🎤','music-generation':'🎵','coding-ai':'💻',
  'design-ai':'🖌️','productivity-ai':'⚡','document-ai':'📄','translation-ai':'🌐',
  'ai-agents':'🤖','ai-api-providers':'⚙️',
}

export default function CategoryDetailPage() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      // Fetch category metadata and tools in parallel — slug == category ID in our data,
      // so we don't need to wait for the category response before fetching tools.
      const [cat, toolRes] = await Promise.all([
        getCategoryBySlug(categorySlug),
        getToolsByCategory(categorySlug),
      ])
      if (!cat) { setError('Category not found.'); setLoading(false); return }
      setCategory(cat)
      const sorted = (toolRes.data || []).sort((a, b) => a.name.localeCompare(b.name))
      setTools(sorted)
    } catch (e) {
      setError(e.message || 'Failed to load category.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [categorySlug])

  const icon = CATEGORY_ICONS[categorySlug] || '🏠'

  return (
    <div className="space-y-6">
      {loading && <LoadingSpinner />}
      {error && (
        <div className="space-y-4">
          <ErrorMessage message={error} onRetry={load} />
          <Link to="/categories" className="text-sm text-indigo-600 hover:underline">
            ← All categories
          </Link>
        </div>
      )}
      {!loading && !error && category && (
        <>
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <BackButton fallback="/categories" label="All Categories" />
              <span className="text-gray-300">·</span>
              <Link to="/" className="hover:text-indigo-600">Home</Link>
              <span>/</span>
              <Link to="/categories" className="hover:text-indigo-600">Categories</Link>
              <span>/</span>
              <span className="text-gray-600">{category.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-500 text-sm">{category.description}</p>
              </div>
            </div>
            {tools.length > 0 && (
              <p className="text-xs text-gray-400 pt-1">{tools.length} tool{tools.length !== 1 ? 's' : ''} in this category</p>
            )}
          </div>

          {/* Tools */}
          {tools.length === 0 ? (
            <EmptyState
              message="No tools listed in this category yet."
              cta={{ label: 'Browse all categories', to: '/categories' }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <Link to="/categories" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
              ← All categories
            </Link>
            <Link to="/finder" className="text-sm text-indigo-600 hover:underline">
              🔍 Find tools for a task
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
