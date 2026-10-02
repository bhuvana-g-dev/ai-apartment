import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getToolById } from '../services/toolsService.js'
import PricingBadge from '../components/PricingBadge.jsx'
import VerifiedDateBadge from '../components/VerifiedDateBadge.jsx'
import CompareToggleButton from '../components/CompareToggleButton.jsx'
import FavoriteToggleButton from '../components/FavoriteToggleButton.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import BackButton from '../components/BackButton.jsx'

const CATEGORY_ICONS = {
  'chat-ai':'💬','writing-ai':'✍️','research-ai':'🔬','image-generation':'🎨',
  'video-generation':'🎬','voice-audio':'🎤','music-generation':'🎵','coding-ai':'💻',
  'design-ai':'🖌️','productivity-ai':'⚡','document-ai':'📄','translation-ai':'🌐',
  'ai-agents':'🤖','ai-api-providers':'⚙️',
}

function Tag({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`${colors[color]} text-xs px-2.5 py-1 rounded-full font-medium`}>
      {children}
    </span>
  )
}

function Section({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 space-y-3 ${className}`}>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
        {icon && <span>{icon}</span>}{title}
      </h3>
      {children}
    </div>
  )
}

export default function ToolDetailPage() {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const [tool, setTool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [compareAdded, setCompareAdded] = useState(false)
  const [favAdded, setFavAdded] = useState(false)

  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    setLoading(true); setError(null); setNotFound(false); setTool(null)
    getToolById(toolId)
      .then(setTool)
      .catch(e => {
        if (e.response?.status === 404) setNotFound(true)
        else setError(e.message || 'Failed to load tool.')
      })
      .finally(() => setLoading(false))
  }, [toolId])

  if (loading) return (
    <div className="max-w-3xl mx-auto pt-12">
      <LoadingSpinner label="Loading tool..." />
    </div>
  )

  if (notFound) return (
    <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
      <div className="text-5xl">🔍</div>
      <h2 className="text-xl font-bold text-gray-900">Tool not found</h2>
      <p className="text-gray-400 text-sm">This tool may have been removed or the URL is incorrect.</p>
      <Link to="/tools" className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm">
        ← Back to catalogue
      </Link>
    </div>
  )

  if (error) return (
    <div className="max-w-3xl mx-auto pt-12">
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    </div>
  )

  if (!tool) return null

  const inCompare = isInCompare(tool.id)
  const favd = isFavorite(tool.id)
  const icon = CATEGORY_ICONS[tool.category_id] || '🤖'

  function handleCompare() {
    if (inCompare) { removeFromCompare(tool.id); return }
    addToCompare(tool.id, tool.name)
    setCompareAdded(true)
    setTimeout(() => setCompareAdded(false), 2000)
  }

  function handleFavorite() {
    if (favd) { removeFavorite(tool.id); return }
    addFavorite(tool.id)
    setFavAdded(true)
    setTimeout(() => setFavAdded(false), 2000)
  }

  const ftd = tool.free_tier_details

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12">

      {/* Back navigation */}
      <BackButton fallback="/tools" label="Back to tools" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to={`/categories/${tool.category_id}`} className="hover:text-indigo-600 capitalize">
          {tool.category_id?.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-40">{tool.name}</span>
      </nav>

      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        {/* Title row */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{tool.name}</h1>
            <p className="text-sm text-gray-400 capitalize mt-0.5">
              {tool.category_id?.replace(/-/g, ' ')}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleFavorite}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                favd ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
              title={favd ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favd ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">{tool.description}</p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <PricingBadge pricingType={tool.pricing_type} />
          {tool.api_available && (
            <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-medium">
              API available
            </span>
          )}
          {ftd?.has_watermark === true && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
              Adds watermark
            </span>
          )}
          {ftd?.has_watermark === false && tool.free_availability && (
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">
              No watermark
            </span>
          )}
          {ftd?.commercial_use_allowed === false && (
            <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-medium">
              No commercial use (free)
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100">
          {tool.website_url && (
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Visit website ↗
            </a>
          )}
          <button
            onClick={handleCompare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              inCompare
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : compareSet.length >= 4
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700'
            }`}
            disabled={!inCompare && compareSet.length >= 4}
          >
            {inCompare ? '✓ In comparison' : compareAdded ? '✓ Added!' : '⊕ Add to compare'}
            {!inCompare && compareSet.length > 0 && !compareAdded && (
              <span className="text-xs text-gray-400">({compareSet.length}/4)</span>
            )}
          </button>
          {compareSet.length >= 2 && (
            <Link
              to="/compare"
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Compare now ({compareSet.length}) →
            </Link>
          )}
        </div>

        {/* Success messages */}
        {favAdded && (
          <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-1.5 border border-green-100">
            ❤️ Added to favorites — <Link to="/favorites" className="underline">view favorites</Link>
          </p>
        )}
      </div>

      {/* Free tier — most important section for this platform */}
      {tool.free_availability && (
        <Section title="Free Tier" icon="🆓">
          {ftd ? (
            <div className="space-y-2">
              {[
                { label: 'Credits', value: ftd.credits },
                { label: 'Generation limit', value: ftd.generation_limit },
                { label: 'Daily limit', value: ftd.daily_limit },
                { label: 'Monthly limit', value: ftd.monthly_limit },
                { label: 'Watermark', value: ftd.has_watermark === true ? '⚠️ Yes — added to output' : ftd.has_watermark === false ? '✅ No watermark' : null },
                { label: 'Watermark details', value: ftd.watermark_details },
                { label: 'Feature restrictions', value: ftd.feature_restrictions },
                { label: 'API restrictions', value: ftd.api_restrictions },
                { label: 'Commercial use', value: ftd.commercial_use_allowed === true ? '✅ Allowed' : ftd.commercial_use_allowed === false ? '❌ Not allowed on free tier' : null },
              ].filter(r => r.value != null).map(({ label, value }) => (
                <div key={label} className="flex gap-3 text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 w-40 shrink-0 text-xs font-medium">{label}</span>
                  <span className="text-gray-800">{String(value)}</span>
                </div>
              ))}
              {Object.values(ftd).every(v => v == null) && (
                <p className="text-sm text-gray-400 italic">Free tier available — specific limits not documented.</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Free tier available — specific limits not documented yet.</p>
          )}
          <VerifiedDateBadge date={tool.verified_date} />
        </Section>
      )}

      {!tool.free_availability && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-sm font-medium text-gray-700">{tool.pricing_type}</p>
            <p className="text-xs text-gray-400">No free tier available for this tool.</p>
          </div>
          <VerifiedDateBadge date={tool.verified_date} />
        </div>
      )}

      {/* Capabilities */}
      {tool.capabilities?.length > 0 && (
        <Section title="Capabilities" icon="⚡">
          <div className="flex flex-wrap gap-2">
            {tool.capabilities.map(c => <Tag key={c}>{c}</Tag>)}
          </div>
        </Section>
      )}

      {/* Input / Output */}
      {(tool.input_types?.length > 0 || tool.output_types?.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {tool.input_types?.length > 0 && (
            <Section title="Input" icon="📥">
              <div className="flex flex-wrap gap-2">
                {tool.input_types.map(t => <Tag key={t} color="indigo">{t}</Tag>)}
              </div>
            </Section>
          )}
          {tool.output_types?.length > 0 && (
            <Section title="Output" icon="📤">
              <div className="flex flex-wrap gap-2">
                {tool.output_types.map(t => <Tag key={t} color="green">{t}</Tag>)}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Best use cases */}
      {tool.best_use_cases?.length > 0 && (
        <Section title="Best Use Cases" icon="🎯">
          <ul className="space-y-1.5">
            {tool.best_use_cases.map(u => (
              <li key={u} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                {u}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Limitations */}
      {tool.limitations?.length > 0 && (
        <Section title="Limitations" icon="⚠️">
          <ul className="space-y-1.5">
            {tool.limitations.map(l => (
              <li key={l} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-amber-500 mt-0.5 shrink-0">·</span>
                {l}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Watermark info */}
      {tool.watermark_info && (
        <Section title="Watermark Information" icon="🔖">
          <p className="text-sm text-gray-600">{tool.watermark_info}</p>
        </Section>
      )}

      {/* API availability */}
      <div className={`rounded-xl p-4 flex items-center gap-3 border ${
        tool.api_available ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-200'
      }`}>
        <span className="text-xl">{tool.api_available ? '🔌' : '🚫'}</span>
        <div>
          <p className="text-sm font-medium text-gray-700">
            {tool.api_available ? 'API Available' : 'No Public API'}
          </p>
          <p className="text-xs text-gray-400">
            {tool.api_available
              ? 'This tool offers an API for programmatic integration.'
              : 'This tool does not offer a public API — web or app access only.'}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        {tool.website_url && (
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Visit {tool.name} ↗
          </a>
        )}
        <Link
          to={`/categories/${tool.category_id}`}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          More {tool.category_id?.replace(/-/g, ' ')} tools →
        </Link>
        <Link
          to="/finder"
          className="flex items-center gap-2 px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
        >
          🔍 Find similar tools
        </Link>
      </div>
    </div>
  )
}
