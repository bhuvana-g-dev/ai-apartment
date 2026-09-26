import api from './api.js'

export async function getCategories() {
  const response = await api.get('/categories')
  return response.data
}

export async function getCategoryBySlug(slug) {
  const response = await api.get('/categories')
  const all = response.data
  const found = all.data?.find(c => c.slug === slug) || all.find?.(c => c.slug === slug)
  return found || null
}
