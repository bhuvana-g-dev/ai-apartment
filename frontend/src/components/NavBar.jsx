import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useCompare } from '../context/CompareContext.jsx'

export default function NavBar() {
  const navigate = useNavigate()
  const { compareSet } = useCompare()

  function handleSearch(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🏠</span>
          <span className="font-bold text-gray-900 text-sm sm:text-base">AI Apartment</span>
        </Link>
        <div className="flex-1 max-w-xl">
          <SearchBar onSubmit={handleSearch} placeholder="Search tools..." />
        </div>
        <nav className="hidden sm:flex items-center gap-4 shrink-0 text-sm">
          <Link to="/categories" className="text-gray-600 hover:text-indigo-700 transition-colors">Categories</Link>
          <Link to="/tools" className="text-gray-600 hover:text-indigo-700 transition-colors">All Tools</Link>
          <Link to="/favorites" className="text-gray-600 hover:text-indigo-700 transition-colors">❤️ Favorites</Link>
          {compareSet.length >= 2 && (
            <Link
              to="/compare"
              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              Compare ({compareSet.length})
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
