import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ai_apartment_favorites'
const MAX_FAVORITES = 500

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : []
  } catch { return [] }
}

function writeToStorage(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch { /* quota exceeded */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFromStorage())

  const addFavorite = useCallback((id) => {
    let result = { success: false, reason: 'unknown' }
    setFavorites(prev => {
      if (prev.includes(id)) { result = { success: true }; return prev }
      if (prev.length >= MAX_FAVORITES) { result = { success: false, reason: 'limit_reached' }; return prev }
      const updated = [id, ...prev]
      writeToStorage(updated)
      result = { success: true }
      return updated
    })
    return result
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const updated = prev.filter(fid => fid !== id)
      writeToStorage(updated)
      return updated
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const clearFavorites = useCallback(() => {
    writeToStorage([])
    setFavorites([])
  }, [])

  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }
}
