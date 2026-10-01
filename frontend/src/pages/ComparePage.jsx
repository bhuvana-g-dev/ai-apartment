import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getToolById } from '../services/toolsService.js'
import { useCompare } from '../context/CompareContext.jsx'
import PricingBadge from '../components/PricingBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const CATEGORY_ICONS = {
  'chat-ai':'💬','writing-ai':'✍️','research-ai':'🔬','image-generation':'🎨',
  'video-generation':'🎬','voice-audio':'🎤','music-generation':'🎵','coding-ai':'💻',
  'design-ai':'🖌️','productivity-ai':'⚡','document-ai':'📄','translation-ai':'🌐',
  'ai-agents':'🤖','ai-api-providers':'⚙️',
}

function NA() {
  return <span className="text-gray-300 text-xs">—</span>
}

function BoolCell({ value }) {
  if (value === null || value === undefined) return <NA />
  return value
    ? <span className="text-green-600 font-medium text-sm">✓ Yes</span>
    : <span className="text-gray-400 text-sm">✗ No</span>
}

function FreeTierCell({ tool }) {
  const ft = tool?.free_tier_details
  if (!tool?.free_availability) return <span className="text-gray-400 text-xs">No free tier</span>
  if (!ft) return <span className="text-green-600 text-xs">✓ Free tier available</span>

  const parts = []
  if (ft.credits) parts.push(ft.credits)
  if (ft.daily_limit) parts.push(`Daily: ${ft.daily_limit}`)
  if (ft.monthly_limit) parts.push(`Monthly: ${ft.monthly_limit}`)
  if (ft.generation_limit) parts.push(ft.generation_limit)
  if (ft.has_watermark === true) parts.push('⚠️ Watermark')
  if (ft.commercial_use_allowed === false) parts.push('❌ No commercial use')

  return parts.length > 0
    ? <div className="space-y-0.5">{parts.map((p, i) => <p key={i} className="text-xs text-gray-600">{p}</p>)}</div>
    : <span className="text-green-600 text-xs">✓ Free tier available</span>
}

const ROWS = [
  { key: 'pricing',    label: 'Pricing',        render: (tool) => <PricingBadge pricingType={tool?.pricing_type} /> },
  { key: 'free_tier',  label: 'Free tier',       render: (tool) => <FreeTierCell tool={tool} /> },
  { key: 'api',        label: 'API',             render: (tool) => <BoolCell value={tool?.api_available} /> },
  { key: 'watermark',  label: 'Watermark',       render: (tool) => {
    const hw = tool?.free_tier_details?.has_watermark
    if (hw === null || hw === undefined) return tool?.watermark_info ? <span className="text-xs text-gray-600">{tool.watermark_info}</span> : <NA />
    return hw ? <span className="text-amber-600 text-xs font-medium">⚠️ Yes</span> : <span className="text-green-600 text-xs font-medium">✓ No</span>
  }},
  { key: 'input',      label: 'Input',           render: (tool) => tool?.input_types?.length ? <span className="text-xs text-gray-600">{tool.input_types.join(', ')}</span> : <NA /> },
  { key: 'output',     label: 'Output',          render: (tool) => tool?.output_types?.length ? <span className="text-xs text-gray-600">{tool.output_types.join(', ')}</span> : <NA /> },
  { key: 'caps',       label: 'Capabilities',    render: (tool) => tool?.capabilities?.length
    ? <div className="flex flex-wrap gap-1">{tool.capabilities.slice(0,4).map(c => <span key={c} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">{c}</span>)}{tool.capabilities.length > 4 && <span className="text-xs text-gray-400">+{tool.capabilities.length - 4}</span>}</div>
    : <NA />
  },
  { key: 'uses',       label: 'Best for',        render: (tool) => tool?.best_use_cases?.length
    ? <ul className="space-y-0.5">{tool.best_use_cases.slice(0,3).map(u => <li key={u} className="text-xs text-gray-600 flex gap-1"><span className="text-green-500 shrink-0">✓</span>{u}</li>)}</ul>
    : <NA />
  },
  { key: 'limits',     label: 'Limitations',     render: (tool) => tool?.limitations?.length
    ? <ul className="space-y-0.5">{tool.limitations.slice(0,3).map(l => <li key={l} className="text-xs text-gray-500 flex gap-1"><span className="text-amber-400 shrink-0">·</span>{l}</li>)}</ul>
    : <NA />
  },
  { key: 'verified',   label: 'Last verified',   render: (tool) => <span className="text-xs text-gray-400">{tool?.verified_date || '—'}</span> },
]

export default function ComparePage() {
  const navigate = useNavigate()
  const { compareSet, removeFromCompare, clearCompare } = useCompare()
  const [toolData, setToolData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (compareSet.length === 0) { setLoading(false); return }
    setLoading(true)
    Promise.allSettled(
      compareSet.map(id =>
        getToolById(id)
          .then(t => ({ id, tool: t, error: null }))
          .catch(e => ({ id, tool: null, error: e.message || 'Failed to load' }))
      )
    ).then(results => {
      const map = {}
      results.forEach(r => { if (r.status === 'fulfilled') map[r.value.id] = { tool: r.value.tool, error: r.value.error } })
      setToolData(map)
    }).finally(() => setLoading(false))
  }, [compareSet.join(',')])

  function handleRemove(id) {
    removeFromCompare(id)
    if (compareSet.length - 1 < 2) navigate('/tools')
  }

  if (loading) return <LoadingSpinner label="Loading comparison..." />

  if (compareSet.length < 2) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <EmptyState
          message="Add at least 2 tools to compare them side by side."
          cta={{ label: 'Browse tools', to: '/tools' }}
        />
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-3">Or try finding tools for your task:</p>
          <Link to="/finder" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
            🔍 Open AI Finder
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Tools</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Factual comparison only — no tool is declared best.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/tools" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
            + Add more
          </Link>
          <button
            onClick={() => { clearCompare(); navigate('/tools') }}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="text-left text-xs text-gray-400 font-medium p-4 w-32 sticky left-0 bg-gray-50/80">
                Tool
              </th>
              {compareSet.map(id => {
                const { tool, error } = toolData[id] || {}
                const icon = CATEGORY_ICONS[tool?.category_id] || '🤖'
                return (
                  <th key={id} className="text-left p-4 min-w-48 align-top">
                    {error ? (
                      <div className="space-y-1">
                        <p className="text-red-400 text-sm font-medium">Failed to load</p>
                        <button onClick={() => handleRemove(id)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                      </div>
                    ) : tool ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          <Link to={`/tools/${tool.id}`} className="font-bold text-gray-900 hover:text-indigo-700 transition-colors text-sm leading-tight">
                            {tool.name}
                          </Link>
                        </div>
                        <p className="text-xs text-gray-400 capitalize">{tool.category_id?.replace(/-/g, ' ')}</p>
                        <button
                          onClick={() => handleRemove(id)}
                          className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                        >
                          Remove ✕
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-xs animate-pulse">Loading...</div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ key, label, render }) => (
              <tr key={key} className="border-t border-gray-50 hover:bg-indigo-50/30 transition-colors">
                <td className="text-xs text-gray-500 font-semibold p-4 align-top sticky left-0 bg-white">
                  {label}
                </td>
                {compareSet.map(id => {
                  const { tool, error } = toolData[id] || {}
                  return (
                    <td key={id} className="p-4 align-top">
                      {error ? <NA /> : render(tool)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visit links */}
      <div className="flex flex-wrap gap-3">
        {compareSet.map(id => {
          const { tool } = toolData[id] || {}
          if (!tool?.website_url) return null
          return (
            <a
              key={id}
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              Visit {tool.name} ↗
            </a>
          )
        })}
      </div>
    </div>
  )
}
