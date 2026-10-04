import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../services/categoriesService.js'
import { getTools } from '../services/toolsService.js'
import ToolCard from '../components/ToolCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { SkeletonCategoryCard } from '../components/SkeletonCard.jsx'
import {
  Image, Video, PenLine, Code2, Search,
  Mic, Bot, Layers, ArrowRight, Shield, GitCompare,
  Sparkles, TrendingUp, CheckCircle2
} from 'lucide-react'

const TASK_OPTIONS = [
  { label: 'Create Images',   icon: Image,   to: '/categories/image-generation', g: 'from-pink-500 to-rose-500'     },
  { label: 'Write Content',   icon: PenLine,  to: '/categories/writing-ai',        g: 'from-violet-500 to-purple-500' },
  { label: 'Generate Video',  icon: Video,    to: '/categories/video-generation',  g: 'from-red-500 to-orange-500'   },
  { label: 'Write Code',      icon: Code2,    to: '/categories/coding-ai',          g: 'from-slate-600 to-slate-800'  },
  { label: 'Research Topics', icon: Search,   to: '/categories/research-ai',        g: 'from-cyan-500 to-blue-500'   },
  { label: 'Generate Audio',  icon: Mic,      to: '/categories/voice-audio',        g: 'from-orange-500 to-amber-500' },
  { label: 'Automate Tasks',  icon: Bot,      to: '/categories/ai-agents',          g: 'from-gray-600 to-gray-800'   },
  { label: 'Use AI APIs',     icon: Layers,   to: '/categories/ai-api-providers',   g: 'from-emerald-500 to-teal-500' },
]

/* Shared glass card style used below the hero */
const glass = 'bg-white/60 backdrop-blur-md border border-white/70 shadow-sm'

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
    <div className="space-y-16 pb-0">

      {/* ═══════════════════════════════════════════════════════════
          HERO  — dark glass panel, multicolour glow, compact title
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl">

        {/* Base: very dark translucent glass over the page gradient */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" />

        {/* Multicolour in-hero glow spots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 left-1/4  w-72 h-72 rounded-full bg-indigo-500/25  blur-[80px]" />
          <div className="absolute top-10  right-1/4 w-56 h-56 rounded-full bg-violet-500/20  blur-[70px]" />
          <div className="absolute bottom-0 left-0   w-52 h-52 rounded-full bg-teal-500/15    blur-[60px]" />
          <div className="absolute bottom-0 right-0  w-48 h-48 rounded-full bg-pink-500/12    blur-[60px]" />
        </div>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

        {/* Glass border ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />

        {/* ── Content ── */}
        <div className="relative z-10 px-6 pt-12 pb-10 sm:px-14 sm:pt-16 sm:pb-12 flex flex-col items-center text-center gap-6">

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.15] text-slate-300 text-[10px] font-bold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full">
            <Sparkles size={9} className="text-amber-400" />
            AI Tool Directory
          </span>

          {/* Logo + title — SMALLER */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <img src="/logo.png" alt="AI Apartment"
                className="w-12 h-12 rounded-xl object-cover shadow-xl ring-1 ring-white/15"
                onError={e => {
                  e.target.style.display = 'none'
                  document.getElementById('hfb')?.style?.setProperty('display','flex')
                }}
              />
              <div id="hfb" style={{ display: 'none' }}
                className="absolute inset-0 rounded-xl bg-indigo-600 items-center justify-center text-white font-black text-xl shadow-xl">
                A²
              </div>
            </div>

            {/* Title: comfortable, not overwhelming */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.025em] leading-tight">
                AI Apartment
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1.5 font-light">
                One apartment.{' '}
                <span className="text-indigo-300 font-medium">Different AI capabilities.</span>
              </p>
            </div>
          </div>

          {/* Descriptor */}
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            Discover, compare and find the right AI tool for any task — honest pricing, real free-tier details.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-lg">
            <SearchBar
              onSubmit={q => navigate(`/search?q=${encodeURIComponent(q)}`)}
              placeholder="Search by name, capability, use case..."
              dark
            />
          </div>

          {/* Trust pills — one row */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { icon: CheckCircle2, label: 'Honest free-tier limits', c: 'text-emerald-400' },
              { icon: Shield,       label: 'Verified pricing',        c: 'text-indigo-400'  },
              { icon: GitCompare,   label: 'Side-by-side compare',    c: 'text-violet-400'  },
              { icon: Sparkles,     label: 'AI-powered Finder',       c: 'text-amber-400'   },
            ].map(({ icon: Icon, label, c }) => (
              <span key={label}
                className="inline-flex items-center gap-1.5 text-slate-400 text-[11px] font-medium bg-white/[0.05] border border-white/[0.1] px-3 py-1.5 rounded-full hover:bg-white/[0.09] transition-colors cursor-default">
                <Icon size={11} className={c} />
                {label}
              </span>
            ))}
          </div>

          {/* Stats — slim divider style */}
          <div className="flex items-center gap-0 pt-1 divide-x divide-white/10">
            {[
              { v: stats.total     ? `${stats.total}+`      : '90+', l: 'AI tools'   },
              { v: categories.length > 0 ? `${categories.length}` : '14', l: 'Rooms' },
              { v: stats.freeCount ? `${stats.freeCount}+`  : '60+', l: 'Free tiers' },
            ].map(({ v, l }) => (
              <div key={l} className="px-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{v}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FIND BY TASK  — glassy cards on the mesh background
          ═══════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="What do you want to do?"
          sub="Jump straight to the tools you need"
          link={{ to: '/finder', label: 'AI Finder' }}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          {TASK_OPTIONS.map(({ label, icon: Icon, to, g }, idx) => (
            <Link key={to} to={to}
              style={{ animationDelay: `${idx * 0.04}s` }}
              className={`group flex items-center gap-2.5 p-3 rounded-xl ${glass} hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 animate-slide-up`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${g} text-white group-hover:scale-105 transition-transform shadow-sm`}>
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE ROOMS
          ═══════════════════════════════════════════════════════════ */}
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
            <div className={`rounded-xl ${glass} px-4 py-3 text-sm text-red-600`}>
              {error} <button onClick={load} className="ml-2 underline text-xs">Retry</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {categories.map((cat, i) => <CategoryCard key={cat.id} category={cat} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPULAR TOOLS  — compact, skippable
          ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          VALUE PROPS  — three glassy tiles, multicolour left border
          ═══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Shield,     accent: 'border-emerald-400', iconCl: 'text-emerald-500 bg-emerald-500/10',
            title: 'Honest pricing',
            desc:  'Never just "Free". Every tool is labelled Completely Free, Freemium, Free Trial, or Paid Only — with real limits.' },
          { icon: TrendingUp, accent: 'border-indigo-400',  iconCl: 'text-indigo-500 bg-indigo-500/10',
            title: 'Verified & dated',
            desc:  'Every record shows a last-verified date so you know exactly how fresh the pricing info is.' },
          { icon: GitCompare, accent: 'border-violet-400',  iconCl: 'text-violet-500 bg-violet-500/10',
            title: 'Compare anything',
            desc:  'Stack up to 4 tools side by side — pricing, limits, watermarks, API access. No winner declared.' },
        ].map(({ icon: Icon, accent, iconCl, title, desc }) => (
          <div key={title}
            className={`${glass} rounded-2xl px-5 py-5 flex gap-4 border-l-2 ${accent} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
            <div className={`w-9 h-9 rounded-xl ${iconCl} flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARE CTA  — compact dark glass banner
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500/20 blur-[70px]" />
          <div className="absolute bottom-0 left-1/4 w-52 h-52 rounded-full bg-violet-500/15 blur-[60px]" />
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />

        <div className="relative z-10 px-7 py-8 sm:px-12 sm:py-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-indigo-300 text-[10px] font-bold tracking-[0.1em] uppercase bg-indigo-900/50 border border-indigo-700/40 px-2.5 py-1 rounded-full">
              <GitCompare size={9} /> Side-by-side
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compare before you choose</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              Up to 4 tools, side by side — pricing, free tiers, watermarks, API. Facts only.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <Link to="/tools"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors text-center shadow-lg shadow-indigo-900/30">
              Pick tools
            </Link>
            <Link to="/finder"
              className="px-5 py-2.5 text-white text-sm font-medium rounded-xl border border-white/15 hover:bg-white/10 transition-colors text-center">
              AI Finder →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── Reusable compact section header ───────────────────────── */
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
