import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ai_apartment_favorites'
const MAX_FAVORITES = 500

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFromStorage())

  const addFavorite = useCallback((id) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev
      if (prev.length >= MAX_FAVORITES) return prev
      const updated = [id, ...prev]
      writeToStorage(updated)
      return updated
    })
    const current = readFromStorage()
    if (current.includes(id)) return { success: true }
    if (current.length >= MAX_FAVORITES) return { success: false, reason: 'limit_reached' }
    return { success: true }
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const updated = prev.filter(fid => fid !== id)
      writeToStorage(updated)
      return updated
    })
  }, [])

  // Uses state — no localStorage read on every call
  const isFavorite = useCallback((id) => {
    return favorites.includes(id)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    writeToStorage([])
    setFavorites([])
  }, [])

  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }
}
