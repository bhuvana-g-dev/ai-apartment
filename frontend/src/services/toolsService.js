import api from './api.js'

export async function getTools(params = {}) {
  const response = await api.get('/tools', { params })
  return response.data
}

export async function getToolById(toolId) {
  const response = await api.get(`/tools/${toolId}`)
  return response.data
}

export async function getToolsByCategory(categoryId, params = {}) {
  const response = await api.get(`/categories/${categoryId}/tools`, { params })
  return response.data
}
