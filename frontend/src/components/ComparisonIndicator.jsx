import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, X, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react'
import { useCompare } from '../context/CompareContext.jsx'

export default function ComparisonIndicator() {
  const { compareSet, toolNames, removeFromCompare, clearCompare } = useCompare()
  const [expanded, setExpanded] = useState(false)

  if (compareSet.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-scale-in">

      {/* Expanded tray */}
      {expanded && (
        <div className="mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 w-72 overflow-hidden animate-fade-up">
          {/* Tray header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Comparing {compareSet.length} of 4
            </span>
            <button
              onClick={clearCompare}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Tool list with remove buttons */}
          <ul className="divide-y divide-gray-50">
            {compareSet.map(id => (
              <li key={id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <Link
                  to={`/tools/${id}`}
                  onClick={() => setExpanded(false)}
                  className="text-sm text-gray-800 hover:text-indigo-600 transition-colors truncate max-w-[200px] font-medium"
                >
                  {toolNames[id] || id}
                </Link>
                <button
                  onClick={() => removeFromCompare(id)}
                  className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title={`Remove ${toolNames[id] || id} from comparison`}
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>

          {/* Add more hint */}
          {compareSet.length < 4 && (
            <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100">
              <p className="text-xs text-indigo-600">
                Add {4 - compareSet.length} more tool{4 - compareSet.length !== 1 ? 's' : ''} to compare
              </p>
            </div>
          )}

          {/* Compare button — only when ≥ 2 tools */}
          {compareSet.length >= 2 && (
            <div className="p-3 border-t border-gray-100">
              <Link
                to="/compare"
                onClick={() => setExpanded(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <GitCompare size={15} />
                Compare now
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Floating pill button */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-2.5 bg-indigo-600 text-white pl-4 pr-3 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-all text-sm font-semibold animate-float group"
      >
        <GitCompare size={16} />
        <span>Compare</span>
        <span className="w-5 h-5 bg-white text-indigo-600 rounded-full text-xs font-bold flex items-center justify-center">
          {compareSet.length}
        </span>
        <span className="text-indigo-300 group-hover:text-white transition-colors">
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </button>
    </div>
  )
}
