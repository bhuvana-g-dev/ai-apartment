import { useEffect, useState } from 'react'
import { getTools, getToolById, createTool, updateTool } from '../services/toolsService.js'
import { getCategories } from '../services/categoriesService.js'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import PricingBadge from '../components/PricingBadge.jsx'

const PRICING_TYPES = ['Completely Free', 'Freemium', 'Free Trial', 'Paid Only']

const EMPTY_FORM = {
  name: '',
  description: '',
  category_id: '',
  website_url: '',
  pricing_type: 'Freemium',
  free_availability: false,
  api_available: false,
  capabilities: '',
  input_types: '',
  output_types: '',
  best_use_cases: '',
  limitations: '',
  watermark_info: '',
  verified_date: new Date().toISOString().split('T')[0],
  active: true,
}

function parseList(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

function toolToForm(tool) {
  return {
    name: tool.name || '',
    description: tool.description || '',
    category_id: tool.category_id || '',
    website_url: tool.website_url || '',
    pricing_type: tool.pricing_type || 'Freemium',
    free_availability: tool.free_availability || false,
    api_available: tool.api_available || false,
    capabilities: (tool.capabilities || []).join(', '),
    input_types: (tool.input_types || []).join(', '),
    output_types: (tool.output_types || []).join(', '),
    best_use_cases: (tool.best_use_cases || []).join(', '),
    limitations: (tool.limitations || []).join(', '),
    watermark_info: tool.watermark_info || '',
    verified_date: tool.verified_date || new Date().toISOString().split('T')[0],
    active: tool.active !== false,
  }
}

function formToPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    category_id: form.category_id,
    website_url: form.website_url.trim(),
    pricing_type: form.pricing_type,
    free_availability: form.free_availability,
    api_available: form.api_available,
    capabilities: parseList(form.capabilities),
    input_types: parseList(form.input_types),
    output_types: parseList(form.output_types),
    best_use_cases: parseList(form.best_use_cases),
    limitations: parseList(form.limitations),
    watermark_info: form.watermark_info.trim() || null,
    verified_date: form.verified_date,
    active: form.active,
    free_tier_details: null,
  }
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Required'
  if (!form.description.trim()) errors.description = 'Required'
  if (!form.category_id) errors.category_id = 'Required'
  if (!form.website_url.trim()) errors.website_url = 'Required'
  if (!form.verified_date) errors.verified_date = 'Required'
  return errors
}

// Tool Form Modal
function ToolFormModal({ tool, categories, onSave, onClose }) {
  const isEdit = !!tool
  const [form, setForm] = useState(isEdit ? toolToForm(tool) : EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  async function handleSave() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setSaveError(null)
    try {
      const payload = formToPayload(form)
      if (isEdit) {
        await updateTool(tool.id, payload)
      } else {
        await createTool(payload)
      }
      onSave()
    } catch (e) {
      const detail = e.response?.data?.detail
      setSaveError(typeof detail === 'string' ? detail : JSON.stringify(detail) || e.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const field = (label, key, type = 'text', hint = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )

  const listField = (label, key, hint) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder="Comma-separated values"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900">{isEdit ? `Edit: ${tool.name}` : 'Add New AI Tool'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-4">
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Tool name *', 'name')}
            {field('Website URL *', 'website_url', 'url')}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                value={form.category_id}
                onChange={e => set('category_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.category_id ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">Select category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-0.5">{errors.category_id}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pricing type *</label>
              <select
                value={form.pricing_type}
                onChange={e => set('pricing_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Verified date *', 'verified_date', 'date')}
            {field('Watermark info', 'watermark_info', 'text', 'Leave blank if none')}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.free_availability} onChange={e => set('free_availability', e.target.checked)} className="rounded text-indigo-600" />
              Has free tier
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.api_available} onChange={e => set('api_available', e.target.checked)} className="rounded text-indigo-600" />
              API available
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="rounded text-indigo-600" />
              Active (visible)
            </label>
          </div>

          {listField('Capabilities', 'capabilities', 'e.g. text generation, code generation, summarisation')}
          {listField('Input types', 'input_types', 'e.g. text, image, audio')}
          {listField('Output types', 'output_types', 'e.g. text, image, video')}
          {listField('Best use cases', 'best_use_cases', 'e.g. writing assistance, research, coding help')}
          {listField('Limitations', 'limitations', 'e.g. knowledge cutoff, free tier limits')}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add tool'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Admin Page
export default function AdminPage() {
  const [tools, setTools] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', tool }
  const LIMIT = 25

  async function load() {
    setLoading(true); setError(null)
    try {
      const [toolRes, catRes] = await Promise.all([
        getTools({ limit: LIMIT, offset }),
        getCategories(),
      ])
      setTools(toolRes.data || [])
      setTotal(toolRes.total || 0)
      setCategories(catRes.data || [])
    } catch (e) {
      setError(e.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [offset])

  function handleSaved() {
    setModal(null)
    load()
  }

  async function handleEditClick(toolId) {
    try {
      const tool = await getToolById(toolId)
      setModal({ mode: 'edit', tool })
    } catch {
      alert('Failed to load tool for editing.')
    }
  }

  const filtered = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category_id.includes(search.toLowerCase()))
    : tools

  const adminKeySet = !!(import.meta.env.VITE_ADMIN_KEY)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin — Data Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} tools · {categories.length} categories</p>
        </div>
        <div className="flex items-center gap-3">
          {!adminKeySet && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              ⚠️ Set <code>VITE_ADMIN_KEY</code> to enable write operations
            </span>
          )}
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Add tool
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 space-y-1">
        <p className="font-semibold">⚠️ MVP security note</p>
        <p>Admin operations use a shared <code>ADMIN_API_KEY</code> header. This is sufficient for an MVP but should be replaced with proper authentication (Firebase Auth + role claims) before production public launch.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total tools', value: total, color: 'text-indigo-600' },
          { label: 'Categories', value: categories.length, color: 'text-purple-600' },
          { label: 'Has free tier', value: tools.filter(t => t.free_availability).length, color: 'text-green-600' },
          { label: 'API available', value: tools.filter(t => t.api_available).length, color: 'text-blue-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by name or category..."
          className="flex-1 max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="text-xs text-gray-400">{filtered.length} shown</span>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Tool</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Pricing</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Verified</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Active</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tool => (
                  <tr key={tool.id} className={`hover:bg-gray-50 transition-colors ${!tool.active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{tool.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-48">{tool.id}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 capitalize">{tool.category_id?.replace(/-/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <PricingBadge pricingType={tool.pricing_type} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-400">{tool.verified_date}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-medium ${tool.active ? 'text-green-600' : 'text-gray-400'}`}>
                        {tool.active ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(tool.id)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                        <Link to={`/tools/${tool.id}`} className="text-xs text-gray-400 hover:underline">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > LIMIT && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}</span>
              <div className="flex gap-2">
                <button onClick={() => setOffset(Math.max(0, offset - LIMIT))} disabled={offset === 0}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                <button onClick={() => setOffset(offset + LIMIT)} disabled={offset + LIMIT >= total}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Categories ({categories.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map(cat => (
                <Link key={cat.id} to={`/categories/${cat.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs hover:border-indigo-300 transition-colors">
                  <div className="font-medium text-gray-700">{cat.name}</div>
                  <div className="text-gray-400">{cat.slug}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {modal && (
        <ToolFormModal
          tool={modal.mode === 'edit' ? modal.tool : null}
          categories={categories}
          onSave={handleSaved}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
