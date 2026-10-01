import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AI Apartment" className="w-8 h-8 rounded-xl object-cover" onError={e => e.target.style.display='none'} />
              <span className="font-bold text-gray-900">AI Apartment</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-48">
              One apartment. Different AI capabilities. Discover, compare, and find the right AI tool.
            </p>
            <div className="flex gap-1 text-xs text-gray-300">
              <span>✓ No hype</span>
              <span>·</span>
              <span>✓ Honest data</span>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/categories', label: 'Categories' },
                { to: '/tools', label: 'All Tools' },
                { to: '/finder', label: 'AI Finder' },
                { to: '/compare', label: 'Compare Tools' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Rooms</h4>
            <ul className="space-y-2">
              {[
                { to: '/categories/chat-ai', label: 'Chat AI' },
                { to: '/categories/image-generation', label: 'Image Generation' },
                { to: '/categories/coding-ai', label: 'Coding AI' },
                { to: '/categories/video-generation', label: 'Video Generation' },
                { to: '/categories/ai-api-providers', label: 'API Providers' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">About</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-400">Data verified regularly</span></li>
              <li><span className="text-sm text-gray-400">Free tier info tracked</span></li>
              <li><Link to="/admin" className="text-sm text-gray-400 hover:text-gray-600">Admin</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} AI Apartment. Built for Kiro University.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Pricing changes frequently — always check verified dates</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
