import api from './api.js'

export async function findToolsForTask(task) {
  const response = await api.post('/finder', { task })
  return response.data
}
