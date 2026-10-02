import { createContext, useContext, useState, useCallback } from 'react'

const MAX_COMPARE = 4
const STORAGE_KEY = 'ai_apartment_compare'

function readStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string')) {
      return parsed.slice(0, MAX_COMPARE)
    }
    return []
  } catch { return [] }
}

function readNames() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY + '_names')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [compareSet, setCompareSet] = useState(() => readStorage())
  // toolNames: { [id]: name } — stored so the tray can show names
  const [toolNames, setToolNames] = useState(() => readNames())

  const addToCompare = useCallback((id, name) => {
    setCompareSet(prev => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev
      const updated = [...prev, id]
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    if (name) {
      setToolNames(prev => {
        const updated = { ...prev, [id]: name }
        sessionStorage.setItem(STORAGE_KEY + '_names', JSON.stringify(updated))
        return updated
      })
    }
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
    sessionStorage.removeItem(STORAGE_KEY + '_names')
    setCompareSet([])
    setToolNames({})
  }, [])

  const isInCompare = useCallback((id) => compareSet.includes(id), [compareSet])

  return (
    <CompareContext.Provider value={{
      compareSet,
      toolNames,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    }}>
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
