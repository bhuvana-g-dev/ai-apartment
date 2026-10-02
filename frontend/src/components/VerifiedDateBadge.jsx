import { CalendarCheck, AlertTriangle } from 'lucide-react'

export default function VerifiedDateBadge({ date }) {
  if (!date) return null

  const verifiedMs = new Date(date).getTime()
  const nowMs = Date.now()
  const diffDays = (nowMs - verifiedMs) / (1000 * 60 * 60 * 24)
  const isStale = diffDays > 90

  const formatted = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <CalendarCheck size={12} className="shrink-0" />
        <span>
          Last verified:{' '}
          <span className="font-medium text-gray-600">{formatted}</span>
        </span>
      </div>
      {isStale && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
          <AlertTriangle size={11} className="shrink-0" />
          Pricing may have changed — verify on the tool's website
        </div>
      )}
    </div>
  )
}
