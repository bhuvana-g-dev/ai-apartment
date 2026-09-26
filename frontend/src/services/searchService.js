import api from './api.js'

export async function searchTools(query, params = {}) {
  const response = await api.get('/tools/search', {
    params: { q: query, ...params },
  })
  return response.data
}
