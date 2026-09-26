const PRICING_TYPES = ['Completely Free', 'Freemium', 'Free Trial', 'Paid Only']

export default function FilterPanel({ filters, options = {}, onChange, onClear }) {
  const activeCount = Object.values(filters).filter(v => v !== '' && v !== undefined && v !== null).length

  return (
    <aside className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 min-w-56">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 text-sm">Filters {activeCount > 0 && <span className="ml-1 text-indigo-600">({activeCount})</span>}</h3>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
        <select
          value={filters.category_id || ''}
          onChange={e => onChange('category_id', e.target.value || null)}
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All categories</option>
          {(options.categories || []).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Pricing type */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Pricing</label>
        <select
          value={filters.pricing_type || ''}
          onChange={e => onChange('pricing_type', e.target.value || null)}
          className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Any pricing</option>
          {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Free availability */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.free_availability === 'true' || filters.free_availability === true}
          onChange={e => onChange('free_availability', e.target.checked ? 'true' : null)}
          className="rounded text-indigo-600"
        />
        Has free tier
      </label>

      {/* API available */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.api_available === 'true' || filters.api_available === true}
          onChange={e => onChange('api_available', e.target.checked ? 'true' : null)}
          className="rounded text-indigo-600"
        />
        API available
      </label>

      {/* Watermark */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.has_watermark === 'false' || filters.has_watermark === false}
          onChange={e => onChange('has_watermark', e.target.checked ? 'false' : null)}
          className="rounded text-indigo-600"
        />
        No watermark
      </label>
    </aside>
  )
}
