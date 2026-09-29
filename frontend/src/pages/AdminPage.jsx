import { useEffect, useState } from 'react'
import { getTools } from '../services/toolsService.js'
import { getCategories } from '../services/categoriesService.js'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import PricingBadge from '../components/PricingBadge.jsx'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || ''

export default function AdminPage() {
  const [tools, setTools] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const LIMIT = 25

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [toolRes, catRes] = await Promise.all([
        getTools({ limit: LIMIT, offset }),
        getCategories(),
      ])
      setTools(toolRes.data || [])
      setTotal(toolRes.total || 0)
      setCategories(catRes.data || [])
    } catch (e) {
      setError(e.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [offset])

  const filtered = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : tools

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin — Data Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {total} tools · {categories.length} categories
          </p>
        </div>
        <div className="flex gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ Write operations require <code>X-Admin-Key</code> header. Configure <code>ADMIN_API_KEY</code> in backend <code>.env</code>.
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total tools', value: total },
          { label: 'Categories', value: categories.length },
          { label: 'Free/Freemium', value: tools.filter(t => t.free_availability).length },
          { label: 'API available', value: tools.filter(t => t.api_available).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Filter tools by name..."
        className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          {/* Tools table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Tool</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Pricing</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Verified</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{tool.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-48">{tool.description?.slice(0, 60)}...</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{tool.category_id?.replace(/-/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <PricingBadge pricingType={tool.pricing_type} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-400">{tool.verified_date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/tools/${tool.id}`}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                  disabled={offset === 0}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setOffset(offset + LIMIT)}
                  disabled={offset + LIMIT >= total}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Categories overview */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs hover:border-indigo-300 transition-colors"
                >
                  <div className="font-medium text-gray-700">{cat.name}</div>
                  <div className="text-gray-400">{cat.slug}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
