import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Placeholder pages — will be replaced in tasks 12.x
const Placeholder = ({ name }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold">{name}</h1>
    <p className="text-gray-500 mt-2">Coming soon</p>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/categories" element={<Placeholder name="Categories" />} />
        <Route path="/categories/:categorySlug" element={<Placeholder name="Category Detail" />} />
        <Route path="/tools" element={<Placeholder name="Catalogue" />} />
        <Route path="/tools/:toolId" element={<Placeholder name="Tool Detail" />} />
        <Route path="/search" element={<Placeholder name="Search Results" />} />
        <Route path="/compare" element={<Placeholder name="Compare" />} />
        <Route path="/favorites" element={<Placeholder name="Favorites" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
