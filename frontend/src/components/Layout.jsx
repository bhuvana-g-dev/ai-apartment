import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'
import ComparisonIndicator from './ComparisonIndicator.jsx'

export default function Layout() {
  const location = useLocation()
  return (
    /* transparent — body::before provides the lavender mesh */
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main
        key={location.pathname}
        aria-label="Main content"
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 page-enter"
      >
        <Outlet />
      </main>
      {/* mt-auto pushes footer to bottom; spacing is inside Footer itself */}
      <Footer />
      <ComparisonIndicator />
    </div>
  )
}
