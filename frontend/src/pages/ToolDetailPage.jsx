import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getToolById } from '../services/toolsService.js'
import PricingBadge from '../components/PricingBadge.jsx'
import FreeTierDetails from '../components/FreeTierDetails.jsx'
import VerifiedDateBadge from '../components/VerifiedDateBadge.jsx'
import CompareToggleButton from '../components/CompareToggleButton.jsx'
import FavoriteToggleButton from '../components/FavoriteToggleButton.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

export default function ToolDetailPage() {
  const { toolId } = useParams()
  const [tool, setTool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    setLoading(true); setError(null); setNotFound(false)
    getToolById(toolId)
      .then(setTool)
      .catch(e => {
        if (e.response?.status === 404) setNotFound(true)
        else setError(e.message || 'Failed to load tool.')
      })
      .finally(() => setLoading(false))
  }, [toolId])

  if (loading) return <LoadingSpinner />
  if (notFound) return (
    <div className="text-center py-16 space-y-4">
      <p className="text-gray-500">This tool could not be found.</p>
      <Link to="/tools" className="text-indigo-600 hover:underline text-sm">← Back to catalogue</Link>
    </div>
  )
  if (error) return <ErrorMessage message={error} />
  if (!tool) return null

  const inCompare = isInCompare(tool.id)
  const favd = isFavorite(tool.id)

  function handleCompare() {
    if (inCompare) removeFromCompare(tool.id)
    else addToCompare(tool.id)
  }
  function handleFavorite() {
    if (favd) removeFavorite(tool.id)
    else addFavorite(tool.id)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteToggleButton toolId={tool.id} isFavorite={favd} onToggle={handleFavorite} />
            <CompareToggleButton toolId={tool.id} inSet={inCompare} disabled={compareSet.length >= 4} onToggle={handleCompare} />
          </div>
        </div>
        <p className="text-xs text-gray-400">{tool.category_id?.replace(/-/g, ' ')}</p>
        <p className="text-gray-600">{tool.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <PricingBadge pricingType={tool.pricing_type} />
          {tool.api_available && <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">API available</span>}
        </div>
        {tool.website_url && (
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
            Visit official website →
          </a>
        )}
      </div>

      {/* Free tier */}
      <FreeTierDetails details={tool.free_tier_details} freeAvailability={tool.free_availability} pricingType={tool.pricing_type} />

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tool.capabilities?.length > 0 && (
          <Section title="Capabilities">
            {tool.capabilities.map(c => <Tag key={c}>{c}</Tag>)}
          </Section>
        )}
        {tool.input_types?.length > 0 && (
          <Section title="Input types">
            {tool.input_types.map(t => <Tag key={t}>{t}</Tag>)}
          </Section>
        )}
        {tool.output_types?.length > 0 && (
          <Section title="Output types">
            {tool.output_types.map(t => <Tag key={t}>{t}</Tag>)}
          </Section>
        )}
        {tool.best_use_cases?.length > 0 && (
          <Section title="Best use cases">
            <ul className="list-disc list-inside space-y-0.5">
              {tool.best_use_cases.map(u => <li key={u} className="text-sm text-gray-600">{u}</li>)}
            </ul>
          </Section>
        )}
        {tool.limitations?.length > 0 && (
          <Section title="Limitations">
            <ul className="list-disc list-inside space-y-0.5">
              {tool.limitations.map(l => <li key={l} className="text-sm text-gray-600">{l}</li>)}
            </ul>
          </Section>
        )}
        {tool.watermark_info && (
          <Section title="Watermark">
            <p className="text-sm text-gray-600">{tool.watermark_info}</p>
          </Section>
        )}
      </div>

      <VerifiedDateBadge date={tool.verified_date} />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Tag({ children }) {
  return <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{children}</span>
}
