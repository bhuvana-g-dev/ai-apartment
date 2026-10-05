/* ── Skeleton cards — layout matches real cards exactly ── */

export function SkeletonToolCard() {
  return (
    <div role="status" aria-label="Loading" className="bg-white/80 border border-white/60 rounded-2xl overflow-hidden flex flex-col shadow-sm">
      {/* accent stripe */}
      <div className="h-1 w-full skeleton-shimmer" />
      <div className="p-4 pb-3 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
          <div className="h-3 skeleton-shimmer rounded-lg w-1/2" />
        </div>
        <div className="w-4 h-4 rounded-full skeleton-shimmer" />
      </div>
      <div className="px-4 pb-3 space-y-1.5">
        <div className="h-3 skeleton-shimmer rounded-lg w-full" />
        <div className="h-3 skeleton-shimmer rounded-lg w-5/6" />
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <div className="h-5 w-24 skeleton-shimmer rounded-full" />
        <div className="h-5 w-12 skeleton-shimmer rounded-full" />
      </div>
      <div className="mt-auto px-4 pb-4 pt-1 border-t border-gray-50">
        <div className="h-7 skeleton-shimmer rounded-lg w-full" />
      </div>
    </div>
  )
}

/* Matches CategoryCard: horizontal icon + text + arrow */
export function SkeletonCategoryCard() {
  return (
    <div role="status" aria-label="Loading" className="bg-white/80 border border-white/60 rounded-2xl p-5 flex items-start gap-4 overflow-hidden">
      <div className="w-12 h-12 rounded-2xl skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
        <div className="h-3 skeleton-shimmer rounded-lg w-full" />
        <div className="h-3 skeleton-shimmer rounded-lg w-2/3" />
      </div>
      <div className="w-7 h-7 rounded-full skeleton-shimmer shrink-0" />
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div role="status" aria-label="Loading" className="space-y-4 text-center py-8">
      <div className="w-16 h-16 skeleton-shimmer rounded-2xl mx-auto" />
      <div className="h-10 skeleton-shimmer rounded-xl w-56 mx-auto" />
      <div className="h-5 skeleton-shimmer rounded-lg w-40 mx-auto" />
      <div className="h-12 skeleton-shimmer rounded-xl max-w-lg mx-auto" />
    </div>
  )
}
