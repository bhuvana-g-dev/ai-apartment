import { Link } from 'react-router-dom'

export default function EmptyState({ message, cta }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="text-5xl">🏠</div>
      <p className="text-gray-500 text-base max-w-sm">{message}</p>
      {cta && (
        <Link
          to={cta.to}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
