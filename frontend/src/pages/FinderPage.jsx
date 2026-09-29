import { useState } from 'react'
import { findToolsForTask } from '../services/finderService.js'
import { Link } from 'react-router-dom'
import PricingBadge from '../components/PricingBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

const EXAMPLE_TASKS = [
  "I want to create a 30-second video from an image for free",
  "I need to transcribe a podcast episode without paying",
  "Generate a logo for my startup without watermarks",
  "I want to write blog posts faster with AI",
  "Build a web app from a description without coding",
  "Translate my website to 10 languages with an API",
]

export default function FinderPage() {
  const [task, setTask] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = task.trim()
    if (!trimmed || trimmed.length < 5) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await findToolsForTask(trimmed)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to find tools.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900">Task-Based AI Finder</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Describe what you want to do in plain language. We'll recommend the best AI tools with reasoning.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="e.g. I want to create a short video from a photo for free without a watermark..."
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{task.length}/500</span>
          <button
            type="submit"
            disabled={task.trim().length < 5 || loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Finding tools...' : 'Find tools →'}
          </button>
        </div>
      </form>

      {/* Example tasks */}
      {!results && !loading && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TASKS.map(ex => (
              <button
                key={ex}
                onClick={() => setTask(ex)}
                className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-indigo-200 transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <LoadingSpinner label="Analysing your task..." />}
      {error && <ErrorMessage message={error} />}

      {/* Results */}
      {results && results.recommendations.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No matching tools found. Try rephrasing your task.
        </div>
      )}

      {results && results.recommendations.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Found <strong>{results.recommendations.length}</strong> tools for: <em>"{results.task}"</em>
          </p>
          <div className="space-y-3">
            {results.recommendations.map(({ tool, reasoning }, idx) => (
              <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-indigo-400 min-w-6">#{idx + 1}</span>
                    <div>
                      <Link to={`/tools/${tool.id}`} className="font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                        {tool.name}
                      </Link>
                      <p className="text-xs text-gray-400">{tool.category_id?.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <PricingBadge pricingType={tool.pricing_type} />
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
                {/* Reasoning */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-indigo-700">
                    <span className="font-semibold">Why this tool: </span>{reasoning}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/tools/${tool.id}`}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View details →
                  </Link>
                  {tool.website_url && (
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Visit website ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setResults(null); setTask('') }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  )
}
