export default function ComparisonIndicator({ count, onOpen }) {
  if (count === 0) return null
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
    >
      ⊕ Compare ({count})
    </button>
  )
}
