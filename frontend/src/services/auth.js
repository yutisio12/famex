import api from './api'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  face_login: async (credentials) => {
    const response = await api.post('/auth/face_login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  profile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  update_profile: async (formData) => {
    const response = await api.patch('/auth/update_profile', formData)
    return response.data
  },

  update_password: async (formData) => {
    const response = await api.patch('/auth/update_password', formData)
    return response.data
  },

}