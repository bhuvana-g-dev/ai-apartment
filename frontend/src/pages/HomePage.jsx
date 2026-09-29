import { useEffect, useState } from 'react'
import { getCategories } from '../services/categoriesService.js'
import { getTools } from '../services/toolsService.js'
import CategoryCard from '../components/CategoryCard.jsx'
import ToolCard from '../components/ToolCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [catRes, toolRes] = await Promise.all([
        getCategories(),
        getTools({ limit: 8 }),
      ])
      setCategories(catRes.data || [])
      setTools((toolRes.data || []).slice(0, 12))
    } catch (e) {
      setError(e.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function handleSearch(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">AI Apartment</h1>
        <p className="text-xl text-indigo-600 font-medium">One apartment. Different AI capabilities.</p>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Discover, compare, and find the right AI tool for any task — all in one place.
        </p>
        <div className="max-w-xl mx-auto pt-2">
          <SearchBar onSubmit={handleSearch} />
        </div>
      </section>

      {loading && <LoadingSpinner label="Loading AI Apartment..." />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          {/* Categories */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            {categories.length === 0 ? (
              <p className="text-gray-400 text-sm">No categories available yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
              </div>
            )}
          </section>

          {/* Finder CTA */}
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h2 className="text-lg font-bold text-gray-900">Not sure which tool to use?</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Describe your task in plain English and we'll recommend the right AI tools with reasoning.
            </p>
            <Link
              to="/finder"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Try the AI Finder →
            </Link>
          </section>

          {/* Featured tools */}
          {tools.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Featured AI Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
