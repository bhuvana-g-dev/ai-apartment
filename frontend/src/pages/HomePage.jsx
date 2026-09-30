import { useEffect, useState } from 'react'
import { getCategories } from '../services/categoriesService.js'
import { getTools } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useNavigate, Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  'chat-ai': '💬', 'writing-ai': '✍️', 'research-ai': '🔬',
  'image-generation': '🎨', 'video-generation': '🎬', 'voice-audio': '🎤',
  'music-generation': '🎵', 'coding-ai': '💻', 'design-ai': '🖌️',
  'productivity-ai': '⚡', 'document-ai': '📄', 'translation-ai': '🌐',
  'ai-agents': '🤖', 'ai-api-providers': '⚙️',
}

const CATEGORY_COLORS = {
  'chat-ai': 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400',
  'writing-ai': 'from-violet-50 to-violet-100 border-violet-200 hover:border-violet-400',
  'research-ai': 'from-cyan-50 to-cyan-100 border-cyan-200 hover:border-cyan-400',
  'image-generation': 'from-pink-50 to-pink-100 border-pink-200 hover:border-pink-400',
  'video-generation': 'from-red-50 to-red-100 border-red-200 hover:border-red-400',
  'voice-audio': 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400',
  'music-generation': 'from-green-50 to-green-100 border-green-200 hover:border-green-400',
  'coding-ai': 'from-slate-50 to-slate-100 border-slate-200 hover:border-slate-400',
  'design-ai': 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200 hover:border-fuchsia-400',
  'productivity-ai': 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-400',
  'document-ai': 'from-teal-50 to-teal-100 border-teal-200 hover:border-teal-400',
  'translation-ai': 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400',
  'ai-agents': 'from-gray-50 to-gray-100 border-gray-300 hover:border-gray-500',
  'ai-api-providers': 'from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-400',
}

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const [catRes, toolRes] = await Promise.all([
        getCategories(),
        getTools({ limit: 8 }),
      ])
      setCategories(catRes.data || [])
      setTools((toolRes.data || []).slice(0, 8))
    } catch (e) {
      setError(e.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <section className="text-center pt-12 pb-4 space-y-6">
        {/* Logo */}
        <div className="mx-auto">
          <img
            src="/logo.png"
            alt="AI Apartment"
            className="w-24 h-24 rounded-2xl object-cover shadow-xl shadow-amber-200/50 mx-auto"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div style={{ display: 'none' }} className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mx-auto">
            <span className="text-white font-black text-4xl tracking-tight leading-none">A²</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight">
            AI Apartment
          </h1>
          <p className="text-lg sm:text-xl text-indigo-600 font-semibold">
            One apartment. Different AI capabilities.
          </p>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            90+ AI tools across 14 rooms. Discover, compare, and find the right tool for any task — with honest free-tier information.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <SearchBar onSubmit={q => navigate(`/search?q=${encodeURIComponent(q)}`)} />
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">✓ No hype</span>
          <span className="flex items-center gap-1">✓ Honest free-tier limits</span>
          <span className="flex items-center gap-1">✓ Verified dates</span>
          <span className="flex items-center gap-1">✓ Side-by-side compare</span>
        </div>
      </section>

      {loading && <LoadingSpinner label="Loading the apartment..." />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          {/* ── THE ROOMS ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">The Rooms</h2>
                <p className="text-sm text-gray-400">Each room is a category of AI capability</p>
              </div>
              <Link to="/categories" className="text-sm text-indigo-600 hover:underline">
                All rooms →
              </Link>
            </div>

            {categories.length === 0 ? (
              <p className="text-gray-400 text-sm">No categories available yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                {categories.map(cat => {
                  const icon = CATEGORY_ICONS[cat.slug] || '🏠'
                  const color = CATEGORY_COLORS[cat.slug] || 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400'
                  return (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      className={`flex flex-col items-center gap-2 p-3 bg-gradient-to-b ${color} rounded-xl border transition-all text-center group hover:shadow-md hover:-translate-y-0.5`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 leading-tight">
                        {cat.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* ── FINDER CTA ── */}
          <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center space-y-4">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
            <div className="relative space-y-3">
              <div className="text-4xl">🔍</div>
              <h2 className="text-2xl font-bold">Not sure which tool to use?</h2>
              <p className="text-indigo-100 max-w-sm mx-auto text-sm">
                Describe your task in plain English. Our AI Finder recommends the right tools with reasoning.
              </p>
              <Link
                to="/finder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors"
              >
                Try the AI Finder →
              </Link>
            </div>
          </section>

          {/* ── FEATURED TOOLS ── */}
          {tools.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Featured Tools</h2>
                  <p className="text-sm text-gray-400">Handpicked from across the apartment</p>
                </div>
                <Link to="/tools" className="text-sm text-indigo-600 hover:underline">
                  All tools →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </section>
          )}

          {/* ── BOTTOM STATS ── */}
          <section className="border-t border-gray-100 pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { label: 'AI Tools', value: '90+' },
                { label: 'Categories', value: '14' },
                { label: 'Free Tiers Tracked', value: '70+' },
                { label: 'Pricing Labels', value: '4' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-3xl font-black text-indigo-600">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
