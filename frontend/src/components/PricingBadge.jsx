const BADGE_STYLES = {
  'Completely Free': 'bg-green-100 text-green-800 border-green-200',
  'Freemium':        'bg-blue-100 text-blue-800 border-blue-200',
  'Free Trial':      'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Paid Only':       'bg-gray-100 text-gray-700 border-gray-200',
}

export default function PricingBadge({ pricingType }) {
  const style = BADGE_STYLES[pricingType] || 'bg-gray-100 text-gray-700 border-gray-200'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {pricingType}
    </span>
  )
}
