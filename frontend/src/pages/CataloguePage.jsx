import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTools } from '../services/toolsService.js'
import { getCategories } from '../services/categoriesService.js'
import ToolCard from '../components/ToolCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import Pagination from '../components/Pagination.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import BackButton from '../components/BackButton.jsx'
import { SkeletonToolCard } from '../components/SkeletonCard.jsx'
import { Sparkles, SlidersHorizontal } from 'lucide-react'

const LIMIT = 20

/* Animated counter — runs once per value change */
function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    const duration = 600
    const start = performance.now()
    function step(now) {
      const p = Math.min((now - start) / duration, 1)
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value))
      if (p < 1) requestAnimationFrame(step)
      else setDisplay(value)
    }
    requestAnimationFrame(step)
  }, [value])
  return <>{display}</>
}

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tools,      setTools]      = useState([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [categories, setCategories] = useState([])
  /* gridFading drives a CSS class rather than direct DOM manipulation */
  const [gridFading, setGridFading] = useState(false)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    setGridFading(true)   // fade out grid via class

    const params = { limit: LIMIT }
    for (const [k, v] of searchParams.entries()) params[k] = v

    getTools(params)
      .then(r => {
        setTools(r.data || [])
        setTotal(r.total || 0)
        // short delay so the fade-out is visible before new content appears
        setTimeout(() => setGridFading(false), 80)
      })
      .catch(e => { setError(e.message || 'Failed to load tools.'); setGridFading(false) })
      .finally(() => setLoading(false))
  }, [searchParams.toString()])  // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterChange(key, value) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('offset')
      value == null || value === '' ? next.delete(key) : next.set(key, String(value))
      return next
    })
  }

  function handleClear() { setSearchParams({}) }

  function handlePageChange(newOffset) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('offset', String(newOffset))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filters     = Object.fromEntries(searchParams.entries())
  const offset      = parseInt(filters.offset || '0', 10)
  const activeCount = Object.entries(filters).filter(([k, v]) => !['offset', 'limit'].includes(k) && v).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-fade-down">
        <div className="space-y-1">
          <BackButton fallback="/" label="Home" />
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">All AI Tools</h1>
            {total > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold animate-scale-in">
                <Sparkles size={12} aria-hidden="true" />
                <AnimatedCount value={total} />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {activeCount > 0
              ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active — ${total} result${total !== 1 ? 's' : ''}`
              : 'Discover and compare AI tools across every category'}
          </p>
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* Filter sidebar */}
        <div className="shrink-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FilterPanel
            filters={filters}
            options={{ categories }}
            onChange={handleFilterChange}
            onClear={handleClear}
            activeCount={activeCount}
          />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0 space-y-5">

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                  <SkeletonToolCard />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="animate-fade-up">
              <ErrorMessage message={error} onRetry={() => setSearchParams(searchParams)} />
            </div>
          )}

          {!loading && !error && tools.length === 0 && (
            <div className="animate-fade-up">
              <EmptyState message="No tools match the selected filters." cta={{ label: 'Clear all filters', to: '/tools' }} />
            </div>
          )}

          {!loading && !error && tools.length > 0 && (
            /* CSS class transition — no direct DOM style manipulation */
            <div className={`transition-[opacity,transform] duration-200 ${gridFading ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {/* Stat bar */}
              <div className="flex items-center justify-between mb-3 animate-fade-in">
                <p className="text-xs text-gray-400 font-medium">
                  Showing {offset + 1}–{Math.min(offset + tools.length, total)} of{' '}
                  <span className="text-gray-600 font-semibold">{total}</span> tools
                </p>
                {activeCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                    <SlidersHorizontal size={10} aria-hidden="true" />
                    {activeCount} filter{activeCount > 1 ? 's' : ''} active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, i) => (
                  <div key={tool.id} className="animate-slide-up" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                    <ToolCard tool={tool} index={i} />
                  </div>
                ))}
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
                <Pagination total={total} limit={LIMIT} offset={offset} onChange={handlePageChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
