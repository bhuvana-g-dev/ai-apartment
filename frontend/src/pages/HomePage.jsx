import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../services/categoriesService.js'
import { getTools } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { SkeletonCategoryCard } from '../components/SkeletonCard.jsx'
import {
  Image, Video, PenLine, Code2, Search, Mic, Bot, Layers,
  ArrowRight, Shield, GitCompare, Sparkles, TrendingUp,
  CheckCircle2, Boxes, Tag, Zap
} from 'lucide-react'

/* ── Task quick-links (right column of hero on desktop) ──────── */
const TASK_OPTIONS = [
  { label: 'Create Images',   icon: Image,   to: '/categories/image-generation', g: 'from-pink-500 to-rose-500',     bg: 'bg-pink-50',    ic: 'text-pink-600'    },
  { label: 'Write Content',   icon: PenLine,  to: '/categories/writing-ai',        g: 'from-violet-500 to-purple-500', bg: 'bg-violet-50',  ic: 'text-violet-600'  },
  { label: 'Generate Video',  icon: Video,    to: '/categories/video-generation',  g: 'from-red-500 to-orange-500',   bg: 'bg-red-50',     ic: 'text-red-600'     },
  { label: 'Generate Audio',  icon: Mic,      to: '/categories/voice-audio',        g: 'from-orange-500 to-amber-500', bg: 'bg-orange-50',  ic: 'text-orange-600'  },
  { label: 'Research Topics', icon: Search,   to: '/categories/research-ai',        g: 'from-cyan-500 to-blue-500',    bg: 'bg-cyan-50',    ic: 'text-cyan-600'    },
  { label: 'Use AI APIs',     icon: Layers,   to: '/categories/ai-api-providers',   g: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', ic: 'text-emerald-600' },
  { label: 'Write Code',      icon: Code2,    to: '/categories/coding-ai',           g: 'from-slate-600 to-slate-800',  bg: 'bg-slate-50',   ic: 'text-slate-700'   },
  { label: 'Automate Tasks',  icon: Bot,      to: '/categories/ai-agents',           g: 'from-purple-500 to-indigo-600',bg: 'bg-purple-50',  ic: 'text-purple-600'  },
]

/* Shared glass surface for below-hero sections */
const card = 'bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm'

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tools, setTools]           = useState([])
  const [stats, setStats]           = useState({ total: null, freeCount: null })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const [catRes, toolRes] = await Promise.all([
        getCategories(),
        getTools({ limit: 8 }),
      ])
      const cats     = catRes.data  || []
      const toolList = toolRes.data || []
      setCategories(cats)
      setTools(toolList.slice(0, 8))
      setStats({
        total:     toolRes.total || toolList.length,
        freeCount: toolList.filter(t => t.free_availability).length,
      })
    } catch {
      setError('Could not connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-14 pb-0">

      {/* ═══════════════════════════════════════════════════════
          HERO — left text + right task grid, light lavender bg
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl min-h-[340px]">

        {/* Layered lavender-to-white background matching reference */}
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 70% at 0% 0%,   rgba(167,139,250,0.35) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 100% 0%,  rgba(99,102,241,0.20)  0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 100% 100%,rgba(192,132,252,0.18) 0%, transparent 50%),
              linear-gradient(160deg, #ede9fe 0%, #f5f3ff 35%, #ffffff 70%, #faf5ff 100%)
            `
          }}
        />

        {/* Soft bokeh circles for depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="absolute top-0 right-1/3   w-48 h-48 rounded-full bg-indigo-300/15 blur-3xl" />
          <div className="absolute bottom-0 right-0  w-56 h-56 rounded-full bg-purple-200/20 blur-3xl" />
        </div>

        {/* ── Content: two-column on desktop ── */}
        <div className="relative z-10 px-7 pt-10 pb-8 sm:px-12 sm:pt-12 sm:pb-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT — headline, search, trust, stats */}
          <div className="space-y-5">

            {/* Title */}
            <div>
              <h1 className="text-[2.4rem] sm:text-[3.2rem] font-extrabold text-slate-900 leading-[1.05] tracking-[-0.025em]">
                AI Apartment
              </h1>
              <p className="text-xl sm:text-2xl font-bold mt-1 leading-snug">
                <span className="text-indigo-600">One apartment.</span>{' '}
                <span className="text-amber-500">Different AI.</span>
              </p>
            </div>

            {/* Descriptor */}
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm">
              Discover, compare and find the right AI tool for any task — with honest pricing and real free-tier information.
            </p>

            {/* Search */}
            <div className="max-w-lg w-full">
              <SearchBar
                onSubmit={q => navigate(`/search?q=${encodeURIComponent(q)}`)}
                placeholder="Search tools by name, capability, or use case..."
                hero
              />
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: CheckCircle2, label: 'Honest free-tier limits', cl: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { icon: Shield,       label: 'Verified pricing dates',  cl: 'text-indigo-600 bg-indigo-50 border-indigo-100'   },
                { icon: GitCompare,   label: 'Side-by-side compare',    cl: 'text-violet-600 bg-violet-50 border-violet-100'   },
                { icon: Sparkles,     label: 'AI-powered Finder',       cl: 'text-amber-600 bg-amber-50 border-amber-100'      },
              ].map(({ icon: Icon, label, cl }) => (
                <span key={label}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium border px-2.5 py-1 rounded-full ${cl}`}>
                  <Icon size={10} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — 2×4 task quick-link grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {TASK_OPTIONS.map(({ label, icon: Icon, to, g, bg, ic }, idx) => (
              <Link key={to} to={to}
                style={{ animationDelay: `${idx * 0.05}s` }}
                className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/80 border border-white/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 animate-slide-up"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${g} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon size={15} />
                </div>
                <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900 leading-tight">{label}</span>
                <ArrowRight size={11} className="ml-auto text-slate-300 group-hover:text-slate-500 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Stats bar — white pill at bottom ── */}
        <div className="relative z-10 mx-7 mb-7 sm:mx-12 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl shadow-sm px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Boxes,   iconCl: 'bg-violet-100 text-violet-600', v: stats.total     ? `${stats.total}+`          : '90+', l: 'AI Tools'      },
              { icon: Layers,  iconCl: 'bg-amber-100  text-amber-600',  v: categories.length > 0 ? `${categories.length}` : '14', l: 'Categories'    },
              { icon: Zap,     iconCl: 'bg-emerald-100 text-emerald-600', v: stats.freeCount ? `${stats.freeCount}+`    : '60+', l: 'With Free Tier' },
              { icon: Tag,     iconCl: 'bg-indigo-100 text-indigo-600', v: '4',                                                   l: 'Pricing Labels' },
            ].map(({ icon: Icon, iconCl, v, l }) => (
              <div key={l} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${iconCl} flex items-center justify-center shrink-0`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 leading-none">{v}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TASK STRIP  — horizontal scrollable on mobile
          ═══════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="What do you want to do today?"
          sub="Jump straight to the tools you need"
          link={{ to: '/categories', label: 'Explore all categories' }}
        />
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {TASK_OPTIONS.map(({ label, icon: Icon, to, g, bg, ic }) => (
            <Link key={to} to={to}
              className="group flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-white/75 border border-white/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 min-w-[90px]"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${ic} group-hover:scale-105 transition-transform`}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE ROOMS
          ═══════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="The Rooms"
          sub="Browse every AI capability"
          link={{ to: '/categories', label: 'All rooms' }}
        />
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {Array.from({ length: 14 }).map((_, i) => <SkeletonCategoryCard key={i} />)}
            </div>
          ) : error ? (
            <div className={`rounded-xl ${card} px-4 py-3 text-sm text-red-600`}>
              {error} <button onClick={load} className="ml-2 underline text-xs">Retry</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {categories.map((cat, i) => <CategoryCard key={cat.id} category={cat} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          POPULAR TOOLS
          ═══════════════════════════════════════════════════════ */}
      {!loading && !error && tools.length > 0 && (
        <section>
          <SectionHeader
            title="Popular AI Tools"
            sub="Across the most-used categories"
            link={{ to: '/tools', label: `All ${stats.total ? stats.total + '+' : ''} tools` }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {tools.map((tool, i) => <ToolCard key={tool.id} tool={{ ...tool, _index: i }} />)}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          VALUE PROPS
          ═══════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Shield,     lc: 'border-l-emerald-400', ic: 'text-emerald-600 bg-emerald-50',
            title: 'Honest pricing',
            desc:  'Never just "Free". Every tool is labelled Completely Free, Freemium, Free Trial, or Paid Only — with real limits.' },
          { icon: TrendingUp, lc: 'border-l-indigo-400',  ic: 'text-indigo-600 bg-indigo-50',
            title: 'Verified & dated',
            desc:  'Every record shows a last-verified date so you know exactly how fresh the pricing info is.' },
          { icon: GitCompare, lc: 'border-l-violet-400',  ic: 'text-violet-600 bg-violet-50',
            title: 'Compare anything',
            desc:  'Stack up to 4 tools side by side — pricing, limits, watermarks, API access. No winner declared.' },
        ].map(({ icon: Icon, lc, ic, title, desc }) => (
          <div key={title}
            className={`${card} rounded-2xl px-5 py-5 flex gap-3.5 border-l-[3px] ${lc} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
            <div className={`w-9 h-9 rounded-xl ${ic} flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════
          COMPARE CTA — soft gradient banner, no dark bg
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)'
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 px-7 py-8 sm:px-12 sm:py-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-indigo-100 text-[10px] font-bold tracking-widest uppercase bg-white/15 border border-white/20 px-2.5 py-1 rounded-full">
              <GitCompare size={9} /> Side-by-side
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compare before you choose</h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed max-w-xs">
              Up to 4 tools, side by side — pricing, free tiers, watermarks, API. Facts only.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <Link to="/tools"
              className="px-5 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-colors text-center shadow-md">
              Pick tools to compare
            </Link>
            <Link to="/finder"
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl border border-white/25 transition-colors text-center">
              AI Finder →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── Compact section header ─────────────────────────────────── */
function SectionHeader({ title, sub, link }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {link && (
        <Link to={link.to}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors shrink-0">
          {link.label} <ArrowRight size={11} />
        </Link>
      )}
    </div>
  )
}
