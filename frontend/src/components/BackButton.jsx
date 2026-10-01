import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * BackButton — goes to browser history -1, falls back to `fallback` if no history.
 *
 * Props:
 *   fallback  string  URL to navigate to if history is empty (default: '/')
 *   label     string  Text label (default: 'Back')
 *   className string  Extra Tailwind classes
 */
export default function BackButton({ fallback = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate()

  function handleBack() {
    // If there's a history entry to go back to, use it.
    // Otherwise navigate to the fallback route.
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors group ${className}`}
    >
      <ArrowLeft
        size={15}
        className="transition-transform group-hover:-translate-x-0.5"
      />
      <span>{label}</span>
    </button>
  )
}
