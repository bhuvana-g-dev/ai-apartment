import { useState } from 'react'

export default function SearchBar({ onSubmit, initialValue = '', placeholder = 'Search AI tools by name, capability, or use case...' }) {
  const [query, setQuery] = useState(initialValue)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setError('Please enter a search term.')
      return
    }
    if (trimmed.length > 200) {
      setError('Search query must be 200 characters or fewer.')
      return
    }
    setError('')
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setError('') }}
          placeholder={placeholder}
          maxLength={200}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </form>
  )
}
