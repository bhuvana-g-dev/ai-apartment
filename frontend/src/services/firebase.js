// Firebase client SDK — auth only
// Credentials are public (Firebase client config is designed to be public)
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
}

// Only initialise if config is present
let app = null
let auth = null

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth }

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase Auth not configured. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID.')
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signOutUser() {
  if (auth) await signOut(auth)
}

export function onAuthChange(callback) {
  if (!auth) { callback(null); return () => {} }
  return onAuthStateChanged(auth, callback)
}
