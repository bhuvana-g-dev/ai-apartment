import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../services/categoriesService.js'
import { getTools } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { SkeletonToolCard, SkeletonCategoryCard } from '../components/SkeletonCard.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import {
  Image, Video, PenLine, Code2, Search,
  Mic, Bot, Layers, ArrowRight, BarChart3, Shield, GitCompare
} from 'lucide-react'

// Find by Task entries — link straight to filtered tools
const TASK_OPTIONS = [
  { label: 'Create Images',    icon: Image,        to: '/categories/image-generation',  color: 'text-pink-600 bg-pink-50 border-pink-100 hover:border-pink-300' },
  { label: 'Write Content',    icon: PenLine,       to: '/categories/writing-ai',         color: 'text-violet-600 bg-violet-50 border-violet-100 hover:border-violet-300' },
  { label: 'Generate Video',   icon: Video,         to: '/categories/video-generation',   color: 'text-red-600 bg-red-50 border-red-100 hover:border-red-300' },
  { label: 'Write Code',       icon: Code2,         to: '/categories/coding-ai',          color: 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-400' },
  { label: 'Research Topics',  icon: Search,        to: '/categories/research-ai',        color: 'text-cyan-600 bg-cyan-50 border-cyan-100 hover:border-cyan-300' },
  { label: 'Generate Audio',   icon: Mic,           to: '/categories/voice-audio',        color: 'text-orange-600 bg-orange-50 border-orange-100 hover:border-orange-300' },
  { label: 'Automate Tasks',   icon: Bot,           to: '/categories/ai-agents',          color: 'text-gray-600 bg-gray-50 border-gray-200 hover:border-gray-400' },
  { label: 'Use AI APIs',      icon: Layers,        to: '/categories/ai-api-providers',   color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tools, setTools] = useState([])
  const [stats, setStats] = useState({ total: null, freeCount: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const [catRes, toolRes] = await Promise.all([
        getCategories(),
        getTools({ limit: 8 }),
      ])
      const cats = catRes.data || []
      const toolList = toolRes.data || []
      setCategories(cats)
      setTools(toolList.slice(0, 8))
      setStats({
        total: toolRes.total || toolList.length,
        freeCount: toolList.filter(t => t.free_availability).length,
      })
    } catch (e) {
      setError('Could not connect to the AI Apartment service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-20 pb-0">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="text-center pt-10 pb-2 space-y-8">
        <div className="space-y-5">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 relative">
            <img
              src="/logo.png"
              alt="AI Apartment"
              className="w-20 h-20 rounded-2xl object-cover shadow-xl mx-auto"
              onError={e => {
                e.target.style.display = 'none'
                const fallback = document.getElementById('logo-fallback')
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div id="logo-fallback" style={{ display: 'none' }}
              className="w-20 h-20 rounded-2xl bg-indigo-600 items-center justify-center shadow-xl mx-auto">
              <span className="text-white font-black text-3xl">A²</span>
            </div>
          </div>

          <div>
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-none">
              AI Apartment
            </h1>
            <p className="text-lg sm:text-xl text-indigo-600 font-semibold mt-3">
              AI tools, organized.
            </p>
          </div>

          <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
            Discover, compare and find the right AI tool for any task — with honest pricing and real free-tier information.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSubmit={q => navigate(`/search?q=${encodeURIComponent(q)}`)}
            placeholder="Search tools by name, capability, or use case..."
          />
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><Shield size={12} className="text-green-500" /> Honest free-tier limits</span>
          <span className="flex items-center gap-1.5"><BarChart3 size={12} className="text-indigo-500" /> Verified pricing dates</span>
          <span className="flex items-center gap-1.5"><GitCompare size={12} className="text-purple-500" /> Side-by-side compare</span>
          <span className="flex items-center gap-1.5"><Search size={12} className="text-cyan-500" /> AI-powered Finder</span>
        </div>
      </section>

      {/* ── FIND BY TASK ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">What do you want to do?</h2>
            <p className="text-sm text-gray-400 mt-1">Jump straight to the tools you need</p>
          </div>
          <Link to="/finder" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline whitespace-nowrap">
            Use AI Finder <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TASK_OPTIONS.map(({ label, icon: Icon, to, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-4 rounded-xl border bg-white transition-all hover:shadow-sm hover:-translate-y-0.5 ${color}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color.split(' ').slice(1).join(' ')}`}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THE ROOMS ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">The Rooms</h2>
            <p className="text-sm text-gray-400 mt-1">Browse every AI capability category</p>
          </div>
          <Link to="/categories" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
            All rooms <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {Array.from({ length: 14 }).map((_, i) => <SkeletonCategoryCard key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
            <button onClick={load} className="ml-3 underline text-xs">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        )}
      </section>

      {/* ── POPULAR AI TOOLS ──────────────────────────────────── */}
      {!loading && !error && tools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Popular AI Tools</h2>
              <p className="text-sm text-gray-400 mt-1">Across the most-used categories</p>
            </div>
            <Link to="/tools" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
              All {stats.total ? `${stats.total}+` : ''} tools <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </section>
      )}

      {/* ── COMPARE CTA ───────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-gray-900 to-indigo-950 p-8 sm:p-12 text-white">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-sm font-medium bg-indigo-900/50 px-3 py-1.5 rounded-full">
            <GitCompare size={14} />
            Side-by-side comparison
          </div>
          <h2 className="text-3xl font-bold">Compare before you choose</h2>
          <p className="text-gray-300 leading-relaxed">
            Stack up to 4 AI tools side by side — pricing, free tiers, capabilities, watermarks, API availability. Factual data, no winner declared.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/tools"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors"
            >
              Pick tools to compare
            </Link>
            <Link
              to="/finder"
              className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Find tools first →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 pt-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'AI Tools', value: stats.total ? `${stats.total}+` : '90+' },
            { label: 'Categories', value: categories.length > 0 ? `${categories.length}` : '14' },
            { label: 'With Free Tier', value: stats.freeCount ? `${stats.freeCount}+` : '60+' },
            { label: 'Pricing Labels', value: '4' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-4xl font-black text-indigo-600">{value}</div>
              <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
