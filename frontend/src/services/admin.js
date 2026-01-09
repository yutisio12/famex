import api from './api'

export const adminService = {

  user_list: async (query) => {
    const response = await api.get('/auth/user_list', { params: query })
    return response.data
  },

}