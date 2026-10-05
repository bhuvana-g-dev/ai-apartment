import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Search, LayoutGrid, Sparkles, Heart, GitCompare, Settings } from 'lucide-react'
import SearchBar from './SearchBar.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/* ── Google icon extracted so it isn't inlined twice ── */
function GoogleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function NavBar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { compareSet } = useCompare()
  const { user, login, logout, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoError, setLogoError]   = useState(false)

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Close on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && mobileOpen) setMobileOpen(false)
  }, [mobileOpen])
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function handleSearch(q) { navigate(`/search?q=${encodeURIComponent(q)}`); setMobileOpen(false) }
  const isActive = (to) => location.pathname === to

  const navLinkCls = (to) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
      isActive(to)
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-700'
    }`

  const MOBILE_LINKS = [
    { to: '/categories', icon: LayoutGrid, label: 'Categories' },
    { to: '/tools',      icon: Sparkles,   label: 'All Tools' },
    { to: '/finder',     icon: Search,     label: 'AI Finder' },
    { to: '/favorites',  icon: Heart,      label: 'Saved' },
    { to: '/compare',    icon: GitCompare, label: `Compare${compareSet.length >= 2 ? ` (${compareSet.length})` : ''}` },
    { to: '/admin',      icon: Settings,   label: 'Admin' },
  ]

  return (
    <>
      {/* ── Sticky header — will-change promotes to compositor layer ── */}
      <header
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm"
        style={{ willChange: 'transform' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">

          {/* Logo — React-state driven error fallback */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            {logoError ? (
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                <span className="text-white font-black text-sm">A²</span>
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="AI Apartment"
                className="w-9 h-9 rounded-xl object-cover shadow-sm"
                onError={() => setLogoError(true)}
              />
            )}
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 text-sm leading-tight">AI Apartment</div>
              <div className="text-xs text-gray-400 leading-tight">One apartment. Different AI.</div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <SearchBar onSubmit={handleSearch} placeholder="Search AI tools..." />
          </div>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-2 shrink-0">
            {[
              { to: '/categories', label: 'Categories' },
              { to: '/tools',      label: 'All Tools' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className={`text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap ${
                isActive(to) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:text-indigo-700'
              }`}>{label}</Link>
            ))}

            <Link to="/finder" className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-150 ${
              isActive('/finder') ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}>
              <Search size={13} /> Finder
            </Link>

            <Link to="/favorites" aria-label="Favorites" className={`text-sm px-2 py-1.5 rounded-lg transition-colors duration-150 ${
              isActive('/favorites') ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}>❤️</Link>

            {compareSet.length >= 2 && (
              <Link to="/compare" className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors duration-150">
                ⊕ {compareSet.length}
              </Link>
            )}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {!loading && (user ? (
              <div className="flex items-center gap-2">
                {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full border border-gray-200" />}
                <span className="text-xs text-gray-600 max-w-20 truncate hidden md:block">{user.displayName?.split(' ')[0]}</span>
                <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150">Sign out</button>
              </div>
            ) : (
              <button onClick={login} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-150 whitespace-nowrap">
                <GoogleIcon /> Sign in
              </button>
            ))}
            <Link to="/admin" aria-label="Admin" className="text-gray-300 hover:text-gray-500 transition-colors duration-150">
              <Settings size={14} />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-150 shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer — animate-drawer-in on mount ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            id="mobile-nav"
            className="absolute top-[57px] left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-drawer-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <SearchBar onSubmit={handleSearch} placeholder="Search AI tools..." />
            </div>
            <nav aria-label="Mobile navigation" className="px-3 py-3 space-y-1">
              {MOBILE_LINKS.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={navLinkCls(to)}>
                  <Icon size={16} className="shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-3 border-t border-gray-100">
              {!loading && (user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />}
                    <span className="text-sm text-gray-700">{user.displayName}</span>
                  </div>
                  <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-150">Sign out</button>
                </div>
              ) : (
                <button onClick={login} className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-150">
                  <GoogleIcon size={16} /> Sign in with Google
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
