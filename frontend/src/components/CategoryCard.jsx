import { Link } from 'react-router-dom'
import CategoryIcon, { getCategoryColor } from './CategoryIcon.jsx'

export default function CategoryCard({ category }) {
  const colorClass = getCategoryColor(category.slug)
  const [textColor, bgColor] = colorClass.split(' ')

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
        <CategoryIcon slug={category.slug} size={22} />
      </div>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700 leading-tight text-center transition-colors">
        {category.name}
      </span>
    </Link>
  )
}
