import { lazy, Suspense, Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

// Eager — first paint
import HomePage from './pages/HomePage.jsx'

// Lazy — each gets its own chunk, downloaded on first visit
const CategoryListPage   = lazy(() => import('./pages/CategoryListPage.jsx'))
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage.jsx'))
const CataloguePage      = lazy(() => import('./pages/CataloguePage.jsx'))
const ToolDetailPage     = lazy(() => import('./pages/ToolDetailPage.jsx'))
const SearchResultsPage  = lazy(() => import('./pages/SearchResultsPage.jsx'))
const ComparePage        = lazy(() => import('./pages/ComparePage.jsx'))
const FavoritesPage      = lazy(() => import('./pages/FavoritesPage.jsx'))
const FinderPage         = lazy(() => import('./pages/FinderPage.jsx'))
const AdminPage          = lazy(() => import('./pages/AdminPage.jsx'))

/* ── Error boundary for lazy chunk load failures ── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-4 max-w-sm">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
            <p className="text-sm text-slate-500">
              This page failed to load. Check your connection and try again.
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.reload() }}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const SuspenseFallback = (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={SuspenseFallback}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"                          element={<HomePage />} />
              <Route path="/categories"                element={<CategoryListPage />} />
              <Route path="/categories/:categorySlug"  element={<CategoryDetailPage />} />
              <Route path="/tools"                     element={<CataloguePage />} />
              <Route path="/tools/:toolId"             element={<ToolDetailPage />} />
              <Route path="/search"                    element={<SearchResultsPage />} />
              <Route path="/compare"                   element={<ComparePage />} />
              <Route path="/favorites"                 element={<FavoritesPage />} />
              <Route path="/finder"                    element={<FinderPage />} />
              <Route path="/admin"                     element={<AdminPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
