import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, signInWithGoogle, signOutUser } from '../services/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u))
    return unsub
  }, [])

  async function login() {
    try {
      await signInWithGoogle()
    } catch (e) {
      // User closed popup or auth not configured — silent fail
      console.warn('Sign-in cancelled or unavailable:', e.message)
    }
  }

  async function logout() {
    await signOutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
