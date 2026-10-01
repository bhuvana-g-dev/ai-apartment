import {
  MessageCircle, PenLine, Search, Image, Video, Mic,
  Music, Code2, Palette, LayoutGrid, FileText, Globe,
  Bot, Cpu, Sparkles
} from 'lucide-react'

const ICON_MAP = {
  'chat-ai':          MessageCircle,
  'writing-ai':       PenLine,
  'research-ai':      Search,
  'image-generation': Image,
  'video-generation': Video,
  'voice-audio':      Mic,
  'music-generation': Music,
  'coding-ai':        Code2,
  'design-ai':        Palette,
  'productivity-ai':  LayoutGrid,
  'document-ai':      FileText,
  'translation-ai':   Globe,
  'ai-agents':        Bot,
  'ai-api-providers': Cpu,
}

const COLOR_MAP = {
  'chat-ai':          'text-blue-600 bg-blue-50',
  'writing-ai':       'text-violet-600 bg-violet-50',
  'research-ai':      'text-cyan-600 bg-cyan-50',
  'image-generation': 'text-pink-600 bg-pink-50',
  'video-generation': 'text-red-600 bg-red-50',
  'voice-audio':      'text-orange-600 bg-orange-50',
  'music-generation': 'text-green-600 bg-green-50',
  'coding-ai':        'text-slate-600 bg-slate-50',
  'design-ai':        'text-fuchsia-600 bg-fuchsia-50',
  'productivity-ai':  'text-yellow-600 bg-yellow-50',
  'document-ai':      'text-teal-600 bg-teal-50',
  'translation-ai':   'text-indigo-600 bg-indigo-50',
  'ai-agents':        'text-gray-600 bg-gray-100',
  'ai-api-providers': 'text-emerald-600 bg-emerald-50',
}

export function getCategoryColor(slug) {
  return COLOR_MAP[slug] || 'text-gray-500 bg-gray-50'
}

export default function CategoryIcon({ slug, size = 20, className = '' }) {
  const Icon = ICON_MAP[slug] || Sparkles
  const colorClass = COLOR_MAP[slug] || 'text-gray-500 bg-gray-50'
  return <Icon size={size} className={`${colorClass.split(' ')[0]} ${className}`} />
}
