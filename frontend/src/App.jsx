import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

// Eager-load only the landing page — everything else is split into its own
// chunk and fetched on demand when the user first navigates to that route.
import HomePage from './pages/HomePage.jsx'

const CategoryListPage   = lazy(() => import('./pages/CategoryListPage.jsx'))
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage.jsx'))
const CataloguePage      = lazy(() => import('./pages/CataloguePage.jsx'))
const ToolDetailPage     = lazy(() => import('./pages/ToolDetailPage.jsx'))
const SearchResultsPage  = lazy(() => import('./pages/SearchResultsPage.jsx'))
const ComparePage        = lazy(() => import('./pages/ComparePage.jsx'))
const FavoritesPage      = lazy(() => import('./pages/FavoritesPage.jsx'))
const FinderPage         = lazy(() => import('./pages/FinderPage.jsx'))
const AdminPage          = lazy(() => import('./pages/AdminPage.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
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
    </BrowserRouter>
  )
}

export default App
