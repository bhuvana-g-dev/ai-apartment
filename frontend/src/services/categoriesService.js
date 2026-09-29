import api from './api.js'

export async function getCategories() {
  const response = await api.get('/categories')
  return response.data
}

export async function getCategoryBySlug(slug) {
  try {
    // Backend now has GET /categories/{id} — slug == id for our data
    const response = await api.get(`/categories/${slug}`)
    return response.data
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}
