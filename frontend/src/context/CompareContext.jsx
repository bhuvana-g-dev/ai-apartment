import { createContext, useContext, useState, useCallback } from 'react'

const MAX_COMPARE = 4
const STORAGE_KEY = 'ai_apartment_compare'

function readStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [compareSet, setCompareSet] = useState(() => readStorage())

  const addToCompare = useCallback((id) => {
    setCompareSet(prev => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev
      const updated = [...prev, id]
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromCompare = useCallback((id) => {
    setCompareSet(prev => {
      const updated = prev.filter(cid => cid !== id)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearCompare = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setCompareSet([])
  }, [])

  const isInCompare = useCallback((id) => {
    return compareSet.includes(id)
  }, [compareSet])

  return (
    <CompareContext.Provider value={{ compareSet, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}

export default CompareContext
