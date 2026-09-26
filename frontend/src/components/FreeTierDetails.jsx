export default function FreeTierDetails({ details, freeAvailability, pricingType }) {
  if (!freeAvailability) return null

  const hasContent = details && Object.values(details).some(v => v !== null && v !== undefined)

  if (!hasContent && (pricingType === 'Freemium' || pricingType === 'Free Trial')) {
    return (
      <div className="text-xs text-gray-400 italic">
        Free-tier restriction details unavailable
      </div>
    )
  }

  if (!details) return null

  const rows = [
    { label: 'Credits',              value: details.credits },
    { label: 'Generation limit',     value: details.generation_limit },
    { label: 'Daily limit',          value: details.daily_limit },
    { label: 'Monthly limit',        value: details.monthly_limit },
    { label: 'Watermark',            value: details.has_watermark === true ? 'Yes' : details.has_watermark === false ? 'No' : null },
    { label: 'Watermark details',    value: details.watermark_details },
    { label: 'Feature restrictions', value: details.feature_restrictions },
    { label: 'API restrictions',     value: details.api_restrictions },
    { label: 'Commercial use',       value: details.commercial_use_allowed === true ? 'Allowed' : details.commercial_use_allowed === false ? 'Not allowed' : null },
  ].filter(r => r.value !== null && r.value !== undefined)

  if (rows.length === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Free tier limits</p>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex gap-2 text-xs">
          <span className="text-gray-500 min-w-32">{label}:</span>
          <span className="text-gray-800">{String(value)}</span>
        </div>
      ))}
    </div>
  )
}
