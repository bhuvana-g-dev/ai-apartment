import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../services/categoriesService.js'
import CategoryCard from '../components/CategoryCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function CategoryListPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch (e) {
      setError(e.message || 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Rooms</h1>
          <p className="text-sm text-gray-400 mt-0.5">Browse all {categories.length} AI capability categories</p>
        </div>
        <Link to="/finder" className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
          🔍 Not sure? Try Finder
        </Link>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && categories.length === 0 && (
        <EmptyState message="No categories available yet." cta={{ label: 'Back to home', to: '/' }} />
      )}
      {!loading && !error && categories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      )}
    </div>
  )
}
