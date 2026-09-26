export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div role="status" aria-label={label} className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
