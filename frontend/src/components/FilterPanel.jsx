import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

const PRICING_TYPES = ['Completely Free', 'Freemium', 'Free Trial', 'Paid Only']

export default function FilterPanel({ filters, options = {}, onChange, onClear, activeCount = 0 }) {
  const [open, setOpen] = useState(true)

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 overflow-hidden min-w-52 w-52 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <SlidersHorizontal size={14} className="text-gray-400" />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
          {open ? <ChevronUp size={13} className="text-gray-400 ml-auto" /> : <ChevronDown size={13} className="text-gray-400 ml-auto" />}
        </button>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 py-3 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
            <select
              value={filters.category_id || ''}
              onChange={e => onChange('category_id', e.target.value || null)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">All categories</option>
              {(options.categories || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Pricing</label>
            <select
              value={filters.pricing_type || ''}
              onChange={e => onChange('pricing_type', e.target.value || null)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="">Any pricing</option>
              {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5">
            {[
              { key: 'free_availability', label: 'Has free tier', checkValue: 'true' },
              { key: 'api_available', label: 'API available', checkValue: 'true' },
              { key: 'has_watermark', label: 'No watermark', checkValue: 'false', invert: true },
            ].map(({ key, label, checkValue, invert }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => {
                    const isActive = invert
                      ? filters[key] === 'false' || filters[key] === false
                      : filters[key] === 'true' || filters[key] === true
                    onChange(key, isActive ? null : checkValue)
                  }}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                    (invert ? filters[key] === 'false' : filters[key] === 'true' || filters[key] === true)
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300 group-hover:border-indigo-300'
                  }`}
                >
                  {(invert ? filters[key] === 'false' : filters[key] === 'true' || filters[key] === true) && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
