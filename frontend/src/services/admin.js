import api from './api'

export const adminService = {

  user_list: async (query) => {
    const response = await api.get('/auth/user_list', { params: query })
    return response.data
  },

  add_user: async (formData) => {
    const response = await api.post('/auth/register', formData)
    return response.data
  },

}