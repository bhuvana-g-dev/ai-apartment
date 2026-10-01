import { Link } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'

export default function EmptyState({ message, cta, secondaryCta, icon: CustomIcon }) {
  const Icon = CustomIcon || PackageSearch
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Icon size={26} className="text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{message}</p>
      <div className="flex items-center gap-3">
        {cta && (
          <Link
            to={cta.to}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            {cta.label}
          </Link>
        )}
        {secondaryCta && (
          <Link
            to={secondaryCta.to}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  )
}
