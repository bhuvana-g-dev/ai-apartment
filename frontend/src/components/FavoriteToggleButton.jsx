export default function FavoriteToggleButton({ toolId, isFavorite, onToggle }) {
  return (
    <button
      onClick={() => onToggle(toolId)}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className="text-xl transition-transform hover:scale-110 focus:outline-none"
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  )
}
