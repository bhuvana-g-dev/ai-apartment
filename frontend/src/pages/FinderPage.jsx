import { useState } from 'react'
import { findToolsForTask } from '../services/finderService.js'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import PricingBadge from '../components/PricingBadge.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import {
  Search, Image, Video, PenLine, Code2, Mic,
  Bot, Layers, ArrowRight, ChevronRight, ExternalLink,
  CheckCircle, AlertCircle, XCircle, Sparkles, RotateCcw
} from 'lucide-react'

// ── Task options ──────────────────────────────────────────────
const TASKS = [
  { id: 'image',    label: 'Create Images',     icon: Image,    hint: 'image generation, editing, design' },
  { id: 'video',    label: 'Generate Video',     icon: Video,    hint: 'text-to-video, animation' },
  { id: 'write',    label: 'Write Content',      icon: PenLine,  hint: 'blogs, emails, copy, scripts' },
  { id: 'code',     label: 'Write Code',         icon: Code2,    hint: 'apps, scripts, debugging' },
  { id: 'research', label: 'Research a Topic',   icon: Search,   hint: 'papers, facts, summaries' },
  { id: 'audio',    label: 'Generate Audio',     icon: Mic,      hint: 'voice, music, TTS' },
  { id: 'automate', label: 'Automate a Task',    icon: Bot,      hint: 'agents, workflows, APIs' },
  { id: 'api',      label: 'Integrate AI (API)', icon: Layers,   hint: 'developer APIs, SDKs' },
]

const TASK_PROMPTS = {
  image:    'I want to generate or edit images',
  video:    'I want to create a video',
  write:    'I want to write content',
  code:     'I want to write code or build an app',
  research: 'I want to research a topic',
  audio:    'I want to generate audio or voice',
  automate: 'I want to automate a task with an AI agent',
  api:      'I want to integrate AI via an API',
}

// ── Result card ───────────────────────────────────────────────
function FinisherResultCard({ item, rank }) {
  const { tool, reasoning } = item
  const { compareSet, addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const inCompare = isInCompare(tool.id)
  const favd = isFavorite(tool.id)
  const ft = tool.free_tier_details

  // Derive key signals
  const signals = []
  if (tool.free_availability) {
    const limit = ft?.daily_limit || ft?.monthly_limit || ft?.credits
    signals.push({ type: 'good', text: limit ? `Free tier: ${limit}` : 'Free tier available' })
  }
  if (tool.api_available) signals.push({ type: 'good', text: 'API available' })
  if (ft?.has_watermark === true) signals.push({ type: 'warn', text: 'Adds watermark on free tier' })
  if (ft?.commercial_use_allowed === false) signals.push({ type: 'warn', text: 'No commercial use on free' })
  if (tool.pricing_type === 'Paid Only') signals.push({ type: 'info', text: 'No free tier' })

  const SignalIcon = ({ type }) => {
    if (type === 'good') return <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
    if (type === 'warn') return <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
    return <XCircle size={12} className="text-gray-400 shrink-0 mt-0.5" />
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-indigo-600">#{rank}</span>
          </div>

          {/* Name + category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CategoryIcon slug={tool.category_id} size={16} />
              <Link
                to={`/tools/${tool.id}`}
                className="font-bold text-gray-900 hover:text-indigo-700 transition-colors"
              >
                {tool.name}
              </Link>
            </div>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {tool.category_id?.replace(/-/g, ' ')}
            </p>
          </div>

          {/* Pricing + favorite */}
          <div className="flex items-center gap-2 shrink-0">
            <PricingBadge pricingType={tool.pricing_type} />
            <button
              onClick={() => favd ? removeFavorite(tool.id) : addFavorite(tool.id)}
              className="text-gray-300 hover:text-red-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill={favd ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${favd ? 'text-red-500' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{tool.description}</p>

        {/* Signals */}
        {signals.length > 0 && (
          <div className="mt-3 space-y-1">
            {signals.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <SignalIcon type={s.type} />
                <span className="text-xs text-gray-600">{s.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why it matches */}
      {reasoning && (
        <div className="mx-5 mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-700">Why it matches</span>
          </div>
          <p className="text-xs text-indigo-700 leading-relaxed">{reasoning}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <Link
          to={`/tools/${tool.id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View Details
        </Link>
        {tool.website_url && (
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <ExternalLink size={12} /> Visit
          </a>
        )}
        <button
          onClick={() => inCompare ? removeFromCompare(tool.id) : (compareSet.length < 4 && addToCompare(tool.id, tool.name))}
          disabled={!inCompare && compareSet.length >= 4}
          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
            inCompare
              ? 'bg-indigo-600 text-white border-indigo-600'
              : compareSet.length >= 4
                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {inCompare ? '✓ Compare' : '+ Compare'}
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function FinderPage() {
  const [step, setStep] = useState('task')       // 'task' | 'requirements' | 'results'
  const [selectedTask, setSelectedTask] = useState(null)
  const [budget, setBudget] = useState('any')
  const [needApi, setNeedApi] = useState(false)
  const [noWatermark, setNoWatermark] = useState(false)
  const [customTask, setCustomTask] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { compareSet } = useCompare()

  function buildTaskString() {
    const base = selectedTask ? TASK_PROMPTS[selectedTask] : customTask.trim()
    const parts = [base]
    if (budget === 'free') parts.push('completely free, no payment required')
    else if (budget === 'freemium') parts.push('with a free tier available')
    if (needApi) parts.push('with API access for integration')
    if (noWatermark) parts.push('without adding a watermark')
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
      const msg = err.response?.status === 503
        ? 'The AI Finder service is starting up. Please wait a moment and try again.'
        : err.message || 'Could not find tools right now.'
      setError(msg)
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
    <div className="max-w-2xl mx-auto space-y-8 pb-16">

      {/* Page header */}
      <div className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 text-indigo-600 text-sm font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
          <Search size={14} /> AI Finder
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Find the right AI tool</h1>
        <p className="text-gray-400 text-sm">
          Tell us what you want to do — we'll match tools to your exact requirements.
        </p>
      </div>

      {/* Step indicator */}
      {step !== 'results' && (
        <div className="flex items-center gap-2 max-w-xs mx-auto">
          {[
            { id: 'task', label: 'Task' },
            { id: 'requirements', label: 'Requirements' },
          ].map((s, i) => {
            const isActive = step === s.id
            const isDone = (s.id === 'task' && step === 'requirements')
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone ? 'bg-green-500 text-white' :
                    isActive ? 'bg-indigo-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
              </div>
            )
          })}
        </div>
      )}

      {/* ── STEP 1: Task ── */}
      {step === 'task' && (
        <div className="space-y-5">
          <h2 className="font-semibold text-gray-900">What do you want to do?</h2>

          <div className="grid grid-cols-2 gap-2.5">
            {TASKS.map(({ id, label, icon: Icon, hint }) => (
              <button
                key={id}
                onClick={() => { setSelectedTask(id === selectedTask ? null : id); setCustomTask('') }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selectedTask === id
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedTask === id ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <Icon size={16} className={selectedTask === id ? 'text-indigo-600' : 'text-gray-500'} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 leading-tight">{label}</div>
                  <div className="text-xs text-gray-400 truncate">{hint}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Or describe in your own words</p>
            <textarea
              value={customTask}
              onChange={e => { setCustomTask(e.target.value); setSelectedTask(null) }}
              placeholder="e.g. I need a free AI to create YouTube thumbnails without watermarks..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
            />
            {customTask && <p className="text-xs text-gray-400 text-right">{customTask.length}/500</p>}
          </div>

          <button
            onClick={() => setStep('requirements')}
            disabled={!selectedTask && !customTask.trim()}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Set requirements <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── STEP 2: Requirements ── */}
      {step === 'requirements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your requirements</h2>
            <button onClick={() => setStep('task')} className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
              ← Change task
            </button>
          </div>

          {/* Task summary */}
          <div className="flex items-center gap-2.5 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
            {selectedTask && (
              <>
                {(() => { const t = TASKS.find(t => t.id === selectedTask); return t ? <t.icon size={16} className="text-indigo-600 shrink-0" /> : null })()}
              </>
            )}
            <span className="text-sm text-indigo-800 font-medium">
              {selectedTask ? TASKS.find(t => t.id === selectedTask)?.label : customTask.slice(0, 60) + (customTask.length > 60 ? '…' : '')}
            </span>
          </div>

          {/* Budget */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-gray-700">Budget</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: 'free',     label: 'Free only',     desc: 'No payment ever', icon: '🆓' },
                { value: 'freemium', label: 'Has free tier', desc: 'Paid options OK',  icon: '✅' },
                { value: 'any',      label: 'Any budget',    desc: 'Show all',         icon: '💳' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    budget === opt.value
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-100 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="text-base mb-0.5">{opt.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Extra requirements */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Additional requirements</label>
            {[
              { state: needApi, setState: setNeedApi, label: 'I need API access', desc: 'For app/workflow integration' },
              { state: noWatermark, setState: setNoWatermark, label: 'No watermark on output', desc: 'Clean output required' },
            ].map(({ state, setState, label, desc }) => (
              <button
                key={label}
                onClick={() => setState(!state)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  state ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-200'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  state ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                }`}>
                  {state && <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleFind}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} /> Find matching tools
          </button>
        </div>
      )}

      {/* ── STEP 3: Results ── */}
      {step === 'results' && (
        <div className="space-y-5">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">
                {loading ? 'Finding tools…' : results ? `${results.recommendations.length} tool${results.recommendations.length !== 1 ? 's' : ''} matched` : 'Results'}
              </h2>
              {results?.reasoning_source === 'gemini' && (
                <p className="text-xs text-indigo-500 mt-0.5 flex items-center gap-1">
                  <Sparkles size={10} /> AI-powered reasoning
                </p>
              )}
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors">
              <RotateCcw size={12} /> Start over
            </button>
          </div>

          {/* Task summary */}
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 text-xs text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-700">Your task: </span>{buildTaskString()}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-4 text-center space-y-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleFind}
                className="text-xs text-indigo-600 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* No results */}
          {results && results.recommendations.length === 0 && (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No tools matched your requirements.</p>
              <button onClick={() => setStep('requirements')} className="text-indigo-600 text-sm hover:underline">
                ← Relax requirements
              </button>
            </div>
          )}

          {/* Results list */}
          {results?.recommendations.length > 0 && (
            <div className="space-y-4">
              {results.recommendations.map((item, idx) => (
                <FinisherResultCard key={item.tool.id} item={item} rank={idx + 1} />
              ))}

              {/* Compare CTA */}
              {compareSet.length >= 2 && (
                <Link
                  to="/compare"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Compare {compareSet.length} selected tools <ArrowRight size={16} />
                </Link>
              )}

              {/* Browse more */}
              <div className="text-center">
                <Link to="/tools" className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
                  Browse all tools instead →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
