import { AlertCircle, WifiOff, SearchX, RefreshCw } from 'lucide-react'

function classify(message = '') {
  const m = message.toLowerCase()
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch') || m.includes('503') || m.includes('502'))
    return { icon: WifiOff, title: 'Service temporarily unavailable', sub: 'AI Apartment\'s backend is starting up. Please wait a moment and try again.', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' }
  if (m.includes('404') || m.includes('not found'))
    return { icon: SearchX, title: 'Not found', sub: message, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100' }
  if (m.includes('500') || m.includes('internal'))
    return { icon: AlertCircle, title: 'Something went wrong', sub: 'We couldn\'t complete your request. Please try again.', color: 'text-red-500', bg: 'bg-red-50 border-red-100' }
  return { icon: AlertCircle, title: 'Error', sub: message || 'An unexpected error occurred.', color: 'text-red-500', bg: 'bg-red-50 border-red-100' }
}

export default function ErrorMessage({ message, onRetry, compact = false }) {
  const { icon: Icon, title, sub, color, bg } = classify(message)

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${bg}`}>
        <Icon size={14} className={color} />
        <span className="text-gray-600">{sub}</span>
        {onRetry && (
          <button onClick={onRetry} className="ml-auto text-xs text-indigo-600 hover:underline whitespace-nowrap">Retry</button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center gap-4 rounded-2xl border ${bg} px-6`}>
      <Icon size={32} className={`${color} opacity-80`} />
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500 max-w-sm">{sub}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  )
}
