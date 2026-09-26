import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getToolById } from '../services/toolsService.js'
import { useCompare } from '../context/CompareContext.jsx'
import PricingBadge from '../components/PricingBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const COMPARISON_FIELDS = [
  { key: 'category_id',      label: 'Category',       render: v => v?.replace(/-/g, ' ') },
  { key: 'pricing_type',     label: 'Pricing',         render: v => <PricingBadge pricingType={v} /> },
  { key: 'free_availability',label: 'Free tier',       render: v => v ? '✅ Yes' : '❌ No' },
  { key: 'api_available',    label: 'API available',   render: v => v ? '✅ Yes' : '❌ No' },
  { key: 'watermark_info',   label: 'Watermark' },
  { key: 'capabilities',     label: 'Capabilities',    render: v => Array.isArray(v) ? v.join(', ') : (v || null) },
  { key: 'input_types',      label: 'Input types',     render: v => Array.isArray(v) ? v.join(', ') : (v || null) },
  { key: 'output_types',     label: 'Output types',    render: v => Array.isArray(v) ? v.join(', ') : (v || null) },
  { key: 'best_use_cases',   label: 'Best use cases',  render: v => Array.isArray(v) ? v.join(', ') : (v || null) },
  { key: 'limitations',      label: 'Limitations',     render: v => Array.isArray(v) ? v.join(', ') : (v || null) },
]

export default function ComparePage() {
  const navigate = useNavigate()
  const { compareSet, removeFromCompare, clearCompare } = useCompare()
  const [toolData, setToolData] = useState({}) // { [id]: { tool, error } }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (compareSet.length === 0) {
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.allSettled(
      compareSet.map(id =>
        getToolById(id)
          .then(t => ({ id, tool: t, error: null }))
          .catch(e => ({ id, tool: null, error: e.message || 'Failed to load' }))
      )
    ).then(results => {
      const map = {}
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          map[r.value.id] = { tool: r.value.tool, error: r.value.error }
        }
      })
      setToolData(map)
    }).finally(() => setLoading(false))
  }, [compareSet.join(',')])

  function handleRemove(id) {
    removeFromCompare(id)
    // If fewer than 2 tools remain after removal, navigate away
    if (compareSet.length - 1 < 2) {
      navigate('/')
    }
  }

  if (loading) return <LoadingSpinner label="Loading comparison..." />

  if (compareSet.length < 2) {
    return (
      <EmptyState
        message="Add at least 2 tools to compare them side by side."
        cta={{ label: 'Browse tools', to: '/tools' }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Compare Tools</h1>
        <button
          onClick={() => { clearCompare(); navigate('/') }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 inline-block">
        Factual side-by-side comparison only — no tool is declared best.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium p-4 w-36">Field</th>
              {compareSet.map(id => {
                const { tool, error } = toolData[id] || {}
                return (
                  <th key={id} className="text-left p-4 min-w-52 align-top">
                    {error ? (
                      <div className="space-y-1">
                        <p className="text-red-400 text-sm font-medium">Failed to load</p>
                        <p className="text-red-300 text-xs">{error}</p>
                        <button onClick={() => handleRemove(id)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                      </div>
                    ) : tool ? (
                      <div className="space-y-1.5">
                        <Link to={`/tools/${tool.id}`} className="font-semibold text-gray-900 hover:text-indigo-700 transition-colors block">
                          {tool.name}
                        </Link>
                        <p className="text-xs text-gray-400">{tool.category_id?.replace(/-/g, ' ')}</p>
                        <button onClick={() => handleRemove(id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-sm">Loading...</div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FIELDS.map(({ key, label, render }) => (
              <tr key={key} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="text-xs text-gray-500 font-medium p-4 align-top">{label}</td>
                {compareSet.map(id => {
                  const { tool, error } = toolData[id] || {}
                  if (error) {
                    return <td key={id} className="p-4 text-xs text-red-200">—</td>
                  }
                  const raw = tool?.[key]
                  const isEmpty = raw === null || raw === undefined || (Array.isArray(raw) && raw.length === 0) || raw === ''
                  const display = isEmpty
                    ? <span className="text-gray-300 text-xs">Not available</span>
                    : (render ? render(raw) : <span className="text-sm text-gray-700">{String(raw)}</span>)
                  return (
                    <td key={id} className="p-4 text-sm text-gray-700 align-top">
                      {display}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
