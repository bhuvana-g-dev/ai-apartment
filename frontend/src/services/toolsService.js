import api from './api.js'

const adminHeaders = () => {
  const key = import.meta.env.VITE_ADMIN_KEY || ''
  return key ? { 'X-Admin-Key': key } : {}
}

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

export async function createTool(data) {
  const response = await api.post('/tools', data, { headers: adminHeaders() })
  return response.data
}

export async function updateTool(toolId, data) {
  const response = await api.patch(`/tools/${toolId}`, data, { headers: adminHeaders() })
  return response.data
}
