import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import CategoryListPage from './pages/CategoryListPage.jsx'
import CategoryDetailPage from './pages/CategoryDetailPage.jsx'
import CataloguePage from './pages/CataloguePage.jsx'
import ToolDetailPage from './pages/ToolDetailPage.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/:categorySlug" element={<CategoryDetailPage />} />
          <Route path="/tools" element={<CataloguePage />} />
          <Route path="/tools/:toolId" element={<ToolDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
