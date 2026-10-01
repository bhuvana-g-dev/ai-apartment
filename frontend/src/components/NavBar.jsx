import { Link, useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Logo served from public/ folder — stable URL regardless of asset pipeline
const logoSrc = '/logo.png'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { compareSet } = useCompare()
  const { user, login, logout, loading } = useAuth()

  function handleSearch(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`transition-colors text-sm whitespace-nowrap ${
        location.pathname === to
          ? 'text-indigo-700 font-semibold'
          : 'text-gray-600 hover:text-indigo-700'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-shadow">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logoSrc}
            alt="AI Apartment"
            className="w-9 h-9 rounded-xl object-cover shadow-sm"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          {/* Fallback icon shown if logo.png is missing */}
          <div style={{ display: 'none' }} className="w-9 h-9 rounded-xl bg-indigo-600 items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-black text-sm">A²</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-gray-900 text-sm leading-tight">AI Apartment</div>
            <div className="text-xs text-gray-400 leading-tight">One apartment. Different AI.</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar onSubmit={handleSearch} placeholder="Search AI tools..." />
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-3 shrink-0">
          {navLink('/categories', 'Categories')}
          {navLink('/tools', 'All Tools')}
          <Link
            to="/finder"
            className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg whitespace-nowrap ${
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
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              ⊕ {compareSet.length}
            </Link>
          )}
        </nav>

        {/* Auth + Admin */}
        <div className="flex items-center gap-2 shrink-0">
          {!loading && (
            user ? (
              /* Signed in — show avatar + first name + sign out */
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full border border-gray-200"
                  />
                )}
                <span className="hidden md:block text-xs text-gray-600 max-w-[6rem] truncate">
                  {user.displayName?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              /* Signed out — optional sign in */
              <button
                onClick={login}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in
              </button>
            )
          )}
          <Link to="/admin" className="text-gray-300 hover:text-gray-500 transition-colors text-xs hidden md:block">
            Admin
          </Link>
        </div>

      </div>
    </header>
  )
}
