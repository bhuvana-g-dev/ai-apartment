export function SkeletonToolCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
          <div className="h-3 skeleton-shimmer rounded-lg w-1/2" />
        </div>
        <div className="w-6 h-6 rounded-full skeleton-shimmer" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 skeleton-shimmer rounded-lg w-full" />
        <div className="h-3 skeleton-shimmer rounded-lg w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-20 skeleton-shimmer rounded-full" />
        <div className="h-5 w-12 skeleton-shimmer rounded-full" />
      </div>
      <div className="h-8 skeleton-shimmer rounded-lg w-full" />
    </div>
  )
}

export function SkeletonCategoryCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 flex flex-col items-center overflow-hidden">
      <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
      <div className="h-3 skeleton-shimmer rounded-lg w-16" />
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div className="space-y-4 text-center py-8">
      <div className="w-24 h-24 skeleton-shimmer rounded-2xl mx-auto" />
      <div className="h-10 skeleton-shimmer rounded-xl w-64 mx-auto" />
      <div className="h-5 skeleton-shimmer rounded-lg w-48 mx-auto" />
      <div className="h-12 skeleton-shimmer rounded-xl max-w-xl mx-auto" />
    </div>
  )
}
