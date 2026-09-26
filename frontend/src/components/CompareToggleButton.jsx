export default function CompareToggleButton({ toolId, inSet, disabled, onToggle }) {
  return (
    <button
      onClick={() => onToggle(toolId)}
      disabled={disabled && !inSet}
      title={disabled && !inSet ? 'Maximum 4 tools in comparison' : inSet ? 'Remove from comparison' : 'Add to comparison'}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors
        ${inSet
          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
          : disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
        }`}
    >
      {inSet ? '✓ Comparing' : '⊕ Compare'}
    </button>
  )
}
