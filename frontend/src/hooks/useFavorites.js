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
    const current = readFromStorage()
    if (current.includes(id)) return { success: true }
    if (current.length >= MAX_FAVORITES) {
      return { success: false, reason: 'limit_reached' }
    }
    const updated = [id, ...current]
    writeToStorage(updated)
    setFavorites(updated)
    return { success: true }
  }, [])

  const removeFavorite = useCallback((id) => {
    const updated = readFromStorage().filter(fid => fid !== id)
    writeToStorage(updated)
    setFavorites(updated)
  }, [])

  const isFavorite = useCallback((id) => {
    return readFromStorage().includes(id)
  }, [])

  const clearFavorites = useCallback(() => {
    writeToStorage([])
    setFavorites([])
  }, [])

  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }
}
