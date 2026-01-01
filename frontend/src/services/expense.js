import api from './api'

const parseDecimal = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Hapus karakter non-numeric kecuali titik decimal
    const cleaned = value.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

export const expensesService = {
  getMyTransactional: async (params = {}) => {
    const response = await api.get('/expenses/MyTransactional', { params })
    return response.data
  },

  getAll: async (params = {}) => {
    const response = await api.get('/expenses/MyTransactional', { params })
    return response.data
  },

  create: async (formData) => {
    const response = await api.post('/expenses', formData)
    return response.data
  }
}