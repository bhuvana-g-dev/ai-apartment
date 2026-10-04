import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'

export default function SearchBar({
  onSubmit,
  initialValue = '',
  placeholder = 'Search AI tools by name, capability, or use case...',
  dark = false,
  hero = false,   // extra-prominent variant used on the HomePage hero
}) {
  const [query, setQuery] = useState(initialValue)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) { setError('Please enter a search term.'); return }
    if (trimmed.length > 200) { setError('Search query must be 200 characters or fewer.'); return }
    setError('')
    onSubmit(trimmed)
  }

  /* ── Hero variant: large, white card, indigo glow, gradient button ── */
  if (hero) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        {/* Outer glow ring */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 opacity-30 blur-md group-focus-within:opacity-60 transition-opacity duration-300" />
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-indigo-200/60 border border-indigo-100/80 overflow-hidden">
            {/* Search icon */}
            <Search size={18} className="ml-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setError('') }}
              placeholder={placeholder}
              maxLength={200}
              className="flex-1 px-3 py-4 text-sm sm:text-[15px] text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 m-1.5 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-400/30 hover:shadow-indigo-400/50"
            >
              Search
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500 pl-1">{error}</p>}
      </form>
    )
  }

  /* ── Dark variant (used on dark hero panels) ── */
  if (dark) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setError('') }}
            placeholder={placeholder}
            maxLength={200}
            className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-sm"
          />
          <button type="submit"
            className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-900/30">
            Search
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
      </form>
    )
  }

  /* ── Default variant (search results page, catalogue, etc.) ── */
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setError('') }}
          placeholder={placeholder}
          maxLength={200}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
        />
        <button type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
          Search
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </form>
  )
}
