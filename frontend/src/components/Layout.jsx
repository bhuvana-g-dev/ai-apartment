import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import ComparisonIndicator from './ComparisonIndicator.jsx'

export default function Layout() {
  const { compareSet } = useCompare()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <ComparisonIndicator count={compareSet.length} onOpen={() => navigate('/compare')} />
    </div>
  )
}
