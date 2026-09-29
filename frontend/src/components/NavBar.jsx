import { Link, useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useCompare } from '../context/CompareContext.jsx'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { compareSet } = useCompare()

  function handleSearch(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`transition-colors text-sm ${
        location.pathname === to
          ? 'text-indigo-700 font-semibold'
          : 'text-gray-600 hover:text-indigo-700'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🏠</span>
          <div className="hidden sm:block">
            <div className="font-bold text-gray-900 text-sm leading-tight">AI Apartment</div>
            <div className="text-xs text-gray-400 leading-tight">One apartment. Different AI.</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar onSubmit={handleSearch} placeholder="Search AI tools..." />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4 shrink-0">
          {navLink('/categories', 'Categories')}
          {navLink('/tools', 'All Tools')}
          <Link
            to="/finder"
            className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
              location.pathname === '/finder'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            🔍 Finder
          </Link>
          {navLink('/favorites', '❤️ Saved')}
          {compareSet.length >= 2 && (
            <Link
              to="/compare"
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors animate-pulse"
            >
              ⊕ Compare ({compareSet.length})
            </Link>
          )}
          <Link to="/admin" className="text-gray-300 hover:text-gray-500 transition-colors text-xs">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
