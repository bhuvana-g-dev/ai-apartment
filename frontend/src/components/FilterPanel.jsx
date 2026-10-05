import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

const PRICING_TYPES = ['Completely Free', 'Freemium', 'Free Trial', 'Paid Only']

export default function FilterPanel({ filters, options = {}, onChange, onClear, activeCount = 0 }) {
  const [open, setOpen] = useState(true)

  return (
    <aside className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/70 shadow-sm overflow-hidden min-w-52 w-52 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-150"
        >
          <SlidersHorizontal size={14} className="text-gray-400" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
          {open
            ? <ChevronUp size={13} className="text-gray-400 ml-auto" aria-hidden="true" />
            : <ChevronDown size={13} className="text-gray-400 ml-auto" aria-hidden="true" />
          }
        </button>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors duration-150"
            aria-label="Clear all filters"
          >
            <X size={12} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 py-3 space-y-4">

          {/* Category dropdown */}
          <div>
            <label htmlFor="filter-category" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              id="filter-category"
              value={filters.category_id || ''}
              onChange={e => onChange('category_id', e.target.value || null)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white transition-colors duration-150"
            >
              <option value="">All categories</option>
              {(options.categories || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Pricing dropdown */}
          <div>
            <label htmlFor="filter-pricing" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Pricing
            </label>
            <select
              id="filter-pricing"
              value={filters.pricing_type || ''}
              onChange={e => onChange('pricing_type', e.target.value || null)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white transition-colors duration-150"
            >
              <option value="">Any pricing</option>
              {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Real checkboxes — keyboard accessible, screen-reader friendly */}
          <fieldset className="space-y-2.5 border-0 p-0 m-0">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Options</legend>
            {[
              { id: 'f-free',      key: 'free_availability', label: 'Has free tier',  checkValue: 'true',  invert: false },
              { id: 'f-api',       key: 'api_available',     label: 'API available',  checkValue: 'true',  invert: false },
              { id: 'f-watermark', key: 'has_watermark',     label: 'No watermark',   checkValue: 'false', invert: true  },
            ].map(({ id, key, label, checkValue, invert }) => {
              const checked = invert
                ? filters[key] === 'false' || filters[key] === false
                : filters[key] === 'true'  || filters[key] === true
              return (
                <label key={id} htmlFor={id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id={id}
                    checked={!!checked}
                    onChange={() => onChange(key, checked ? null : checkValue)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-150 select-none">
                    {label}
                  </span>
                </label>
              )
            })}
          </fieldset>
        </div>
      )}
    </aside>
  )
}
