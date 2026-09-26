export default function VerifiedDateBadge({ date }) {
  if (!date) return null
  const verifiedMs = new Date(date).getTime()
  const nowMs = Date.now()
  const diffDays = (nowMs - verifiedMs) / (1000 * 60 * 60 * 24)
  const isStale = diffDays > 90

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">
        Last verified: <span className="font-medium">{date}</span>
      </span>
      {isStale && (
        <span className="text-xs text-amber-600 font-medium">
          ⚠ Information may be outdated — pricing changes frequently
        </span>
      )}
    </div>
  )
}
