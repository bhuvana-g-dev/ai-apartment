import { Outlet } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import { useCompare } from '../context/CompareContext.jsx'
import ComparisonIndicator from './ComparisonIndicator.jsx'
import { useNavigate } from 'react-router-dom'

export default function Layout() {
  const { compareSet } = useCompare()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ComparisonIndicator count={compareSet.length} onOpen={() => navigate('/compare')} />
    </div>
  )
}
