import { useEffect, useState } from 'react'
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
      <h1 className="text-2xl font-bold text-gray-900">AI Categories</h1>
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
