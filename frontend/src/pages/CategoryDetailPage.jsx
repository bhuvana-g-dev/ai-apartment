import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCategories } from '../services/categoriesService.js'
import { getToolsByCategory } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function CategoryDetailPage() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const catRes = await getCategories()
      const cats = catRes.data || []
      const found = cats.find(c => c.slug === categorySlug)
      if (!found) { setError('Category not found.'); setLoading(false); return }
      setCategory(found)
      const toolRes = await getToolsByCategory(found.id)
      const sorted = (toolRes.data || []).sort((a, b) => a.name.localeCompare(b.name))
      setTools(sorted)
    } catch (e) {
      setError(e.message || 'Failed to load category.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [categorySlug])

  return (
    <div className="space-y-6">
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && category && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
          </div>
          {tools.length === 0 ? (
            <EmptyState message="No tools listed in this category yet." cta={{ label: 'Browse all categories', to: '/categories' }} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
