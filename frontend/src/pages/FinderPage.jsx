import { useState } from 'react'
import { findToolsForTask } from '../services/finderService.js'
import { Link } from 'react-router-dom'
import PricingBadge from '../components/PricingBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useCompare } from '../context/CompareContext.jsx'

const TASK_OPTIONS = [
  { id: 'image',    label: 'Create an image',      icon: '🎨', hint: 'generate or edit images' },
  { id: 'video',    label: 'Generate a video',      icon: '🎬', hint: 'text or image to video' },
  { id: 'write',    label: 'Write content',         icon: '✍️', hint: 'blogs, emails, copy' },
  { id: 'code',     label: 'Build / code',          icon: '💻', hint: 'apps, websites, scripts' },
  { id: 'research', label: 'Research & analyse',    icon: '🔬', hint: 'papers, facts, data' },
  { id: 'voice',    label: 'Voice / audio',         icon: '🎤', hint: 'TTS, transcription, cloning' },
  { id: 'music',    label: 'Create music',          icon: '🎵', hint: 'songs, soundtracks, beats' },
  { id: 'chat',     label: 'Chat & Q&A',            icon: '💬', hint: 'assistants, reasoning' },
  { id: 'document', label: 'Work with documents',   icon: '📄', hint: 'PDFs, summaries, Q&A' },
  { id: 'translate', label: 'Translate',            icon: '🌐', hint: 'multilingual content' },
  { id: 'design',   label: 'Design & UI',           icon: '🖌️', hint: 'logos, wireframes, UI' },
  { id: 'automate', label: 'Automate a task',       icon: '🤖', hint: 'agents, workflows, APIs' },
]

const TASK_PROMPTS = {
  image:    'I want to generate an image',
  video:    'I want to create a video',
  write:    'I want to write content',
  code:     'I want to build an application',
  research: 'I want to research a topic',
  voice:    'I want to create voice audio',
  music:    'I want to create music',
  chat:     'I want an AI assistant for Q&A',
  document: 'I want to analyse documents',
  translate:'I want to translate content',
  design:   'I want to create a design',
  automate: 'I want to automate a task',
}

export default function FinderPage() {
  const [step, setStep] = useState('task')       // 'task' | 'requirements' | 'results'
  const [selectedTask, setSelectedTask] = useState(null)
  const [budget, setBudget] = useState('any')    // 'free' | 'freemium' | 'any'
  const [needApi, setNeedApi] = useState(false)
  const [noWatermark, setNoWatermark] = useState(false)
  const [customTask, setCustomTask] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { compareSet, addToCompare, isInCompare } = useCompare()

  function buildTaskString() {
    const base = selectedTask ? TASK_PROMPTS[selectedTask] : customTask.trim()
    const parts = [base]
    if (budget === 'free') parts.push('for completely free')
    else if (budget === 'freemium') parts.push('with a free tier')
    if (needApi) parts.push('with API access')
    if (noWatermark) parts.push('without watermark')
    return parts.join(' ')
  }

  async function handleFind() {
    const taskStr = buildTaskString()
    if (!taskStr.trim()) return
    setStep('results')
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await findToolsForTask(taskStr)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to find tools.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep('task')
    setSelectedTask(null)
    setBudget('any')
    setNeedApi(false)
    setNoWatermark(false)
    setCustomTask('')
    setResults(null)
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900">AI Finder</h1>
        <p className="text-gray-400 text-sm">Tell us what you want to do — we'll find the right tools.</p>
      </div>

      {/* Progress */}
      {step !== 'results' && (
        <div className="flex items-center gap-2">
          {['task', 'requirements'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-indigo-600 text-white' : i < ['task','requirements'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i + 1}
              </div>
              {i < 1 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-2">
            {step === 'task' ? 'What do you want to do?' : 'Your requirements'}
          </span>
        </div>
      )}

      {/* Step 1 — Task selection */}
      {step === 'task' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">What do you want to do?</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TASK_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedTask(opt.id === selectedTask ? null : opt.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedTask === opt.id
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl shrink-0">{opt.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 leading-tight">{opt.label}</div>
                  <div className="text-xs text-gray-400 truncate">{opt.hint}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Or describe your task</p>
            <textarea
              value={customTask}
              onChange={e => { setCustomTask(e.target.value); setSelectedTask(null) }}
              placeholder="e.g. I want to create a 30-second cinematic video from an image for free without a watermark..."
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <button
            onClick={() => setStep('requirements')}
            disabled={!selectedTask && !customTask.trim()}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next: Set requirements →
          </button>
        </div>
      )}

      {/* Step 2 — Requirements */}
      {step === 'requirements' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Your requirements</h2>
            <button onClick={() => setStep('task')} className="text-xs text-gray-400 hover:text-indigo-600">
              ← Change task
            </button>
          </div>

          {/* Selected task preview */}
          {selectedTask && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
              <span>{TASK_OPTIONS.find(t => t.id === selectedTask)?.icon}</span>
              <span>{TASK_OPTIONS.find(t => t.id === selectedTask)?.label}</span>
            </div>
          )}

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Budget</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'free',     label: 'Free only',    icon: '🆓', desc: 'No payment at all' },
                { value: 'freemium', label: 'Has free tier', icon: '✅', desc: 'Free tier available' },
                { value: 'any',      label: 'Any',          icon: '💳', desc: 'Including paid' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    budget === opt.value ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="text-lg mb-1">{opt.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setNeedApi(!needApi)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                  needApi ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 group-hover:border-indigo-300'
                }`}
              >
                {needApi && <span className="text-white text-xs">✓</span>}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">I need API access</div>
                <div className="text-xs text-gray-400">To integrate into my own app or workflow</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setNoWatermark(!noWatermark)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                  noWatermark ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 group-hover:border-indigo-300'
                }`}
              >
                {noWatermark && <span className="text-white text-xs">✓</span>}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">No watermark acceptable</div>
                <div className="text-xs text-gray-400">Output must be clean, without branding</div>
              </div>
            </label>
          </div>

          <button
            onClick={handleFind}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            🔍 Find matching tools
          </button>
        </div>
      )}

      {/* Step 3 — Results */}
      {step === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              {loading ? 'Finding tools...' : results ? `${results.recommendations.length} tools found` : 'Results'}
            </h2>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
              ← Start over
            </button>
          </div>

          {/* Query summary */}
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 space-x-2">
            <span className="font-medium text-gray-700">Task:</span>
            <span>{buildTaskString()}</span>
            {results?.reasoning_source === 'gemini' && (
              <span className="text-indigo-500 font-medium ml-2">· AI-powered reasoning</span>
            )}
          </div>

          {loading && <LoadingSpinner label="Analysing your task..." />}
          {error && <ErrorMessage message={error} />}

          {results && results.recommendations.length === 0 && (
            <div className="text-center py-10 space-y-3">
              <div className="text-4xl">😔</div>
              <p className="text-gray-500 text-sm">No tools matched your requirements. Try relaxing the filters.</p>
              <button onClick={() => setStep('requirements')} className="text-indigo-600 text-sm hover:underline">
                ← Adjust requirements
              </button>
            </div>
          )}

          {results?.recommendations.length > 0 && (
            <div className="space-y-3">
              {results.recommendations.map(({ tool, reasoning }, idx) => {
                const inCompare = isInCompare(tool.id)
                const icon = { 'chat-ai':'💬','writing-ai':'✍️','research-ai':'🔬','image-generation':'🎨','video-generation':'🎬','voice-audio':'🎤','music-generation':'🎵','coding-ai':'💻','design-ai':'🖌️','productivity-ai':'⚡','document-ai':'📄','translation-ai':'🌐','ai-agents':'🤖','ai-api-providers':'⚙️' }[tool.category_id] || '🤖'

                return (
                  <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-md hover:border-indigo-200 transition-all">
                    {/* Tool header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-base shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xl">{icon}</span>
                        <div>
                          <Link to={`/tools/${tool.id}`} className="font-semibold text-gray-900 hover:text-indigo-700 transition-colors">
                            {tool.name}
                          </Link>
                          <p className="text-xs text-gray-400 capitalize">{tool.category_id?.replace(/-/g, ' ')}</p>
                        </div>
                      </div>
                      <PricingBadge pricingType={tool.pricing_type} />
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>

                    {/* Reasoning */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-indigo-700 leading-relaxed">
                        <span className="font-semibold">Why: </span>{reasoning}
                      </p>
                    </div>

                    {/* Quick facts */}
                    <div className="flex flex-wrap gap-2">
                      {tool.free_availability && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Has free tier</span>}
                      {tool.api_available && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">API</span>}
                      {tool.free_tier_details?.has_watermark === false && <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">No watermark</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <Link to={`/tools/${tool.id}`} className="text-xs text-indigo-600 hover:underline font-medium">
                        View details →
                      </Link>
                      {tool.website_url && (
                        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600">
                          Visit site ↗
                        </a>
                      )}
                      <button
                        onClick={() => !inCompare && compareSet.length < 4 && addToCompare(tool.id)}
                        disabled={inCompare || compareSet.length >= 4}
                        className={`ml-auto text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          inCompare ? 'border-indigo-200 text-indigo-600 bg-indigo-50' : compareSet.length >= 4 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                      >
                        {inCompare ? '✓ Comparing' : '⊕ Compare'}
                      </button>
                    </div>
                  </div>
                )
              })}

              {compareSet.length >= 2 && (
                <Link
                  to="/compare"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Compare selected tools ({compareSet.length}) →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
